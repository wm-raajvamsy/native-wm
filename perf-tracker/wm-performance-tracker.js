/*****************************************************************
 * WM Platform Patch: Performance Tracker v3.6
 *
 * Tracks component lifecycle, variable/action timings, script-level
 * variable writes, events, navigation, React state-queue events,
 * user interaction, keyboard, network, errors, scripts, and the
 * watcher / refresh System B render pipeline.
 *
 * Logs structured JSON to console tagged [WM-PERF].
 *
 * WHAT'S NEW IN v3.6
 *   - COMPONENT/RENDER bracketing BaseComponent.prototype.render.
 *     Surfaces the ~130 ms of React reconciliation / Yoga layout /
 *     bridge commit work that runs between REFRESH_END and the first
 *     componentDidMount on a new page — previously completely
 *     invisible to the tracker because forceUpdate returns 0.012 ms
 *     synchronously while React's render phase runs on the same tick.
 *     Per-widget `ms` identifies which component eats the budget.
 *
 * WHAT WAS IN v3.5
 *   - APP/REFRESH_END paired with REFRESH_START. The synchronous part
 *     of the digest (forceUpdate body) is now bracketed end-to-end with
 *     `ms`. Any gap between REFRESH_END and the next MOUNT/UPDATE or
 *     NAV/TRANSITION_END is native-thread work (Yoga layout, RN bridge
 *     UIManager commits) — not JS.
 *
 *   - NAV/TRANSITION_END fired on every page (BasePage instance) when
 *     React Navigation's 'transitionEnd' event fires. The delta from
 *     this page's MOUNT to TRANSITION_END is the pure animation cost.
 *     On JS @react-navigation/stack this runs on the JS thread; on
 *     native-stack this runs off-JS. Comparing the two answers the
 *     "where is the silent gap going?" question definitively.
 *
 * WHAT WAS IN v3.4
 *   - axios require now points at the browser build explicitly
 *     (`axios/dist/browser/axios.cjs`). The plain `require('axios')` picked
 *     the Node CJS build via conditional exports — pulling in `crypto`,
 *     `http`, `url`, `form-data`, `proxy-from-env` which Metro cannot
 *     resolve in React Native. Falls back to silent skip of HTTP/* events
 *     if the browser build path is missing.
 *
 * WHAT WAS IN v3.3
 *   - Metro bundler compatibility fix: replaced dynamic `require(modPath)`
 *     in `_patchSingleton` with string-literal requires at each call site.
 *     Metro's static dependency analyzer rejected the dynamic form with
 *     "Invalid call at line 719: require(modPath)" during release bundling.
 *
 * WHAT WAS IN v3.2
 *   Accuracy improvements aimed at matching video-recorded UI timings:
 *
 *   - TTI uses double-rAF instead of InteractionManager.
 *     `requestAnimationFrame(() => requestAnimationFrame(fn))` fires
 *     AFTER the next paint commits to the native UI thread — so TTI ms
 *     now matches "user sees pixels" within ~16ms (one frame).
 *     Previously IM-based TTI was 16–300ms late depending on queue depth.
 *
 *   - SPINNER/SHOW now logged when spinner actually appears, not at
 *     .show() call time. Mirrors the framework's internal
 *     setTimeout(this.delay). If hide() fires before the delay elapses
 *     (fast API response), both SHOW and HIDE are suppressed since the
 *     spinner was never visible.
 *
 *   - axios.create() now patched too. Per-service axios instances used
 *     by some service-variables now also emit HTTP/REQUEST/RESPONSE.
 *
 *   - NAV/DISPATCHED.ms timer started immediately before goToPage call,
 *     excluding our log overhead from the measurement.
 *
 *   - PAGE/FOCUS + NAV/FOCUS now share `pairedSeq` field — parser can
 *     dedupe paired events by joining on pairedSeq.
 *
 *   - Defensive guards on `_orig*.call()` — patch no longer breaks if a
 *     future BaseComponent variant doesn't define one of the patched
 *     methods.
 *
 *   - META/ENABLED version field corrected (was '3.0' in v3.1).
 *
 * WHAT WAS IN v3.1
 *   - `seq` field on every event — monotonic unique ID per log line.
 *     Parser can correlate paired events (e.g. NAV/FOCUS ↔ PAGE/FOCUS,
 *     SETSTATE_QUEUED ↔ COMPONENT/UPDATE) by seq instead of timestamp
 *     proximity. Two events at the same ts now always have different seq.
 *   - All duration math uses `performance.now()` (monotonic, sub-ms).
 *     `ts` stays as Date.now() for wall-clock / adb log correlation.
 *     `hts` (high-res ts) was already on every event; now all `ms` deltas
 *     are computed against hts-style monotonic clock and are immune to
 *     wall-clock skew.
 *   - Modal show-time tracking uses WeakMap — modal options objects no
 *     longer leak if hideModal isn't called with the same reference.
 *
 * WHAT WAS IN v3.0
 *
 *   System B render pipeline (the 200ms binding gap)
 *   ─────────────────────────────────────────────────
 *   - APP/REFRESH_QUEUED         appConfig.refresh() called
 *   - APP/REFRESH_START          App.forceUpdate() — actual cycle starts
 *   - WATCHER/CHECK_START/END    Watcher.check() — dirty-check duration
 *   - MEMO/WATCHER_DRIVEN_RENDER WmMemo passed SCU → render is happening
 *   - MEMO/SCU_BAIL              WmMemo SCU returned false → no render
 *
 *   Navigation paths
 *   ────────────────
 *   - NAV/PATH {branch}          goToPage 4-branch identification
 *   - NAV/NOOP                   Same-page no-op navigation
 *   - NAV/FOCUS                  Page regained focus without remount
 *
 *   User interaction
 *   ────────────────
 *   - USER/TOUCH_START / END     Tappable.onPress — real touch time
 *   - USER/LONG_TAP              Tappable.onLongTap
 *   - USER/IDLE_START / END      No user activity for N seconds
 *   - USER/BACK_PRESS            Android hardware back button
 *
 *   Input fields
 *   ────────────
 *   - INPUT/FOCUS / BLUR         BaseInput focus lifecycle
 *   - INPUT/KEYPRESS             Every keystroke (with length, updateon)
 *   - INPUT/SUBMIT               Return key
 *   - INPUT/COMMIT               Bound-var write (with source)
 *
 *   Keyboard
 *   ────────
 *   - KEYBOARD/SHOW / HIDE       Soft-keyboard appearance/dismissal
 *   - KEYBOARD/WILL_SHOW / HIDE  iOS animation-start markers
 *
 *   System & infra
 *   ──────────────
 *   - NETWORK/CHANGE             Connectivity transition
 *   - ERROR/CAUGHT               ErrorBoundary fired
 *   - HTTP/REQUEST / RESPONSE    Per-axios-call timing
 *   - SCRIPT/TIMEOUT_QUEUED / FIRED   User setTimeout via App.lib
 *   - SCRIPT/INTERVAL_QUEUED / FIRED  User setInterval via App.lib
 *
 *   Singletons (each triggers System B refresh)
 *   ───────────────────────────────────────────
 *   - SPINNER/SHOW / HIDE
 *   - MODAL/SHOW / HIDE
 *   - TOAST/SHOW / HIDE
 *   - DISPLAY/SHOW / HIDE
 *   - LOCALE/CHANGE              i18n locale change (triggers cleanRefresh)
 *   - A11Y/SCREEN_READER_CHANGED Screen reader on/off
 *
 *   Enrichment fields added
 *   ───────────────────────
 *   - hts (performance.now)      Sub-ms high-resolution timestamp
 *   - varType                    'model' | 'service' | 'live' | 'action'
 *   - kind                       'page' | 'partial' | 'prefab' on FRAGMENT_READY
 *   - trigger                    'event' | 'input' | 'binding' | 'script' on SETSTATE_QUEUED
 *   - branch                     goToPage path on NAV/PATH
 *   - wmPageStartTime / wmPageReadyTime  WM-internal diagnostics on FRAGMENT_READY
 *
 *   New public API
 *   ──────────────
 *   - WMPerf.trackApp(appInstance)    Enables REFRESH_QUEUED/START
 *   - WMPerf.trackLib(appInstance)    Enables SCRIPT/TIMEOUT/INTERVAL
 *   - WMPerf.setIdleThreshold(ms)     Configure idle detection (default 2000ms)
 *
 * CARRIED FROM v2.0
 *   - Per-instance WeakMap mount/update tracking
 *   - FIFO invoke stack per scope:name
 *   - SETSTATE_QUEUED via updateState patch
 *   - FRAGMENT_READY anchor
 *   - Hot-reload double-patch guard
 *
 * SETUP:
 *   1. Upload to Studio: resources/files/wm-performance-tracker.js
 *   2. Add at the very top of App.js:
 *        require('./assets/resources/files/wm-performance-tracker.js');
 *   3. In App.js componentDidMount:
 *        global.WMPerf && global.WMPerf.enable();
 *        global.WMPerf && global.WMPerf.trackApp(this);
 *        global.WMPerf && global.WMPerf.trackLib(this);
 *        global.WMPerf && global.WMPerf.trackAppVars(this.Variables, this.Actions);
 *
 * CAPTURE (Android):
 *   adb logcat -s ReactNativeJS | grep '\[WM-PERF\]' > perf-session.log
 *
 * PARSE:
 *   node parse-perf-log.js perf-session.log
 *****************************************************************/
