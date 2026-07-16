---
name: builtin-js-features
description: >
  Recipes for WaveMaker React Native features implemented purely in page/app JavaScript using a
  built-in react-native API — no npm package, no wm_rn_config.json change, no native rebuild.
  Loaded by add-rn-feature when the request maps to a built-in react-native API rather than a
  plugin. Covers: Native Share (react-native Share.share) and User Idle Timeout
  (App.userIdleTimeout / App.onUserIdle / App.resetInactivityTimeout). Trigger on share, share
  sheet, native share, share content/text/link, Share.share, share button, user idle, idle timeout,
  inactivity timeout, auto-logout on inactivity, onUserIdle, userIdleTimeout, resetInactivityTimeout.
---

# Built-in JS Features (no plugin)

These features are implemented **entirely in page / app JavaScript** using a built-in `react-native` API (`require('react-native')`) — **no npm package, no `wm_rn_config.json` change, no native rebuild**. Do **not** call `plugin-installation` for anything in this file.

Common conventions for every recipe here:

1. **`require`, not ES `import`** — WaveMaker event scripts don't support `import`.
2. **Page handlers** live in the page script file under `src/main/webapp/pages/<page>/<page>.js`; markup (`on-tap`, `on-change`) lives in the page markup file next to it.
3. **Widget IDs in examples are placeholders** — replace them with the user's real widget IDs before pasting.
4. **Async handlers** — these APIs return Promises; mark handlers `async` and `await` the calls.

---

# Native Share — `Share.share()`

Open the OS share dialog from an event handler. `Share` comes from `react-native` (`require('react-native')`) — no plugin.

## API shape (use whichever fields the user needs)

- `Share.share(content, options?)` returns a Promise resolving to a result object.
- `content` fields: `message` (string — the text to share), `url` (string — primarily iOS; on Android fold the link into `message`), `title` (string — dialog/sheet title, mainly Android).
- `result.action` is either `Share.sharedAction` (shared) or `Share.dismissedAction` (cancelled). Android only reports `sharedAction` — don't rely on `dismissedAction` there.

## Generic handler template

Everything below is a placeholder — derive the handler name from the user's button, make the shared `content` dynamic from the user's data (page variables, widget values, selected record, etc.), and replace any result-feedback widget with whatever the page actually uses (a message widget, `App.notify`, a toast, or nothing):

```javascript
const ReactNative = require('react-native');

Page.<handlerName> = async function($event, widget) {
    try {
        const result = await ReactNative.Share.share({
            message: <dynamic message>,   // required — e.g. a page variable or widget value
            url: <dynamic url>,           // optional (iOS); include in message for Android
            title: <dynamic title>,       // optional
        });

        if (result.action === ReactNative.Share.sharedAction) {
            // shared — optional success feedback
        } else if (result.action === ReactNative.Share.dismissedAction) {
            // user dismissed the sheet — optional feedback
        }
    } catch (e) {
        // surface e.message however the page reports errors
    }
};
```

Wire the trigger in the page markup (button name + `on-tap` must match the handler):

```xml
<wm-button name="<buttonName>" caption="Share" on-tap="<handlerName>($event, widget)"></wm-button>
```

## References

| Topic | Link |
|------|------|
| React Native — `Share` API | https://reactnative.dev/docs/share |

---

# User Idle Timeout — `App.onUserIdle`

Run a callback when the user has been inactive (no touch interaction) for a configurable duration. Implemented entirely with built-in `App` runtime hooks in `src/main/webapp/app.js` — no plugin.

## How it works (runtime wiring)

The generated app already wires the inactivity timer:

- `App.userIdleTimeout` — the idle duration in **milliseconds**. Defaults to `60 * 60 * 1000` (1 hour). Override it in `app.js`.
- The app's touch handler calls `App.resetInactivityTimeout()` on **every** user interaction, so the timer restarts automatically as the user taps around. It is also started once after the app is ready.
- `App.resetInactivityTimeout()` clears the running timer and starts a fresh one of `App.userIdleTimeout` ms; when it elapses, it invokes `App.onUserIdle()`.
- `App.onUserIdle()` — a no-op stub by default. Override it in `app.js` with your idle behaviour.

## Setup (in `app.js`)

1. **Set the timeout duration.** Assign `App.userIdleTimeout` (ms). Set it early — e.g. in `App.onAppVariablesReady` or at the top of `app.js`:

   ```javascript
   App.userIdleTimeout = 5 * 1000; // 5 seconds
   ```

2. **Handle the idle event.** Override `App.onUserIdle`:

   ```javascript
   App.onUserIdle = function () {
       const reactnative = require('react-native');
       reactnative.Alert.alert(
           'User is Idle',
           'User is idle for ' + App.userIdleTimeout / 1000 + ' seconds',
           [
               { text: 'Ask me later' },
               { text: 'Cancel', style: 'cancel' },
               { text: 'OK' },
           ]
       );
   };
   ```

   Replace the alert with whatever the app needs — e.g. invoke the app's logout Variable/Action to auto-logout, navigate to a lock screen via `App.Actions.<nav>.invoke()` / `App.goToPage_<Page>()`, or clear secure storage.

3. **Reset on demand (optional).** Touch interactions already reset the timer. Call `App.resetInactivityTimeout()` to restart it manually — for example right after changing `App.userIdleTimeout` so the new duration takes effect immediately rather than on the next interaction:

   ```javascript
   App.userIdleTimeout = 30 * 1000;
   App.resetInactivityTimeout();
   ```

> Notes: the duration is in **milliseconds** (`seconds * 1000`). `require`, not `import`, for `react-native` inside the handler. `onUserIdle` fires every time the timer elapses without interaction — if your handler doesn't itself trigger a reset (e.g. an alert the user ignores), it will fire again after another full `userIdleTimeout` once interaction resumes.

## References

| Topic | Link |
|------|------|
| WaveMaker — Adding userIdleTimeout Event | https://docs.wavemaker.com/learn/react-native/user-idle-timeout/ |
| React Native — `Alert` API | https://reactnative.dev/docs/alert |
