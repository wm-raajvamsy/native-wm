---
name: add-rn-feature
description: >
  Entry point for adding any native feature, device capability, or third-party SDK to a
  WaveMaker React Native (Expo) app. Load this skill whenever the user asks to add, enable,
  integrate, implement, install, set up, wire up, or configure a feature in their mobile /
  React Native / Studio app — even when no specific sub-skill is named. This skill matches
  the request to a local feature sub-skill (biometric auth, Sentry, etc.) and dispatches
  to it; if no sub-skill matches, it asks the user instead of guessing. Trigger phrases
  include but are not limited to: "add {feature} to my mobile app", "implement {feature}
  in React Native", "integrate {SDK} in WaveMaker", "enable {capability}", "set up
  {feature} for the RN app", "wire up {plugin}", "configure {feature} in wm_rn_config".
  Concrete examples: "add biometric auth", "enable Face ID / Touch ID / fingerprint",
  "integrate Sentry", "add error / crash reporting", "install @sentry/react-native",
  "set up expo-local-authentication", "add push notifications", "integrate Firebase
  Cloud Messaging", "FCM", "set up @react-native-firebase/messaging", "store
  credentials securely", "add a Remember Me checkbox", "save the auth token securely",
  "use the secure store / SecureStorageService", "integrate expo-secure-store", "add
  a share button", "share content / a link / text", "open the native share sheet",
  "add a user idle timeout", "auto-logout on inactivity", "handle user inactivity /
  onUserIdle".
sub-skills:
  - wavemaker-rn-biometric-auth
  - wavemaker-rn-secure-store
  - wavemaker-rn-sentry
  - firebase
  - rn-disable-screen-capture
  - rn-detect-rooted-device
  - builtin-js-features
  - plugin-installation
---

# Add React Native Feature — Router

This skill is a **router**. It identifies the feature the user is requesting and loads the
matching local sub-skill, which owns the full implementation recipe (plugin registration,
config edits, JS wiring, manual steps).

The router does **not** perform documentation lookups, plugin installs, or JS edits itself.
Those are owned by the sub-skill it dispatches to.

---

## Available Feature Sub-Skills

| Sub-skill | Covers | Trigger keywords |
|-----------|--------|------------------|
| [`wavemaker-rn-biometric-auth`](./wavemaker-rn-biometric-auth/wavemaker-rn-biometric-auth.md) | Device biometrics via `expo-local-authentication` (Face ID, Touch ID, Android fingerprint), enrollment + server-validated return login | biometric, Face ID, Touch ID, fingerprint, local authentication, `authenticateAsync` |
| [`wavemaker-rn-secure-store`](./wavemaker-rn-secure-store/wavemaker-rn-secure-store.md) | Securely store/retrieve/delete sensitive data (credentials, tokens, keys) via the built-in `SecureStorageService` dependency — iOS Keychain / Android Keystore (`expo-secure-store`). "Remember Me" login, auth-token persistence | secure store, `SecureStorageService`, keychain, keystore, store credentials securely, remember me, save token securely, `setItem`, `getItem`, `removeItem`, `expo-secure-store` |
| [`wavemaker-rn-sentry`](./wavemaker-rn-sentry/wavemaker-rn-sentry.md) | Sentry error/crash reporting via `@sentry/react-native` (`wm_rn_config.json`, `app.json` Expo plugin, `Sentry.init` in `App.onAppVariablesReady`) | Sentry, DSN, `captureException`, crash reporting, error tracking, `@sentry/react-native` |
| [`firebase`](./firebase/firebase.md) | All Firebase integrations on a shared project baseline. Sub-router: runs the shared `firebase` baseline (Firebase project + `google-services.json` / `GoogleService-Info.plist` + `@react-native-firebase/app` + `app.json`), then dispatches to the Firebase feature — Cloud Messaging push notifications (`@react-native-firebase/messaging`) or Crashlytics crash reporting (`@react-native-firebase/crashlytics`) | Firebase, FCM, push notification, Firebase Cloud Messaging, remote notification, `getToken`, `onMessage`, `setBackgroundMessageHandler`, APNs, Crashlytics, crash reporting, crash logs, `recordError`, `firebase.json`, `google-services.json`, `GoogleService-Info.plist`, `@react-native-firebase` |
| [`rn-disable-screen-capture`](./rn-disable-screen-capture/rn-disable-screen-capture.md) | Disable/enable screen capture and screen recording via `expo-screen-capture` (default: app-wide block from `App.onPageReady`; optional per-page on-demand toggle with `allowScreenCaptureAsync` / `preventScreenCaptureAsync`) | screen capture, screenshot, screen recording, prevent screenshots, disable screenshots, `preventScreenCaptureAsync`, `allowScreenCaptureAsync`, `expo-screen-capture` |
| [`rn-detect-rooted-device`](./rn-detect-rooted-device/rn-detect-rooted-device.md) | Detect rooted (Android) / jailbroken (iOS) devices via `expo-device`'s `isRootedExperimentalAsync` (default: app-launch check from `App.onPageReady` with Android `BackHandler.exitApp()` + iOS blocking alert; optional per-page on-demand check) | rooted, jailbreak, jailbroken, root detection, `isRootedExperimentalAsync`, `expo-device`, device integrity |

