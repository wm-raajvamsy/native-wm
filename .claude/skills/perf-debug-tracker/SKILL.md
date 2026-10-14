---
name: perf-debug-tracker
description: Injects, verifies, captures and analyses the WM performance/debug tracker for a WaveMaker RN app on BOTH web and mobile — the mandatory instrumentation for every app this repo's workflow builds. Pre-generation it copies perf-tracker/wm-performance-tracker.js into <PROJECT>/src/main/webapp/resources/files/ and adds the require + WMPerf.enable/trackApp/trackLib/trackAppVars calls; post-generation it VERIFIES the patch survived in generated-web AND generated-mobile (codegen rewrites App.js on every transpile, so the require is wiped every time and must be re-added); then it captures the [WM-PERF] log (adb logcat on Android, DevTools console export on web) and turns it into an interactive HTML report via perf-tracker/generate-perf-viewer.js. Use this whenever instrumenting, running, verifying, debugging or profiling a generated WaveMaker RN app, whenever a bug or slowness needs diagnosing, and at every generate as the patch-presence gate. Findings MUST be grounded in captured tracker data — component render/TTI, watcher dirty-check cost, refresh cycles, variable invoke timing, navigation breakdown — never in source reading alone. Do NOT diagnose a runtime problem without capturing a log first, and do NOT run an app whose patch-presence check failed.
---

# Perf / debug tracker (web + mobile)

The app's black-box recorder. Every runtime question — "why is this slow", "why did it render
twice", "why did that API fire on mount", "where did the 400 ms go" — is answered from **captured
data**, not from reading source and reasoning about what probably happens.

Files live in `perf-tracker/` at this repo's root. `perf-tracker/inject-snippet.md` has the exact
copy/paste edits; `perf-tracker/README.md` has the full reference.

## Hard rules

1. **Injection is mandatory before generating.** An app generated without the patch produces no
   data and every later diagnosis is guesswork.
2. **Verify after every generate, on both targets.** Codegen rewrites `App.js`, so the require is
   wiped by each `transpile`. A failed check is a stop — fix it before running the app.
3. **Diagnose from the log.** Before proposing a cause or a fix for any runtime behaviour, capture
   a log that shows it. State the events and `ms` values you are relying on.
4. **Both platforms.** Web and mobile get the same treatment; a fix verified on one is not verified
   on the other.

---

## Step 1 — Inject (BEFORE generating)

**1a. Patch file — once per project, survives regeneration:**

```bash
cp perf-tracker/wm-performance-tracker.js \
   <PROJECT>/src/main/webapp/resources/files/wm-performance-tracker.js
```

`src/main/webapp/resources/files/` already exists in `BlankApp/`. It is **source**, so codegen
copies it into the generated app and this edit is not lost.

**1b. Require + enable — in the generated `App.js`, re-applied after every generate:**

At the very top of `<GENERATED>/App.js`:
```js
require('./assets/resources/files/wm-performance-tracker.js');
```
In its `componentDidMount`:
```js
global.WMPerf && global.WMPerf.enable();
global.WMPerf && global.WMPerf.trackApp(this);
global.WMPerf && global.WMPerf.trackLib(this);
global.WMPerf && global.WMPerf.trackAppVars(this.Variables, this.Actions);
```

`trackApp` enables `APP/REFRESH_QUEUED|START|END`; `trackLib` enables `SCRIPT/TIMEOUT|INTERVAL`;
`trackAppVars` subscribes app-level variables/actions. Skipping any one silently drops that whole
event class — do not skip them because the app "still logs something".

Do **not** relocate 1b into `src/main/webapp/app.js` without testing: that file is a WaveMaker app
script (`App.onAppVariablesReady`, `App.onPageReady`, …), not a CommonJS module, and a bare
`require()` there is not known to resolve. If you verify a source-side hook, document it in
`perf-tracker/inject-snippet.md` and it becomes the primary path.

## Step 2 — Verify (AFTER every generate, both targets)

```bash
for d in generated-web generated-mobile; do
  echo "── $d"
  ls  "<PROJECT>/$d/assets/resources/files/wm-performance-tracker.js" >/dev/null 2>&1 \
      && echo "  patch file: OK" || echo "  patch file: MISSING"
  grep -q "wm-performance-tracker" "<PROJECT>/$d/App.js" \
      && echo "  require:    OK" || echo "  require:    MISSING — re-add"
  grep -q "WMPerf.enable"          "<PROJECT>/$d/App.js" \
      && echo "  enable():   OK" || echo "  enable():   MISSING — re-add"
done
```

