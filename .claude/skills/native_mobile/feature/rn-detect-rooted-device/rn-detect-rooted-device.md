---
name: rn-detect-rooted-device
description: "Detects rooted (Android) or jailbroken (iOS) devices in a WaveMaker React Native (Expo) app using expo-device's isRootedExperimentalAsync. Default behaviour checks on app launch from App.onPageReady and exits the app on Android when a rooted device is detected; on-demand per-page checking is supported when the developer explicitly asks. Trigger on rooted, jailbreak, jailbroken, root detection, isRootedExperimentalAsync, expo-device, or device-integrity check."
---

# WaveMaker React Native — Detect Rooted / Jailbroken Device

Integrates **`expo-device`** into a WaveMaker React Native (Expo) app to detect rooted (Android) or jailbroken (iOS) devices via `Device.isRootedExperimentalAsync()`.

**Default behaviour: Path B — check on app launch and exit on Android if rooted.** This skill takes Path B by default without asking. Only switch to Path A if the developer explicitly asks for an on-demand check (e.g. "add a button that tells me if my device is rooted").

> **Reliability caveat:** `isRootedExperimentalAsync` is **experimental and not fully reliable** (per the Expo docs). Both Android and iOS have bypass tooling (e.g. xCon on iOS, Magisk Hide on Android). Treat it as a deterrent, not a security boundary. Communicate this to the developer.

---

## Scope

**What this skill does:**

- Delegates `expo-device` registration to the `plugin-installation` skill
- Default: wires an app-launch check in `src/main/webapp/app.js` that exits on Android if `isRootedExperimentalAsync` returns `true`
- Optional: wires an on-demand check handler in a page script when the developer explicitly asks
- Uses `require('expo-device')` and `require('react-native')` — WaveMaker event scripts do not support ES `import`

**What this skill does not do:**

- Hand-edit `wm_rn_config.json` or ask the developer for a plugin version — `plugin-installation` owns that
- Run `npm install`, `npx expo prebuild`, or any terminal commands — installs are the developer's responsibility after export
- Add hardened tamper detection, attestation (Play Integrity / App Attest), or anti-reverse-engineering measures — `isRootedExperimentalAsync` is best-effort

---

## Conventions (apply to every step)

1. **All npm package installs go through `plugin-installation`.** Never hand-edit `wm_rn_config.json` and never ask the developer for a version — `~{load_skill}(plugin-installation)` resolves the `spec` and writes the file.
2. **Page handlers live in the page script file** under `src/main/webapp/pages/<page>/<page>.js`. Markup (`on-tap="..."`) lives in the page markup file next to it.
3. **Widget IDs in code examples are placeholders** — replace them with the actual widget IDs from the user's page before pasting.
4. **`BackHandler.exitApp()` is Android-only.** Apple's App Store guidelines disallow programmatically terminating the app on iOS. The default Path B template guards the exit with `Platform.OS === 'android'`; for iOS, show a blocking modal instead.

---

## Files Modified

All edits are inside **`src/main/webapp/`** in WaveMaker Studio.

| Path B (default) — On app launch | Path A (only if explicitly requested) — On demand |
|---|---|
| `src/main/webapp/app.js` | `src/main/webapp/pages/<page>/<page>.js` |
| — | `src/main/webapp/pages/<page>/<page>.markup.xml` (button `on-tap` wiring) |

`wm_rn_config.json` is updated by the `plugin-installation` skill — not by this skill directly.

---

## Step 1 — Register `expo-device`

