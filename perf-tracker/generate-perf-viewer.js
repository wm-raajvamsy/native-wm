#!/usr/bin/env node
/*
 * generate-perf-viewer.js — emit a single-file HTML viewer that plays the
 * timestamp-subtitled video alongside a synced, page-sectioned timeline.
 *
 * Usage:
 *   node generate-perf-viewer.js <perf-session.log> [out.html]
 *
 * The HTML embeds the log as JSON. Open it in a browser, drop in the .mp4,
 * click any timeline event then click the video to set the sync point.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const LOG_PATH = process.argv[2];
const OUT_PATH = process.argv[3] || path.join(path.dirname(LOG_PATH || '.'), 'perf-viewer.html');
if (!LOG_PATH) { console.error('Usage: node generate-perf-viewer.js <log> [out.html]'); process.exit(1); }

// ── Parse log → array of event objects ─────────────────────────────
const raw = fs.readFileSync(LOG_PATH, 'utf8');
const events = [];
for (const line of raw.split('\n')) {
    const idx = line.indexOf('[WM-PERF] ');
    if (idx < 0) continue;
    const jsonStr = line.slice(idx + 10).trim();
    if (!jsonStr) continue;
    try { events.push(JSON.parse(jsonStr)); } catch (_) { /* skip malformed */ }
}
events.sort((a, b) => (a.seq || 0) - (b.seq || 0));
if (!events.length) { console.error('No [WM-PERF] events found'); process.exit(1); }

// ── Compute visit-level metrics (port of parse-perf-log.js visitFlowData) ──
function computeVisits(events) {
    // componentData: name → { mountTs, ttis: [ts...] }
    const componentData = new Map();
    // compPage: component name → pageName (TTI/FRAGMENT_READY carry pageName)
    const compPage = new Map();
    for (const e of events) {
        if (e.type !== 'COMPONENT') continue;
        if (e.event === 'MOUNT') {
            // Update mountTs but keep the accumulated ttis array so earlier visits'
            // TTIs are not lost when the same component re-mounts on later navs.
            // The per-visit filter (ts >= v.mountTs && ts <= winEnd) isolates each visit.
            const existing = componentData.get(e.name);
            if (existing) { existing.mountTs = e.ts; }
            else { componentData.set(e.name, { mountTs: e.ts, ttis: [] }); }
        } else if (e.event === 'TTI') {
            let d = componentData.get(e.name);
            if (!d) { d = { mountTs: undefined, ttis: [] }; componentData.set(e.name, d); }
            d.ttis.push(e.ts);
            if (e.pageName && e.name) compPage.set(e.name, e.pageName);
        } else if (e.event === 'FRAGMENT_READY') {
            if (e.pageName && e.name) compPage.set(e.name, e.pageName);
        }
    }
    // User-driven event names marking a User Interaction Boundary (UIB).
    const USER_DRIVEN = new Set(['onTap','onTouchstart','onTouchend','onLongpress','onSubmit','onSubmitediting']);

    // Build visit anchors from FRAGMENT_READY isPage events
    const rawVisits = [];
    for (let i = 0; i < events.length; i++) {
        const e = events[i];
        if (e.type !== 'COMPONENT' || e.event !== 'FRAGMENT_READY') continue;
        if (!e.isPage || !e.pageName || e.pageName === 'fragment') continue;
        // mountTs = most recent MOUNT of this container before this FRAGMENT_READY
        let mountTs = e.ts;
        for (let j = i - 1; j >= 0; j--) {
            const x = events[j];
            if (e.ts - x.ts > 60000) break;
            if (x.type === 'COMPONENT' && x.event === 'MOUNT' && x.name === e.name) {
                mountTs = x.ts; break;
            }
        }
        rawVisits.push({ pageName: e.pageName, container: e.name, mountTs, frTs: e.ts });
    }
    // Dedupe by container+mountTs (FRAGMENT_READY may fire multiple times per mount).
    const seen = new Set();
    let visits = [];
    for (const v of rawVisits) {
        const k = v.container + ':' + v.mountTs;
        if (seen.has(k)) continue;
        seen.add(k);
        visits.push(v);
    }
    // Collapse rapid re-mounts of the same page (WaveMaker double-mounts the page
    // container within a few ms). Keep the FIRST mount — that's when the page
    // container first appears (what the chronological timeline shows and what the
    // video shows). The dropped later mount just becomes part of this visit's
    // window, so TTFI still captures the full settle (incl. the re-mount's renders)
    // while the Page-mount bar stays aligned with the timeline.
    const REMOUNT_GAP = 150; // ms
    const collapsed = [];
    for (const v of visits) {
        const prev = collapsed[collapsed.length - 1];
        if (prev && prev.container === v.container && v.mountTs - prev.mountTs < REMOUNT_GAP) {
            continue; // drop the later re-mount; keep the first (already in collapsed)
        }
        collapsed.push(v);
    }
    visits = collapsed;

    return visits.map((v, i) => {
        const next   = visits[i + 1];
        const winEnd = next ? next.mountTs : v.mountTs + 30000;

        const cont = componentData.get(v.container);
        const containerTtis = (cont?.ttis || []).filter(ts => ts >= v.mountTs && ts <= winEnd).sort((a,b)=>a-b);
        const initialTti = containerTtis.length ? containerTtis[0] - v.mountTs : null;

        // Page-scope widget TTIs in window
        const widgetTtis = [];
        for (const e of events) {
            if (e.ts < v.mountTs) continue;
            if (e.ts > winEnd) break;
            if (e.type === 'COMPONENT' && e.event === 'TTI' && e.pageName === v.pageName) {
                widgetTtis.push(e.ts);
            }
        }
        widgetTtis.sort((a,b)=>a-b);

        // ── TTFI (Time To First Interaction) ─────────────────────────
        // The moment the page first becomes interactive after mount. Priority:
        //   (A) UIB cap — a REAL user tap (EVENT/TRIGGER user-driven, USER touch,
        //       INPUT SUBMIT/COMMIT). Nothing past this counts.
        //   (1) Auto-focus / keyboard — first INPUT/FOCUS or KEYBOARD/SHOW in the
        //       visit window (page auto-selects an input → cursor ready to type).
        //   (2) Render-settle — otherwise the last page render (COMPONENT/TTI or
        //       UPDATE) before the render activity goes idle (gap > RENDER_IDLE_GAP)
        //       i.e. the page rendered, then waited (for the user or a
        //       non-rendering API). That last render is the interactive point.
        const RENDER_IDLE_GAP = 250; // ms — a render gap larger than this = page went idle
        // UIB = first GENUINE user interaction. Note INPUT/COMMIT is NOT a UIB:
        // it can be programmatic auto-fill (e.g. a barcode scan populating fields,
        // logged with source=keystroke), and even real typing happens AFTER the
        // page is already interactive — so a commit is never the "first
        // interaction" boundary. INPUT/SUBMIT (return key) does count.
        let uib = Infinity;
        for (const e of events) {
            if (e.ts <= v.mountTs) continue;
            if (e.ts > winEnd) break;
            const isTrig = e.type === 'EVENT' && e.event === 'TRIGGER' && USER_DRIVEN.has(e.eventName);
            const isUser = e.type === 'USER'  && (e.event === 'TOUCH_START' || e.event === 'LONG_TAP' || e.event === 'BACK_PRESS');
            const isSubmit= e.type === 'INPUT' && e.event === 'SUBMIT';
            if (isTrig || isUser || isSubmit) { uib = e.ts; break; }
        }

        // (1) Auto-focus ready. A framework auto-focus fires right after the
        // render that mounts the input (cursor appears on load). A focus that
        // arrives well AFTER the page went quiet is a manual tap (user reaction
        // time) — inputs aren't Tappables so they emit no USER/TOUCH_START.
        // Rule: INPUT/FOCUS within AUTOFOCUS_WINDOW of the last page render =
        // auto-focus (the ready signal); otherwise it's a manual tap → it caps
        // TTFI (becomes the UIB) but isn't itself the ready point.
        const AUTOFOCUS_WINDOW = 500; // ms
        let readyTs = null;
        for (const e of events) {
            if (e.ts <= v.mountTs) continue;
            if (e.ts >= uib || e.ts > winEnd) break;
            if (e.type === 'INPUT' && e.event === 'FOCUS') {
                // last page render strictly before this focus
                let lastR = v.mountTs;
                for (const r of events) {
                    if (r.ts <= v.mountTs) continue;
                    if (r.ts >= e.ts) break;
                    if (r.type === 'COMPONENT' && (r.event === 'TTI' || r.event === 'UPDATE')) {
                        const pg = r.pageName || compPage.get(r.name);
                        if (pg === v.pageName) lastR = r.ts;
                    }
                }
                if (e.ts - lastR <= AUTOFOCUS_WINDOW) {
                    // The cursor becomes VISIBLE at the render burst that commits
                    // after the focus call (onChange/onFocus repaint), not at the
                    // focus event itself — same "user sees pixels" principle as
                    // TTI's double-rAF. Anchor on the END of that burst (consecutive
                    // page renders <150ms apart) so the focus-driven re-render bar
                    // is fully inside the TTFI window.
                    // STOP the burst when KEYBOARD/SHOW fires — renders after the
                    // keyboard slides in are layout-adjustment re-renders, not
                    // focus-commit renders; they must not extend TTFI.
                    let paintTs = e.ts, prevR = null;
                    for (const r of events) {
                        if (r.ts < e.ts) continue;
                        if (r.ts > e.ts + 800) break;
                        if (r.type === 'KEYBOARD' && r.event === 'SHOW') break; // keyboard layout renders stop here
                        if (r.type !== 'COMPONENT' || (r.event !== 'TTI' && r.event !== 'UPDATE')) continue;
                        const pg = r.pageName || compPage.get(r.name);
                        if (pg !== v.pageName) continue;
                        if (prevR != null && r.ts - prevR > 150) break; // burst ended
                        paintTs = r.ts; prevR = r.ts;
                    }
                    // If the auto-focus fires within 200ms of initialTti, the focus
                    // is just cursor positioning after the initial render — the page
                    // was already fully interactive at initialTti. Using paintTs here
                    // would inflate TTFI by the focus-commit re-render (~100ms) for
                    // no user-visible benefit (e.g. barcode-scanner pages where the
                    // user interacts before the keyboard even opens).
                    const initTtiTs = v.mountTs + (initialTti ?? 0);
                    readyTs = (initialTti != null && Math.abs(e.ts - initTtiTs) <= 200)
                        ? initTtiTs   // auto-focus close to initialTti — don't inflate
                        : paintTs;    // genuine post-render auto-focus — cursor painted
                } else uib = e.ts;                                     // manual tap → cap
                break;
            }
        }

        // (2) Post-API render: the render burst triggered by the FIRST post-mount
        // API (service/live variable) onSuccess. That re-render is when the page's
        // first real data is on screen → interactive. Later APIs fill in background
        // data and don't delay interactivity.
        let firstApiSuccessTs = null;
        {
            const openA = new Map();
            for (const e of events) {
                if (e.ts < v.mountTs) continue;
                if (e.ts >= uib || e.ts > winEnd) break;
                if (e.type !== 'VAR' && e.type !== 'ACTION') continue;
                const isApi = e.varType === 'service' || e.varType === 'live' || e.type === 'ACTION';
                if (!isApi) continue;
                const k = e.scope + ':' + e.name;
                if (e.event === 'INVOKE_START') openA.set(k, e.ts);
                else if ((e.event === 'INVOKE_END' || e.event === 'ERROR') && openA.has(k)) {
                    firstApiSuccessTs = e.ts; break;
                }
            }
        }
        let postApiRenderEnd = null;
        if (firstApiSuccessTs != null) {
            // First page render after the API success, extended through the
            // immediate burst (consecutive renders < 150ms apart).
            let prevR = null;
            for (const e of events) {
                if (e.ts <= firstApiSuccessTs) continue;
                if (e.ts >= uib || e.ts > winEnd) break;
                if (e.type !== 'COMPONENT' || (e.event !== 'TTI' && e.event !== 'UPDATE')) continue;
                const pg = e.pageName || compPage.get(e.name);
                if (pg !== v.pageName) continue;
                if (prevR != null && e.ts - prevR > 150) break; // burst ended
                postApiRenderEnd = e.ts; prevR = e.ts;
            }
        }

        let ttfi, ttfiBasis;
        if (readyTs != null) {
            ttfi = readyTs - v.mountTs;
            ttfiBasis = 'auto-focus';
        } else if (postApiRenderEnd != null) {
            ttfi = postApiRenderEnd - v.mountTs;
            ttfiBasis = 'post-api-render';
        } else {
            // (3) No API and no focus — plain render-settle: last render before an
            // idle gap (page rendered then waited for the user).
            let settleTs = null, prevTs = v.mountTs;
            for (const e of events) {
                if (e.ts <= v.mountTs) continue;
                if (e.ts >= uib || e.ts > winEnd) break;
                if (e.type !== 'COMPONENT' || (e.event !== 'TTI' && e.event !== 'UPDATE')) continue;
                const pg = e.pageName || compPage.get(e.name);
                if (pg !== v.pageName) continue;
                if (settleTs != null && (e.ts - prevTs) > RENDER_IDLE_GAP) break;
                settleTs = e.ts; prevTs = e.ts;
            }
            ttfi = settleTs != null ? settleTs - v.mountTs : (initialTti ?? 0);
            ttfiBasis = settleTs != null ? 'render-settle' : 'initial-render';
        }
        if (readyTs == null && ttfi < (initialTti ?? 0)) ttfi = initialTti ?? 0;
        const firstInteractionTs = uib === Infinity ? null : uib;
        const ttifEnd = v.mountTs + ttfi;

        // API: collapse VAR/ACTION invoke intervals in [mountTs, ttifEnd].
        // The interval we count is [INVOKE_START, INVOKE_END] — pure network
        // round-trip time. INVOKE_END fires when the response data is written
        // (DATASETWRITE). SUCCESS fires later, after AFTER_INVOKE handlers run.
        // For error paths INVOKE_END may not fire, so ERROR is the fallback.
        const open = new Map();
        const intervals = [];
        for (const e of events) {
            if (e.ts < v.mountTs) continue;
            if (e.ts > ttifEnd) break;
            if (e.type !== 'VAR' && e.type !== 'ACTION') continue;
            const k = e.scope + ':' + e.name;
            if (e.event === 'INVOKE_START') {
                open.set(k, e.ts);
            } else if (e.event === 'INVOKE_END' && open.has(k)) {
                const start = Math.max(v.mountTs, open.get(k));
                if (start < e.ts) intervals.push([start, e.ts]);
                open.delete(k);
            } else if (e.event === 'ERROR' && open.has(k)) {
                // error path — INVOKE_END may not fire
                let start = open.get(k);
                if (e.ms != null) start = Math.min(start, e.ts - e.ms);
                start = Math.max(v.mountTs, start);
                if (start < e.ts) intervals.push([start, e.ts]);
                open.delete(k);
            }
        }
        // In-flight at TTIF — clamp to window end
        for (const [, start] of open) {
            if (start < ttifEnd) intervals.push([start, ttifEnd]);
        }
        intervals.sort((a,b)=>a[0]-b[0]);
        let apiMs = 0, cursor = -Infinity, lastApiEnd = v.mountTs;
        for (const [s, e] of intervals) {
            const s2 = Math.max(s, cursor);
            if (s2 < e) { apiMs += e - s2; cursor = e; if (e > lastApiEnd) lastApiEnd = e; }
        }

        // onSuccessMs: lastApiEnd → first post-API page TTI
        let onSuccessMs = 0, firstPostApiTti = null;
        if (apiMs > 0 && lastApiEnd > v.mountTs) {
            for (const ts of widgetTtis) { if (ts > lastApiEnd) { firstPostApiTti = ts; break; } }
            if (firstPostApiTti != null && firstPostApiTti <= ttifEnd) {
                onSuccessMs = firstPostApiTti - lastApiEnd;
            }
        }
        const totalApi = apiMs + onSuccessMs;

        // ── Refresh cycles (unified Script + Re-render model) ───────────
        // Every committed APP/REFRESH_START cycle in [mountTs, ttifEnd] is one
        // bar. A cycle is SCRIPT if a DATASETWRITE (page|app) drove it, else a
        // pure RE-RENDER. The waterfall renders these exact cycles, so the
        // summary columns and the waterfall bars are consistent by construction.
        //   scriptMs   = Σ write-driven cycle durations
        //   rerenderMs = Σ pure cycle durations
        const cycles = [];
        {
            const refreshes = [], writeEvents = [];
            for (const e of events) {
                if (e.ts < v.mountTs) continue;
                if (e.ts > ttifEnd) break;
                if (e.type === 'APP' && e.event === 'REFRESH_START') refreshes.push(e);
                else if (e.type === 'VAR' && e.event === 'DATASETWRITE' && (e.scope === v.pageName || e.scope === 'app')) writeEvents.push(e);
            }
            const triggerFor = (refreshTs) => {
                let best = null;
                for (const x of events) {
                    if (x.ts >= refreshTs) break;
                    if (refreshTs - x.ts > 400) continue;
                    let lab = null;
                    if (x.type === 'VAR' && x.event === 'DATASETWRITE') lab = x.name + (x.varType ? '·' + x.varType : '');
                    else if ((x.type === 'VAR' || x.type === 'ACTION') && x.event === 'SUCCESS') lab = x.name + ' success';
                    else if ((x.type === 'VAR' || x.type === 'ACTION') && x.event === 'ERROR') lab = x.name + ' error';
                    else if (x.type === 'INPUT' && (x.event === 'COMMIT' || x.event === 'SUBMIT')) lab = 'input ' + (x.name || '');
                    else if (x.type === 'USER' && (x.event === 'TOUCH_START' || x.event === 'LONG_TAP')) lab = 'tap ' + (x.name || '');
                    else if (x.type === 'EVENT' && x.event === 'TRIGGER' && x.eventName) lab = x.eventName;
                    else if (x.type === 'KEYBOARD' && (x.event === 'SHOW' || x.event === 'HIDE')) lab = 'keyboard ' + x.event.toLowerCase();
                    if (lab) best = lab;
                }
                return best;
            };
            refreshes.forEach((r, k) => {
                const next = refreshes[k + 1];
                const segEnd = next ? next.ts : ttifEnd;
                let lastRender = null;
                for (const e of events) {
                    if (e.ts <= r.ts) continue;
                    if (e.ts >= segEnd) break;
                    if (e.type === 'MEMO' && e.event === 'WATCHER_DRIVEN_RENDER') lastRender = e.ts;
                    else if (e.type === 'COMPONENT' && (e.event === 'UPDATE' || e.event === 'TTI')) {
                        const pg = e.pageName || compPage.get(e.name);
                        if (pg === v.pageName) lastRender = lastRender == null ? e.ts : Math.max(lastRender, e.ts);
                    }
                }
                if (lastRender == null) return;
                const end = Math.min(lastRender + 16, segEnd, r.ts + 800, ttifEnd);
                if (end - r.ts < 16) return;
                const w = writeEvents.find(x => x.ts > r.ts - 30 && x.ts <= end);
                cycles.push({ startTs: r.ts, endTs: end, writeDriven: !!w,
                              trigger: triggerFor(r.ts), writeName: w ? (w.name + (w.varType ? '·' + w.varType : '')) : null });
            });
        }
        const scriptMs   = cycles.reduce((a, c) => a + (c.writeDriven ? c.endTs - c.startTs : 0), 0);
        const rerenderMs = cycles.reduce((a, c) => a + (!c.writeDriven ? c.endTs - c.startTs : 0), 0);

        // Detailed lists for the expand-on-click drawer
        // API list: each VAR/ACTION invoke in [mountTs, ttifEnd].
        // Close on INVOKE_END (network + data write done). For error paths,
        // close on ERROR (INVOKE_END may not fire for failed requests).
        const apiList = [];
        const openApi = new Map();
        for (const e of events) {
            if (e.ts < v.mountTs) continue;
            if (e.ts > ttifEnd) break;
            if (e.type !== 'VAR' && e.type !== 'ACTION') continue;
            const k = e.scope + ':' + e.name;
            if (e.event === 'INVOKE_START') {
                openApi.set(k, { start: e.ts, name: e.name, scope: e.scope, vType: e.varType, type: e.type });
            } else if (e.event === 'INVOKE_END' && openApi.has(k)) {
                const ok = openApi.get(k);
                apiList.push({
                    name: ok.name, scope: ok.scope, type: ok.type, vType: ok.vType,
                    startTs: ok.start, endTs: e.ts,
                    ms: e.ts - ok.start,
                    status: 'success'
                });
                openApi.delete(k);
            } else if (e.event === 'ERROR' && openApi.has(k)) {
                const ok = openApi.get(k);
                apiList.push({
                    name: ok.name, scope: ok.scope, type: ok.type, vType: ok.vType,
                    startTs: ok.start, endTs: e.ts,
                    ms: e.ts - ok.start,
                    status: 'error'
                });
                openApi.delete(k);
            }
        }
        // In-flight at TTFI window end
        for (const [, ok] of openApi) {
            apiList.push({
                name: ok.name, scope: ok.scope, type: ok.type, vType: ok.vType,
                startTs: ok.start, endTs: ttifEnd,
                ms: ttifEnd - ok.start,
                status: 'in-flight'
            });
        }
        apiList.sort((a, b) => a.startTs - b.startTs);

        // SCRIPT/TIMEOUT_FIRED + INTERVAL_FIRED timers (only when trackLib on).
        const scriptList = [];
        for (const e of events) {
            if (e.ts < v.mountTs) continue;
            if (e.ts > v.mountTs + (ttfi || 0) + 2000) break;
            if (e.type === 'SCRIPT' && (e.event === 'TIMEOUT_FIRED' || e.event === 'INTERVAL_FIRED')) {
                scriptList.push({ kind: e.event === 'TIMEOUT_FIRED' ? 'setTimeout' : 'setInterval',
                    label: e.label || 'anonymous', scheduledMs: e.ms, actualMs: e.actual, ts: e.ts });
            }
        }
        // Drawer lists derived from the SAME cycles → sums match the columns.
        const writeList = cycles.filter(c => c.writeDriven).map(c => ({
            name: c.writeName || (c.trigger || 'write'), elapsedMs: c.endTs - c.startTs, ts: c.startTs
        }));
        const rerenderList = cycles.filter(c => !c.writeDriven).map((c, i) => ({
            name: 'Re-render ' + (i + 1) + (c.trigger ? ' ← ' + c.trigger : ''),
            totalMs: c.endTs - c.startTs, count: 1, maxMs: c.endTs - c.startTs
        }));

        // ── Build apiBreakdown so its math matches apiMs in the summary ──
        //   apiMs (summary) = collapsed wall-time of overlapping invokes + onSuccessMs
        // Expose the components so the drawer can show how the sum is derived.
        const apiBreakdown = {
            rawSumMs:    intervals.reduce((s, [a, b]) => s + (b - a), 0),
            wallMs:      apiMs,                 // collapsed wall (no onSuccess)
            onSuccessMs: onSuccessMs,
            totalMs:     apiMs + onSuccessMs    // = summary API column
        };

        return {
            pageName: v.pageName,
            mountTs: v.mountTs,
            renderMs: widgetTtis.length ? widgetTtis[0] - v.mountTs : (initialTti ?? 0),
            apiMs: totalApi,
            scriptMs,
            rerenderMs,
            ttfi: ttfi ?? 0,
            ttfiBasis: ttfiBasis,
            firstInteractionTs: firstInteractionTs,
            apiList,
            scriptList,
            writeList,
            rerenderList,
            apiBreakdown,
            cycles
        };
    });
}
const VISITS = computeVisits(events);
console.log(`Computed ${VISITS.length} visits`);