Three OKs on both targets, or fix before running. Then confirm it is **live**: the first
`[WM-PERF]` line of any session is `{"type":"META","event":"ENABLED","version":"3.6",...}`. No
META/ENABLED means the patch never executed — the require is missing or landed below another import.

## Step 3 — Capture

**Mobile (Android):**
```bash
adb logcat -c && adb logcat -s ReactNativeJS | grep --line-buffered '\[WM-PERF\]' > perf-mobile.log
```

**Web:** DevTools → Console → filter `[WM-PERF]` → right-click → *Save as…* → `perf-web.log`.

The parser finds `[WM-PERF] ` anywhere in a line, so any prefix is fine. If a browser export appends
a source location after the JSON on the same line, strip it or those lines are skipped.

Capture the **shortest** run that reproduces the problem — logs are dense (a 54 s session ran 34k
events, ~26k of them `WATCHER`).

## Step 4 — Analyse

```bash
node perf-tracker/generate-perf-viewer.js perf-mobile.log output/perf-mobile.html
```

The CLI prints visit/navigation counts and per-section durations; the HTML has five tabs:

| Tab | Use it for |
| --- | --- |
| **summary** | Per-page-visit TTFI, and the API / script / re-render split |
| **waterfall** | Where a single visit's time actually went |
| **timeline** | Every event, chronologically — the raw truth |
| **navigation** | Per-nav: trigger → dispatch → old unmount → transition → new mount → TTI |
| **howitworks** | The metric definitions (read before quoting a number) |

Optional video sync: `./perf-tracker/add-timestamps.sh recording.mp4` → `recording_ts.mp4`, then
load it in the viewer and set the sync point.

### Reading the data

| Question | Evidence |
| --- | --- |
| Page slow to become usable? | `summary` TTFI + its `ttfiBasis` (`auto-focus` / `post-api-render` / `render-settle` / `initial-render`) |
| API, script, or React? | the summary's API / script / re-render columns — they are derived from the same refresh cycles the waterfall draws, so they reconcile by construction |
| Unaccounted gap? | `COMPONENT/RENDER` per widget, and any gap between `APP/REFRESH_END` and the next `MOUNT`/`UPDATE` — that gap is native-thread work (Yoga layout, bridge commits), not JS |
| Binding/dirty-check cost? | `WATCHER/CHECK_START` → `CHECK_END` `ms`, with `count` |
| Rendering when it shouldn't? | `MEMO/WATCHER_DRIVEN_RENDER` vs `MEMO/SCU_BAIL` |
| Duplicate/unexpected API? | `VAR`/`ACTION` `INVOKE_START` → `INVOKE_END` pairs, plus `DATASETWRITE` |
| Navigation cost: animation or reconciliation? | `NAV/TRANSITION_END` vs `MOUNT`; `NAV/PATH` `branch` tells you which goToPage path ran |
| Crash / caught error? | `ERROR/CAUGHT` with `componentStack` |

## Caveats

- **Web is less proven than Android.** Developed and validated Android-first (the v3.4 fix was
  Metro-specific). No Android-only API dependency, so it should run under react-native-web — but on
  the first web run, confirm `[WM-PERF]` lines actually appear before treating an empty log as
  "nothing happened". Report it if they don't; don't silently fall back to guessing.
- `parse-perf-log.js` does not exist — the tracker's docstring references it; ignore that.
- `add-timestamps.sh` needs Python + Pillow (auto-detected; override `PYTHON=…`).
- `WMPerf.disable()` stops logging; in-flight callbacks still fire.

## Recap checklist

- [ ] Patch copied to `<PROJECT>/src/main/webapp/resources/files/wm-performance-tracker.js` **before** generating
- [ ] `require` + `enable`/`trackApp`/`trackLib`/`trackAppVars` present in the generated `App.js`
- [ ] Patch-presence check passed on **both** `generated-web` and `generated-mobile`
- [ ] `META/ENABLED` seen in the live log — the patch actually executed
- [ ] Log captured for the specific flow under investigation (shortest reproducing run)
- [ ] Viewer generated; findings quoted as concrete events + `ms`, not impressions
- [ ] Fix re-verified from a **fresh** capture on both platforms
