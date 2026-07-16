---
name: push-notification
description: "Firebase Cloud Messaging (FCM) push notifications for WaveMaker React Native Expo apps using @react-native-firebase/messaging. Builds on the shared Firebase baseline owned by the firebase router (project setup, config files, app.json basics), then owns the FCM-specific bits: enabling Cloud Messaging + APNs key upload in Firebase Console, the messaging plugin, FCM token retrieval, foreground/background/quit-state message handlers. Trigger on push notification, FCM, Firebase Cloud Messaging, remote notification, getToken, onMessage, setBackgroundMessageHandler, APNs, @react-native-firebase/messaging, notification permissions."
---

# WaveMaker React Native — Firebase Push Notifications

## Overview

Adds **Firebase Cloud Messaging (FCM) push notifications** via **`@react-native-firebase/messaging`** on top of the shared Firebase baseline. Work through the steps in order; confirm each before continuing.

Push notifications work only on native builds — Firebase modules are native, so a web fallback is required for Studio Web Preview.

## Scope

**This skill owns:**

- Firebase Console FCM enablement check + APNs Authentication Key upload (iOS)
- Registering `@react-native-firebase/messaging` and the matching `app.json` plugin entry
- FCM token retrieval (`messaging().getToken()`) and permission requests on Android 13+ (`POST_NOTIFICATIONS`) and iOS
- Foreground (`onMessage`), background (`setBackgroundMessageHandler`), quit-state (`getInitialNotification`), and tap-from-background (`onNotificationOpenedApp`) handlers
- iOS APNs entitlement wiring (`aps-environment`) and `UIBackgroundModes: ["remote-notification"]`
- Registering required npm packages via the `plugin-installation` sub-skill

**This skill does not cover:**

- Server-side FCM send / Admin SDK / topic publishing
- Notification UI customisation beyond the OS-rendered native alert
- Rich-media notifications (images, action buttons), notification channels with custom sounds, or notifee
- APNs `.p8` / `.p12` certificate generation in the Apple Developer portal
- Firebase Analytics, Crashlytics, Remote Config, or other Firebase modules
- Missing `Page.Actions` / `Page.Variables`, broken navigation, or esbuild errors — treat these as **project / export / toolchain** issues.

---

## Conventions

1. **Native modules use `require`, not `import`.** WaveMaker event scripts do not support ES `import`. Always `require('@react-native-firebase/messaging')` and `require('react-native')`.
2. **Web platform guard via filename extension.** Firebase native modules are unavailable in browser preview. The `notification.web.js` / `notification.native.js` split (under `resources/files/firebase/`) is mandatory — `require` the module **without** an extension so Metro picks `.native.js` on device and esbuild picks `.web.js` in browser. Never branch on `Platform.OS === 'web'` from a single file that `require`s the native module at the top.

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

## Step 2 — Enable Cloud Messaging + upload APNs key (iOS in scope only)

Skip Step 2 entirely if Q1 was Android-only.

1. In the Firebase Console, click **Project settings** (gear icon next to Project Overview) and select the **Cloud Messaging** tab.
2. Under "Cloud Messaging API", confirm that **Firebase Cloud Messaging API (V1)** is enabled. The older Legacy API is deprecated — ignore it.
3. Scroll down to the **Apple app configuration** section.
4. Locate the **APNs Authentication Key** section and click **Upload** (a `.p8` key is preferred over the legacy APNs certificates).
5. To generate the key: log into the [Apple Developer portal](https://developer.apple.com/), navigate to **Keys → +**, enable **Apple Push Notifications service (APNs)**, and download the `.p8` file.
6. Upload the `.p8` to Firebase, enter the generated `Key ID` and your Apple `Team ID`, and click **Upload**.

> **Skip if already uploaded.** If push notifications were configured before in this Firebase project, the APNs key is already there — confirm with the developer and move on.

Optionally re-validate `GoogleService-Info.plist`'s `IS_GCM_ENABLED` key:

- Should be `<true/>`. If `<false/>` or missing, FCM is disabled for this iOS app in the Firebase Console — the developer must toggle it on and re-download the plist.

---

## Step 3 — Add `@react-native-firebase/messaging`

Delegate to plugin-installation:

```
~{load_skill}(plugin-installation)
```

Ask it to install **`@react-native-firebase/messaging`**. The shared baseline already installed `@react-native-firebase/app` and `expo-build-properties` — `plugin-installation` is idempotent, so re-running for those is a no-op.

After install, append `"@react-native-firebase/messaging"` to `expo.plugins[]` in `src/main/webapp/app.json` (only this one new entry — the baseline already added the rest):

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/messaging"
    ]
  }
}
```

Merge — do not replace the array.

> **Confirmation:** Reply when `@react-native-firebase/messaging` appears in both `wm_rn_config.json` `plugins[]` and `app.json` `expo.plugins[]`. Do not proceed to Step 4 until confirmed.

---

## Step 4 — Notification Module (web + native split)

Firebase modules are native — calling them in Studio's Web Preview throws. Use the React Native platform extension convention: same module name, two files, Metro picks `.native.js` on device and `.web.js` in browser. All Firebase helper files live under **`src/main/webapp/resources/files/firebase/`** so they stay grouped as more Firebase features are added.

### Step 4a — `notification.web.js`

Write **verbatim** to `src/main/webapp/resources/files/firebase/notification.web.js`:

```javascript
async function getNotifications() {
    return "No Token";
}