## Built-in JS Features (no plugin)

Some features need **no plugin** — they're implemented purely in page/app JavaScript using a built-in `react-native` API, a built-in `App` runtime hook (no npm package, no `wm_rn_config.json` change, no native rebuild). These live in one sub-skill, [`builtin-js-features`](./builtin-js-features/builtin-js-features.md). When the request matches, load it via `~{load_skill}(builtin-js-features)` and follow the matching recipe — do **not** call `plugin-installation`.

| Feature | Implemented with | Trigger keywords |
|---------|------------------|------------------|
| Native Share | `react-native` → `Share.share()` | share, share sheet, native share, share content/text/link, `Share.share`, share button |
| User Idle Timeout | `App.userIdleTimeout` / `App.onUserIdle` / `App.resetInactivityTimeout()` | user idle, idle timeout, inactivity timeout, auto-logout on inactivity, `onUserIdle`, `userIdleTimeout`, `resetInactivityTimeout` |

Shared sub-skills (loaded as needed):

- [`builtin-js-features`](./builtin-js-features/builtin-js-features.md) — JS-only recipes for Native Share, User Idle Timeout.
- [`plugin-installation`](./plugin-installation/plugin-installation.md) — canonical rules for resolving plugin specs and mutating `wm_rn_config.json`.

---

## Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       USER REQUEST                               │
│    "Add {featureName} to my React Native app"                    │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: MATCH feature → sub-skill OR built-in JS feature        │
│  Compare the request against BOTH tables above.                  │
│  - Sub-skill match → load it via ~{load_skill}, follow it        │
│    end-to-end.                                                  │
│  - Built-in JS feature match → ~{load_skill}(builtin-js-          │
│    features) and follow that recipe (no plugin install).        │
│  - No match → tell the user nothing covers this feature,         │
│    list what IS available, and stop. Do NOT guess.              │
└──────────────────────────────────────────────────────────────────┘
```

---

## Execution Plan

1. **Identify the feature** from the user's request.
2. **Match against both tables.** Use the trigger keywords / "Covers" column of the
   sub-skill table, then the Built-in JS Features table.
3. **If a sub-skill matches:** load it (e.g. `~{load_skill}(wavemaker-rn-biometric-auth)`)
   and follow its instructions exactly. The sub-skill owns everything from this point
   on — intake questions, plugin install, JS wiring, manual steps, and the final summary.
4. **If a built-in JS feature matches:** `~{load_skill}(builtin-js-features)` and follow
   the matching recipe — adapt it to the user's page and report what changed. No plugin
   install.
5. **If unmatched:** respond with:
   - a one-line statement that nothing covers this feature,
   - the list of sub-skills and built-in JS features that *are* available (from the tables above),
   - a request for the user to confirm which one they want, or to provide their own
     implementation notes if the feature is genuinely new.

   Do not fall back to guessing or to a generic install flow.

---

## Hard Rules

1. **Router first.** For sub-skill features this skill does not call `wmwiki_ask_question`,
   edit `wm_rn_config.json`, or write JS — those belong to the matched sub-skill. For
   built-in JS features it loads [`builtin-js-features`](./builtin-js-features/builtin-js-features.md)
   and follows that recipe; no plugin install.
2. **No guessing.** If neither a sub-skill nor a built-in JS feature matches the request,
   stop and ask. Do not improvise a plugin install or JS recipe.
3. **One sub-skill per request.** If the user asks for multiple features at once
   (e.g. "add biometric auth and Sentry"), route to them **sequentially** — finish
   one sub-skill end-to-end before loading the next.
4. **Sub-skill owns the summary.** The final implementation report (files modified,
   plugins added, outstanding manual steps) is produced by the sub-skill, not by this
   router.
