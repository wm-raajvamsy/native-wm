---
name: crashlytics
description: "Firebase Crashlytics crash & error reporting for WaveMaker React Native Expo apps using @react-native-firebase/crashlytics (v22+ modular API). Builds on the shared Firebase baseline owned by the firebase router (project setup, google-services.json / GoogleService-Info.plist, @react-native-firebase/app, app.json basics), then owns the Crashlytics-specific bits: the crashlytics plugin, the firebase.json config keys, a web/native crashlytics helper module split under resources/files/firebase/, a startup bootstrap in app.js, and — after compulsorily asking the developer which pages/flows to instrument — wiring log / recordError / setAttribute / setUserId into those page scripts. Trigger on Crashlytics, crash reporting, crash logs, non-fatal errors, recordError, setAttribute, setUserId, firebase.json, @react-native-firebase/crashlytics, getCrashlytics."
---

# WaveMaker React Native — Firebase Crashlytics

## Overview

Adds **Firebase Crashlytics** crash and error reporting via **`@react-native-firebase/crashlytics`** on top of the shared Firebase baseline. Work through the steps in order; confirm each before continuing.

Crashlytics works **only on native builds** — Firebase modules are native, so the integration is inert in Studio Web Preview.

> **Modular API only.** As of React Native Firebase **v22**, the namespaced API (`crashlytics().log()`, `crashlytics().crash()`, …) is deprecated, prints console warnings on every call, and is slated for removal in the next major release. This skill uses the **modular API exclusively** (`getCrashlytics()` + standalone `log`, `recordError`, `crash`, …). Do not generate the namespaced form.

## When does it actually run? (execution model)

Writing the files in Steps 4–5 puts code on disk — it does **not** run it. There are two independent layers that activate at different times:

| Layer | Catches | When it becomes active |
|---|---|---|
| **Native SDK** (linked by the `app.json` plugin + native build, auto-initialized from `google-services.json` / `GoogleService-Info.plist`) | Native crashes — iOS signals, Android JVM, NDK | **At app launch, automatically. No JavaScript has to run.** |
| **JS crash handler + helper APIs** (`log`, `recordError`, `setAttribute`, `setUserId`) | Unhandled **JavaScript** exceptions (with a JS stack trace) and your manual calls | **Only once `@react-native-firebase/crashlytics` is `require`d.** The global JS exception handler installs the moment the module is first imported — not before. |

The helper module sitting in `resources/files/firebase/` does nothing until something `require`s it. If you only require it inside one page's `onReady`, JS crashes that happen **before** that page mounts get no JS stack trace. That's why **Step 6 requires the helper once at app startup** (`app.js`) so the JS handler is installed app-wide from launch. Native crash capture does not depend on this — but JS crash reporting and every helper call does.

## Scope

**This skill owns:**

- Registering `@react-native-firebase/crashlytics` (pinned to the **same version** as `@react-native-firebase/app`) and the matching `app.json` plugin entry
- Creating / merging `src/main/webapp/firebase.json` with the Crashlytics config keys
- A web + native crashlytics helper module pair (`crashlytics.web.js` / `crashlytics.native.js`) under `resources/files/firebase/`, wrapping the modular API
- A startup bootstrap in `app.js` so the JS handler installs at launch
- **Compulsorily asking the developer where crashes should be reported from**, then inspecting those pages and wiring in breadcrumbs, non-fatal `recordError`, custom attributes, and `setUserId`
- Confirming the Crashlytics dashboard in the Firebase Console

**This skill does not cover:**

- Server-side crash analysis, BigQuery export, or Crashlytics Alerts / Slack integrations
- dSYM / NDK symbol upload pipelines for fully symbolicated stack traces (auto-handled on EAS/native builds)
- Firebase Cloud Messaging, Analytics, Remote Config, or other Firebase modules — those route to their own sub-skills
- Missing `Page.Actions` / `Page.Variables`, broken navigation, or esbuild errors — treat these as **project / export / toolchain** issues

---

## Conventions