module.exports = {
    getNotifications,
}
```

### Step 4b — `notification.native.js`

Write **verbatim** to `src/main/webapp/resources/files/firebase/notification.native.js`. Customise the four message handlers (`setBackgroundMessageHandler`, `getInitialNotification`, `onNotificationOpenedApp`, `onMessage`) once the integration is verified — leave them as empty stubs initially so notifications arrive without any extra app behaviour.

```javascript
async function getNotifications() {
    const ReactNative = require('react-native');
    const messaging = require('@react-native-firebase/messaging').default;

    if (ReactNative.Platform.OS === 'android') {
        await ReactNative.PermissionsAndroid.request(
            ReactNative.PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        const authStatus = await messaging().requestPermission();
    } else if (ReactNative.Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission({
            alert: true,
            announcement: false,
            badge: true,
            carPlay: false,
            provisional: false,
            sound: true,
        });

        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            return 'No Token';
        }

        try {
            await messaging().registerDeviceForRemoteMessages();
            console.log('Device registered for remote messages');
        } catch (error) {
            console.error('Failed to register device for remote messages:', error);
            return 'No Token';
        }
    }

    const fcmtoken = await messaging().getToken();
    const tokenInput = fcmtoken ? fcmtoken : 'No Token';

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        // Triggers when app is in background
    });
    messaging().getInitialNotification(async remoteMessage => {

    });
    messaging().onNotificationOpenedApp(async remoteMessage => {
        // Triggers when notification is pressed and App is opened
    });

    messaging().onMessage(async remoteMessage => {
        // Triggers when foreground notification is received
    });
    return tokenInput;
}