// ── Per-navigation breakdown (for the Navigation tab) ──────────────
// For each NAV/START: the trigger, dispatch, old-page activity AFTER dispatch
// (why teardown is delayed), old unmount, RN transition, new mount, new TTI.
function computeNavigations(events) {
    const navStartIdx = [];
    events.forEach((e, i) => { if (e.type === 'NAV' && e.event === 'START') navStartIdx.push(i); });
    return navStartIdx.map((navIdx, ni) => {
        const nav = events[navIdx];
        const start = nav.ts;
        const nextStart = ni + 1 < navStartIdx.length ? events[navStartIdx[ni + 1]].ts : Infinity;
        const winEnd = Math.min(nextStart, start + 12000);

        const disp = events.find(e => e.type === 'NAV' && e.event === 'DISPATCHED' && e.ts >= start && e.to === nav.to);
        // Triggering call: last VAR/ACTION SUCCESS or INVOKE_END within 500ms before NAV/START
        let trigger = null;
        for (let j = navIdx - 1; j >= 0; j--) {
            const x = events[j];
            if (start - x.ts > 500) break;
            if ((x.type === 'VAR' || x.type === 'ACTION') && (x.event === 'SUCCESS' || x.event === 'INVOKE_END')) { trigger = x; break; }
        }
        const fromContainer = nav.from + 'Page';
        const toFR = events.find(e => e.type === 'COMPONENT' && e.event === 'FRAGMENT_READY' && e.isPage && e.pageName === nav.to && e.ts >= start && e.ts <= winEnd);
        const toContainer = toFR ? toFR.name : nav.to + 'Page';
        const oldUnmount = events.find(e => e.type === 'COMPONENT' && e.event === 'UNMOUNT' && e.name === fromContainer && e.ts >= start && e.ts <= winEnd);
        const newMount = events.find(e => e.type === 'COMPONENT' && e.event === 'MOUNT' && e.name === toContainer && e.ts >= start && e.ts <= winEnd);
        const newTti = newMount ? events.find(e => e.type === 'COMPONENT' && e.event === 'TTI' && e.name === toContainer && e.ts >= newMount.ts && e.ts <= winEnd) : null;
        // The navigation is "done" when the new page container MOUNTs. The new
        // page's own render/TTI is page-load (shown in Waterfall/Summary), so the
        // detail timeline ends at the MOUNT.
        const detailEnd = newMount ? newMount.ts : (disp ? Math.min(disp.ts + 300, winEnd) : winEnd);

        // Condensed detail: individual lifecycle/binding/var events; widget-TTI
        // bursts (consecutive TTIs <12ms apart) collapsed into one "N renders" row.
        const detail = [];
        let burst = null;
        const flush = () => { if (burst) { detail.push({ kind: 'renders', rel: burst.rel, count: burst.count, last: burst.last }); burst = null; } };
        for (let j = 0; j < events.length; j++) {
            const x = events[j];
            if (x.ts < start) continue;   // timeline starts at NAV/START (0ms)
            if (x.ts > detailEnd) break;
            const rel = x.ts - start;
            if (x.type === 'COMPONENT' && x.event === 'TTI' && x.name !== toContainer && x.name !== fromContainer) {
                if (burst && rel - burst.last <= 12) { burst.count++; burst.last = rel; }
                else { flush(); burst = { rel, last: rel, count: 1 }; }
                continue;
            }
            flush();
            let kind = null, label = '';
            if (x.type === 'NAV') { kind = 'nav'; label = 'NAV/' + x.event + (x.event === 'DISPATCHED' && disp ? '' : ''); }
            else if (x.type === 'COMPONENT' && x.event === 'MOUNT') { kind = 'mount'; label = 'MOUNT ' + x.name; }
            else if (x.type === 'COMPONENT' && x.event === 'UNMOUNT') { kind = 'unmount'; label = 'UNMOUNT ' + x.name; }
            else if (x.type === 'COMPONENT' && x.event === 'TTI') { kind = 'tti'; label = 'TTI ' + x.name + (x.ms != null ? ' (' + x.ms.toFixed(0) + 'ms)' : ''); }
            else if (x.type === 'EVENT' && x.event === 'TRIGGER') { kind = 'binding'; label = 'EVENT ' + x.eventName + (x.name ? ' · ' + x.name : ''); }
            else if ((x.type === 'VAR' || x.type === 'ACTION') && x.event === 'INVOKE_START') { kind = 'api'; label = x.type + ' INVOKE_START ' + x.name + (x.varType ? '·' + x.varType : ''); }
            else if ((x.type === 'VAR' || x.type === 'ACTION') && (x.event === 'SUCCESS' || x.event === 'ERROR')) { kind = 'api'; label = x.type + ' ' + x.event + ' ' + x.name; }
            else if ((x.type === 'VAR' || x.type === 'ACTION') && x.event === 'INVOKE_END') { kind = 'api'; label = x.type + ' INVOKE_END ' + x.name + (x.ms != null ? ' (' + x.ms.toFixed(0) + 'ms)' : ''); }
            else if (x.type === 'VAR' && x.event === 'DATASETWRITE') { kind = 'write'; label = 'DATASETWRITE ' + x.name + (x.scope ? '·' + x.scope : ''); }
            if (kind) detail.push({ kind, rel, label });
        }
        flush();

        return {
            from: nav.from, to: nav.to, startTs: start,
            triggerName: trigger ? trigger.name : null,
            triggerType: trigger ? trigger.type : null,
            dispatchMs: disp ? disp.ts - start : null,
            oldUnmountMs: oldUnmount ? oldUnmount.ts - start : null,
            newMountMs: newMount ? newMount.ts - start : null,
            transitionMs: (oldUnmount && newMount) ? newMount.ts - oldUnmount.ts : null,
            newTtiMs: newTti ? newTti.ts - start : null,
            detail
        };
    });
}
const NAVIGATIONS = computeNavigations(events);
console.log(`Computed ${NAVIGATIONS.length} navigations`);

const firstTs = events[0].ts;
const lastTs  = events[events.length - 1].ts;
console.log(`Parsed ${events.length} events  span=${((lastTs - firstTs)/1000).toFixed(3)}s`);

// ── Section by navigation boundaries ───────────────────────────────
// Each section = [navStartIdx, nextNavStartIdx). Section 0 = pre-first-nav.
const sections = [];
let cur = { from: null, to: events[0]?.pageName || 'startup', startTs: firstTs, startIdx: 0, navStart: null };
events.forEach((e, i) => {
    if (e.type === 'NAV' && e.event === 'START') {
        cur.endIdx = i;
        cur.endTs = e.ts;
        sections.push(cur);
        cur = { from: e.from, to: e.to, startTs: e.ts, startIdx: i, navStart: e };
    }
});
cur.endIdx = events.length;
cur.endTs  = lastTs;
sections.push(cur);

console.log(`Sections: ${sections.length}`);
sections.forEach((s, i) => {
    console.log(`  [${i}] ${s.from || '-'} → ${s.to}  events=${s.endIdx - s.startIdx}  dur=${((s.endTs - s.startTs)/1000).toFixed(2)}s`);
});

