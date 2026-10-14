# perf-tracker — debug + performance tracker (web & mobile)

The **mandatory** instrumentation for every app this repo's workflow builds. It is not an optional
perf tool: it is the primary source of truth for diagnosing anything in the app — a bug, a slow
page, a re-render storm, an API that fires twice. Guessing from source reading when this data could
have been captured is not acceptable under `workflow.md`.

| File | What it is |
| --- | --- |
| `wm-performance-tracker.js` | v3.6 in-app patch. Logs structured JSON tagged `[WM-PERF]` to console. |
| `generate-perf-viewer.js` | Node CLI. Log → single self-contained HTML report (5 tabs). |
| `add-timestamps.sh` | Optional. Burns ms timestamps into a screen recording for video↔log sync. |
| `inject-snippet.md` | The exact copy/paste edits + the verify commands. |

## The loop

```
inject (pre-generate)  →  generate  →  verify patch present (both targets)
      →  run + reproduce  →  capture log  →  generate viewer  →  diagnose from the data
```

## 1. Inject — before generating

See `inject-snippet.md`. Two edits: the patch into
`<PROJECT>/src/main/webapp/resources/files/`, and the `require` + `WMPerf.enable()/trackApp/
trackLib/trackAppVars` calls into the generated `App.js`.

**The `App.js` edit is wiped by every `transpile`** — codegen regenerates that file. Always re-verify
after generating.

## 2. Capture

**Mobile (Android):**
```bash
adb logcat -c && adb logcat -s ReactNativeJS | grep --line-buffered '\[WM-PERF\]' > perf-mobile.log
```

**Web:** the tracker writes to the browser console. Open DevTools → Console, filter on `[WM-PERF]`,
then right-click → *Save as…* → `perf-web.log`.

The parser locates `[WM-PERF] ` anywhere in a line and parses from there, so **any** log prefix
(logcat metadata, browser timestamps) is tolerated. If a browser export appends a source location
(`App.js:12`) *after* the JSON on the same line, strip that suffix or those lines are skipped.

## 3. Analyze

```bash
node perf-tracker/generate-perf-viewer.js perf-mobile.log output/perf-mobile.html
```

Then open the HTML. Five tabs: **summary** (per-visit TTFI + API/script/re-render split),
**waterfall**, **timeline** (every event), **navigation** (per-nav breakdown), **howitworks**
(the metric definitions).

Optional video sync:
```bash
./perf-tracker/add-timestamps.sh recording.mp4     # → recording_ts.mp4
```

## What it captures

`COMPONENT` (mount/update/**render**/TTI/unmount/setstate) · `WATCHER` (dirty-check cost) ·
`MEMO` (render vs SCU-bail) · `APP` (refresh cycles) · `VAR`/`ACTION` (invoke timing, dataset writes) ·
`NAV` (path branch, dispatch, transition-end) · `USER` (touch, long-tap, back, idle) ·
`INPUT` (focus/keypress/commit/submit) · `HTTP` (per-axios timing) · `KEYBOARD` · `SPINNER`/`MODAL`/
`TOAST`/`DISPLAY` · `ERROR` (caught) · `SCRIPT` (timers) · `NETWORK` · `AUTH` · `LOCALE` · `A11Y`.

Every event carries `seq` (monotonic id), `ts` (wall clock, for log correlation) and `hts`
(`performance.now`, immune to clock skew). All `ms` deltas use the monotonic clock. TTI fires after a
double `requestAnimationFrame`, so it matches "user sees pixels" within ~16 ms.

## Known caveats

- **Web is less proven than Android.** The tracker was developed and validated Android-first (its
  v3.4 fix was Metro-specific). It has no Android-only API dependency, so it should run under
  react-native-web — but on the **first** web run, confirm `[WM-PERF]` lines actually appear in the
  console before trusting an empty log as "nothing happened".
- `parse-perf-log.js` does not exist. The tracker's own docstring references it; ignore that —
  `generate-perf-viewer.js` is the parser.
- `add-timestamps.sh` needs Python + Pillow. This copy auto-detects an interpreter that has Pillow
  (override with `PYTHON=…`); install with `python3 -m pip install Pillow`.
- Logs get large fast — the bundled upstream sample is 34k events over 54s, ~26k of them `WATCHER`.
  Capture the shortest run that reproduces the problem.
- `WMPerf.disable()` stops logging; in-flight callbacks still fire.

Upstream: `/Users/raajr_500278/wm-performance` (repo `wm-perf`), with a runnable `sample/`.