(function () {
    'use strict';

    // ── Hot-reload double-patch guard ─────────────────────────────
    if (global.__wmPerfPatched) return;
    global.__wmPerfPatched = true;

    var RN = require('react-native');
    var InteractionManager = RN.InteractionManager;
    var Keyboard           = RN.Keyboard;
    var BackHandler        = RN.BackHandler;
    var AccessibilityInfo  = RN.AccessibilityInfo;
    var PlatformOS         = RN.Platform && RN.Platform.OS;

    var BaseComponent   = require('@wavemaker-ai/app-rn-runtime/core/base.component').BaseComponent;
    var BaseFragment    = require('@wavemaker-ai/app-rn-runtime/runtime/base-fragment.component').default;
    var BasePage        = require('@wavemaker-ai/app-rn-runtime/runtime/base-page.component').default;
    var VariableEvents  = require('@wavemaker-ai/app-rn-runtime/variables/base-variable').VariableEvents;

    // High-resolution clock (Hermes / JSC polyfill).
    var _perfNow = (typeof performance !== 'undefined' && performance.now)
        ? function () { return performance.now(); }
        : function () { return Date.now(); };

    // Double-rAF scheduler — fires after the next paint frame is committed
    // to the native UI thread. Replaces InteractionManager.runAfterInteractions
    // for TTI. The first rAF runs in the same frame; the second rAF callback
    // runs AFTER that frame is painted, so any pixels rendered by the React
    // commit you triggered are now on screen.
    //
    // Falls back to InteractionManager if requestAnimationFrame is missing.
    var _afterPaint = (typeof requestAnimationFrame === 'function')
        ? function (fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }
        : function (fn) { InteractionManager.runAfterInteractions(fn); };

    // ── Internal state ────────────────────────────────────────────
    var _enabled = false;
    var _idleThresholdMs = 2000;

    // Monotonic sequence counter — assigned to every log event as `seq`.
    // Lets the parser uniquely reference any event (e.g. correlate paired
    // NAV/FOCUS vs PAGE/FOCUS, or join SETSTATE_QUEUED to its COMPONENT/UPDATE).
    // Wraps after ~9e15 events — effectively infinite for any real session.
    var _seq = 0;

    // Per-instance mount/update tracking.
    var _instInfo = new WeakMap();

    // Metadata maps keyed by name (load-bearing only as tagging, not correctness).
    var _componentPageMap   = new Map();
    var _pageComponentNames = new Set();
    var _readyPages         = new Set();

    // "scope:varName" → Array<startTs> FIFO stack for parallel invokes.
    var _invokeStacks   = new Map();
    var _patchedDatasets = new WeakSet();

    // Tracks "what kind of code path is currently calling updateState".
    // Stack of strings: 'event' | 'input' | 'binding' | 'script'.
    // Top = current. Empty = 'script' (default).
    var _triggerStack = [];
    function _pushTrigger(t) { _triggerStack.push(t); }
    function _popTrigger()   { _triggerStack.pop(); }
    function _currentTrigger() { return _triggerStack.length ? _triggerStack[_triggerStack.length - 1] : 'script'; }

    // ── Helpers ───────────────────────────────────────────────────
    // ts  — Date.now() wall-clock for log correlation (e.g. adb logcat timestamps)
    // hts — performance.now() monotonic high-res clock (sub-ms, immune to clock skew)
    // seq — monotonic counter, unique per event
    function _log(entry) {
        if (!_enabled) return;
        entry.seq = ++_seq;
        entry.ts  = Date.now();
        entry.hts = _perfNow();
        try { console.log('[WM-PERF] ' + JSON.stringify(entry)); } catch (_) { /* circular refs etc — drop */ }
    }

    function _getName(c) {
        if (!c) return 'unknown';
        return (c.state && c.state.props && c.state.props.name)
            || (c.props && c.props.name)
            || (c.constructor && (c.constructor.displayName || c.constructor.name))
            || 'unknown';
    }

    function _pushInvoke(key, ts) {
        var stack = _invokeStacks.get(key);
        if (!stack) { stack = []; _invokeStacks.set(key, stack); }
        stack.push(ts);
    }
    function _peekInvoke(key) {
        var stack = _invokeStacks.get(key);
        return (stack && stack.length) ? stack[0] : undefined;
    }
    function _shiftInvoke(key) {
        var stack = _invokeStacks.get(key);
        if (!stack || !stack.length) return undefined;
        var ts = stack.shift();
        if (!stack.length) _invokeStacks.delete(key);
        return ts;
    }

    // ── Variable type detection (varType field) ───────────────────
    // instanceof checks against the concrete variable classes.
    // Wrapped in try/catch because not all builds export all classes.
    var _ModelVariable, _ServiceVariable, _LiveVariable;
    try { _ModelVariable   = require('@wavemaker-ai/app-rn-runtime/variables/model-variable').ModelVariable; } catch (_) {}
    try { _ServiceVariable = require('@wavemaker-ai/app-rn-runtime/variables/service-variable').ServiceVariable; } catch (_) {}
    try { _LiveVariable    = require('@wavemaker-ai/app-rn-runtime/variables/live-variable').LiveVariable; } catch (_) {}

    function _varType(v) {
        if (_LiveVariable    && v instanceof _LiveVariable)    return 'live';
        if (_ServiceVariable && v instanceof _ServiceVariable) return 'service';
        if (_ModelVariable   && v instanceof _ModelVariable)   return 'model';
        return 'other';
    }

    // ── Idle detection ────────────────────────────────────────────
    // Reset on every user-attributable event. Fires IDLE_START after threshold,
    // IDLE_END on next activity. Driven by the invokeEventCallback patch (cheap —
    // no extra RN subscriptions) plus Tappable touch patches.
    var _idleTimer  = null;
    var _idleSince  = null;
    var USER_EVENTS = new Set([
        'tap','click','longpress','swipe','scroll',
        'change','blur','focus','keypress','keydown','keyup','submit','select',
        'ontap','onlongtap','ontouchstart','ontouchend','ondoubletap',
        'onchange','onblur','onfocus','onkeypress','onsubmit','onselect','onscroll'
    ]);
    function _isUserEvent(name) {
        if (!name) return false;
        return USER_EVENTS.has(String(name).toLowerCase());
    }
    function _markActivity(source) {
        if (_idleSince !== null) {
            _log({ type:'USER', event:'IDLE_END', ms: _perfNow() - _idleSince, source: source });
            _idleSince = null;
        }
        if (_idleTimer) clearTimeout(_idleTimer);
        _idleTimer = setTimeout(function () {
            _idleSince = _perfNow();
            _log({ type:'USER', event:'IDLE_START', threshold: _idleThresholdMs });
        }, _idleThresholdMs);
    }

    // ── Variable dataSet write tracking ──────────────────────────
    function _patchVarDataset(v, scope) {
        if (!v || _patchedDatasets.has(v)) return;
        try {
            var _val = v.dataSet;
            var vType = _varType(v);
            Object.defineProperty(v, 'dataSet', {
                configurable: true,
                enumerable:   true,
                get: function ()   { return _val; },
                set: function (nv) {
                    _val = nv;
                    _log({ type:'VAR', event:'DATASETWRITE', name: v.name, scope: scope, varType: vType });
                }
            });
            _patchedDatasets.add(v);
        } catch (_e) { /* non-configurable — skip */ }
    }

    function _subscribeVarsActions(vars, actions, scope, cleanupArr) {
        var all = Object.assign({}, vars, actions);
        Object.values(all).forEach(function (v) {
            var key     = scope + ':' + v.name;
            var isAct   = !!actions[v.name];
            var type    = isAct ? 'ACTION' : 'VAR';
            var vType   = isAct ? 'action' : _varType(v);

            cleanupArr.push(
                v.subscribe(VariableEvents.BEFORE_INVOKE, function () {
                    _pushInvoke(key, _perfNow());
                    _log({ type: type, event:'INVOKE_START', scope: scope, name: v.name, varType: vType });
                }),
                v.subscribe(VariableEvents.SUCCESS, function () {
                    var start = _peekInvoke(key);
                    _log({ type: type, event:'SUCCESS', scope: scope, name: v.name, varType: vType,
                           ms: start !== undefined ? _perfNow() - start : undefined });
                }),
                v.subscribe(VariableEvents.ERROR, function () {
                    var start = _peekInvoke(key);
                    _log({ type: type, event:'ERROR', scope: scope, name: v.name, varType: vType,
                           ms: start !== undefined ? _perfNow() - start : undefined });
                }),
                v.subscribe(VariableEvents.AFTER_INVOKE, function () {
                    var start = _shiftInvoke(key);
                    _log({ type: type, event:'INVOKE_END', scope: scope, name: v.name, varType: vType,
                           ms: start !== undefined ? _perfNow() - start : undefined });
                })
            );
        });
    }

    // ── componentDidMount ─────────────────────────────────────────
    var _origCDM = BaseComponent.prototype.componentDidMount;
    BaseComponent.prototype.componentDidMount = function () {
        if (_origCDM) _origCDM.call(this);
        if (!_enabled) return;
        var name = _getName(this);
        var info = { mountTs: _perfNow(), updateCounter: 0 };
        _instInfo.set(this, info);
        _log({ type:'COMPONENT', event:'MOUNT', name: name });

        var self = this, gen = 0;
        _afterPaint(function () {
            var cur = _instInfo.get(self);
            if (!cur || cur.updateCounter !== gen) return;
            var pageName = _componentPageMap.get(name);
            var isPage   = _pageComponentNames.has(name);
            _log({ type:'COMPONENT', event:'TTI', name: name, pageName: pageName, isPage: isPage,
                   ms: _perfNow() - cur.mountTs });
            if (isPage && pageName) _readyPages.add(pageName);
        });

        // ── NAV/TRANSITION_END ───────────────────────────────────
        // React Navigation fires 'transitionEnd' on a screen after its
        // entering/exiting animation finishes. For JS @react-navigation/
        // stack this fires on the JS thread after the Animated/Reanimated
        // animation completes; for native-stack it fires when the platform
        // navigator's transition (UINavigationController / Fragment) is
        // done. The delta between this page's MOUNT and TRANSITION_END
        // is the pure transition cost — everything attributable to the
        // navigator's animation, NOT to React reconciliation.
        //
        // closing=true on the OUTGOING page (rare for a page CDM, but
        // harmless), closing=false on the INCOMING page.
        try {
            if (this instanceof BasePage
                && this.props && this.props.navigation
                && typeof this.props.navigation.addListener === 'function') {
                var pageStart = info.mountTs;
                var navPageName = this.pageName || name;
                var unsub = this.props.navigation.addListener('transitionEnd', function (e) {
                    try { unsub && unsub(); } catch (_) {}
                    _log({ type:'NAV', event:'TRANSITION_END',
                           pageName: navPageName,
                           closing: !!(e && e.data && e.data.closing),
                           ms: _perfNow() - pageStart });
                });
            }
        } catch (_) { /* no nav prop / not a stack screen — skip */ }
    };

    // ── componentDidUpdate ────────────────────────────────────────
    var _origCDU = BaseComponent.prototype.componentDidUpdate;
    BaseComponent.prototype.componentDidUpdate = function (prevProps, prevState, snapshot) {
        if (_origCDU) _origCDU.call(this, prevProps, prevState, snapshot);
        if (!_enabled) return;
        var name = _getName(this);

        var prev = (prevState && prevState.props) ? prevState.props : {};
        var curr = (this.state && this.state.props) ? this.state.props : {};
        var allKeys = Array.from(new Set(Object.keys(prev).concat(Object.keys(curr))));
        var changed = allKeys.filter(function (k) { return prev[k] !== curr[k]; });
        if (changed.length) {
            _log({ type:'COMPONENT', event:'UPDATE', name: name, changedProps: changed });
        }

        var info = _instInfo.get(this);
        if (!info) return;
        var gen = info.updateCounter + 1;
        info.updateCounter = gen;

        var self = this;
        _afterPaint(function () {
            var cur = _instInfo.get(self);
            if (!cur || cur.updateCounter !== gen) return;
            var pageName = _componentPageMap.get(name);
            var isPage   = _pageComponentNames.has(name);
            _log({ type:'COMPONENT', event:'TTI', name: name, pageName: pageName, isPage: isPage,
                   ms: _perfNow() - cur.mountTs });
            if (isPage && pageName) _readyPages.add(pageName);
        });
    };

    // ── render — COMPONENT/RENDER (closes the invisible-time gap) ─
    // BaseComponent.prototype.render runs inside React's render phase,
    // between forceUpdate() returning and componentDidMount firing on
    // the new tree. Bracketing it surfaces the ~130 ms of reconciliation
    // / Yoga layout / native commit work that is otherwise invisible to
    // the tracker (REFRESH_END measures only the synchronous part of
    // forceUpdate, NOT the render phase that runs on the same tick).
    //
    // Per-widget `ms` lets us identify which specific component eats
    // the render budget on a page mount. Sum of all RENDER.ms in a
    // single REFRESH cycle ≈ the gap from REFRESH_END to first MOUNT.
    //
    // Some widgets may override render() and not call BaseComponent's
    // render directly — those won't be instrumented unless the subclass
    // also chains to super.render. The try/finally guarantees we always
    // log even if the render throws (which would otherwise be silent).
    if (typeof BaseComponent.prototype.render === 'function') {
        var _origRender = BaseComponent.prototype.render;
        BaseComponent.prototype.render = function () {
            if (!_enabled) return _origRender.call(this);
            var name  = _getName(this);
            var start = _perfNow();
            try {
                return _origRender.call(this);
            } finally {
                _log({ type:'COMPONENT', event:'RENDER',
                       name: name, ms: _perfNow() - start });
            }
        };
    }

    // ── updateState — SETSTATE_QUEUED ─────────────────────────────
    if (typeof BaseComponent.prototype.updateState === 'function') {
        var _origUS = BaseComponent.prototype.updateState;
        BaseComponent.prototype.updateState = function (delta, cb) {
            if (_enabled) {
                try {
                    var name = _getName(this);
                    var props = (delta && typeof delta === 'object') ? Object.keys(delta) : [];
                    _log({ type:'COMPONENT', event:'SETSTATE_QUEUED', name: name,
                           props: props, trigger: _currentTrigger() });
                } catch (_e) { /* never break updateState */ }
            }
            return _origUS.call(this, delta, cb);
        };
    }

    // ── componentWillUnmount ──────────────────────────────────────
    var _origCWU = BaseComponent.prototype.componentWillUnmount;
    BaseComponent.prototype.componentWillUnmount = function () {
        if (_enabled) {
            var name = _getName(this);
            _log({ type:'COMPONENT', event:'UNMOUNT', name: name });
            _instInfo.delete(this);
        }
        if (_origCWU) _origCWU.call(this);
    };

    // ── invokeEventCallback ───────────────────────────────────────
    // Captures EVENT/TRIGGER + EVENT/DONE, drives idle detection, and pushes
    // 'event' onto the trigger stack so child updateState calls log trigger:'event'.
    var _origIEC = BaseComponent.prototype.invokeEventCallback;
    BaseComponent.prototype.invokeEventCallback = function (eventName, args) {
        if (!_enabled) return _origIEC ? _origIEC.call(this, eventName, args) : undefined;
        var name = _getName(this);
        if (_isUserEvent(eventName)) _markActivity('event:' + eventName);
        _log({ type:'EVENT', event:'TRIGGER', name: name, eventName: eventName });
        _pushTrigger('event');
        var start = _perfNow();
        try {
            return _origIEC ? _origIEC.call(this, eventName, args) : undefined;
        } finally {
            _popTrigger();
            _log({ type:'EVENT', event:'DONE', name: name, eventName: eventName, ms: _perfNow() - start });
        }
    };

    // ── Tappable touch patches (real touch start) ─────────────────
    try {
        var Tappable = require('@wavemaker-ai/app-rn-runtime/core/tappable.component').Tappable;
        if (Tappable && Tappable.prototype) {
            var _origPress = Tappable.prototype.onPress;
            Tappable.prototype.onPress = function (e) {
                if (_enabled) {
                    _markActivity('touch');
                    var t = this.props && this.props.target;
                    _log({ type:'USER', event:'TOUCH_START', name: t && t.name });
                }
                return _origPress.call(this, e);
            };
            var _origLong = Tappable.prototype.onLongTap;
            Tappable.prototype.onLongTap = function (e) {
                if (_enabled) {
                    _markActivity('longtap');
                    var t = this.props && this.props.target;
                    _log({ type:'USER', event:'LONG_TAP', name: t && t.name });
                }
                return _origLong.call(this, e);
            };
            var _origPressOut = Tappable.prototype.onPressOut;
            Tappable.prototype.onPressOut = function (e) {
                if (_enabled) {
                    var t = this.props && this.props.target;
                    _log({ type:'USER', event:'TOUCH_END', name: t && t.name });
                }
                return _origPressOut.call(this, e);
            };
        }
    } catch (_) { /* Tappable not available */ }

    // ── BasePage.goToPage with branch detection ───────────────────
    var _origGTP = BasePage.prototype.goToPage;
    BasePage.prototype.goToPage = function (pageName, params, clearCache) {
        if (!_enabled) return _origGTP.call(this, pageName, params, clearCache);
        var from = this.pageName || 'unknown';

        // Branch detection — best-effort without re-implementing goToPage logic.
        //   'noop'    : same page + identical params (framework would call closeDrawer)
        //   'reset'   : clearCache=true (framework calls CommonActions.reset)
        //   'navigate': diff page, default (may end up reuse or push)
        //   'push'    : same page + different params (framework calls navigation.push)
        var branch;
        var sameParams = JSON.stringify(this.pageParams || {}) === JSON.stringify(params || {});
        if (pageName === from) {
            branch = sameParams ? 'noop' : 'push';
        } else if (clearCache) {
            branch = 'reset';
        } else {
            branch = 'navigate';
        }

        _log({ type:'NAV', event:'START',  from: from, to: pageName });
        _log({ type:'NAV', event:'PATH',   from: from, to: pageName, branch: branch });
        if (branch === 'noop') {
            _log({ type:'NAV', event:'NOOP', from: from, to: pageName });
        }

        // Capture `start` immediately before the framework call so DISPATCHED.ms
        // measures pure navigation dispatch, excluding our own log overhead.
        var start = _perfNow();
        return Promise.resolve(_origGTP.call(this, pageName, params, clearCache)).then(function (r) {
            _log({ type:'NAV', event:'DISPATCHED', from: from, to: pageName, ms: _perfNow() - start });
            return r;
        });
    };

    // ── BaseFragment.onFragmentReady ──────────────────────────────
    // Emits FRAGMENT_READY with kind (page/partial/prefab) and WM's own diagnostics.
    var _origOFR = BaseFragment.prototype.onFragmentReady;
    BaseFragment.prototype.onFragmentReady = function () {
        var result = _origOFR.call(this);
        if (!_enabled) return result;

        var pageName = this.pageName || 'fragment';
        var selfName = _getName(this);
        var isPage   = (this instanceof BasePage);

        // Detect kind via class name fallback (BasePartial/BasePrefab require statements
        // are kept lazy to avoid require failures in builds without prefabs).
        var kind = 'fragment';
        if (isPage) kind = 'page';
        else {
            var ctorName = this.constructor && (this.constructor.displayName || this.constructor.name) || '';
            if (/Prefab/i.test(ctorName)) kind = 'prefab';
            else if (/Partial/i.test(ctorName)) kind = 'partial';
        }

        var entry = {
            type:'COMPONENT', event:'FRAGMENT_READY',
            name: selfName, pageName: pageName, isPage: isPage, kind: kind
        };
        // Cross-validate against WM's own diagnostics (Q-BP1).
        try {
            var diag = this.appConfig && this.appConfig.diagnostics;
            if (diag) {
                entry.wmPageStartTime = diag.pageStartTime;
                entry.wmPageReadyTime = diag.pageReadyTime;
            }
        } catch (_) {}
        _log(entry);

        if (selfName !== 'unknown') {
            if (isPage) _pageComponentNames.add(selfName);
            _componentPageMap.set(selfName, pageName);
        }
        Object.values(this.Widgets || {}).forEach(function (w) {
            var wName = _getName(w);
            if (wName !== 'unknown') _componentPageMap.set(wName, pageName);
        });

        var fragVars    = this.fragmentVariables || {};
        var fragActions = this.fragmentActions   || {};
        _subscribeVarsActions(fragVars, fragActions, pageName, this.cleanup);
        Object.values(fragVars).forEach(function (v) { _patchVarDataset(v, pageName); });

        return result;
    };

    // ── WebProcessService.execute (OAuth WebView round-trip) ──────
    try {
        var _webProcessService = require('@wavemaker-ai/app-rn-runtime/runtime/services/webprocess.service').default;
        var _origWPExecute = _webProcessService.execute.bind(_webProcessService);
        _webProcessService.execute = function (proc, hookUrl, useSystemBrowser, incognito) {
            var start = _perfNow();
            _log({ type:'AUTH', event:'REDIRECT_START', process: proc });
            return _origWPExecute(proc, hookUrl, useSystemBrowser, incognito).then(
                function (r)   { _log({ type:'AUTH', event:'REDIRECT_DONE',  process: proc, ms: _perfNow() - start }); return r; },
                function (err) { _log({ type:'AUTH', event:'REDIRECT_ERROR', process: proc, ms: _perfNow() - start }); throw err; }
            );
        };
    } catch (_) {}

    // ── BasePage.onAttach (re-focus → NAV/FOCUS) ──────────────────
    // Emits BOTH NAV/FOCUS (canonical) and PAGE/FOCUS (back-compat alias)
    // with a shared `pairedSeq` field. Parser can dedupe by joining on
    // pairedSeq (each pair: the smaller of the two seq values).
    var _origOA = BasePage.prototype.onAttach;
    BasePage.prototype.onAttach = function () {
        if (_origOA) _origOA.call(this);
        if (!_enabled) return;
        if (this.pageName && _readyPages.has(this.pageName)) {
            // Reserve the seq the NAV/FOCUS will get; PAGE/FOCUS uses the same value
            // as `pairedSeq`. Each event still gets its own unique `seq`.
            var pairedSeq = _seq + 1;
            _log({ type:'NAV',  event:'FOCUS', pageName: this.pageName, pairedSeq: pairedSeq });
            _log({ type:'PAGE', event:'FOCUS', pageName: this.pageName, pairedSeq: pairedSeq });
        }
    };

    // ── BaseInputComponent — input lifecycle + commit attribution ─
    try {
        var BIC = require('@wavemaker-ai/app-rn-runtime/components/input/baseinput/baseinput.component').BaseInputComponent;
        if (BIC && BIC.prototype) {
            var _origOnFocus = BIC.prototype.onFocus;
            BIC.prototype.onFocus = function (e) {
                if (_enabled) {
                    _markActivity('input:focus');
                    _log({ type:'INPUT', event:'FOCUS', name: _getName(this), updateon: this.state && this.state.props && this.state.props.updateon });
                }
                return _origOnFocus.call(this, e);
            };

            var _origOnBlur = BIC.prototype.onBlur;
            BIC.prototype.onBlur = function (e) {
                if (_enabled) {
                    var oldVal   = (this.state && this.state.props && this.state.props.datavalue) || '';
                    var newVal   = (this.state && this.state.textValue) || '';
                    var updateon = this.state && this.state.props && this.state.props.updateon;
                    var committed = oldVal !== newVal && (updateon === 'blur' || updateon === 'default');
                    _log({ type:'INPUT', event:'BLUR', name: _getName(this), updateon: updateon, committed: committed });
                }
                return _origOnBlur.call(this, e);
            };

            var _origOnChangeText = BIC.prototype.onChangeText;
            BIC.prototype.onChangeText = function (value) {
                if (_enabled) {
                    _markActivity('input:keypress');
                    _log({ type:'INPUT', event:'KEYPRESS', name: _getName(this),
                           len: value == null ? 0 : value.length,
                           updateon: this.state && this.state.props && this.state.props.updateon });
                }
                return _origOnChangeText.call(this, value);
            };

            var _origOnKeyPress = BIC.prototype.onKeyPress;
            BIC.prototype.onKeyPress = function (e) {
                if (_enabled) {
                    _markActivity('input:keypress-raw');
                    var key = e && e.nativeEvent && e.nativeEvent.key;
                    _log({ type:'INPUT', event:'KEYPRESS_RAW', name: _getName(this), key: key });
                }
                return _origOnKeyPress.call(this, e);
            };

            var _origOnSubmit = BIC.prototype.onSubmitEditing;
            BIC.prototype.onSubmitEditing = function (e) {
                if (_enabled) {
                    _markActivity('input:submit');
                    _log({ type:'INPUT', event:'SUBMIT', name: _getName(this) });
                }
                return _origOnSubmit.call(this, e);
            };

            // updateDatavalue is the REAL bound-var commit point.
            // We also push 'input' onto the trigger stack so any updateState within
            // this call records trigger:'input' on SETSTATE_QUEUED.
            var _origUpdateDV = BIC.prototype.updateDatavalue;
            BIC.prototype.updateDatavalue = function (value, event, source) {
                if (!_enabled) return _origUpdateDV.call(this, value, event, source);
                _log({ type:'INPUT', event:'COMMIT', name: _getName(this),
                       source: source || 'keystroke',
                       updateon: this.state && this.state.props && this.state.props.updateon });
                _pushTrigger('input');
                try { return _origUpdateDV.call(this, value, event, source); }
                finally { _popTrigger(); }
            };
        }
    } catch (_) { /* baseinput not available */ }

    // ── ErrorBoundary.componentDidCatch ───────────────────────────
    try {
        var EB = require('@wavemaker-ai/app-rn-runtime/core/error-boundary.component').default;
        if (EB && EB.prototype) {
            var _origCDC = EB.prototype.componentDidCatch;
            EB.prototype.componentDidCatch = function (error, info) {
                if (_enabled) {
                    _log({ type:'ERROR', event:'CAUGHT',
                           message: error && error.message,
                           name:    error && error.name,
                           componentStack: info && info.componentStack && String(info.componentStack).slice(0, 1000) });
                }
                return _origCDC.call(this, error, info);
            };
        }
    } catch (_) {}

    // ── Watcher.check — System B dirty-check timing ───────────────
    try {
        var Watcher = require('@wavemaker-ai/app-rn-runtime/runtime/watcher').Watcher;
        if (Watcher && Watcher.prototype && typeof Watcher.prototype.check === 'function') {
            var _origWCheck = Watcher.prototype.check;
            Watcher.prototype.check = function () {
                if (!_enabled) return _origWCheck.call(this);
                var count = (typeof this.count === 'function') ? this.count() : undefined;
                var start = _perfNow();
                _log({ type:'WATCHER', event:'CHECK_START', count: count });
                _pushTrigger('binding');
                try { return _origWCheck.call(this); }
                finally {
                    _popTrigger();
                    _log({ type:'WATCHER', event:'CHECK_END', count: count, ms: _perfNow() - start });
                }
            };
        }
    } catch (_) {}

    // ── WmMemo — SCU bail + watcher-driven render ─────────────────
    try {
        var WmMemo = require('@wavemaker-ai/app-rn-runtime/runtime/memo.component').WmMemo;
        if (WmMemo && WmMemo.prototype && typeof WmMemo.prototype.shouldComponentUpdate === 'function') {
            var _origMSCU = WmMemo.prototype.shouldComponentUpdate;
            WmMemo.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                var result = _origMSCU.call(this, nextProps, nextState);
                if (_enabled) {
                    if (result) _log({ type:'MEMO', event:'WATCHER_DRIVEN_RENDER', name: _getName(this) });
                    else        _log({ type:'MEMO', event:'SCU_BAIL',              name: _getName(this) });
                }
                return result;
            };
        }
    } catch (_) {}

    // ── Singleton service patches ─────────────────────────────────
    // Takes an already-resolved service instance. Each call site uses a
    // STRING LITERAL require so Metro's static dependency analyzer can
    // resolve it (Metro rejects `require(variable)`).
    function _patchSingleton(svc, methodMap) {
        if (!svc) return;
        try {
            Object.keys(methodMap).forEach(function (methodName) {
                var spec  = methodMap[methodName];
                var orig  = svc[methodName];
                if (typeof orig !== 'function') return;
                svc[methodName] = function () {
                    var args = arguments;
                    if (_enabled && spec.before) spec.before(this, args);
                    var result = orig.apply(svc, args);
                    if (_enabled && spec.after)  spec.after(this, args, result);
                    return result;
                };
            });
        } catch (_) { /* skip on shape mismatch */ }
    }

    // Spinner — Log SHOW only when the spinner is ACTUALLY visible.
    // The framework's show() schedules the displayManager call inside
    // setTimeout(this.delay). Logging at show() call time over-reports
    // visibility by `this.delay` ms.  We mirror the same setTimeout so our
    // SHOW log timestamp matches user-visible spinner appearance, and we
    // suppress both SHOW and HIDE if the spinner was hidden before the
    // delay elapsed (e.g. fast API resolved before spinner painted).
    try {
        var SpinnerSvc = require('@wavemaker-ai/app-rn-runtime/runtime/services/app-spinner.service').default;
        if (SpinnerSvc) {
            var _spinnerShownAt    = null;
            var _spinnerPendingShow = false;
            var _origShow = SpinnerSvc.show;
            SpinnerSvc.show = function (options) {
                var willActuallyShow = (this.count === 0) && !this.destroy;
                var delay = this.delay || 0;
                var self  = this;
                var r = _origShow.call(this, options);
                if (_enabled && willActuallyShow) {
                    _spinnerPendingShow = true;
                    setTimeout(function () {
                        if (_spinnerPendingShow && self.count > 0) {
                            _spinnerPendingShow = false;
                            _spinnerShownAt = _perfNow();
                            _log({ type:'SPINNER', event:'SHOW',
                                   message: options && options.message, delay: delay });
                        }
                    }, delay);
                }
                return r;
            };
            var _origHide = SpinnerSvc.hide;
            SpinnerSvc.hide = function () {
                var willActuallyHide = (this.count === 1);
                var r = _origHide.call(this);
                if (_enabled && willActuallyHide) {
                    if (_spinnerShownAt != null) {
                        _log({ type:'SPINNER', event:'HIDE', ms: _perfNow() - _spinnerShownAt });
                        _spinnerShownAt = null;
                    } else if (_spinnerPendingShow) {
                        // Spinner was requested but hidden before it actually appeared.
                        // Suppress both SHOW and HIDE — nothing was visible.
                        _spinnerPendingShow = false;
                    }
                }
                return r;
            };
        }
    } catch (_) {}

    // Modal — WeakMap keyed by options object so unreferenced modal options don't leak.
    var _modalShownAt = new WeakMap();
    try {
        var ModalSvc = require('@wavemaker-ai/app-rn-runtime/runtime/services/app-modal.service').default;
        _patchSingleton(ModalSvc, {
            showModal: { before: function (s, a) {
                var o = a[0];
                if (!o) return;
                _modalShownAt.set(o, _perfNow());
                _log({ type:'MODAL', event:'SHOW', name: o.name });
            } },
            hideModal: { before: function (s, a) {
                var o = a[0];
                var ts = o ? _modalShownAt.get(o) : null;
                _log({ type:'MODAL', event:'HIDE', name: o && o.name, ms: ts != null ? _perfNow() - ts : undefined });
                if (o) _modalShownAt.delete(o);
            } }
        });
    } catch (_) {}

    // Toast — keyed by name (string), so plain Map is fine. Cleaned on hide.
    var _toastShownAt = new Map();
    try {
        var ToastSvc = require('@wavemaker-ai/app-rn-runtime/runtime/services/app-toast.service').default;
        _patchSingleton(ToastSvc, {
            showToast: { before: function (s, a) { var o = a[0] || {}; _toastShownAt.set(o.name, _perfNow()); _log({ type:'TOAST', event:'SHOW', name: o.name, duration: o.duration }); } },
            hideToast: { before: function (s, a) {
                var o = a[0];
                var name = o && o.name;
                var ts = name ? _toastShownAt.get(name) : null;
                _log({ type:'TOAST', event:'HIDE', name: name, ms: ts != null ? _perfNow() - ts : undefined });
                if (name) _toastShownAt.delete(name);
            } }
        });
    } catch (_) {}

    // DisplayManager — global overlay (used by spinner internally; logged separately for visibility).
    var _displayShownAt = null;
    try {
        var DisplaySvc = require('@wavemaker-ai/app-rn-runtime/runtime/services/app-display-manager.service').default;
        _patchSingleton(DisplaySvc, {
            show:    { before: function () { _displayShownAt = _perfNow(); _log({ type:'DISPLAY', event:'SHOW' }); } },
            destroy: { before: function () { _log({ type:'DISPLAY', event:'HIDE', ms: _displayShownAt != null ? _perfNow() - _displayShownAt : undefined }); _displayShownAt = null; } }
        });
    } catch (_) {}

    // i18n locale change — anchors the cleanRefresh burst.
    try {
        var I18nSvc = require('@wavemaker-ai/app-rn-runtime/runtime/services/app-i18n.service').default;
        if (I18nSvc) {
            var _origSetLocale = I18nSvc.setSelectedLocale;
            I18nSvc.setSelectedLocale = function (locale) {
                var from = this.selectedLocale;
                var needsRestart = _origSetLocale.call(this, locale);
                if (_enabled) {
                    _log({ type:'LOCALE', event:'CHANGE', from: from, to: locale, needsRestart: needsRestart });
                }
                return needsRestart;
            };
        }
    } catch (_) {}

    // ── NetworkService — connectivity transitions ─────────────────
    try {
        var NetSvc = require('@wavemaker-ai/app-rn-runtime/core/network.service').default;
        if (NetSvc && NetSvc.notifier && typeof NetSvc.notifier.subscribe === 'function') {
            NetSvc.notifier.subscribe('onNetworkStateChange', function (data) {
                _log({ type:'NETWORK', event:'CHANGE',
                       connected: data && data.isConnected,
                       available: data && data.isNetworkAvailable,
                       serviceAvailable: data && data.isServiceAvailable });
            });
        }
    } catch (_) {}

    // ── axios HTTP interceptors ───────────────────────────────────
    // Captures HTTP timing under WM wrappers. To close the axios.create() blind
    // spot — service-variables may use per-service axios instances — we ALSO
    // wrap axios.create itself so every new instance gets the same interceptors.
    function _installAxiosInterceptors(client) {
        if (!client || !client.interceptors || client.__wmPerfPatched) return;
        client.__wmPerfPatched = true;
        client.interceptors.request.use(function (cfg) {
            if (_enabled) {
                cfg.__wmStart = _perfNow();
                _log({ type:'HTTP', event:'REQUEST', url: cfg.url, method: cfg.method });
            }
            return cfg;
        });
        client.interceptors.response.use(
            function (res) {
                if (_enabled) {
                    var start = res.config && res.config.__wmStart;
                    _log({ type:'HTTP', event:'RESPONSE',
                           url: res.config && res.config.url,
                           status: res.status,
                           ms: start != null ? _perfNow() - start : undefined });
                }
                return res;
            },
            function (err) {
                if (_enabled) {
                    var start = err.config && err.config.__wmStart;
                    _log({ type:'HTTP', event:'RESPONSE_ERROR',
                           url: err.config && err.config.url,
                           status: err.response && err.response.status,
                           ms: start != null ? _perfNow() - start : undefined });
                }
                throw err;
            }
        );
    }
    // Resolve axios via its explicit browser build to avoid Metro picking the
    // Node CJS entry (which pulls in `crypto`, `http`, `url` — unavailable in
    // React Native). `import axios from 'axios'` in WM's NetworkService resolves
    // via ESM/browser-condition path correctly, but our CJS `require('axios')`
    // picks the Node entry and breaks bundling.
    //
    // If axios is restructured in a future version and this path doesn't exist,
    // the try/catch skips the HTTP/* events silently — per-variable timing via
    // INVOKE_START/INVOKE_END remains intact.
    try {
        var axios = require('axios/dist/browser/axios.cjs');
        axios = axios.default || axios;
        if (axios) {
            _installAxiosInterceptors(axios);
            if (typeof axios.create === 'function') {
                var _origCreate = axios.create;
                axios.create = function () {
                    var client = _origCreate.apply(axios, arguments);
                    _installAxiosInterceptors(client);
                    return client;
                };
            }
        }
    } catch (_) { /* axios browser build missing — skip HTTP/* events */ }

    // ── Keyboard show/hide ────────────────────────────────────────
    try {
        var _kbShownTs = null;
        Keyboard.addListener('keyboardDidShow', function (e) {
            if (!_enabled) return;
            _kbShownTs = _perfNow();
            _log({ type:'KEYBOARD', event:'SHOW',
                   height:   e && e.endCoordinates && e.endCoordinates.height,
                   duration: e && e.duration });
        });
        Keyboard.addListener('keyboardDidHide', function (e) {
            if (!_enabled) return;
            _log({ type:'KEYBOARD', event:'HIDE',
                   ms: _kbShownTs != null ? _perfNow() - _kbShownTs : undefined,
                   duration: e && e.duration });
            _kbShownTs = null;
        });
        if (PlatformOS === 'ios') {
            Keyboard.addListener('keyboardWillShow', function (e) {
                if (_enabled) _log({ type:'KEYBOARD', event:'WILL_SHOW', duration: e && e.duration });
            });
            Keyboard.addListener('keyboardWillHide', function (e) {
                if (_enabled) _log({ type:'KEYBOARD', event:'WILL_HIDE', duration: e && e.duration });
            });
        }
    } catch (_) {}

    // ── Hardware back button (Android) ────────────────────────────
    // Register FIRST so WM modal/display handlers still run (they were registered
    // earlier in the app lifecycle — listeners fire in reverse registration order).
    // Return false explicitly so propagation continues.
    try {
        if (BackHandler && typeof BackHandler.addEventListener === 'function') {
            BackHandler.addEventListener('hardwareBackPress', function () {
                if (_enabled) {
                    _markActivity('backpress');
                    _log({ type:'USER', event:'BACK_PRESS' });
                }
                return false;
            });
        }
    } catch (_) {}

    // ── Accessibility screen reader changes ───────────────────────
    try {
        if (AccessibilityInfo && typeof AccessibilityInfo.addEventListener === 'function') {
            AccessibilityInfo.addEventListener('screenReaderChanged', function (enabled) {
                if (_enabled) _log({ type:'A11Y', event:'SCREEN_READER_CHANGED', enabled: !!enabled });
            });
        }
    } catch (_) {}

    // ── Public API ────────────────────────────────────────────────
    global.WMPerf = {
        /** Start logging. */
        enable: function () {
            _enabled = true;
            console.log('[WM-PERF] ' + JSON.stringify({
                ts: Date.now(), hts: _perfNow(), seq: ++_seq, type:'META', event:'ENABLED', version:'3.6',
                platform: PlatformOS
            }));
        },

        /** Stop logging (in-flight callbacks still fire). */
        disable: function () { _enabled = false; },

        /** Configure idle detection threshold (ms). Default 2000. */
        setIdleThreshold: function (ms) {
            _idleThresholdMs = Math.max(200, ms | 0);
            _log({ type:'META', event:'IDLE_THRESHOLD_SET', ms: _idleThresholdMs });
        },

        /**
         * Subscribe to app-level Variables and Actions.
         * Call after App bootstrap() has assigned this.Variables / this.Actions.
         */
        trackAppVars: function (vars, actions) {
            _subscribeVarsActions(vars || {}, actions || {}, 'app', []);
            Object.values(vars || {}).forEach(function (v) { _patchVarDataset(v, 'app'); });
        },

        /**
         * Enable REFRESH_QUEUED / REFRESH_START events. Pass the App instance
         * (from App.js componentDidMount, pass `this`).
         * Wraps appConfig.refresh and the App's forceUpdate.
         */
        trackApp: function (app) {
            if (!app || !app.appConfig) return;
            try {
                var origRefresh = app.appConfig.refresh;
                if (typeof origRefresh === 'function') {
                    app.appConfig.refresh = function (complete) {
                        if (_enabled) _log({ type:'APP', event:'REFRESH_QUEUED', complete: !!complete });
                        return origRefresh.call(app.appConfig, complete);
                    };
                }
                if (typeof app.forceUpdate === 'function') {
                    var origFU = app.forceUpdate.bind(app);
                    app.forceUpdate = function () {
                        if (!_enabled) return origFU();
                        // REFRESH_END brackets the synchronous portion of the
                        // digest. The native commit (Yoga + bridge UIManager
                        // ops) runs AFTER forceUpdate returns, so any gap
                        // between REFRESH_END and the next MOUNT/UPDATE/
                        // NAV/TRANSITION_END is native-thread work, not JS.
                        var start = _perfNow();
                        _log({ type:'APP', event:'REFRESH_START' });
                        try { return origFU(); }
                        finally {
                            _log({ type:'APP', event:'REFRESH_END', ms: _perfNow() - start });
                        }
                    };
                }
                _log({ type:'META', event:'APP_TRACKED' });
            } catch (_e) {}
        },

        /**
         * Enable SCRIPT/TIMEOUT_QUEUED+FIRED and SCRIPT/INTERVAL_QUEUED+FIRED events.
         * Pass the App instance. Wraps app.lib.setTimeout and app.lib.setInterval.
         */
        trackLib: function (app) {
            if (!app || !app.lib) return;
            try {
                if (typeof app.lib.setTimeout === 'function') {
                    var origST = app.lib.setTimeout;
                    app.lib.setTimeout = function (cb, ms) {
                        if (!_enabled) return origST(cb, ms);
                        var label = (cb && cb.name) || 'anonymous';
                        var queuedAt = _perfNow();
                        _log({ type:'SCRIPT', event:'TIMEOUT_QUEUED', label: label, ms: ms });
                        return origST(function () {
                            _log({ type:'SCRIPT', event:'TIMEOUT_FIRED', label: label, ms: ms,
                                   actual: _perfNow() - queuedAt });
                            cb && cb();
                        }, ms);
                    };
                }
                if (typeof app.lib.setInterval === 'function') {
                    var origSI = app.lib.setInterval;
                    app.lib.setInterval = function (cb, ms) {
                        if (!_enabled) return origSI(cb, ms);
                        var label = (cb && cb.name) || 'anonymous';
                        _log({ type:'SCRIPT', event:'INTERVAL_QUEUED', label: label, ms: ms });
                        return origSI(function () {
                            _log({ type:'SCRIPT', event:'INTERVAL_FIRED', label: label, ms: ms });
                            cb && cb();
                        }, ms);
                    };
                }
                _log({ type:'META', event:'LIB_TRACKED' });
            } catch (_e) {}
        }
    };

}());
/*****************************************************************
 * WM Platform Patch: Performance Tracker v3.6
 *****************************************************************/
