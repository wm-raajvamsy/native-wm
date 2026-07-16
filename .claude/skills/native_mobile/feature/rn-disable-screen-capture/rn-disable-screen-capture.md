---
name: rn-disable-screen-capture
description: "Disables/enables screen capture and screen recording in a WaveMaker React Native (Expo) app using the expo-screen-capture plugin. Default behaviour blocks capture app-wide on launch from App.onPageReady; on-demand per-page toggling (preventScreenCaptureAsync / allowScreenCaptureAsync) is supported when the developer explicitly asks. Trigger on screen capture, screenshot, screen recording, prevent screenshots, disable screenshots, allowScreenCaptureAsync, preventScreenCaptureAsync, or expo-screen-capture."
---

# WaveMaker React Native — Disable Screen Capture and Recording

Integrates **`expo-screen-capture`** into a WaveMaker React Native (Expo) app to prevent screenshots and screen recordings.

**Default behaviour: Path B — block capture app-wide on launch.** This skill takes Path B by default without asking. Only switch to Path A if the developer explicitly asks for on-demand toggling (e.g. "let the user turn screenshots on for free content").

> **Security note:** Disabling screen capture is one layer of defence. It does **not** replace encryption, secure data handling, or transport security. Communicate this to the developer.

---

## Scope

**What this skill does:**

- Delegates `expo-screen-capture` registration to the `plugin-installation` skill
- Default: wires an app-launch block in `src/main/webapp/app.js`
- Optional: wires on-demand toggle handlers in a page script when the developer explicitly asks
- Uses `require('expo-screen-capture')` — WaveMaker event scripts do not support ES `import`

**What this skill does not do:**

- Hand-edit `wm_rn_config.json` or ask the developer for a plugin version — `plugin-installation` owns that
- Run `npm install`, `npx expo prebuild`, or any terminal commands — installs are the developer's responsibility after export
- Add encryption, DRM, watermarking, or any other content-protection layer
- Detect *that* a screenshot was attempted (use `addScreenshotListener` separately if required)

---

## Conventions (apply to every step)

1. **All npm package installs go through `plugin-installation`.** Never hand-edit `wm_rn_config.json` and never ask the developer for a version — `~{load_skill}(plugin-installation)` resolves the `spec` and writes the file.
2. **Page handlers live in the page script file** under `src/main/webapp/pages/<page>/<page>.js`. Markup (`on-tap="..."`) lives in the page markup file next to it.
3. **Widget IDs in code examples are placeholders** — replace them with the actual widget IDs from the user's page before pasting.

---

## Files Modified

All edits are inside **`src/main/webapp/`** in WaveMaker Studio.

| Path B (default) — On app launch | Path A (only if explicitly requested) — On demand |
|---|---|
| `src/main/webapp/app.js` | `src/main/webapp/pages/<page>/<page>.js` |
| — | `src/main/webapp/pages/<page>/<page>.markup.xml` (button `on-tap` wiring) |

`wm_rn_config.json` is updated by the `plugin-installation` skill — not by this skill directly.

---

## Step 1 — Register `expo-screen-capture`

