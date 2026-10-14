# Injection snippet — copy/paste

Two edits. Both are MANDATORY before generating any preview.

## 1. The patch file (source side — survives regeneration)

```bash
cp perf-tracker/wm-performance-tracker.js \
   <PROJECT>/src/main/webapp/resources/files/wm-performance-tracker.js
```

`src/main/webapp/resources/files/` already exists in `BlankApp/`. Codegen copies it into the
generated app, so this edit is made **once per project** and survives every re-transpile.

## 2. The require + enable calls (generated side — RE-ADDED AFTER EVERY GENERATE)

At the **very top** of the generated `App.js` (`<GENERATED>/App.js`), before any other import:

```js
require('./assets/resources/files/wm-performance-tracker.js');
```

Then inside the App component's `componentDidMount`:

```js
global.WMPerf && global.WMPerf.enable();
global.WMPerf && global.WMPerf.trackApp(this);
global.WMPerf && global.WMPerf.trackLib(this);
global.WMPerf && global.WMPerf.trackAppVars(this.Variables, this.Actions);
```

### Why this one is post-generation

`App.js` is **generated output** — codegen rewrites it on every `transpile`, so these two edits
are wiped by each regenerate. That is exactly why the post-generation checklist verifies them and
re-adds if missing, for **both** `generated-web/` and `generated-mobile/`.

Do not try to move this into `src/main/webapp/app.js` without testing it: that file is a WaveMaker
**app script** (it defines `App.onAppVariablesReady`, `App.onPageReady`, …), not a CommonJS module,
and a bare `require()` there is not known to resolve. If you verify a source-side hook that works,
document it here and it becomes the primary path.

## 3. Verify (both targets, after every generate)

```bash
for d in generated-web generated-mobile; do
  echo "── $d"
  ls  "<PROJECT>/$d/assets/resources/files/wm-performance-tracker.js" 2>/dev/null \
      && echo "  patch file: OK" || echo "  patch file: MISSING"
  grep -q "wm-performance-tracker" "<PROJECT>/$d/App.js" \
      && echo "  require:    OK" || echo "  require:    MISSING — re-add it"
  grep -q "WMPerf.enable"          "<PROJECT>/$d/App.js" \
      && echo "  enable():   OK" || echo "  enable():   MISSING — re-add it"
done
```

All three must say OK on both targets before you run the app. A missing require means the app runs
with **zero** perf data and every later diagnosis is guesswork.