1. **Native modules use `require`, not `import`.** WaveMaker event scripts do not support ES `import`. Always `require('@react-native-firebase/crashlytics')`.
2. **Web platform guard via filename extension.** Firebase native modules throw in browser preview and have no web build. Use the `.web.js` / `.native.js` split — Metro resolves `crashlytics.native.js` on device and esbuild resolves `crashlytics.web.js` for web preview when you `require` the module **without** an extension. This keeps `@react-native-firebase/crashlytics` entirely out of the web bundle (the web build never references the native package).
3. **One version across all `@react-native-firebase/*` packages.** React Native Firebase requires every `@react-native-firebase/*` package to share the **exact same** version. `@react-native-firebase/crashlytics` must equal the `@react-native-firebase/app` spec already in `wm_rn_config.json`.

---

## Require paths — use these exactly (do not derive)

Every `require()` of the helper is a relative path **in the exported app**, not the `src/main/webapp/...` source path. Codegen emits `app.js` as `/App.js` at the project root, pages as `/src/pages/<Page>/<Page>.js`, and `resources/files/` as `/assets/resources/files/`. **Copy the exact string below for the file you are editing — never hand-count the `../`, never use a `src/main/webapp/...` path, never add a file extension.** A wrong path resolves to a missing module and **breaks the Metro / esbuild build** (this exact mistake has caused build failures).

| File you are editing | `require` path — copy verbatim |
|---|---|
| `app.js` — top of file, or inside any `App.*` handler | `require('./assets/resources/files/firebase/crashlytics')` |
| Any page — `pages/<Page>/<Page>.js` (`Page.onReady`, tap handlers, variable `onSuccess` / `onError`) | `require('../../../assets/resources/files/firebase/crashlytics')` |

Extensionless on purpose: Metro then resolves `crashlytics.native.js` on device and esbuild resolves `crashlytics.web.js` for web. After writing any `require`, re-check the leading segment matches this table — `./` only in `app.js`, `../../../` only in a page.

---

## Step 1 — Shared Firebase baseline (prerequisite)

The shared Firebase baseline — Firebase Console project + app registration, `google-services.json` /
`GoogleService-Info.plist` intake and validation, `@react-native-firebase/app` +
`expo-build-properties` install, and the shared `app.json` wiring — is owned and run by the
[`firebase`](../firebase.md) router (its **Phase A**) **before** this skill loads.

This skill assumes that baseline is already complete, and uses the same `<appId>` and Q1 platform
answers the baseline captured. If you reached this skill directly — not via the `firebase` router —
load `~{load_skill}(firebase)` and complete its Phase A baseline first, then return here.

---

## Step 2 — Confirm the Crashlytics dashboard (Firebase Console)

Crashlytics has **no provider toggle to flip** (unlike Cloud Messaging). It auto-activates the first time a crash report is received. Just confirm the dashboard exists:

1. In the [Firebase Console](https://console.firebase.google.com/), open your project.
2. In the left sidebar under **Release & Monitor**, click **Crashlytics**.
3. The first time, it shows a "Get started with Crashlytics" / "Waiting for your first crash" screen — that's expected. It populates after the first report arrives from a native build (Step 8).

> No SDK key, no API enablement, no console action is required here. If the developer already uses Crashlytics in this Firebase project, this screen already shows data — move on.

---

## Step 3 — Add `@react-native-firebase/crashlytics`

Delegate to plugin-installation:

```
~{load_skill}(plugin-installation)
```

Ask it to install **`@react-native-firebase/crashlytics`**. The shared baseline already installed `@react-native-firebase/app` and `expo-build-properties` — `plugin-installation` is idempotent, so re-running for those is a no-op.

**CRITICAL — version must match `@react-native-firebase/app`.** All `@react-native-firebase/*` packages must share one identical version:

1. Read the `@react-native-firebase/app` entry's `spec` from `src/main/webapp/wm_rn_config.json`.
2. Ensure the `@react-native-firebase/crashlytics` entry uses that **exact same** `spec`. If `plugin-installation` resolved a different version from the npm registry, overwrite the crashlytics `spec` so the two match.

After install, append `"@react-native-firebase/crashlytics"` to `expo.plugins[]` in `src/main/webapp/app.json` (only this one new entry — the baseline already added the rest):

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/crashlytics"
    ]
  }
}
```

Merge — do not replace the array.

> **Confirmation:** Reply when `@react-native-firebase/crashlytics` appears in `wm_rn_config.json` `plugins[]` (same version as `@react-native-firebase/app`) and in `app.json` `expo.plugins[]`. Do not proceed to Step 4 until confirmed.

---

## Step 4 — `firebase.json`

Crashlytics build-time behaviour is controlled by `firebase.json` at the **project root**. In a WaveMaker export, `src/main/webapp/app.json` lands at the Expo project root, and `src/main/webapp/firebase.json` lands beside it — so write the file to **`src/main/webapp/firebase.json`**.

Write (or **merge** into the existing `react-native` object — do not clobber keys another Firebase module added):

```json
{
  "react-native": {
    "crashlytics_debug_enabled": true,
    "crashlytics_auto_collection_enabled": true,
    "crashlytics_ndk_enabled": true,
    "crashlytics_is_error_generation_on_js_crash_enabled": true,
    "crashlytics_javascript_exception_handler_chaining_enabled": true
  }
}
```

### What each key does (verified against rnfirebase.io)

| Key | Default | Effect |
|---|---|---|
| `crashlytics_debug_enabled` | `false` | Crashlytics is **disabled in debug builds by default**. `true` lets you test crash reporting in a debug build. **Set to `false` (or remove) before shipping** so development crashes don't pollute production data. |
| `crashlytics_auto_collection_enabled` | `true` | Whether reports are sent automatically. Set `false` only for an explicit opt-in flow, then enable at runtime via `setCollectionEnabled(true)` once the user consents. |
| `crashlytics_ndk_enabled` | `true` | **Android only** — native (NDK) crash capture, including the Yoga layout engine. No effect on iOS. |
| `crashlytics_is_error_generation_on_js_crash_enabled` | `true` | Installs a global JS exception handler that records a crash with a JS stack trace on any unhandled JS exception. |
| `crashlytics_javascript_exception_handler_chaining_enabled` | `true` | After logging, the global JS handler chains to any previously installed handler instead of swallowing it. Leave `true` so other error handlers still fire. |

> **Confirmation:** Reply when `src/main/webapp/firebase.json` contains the `react-native` block above. Do not proceed to Step 5 until confirmed.

---

## Step 5 — Crashlytics helper module (web + native split)

Firebase modules are native — calling them in Studio's Web Preview throws, and `@react-native-firebase/crashlytics` has no web build. Use the platform-extension split: Metro resolves `.native.js` on device and esbuild resolves `.web.js` for web preview when you `require` the module **without** an extension. This keeps the native package entirely out of the web bundle.

All Firebase helper files live under **`src/main/webapp/resources/files/firebase/`** so they stay grouped as more Firebase features are added.

### Step 5a — `crashlytics.web.js`

Write **verbatim** to `src/main/webapp/resources/files/firebase/crashlytics.web.js`. Pure no-ops so Web Preview stays silent — it never imports the native package:

```javascript
// Crashlytics is native-only; these are no-ops so Web Preview stays clean.
function logEvent() {}
function reportError() {}
function identifyUser() {}
function setKey() {}
function setKeys() {}
function setCollectionEnabled() {}
function testCrash() {}

module.exports = {
    logEvent,
    reportError,
    identifyUser,
    setKey,
    setKeys,
    setCollectionEnabled,
    testCrash,
};
```

### Step 5b — `crashlytics.native.js`

Write **verbatim** to `src/main/webapp/resources/files/firebase/crashlytics.native.js`. This file loads only on device, so it imports the modular API directly — no platform guard needed. Every modular function takes the crashlytics instance as its first argument:

```javascript
const {
    getCrashlytics,
    log,
    recordError,
    crash,
    setAttribute,
    setAttributes,
    setUserId,
    setCrashlyticsCollectionEnabled,
} = require('@react-native-firebase/crashlytics');

// Importing this module + getting the instance installs the global JS
// exception handler. Required at app startup (Step 6) so JS crash reporting
// is active app-wide from launch.
const crashlytics = getCrashlytics();

// Breadcrumb attached to the next crash / non-fatal report.
function logEvent(message) {
    log(crashlytics, message);
}
// Report a caught (non-fatal) error with its JS stack trace.
function reportError(error, jsErrorName) {
    recordError(crashlytics, error, jsErrorName);
}
// Associate the current user with crash reports.
function identifyUser(userId) {
    setUserId(crashlytics, String(userId));
}
// Attach a single custom key/value (coerced to string).
function setKey(name, value) {
    setAttribute(crashlytics, name, String(value));
}
// Attach several string attributes at once, e.g. { email, plan }.
function setKeys(attributes) {
    setAttributes(crashlytics, attributes);
}
// Opt in/out of collection at runtime (only needed if
// crashlytics_auto_collection_enabled is false in firebase.json).
function setCollectionEnabled(enabled) {
    return setCrashlyticsCollectionEnabled(crashlytics, enabled);
}
// Force a crash — verification only, never ship a path that calls this.
function testCrash() {
    crash(crashlytics);
}