Delegate the install per [Conventions](#conventions-apply-to-every-step):

```
~{load_skill}(plugin-installation)
```

Ask it to install **`expo-screen-capture`**. After it reports success, follow the project's regenerate → `npm install` → native rebuild cycle.

> **Confirmation:** Reply when `expo-screen-capture` is present in `plugins[]`. Do not proceed to Step 2 until confirmed.

---

## Step 2 — Wire the Plugin

Default to Path B. Use Path A only if the developer explicitly asks for on-demand toggling.

### Path B (default) — Block on App Launch (`app.js`)

**CRITICAL — editing rule:**

`app.js` already contains the developer's existing lifecycle handlers (`App.onAppVariablesReady`, `App.onPageReady`, `App.onSessionTimeout`, `App.onServiceError`, etc.) and any custom logic. Do **not** remove, replace, or overwrite any existing code.

Make only these two targeted changes to `src/main/webapp/app.js`:

1. Add `const ScreenCapture = require('expo-screen-capture');` at the **top** of the file (after any existing `require` statements if present).
2. Insert `await ScreenCapture.preventScreenCaptureAsync();` **inside** the existing `App.onPageReady` function body, before any existing logic. Make the function `async` if it isn't already.

```javascript
const ScreenCapture = require('expo-screen-capture');

App.onPageReady = async function (activePageName, activePageScope, $activePageEl) {
    await ScreenCapture.preventScreenCaptureAsync();

    /* existing logic remains here — do not remove */
};
```

> **Notes:**
> - `App.onPageReady` fires on every page navigation. `preventScreenCaptureAsync` is idempotent, so re-calling it is safe.
> - If the app needs to allow capture on specific pages, switch to Path A handlers on those pages.

### Path A (opt-in) — On-Demand Toggle (page handlers)

Use this only when the developer explicitly asks for per-page enable/disable.

Add two page handlers to `src/main/webapp/pages/<page>/<page>.js`. Widget IDs (`enable`, `disable`) are placeholders — replace them with the real widget IDs from the user's page before pasting.

```javascript
const ScreenCapture = require('expo-screen-capture');

Page.onReady = function () {
};

Page.enableCapture = async function ($event, widget) {
    await ScreenCapture.allowScreenCaptureAsync();
    Page.Widgets.enable.disabled = true;
    Page.Widgets.disable.disabled = false;
    alert('Screenshot option is enabled');
};

Page.disableCapture = async function ($event, widget) {
    await ScreenCapture.preventScreenCaptureAsync();
    Page.Widgets.enable.disabled = false;
    Page.Widgets.disable.disabled = true;
    alert('Screenshot option is disabled');
};
```

In the page markup, wire each button's `on-tap`:

```xml
<wm-button name="enable"  caption="Enable Screenshot"  on-tap="enableCapture($event, widget)"></wm-button>
<wm-button name="disable" caption="Disable Screenshot" on-tap="disableCapture($event, widget)"></wm-button>
```

> **Notes:**
> - Handlers must be `async` — both `expo-screen-capture` APIs return Promises.
> - `alert(...)` is the WaveMaker built-in toast helper. Replace with `Page.Widgets.<id>.*` UI updates if a dialog isn't desired.

---

## After All Steps — Developer Checklist

The agent does not run installs or builds. After all file edits are complete, tell the developer:

1. Re-export the app from WaveMaker Studio.
2. Run `npm install` in the generated Expo app root.
3. Run `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android` — `expo-screen-capture` is a native module and requires a development build. It does not work in Expo Go.

---

## Manual Test Checklist

| Scenario | iOS expected | Android expected |
|---|---|---|
| Capture **disabled** — attempt screenshot | Screenshot still saved, but content is blanked / blurred in the captured image | Screenshot is blocked entirely; system toast shown |
| Capture **disabled** — start screen recording | Recording stream is blanked for protected content | Recording is blocked / blanked |
| Capture **enabled** (Path A only) — attempt screenshot | Normal screenshot saved | Normal screenshot saved |

Behaviour difference is OS-level — iOS cannot block the screenshot, only obscure the captured image; Android can fully block it. Document this in any user-facing copy if relevant.

---

## Troubleshooting

**Cannot find module `expo-screen-capture`**
Plugin missing from `wm_rn_config.json`, or the native binary hasn't been rebuilt since Step 1. Re-run `~{load_skill}(plugin-installation)` to verify, then regenerate + native rebuild.

**No effect in Expo Go**
Expected. `expo-screen-capture` is a native module. Use a development build (`npx expo run:ios` / `npx expo run:android`).

**Screenshots still work on iOS even when disabled**
iOS cannot block the screenshot action itself — only obscure the captured image. This is platform behaviour, not a bug.

**Handler throws "await is only valid in async functions"**
Mark the handler `async` (Path A) or `App.onPageReady` (Path B) as shown above.

---

## References

| Topic | Link |
|------|------|
| WaveMaker — Disable Screen Capture and Recording | https://docs.wavemaker.com/learn/react-native/disable-device-screencapture/ |
| WaveMaker — Third-party Expo plugins (install flow) | https://docs.wavemaker.com/learn/react-native/third-party-expo-plugins/ |
| Expo — `expo-screen-capture` API | https://docs.expo.dev/versions/latest/sdk/screen-capture/ |
| Plugin install rules (canonical specs, `wm_rn_config.json` writes) | `../plugin-installation/plugin-installation.md` |