module.exports = {
    getNotifications
}
```

> **Confirmation:** Reply when both files are in `src/main/webapp/resources/files/firebase/`. Do not proceed to Step 5 until confirmed.

---

## Step 5 — Wire Into a Page

**First, ask the developer which page should display the FCM token** (e.g. `Main`, a `Settings`, or a dedicated diagnostics page). The token is shown on a label there so it can be read and copied for testing. Use that page's name as `<PageName>` below.

### Step 5a — Add the token label widget

In the chosen page's markup `src/main/webapp/pages/<PageName>/<PageName>.html`, add a label widget and give it any `name` you like — shown below as the placeholder `<labelName>` (e.g. `fcmTokenLabel`). The snippet writes the token into `Page.Widgets.<labelName>.caption`, so use the **same** name in the markup and the snippet:

```html
<wm-label name="<labelName>" caption="Waiting for FCM token..."></wm-label>
```

### Step 5b — Wire the token retrieval into `Page.onReady`

Edit `src/main/webapp/pages/<PageName>/<PageName>.js` — append to the existing `Page.onReady`. Do not replace existing logic.

```javascript
Page.onReady = function () {
    // existing logic stays here
    try {
      const {
        getNotifications,
      } = require('../../../assets/resources/files/firebase/notification');
      getNotifications()
        .then(token => {
          Page.Token = token;
          Page.Widgets.fcmTokenLabel.caption = token;
        })
        .catch(error => {
          Page.Widgets.fcmTokenLabel.caption =
            (error && error.message) ? error.message : String(error);
        });
    } catch (error) {
        Page.Widgets.fcmTokenLabel.caption =
          (error && error.message) ? error.message : String(error);
    }
};
```

The `.catch` handles async rejections (permission denied, `getToken()` failure), and the outer `try/catch` handles a synchronous failure such as the `require` not resolving — both surface the error text on the label so a failed integration is visible on-device instead of silent.

**Notes:**

- The label `name` must be `fcmTokenLabel` to match `Page.Widgets.fcmTokenLabel`. If you name it differently, update the snippet to match.
- `Page.Token` captures the raw token for programmatic use; the label is purely for reading/copying it during testing. Remove the label once the integration is verified if you don't want the token visible in the shipped app.
- Calling `getNotifications` from a page's `onReady` runs it once per mount of that page. For app-wide single registration, move the call to `App.onAppVariablesReady` in `app.js` instead — but note `Page.Widgets` is not available there, so drop the label assignments and capture the token into an app variable.

---

## Step 6 — Verify

After all file edits are complete, tell the developer:

1. Re-export the app from WaveMaker Studio.
2. Run `npm install` in the generated Expo app root.
3. Run `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android` — Firebase is a native module and requires a full native build. It does not work in Expo Go.
4. Launch on a real device (or iOS 16+ simulator for iOS), grant the notification permission prompt, and confirm the FCM token appears on the page.
5. Send a test notification from **Firebase Console → Messaging → Send test message**, paste the FCM token, and confirm the device receives it.

---

## Platform Behaviour

| | iOS | Android |
|---|---|---|
| **Permission API** | `messaging().requestPermission({ alert, sound, badge, ... })` | `PermissionsAndroid.request(POST_NOTIFICATIONS)` (API 33+) + `messaging().requestPermission()` |
| **APNs registration** | `registerDeviceForRemoteMessages()` required before `getToken()` | Automatic via `google-services.json` |
| **Background data pushes** | Requires `UIBackgroundModes: ["remote-notification"]` in `app.json` (set by baseline) | Works out of the box for FCM data messages |
| **APNs entitlement** | `aps-environment: development` (dev / sandbox) or `production` (App Store) — set by baseline | N/A |
| **Web preview** | Not supported — `notification.web.js` returns `'No Token'` | Not supported — same |
| **Expo Go** | Not supported — Firebase native module requires a development build | Not supported — same |

---

## Troubleshooting

**`Cannot find module @react-native-firebase/messaging`** — plugin missing from `wm_rn_config.json`, or the native binary hasn't been rebuilt since Step 3. Re-run `~{load_skill}(plugin-installation)`, then regenerate + native rebuild.

**iOS CocoaPods build fails with `use_frameworks!` / static linking error** — the baseline didn't write the `useFrameworks: "static"` block, or it was overridden after the fact. Re-run the `firebase` router's Phase A baseline (`~{load_skill}(firebase)`) to re-merge it.

**`getToken()` returns `null` or throws on iOS** — `registerDeviceForRemoteMessages()` was not called, the app was not built with an APNs entitlement, or the `aps-environment` value doesn't match the build (development entitlement on a production build, or vice versa).

**No notification arrives on a production IPA installed via AltStore / BrowserStack** — the APNs entitlement is stripped during the IPA re-signing process. Use **TestFlight** for production-build push testing — it preserves entitlements.

**Permission prompt never appears on Android 13+** — `POST_NOTIFICATIONS` must be requested at runtime; pre-API 33 it's implicit. Confirm the `PermissionsAndroid.request` call ran.

**Foreground notification doesn't show a system alert (Android)** — FCM messages with only `data` and no `notification` payload do not render a tray alert when the app is in foreground. Either include a `notification` payload in the FCM send or render the UI yourself inside `onMessage`.

**`messaging.setBackgroundMessageHandler is not a function`** — `messaging` is being called as a static rather than the messaging instance. Use `messaging().setBackgroundMessageHandler(...)`.

**Bundle ID / package name mismatch** — Firebase silently issues no token if the Firebase-registered package / bundle ID doesn't match `<appId>` from `wm_rn_config.json` (which codegen writes into `app.json`). Re-run the `firebase` router's Phase A baseline (`~{load_skill}(firebase)`) — its validation will surface the mismatch.

---

## References

| Topic | Link |
|------|------|
| WaveMaker — Integrating Push Notifications | https://docs.wavemaker.com/learn/react-native/integrating-push-notifications/ |
| React Native Firebase — Messaging | https://rnfirebase.io/messaging/usage |
| React Native Firebase — iOS setup | https://rnfirebase.io/messaging/usage/ios-setup |
| Expo — `expo-build-properties` | https://docs.expo.dev/versions/latest/sdk/build-properties/ |
| Firebase Console | https://console.firebase.google.com/ |
| Plugin install rules (canonical specs, `wm_rn_config.json` writes) | `../../plugin-installation/plugin-installation.md` |