// ── Emit HTML ──────────────────────────────────────────────────────
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>WM Perf Viewer — ${path.basename(LOG_PATH)}</title>
<style>
  :root {
    --bg: #0d1117; --panel: #161b22; --panel2: #1c232c; --border: #30363d;
    --fg: #e6edf3; --dim: #8b949e; --accent: #58a6ff; --warn: #d29922;
    --good: #3fb950; --bad: #f85149; --hi: #ffd33d;
    --nav: #a371f7; --user: #ffa657; --comp: #79c0ff; --watcher: #6e7681;
    --memo: #d2a8ff; --input: #ffa657; --http: #56d364; --var: #f0883e;
  }
  * { box-sizing: border-box; }
  body { margin: 0; font: 13px/1.4 ui-monospace, Menlo, Consolas, monospace; background: var(--bg); color: var(--fg); height: 100vh; overflow: hidden; }
  #app { display: grid; grid-template-columns: minmax(360px, 38%) 1fr; height: 100vh; }
  #left { display: flex; flex-direction: column; border-right: 1px solid var(--border); background: var(--panel); overflow-y: auto; }
  #leftHeader { padding: 12px 14px 8px; border-bottom: 1px solid var(--border); background: linear-gradient(180deg, var(--panel2), var(--panel)); }
  #leftHeader h1 { margin: 0 0 2px; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; color: var(--accent); }
  #leftHeader .sub { color: var(--dim); font-size: 11px; }
  #videoWrap { padding: 10px 14px 8px; display: flex; flex-direction: column; align-items: center; }
  #videoWrap video { width: auto; max-width: 100%; max-height: 55vh; background: #000; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.4); }
  #markerStrip { position: relative; height: 26px; margin: 6px 14px 6px; background: linear-gradient(180deg, #0d1117, #0a0e13); border: 1px solid var(--border); border-radius: 4px; overflow: hidden; cursor: pointer; flex-shrink: 0; }
  #markerStrip:empty::before { content: 'Marker strip — load video & set sync'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--dim); }
  #markerStrip .tick { position: absolute; top: 4px; bottom: 4px; width: 2px; pointer-events: auto; cursor: pointer; }
  #markerStrip .tick:hover { width: 4px; box-shadow: 0 0 4px currentColor; z-index: 3; }
  #markerStrip .playhead { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--hi); pointer-events: none; z-index: 4; box-shadow: 0 0 6px var(--hi); }
  #markerStrip .lane { position: absolute; left: 0; right: 0; height: 1px; background: var(--border); }
  #controls { padding: 10px 14px 12px; font-size: 12px; display: flex; flex-direction: column; gap: 10px; }
  .ctrlBlock { background: var(--panel2); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  .ctrlBlock .blockHead {
    font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--dim);
    padding: 8px 10px; display: flex; justify-content: space-between; align-items: center;
    cursor: pointer; user-select: none; gap: 8px;
  }
  .ctrlBlock .blockHead:hover { background: #232a35; }
  .ctrlBlock .blockHead .chev { display: inline-block; transition: transform 0.15s; color: var(--dim); margin-right: 4px; font-size: 9px; transform: rotate(90deg); }
  .ctrlBlock.collapsed .blockHead .chev { transform: rotate(0deg); }
  .ctrlBlock .blockHead .title { flex: 1; }
  .ctrlBlock .blockHead .badge { color: var(--accent); text-transform: none; letter-spacing: 0; font-size: 11px; }
  .ctrlBlock .blockBody { padding: 0 10px 10px; display: flex; flex-direction: column; gap: 8px; }
  .ctrlBlock.collapsed .blockBody { display: none; }
  /* Transport: time + goto */
  .timeRow { display: flex; align-items: center; gap: 10px; }
  .playBtn {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--accent); color: #0d1117; border: none;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; flex-shrink: 0;
    transition: transform 0.08s, background 0.12s;
  }
  .playBtn:hover { background: #79b8ff; }
  .playBtn:active { transform: scale(0.94); }
  .playBtn .ico { font-size: 14px; line-height: 1; padding-left: 2px; }
  .playBtn.playing .ico { padding-left: 0; }
  #timeBig { font: 700 22px/1 ui-monospace, Menlo, monospace; color: var(--hi); font-variant-numeric: tabular-nums; letter-spacing: 1px; }
  #timeBig .sep { color: var(--dim); margin: 0 4px; }
  #timeBig .dur { color: var(--dim); font-size: 14px; font-weight: 400; }
  .gotoRow { display: flex; gap: 6px; align-items: center; }
  .gotoRow input { flex: 1; min-width: 0; }
  /* Speed + nudge toolbar */
  .toolbar { display: flex; gap: 4px; align-items: center; flex-wrap: wrap; }
  .toolbar select { padding: 4px 6px; }
  .toolbar .nudge { display: flex; gap: 3px; margin-left: auto; }
  .toolbar .nudge button { padding: 4px 6px; min-width: 48px; font-size: 11px; }
  .toolbar .nudge button.fine { background: var(--panel); }
  /* Sync row */
  .syncRow { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .syncRow button { white-space: nowrap; }
  #syncStatus { font-size: 11px; color: var(--dim); flex: 1; min-width: 100%; padding-top: 2px; }
  #syncStatus.synced { color: var(--good); }
  .offsetRow { display: flex; gap: 6px; align-items: center; font-size: 11px; }
  .offsetRow label { color: var(--dim); }
  .offsetRow input { width: 80px; }
  /* Misc rows */
  .miscRow { display: flex; gap: 10px; align-items: center; font-size: 11px; flex-wrap: wrap; }
  .miscRow label { color: var(--dim); }
  .fileRow { font-size: 11px; }
  .fileRow input[type=file] { width: 100%; }
  .fileRow input[type=file]::-webkit-file-upload-button { background: var(--panel); color: var(--fg); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px; cursor: pointer; }
  .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .row label { color: var(--dim); }
  input[type=text], input[type=number], input[type=file], input[type=range], select {
    background: var(--bg); color: var(--fg);
    border: 1px solid var(--border); border-radius: 5px;
    padding: 5px 8px; font: inherit; outline: none;
    transition: border-color 0.12s, box-shadow 0.12s;
  }
  input[type=text]:hover, input[type=number]:hover, select:hover { border-color: #484f58; }
  input[type=text]:focus, input[type=number]:focus, select:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(88,166,255,0.18); }
  input[type=number] { font-variant-numeric: tabular-nums; }
  input[type=range] { flex: 1; padding: 0; }
  select {
    appearance: none; -webkit-appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, var(--dim) 50%), linear-gradient(135deg, var(--dim) 50%, transparent 50%);
    background-position: calc(100% - 14px) 50%, calc(100% - 9px) 50%;
    background-size: 5px 5px, 5px 5px;
    background-repeat: no-repeat;
    padding-right: 24px;
    cursor: pointer;
  }
  input[type=file] { padding: 3px 5px; cursor: pointer; }
  button {
    background: var(--bg); color: var(--fg);
    border: 1px solid var(--border); border-radius: 5px;
    padding: 5px 10px; cursor: pointer; font: inherit;
    transition: background 0.12s, border-color 0.12s;
  }
  button:hover { background: var(--panel2); border-color: #484f58; }
  button:active { transform: translateY(1px); }
  button.active { background: var(--accent); color: #0d1117; border-color: var(--accent); }
  button.primary { background: var(--accent); color: #0d1117; border-color: var(--accent); font-weight: 600; }
  button.primary:hover { background: #79b8ff; }
  input[type=checkbox] { accent-color: var(--accent); cursor: pointer; vertical-align: middle; }
  #syncStatus { font-size: 11px; color: var(--dim); }
  #syncStatus.synced { color: var(--good); }
  #stats { padding: 0 12px 12px; font-size: 11px; color: var(--dim); border-top: 1px solid var(--border); padding-top: 8px; }
  #stats b { color: var(--fg); }
  #right { overflow: hidden; padding: 0; background: var(--bg); display: flex; flex-direction: column; }
  #tabs { display: flex; gap: 2px; background: var(--panel2); border-bottom: 1px solid var(--border); padding: 6px 8px 0; }
  #tabs button { background: transparent; border: 1px solid transparent; border-bottom: none; padding: 6px 14px; color: var(--dim); border-radius: 4px 4px 0 0; cursor: pointer; font: inherit; }
  #tabs button.active { background: var(--bg); color: var(--fg); border-color: var(--border); }
  .tabBody { flex: 1; overflow-y: auto; padding: 12px; display: none; }
  .tabBody.active { display: block; }
  /* Navigation tab */
  #navigation { max-width: 960px; }
  .navCard { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; overflow: hidden; }
  .navCard .navHead { display: grid; grid-template-columns: 16px 1fr auto; gap: 10px; align-items: center; padding: 10px 14px; cursor: pointer; user-select: none; background: var(--panel2); }
  .navCard .navHead:hover { background: #232a35; }
  .navCard .navChev { color: var(--dim); font-size: 10px; transition: transform 0.15s; display: inline-block; transform: rotate(90deg); }
  .navCard.collapsed .navChev { transform: rotate(0deg); }
  .navCard .navTitle { font-weight: 600; }
  .navCard .navTitle .from { color: var(--dim); } .navCard .navTitle .to { color: var(--nav); }
  .navCard .navTotal { font-variant-numeric: tabular-nums; font-weight: 700; }
  .navCard .navTotal.fast { color: var(--good); } .navCard .navTotal.mid { color: var(--warn); } .navCard .navTotal.slow { color: var(--bad); }
  .navCard.collapsed .navBody { display: none; }
  .navCard .navBody { padding: 12px 14px; }
  .navMetrics { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .navMetric { background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 7px 11px; min-width: 110px; }
  .navMetric .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--dim); }
  .navMetric .val { font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums; margin-top: 2px; }
  .navMetric .val.fast { color: var(--good); } .navMetric .val.mid { color: var(--warn); } .navMetric .val.slow { color: var(--bad); } .navMetric .val.dim { color: var(--dim); }
  .navMetric .sub { font-size: 10px; color: var(--dim); margin-top: 1px; }
  .navTimeline { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; border-top: 1px dashed var(--border); padding-top: 8px; }
  .navTimeline .navEv { display: grid; grid-template-columns: 58px 12px 1fr; gap: 10px; align-items: center; padding: 2px 6px; border-radius: 4px; }
  .navTimeline .navEv:hover { background: var(--panel2); }
  .navTimeline .navEv .t { color: var(--dim); text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .navTimeline .navEv .dot { width: 9px; height: 9px; border-radius: 2px; }
  .navTimeline .navEv .lbl { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .navTimeline .navEv.nav .lbl { color: var(--nav); font-weight: 600; }
  .navTimeline .navEv.mount .lbl { color: var(--comp); font-weight: 600; }
  .navTimeline .navEv.unmount .lbl { color: #d98a8a; }
  .navTimeline .navEv.tti .lbl { color: var(--good); }
  .navTimeline .navEv.binding .lbl { color: var(--dim); }
  .navTimeline .navEv.api .lbl { color: var(--http); }
  .navTimeline .navEv.write .lbl { color: var(--var); }
  .navTimeline .navEv.renders .lbl { color: var(--memo); font-style: italic; }
  .navGap { color: var(--dim); font-style: italic; font-size: 10.5px; padding: 4px 0 4px 80px; }
  /* How it works docs */
  #howitworks { max-width: 920px; margin: 0 auto; padding-bottom: 40px; }
  #howitworks .hwIntro { color: var(--dim); font-size: 12px; line-height: 1.6; margin-bottom: 16px; padding: 12px 14px; background: var(--panel); border: 1px solid var(--border); border-radius: 8px; }
  #howitworks .hwIntro b { color: var(--fg); }
  .hwCard { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 14px; overflow: hidden; }
  .hwCard > .hwHead { display: flex; align-items: center; gap: 10px; padding: 11px 14px; background: var(--panel2); border-bottom: 1px solid var(--border); }
  .hwCard .hwDot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
  .hwCard .hwTitle { font-weight: 600; font-size: 13px; color: var(--fg); }
  .hwCard .hwTag { margin-left: auto; font-size: 10px; color: var(--dim); font-family: ui-monospace, Menlo, monospace; }
  .hwCard .hwBody { padding: 12px 14px; font-size: 12px; line-height: 1.65; color: var(--fg); }
  .hwCard .hwBody p { margin: 0 0 9px; }
  .hwCard .hwBody p:last-child { margin-bottom: 0; }
  .hwCard .hwBody .dim { color: var(--dim); }
  .hwFormula { font-family: ui-monospace, Menlo, monospace; font-size: 11.5px; background: var(--bg); border: 1px solid var(--border); border-left: 3px solid var(--accent); border-radius: 5px; padding: 9px 12px; margin: 9px 0; color: var(--fg); white-space: pre-wrap; line-height: 1.6; }
  .hwCard code { font-family: ui-monospace, Menlo, monospace; font-size: 11px; background: var(--panel2); border: 1px solid var(--border); border-radius: 3px; padding: 1px 5px; color: var(--accent); white-space: nowrap; }
  .hwSteps { margin: 8px 0 0; padding: 0; list-style: none; counter-reset: hw; }
  .hwSteps li { position: relative; padding: 5px 0 5px 30px; counter-increment: hw; }
  .hwSteps li::before { content: counter(hw); position: absolute; left: 0; top: 4px; width: 18px; height: 18px; border-radius: 50%; background: var(--accent); color: #0d1117; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .hwNote { font-size: 11px; color: var(--dim); font-style: italic; margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border); }
  .hwPills { display: flex; flex-wrap: wrap; gap: 5px; margin: 8px 0; }
  .hwPill { font-size: 10px; padding: 3px 8px; border-radius: 10px; color: #0d1117; font-weight: 600; }
  /* Summary table */
  .summaryWrap { font-size: 12px; }
  .flowPath { color: var(--dim); padding: 8px 4px 12px; line-height: 1.6; word-break: break-word; font-size: 12px; }
  .flowPath b { color: var(--fg); margin-right: 6px; }
  .flowPath .seg { color: var(--nav); font-weight: 600; }
  .flowPath .arrow { color: var(--border); margin: 0 4px; }
  table.summary { width: 100%; border-collapse: collapse; font-size: 12px; background: var(--panel); border-radius: 6px; overflow: hidden; }
  table.summary th, table.summary td { padding: 9px 14px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  table.summary th { color: var(--dim); font-weight: 600; background: var(--panel2); position: sticky; top: 0; text-align: right; font-size: 10px; text-transform: uppercase; letter-spacing: 0.6px; z-index: 1; }
  table.summary th.colPage { text-align: left; width: 100%; }
  table.summary th.colNum  { width: 1%; white-space: nowrap; }
  table.summary th.colTtif { width: 1%; white-space: nowrap; }
  table.summary td.page { text-align: left; color: var(--nav); font-weight: 600; }
  table.summary td.num { font-variant-numeric: tabular-nums; text-align: right; color: var(--warn); white-space: nowrap; }
  table.summary td.num.dim { color: var(--dim); }
  table.summary td.ttif { font-variant-numeric: tabular-nums; text-align: right; color: var(--good); font-weight: 600; white-space: nowrap; }
  table.summary tr.dataRow { cursor: pointer; }
  table.summary tr.dataRow:hover td { background: var(--panel); }
  table.summary tr.dataRow.current td { background: rgba(88, 166, 255, 0.18); }
  table.summary tr.dataRow.future td { opacity: 0.4; }
  table.summary tr.totalRow td { background: var(--panel2); font-weight: 600; border-top: 2px solid var(--border); border-bottom: none; }
  table.summary tr.totalRow td.page { color: var(--fg); }
  table.summary tr.pctRow td { background: var(--panel2); font-size: 10px; color: var(--dim); padding-top: 2px; padding-bottom: 7px; border-bottom: 1px solid var(--border); }
  table.summary tr.detailRow td { background: var(--bg); padding: 0; border-bottom: 1px solid var(--border); }
  .visitDrawer { display: none; padding: 12px 16px; background: var(--bg); }
  .visitDrawer.open { display: block; }
  .visitDrawer h4 { margin: 0 0 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.6px; color: var(--dim); font-weight: 600; }
  .visitDrawer .vdSection { margin-bottom: 12px; }
  .visitDrawer .vdSection:last-child { margin-bottom: 0; }
  .visitDrawer .vdGrid { display: grid; grid-template-columns: 1fr auto auto; gap: 4px 12px; font-size: 12px; }
  .visitDrawer .vdGrid .name { color: var(--fg); }
  .visitDrawer .vdGrid .meta { color: var(--dim); font-size: 11px; }
  .visitDrawer .vdGrid .ms { color: var(--warn); font-variant-numeric: tabular-nums; text-align: right; }
  .visitDrawer .vdGrid .ms.fast { color: var(--good); }
  .visitDrawer .vdGrid .ms.slow { color: var(--bad); font-weight: 600; }
  .visitDrawer .vdGrid .status { font-size: 10px; padding: 1px 6px; border-radius: 3px; text-align: center; }
  .visitDrawer .vdGrid .status.success { background: var(--good); color: #0d1117; }
  .visitDrawer .vdGrid .status.error { background: var(--bad); color: #fff; }
  .visitDrawer .vdGrid .status.in-flight { background: var(--warn); color: #0d1117; }
  .visitDrawer .vdEmpty { color: var(--dim); font-style: italic; font-size: 11px; }
  .visitDrawer .vdFooter { margin-top: 8px; padding-top: 6px; border-top: 1px dashed var(--border); font-size: 11px; color: var(--dim); }
  .visitDrawer .vdFooter > div { display: flex; justify-content: space-between; padding: 2px 0; }
  .visitDrawer .vdFooter .lbl { color: var(--dim); }
  .visitDrawer .vdFooter .val { color: var(--fg); font-variant-numeric: tabular-nums; }
  .visitDrawer .vdFooter .totalLine { margin-top: 4px; padding-top: 4px; border-top: 1px solid var(--border); font-weight: 600; }
  .visitDrawer .vdFooter .totalLine .val { color: var(--warn); }
  table.summary tr.dataRow .expandIcon { display: inline-block; width: 12px; color: var(--dim); transition: transform 0.15s; margin-right: 4px; font-size: 10px; }
  table.summary tr.dataRow.expanded .expandIcon { transform: rotate(90deg); }
  .badge-ok { color: var(--good); margin-left: 4px; }
  .badge-warn { color: var(--warn); margin-left: 4px; }
  .badge-bad { color: var(--bad); margin-left: 4px; }
  /* Waterfall */
  #waterfall { box-sizing: border-box; }
  .wf { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 10px; box-sizing: border-box; overflow: hidden; }
  .wf.current { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .wf .wfHead { padding: 8px 12px; display: flex; align-items: baseline; gap: 10px; cursor: pointer; user-select: none; background: var(--panel2); }
  .wf .wfHead:hover { background: #232a35; }
  .wf .wfTitle { font-weight: 600; flex: 1; }
  .wf .wfMeta { color: var(--dim); font-size: 11px; }
  .wf .wfTtif { color: var(--good); font-size: 11px; font-weight: 600; background: rgba(63,185,80,0.12); padding: 2px 8px; border-radius: 3px; }
  .wf .wfChevron { color: var(--dim); font-size: 10px; display: inline-block; transition: transform 0.15s; transform: rotate(90deg); }
  .wf.collapsed .wfChevron { transform: rotate(0deg); }
  .wf.collapsed .wfBody { display: none; }
  .wf .wfBody { padding: 10px 12px 12px; box-sizing: border-box; }
  .wf .chipFlow { display: flex; flex-wrap: wrap; gap: 4px 6px; align-items: center; padding: 6px 8px; background: var(--bg); border-radius: 5px; margin-bottom: 12px; font-size: 11px; }
  .wf .chipFlow .ph { padding: 3px 8px; border-radius: 10px; color: #0d1117; font-weight: 600; cursor: pointer; line-height: 1.4; }
  .wf .chipFlow .ph:hover { box-shadow: 0 0 0 2px rgba(255,255,255,0.25); }
  .wf .chipFlow .arrow { color: var(--dim); font-size: 10px; }
  .wf .axis { position: relative; height: 18px; color: var(--dim); font-size: 9px; margin-left: 188px; margin-right: 68px; }
  .wf .axis .gridLabel { position: absolute; top: 0; transform: translateX(-50%); padding: 0 3px; background: var(--panel); white-space: nowrap; z-index: 1; }
  .wf .axis .gridLabel.first { transform: none; left: 0 !important; }
  .wf .axis .gridLabel.last  { transform: none; right: 0; left: auto !important; color: var(--good); }
  .wf .axis .gridLabel.dimmed { opacity: 0; pointer-events: none; }
  .wf .axis .gridLabel.sel   {
    color: #0d1117; background: var(--hi); font-weight: 700;
    border-radius: 3px; padding: 1px 5px; z-index: 3;
    box-shadow: 0 0 0 1px var(--hi);
  }
  .wf .rows { position: relative; margin-top: 2px; }
  .wf .tickOverlay { position: absolute; top: 0; bottom: 0; left: 188px; right: 68px; pointer-events: none; z-index: 0; }
  .wf .tickOverlay .vline { position: absolute; top: 0; bottom: 0; width: 0; border-left: 1px dashed rgba(255,255,255,0.10); }
  .wf .tickOverlay .vline.first { border-left-color: rgba(255,255,255,0.22); }
  .wf .tickOverlay .vline.last  { border-left-color: rgba(63,185,80,0.5); }
  .wf .tickOverlay .vline.sel   { border-left: 1px solid var(--hi); opacity: 0.85; }
  .wf .wfRow .bar.selected { box-shadow: 0 0 0 2px var(--hi); opacity: 1; }
  .wf .wfRow .track { z-index: 1; }
  .wf .playLine { z-index: 5; }
  .wf .wfRow { display: grid; grid-template-columns: 180px 1fr 60px; gap: 8px; align-items: center; padding: 3px 0; min-height: 22px; box-sizing: border-box; }
  .wf .wfRow .label { color: var(--fg); font-size: 11px; line-height: 1.35; word-break: break-word; white-space: normal; min-width: 0; }
  .wf .wfRow .track { position: relative; height: 16px; background: #0d1117; border-radius: 3px; cursor: pointer; min-width: 0; overflow: visible; }
  .wf .wfRow .bar { position: absolute; top: 0; bottom: 0; border-radius: 3px; opacity: 0.85; }
  .wf .wfRow .bar.future { opacity: 0.18; }
  .wf .wfRow .bar.current { box-shadow: 0 0 0 1px var(--hi); }
  .wf .wfRow .dur { color: var(--warn); font-size: 11px; font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
  .wf .playLine { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--hi); pointer-events: none; z-index: 5; box-shadow: 0 0 4px var(--hi); }
  .wfLegend { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; margin-bottom: 10px; display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; }
  .wfLegend .item { display: inline-flex; align-items: center; gap: 6px; color: var(--dim); }
  .wfLegend .sw { display: inline-block; width: 14px; height: 10px; border-radius: 2px; }
  .section { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; margin-bottom: 12px; overflow: hidden; }
  .section.current { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .secHead { padding: 8px 12px; display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; background: var(--panel2); }
  .secHead:hover { background: #232a35; }
  .secBadge { background: var(--nav); color: #0d1117; padding: 2px 6px; border-radius: 3px; font-size: 10px; font-weight: 700; }
  .secTitle { flex: 1; font-weight: 600; }
  .secMeta { font-size: 11px; color: var(--dim); }
  .secBody { padding: 6px 0; max-height: 600px; overflow-y: auto; display: block; }
  .section.collapsed .secBody { display: none; }
  .density { height: 18px; margin: 0 12px 8px; display: flex; gap: 1px; align-items: stretch; background: #0d1117; border-radius: 3px; padding: 2px; }
  .density .cell { flex: 1; min-width: 2px; background: var(--watcher); opacity: 0.3; border-radius: 1px; cursor: pointer; }
  .density .cell:hover { opacity: 1; }
  .ev { display: grid; grid-template-columns: 64px 140px 1fr 64px; gap: 8px; padding: 4px 12px; align-items: start; cursor: pointer; border-left: 3px solid transparent; font-size: 12px; min-width: 0; }
  .ev:hover { background: #1f2630; }
  .ev.current { background: rgba(88, 166, 255, 0.18); border-left-color: var(--accent); }
  .ev.future { opacity: 0.35; }
  .ev .t { color: var(--dim); font-variant-numeric: tabular-nums; padding-top: 2px; }
  .ev .tag { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 3px; text-align: center; line-height: 1.2; white-space: nowrap; }
  .ev .tag .glyph { opacity: 0.85; font-size: 9px; }
  .ev .tag.invokeStart { background: var(--var); color: #0d1117; opacity: 0.7; }
  .ev .tag.success { background: #3fb950; color: #0d1117; }
  .ev .tag.error { background: #f85149; color: #fff; }
  .ev .body { color: var(--fg); word-break: break-word; min-width: 0; padding-top: 2px; line-height: 1.35; }
  .ev .body .k { color: var(--dim); }
  .ev .ms { font-variant-numeric: tabular-nums; font-size: 11px; text-align: right; padding-top: 2px; color: var(--dim); }
  .ev .ms.fast { color: var(--good); }
  .ev .ms.mid  { color: var(--warn); }
  .ev .ms.slow { color: var(--bad); font-weight: 600; }
  .ev .ms.neutral { color: var(--dim); }
  .tlLegend { padding: 8px 14px; background: var(--panel); border: 1px solid var(--border); border-radius: 5px; display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; color: var(--dim); margin: 0 0 10px; }
  .tlLegend .item { display: inline-flex; align-items: center; gap: 5px; }
  .tlLegend .dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
  .tlLegend .glyph { display: inline-block; font-weight: 700; min-width: 14px; text-align: center; }
  .tag.NAV { background: var(--nav); color: #0d1117; }
  .tag.USER { background: var(--user); color: #0d1117; }
  .tag.COMPONENT { background: var(--comp); color: #0d1117; }
  .tag.WATCHER { background: var(--watcher); color: #fff; }
  .tag.MEMO { background: var(--memo); color: #0d1117; }
  .tag.APP { background: #f85149; color: #fff; }
  .tag.INPUT { background: var(--input); color: #0d1117; }
  .tag.HTTP { background: var(--http); color: #0d1117; }
  .tag.VAR, .tag.ACTION { background: var(--var); color: #0d1117; }
  .tag.SPINNER, .tag.MODAL, .tag.TOAST, .tag.DISPLAY { background: #6e7681; color: #fff; }
  .tag.KEYBOARD, .tag.EVENT, .tag.PAGE, .tag.META, .tag.A11Y, .tag.NETWORK, .tag.ERROR, .tag.AUTH, .tag.SCRIPT, .tag.LOCALE { background: #484f58; color: #fff; }
  /* Timeline sticky header = chips + legend, stuck together below the tab bar */
  #tlHeader { position: sticky; top: -12px; z-index: 10; background: var(--bg); margin: -12px -12px 8px; border-bottom: 1px solid var(--border); }
  #filters, #wfFilters { padding: 8px 12px; display: flex; gap: 6px; flex-wrap: wrap; background: var(--bg); }
  #wfFilters { border-bottom: 1px solid var(--border); position: sticky; top: -12px; z-index: 10; margin: -12px -12px 8px; }
  #tlLegendTop .tlLegend.top { margin: 0; border: none; border-top: 1px solid var(--border); border-radius: 0; background: var(--panel2); }
  .tlLegend .cir { font-size: 11px; }
  #filters .chip { padding: 2px 8px; border-radius: 10px; background: var(--panel2); color: var(--dim); cursor: pointer; font-size: 11px; border: 1px solid var(--border); }
  #filters .chip.on { background: var(--accent); color: #0d1117; border-color: var(--accent); }
  .scrubLine { position: absolute; left: 0; right: 0; height: 1px; background: var(--accent); pointer-events: none; z-index: 5; }
  #leftHeader { padding: 12px 12px 0; }
  #leftHeader h1 { margin: 0 0 4px; font-size: 14px; }
  #leftHeader .sub { color: var(--dim); font-size: 11px; }
</style>
</head>
<body>
<div id="app">
  <aside id="left">
    <div id="leftHeader">
      <h1>WM Perf Viewer</h1>
      <div class="sub">${path.basename(LOG_PATH)} — ${events.length} events, ${((lastTs - firstTs)/1000).toFixed(2)}s</div>
    </div>
    <div id="videoWrap">
      <video id="vid" playsinline></video>
    </div>
    <div id="markerStrip" title="Event markers (after sync). Click to seek."></div>
    <div id="controls">
      <!-- Transport: time + goto -->
      <div class="ctrlBlock" id="blockTime">
        <div class="blockHead"><span class="chev">▶</span><span class="title">Time</span><span class="badge" id="speedBadge">1x</span></div>
        <div class="blockBody">
          <div class="timeRow">
            <button id="playBtn" class="playBtn" title="Play / pause (Space)" aria-label="Play"><span class="ico">▶</span></button>
            <div id="timeBig"><span id="timeCur">00:000</span><span class="sep">/</span><span class="dur" id="timeDur">00:000</span></div>
          </div>
          <div class="gotoRow">
            <input type="text" id="gotoInput" placeholder="goto: 39.247 or 39:247">
            <button id="gotoBtn" class="primary">Go</button>
          </div>
          <div class="toolbar">
            <label style="color:var(--dim)">Speed</label>
            <select id="speed">
              <option value="0.1">0.1x</option>
              <option value="0.25">0.25x</option>
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1" selected>1x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
            <span class="nudge">
              <button class="fine" data-nudge="-0.1" title="−100ms (,)">−100</button>
              <button class="fine" data-nudge="-0.05" title="−50ms (←)">−50</button>
              <button class="fine" data-nudge="0.05" title="+50ms (→)">+50</button>
              <button class="fine" data-nudge="0.1" title="+100ms (.)">+100</button>
            </span>
          </div>
          <div class="miscRow">
            <label><input type="checkbox" id="autoScroll" checked> auto-scroll</label>
            <label>markers</label>
            <select id="markerMode">
              <option value="key" selected>Key events</option>
              <option value="all">All visible</option>
              <option value="nav">Nav only</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sync block -->
      <div class="ctrlBlock" id="blockSync">
        <div class="blockHead"><span class="chev">▶</span><span class="title">Sync</span><span class="badge" id="syncBadge" style="color:var(--dim)">offset 0.000s</span></div>
        <div class="blockBody">
          <div class="syncRow">
            <button id="syncBtn">Set sync point</button>
            <div class="offsetRow">
              <label>offset</label>
              <input type="number" id="offsetNum" step="0.001" value="0">
              <button id="resetOffset">reset</button>
            </div>
            <div id="syncStatus">No sync — log starts at video t=0</div>
          </div>
        </div>
      </div>

      <!-- View block -->
      <div class="ctrlBlock" id="blockView">
        <div class="blockHead"><span class="chev">▶</span><span class="title">View</span><span class="badge" id="stats" style="color:var(--dim);font-size:10px"></span></div>
        <div class="blockBody">
          <div class="fileRow">
            <input type="file" id="videoFile" accept="video/*">
          </div>
        </div>
      </div>
    </div>
  </aside>
  <main id="right">
    <div id="tabs">
      <button data-tab="timeline" class="active">Flow Timeline</button>
      <button data-tab="summary">Page Flow Summary</button>
      <button data-tab="waterfall">Page Waterfall</button>
      <button data-tab="navigation">Navigation</button>
      <button data-tab="howitworks">How it Works</button>
    </div>
    <div class="tabBody active" data-tab="timeline">
      <div id="tlHeader">
        <div id="filters"></div>
        <div id="tlLegendTop"></div>
      </div>
      <div id="timeline"></div>
    </div>
    <div class="tabBody" data-tab="summary">
      <div id="summary"></div>
    </div>
    <div class="tabBody" data-tab="waterfall">
      <div id="wfToolbar" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg);position:sticky;top:-12px;z-index:10;margin:-12px -12px 8px;font-size:11px">
        <label style="display:inline-flex;gap:6px;align-items:center;cursor:pointer">
          <input type="checkbox" id="wfTtfiOnly" checked>
          <span>Show only up to <b style="color:var(--good)">TTFI</b></span>
        </label>
        <span style="color:var(--dim)">— when off, the waterfall extends to the next navigation</span>
      </div>
      <div id="waterfall"></div>
    </div>
    <div class="tabBody" data-tab="navigation">
      <div id="navigation"></div>
    </div>
    <div class="tabBody" data-tab="howitworks">
      <div id="howitworks"></div>
    </div>
  </main>
</div>
<script>
const EVENTS = ${JSON.stringify(events)};
const SECTIONS = ${JSON.stringify(sections.map(s => ({
    from: s.from, to: s.to, startTs: s.startTs, endTs: s.endTs,
    startIdx: s.startIdx, endIdx: s.endIdx
})))};
const VISITS = ${JSON.stringify(VISITS)};
const NAVIGATIONS = ${JSON.stringify(NAVIGATIONS)};
const FIRST_TS = ${firstTs};

// ── State ──────────────────────────────────────────────────────────
let offsetSec = 0;       // videoTime = (logTs - FIRST_TS)/1000 + offsetSec
let pendingSyncLogTs = null;
const filters = new Set(); // event types HIDDEN

const $ = (id) => document.getElementById(id);
const vid = $('vid');

// Map log ts → video time (seconds)
const tsToVideo = (ts) => (ts - FIRST_TS) / 1000 + offsetSec;
const videoToTs = (vt) => (vt - offsetSec) * 1000 + FIRST_TS;

// Filter chips — full list of all known tracker event types (even when this log
// contains zero events of that type, the chip is still shown so the user can pre-enable it).
// MOUNT and UNMOUNT are pseudo-chips that split out COMPONENT/MOUNT and
// COMPONENT/UNMOUNT from the broad COMPONENT type, so page mount/unmount can be
// toggled independently of TTI/UPDATE/SETSTATE_QUEUED/FRAGMENT_READY.
const ALL_TYPES = ['ACTION','A11Y','APP','AUTH','COMPONENT','MOUNT','UNMOUNT','DISPLAY','ERROR','EVENT','HTTP','INPUT','KEYBOARD','LOCALE','MEMO','META','MODAL','NAV','NETWORK','PAGE','SCRIPT','SPINNER','TOAST','USER','VAR','WATCHER'];
const DEFAULT_ON = new Set(['ACTION','USER','DISPLAY','EVENT','INPUT','KEYBOARD','NAV','SPINNER','VAR','MOUNT','UNMOUNT']);
// Anything NOT in DEFAULT_ON starts hidden.
ALL_TYPES.forEach(t => { if (!DEFAULT_ON.has(t)) filters.add(t); });
// Map an event to its chip key (MOUNT/UNMOUNT split out of COMPONENT).
function chipKey(e) {
    if (e.type === 'COMPONENT') {
        if (e.event === 'MOUNT') return 'MOUNT';
        if (e.event === 'UNMOUNT') return 'UNMOUNT';
    }
    return e.type;
}
function renderFilters() {
    const el = $('filters');
    el.innerHTML = '';
    ALL_TYPES.forEach(t => {
        const c = document.createElement('span');
        c.className = 'chip' + (filters.has(t) ? '' : ' on');
        c.textContent = t;
        const count = EVENTS.reduce((s, e) => s + (chipKey(e) === t ? 1 : 0), 0);
        c.title = t + ' — ' + count + ' events';
        if (count === 0) c.style.opacity = '0.45';
        c.onclick = () => { filters.has(t) ? filters.delete(t) : filters.add(t); renderFilters(); renderTimeline(); renderMarkers(); };
        el.appendChild(c);
    });
}

// Glyph + tag variant for INVOKE/SUCCESS/ERROR differentiation
function tagGlyph(e) {
    if (e.type === 'VAR' || e.type === 'ACTION') {
        if (e.event === 'INVOKE_START') return { glyph: '▶', cls: 'invokeStart' };
        if (e.event === 'SUCCESS')      return { glyph: '✓', cls: 'success' };
        if (e.event === 'ERROR')        return { glyph: '✗', cls: 'error' };
        if (e.event === 'INVOKE_END')   return { glyph: '■', cls: '' };
        if (e.event === 'DATASETWRITE') return { glyph: '✎', cls: '' };
    }
    if (e.type === 'HTTP') {
        if (e.event === 'REQUEST')        return { glyph: '▶', cls: 'invokeStart' };
        if (e.event === 'RESPONSE')       return { glyph: '✓', cls: 'success' };
        if (e.event === 'RESPONSE_ERROR') return { glyph: '✗', cls: 'error' };
    }
    return { glyph: '', cls: '' };
}

// Events whose ms field is NOT a work duration — it's idle time, threshold, etc.
// Don't color these with the duration palette.
const NON_WORK_MS = new Set([
    'USER/IDLE_END',     // ms = how long user was idle (expected)
    'USER/IDLE_START',
    'KEYBOARD/HIDE',     // ms = how long the keyboard was visible
    'SPINNER/HIDE',      // ms = how long spinner was visible
    'MODAL/HIDE', 'TOAST/HIDE', 'DISPLAY/HIDE'
]);
// Color class for ms duration
function msClass(ms, e) {
    if (ms == null) return '';
    if (e && NON_WORK_MS.has(e.type + '/' + e.event)) return 'neutral';
    if (ms <= 100) return 'fast';
    if (ms <= 500) return 'mid';
    return 'slow';
}

// Pretty body for an event
function eventBody(e) {
    const parts = [];
    if (e.name) parts.push('<b>' + esc(e.name) + '</b>');
    if (e.pageName && e.pageName !== e.name && e.pageName !== 'fragment') parts.push('<span class="k">@</span>' + esc(e.pageName));
    if (e.from && e.to) parts.push(esc(e.from) + ' → ' + esc(e.to));
    if (e.branch) parts.push('[' + esc(e.branch) + ']');
    if (e.eventName) parts.push('(' + esc(e.eventName) + ')');
    if (e.url) parts.push(esc(e.url));
    if (e.status != null) parts.push('<span class="k">status=</span>' + e.status);
    if (e.method) parts.push('<span class="k">' + esc(e.method.toUpperCase()) + '</span>');
    if (e.scope) parts.push('<span class="k">scope=</span>' + esc(e.scope));
    if (e.varType) parts.push('<span class="k">type=</span>' + esc(e.varType));
    if (e.trigger) parts.push('<span class="k">trigger=</span>' + esc(e.trigger));
    if (e.kind) parts.push('<span class="k">kind=</span>' + esc(e.kind));
    if (e.changedProps) parts.push('[' + e.changedProps.map(esc).join(',') + ']');
    if (e.props && Array.isArray(e.props)) parts.push('[' + e.props.map(esc).join(',') + ']');
    if (e.source) parts.push('<span class="k">src=</span>' + esc(e.source));
    if (e.updateon) parts.push('<span class="k">updateon=</span>' + esc(e.updateon));
    if (e.committed != null) parts.push('<span class="k">committed=</span>' + e.committed);
    if (e.key) parts.push('<span class="k">key=</span>' + esc(e.key));
    if (e.len != null) parts.push('<span class="k">len=</span>' + e.len);
    if (e.message) parts.push('"' + esc(e.message) + '"');
    if (e.count !== undefined) parts.push('<span class="k">count=</span>' + e.count);
    if (e.height !== undefined) parts.push('<span class="k">h=</span>' + e.height);
    if (e.duration !== undefined && e.type !== 'KEYBOARD') parts.push('<span class="k">dur=</span>' + e.duration);
    if (e.delay != null) parts.push('<span class="k">delay=</span>' + e.delay + 'ms');
    if (e.actual != null) parts.push('<span class="k">actual=</span>' + e.actual.toFixed(0) + 'ms');
    if (e.threshold != null) parts.push('<span class="k">threshold=</span>' + e.threshold + 'ms');
    if (e.label && e.type === 'SCRIPT') parts.push('<span class="k">label=</span>' + esc(e.label));
    if (e.connected != null) parts.push('<span class="k">connected=</span>' + e.connected);
    if (e.available != null) parts.push('<span class="k">available=</span>' + e.available);
    if (e.needsRestart != null) parts.push('<span class="k">needsRestart=</span>' + e.needsRestart);
    if (e.process) parts.push('<span class="k">process=</span>' + esc(e.process));
    if (e.enabled != null && e.type === 'A11Y') parts.push('<span class="k">enabled=</span>' + e.enabled);
    if (e.version) parts.push('<span class="k">v=</span>' + esc(e.version));
    if (e.platform) parts.push('<span class="k">platform=</span>' + esc(e.platform));
    if (e.complete != null) parts.push('<span class="k">complete=</span>' + e.complete);
    if (e.isPage != null && e.event === 'FRAGMENT_READY') parts.push('<span class="k">isPage=</span>' + e.isPage);
    return parts.join(' ');
}
function esc(s) { return String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

// ── Timeline render ────────────────────────────────────────────────
function legendHTML(className) {
    return '<div class="tlLegend ' + className + '">' +
        '<span class="item"><b>Duration:</b></span>' +
        '<span class="item"><span class="cir" style="color:var(--good)">●</span> ≤ 100ms (fast)</span>' +
        '<span class="item"><span class="cir" style="color:var(--warn)">●</span> ≤ 500ms (mid)</span>' +
        '<span class="item"><span class="cir" style="color:var(--bad)">●</span> > 500ms (slow)</span>' +
        '<span class="item"><b>Invoke pairs:</b></span>' +
        '<span class="item"><span class="glyph" style="color:var(--var)">▶</span> start</span>' +
        '<span class="item"><span class="glyph" style="color:var(--good)">✓</span> success</span>' +
        '<span class="item"><span class="glyph" style="color:var(--bad)">✗</span> error</span>' +
        '<span class="item"><span class="glyph">■</span> end</span>' +
        '<span class="item"><span class="glyph" style="color:var(--var)">✎</span> dataset write</span>' +
    '</div>';
}

function renderTimeline() {
    // Top legend lives in the sticky header (#tlLegendTop), rendered once.
    const lt = $('tlLegendTop');
    if (lt && !lt.firstChild) lt.innerHTML = legendHTML('top');

    const tl = $('timeline');
    tl.innerHTML = '';

    SECTIONS.forEach((s, sIdx) => {
        const sliceEvents = EVENTS.slice(s.startIdx, s.endIdx);
        const visible = sliceEvents.filter(e => !filters.has(chipKey(e)));
        const watcherCount = sliceEvents.filter(e => e.type === 'WATCHER' && e.event === 'CHECK_START').length;
        const renderCount  = sliceEvents.filter(e => e.type === 'MEMO' && e.event === 'WATCHER_DRIVEN_RENDER').length;

        const sec = document.createElement('div');
        sec.className = 'section' + (sIdx === 0 ? '' : '');
        sec.dataset.idx = sIdx;
        sec.dataset.startVt = tsToVideo(s.startTs).toFixed(3);
        sec.dataset.endVt   = tsToVideo(s.endTs).toFixed(3);

        const head = document.createElement('div');
        head.className = 'secHead';
        head.innerHTML = \`
            <span class="secBadge">\${s.from ? 'NAV' : 'INIT'}</span>
            <span class="secTitle">\${s.from ? s.from + ' → ' + s.to : 'Session start → ' + (s.to || 'startup')}</span>
            <span class="secMeta">\${((s.endTs - s.startTs)/1000).toFixed(2)}s · \${sliceEvents.length} ev</span>
        \`;
        head.onclick = () => sec.classList.toggle('collapsed');
        sec.appendChild(head);

        // Density bar for watcher cycles
        if (watcherCount > 0) {
            const buckets = 60;
            const bucket = new Array(buckets).fill(0);
            const span = s.endTs - s.startTs || 1;
            sliceEvents.forEach(e => {
                if (e.type === 'WATCHER' && e.event === 'CHECK_START') {
                    const b = Math.min(buckets - 1, Math.floor((e.ts - s.startTs) / span * buckets));
                    bucket[b]++;
                }
            });
            const max = Math.max(...bucket, 1);
            const dens = document.createElement('div');
            dens.className = 'density';
            bucket.forEach((c, i) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.style.opacity = (0.15 + 0.85 * (c / max)).toFixed(2);
                cell.title = \`bucket \${i}: \${c} watcher cycles\`;
                cell.onclick = (ev) => {
                    ev.stopPropagation();
                    vid.currentTime = tsToVideo(s.startTs + span * i / buckets);
                };
                dens.appendChild(cell);
            });
            sec.appendChild(dens);
        }

        const body = document.createElement('div');
        body.className = 'secBody';

        visible.forEach(e => {
            const row = document.createElement('div');
            row.className = 'ev';
            row.dataset.seq = e.seq;
            row.dataset.ts = e.ts;
            const vt = tsToVideo(e.ts);
            const secVid = Math.floor(vt);
            const ms = Math.floor((vt - secVid) * 1000);
            const tg = tagGlyph(e);
            const msc = msClass(e.ms, e);
            row.innerHTML = \`
                <span class="t">\${String(secVid).padStart(2,'0')}.\${String(ms).padStart(3,'0')}</span>
                <span class="tag \${e.type} \${tg.cls}">\${tg.glyph ? '<span class="glyph">' + tg.glyph + '</span>' : ''}\${e.type}/\${e.event}</span>
                <span class="body">\${eventBody(e)}</span>
                <span class="ms \${msc}">\${e.ms !== undefined ? e.ms.toFixed(1) + 'ms' : ''}</span>
            \`;
            row.onclick = () => {
                if (pendingSyncLogTs !== null) return;  // sync mode handled by click on video
                vid.currentTime = tsToVideo(e.ts);
            };
            row.oncontextmenu = (ev) => {
                ev.preventDefault();
                pendingSyncLogTs = e.ts;
                $('syncStatus').textContent = 'Now play/seek video to the matching moment, then click the video';
                $('syncBtn').classList.add('active');
            };
            body.appendChild(row);
        });

        sec.appendChild(body);
        tl.appendChild(sec);
    });

    // (bottom legend removed — top legend below the chip row is enough)

    updateHighlight();
}

// ── Highlight current event ────────────────────────────────────────
let lastCurrentRow = null;
let lastCurrentSec = null;
let lastScrollTime = -1;   // video time at which we last auto-scrolled
function updateHighlight() {
    const now = vid.currentTime;
    const nowTs = videoToTs(now);

    // Section
    const curSecIdx = SECTIONS.findIndex(s => nowTs >= s.startTs && nowTs <= s.endTs);
    document.querySelectorAll('.section').forEach((el, i) => {
        el.classList.toggle('current', i === curSecIdx);
    });

    // Find latest visible event at-or-before now (within current section if found)
    let target = null;
    const rows = document.querySelectorAll('.ev');
    rows.forEach(r => {
        const ts = +r.dataset.ts;
        r.classList.toggle('future', ts > nowTs + 50);
        if (ts <= nowTs) target = r;
    });
    if (lastCurrentRow) lastCurrentRow.classList.remove('current');
    if (target) {
        target.classList.add('current');
        // Only auto-scroll when the VIDEO TIME actually changed (playback/seek),
        // not on a re-render (e.g. toggling a chip) — a re-render always produces
        // new rows so target!==lastCurrentRow would otherwise scroll to top.
        if ($('autoScroll').checked && target !== lastCurrentRow && now !== lastScrollTime) {
            target.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }
    lastCurrentRow = target;
    lastScrollTime = now;

    // Update stats
    const e = target ? EVENTS.find(x => x.seq == target.dataset.seq) : null;
    $('stats').innerHTML = \`
        <div>video <b>\${now.toFixed(3)}s</b> · log <b>\${((nowTs - FIRST_TS)/1000).toFixed(3)}s</b></div>
        \${e ? \`<div>current: <b>\${e.type}/\${e.event}</b> seq=\${e.seq}</div>\` : ''}
    \`;
}

// ── Sync ──────────────────────────────────────────────────────────
$('syncBtn').onclick = () => {
    $('syncStatus').textContent = 'Right-click any timeline event to mark, then click video';
};
function applySyncAtCurrentTime() {
    // Map the marked log event to the current video time so that
    // tsToVideo(pendingSyncLogTs) === vid.currentTime.
    offsetSec = vid.currentTime - (pendingSyncLogTs - FIRST_TS) / 1000;
    $('offsetNum').value = offsetSec.toFixed(3);
    pendingSyncLogTs = null;
    $('syncBtn').classList.remove('active');
    $('syncStatus').textContent = \`Synced (offset \${offsetSec.toFixed(3)}s)\`;
    $('syncStatus').classList.add('synced');
    $('syncBadge').textContent = 'offset ' + offsetSec.toFixed(3) + 's';
    $('syncBadge').style.color = 'var(--good)';
    renderTimeline();
    renderMarkers();
}
$('offsetNum').oninput = (e) => {
    offsetSec = parseFloat(e.target.value) || 0;
    $('syncBadge').textContent = 'offset ' + offsetSec.toFixed(3) + 's';
    renderTimeline(); renderMarkers();
};
$('resetOffset').onclick = () => {
    offsetSec = 0;
    $('offsetNum').value = '0';
    $('syncStatus').textContent = 'No sync — log starts at video t=0';
    $('syncStatus').classList.remove('synced');
    $('syncBadge').textContent = 'offset 0.000s';
    $('syncBadge').style.color = 'var(--dim)';
    renderTimeline(); renderMarkers();
};

// ── Collapsible control blocks ────────────────────────────────────
document.querySelectorAll('.ctrlBlock .blockHead').forEach(head => {
    head.addEventListener('click', (e) => {
        // Don't toggle when interacting with input/select/button inside
        if (e.target.closest('input, select, button')) return;
        head.parentElement.classList.toggle('collapsed');
    });
});

// ── Video file picker ─────────────────────────────────────────────
$('videoFile').onchange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    vid.src = URL.createObjectURL(f);
    vid.load();
    // Collapse the View card now that the user has finished with it
    $('blockView').classList.add('collapsed');
};

// ── Playback speed ────────────────────────────────────────────────
$('speed').onchange = (e) => {
    vid.playbackRate = parseFloat(e.target.value);
    $('speedBadge').textContent = e.target.value + 'x';
};

// ── Custom play/pause (native controls are hidden) ───────────────
function togglePlay() {
    if (vid.paused || vid.ended) {
        const p = vid.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
        vid.pause();
    }
}
$('playBtn').onclick = togglePlay;
// Single video click handler: in sync-marking mode it completes the sync;
// otherwise it toggles play/pause. (Kept as ONE handler so completing a sync
// doesn't also fall through to play/pause.)
vid.addEventListener('click', () => {
    if (pendingSyncLogTs !== null) applySyncAtCurrentTime();
    else togglePlay();
});
function syncPlayBtnUI() {
    const btn = $('playBtn');
    if (!btn) return;
    const playing = !vid.paused && !vid.ended;
    btn.classList.toggle('playing', playing);
    btn.querySelector('.ico').textContent = playing ? '❚❚' : '▶';
    btn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
vid.addEventListener('play',  syncPlayBtnUI);
vid.addEventListener('pause', syncPlayBtnUI);
vid.addEventListener('ended', syncPlayBtnUI);

// ── Nudge buttons ─────────────────────────────────────────────────
document.querySelectorAll('[data-nudge]').forEach(btn => {
    btn.onclick = () => {
        const delta = parseFloat(btn.dataset.nudge);
        vid.currentTime = Math.max(0, Math.min((vid.duration || 1e9), vid.currentTime + delta));
    };
});
// Keyboard: arrow keys nudge, [ ] for 50ms, , . for 100ms
document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, select, textarea')) return;
    let delta = 0;
    if (e.key === 'ArrowLeft')  delta = -0.05;
    else if (e.key === 'ArrowRight') delta = 0.05;
    else if (e.key === '[') delta = -0.05;
    else if (e.key === ']') delta = 0.05;
    else if (e.key === ',') delta = -0.1;
    else if (e.key === '.') delta = 0.1;
    else if (e.key === ' ') { e.preventDefault(); vid.paused ? vid.play() : vid.pause(); return; }
    if (delta) { e.preventDefault(); vid.currentTime = Math.max(0, vid.currentTime + delta); }
});

// ── Marker strip ──────────────────────────────────────────────────
const KEY_EVENT_KEYS = new Set([
    'NAV/START', 'NAV/DISPATCHED', 'NAV/FOCUS',
    'COMPONENT/FRAGMENT_READY',
    'USER/TOUCH_START', 'USER/LONG_TAP', 'USER/BACK_PRESS',
    'INPUT/COMMIT', 'INPUT/SUBMIT',
    'SPINNER/SHOW', 'SPINNER/HIDE', 'MODAL/SHOW', 'MODAL/HIDE',
    'HTTP/REQUEST', 'HTTP/RESPONSE', 'HTTP/RESPONSE_ERROR',
    'ERROR/CAUGHT',
    'KEYBOARD/SHOW', 'KEYBOARD/HIDE',
    'APP/REFRESH_START'
]);
function markerColor(e) {
    const c = getComputedStyle(document.documentElement);
    const map = { NAV:'--nav', USER:'--user', COMPONENT:'--comp', INPUT:'--input', HTTP:'--http', VAR:'--var', ACTION:'--var', MEMO:'--memo', APP:'--bad', SPINNER:'--dim', MODAL:'--dim', TOAST:'--dim', DISPLAY:'--dim', KEYBOARD:'--accent', ERROR:'--bad' };
    return c.getPropertyValue(map[e.type] || '--dim').trim() || '#8b949e';
}
function renderMarkers() {
    const strip = $('markerStrip');
    strip.innerHTML = '';
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.style.top = '50%';
    strip.appendChild(lane);

    const playhead = document.createElement('div');
    playhead.className = 'playhead';
    playhead.id = 'playhead';
    strip.appendChild(playhead);

    if (!vid.duration || !isFinite(vid.duration)) return;

    const mode = $('markerMode').value;
    const dur = vid.duration;
    EVENTS.forEach(e => {
        if (filters.has(chipKey(e))) return;
        const key = e.type + '/' + e.event;
        if (mode === 'key' && !KEY_EVENT_KEYS.has(key)) return;
        if (mode === 'nav' && e.type !== 'NAV') return;
        const vt = tsToVideo(e.ts);
        if (vt < 0 || vt > dur) return;
        const t = document.createElement('div');
        t.className = 'tick';
        t.style.left = (vt / dur * 100) + '%';
        t.style.background = markerColor(e);
        t.title = \`\${(vt).toFixed(3)}s  \${key}  \${e.name || ''}\`;
        t.onclick = (ev) => { ev.stopPropagation(); vid.currentTime = vt; };
        strip.appendChild(t);
    });
}
function updatePlayhead() {
    const ph = $('playhead');
    if (!ph || !vid.duration) return;
    ph.style.left = (vid.currentTime / vid.duration * 100) + '%';
}
$('markerStrip').onclick = (e) => {
    if (!vid.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    vid.currentTime = (e.clientX - r.left) / r.width * vid.duration;
};
$('markerMode').onchange = renderMarkers;
vid.addEventListener('durationchange', renderMarkers);
vid.addEventListener('loadedmetadata', renderMarkers);

// ── Drive highlight loop ──────────────────────────────────────────
function fmtTime(t) {
    if (!isFinite(t) || t < 0) t = 0;
    const s = Math.floor(t);
    const ms = Math.floor((t - s) * 1000);
    return String(s).padStart(2,'0') + ':' + String(ms).padStart(3,'0');
}
function updateTimeReadout() {
    $('timeCur').textContent = fmtTime(vid.currentTime);
    $('timeDur').textContent = fmtTime(vid.duration || 0);
}
function parseGoto(str) {
    str = String(str).trim();
    if (!str) return NaN;
    // accept "39.247", "39:247", "1:23.456", "1:23:456", "83456ms"
    if (/ms$/i.test(str)) return parseFloat(str) / 1000;
    if (str.includes(':')) {
        const parts = str.split(':');
        if (parts.length === 2) {
            // "SS:mmm" if second part has 3 digits and no dot, else "MM:SS"
            const a = parseFloat(parts[0]), b = parseFloat(parts[1]);
            if (/^\\d{3}$/.test(parts[1])) return a + b / 1000;
            return a * 60 + b;
        }
        if (parts.length === 3) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]) + parseFloat(parts[2]) / 1000;
    }
    return parseFloat(str);
}
function doGoto() {
    const t = parseGoto($('gotoInput').value);
    if (isFinite(t)) vid.currentTime = Math.max(0, Math.min(vid.duration || t, t));
}
$('gotoBtn').onclick = doGoto;
$('gotoInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doGoto(); } });

function tick() {
    updateHighlight();
    updatePlayhead();
    updateTimeReadout();
    if (vid.requestVideoFrameCallback) {
        vid.requestVideoFrameCallback(tick);
    } else {
        requestAnimationFrame(tick);
    }
}
vid.addEventListener('loadedmetadata', () => {
    if (vid.requestVideoFrameCallback) vid.requestVideoFrameCallback(tick);
    else requestAnimationFrame(tick);
});

// ── Tabs ──────────────────────────────────────────────────────────
document.querySelectorAll('#tabs button').forEach(btn => {
    btn.onclick = () => {
        const t = btn.dataset.tab;
        document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tabBody').forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    };
});

// ── Section enrichment: compute phases for waterfall + summary ────
// Phase categories for legend
const PHASE_CATEGORIES = [
    { key: 'tap',     label: 'Tap',         color: 'var(--user)' },
    { key: 'submit',  label: 'Submit/Input',color: 'var(--input)' },
    { key: 'nav',     label: 'Nav dispatch',color: 'var(--nav)' },
    { key: 'api',     label: 'API call',    color: 'var(--http)' },
    { key: 'var',     label: 'Variable',    color: 'var(--var)' },
    { key: 'script',  label: 'Script',      color: '#56d364' },
    { key: 'mount',   label: 'Page mount',  color: 'var(--comp)' },
    { key: 'tti',     label: 'First render → TTI', color: 'var(--good)' },
    { key: 'rerender',label: 'Re-render',   color: 'var(--memo)' },
    { key: 'spinner', label: 'Spinner',     color: '#8b949e' },
    { key: 'modal',   label: 'Modal/Toast', color: '#bb86fc' },
    { key: 'keyboard',label: 'Keyboard',    color: '#58a6ff' },
    { key: 'unmount', label: 'Page unmount', color: '#9e6a6a' },
    { key: 'error',   label: 'Error',       color: 'var(--bad)' },
    { key: 'auth',    label: 'Auth redirect',color: '#f0c674' }
];

// Find matching VISIT for a given section (destination page on nav).
function visitForSection(s) {
    if (!s.from) return null;
    let best = null;
    for (const v of VISITS) {
        if (v.pageName !== s.to) continue;
        const gap = Math.abs(v.mountTs - s.startTs);
        if (gap > 8000) continue;
        if (!best || gap < Math.abs(best.mountTs - s.startTs)) best = v;
    }
    return best;
}

// Find the meaningful "end" of a tap: matching TOUCH_END (if it lands later),
// else the first event the tap actually triggered (handler / API / nav).
// Falls back to +50ms so the bar is visible.
function tapEndTs(touchEv, touchIdx, capMs) {
    const cap = capMs || 2000;
    // A tap is a short gesture. Its bar ends at the EARLIEST meaningful endpoint:
    //   - the matching TOUCH_END, but ONLY if it lands within 800ms (a later one
    //     is a mismatched/unrelated finger-release — taps aren't seconds long), OR
    //   - the first handler/effect the tap triggered (EVENT/TRIGGER, NAV, invoke,
    //     setState, commit, keyboard/modal/spinner show).
    let touchEndTs = null, actionTs = null;
    for (let j = touchIdx + 1; j < EVENTS.length; j++) {
        const e = EVENTS[j];
        if (e.ts - touchEv.ts > cap) break;
        if (touchEndTs == null && e.type === 'USER' && e.event === 'TOUCH_END' &&
            (e.name === touchEv.name || !touchEv.name) && e.ts > touchEv.ts) {
            touchEndTs = e.ts;
        }
        if (actionTs == null && e.ts > touchEv.ts && (
            (e.type === 'EVENT' && e.event === 'TRIGGER') ||
            (e.type === 'NAV' && e.event === 'START') ||
            (e.type === 'VAR' && e.event === 'INVOKE_START') ||
            (e.type === 'ACTION' && e.event === 'INVOKE_START') ||
            (e.type === 'COMPONENT' && e.event === 'SETSTATE_QUEUED') ||
            (e.type === 'INPUT' && (e.event === 'COMMIT' || e.event === 'SUBMIT')) ||
            (e.type === 'KEYBOARD' && e.event === 'SHOW') ||
            (e.type === 'MODAL' && e.event === 'SHOW') ||
            (e.type === 'SPINNER' && e.event === 'SHOW'))) {
            actionTs = e.ts;
        }
        if (touchEndTs != null && actionTs != null) break;
    }
    const candidates = [];
    if (touchEndTs != null && touchEndTs - touchEv.ts <= 800) candidates.push(touchEndTs);
    if (actionTs != null) candidates.push(actionTs);
    if (candidates.length) return Math.min(...candidates);
    return touchEv.ts + 50;
}

// Build the "TAP → TTFI" window phases for a section.
// Phase categories (each becomes its own bar row):
//   tap     — preceding touch / submit / back-press
//   api     — VAR/ACTION INVOKE pairs whose SUCCESS lands inside the window
//   nav     — onSuccess → NAV/START + NAV dispatch
//   mount   — NAV/DISPATCHED → FRAGMENT_READY
//   tti     — first widget TTI on destination
//   rerender— APP/REFRESH_START → last committed render (only those that rendered)
function sectionPhases(sIdx) {
    const s = SECTIONS[sIdx];
    if (!s.from) return [];

    const win = sectionWindow(sIdx);
    const winStart = win.winStart, winEnd = win.winEnd, visit = win.visit;

    // Re-find the tap (needed for the TAP/SUBMIT visual bar)
    let tap = null, tapIdx = -1;
    for (let j = s.startIdx - 1; j >= 0; j--) {
        const e = EVENTS[j];
        if (s.startTs - e.ts > 5000) break;
        const isTouch = e.type === 'USER' && (e.event === 'TOUCH_START' || e.event === 'LONG_TAP' || e.event === 'BACK_PRESS');
        const isInput = e.type === 'INPUT' && (e.event === 'SUBMIT' || e.event === 'COMMIT');
        if (isTouch || isInput) { tap = e; tapIdx = j; break; }
    }

    const phases = [];

    // ── TAP / SUBMIT bar (small ~12ms visible mark) ─────────────
    if (tap) {
        const isInput = tap.type === 'INPUT';
        const ltype = isInput ? 'submit' : 'tap';
        const ev = tap.eventName ? ' (' + tap.eventName + ')' : '';
        const widget = tap.name ? ' ' + tap.name : '';
        const endTs = tapEndTs(tap, tapIdx, 3000);
        phases.push({
            label: (isInput ? (tap.event === 'SUBMIT' ? 'SUBMIT' : 'INPUT') : (tap.event === 'BACK_PRESS' ? 'BACK' : 'TAP')) + widget + ev,
            startTs: tap.ts, endTs: Math.min(endTs, winEnd),
            category: ltype,
            color: ltype === 'submit' ? 'var(--input)' : 'var(--user)'
        });
    }

    // ── NAV events ──────────────────────────────────────────────
    const slice = EVENTS.slice(s.startIdx, s.endIdx);
    const navStart = slice.find(e => e.type === 'NAV' && e.event === 'START');
    const navDisp  = slice.find(e => e.type === 'NAV' && e.event === 'DISPATCHED');
    // FRAGMENT_READY for the destination page. When the page double-mounts, prefer
    // the one at/after the (collapsed, later) visit mount so Page mount pairs with
    // the real mount — fall back to the first if none qualifies.
    const frReadyAll = slice.filter(e => e.type === 'COMPONENT' && e.event === 'FRAGMENT_READY' && e.pageName === s.to && e.isPage);
    const frReady = (visit ? frReadyAll.find(e => e.ts >= visit.mountTs) : null) || frReadyAll[0] || null;

    // Walk EVENTS in [winStart, winEnd] for VAR/ACTION invokes (incl pre-fetch).
    // Use time-based start scan since the API may have started before s.startIdx.
    let startIdxScan = s.startIdx;
    while (startIdxScan > 0 && EVENTS[startIdxScan - 1].ts >= winStart) startIdxScan--;

    // ── API / Variable bars ────────────────────────────────────
    const openVar = new Map();
    for (let j = startIdxScan; j < EVENTS.length; j++) {
        const e = EVENTS[j];
        if (e.ts > winEnd) break;
        if ((e.type === 'VAR' || e.type === 'ACTION') && e.event === 'INVOKE_START') {
            openVar.set(e.scope + ':' + e.name, e);
        } else if ((e.type === 'VAR' || e.type === 'ACTION') && (e.event === 'INVOKE_END' || e.event === 'ERROR')) {
            const startE = openVar.get(e.scope + ':' + e.name);
            if (!startE) continue;
            openVar.delete(e.scope + ':' + e.name);
            if (e.ts < winStart) continue;
            const isApi = startE.varType === 'service' || startE.varType === 'live';
            const isAct = startE.type === 'ACTION';
            const prefix = isAct ? '' : (isApi ? 'API ' : 'Var ');
            phases.push({
                label: prefix + startE.name + (e.event === 'ERROR' ? ' (error)' : ''),
                startTs: Math.max(winStart, startE.ts), endTs: e.ts,
                category: isApi ? 'api' : 'var',
                color: isApi ? 'var(--http)' : 'var(--var)'
            });
        }
    }

    // ── NAV dispatch (onSuccess → NAV) ─────────────────────────
    if (navStart) {
        const dispEnd = navDisp ? navDisp.ts : navStart.ts + 16;
        phases.push({
            label: navDisp ? 'onSuccess → NAV' : 'NAV start',
            startTs: navStart.ts, endTs: Math.min(dispEnd, winEnd),
            category: 'nav', color: 'var(--nav)'
        });
    }

    // ── Page mount = new page container MOUNT → its FRAGMENT_READY ──
    // (The destination page mounts only AFTER the old page tears down — the
    // Page unmount bar below sits between Nav dispatch and Page mount in time.)
    if (visit && frReady && frReady.ts >= visit.mountTs && frReady.ts <= winEnd) {
        phases.push({
            label: 'Page mount',
            startTs: visit.mountTs, endTs: frReady.ts,
            category: 'mount', color: 'var(--comp)'
        });
    } else if (navDisp && frReady && !visit && frReady.ts >= navDisp.ts && frReady.ts <= winEnd) {
        phases.push({
            label: 'Page mount',
            startTs: navDisp.ts, endTs: frReady.ts,
            category: 'mount', color: 'var(--comp)'
        });
    }

    // ── Previous page unmount (teardown of s.from) ─────────────
    // In WaveMaker the new page mounts first, then the old page's component tree
    // tears down in a burst. We cluster the first run of COMPONENT/UNMOUNT events
    // after the nav (consecutive <200ms apart) — that's the old page unmounting.
    {
        let first = null, last = null, prev = null;
        for (let j = s.startIdx; j < s.endIdx; j++) {
            const e = EVENTS[j];
            if (e.ts > winEnd) break;
            if (e.type === 'COMPONENT' && e.event === 'UNMOUNT') {
                if (first == null) { first = e.ts; last = e.ts; prev = e.ts; }
                else if (e.ts - prev <= 200) { last = e.ts; prev = e.ts; }
                else break; // teardown cluster ended
            }
        }
        if (first != null) {
            phases.push({
                label: 'Page unmount' + (s.from ? ' (' + s.from + ')' : ''),
                startTs: first, endTs: Math.max(last, first + 8),
                category: 'unmount', color: '#9e6a6a'
            });
        }
    }

    // ── First render → TTI (use visit data) ────────────────────
    if (visit && visit.mountTs >= winStart && visit.renderMs > 0) {
        phases.push({
            label: 'First render → TTI',
            startTs: visit.mountTs, endTs: Math.min(visit.mountTs + visit.renderMs, winEnd),
            category: 'tti', color: 'var(--good)'
        });
    }

    // ── Re-render / Script cycles ───────────────────────────────────
    // Use the SAME committed-refresh cycles the summary uses (visit.cycles), so
    // the waterfall bars and the Page Flow Summary Script/Re-render columns are
    // consistent. Write-driven cycles → Script (green); pure cycles → Re-render
    // (purple). Each is labeled with what triggered the refresh.
    if (visit && Array.isArray(visit.cycles)) {
        let rerenderIdx = 0;
        visit.cycles.forEach(c => {
            if (c.startTs < winStart - 1 || c.startTs > winEnd) return;
            if (c.writeDriven) {
                phases.push({
                    label: 'Script ← ' + (c.writeName || c.trigger || 'write'),
                    startTs: c.startTs, endTs: Math.min(c.endTs, winEnd),
                    category: 'script', color: '#56d364'
                });
            } else {
                rerenderIdx++;
                phases.push({
                    label: 'Re-render ' + rerenderIdx + (c.trigger ? ' ← ' + c.trigger : ''),
                    startTs: c.startTs, endTs: Math.min(c.endTs, winEnd),
                    category: 'rerender', color: 'var(--memo)'
                });
            }
        });
    }

    // ── Mid-window USER interactions (taps that didn't lead the nav) ──
    const leadingTapTs = tap ? tap.ts : null;
    for (let j = s.startIdx; j < s.endIdx; j++) {
        const e = EVENTS[j];
        if (e.type !== 'USER') continue;
        if (e.event !== 'TOUCH_START' && e.event !== 'LONG_TAP' && e.event !== 'BACK_PRESS') continue;
        if (leadingTapTs != null && e.ts === leadingTapTs) continue;
        if (e.ts < winStart || e.ts > winEnd) continue;
        const label = e.event === 'BACK_PRESS' ? 'Back press'
                    : e.event === 'LONG_TAP'  ? 'Long tap' + (e.name ? ' ' + e.name : '')
                    :                            'Tap'      + (e.name ? ' ' + e.name : '');
        phases.push({ label, startTs: e.ts, endTs: Math.min(tapEndTs(e, j, 2000), winEnd), category: 'tap', color: 'var(--user)' });
    }

    // ── INPUT events (SUBMIT / COMMIT / FOCUS) ──────────────────
    for (let j = s.startIdx; j < s.endIdx; j++) {
        const e = EVENTS[j];
        if (e.type !== 'INPUT') continue;
        if (e.event !== 'SUBMIT' && e.event !== 'COMMIT' && e.event !== 'FOCUS') continue;
        if (e.ts < winStart || e.ts > winEnd) continue;
        const ev = e.event === 'SUBMIT' ? 'Submit' : e.event === 'COMMIT' ? 'Input commit' : 'Input focus';
        phases.push({ label: ev + (e.name ? ' ' + e.name : ''), startTs: e.ts, endTs: Math.min(tapEndTs(e, j, 1500), winEnd), category: 'submit', color: 'var(--input)' });
    }

    // ── Keyboard SHOW → HIDE pairs (keyboard genuinely visible this whole time) ──
    let kbOpen = null;
    slice.forEach(e => {
        if (e.type !== 'KEYBOARD') return;
        if (e.event === 'SHOW') kbOpen = e;
        else if (e.event === 'HIDE') {
            const startTs = kbOpen ? kbOpen.ts : Math.max(winStart, e.ts - (e.ms || 1));
            if (e.ts >= winStart && startTs <= winEnd) {
                phases.push({ label: 'Keyboard' + (kbOpen && kbOpen.height ? ' h=' + Math.round(kbOpen.height) : ''),
                    startTs: Math.max(winStart, startTs), endTs: Math.min(e.ts, winEnd), category: 'keyboard', color: '#58a6ff' });
            }
            kbOpen = null;
        }
    });
    if (kbOpen && kbOpen.ts >= winStart && kbOpen.ts <= winEnd) {
        phases.push({ label: 'Keyboard (open)' + (kbOpen.height ? ' h=' + Math.round(kbOpen.height) : ''), startTs: kbOpen.ts, endTs: winEnd, category: 'keyboard', color: '#58a6ff' });
    }

    // ── Spinner / Modal / Toast / Display SHOW → HIDE pairs ─────
    [
        { type: 'SPINNER', label: 'Spinner', category: 'spinner', color: '#8b949e' },
        { type: 'MODAL',   label: 'Modal',   category: 'modal',   color: '#bb86fc' },
        { type: 'TOAST',   label: 'Toast',   category: 'modal',   color: '#bb86fc' },
        { type: 'DISPLAY', label: 'Display overlay', category: 'modal', color: '#bb86fc' }
    ].forEach(fam => {
        let open = null;
        slice.forEach(e => {
            if (e.type !== fam.type) return;
            if (e.event === 'SHOW') open = e;
            else if (e.event === 'HIDE') {
                let startTs = open ? open.ts : (e.ms != null ? Math.max(winStart, e.ts - e.ms) : Math.max(winStart, e.ts - 1));
                if (e.ts >= winStart && startTs <= winEnd) {
                    const extra = e.message ? ' "' + e.message.slice(0, 30) + '"' : e.name ? ' ' + e.name : '';
                    phases.push({ label: fam.label + extra, startTs: Math.max(winStart, startTs), endTs: Math.min(e.ts, winEnd), category: fam.category, color: fam.color });
                }
                open = null;
            }
        });
        if (open && open.ts >= winStart && open.ts <= winEnd) {
            phases.push({ label: fam.label + ' (open)', startTs: open.ts, endTs: winEnd, category: fam.category, color: fam.color });
        }
    });

    // ── ERROR/CAUGHT ────────────────────────────────────────────
    slice.forEach(e => {
        if (e.type !== 'ERROR' || e.event !== 'CAUGHT') return;
        if (e.ts < winStart || e.ts > winEnd) return;
        phases.push({ label: 'Error: ' + (e.name || 'caught') + (e.message ? ' — ' + e.message.slice(0, 40) : ''), startTs: e.ts, endTs: Math.min(e.ts + 12, winEnd), category: 'error', color: 'var(--bad)' });
    });

    // ── AUTH redirect pairs ─────────────────────────────────────
    let authOpen = null;
    slice.forEach(e => {
        if (e.type !== 'AUTH') return;
        if (e.event === 'REDIRECT_START') authOpen = e;
        else if (e.event === 'REDIRECT_DONE' || e.event === 'REDIRECT_ERROR') {
            const startTs = authOpen ? authOpen.ts : Math.max(winStart, e.ts - (e.ms || 0));
            if (e.ts >= winStart && startTs <= winEnd) {
                phases.push({ label: 'Auth redirect' + (authOpen && authOpen.process ? ' ' + authOpen.process : '') + (e.event === 'REDIRECT_ERROR' ? ' (error)' : ''),
                    startTs: Math.max(winStart, startTs), endTs: Math.min(e.ts, winEnd), category: 'auth', color: '#f0c674' });
            }
            authOpen = null;
        }
    });

    // ── Sort by start, then filter to window ───────────────────
    return phases
        .filter(p => p.startTs >= winStart - 1 && p.startTs < winEnd)
        .sort((a, b) => a.startTs - b.startTs);
}

// Global toggle: when true, waterfall window ends at TTFI (first interaction).
// When false, window extends to the natural section end (next nav or session end).
let wfTtfiOnly = true;

// Convenience getter for waterfall window boundaries
function sectionWindow(sIdx) {
    const s = SECTIONS[sIdx];
    if (!s.from) return { winStart: s.startTs, winEnd: s.endTs };
    const visit = visitForSection(s);
    const ttifEnd = visit ? visit.mountTs + (visit.ttfi || visit.renderMs || 0) : s.endTs;
    const winEnd = wfTtfiOnly ? ttifEnd : s.endTs;
    let winStart = s.startTs;
    for (let j = s.startIdx - 1; j >= 0; j--) {
        const e = EVENTS[j];
        if (s.startTs - e.ts > 5000) break;
        const isTouch = e.type === 'USER' && (e.event === 'TOUCH_START' || e.event === 'LONG_TAP' || e.event === 'BACK_PRESS');
        const isInput = e.type === 'INPUT' && (e.event === 'SUBMIT' || e.event === 'COMMIT');
        if (isTouch || isInput) { winStart = e.ts; break; }
    }
    return { winStart, winEnd, visit };
}

// ── Summary table ─────────────────────────────────────────────────
function fmtFlow(ms) {
    if (ms == null || ms <= 20) return '—';
    return (ms / 1000).toFixed(3) + 's';
}
function ttifBadge(ms) {
    if (ms == null) return '';
    if (ms < 1000) return '<span class="badge-ok">✓</span>';
    if (ms < 5000) return '<span class="badge-warn">~</span>';
    return '<span class="badge-bad">✗</span>';
}

function renderSummary() {
    const el = $('summary');
    if (!VISITS.length) { el.innerHTML = '<div style="color:var(--dim);padding:12px">No page visits detected (FRAGMENT_READY with isPage=true missing).</div>'; return; }

    // Flow path header
    const pathHtml = VISITS.map(v => '<span class="seg">' + v.pageName + '</span>').join('<span class="arrow"> → </span>');

    // Totals
    const tot = VISITS.reduce((a, v) => ({
        renderMs: a.renderMs + (v.renderMs||0),
        apiMs:    a.apiMs    + (v.apiMs||0),
        scriptMs: a.scriptMs + (v.scriptMs||0),
        rerenderMs: a.rerenderMs + (v.rerenderMs||0),
        ttfi:     a.ttfi     + (v.ttfi||0)
    }), { renderMs:0, apiMs:0, scriptMs:0, rerenderMs:0, ttfi:0 });
    const pct = v => tot.ttfi > 0 ? '(' + Math.round(v / tot.ttfi * 100) + '%)' : '';

    let html = '<div class="summaryWrap">' +
        '<div class="flowPath"><b>Page Flow Summary</b><br>' + pathHtml + '</div>' +
        '<table class="summary">' +
        '<thead><tr>' +
            '<th class="colPage">Page</th>' +
            '<th class="colNum">Render</th><th class="colNum">API</th><th class="colNum">Script</th><th class="colNum">Re-render</th><th class="colTtif" title="Time To First Interaction — mount to first user tap/input">TTFI</th>' +
        '</tr></thead><tbody>';

    VISITS.forEach((v, i) => {
        const nextMount = (VISITS[i+1] && VISITS[i+1].mountTs) || (v.mountTs + (v.ttfi || 0) + 1);
        html += '<tr class="dataRow" data-idx="' + i + '" data-start-ts="' + v.mountTs + '" data-end-ts="' + nextMount + '">' +
            '<td class="page"><span class="expandIcon">▶</span>' + v.pageName + '</td>' +
            '<td class="num' + (v.renderMs > 20 ? '' : ' dim') + '">' + fmtFlow(v.renderMs) + '</td>' +
            '<td class="num' + (v.apiMs > 20 ? '' : ' dim') + '">' + fmtFlow(v.apiMs) + '</td>' +
            '<td class="num' + (v.scriptMs > 20 ? '' : ' dim') + '">' + fmtFlow(v.scriptMs) + '</td>' +
            '<td class="num' + (v.rerenderMs > 20 ? '' : ' dim') + '">' + fmtFlow(v.rerenderMs) + '</td>' +
            '<td class="ttif" title="TTFI basis: ' + (v.ttfiBasis || '?') + (v.firstInteractionTs ? ' · user tap at ' + ((v.firstInteractionTs - v.mountTs)/1000).toFixed(3) + 's' : '') + '">' + fmtFlow(v.ttfi) + ttifBadge(v.ttfi) + '</td>' +
        '</tr>';
        html += '<tr class="detailRow"><td colspan="6">' + renderVisitDrawer(v, i) + '</td></tr>';
    });

    html += '<tr class="totalRow">' +
        '<td class="page">TOTAL  ' + VISITS.length + ' visit' + (VISITS.length===1?'':'s') + '</td>' +
        '<td class="num">' + fmtFlow(tot.renderMs) + '</td>' +
        '<td class="num">' + fmtFlow(tot.apiMs) + '</td>' +
        '<td class="num">' + fmtFlow(tot.scriptMs) + '</td>' +
        '<td class="num">' + fmtFlow(tot.rerenderMs) + '</td>' +
        '<td class="ttif" style="color:var(--fg)">' + fmtFlow(tot.ttfi) + '</td>' +
    '</tr>';
    html += '<tr class="pctRow">' +
        '<td></td>' +
        '<td class="num">' + pct(tot.renderMs) + '</td>' +
        '<td class="num">' + pct(tot.apiMs) + '</td>' +
        '<td class="num">' + pct(tot.scriptMs) + '</td>' +
        '<td class="num">' + pct(tot.rerenderMs) + '</td>' +
        '<td></td>' +
    '</tr>';
    html += '</tbody></table></div>';

    el.innerHTML = html;
    el.querySelectorAll('tr.dataRow').forEach(tr => {
        tr.onclick = (ev) => {
            // Shift-click (or click on expand icon) → toggle drawer.
            // Plain click → seek the video.
            const wantsToggle = ev.shiftKey || ev.target.classList.contains('expandIcon');
            if (wantsToggle) {
                ev.preventDefault();
                tr.classList.toggle('expanded');
                const drawer = tr.nextElementSibling && tr.nextElementSibling.querySelector('.visitDrawer');
                if (drawer) drawer.classList.toggle('open');
            } else {
                vid.currentTime = tsToVideo(+tr.dataset.startTs);
            }
        };
    });
}
function renderVisitDrawer(v, i) {
    const apis = v.apiList || [], scripts = v.scriptList || [], writes = v.writeList || [];
    const bd = v.apiBreakdown || { rawSumMs: 0, wallMs: 0, onSuccessMs: 0, totalMs: 0 };

    let h = '<div class="visitDrawer">';

    // ── API section ──────────────────────────────────────────────
    h += '<div class="vdSection"><h4>API calls in TTFI window (' + apis.length + ')</h4>';
    if (apis.length === 0) h += '<div class="vdEmpty">No API/Variable invocations recorded.</div>';
    else {
        h += '<div class="vdGrid">';
        apis.forEach(a => {
            const msc = a.ms <= 100 ? 'fast' : a.ms <= 500 ? '' : 'slow';
            const tag = a.type === 'ACTION' ? 'Action' : (a.vType === 'service' || a.vType === 'live' ? 'API' : 'Var');
            h += '<div class="name">' + esc(a.name) +
                 ' <span class="meta">' + tag + (a.vType ? '·' + esc(a.vType) : '') + ' · ' + esc(a.scope) + '</span></div>';
            h += '<div class="ms ' + msc + '">' + a.ms.toFixed(1) + 'ms</div>';
            h += '<div class="status ' + a.status + '">' + a.status + '</div>';
        });
        h += '</div>';
        // Reconciliation footer: explain how raw call durations reduce to
        // the API number shown in the summary.
        h += '<div class="vdFooter">' +
             '<div><span class="lbl">Raw sum (sequential)</span><span class="val">' + bd.rawSumMs.toFixed(0) + 'ms</span></div>' +
             '<div><span class="lbl">→ Collapsed wall-time (overlap removed)</span><span class="val">' + bd.wallMs.toFixed(0) + 'ms</span></div>' +
             '<div><span class="lbl">+ onSuccess handler</span><span class="val">' + bd.onSuccessMs.toFixed(0) + 'ms</span></div>' +
             '<div class="totalLine"><span class="lbl">= Summary <b>API</b> column</span><span class="val">' + bd.totalMs.toFixed(0) + 'ms</span></div>' +
             '</div>';
    }
    h += '</div>';

    // ── Script section (write-driven refresh cycles) ─────────────
    const writesTotal = writes.reduce((s, w) => s + (w.elapsedMs || 0), 0);
    h += '<div class="vdSection"><h4>Script — write-driven re-render cycles (' + writes.length + ')</h4>';
    if (scripts.length === 0 && writes.length === 0) {
        h += '<div class="vdEmpty">No script-driven (DATASETWRITE) re-render cycles in this visit.</div>';
    } else {
        h += '<div class="vdGrid">';
        scripts.forEach(sc => {
            h += '<div class="name">' + esc(sc.kind) + ' <span class="meta">' + esc(sc.label) + '</span></div>';
            h += '<div class="ms">' + (sc.actualMs != null ? sc.actualMs.toFixed(0) + 'ms' : (sc.scheduledMs || 0) + 'ms') + '</div>';
            h += '<div class="meta">fired</div>';
        });
        writes.forEach(w => {
            const ms = w.elapsedMs || 0;
            const msc = ms <= 100 ? 'fast' : ms <= 500 ? '' : 'slow';
            h += '<div class="name">' + esc(w.name) + ' <span class="meta">refresh cycle</span></div>';
            h += '<div class="ms ' + msc + '">' + ms.toFixed(0) + 'ms</div>';
            h += '<div class="meta">script</div>';
        });
        h += '</div>';
        h += '<div class="vdFooter">' +
             '<div class="totalLine"><span class="lbl">= Summary <b>Script</b> column (write-driven cycles)</span><span class="val">' + writesTotal.toFixed(0) + 'ms</span></div>' +
             '</div>';
    }
    h += '</div>';

    // ── Re-render section (pure refresh cycles) ──────────────────
    const rerenders = v.rerenderList || [];
    h += '<div class="vdSection"><h4>Re-render cycles — pure React (' + rerenders.length + ')</h4>';
    if (rerenders.length === 0) {
        h += '<div class="vdEmpty">No pure re-render cycles in this visit.</div>';
    } else {
        h += '<div class="vdGrid" style="grid-template-columns:1fr auto">';
        rerenders.forEach(r => {
            const msc = r.totalMs <= 100 ? 'fast' : r.totalMs <= 500 ? '' : 'slow';
            h += '<div class="name">' + esc(r.name) + '</div>';
            h += '<div class="ms ' + msc + '">' + r.totalMs.toFixed(0) + 'ms</div>';
        });
        h += '</div>';
        const totalRerender = rerenders.reduce((s, r) => s + r.totalMs, 0);
        h += '<div class="vdFooter">' +
             '<div class="totalLine"><span class="lbl">= Summary <b>Re-render</b> column (pure cycles)</span><span class="val">' + totalRerender.toFixed(0) + 'ms (' + rerenders.length + ' cycle' + (rerenders.length === 1 ? '' : 's') + ')</span></div>' +
             '</div>';
    }
    h += '</div>';

    h += '<div class="vdSection" style="color:var(--dim);font-size:10px;font-style:italic">Tip: click the row to seek video · shift-click (or click ▶) to toggle this panel</div>';
    h += '</div>';
    return h;
}

function updateSummaryHighlight() {
    const nowTs = videoToTs(vid.currentTime);
    document.querySelectorAll('#summary tr.dataRow').forEach(tr => {
        const sTs = +tr.dataset.startTs, eTs = +tr.dataset.endTs;
        tr.classList.toggle('current', nowTs >= sTs && nowTs <= eTs);
        tr.classList.toggle('future',  nowTs < sTs);
    });
}

// ── Waterfall ─────────────────────────────────────────────────────
// (No outside category-chip bar — filters live inside each card via chipFlow.)
const wfHidden = new Set();  // kept for compatibility; nothing toggles it now

// Add or clear highlighted axis ticks + vline overlay marks for a selected bar.
function selectBar(wf, phase, barEl) {
    // Always restore dimmed default labels first
    const restoreDimmed = () => wf.querySelectorAll('.gridLabel.dimmed').forEach(n => n.classList.remove('dimmed'));

    // Toggle off if same bar clicked again
    if (barEl.classList.contains('selected')) {
        wf.querySelectorAll('.bar.selected').forEach(b => b.classList.remove('selected'));
        wf.querySelectorAll('.gridLabel.sel, .vline.sel').forEach(n => n.remove());
        restoreDimmed();
        return;
    }
    // Clear previous selection in this card
    wf.querySelectorAll('.bar.selected').forEach(b => b.classList.remove('selected'));
    wf.querySelectorAll('.gridLabel.sel, .vline.sel').forEach(n => n.remove());
    restoreDimmed();
    barEl.classList.add('selected');

    const winStart = +wf.dataset.startTs;
    const winEnd   = +wf.dataset.endTs;
    const span = (winEnd - winStart) || 1;
    const axis = wf.querySelector('.axis');
    const overlay = wf.querySelector('.tickOverlay');
    if (!axis || !overlay) return;

    const selFracs = [];
    const mkLabel = (ts) => {
        const frac = (ts - winStart) / span;
        selFracs.push(frac);
        const rel = (ts - winStart) / 1000;
        const lbl = document.createElement('span');
        lbl.className = 'gridLabel sel';
        lbl.style.left = (frac * 100).toFixed(3) + '%';
        lbl.textContent = (rel < 10 ? rel.toFixed(3) : rel.toFixed(2)) + 's';
        axis.appendChild(lbl);
        const vl = document.createElement('div');
        vl.className = 'vline sel';
        vl.style.left = (frac * 100).toFixed(3) + '%';
        overlay.appendChild(vl);
    };
    mkLabel(phase.startTs);
    mkLabel(phase.endTs);

    // Hide default interval labels that overlap with the selected ones.
    // Threshold is ~5% of span (enough to clear the label box at typical sizes).
    axis.querySelectorAll('.gridLabel:not(.sel):not(.first):not(.last)').forEach(lbl => {
        const leftPct = parseFloat(lbl.style.left) / 100;
        for (const f of selFracs) {
            if (Math.abs(leftPct - f) < 0.05) { lbl.classList.add('dimmed'); break; }
        }
    });

    vid.currentTime = tsToVideo(phase.startTs);
}

function buildWaterfallCard(sIdx) {
    const s = SECTIONS[sIdx];
    const win = sectionWindow(sIdx);
    const winStart = win.winStart, winEnd = win.winEnd, visit = win.visit;
    const allPhases = sectionPhases(sIdx);
    const phases = allPhases.filter(p => !wfHidden.has(p.category));
    const span = (winEnd - winStart) || 1;
    const startVt = tsToVideo(winStart), endVt = tsToVideo(winEnd);

    const wf = document.createElement('div');
    wf.className = 'wf collapsed';
    wf.dataset.idx = sIdx;
    wf.dataset.startTs = winStart;
    wf.dataset.endTs = winEnd;

    const head = document.createElement('div');
    head.className = 'wfHead';
    const title = s.from ? s.from + ' → ' + s.to : 'Startup → ' + (s.to || '');
    const ttifTxt = visit && visit.ttfi ? 'TTFI ' + (visit.ttfi/1000).toFixed(2) + 's' : '';
    head.innerHTML = '<span class="wfChevron">▶</span>' +
        '<span class="wfTitle">' + title + '</span>' +
        '<span class="wfMeta">' + fmtTime(startVt) + ' — ' + fmtTime(endVt) + ' · ' + (span/1000).toFixed(2) + 's window</span>' +
        (ttifTxt ? '<span class="wfTtif">' + ttifTxt + '</span>' : '');
    head.onclick = (ev) => {
        ev.stopPropagation();
        wf.classList.toggle('collapsed');
        wf.dataset.userToggled = '1';
    };
    wf.appendChild(head);

    const body = document.createElement('div');
    body.className = 'wfBody';

    // Chip flow header — phases in order as colored pills (inside card)
    if (phases.length) {
        const cf = document.createElement('div');
        cf.className = 'chipFlow';
        phases.forEach((p, i) => {
            if (i > 0) {
                const ar = document.createElement('span');
                ar.className = 'arrow';
                ar.textContent = '→';
                cf.appendChild(ar);
            }
            const ph = document.createElement('span');
            ph.className = 'ph';
            ph.style.background = p.color;
            const compact = p.label.length > 32 ? p.label.slice(0, 31) + '…' : p.label;
            ph.textContent = compact;
            ph.title = p.label + ' — ' + (p.endTs - p.startTs).toFixed(0) + 'ms';
            ph.onclick = () => { vid.currentTime = tsToVideo(p.startTs); };
            cf.appendChild(ph);
        });
        body.appendChild(cf);
    }

    // ─ Background vlines: one per phase start + window start/end (no labels) ─
    const lineTs = new Set();
    lineTs.add(winStart);
    phases.forEach(p => { lineTs.add(p.startTs); lineTs.add(p.endTs); });
    lineTs.add(winEnd);
    const sortedLineTs = [...lineTs].sort((a, b) => a - b);
    const lineTicks = sortedLineTs.map(ts => ({
        ts, frac: (ts - winStart) / span,
        isFirst: ts === winStart, isLast: ts === winEnd
    }));

    // ─ Axis label ticks: choose ~6 evenly-spaced interval labels ─
    const N_AXIS = 6;
    const axisTicks = [];
    for (let k = 0; k <= N_AXIS; k++) {
        const frac = k / N_AXIS;
        const ts = winStart + frac * span;
        axisTicks.push({ ts, frac, isFirst: k === 0, isLast: k === N_AXIS });
    }

    // Axis: evenly-spaced interval labels. Selected-bar labels are added later.
    const axis = document.createElement('div');
    axis.className = 'axis';
    axisTicks.forEach(t => {
        const lbl = document.createElement('span');
        lbl.className = 'gridLabel' + (t.isFirst ? ' first' : '') + (t.isLast ? ' last' : '');
        lbl.style.left = (t.frac * 100).toFixed(3) + '%';
        const relSec = (t.ts - winStart) / 1000;
        lbl.textContent = (relSec < 10 ? relSec.toFixed(3) : relSec.toFixed(2)) + 's';
        axis.appendChild(lbl);
    });
    body.appendChild(axis);

    // Rows
    const rows = document.createElement('div');
    rows.className = 'rows';

    // Dotted vertical tick lines overlay (behind bars)
    const tickOv = document.createElement('div');
    tickOv.className = 'tickOverlay';
    lineTicks.forEach(t => {
        const vl = document.createElement('div');
        vl.className = 'vline' + (t.isFirst ? ' first' : '') + (t.isLast ? ' last' : '');
        vl.style.left = (t.frac * 100).toFixed(3) + '%';
        tickOv.appendChild(vl);
    });
    rows.appendChild(tickOv);

    const playLine = document.createElement('div');
    playLine.className = 'playLine';
    playLine.style.display = 'none';
    rows.appendChild(playLine);

    phases.forEach(p => {
        const row = document.createElement('div');
        row.className = 'wfRow';
        const dur = p.endTs - p.startTs;
        const leftPct = Math.max(0, ((p.startTs - winStart) / span) * 100);
        const widPct  = Math.max(0.4, (dur / span) * 100);
        row.innerHTML = '<div class="label" title="' + p.label.replace(/"/g, '&quot;') + '">' + p.label + '</div>' +
            '<div class="track"><div class="bar" data-start-ts="' + p.startTs + '" data-end-ts="' + p.endTs + '" style="left:' + leftPct.toFixed(3) + '%;width:' + widPct.toFixed(3) + '%;background:' + p.color + '"></div></div>' +
            '<div class="dur">' + dur.toFixed(0) + 'ms</div>';
        const track = row.querySelector('.track');
        const bar = row.querySelector('.bar');
        // Clicking on the BAR itself toggles selection (highlights tick labels at its start/end).
        // Clicking on the track BACKGROUND seeks the video to that point.
        bar.onclick = (ev) => {
            ev.stopPropagation();
            selectBar(wf, p, bar);
        };
        track.onclick = (ev) => {
            ev.stopPropagation();
            if (ev.target === bar) return; // already handled
            const r = track.getBoundingClientRect();
            const frac = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
            vid.currentTime = tsToVideo(winStart + span * frac);
        };
        rows.appendChild(row);
    });

    body.appendChild(rows);
    wf.appendChild(body);
    return wf;
}

function buildLegend() {
    const el = document.createElement('div');
    el.className = 'wfLegend';
    PHASE_CATEGORIES.forEach(c => {
        const item = document.createElement('span');
        item.className = 'item';
        item.innerHTML = '<span class="sw" style="background:' + c.color + '"></span>' + c.label;
        el.appendChild(item);
    });
    return el;
}

// Cards are rendered ONCE in chronological order. The current section is
// auto-expanded; previously-current sections auto-collapse unless the user
// has manually toggled them (dataset.userToggled='1').
function renderWaterfall() {
    const el = $('waterfall');
    el.innerHTML = '';

    const navSections = SECTIONS.map((s, i) => ({ s, i })).filter(x => x.s.from);
    if (!navSections.length) return;

    navSections.forEach(x => {
        try {
            const card = buildWaterfallCard(x.i);
            el.appendChild(card);
        } catch (err) {
            console.error('Waterfall card failed for section', x.i, err);
            const fallback = document.createElement('div');
            fallback.className = 'wf collapsed';
            fallback.dataset.startTs = x.s.startTs;
            fallback.dataset.endTs = x.s.endTs;
            fallback.innerHTML = '<div class="wfHead"><span class="wfChevron">▶</span><span class="wfTitle">' +
                (x.s.from + ' → ' + x.s.to) + '</span><span class="wfMeta" style="color:var(--bad)">render error</span></div>';
            el.appendChild(fallback);
        }
    });

    // Expand the section the video is currently in; collapse the rest.
    applyAutoExpand();
}

// Auto-expand the current section, collapse the rest — but never override
// cards the user manually toggled (dataset.userToggled).
function applyAutoExpand() {
    const nowTs = videoToTs(vid.currentTime);
    document.querySelectorAll('.wf').forEach(wf => {
        if (wf.dataset.userToggled === '1') return;
        const sTs = +wf.dataset.startTs, eTs = +wf.dataset.endTs;
        const inSection = nowTs >= sTs && nowTs <= eTs;
        wf.classList.toggle('collapsed', !inSection);
        wf.classList.toggle('current', inSection);
    });
}

function updateWaterfallHighlight() {
    const nowTs = videoToTs(vid.currentTime);
    applyAutoExpand();

    // Update playLine + per-bar future/current states (no DOM re-render)
    document.querySelectorAll('.wf').forEach(wf => {
        const sTs = +wf.dataset.startTs, eTs = +wf.dataset.endTs;
        const inSection = nowTs >= sTs && nowTs <= eTs;
        const playLine = wf.querySelector('.playLine');
        const firstTrack = wf.querySelector('.wfRow .track');
        if (playLine && firstTrack && inSection && !wf.classList.contains('collapsed')) {
            const rowsR = wf.querySelector('.rows').getBoundingClientRect();
            const trackR = firstTrack.getBoundingClientRect();
            const frac = (nowTs - sTs) / (eTs - sTs);
            const leftPx = (trackR.left - rowsR.left) + frac * trackR.width;
            playLine.style.display = 'block';
            playLine.style.left = leftPx + 'px';
        } else if (playLine) {
            playLine.style.display = 'none';
        }
        wf.querySelectorAll('.bar').forEach(b => {
            const bs = +b.dataset.startTs, be = +b.dataset.endTs;
            b.classList.toggle('future', bs > nowTs);
            // Don't clobber the 'selected' class with 'current'
            if (!b.classList.contains('selected')) {
                b.classList.toggle('current', bs <= nowTs && nowTs <= be);
            }
        });
    });
}

// TTIF toggle
$('wfTtfiOnly').onchange = (e) => {
    wfTtfiOnly = e.target.checked;
    renderWaterfall();
};

// ── How it Works (documentation) ──────────────────────────────────
function renderHowItWorks() {
    const el = document.getElementById('howitworks');
    if (!el) return;
    function card(color, title, tag, bodyHtml) {
        return '<div class="hwCard"><div class="hwHead">' +
            '<span class="hwDot" style="background:' + color + '"></span>' +
            '<span class="hwTitle">' + title + '</span>' +
            (tag ? '<span class="hwTag">' + tag + '</span>' : '') +
            '</div><div class="hwBody">' + bodyHtml + '</div></div>';
    }
    let h = '';
    h += '<div class="hwIntro">This viewer parses the <b>[WM-PERF]</b> structured log emitted by the WaveMaker performance tracker. ' +
         'Every event carries <code>seq</code> (monotonic id), <code>ts</code> (Date.now wall-clock) and <code>hts</code> ' +
         '(performance.now, sub-ms). All durations below are computed from these timestamps. A <b>visit</b> = one page mount ' +
         '(a <code>COMPONENT/FRAGMENT_READY</code> with <code>isPage=true</code>); a <b>section</b> = one navigation (NAV/START → next NAV/START).</div>';

    h += card('var(--comp)', 'Component TTI (Time To Interactive)', 'COMPONENT/MOUNT → COMPONENT/TTI',
        '<p>Each component logs <code>MOUNT</code> when React mounts it, then the tracker schedules a <b>double requestAnimationFrame</b> callback. ' +
        'The second rAF fires <i>after</i> the next paint commits to the native UI thread — so the pixels the component rendered are actually on screen.</p>' +
        '<div class="hwFormula">TTI(ms) = TTI_callback_time − MOUNT_time</div>' +
        '<p class="dim">Double-rAF replaces InteractionManager so TTI matches "user sees pixels" within ~16ms (one frame), instead of 16–300ms late.</p>');

    h += card('var(--nav)', 'Navigation phases: dispatch → unmount → mount', 'three discrete bars',
        '<p>A page transition is shown as three separate bars (their <i>order varies</i> by page — WaveMaker sometimes mounts the new page before tearing down the old):</p>' +
        '<ul class="hwSteps">' +
        '<li><b>Nav dispatch</b> = <code>NAV/START</code> (goToPage) → <code>NAV/DISPATCHED</code> (route handed to React Navigation).</li>' +
        '<li><b>Page unmount</b> = the old page\\'s teardown — the first run of <code>COMPONENT/UNMOUNT</code> events (clustered, &lt;200ms apart).</li>' +
        '<li><b>Page mount</b> = the new page container\\'s <code>COMPONENT/MOUNT</code> → its <code>FRAGMENT_READY</code> (the actual mount, often ~1ms; the long gap before it is RN-transition + old-page teardown, not mount work).</li>' +
        '</ul>' +
        '<p class="hwNote">Double-mount quirk: WaveMaker can mount a page container twice within ~150ms (the first is discarded, flagged by a stale wmReady). Such re-mounts are collapsed to the FIRST mount (when the page first appears — matching the video/timeline), while the visit window still runs to the next nav so TTFI captures the full settle.</p>');

    h += card('var(--good)', 'First render → TTI', 'container mount → first widget TTI',
        '<p><b>First render → TTI</b> = the page container\\'s mount → its first <code>COMPONENT/TTI</code> — the skeleton / initial frame painted (uses the same double-rAF "user sees pixels" timing as Component TTI).</p>');

    h += card('var(--good)', 'TTFI (Time To First Interaction)', 'mount → page becomes interactive',
        '<p>The moment the page first becomes usable after mount. Resolved in priority order, all capped at a real user interaction (UIB):</p>' +
        '<ul class="hwSteps">' +
        '<li><b>Auto-focus</b> — first <code>INPUT/FOCUS</code> that lands within 500ms of a render. The framework auto-selected an input → cursor ready to type. The burst stops at <code>KEYBOARD/SHOW</code> so keyboard layout re-renders do not inflate TTFI.</li>' +
        '<li><b>Post-API render</b> — the render burst right after the first post-mount service/live API\\'s <code>INVOKE_END</code>. The page\\'s first real data is on screen. Later APIs fill in background data and don\\'t delay interactivity.</li>' +
        '<li><b>Render-settle</b> — no API and no focus: the last page render before it goes idle (a render gap), i.e. the page rendered then waited for you.</li>' +
        '</ul>' +
        '<div class="hwFormula">UIB = first real tap (USER/TOUCH_START, user-driven EVENT/TRIGGER,\\n      INPUT/SUBMIT, or a LATE input focus = manual tap)\\nTTFI = (chosen interactive point) − mount,  but never past the UIB</div>' +
        '<p class="dim">INPUT/COMMIT is NOT a UIB — it can be programmatic auto-fill (e.g. a barcode scan populating fields, logged with source=keystroke), and even genuine typing happens after the page is already interactive.</p>' +
        '<p class="hwNote">An input focus more than 500ms after the last render is treated as a manual tap (you tapping the field), not auto-focus — so it caps TTFI rather than defining it. Text inputs aren\\'t Tappables, so they emit no TOUCH_START to distinguish the two.</p>');

    h += card('var(--http)', 'API / Variable time', 'INVOKE_START → INVOKE_END',
        '<p>Each service/live variable (and action) invoke is timed from <code>INVOKE_START</code> to <code>INVOKE_END</code> — pure network round-trip time. <code>INVOKE_END</code> fires when the response data is written (<code>DATASETWRITE</code>). <code>SUCCESS</code> fires later, after AFTER_INVOKE handlers run. For error paths where <code>INVOKE_END</code> may not fire, <code>ERROR</code> is used instead.</p>' +
        '<div class="hwFormula">bar = INVOKE_START → INVOKE_END  (or ERROR)</div>' +
        '<p>The summary <b>API</b> column collapses overlapping invokes into wall-time (parallel calls aren\\\'t double-counted) and adds the onSuccess gap to the first post-API render:</p>' +
        '<div class="hwFormula">API column = collapsed_wall_time + onSuccess_handler_gap</div>');

    h += card('var(--memo)', 'Re-render &amp; Script — one refresh-cycle model', 'APP/REFRESH_START → committed render',
        '<p>Every committed <code>APP/REFRESH_START</code> cycle (a refresh that actually rendered — <code>MEMO/WATCHER_DRIVEN_RENDER</code> or <code>COMPONENT/UPDATE|TTI</code>; pure <code>SCU_BAIL</code> refreshes are skipped) is ONE bar, split into two buckets:</p>' +
        '<ul class="hwSteps">' +
        '<li><b>Script</b> (green) — a <code>VAR/DATASETWRITE</code> (page/app scope) drove the cycle. Script-level code (binding cascades, setTimeout, lifecycle hooks) changed data and forced the re-render.</li>' +
        '<li><b>Re-render</b> (purple) — no write; a pure React render pass.</li>' +
        '</ul>' +
        '<div class="hwFormula">Script    = Σ write-driven cycle durations\\nRe-render = Σ pure cycle durations</div>' +
        '<p>Each bar is attributed to its trigger (closest cause within ~400ms: a write name, API <code>SUCCESS</code>, <code>EVENT/TRIGGER</code>, tap…).</p>' +
        '<p class="hwNote">The Page Waterfall renders these exact cycles, so the waterfall bars and the Page Flow Summary Script / Re-render columns are consistent by construction — the drawer lists sum to the columns.</p>');

    h += card('var(--user)', 'Tap &amp; Submit', 'USER/TOUCH_START · INPUT/SUBMIT|COMMIT',
        '<p>A tap bar spans from the touch to the <b>earliest</b> of: its matching <code>TOUCH_END</code> (only if within 800ms — a later one is a mismatched release), or the first thing it triggered (<code>EVENT/TRIGGER</code>, nav, invoke, setState, commit, keyboard/modal/spinner show).</p>' +
        '<p class="dim">The leading tap of each section is the one that caused the navigation; mid-window taps that didn\\'t navigate are shown too.</p>');

    h += card('#bb86fc', 'Spinner / Modal / Keyboard overlays', 'SHOW → HIDE',
        '<p>Spinner, Modal, Toast, Display and Keyboard bars span their actual <code>SHOW</code> → <code>HIDE</code> visibility window — the full time the overlay was on screen. (A spinner suppressed before paint per the tracker\\'s v3.2 logic emits a HIDE-only pair and is reconstructed from its <code>ms</code> field.)</p>');

    h += card('var(--nav)', 'Navigation tab', 'NAV/START → new page MOUNT',
        '<p>One card per navigation, from the call that triggered it to the new page mounting (= navigation complete; the new page\\'s own TTI is page-load, shown separately). Metric tiles:</p>' +
        '<ul class="hwSteps">' +
        '<li><b>Dispatch</b> — <code>NAV/START</code> → <code>NAV/DISPATCHED</code> (route handed to React Navigation).</li>' +
        '<li><b>Old page unmount</b> — when the previous page container <code>UNMOUNT</code>s (relative to start).</li>' +
        '<li><b>RN transition</b> — unmount → new mount gap (shown only when the old page unmounts first; otherwise "new mounted first").</li>' +
        '<li><b>New page mount</b> — the new container <code>MOUNT</code> (navigation complete).</li>' +
        '</ul>' +
        '<p>Expand a card for the full event timeline after dispatch — old-page re-renders and binding batches (<code>EVENT/TRIGGER</code>) that delay teardown, then the unmount, RN-transition gap, and the new mount.</p>');

    h += card('var(--hi)', 'Video ↔ log sync', 'offset',
        '<p>The log and the screen-recording start at different moments. Sync maps log time to video time:</p>' +
        '<div class="hwFormula">videoTime = (logTs − firstLogTs) / 1000 + offset</div>' +
        '<p>Right-click any timeline event to mark it, seek the video to that exact frame, then click the video. The offset is solved so the marked event lands on the current frame:</p>' +
        '<div class="hwFormula">offset = videoCurrentTime − (markedLogTs − firstLogTs) / 1000</div>');

    h += card('var(--watcher)', 'What is filtered out', 'noise reduction',
        '<p>High-frequency framework chatter is summarized, not drawn as bars: <code>WATCHER/CHECK_*</code> (shown as the density strip in Flow Timeline), <code>MEMO/SCU_BAIL</code>, <code>APP/REFRESH_QUEUED</code>, and raw <code>COMPONENT/MOUNT|UNMOUNT|UPDATE|SETSTATE_QUEUED</code> (used internally to derive the phases above).</p>');

    el.innerHTML = h;
}

// ── Navigation tab ────────────────────────────────────────────────
function navSpeedClass(ms) { return ms == null ? 'dim' : ms <= 800 ? 'fast' : ms <= 2000 ? 'mid' : 'slow'; }
function renderNavigation() {
    const el = document.getElementById('navigation');
    if (!el) return;
    if (!NAVIGATIONS.length) { el.innerHTML = '<div style="color:var(--dim);padding:12px">No navigations found.</div>'; return; }
    const dotColor = { nav:'var(--nav)', mount:'var(--comp)', unmount:'#d98a8a', tti:'var(--good)', binding:'var(--dim)', api:'var(--http)', write:'var(--var)', renders:'var(--memo)' };
    let h = '<div style="color:var(--dim);font-size:12px;padding:4px 4px 12px">Each navigation, from the call that triggered it to the new page becoming interactive. Expand to see what runs <b>after dispatch</b> — old-page re-renders and binding batches that delay teardown.</div>';
    NAVIGATIONS.forEach((n, i) => {
        const total = n.newMountMs;   // navigation completes when the new page mounts
        const tc = navSpeedClass(total);
        const startVt = tsToVideo(n.startTs);
        h += '<div class="navCard collapsed" data-idx="' + i + '" data-start-ts="' + n.startTs + '">' +
            '<div class="navHead">' +
              '<span class="navChev">▶</span>' +
              '<span class="navTitle"><span class="from">' + n.from + '</span> → <span class="to">' + n.to + '</span>' +
                (n.triggerName ? ' <span style="color:var(--dim);font-weight:400;font-size:11px">via ' + n.triggerName + '</span>' : '') + '</span>' +
              '<span class="navTotal ' + tc + '">' + (total != null ? total + 'ms' : '—') + '</span>' +
            '</div>' +
            '<div class="navBody">' +
              '<div class="navMetrics">' +
                metric('Dispatch', n.dispatchMs) +
                metric('Old page unmount', n.oldUnmountMs, 'after start') +
                (n.transitionMs != null && n.transitionMs > 0
                    ? metric('RN transition', n.transitionMs, 'unmount→mount')
                    : '<div class="navMetric"><div class="lbl">RN transition</div><div class="val dim">n/a</div><div class="sub">new mounted first</div></div>') +
                metric('New page mount', n.newMountMs, 'nav complete') +
                metric('Page interactive', n.newTtiMs, 'TTI, after mount') +
              '</div>' +
              renderNavTimeline(n) +
            '</div>' +
          '</div>';
    });
    el.innerHTML = h;
    el.querySelectorAll('.navHead').forEach(head => {
        head.onclick = (ev) => {
            const card = head.parentElement;
            // click on the time chip seeks; elsewhere toggles
            card.classList.toggle('collapsed');
        };
    });
    // double-click title area seeks video to nav start
    el.querySelectorAll('.navCard').forEach(card => {
        card.querySelector('.navTitle').onclick = (ev) => { ev.stopPropagation(); vid.currentTime = tsToVideo(+card.dataset.startTs); };
    });

    function metric(lbl, ms, sub) {
        const c = navSpeedClass(ms);
        return '<div class="navMetric"><div class="lbl">' + lbl + '</div>' +
               '<div class="val ' + c + '">' + (ms != null ? ms + 'ms' : '—') + '</div>' +
               (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>';
    }
    function renderNavTimeline(n) {
        let t = '<div class="navTimeline">';
        let prevKind = null, prevRel = 0;
        n.detail.forEach((d) => {
            const tstr = d.rel + 'ms';
            // Insert an "RN transition" gap note between the old page's UNMOUNT
            // run and the new page's first MOUNT, when there's real dead time.
            if (d.kind === 'mount' && prevKind === 'unmount' && d.rel - prevRel > 30) {
                t += '<div class="navGap">⋯ ' + (d.rel - prevRel) + 'ms React Navigation transition ⋯</div>';
            }
            const dot = '<span class="dot" style="background:' + (dotColor[d.kind] || 'var(--dim)') + '"></span>';
            if (d.kind === 'renders') {
                t += '<div class="navEv renders"><span class="t">' + tstr + '</span>' + dot + '<span class="lbl">' + d.count + ' widget render' + (d.count > 1 ? 's' : '') + '</span></div>';
            } else {
                t += '<div class="navEv ' + d.kind + '"><span class="t">' + tstr + '</span>' + dot + '<span class="lbl">' + d.label.replace(/</g, '&lt;') + '</span></div>';
            }
            prevKind = d.kind; prevRel = d.rel;
        });
        t += '</div>';
        return t;
    }
}

// Init
renderFilters();
renderTimeline();
renderSummary();
renderWaterfall();
renderNavigation();
renderHowItWorks();

// Extend tick to update summary + waterfall
const _origUpdateHighlight = updateHighlight;
updateHighlight = function () {
    _origUpdateHighlight();
    updateSummaryHighlight();
    updateWaterfallHighlight();
};

// Re-render summary + waterfall when offset changes
const _origRenderTimeline = renderTimeline;
renderTimeline = function () {
    _origRenderTimeline();
    renderSummary();
    renderWaterfall();
};
</script>
</body>
</html>
`;

fs.writeFileSync(OUT_PATH, html);
console.log(`Wrote ${OUT_PATH}  (${(html.length/1024).toFixed(1)} KB)`);