module.exports = {
    logEvent,
    reportError,
    identifyUser,
    setKey,
    setKeys,
    setCollectionEnabled,
    testCrash,
};
```

Require it **without** a file extension everywhere (`require('.../firebase/crashlytics')`). Metro picks `crashlytics.native.js` on device; esbuild picks `crashlytics.web.js` for web.

> **Confirmation:** Reply when both files exist under `src/main/webapp/resources/files/firebase/`. Do not proceed to Step 6 until confirmed.

---

## Step 6 — Bootstrap at app startup (`app.js`)

This step is **mandatory** — it installs the JS crash handler app-wide from launch. Without it, JS crash reporting only turns on once some page happens to require the helper.

Edit `src/main/webapp/app.js`. The generated `App.js` is emitted at the **project root**, so the path to the helper is `./assets/resources/files/firebase/crashlytics`.

**Editing rule:** `app.js` already holds the developer's lifecycle handlers (`App.onAppVariablesReady`, etc.). Do **not** remove or overwrite anything. Add only the require at the top of the file (after any existing requires):

```javascript
// Installs the Crashlytics JS crash handler at app launch (no-op on web).
const crashlytics = require('./assets/resources/files/firebase/crashlytics');
```

If a logged-in user is already known at startup, you may also identify them inside the existing `App.onAppVariablesReady` (append, don't replace):

```javascript
App.onAppVariablesReady = function () {
    // existing logic stays here
    const userId = App.Variables.loggedInUser?.dataSet?.userId;
    if (userId) {
        crashlytics.identifyUser(userId);
    }
};
```

> **Confirmation:** Reply when the require is at the top of `app.js`. Do not proceed to Step 7 until confirmed.

---

## Step 7 — Ask where to report from, then wire the pages (MANDATORY)

**Do not skip this step and do not assume.** Crashes are auto-captured app-wide after the build, but *enrichment* (which page, which user, which caught error) is what makes reports triageable — and only the developer knows where it matters. **You must ask the question below verbatim, wait for the answer, then edit the named pages.**

### 7a — Ask the developer (output verbatim)

> Fatal crashes are already captured app-wide. To make reports easy to triage, tell me **where** to add crash enrichment — reply with whichever of these apply (page names + handlers):
>
> 1. **Pages to tag** — which pages should set a `page` attribute + a breadcrumb on load? (e.g. `Main`, `Checkout`)
> 2. **Risky actions to wrap** — which button taps / service calls / variable handlers can throw and should report a non-fatal error? (e.g. `Checkout.payTap`, the `getOrders` LiveVariable `onError`)
> 3. **User identification** — which page + handler runs right after a successful login, where I should call `identifyUser(userId)` (plus any attributes like email/plan)?
> 4. **Just app-wide** — nothing page-specific; the startup bootstrap from Step 6 is enough.
>
> Name the pages/handlers and I'll wire them in.

### 7b — Check the pages exist

For every page the developer names, confirm `src/main/webapp/pages/<PageName>/<PageName>.js` exists and read it. If a named page is missing, list the pages that *do* exist under `src/main/webapp/pages/` and ask the developer to re-confirm — **never invent a page or handler**.

### 7c — Add the wiring (append, never overwrite)

Each edited handler `require`s the helper with the page path from **Require paths — use these exactly**: `../../../assets/resources/files/firebase/crashlytics`. Copy it verbatim — do not change the `../` count or add an extension. Append to existing handler bodies; create a handler only if the developer named one that doesn't yet exist.

**Pages to tag** — append to `Page.onReady` (Crashlytics can't map a crash to a page on its own, so a `page` attribute makes reports far easier to read):

```javascript
Page.onReady = function () {
    // existing logic stays here
    const crashlytics = require('../../../assets/resources/files/firebase/crashlytics');
    crashlytics.setKey('page', 'Checkout');
    crashlytics.logEvent('Checkout page ready');
};
```

**Risky actions to wrap** — read the named handler first. If it already has a `try/catch`, add `crashlytics.reportError(error)` to the existing `catch`. If not, wrap the existing body — preserving every statement — in `try/catch`:

```javascript
Page.payTap = function ($event, widget) {
    const crashlytics = require('../../../assets/resources/files/firebase/crashlytics');
    try {
        // ...existing handler body, unchanged...
    } catch (error) {
        crashlytics.reportError(error);   // logged as non-fatal; app keeps running
        throw error;                       // keep existing behaviour — remove if the handler already swallowed errors
    }
};
```

**User identification** — append to the login-success handler the developer names (a login button tap, or a `LoginVariable` / service-variable `onSuccess`):

```javascript
const crashlytics = require('../../../assets/resources/files/firebase/crashlytics');
crashlytics.identifyUser(userId);
crashlytics.setKeys({ email: userEmail, plan: 'free' });
```

**Just app-wide** — no page edits; Step 6 already covers it.

### 7d — Report what changed

List each file you edited and the calls added, e.g.:

```
Wired Crashlytics:
- pages/Checkout/Checkout.js — onReady: setKey('page','Checkout') + logEvent; payTap: try/catch + reportError
- pages/Login/Login.js — loginVar onSuccess: identifyUser + setKeys
```

> **Confirmation:** Reply when every named page is wired (or the developer chose "just app-wide"). Do not proceed to Step 8 until confirmed.

---

## Step 8 — Verify

Crashlytics needs a **native build** and a real crash to populate the dashboard. After all edits:

1. Re-export the app from WaveMaker Studio.
2. Run `npm install` in the generated Expo app root.
3. Run `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android` — Firebase is a native module and requires a full native build. It does **not** work in Expo Go.
4. Wire a temporary test-crash button to a tap handler and trigger it on the device:

   ```javascript
   Page.testCrashTap = function ($event, widget) {
       const crashlytics = require('../../../assets/resources/files/firebase/crashlytics');
       crashlytics.testCrash();
   };
   ```

5. **Relaunch the app after it crashes** — Crashlytics flushes the pending report on the *next* launch, not at crash time.
6. Open **Firebase Console → Release & Monitor → Crashlytics**. The first report can take a few minutes. Once confirmed, remove the test-crash button.

> Because `crashlytics_debug_enabled: true` is set, the test works in a debug build. If you turn that off, run a release build to test.

---

## Platform Behaviour

| | iOS | Android |
|---|---|---|
| **Fatal native crashes** | Captured automatically | Captured automatically; NDK crashes need `crashlytics_ndk_enabled` (default on) |
| **`crashlytics_ndk_enabled`** | No effect (NDK is Android-only) | Enables native C/C++ + Yoga crash capture |
| **JS crashes** | Recorded with a JS stack trace via the global handler (installed at startup, Step 6) | Same |
| **Symbolication** | dSYMs auto-uploaded on native/EAS builds | Mapping/NDK symbols handled by the Gradle plugin |
| **Debug builds** | No collection unless `crashlytics_debug_enabled: true` | Same |
| **Web preview / Expo Go** | Not supported — helper no-ops on web; native module needs a dev build | Same |

---

## Crashlytics API reference (modular)

All calls take the instance from `getCrashlytics()` as the first argument. The helper from Step 5 wraps them.

| Purpose | Modular call | Helper |
|---|---|---|
| Get the instance | `getCrashlytics()` | (internal) |
| Log a breadcrumb | `log(crashlytics, message)` | `logEvent(message)` |
| Record a non-fatal error | `recordError(crashlytics, error, jsErrorName?)` | `reportError(error, jsErrorName?)` |
| Force a crash (test only) | `crash(crashlytics)` | `testCrash()` |
| Set one custom attribute | `setAttribute(crashlytics, name, value)` | `setKey(name, value)` |
| Set many attributes | `setAttributes(crashlytics, { ... })` | `setKeys({ ... })` |
| Associate a user | `setUserId(crashlytics, userId)` | `identifyUser(userId)` |
| Toggle collection at runtime | `setCrashlyticsCollectionEnabled(crashlytics, enabled)` | `setCollectionEnabled(enabled)` |
| Unsent-report controls | `checkForUnsentReports(crashlytics)`, `sendUnsentReports(crashlytics)`, `deleteUnsentReports(crashlytics)` | not wrapped |
| Did the app crash last run? | `didCrashOnPreviousExecution(crashlytics)` | not wrapped |

> **Not part of the JS API.** `logException(...)` and `catchException(...)` are **Android-native** Crashlytics methods (they take a Java `Throwable`) and **do not exist** in React Native Firebase. Use `recordError(crashlytics, error)` for caught errors instead.

---

## Hard rules

- **Skip nothing.** Run Steps 1–8 in order; pass each Confirmation gate before the next. 
- **Step 6 is mandatory.** Always add the startup `require` in `app.js` — JS crash reporting depends on it.
- **Step 7 is a mandatory ask.** Always ask the developer where to report from before editing pages. Never assume pages or silently skip.
- **Never invent pages or handlers.** Confirm each named `pages/<Page>/<Page>.js` exists and read it before editing; if missing, list real pages and re-ask.
- **Append, never overwrite.** Preserve every existing statement in `app.js` and page handlers. When wrapping a handler in `try/catch`, keep its original body intact.
- **Require path is exact.** For every generated `require`, copy the string from **Require paths — use these exactly** for the file being edited (`./...` in `app.js`, `../../../...` in a page), with no extension. Never the `src/main/webapp/...` source path, never a hand-counted `../`. A wrong path breaks the build.
- **One version** across all `@react-native-firebase/*` packages — match `@react-native-firebase/app`.
- **Never edit `wm_rn_config.json` directly** — all installs go through `plugin-installation`.
- **Modular API only** — never emit the deprecated `crashlytics()` namespaced form.

---

## Troubleshooting

**`This method is deprecated ... move to match Firebase Web modular SDK API`** — the namespaced API (`crashlytics().log()`) was used. Switch to the modular calls (`log(crashlytics, ...)`). This skill's helper is already modular.

**`Cannot find module @react-native-firebase/crashlytics`** — plugin missing from `wm_rn_config.json`, or the native binary wasn't rebuilt since Step 3. Re-run `~{load_skill}(plugin-installation)`, then regenerate + native rebuild.

**`[crashlytics] version mismatch` / pod or Gradle resolution error** — `@react-native-firebase/crashlytics` and `@react-native-firebase/app` are on different versions. Make their `spec` values identical in `wm_rn_config.json` (Step 3) and rebuild.

**iOS CocoaPods build fails with `use_frameworks!` / static linking error** — the baseline didn't write `useFrameworks: "static"`, or it was overridden. Re-run the `firebase` router's Phase A baseline (`~{load_skill}(firebase)`) to re-merge it.

**No crashes appear in the dashboard** — in order: (1) you forced a crash but didn't **relaunch**, so the report never flushed; (2) it's a debug build and `crashlytics_debug_enabled` is `false`; (3) it was Expo Go, not a native build; (4) `crashlytics_auto_collection_enabled` is `false` and `setCollectionEnabled(true)` was never called. Reports can also take a few minutes server-side.

**JS crashes captured natively but with no JS stack trace** — the helper was never imported before the crash. Confirm the Step 6 `require` is at the top of `app.js`.

**Web preview build error referencing `@react-native-firebase/crashlytics`** — something `require`d the native package (or `crashlytics.native`) directly instead of the extensionless helper path. Always `require('.../firebase/crashlytics')` with no extension so the web build resolves `crashlytics.web.js` and never bundles the native package.

**Native (NDK) Android crashes not captured** — `crashlytics_ndk_enabled` is `false` in `firebase.json`. Set it `true` (the default) and rebuild.

**Stack traces are unsymbolicated** — dSYMs/mapping files weren't uploaded. EAS / native release builds upload them automatically; custom CI needs the symbol-upload step (out of scope).

---

## References

| Topic | Link |
|------|------|
| React Native Firebase — Crashlytics usage | https://rnfirebase.io/crashlytics/usage |
| React Native Firebase — Crashlytics reference | https://rnfirebase.io/reference/crashlytics |
| React Native Firebase — Migrating to v22 (modular API) | https://rnfirebase.io/migrating-to-v22 |
| Firebase — Crashlytics docs | https://firebase.google.com/docs/crashlytics |
| Firebase Console | https://console.firebase.google.com/ |
| Shared Firebase baseline (Phase A) | [`../firebase.md`](../firebase.md) |
| Plugin install rules (canonical specs, `wm_rn_config.json` writes) | [`../../plugin-installation/plugin-installation.md`](../../plugin-installation/plugin-installation.md) |