Delegate the install per [Conventions](#conventions-apply-to-every-step):

```
~{load_skill}(plugin-installation)
```

Ask it to install **`expo-device`**. After it reports success, follow the project's regenerate → `npm install` → native rebuild cycle.

> **Confirmation:** Reply when `expo-device` is present in `plugins[]`. Do not proceed to Step 2 until confirmed.

---

## Step 2 — Wire the Plugin

Default to Path B. Use Path A only if the developer explicitly asks for an on-demand check.

### Path B (default) — Check on App Launch (`app.js`)

**CRITICAL — editing rule:**

`app.js` already contains the developer's existing lifecycle handlers (`App.onAppVariablesReady`, `App.onPageReady`, `App.onSessionTimeout`, `App.onServiceError`, etc.) and any custom logic. Do **not** remove, replace, or overwrite any existing code.

Make only these two targeted changes to `src/main/webapp/app.js`:

1. Add the two `require` lines at the **top** of the file (after any existing `require` statements if present).
2. Insert the rooted-device check **inside** the existing `App.onPageReady` function body, before any existing logic. Make the function `async` if it isn't already. The `setTimeout` wrapper gives the page time to mount before exiting.

```javascript
const { Platform, BackHandler } = require('react-native');
const Device = require('expo-device');

App.onPageReady = async function (activePageName, activePageScope, $activePageEl) {
    setTimeout(async function () {
        const isRooted = await Device.isRootedExperimentalAsync();
        if (isRooted) {
            if (Platform.OS === 'android') {
                BackHandler.exitApp();
            } else {
                alert('This device appears to be jailbroken. The app cannot run on jailbroken devices.');
            }
        }
    }, 300);

    /* existing logic remains here — do not remove */
};
```

> **Notes:**
> - `BackHandler.exitApp()` is **Android-only**. iOS apps may not programmatically terminate themselves (App Store policy). On iOS, surface a blocking message — the WaveMaker doc example only handles Android.
> - The WaveMaker doc snippet uses `React.BackHandler.exitApp()` which is incorrect (`BackHandler` lives on `react-native`, not `react`). The template above uses the correct import.
> - `App.onPageReady` fires on every page navigation. The check is cheap but runs each time — if that's undesirable, gate it on an `App.Variables` flag set after the first run.

### Path A (opt-in) — On-Demand Check (page handler)

Use this only when the developer explicitly asks for a per-page check.

Add a page handler to `src/main/webapp/pages/<page>/<page>.js`. The widget ID `checkDeviceRooted` is a placeholder — replace with the actual widget ID from the user's page.

```javascript
const Device = require('expo-device');

Page.onReady = function () {
};

Page.checkDeviceRootedTap = async function ($event, widget) {
    const isRooted = await Device.isRootedExperimentalAsync();
    if (isRooted) {
        alert('Your device is rooted');
    } else {
        alert('Your device is Not rooted');
    }
};
```

In the page markup, wire the button's `on-tap`:

```xml
<wm-button name="checkDeviceRooted" caption="Check Device" on-tap="checkDeviceRootedTap($event, widget)"></wm-button>
```

> **Notes:**
> - Handler must be `async` — `isRootedExperimentalAsync` returns a Promise.
> - `alert(...)` is the WaveMaker built-in toast helper. Replace with a styled message widget (`Page.Widgets.<id>.caption = ...`) if a dialog isn't desired.

---

## After All Steps — Developer Checklist

The agent does not run installs or builds. After all file edits are complete, tell the developer:

1. Re-export the app from WaveMaker Studio.
2. Run `npm install` in the generated Expo app root.
3. Run `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android` — `expo-device` is a native module and requires a development build. It does not work in Expo Go.
4. Test on at least one rooted Android device / jailbroken iOS device if possible — emulators and simulators do not exercise the real detection paths.

---

## Manual Test Checklist

| Scenario | Android expected | iOS expected |
|---|---|---|
| App launch on **non-rooted / non-jailbroken** device | App runs normally | App runs normally |
| App launch on **rooted** Android device | App exits via `BackHandler.exitApp()` ~300 ms after first page | n/a |
| App launch on **jailbroken** iOS device | n/a | Blocking alert shown (cannot programmatically exit on iOS) |
| Path A — tap "Check Device" on rooted/jailbroken | Alert: "Your device is rooted" | Alert: "Your device is rooted" |
| Path A — tap "Check Device" on clean device | Alert: "Your device is Not rooted" | Alert: "Your device is Not rooted" |

False positives are possible on Android — some non-rooted devices ship with `su` binaries on standard paths. Document this in any user-facing copy.

---

## Troubleshooting

**Cannot find module `expo-device`**
Plugin missing from `wm_rn_config.json`, or the native binary hasn't been rebuilt since Step 1. Re-run `~{load_skill}(plugin-installation)` to verify, then regenerate + native rebuild.

**`BackHandler` is undefined / `React.BackHandler` undefined**
The WaveMaker doc snippet imports `react-native` as `ReactNative` then writes `React.BackHandler.exitApp()` — that's a typo in the doc. Use `const { BackHandler } = require('react-native')` (as in the Path B template).

**App exits immediately on a non-rooted Android device (false positive)**
Some Android builds expose `su` on standard paths even without root. `isRootedExperimentalAsync` is heuristic. Consider relaxing the action (e.g. show a warning instead of exiting), or supplement with Play Integrity API for production-grade detection.

**iOS app can't exit on jailbreak detection**
Expected. Apple's App Store guideline 2.5.1 forbids `exit(0)` / programmatic termination. Show a blocking modal that prevents further interaction instead — the Path B template does this.

**No effect in Expo Go**
Expected. `expo-device` runs in Expo Go but the rooted/jailbroken check requires the native module to be linked into a development build.

---

## References

| Topic | Link |
|------|------|
| WaveMaker — Detect Rooted Device | https://docs.wavemaker.com/learn/react-native/detect-rooted-device/ |
| WaveMaker — Third-party Expo plugins (install flow) | https://docs.wavemaker.com/learn/react-native/third-party-expo-plugins/ |
| Expo — `expo-device` API (`isRootedExperimentalAsync`) | https://docs.expo.dev/versions/latest/sdk/device/ |
| React Native — `BackHandler` (Android only) | https://reactnative.dev/docs/backhandler |
| Plugin install rules (canonical specs, `wm_rn_config.json` writes) | `../plugin-installation/plugin-installation.md` |
