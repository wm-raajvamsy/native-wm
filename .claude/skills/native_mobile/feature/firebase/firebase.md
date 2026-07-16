---
name: firebase
description: >
  Firebase entry point for WaveMaker React Native (Expo) apps. Load this whenever the user asks
  to add, enable, integrate, or configure any Firebase capability in their mobile / React Native
  app — Cloud Messaging push notifications and any other Firebase product added under this router.
  This skill owns the shared Firebase project baseline
  (Firebase Console project + per-platform app registration, google-services.json /
  GoogleService-Info.plist intake + validation, the shared app.json wiring, and
  @react-native-firebase/app + expo-build-properties install). It runs that baseline first, then
  dispatches to the matching Firebase feature sub-skill (push-notification, crashlytics) for the
  product-specific steps. Trigger phrases: "add push notifications", "integrate Firebase Cloud
  Messaging", "FCM", "set up @react-native-firebase/messaging", "add Crashlytics", "Firebase crash
  reporting", "@react-native-firebase/crashlytics", "configure Firebase".
sub-skills:
  - push-notification
  - crashlytics
---

# Firebase — Router + Shared Baseline

This skill is the entry point for **every** Firebase capability in a WaveMaker React Native (Expo)
app. It is loaded by the [`add-rn-feature`](../add-rn-feature.md) router whenever the request is a
Firebase feature.

It runs in **two phases, in order**:

- **Phase A — Shared Firebase baseline.** Everything two or more Firebase features need in common:
  Firebase Console project + app registration, `google-services.json` / `GoogleService-Info.plist`
  intake + validation, writing those files, installing `@react-native-firebase/app` +
  `expo-build-properties`, and merging the shared `app.json` entries. This phase is **idempotent** —
  re-running it against an already-configured project is a no-op beyond the detection report.
- **Phase B — Dispatch to the Firebase feature sub-skill.** Match the request to the right feature
  sub-skill and load it. That sub-skill owns its product-specific steps (enabling the
  feature-specific Firebase Console provider, installing its feature package, its JS wiring, and
  verification) **on top of** the baseline this skill just produced.

Run Phase A first, then Phase B. Do not run Phase A more than once per request.

---

## Available Firebase Feature Sub-Skills

| Sub-skill | Covers | Trigger keywords |
|-----------|--------|------------------|
| [`push-notification`](./push-notification/push-notification.md) | Firebase Cloud Messaging push notifications via `@react-native-firebase/messaging` (enable Cloud Messaging + APNs key upload, the messaging plugin, FCM token retrieval, foreground/background/quit-state message handlers) | push notification, FCM, Firebase Cloud Messaging, remote notification, `getToken`, `onMessage`, `setBackgroundMessageHandler`, APNs, `@react-native-firebase/messaging` |
| [`crashlytics`](./crashlytics/crashlytics.md) | Firebase Crashlytics crash & error reporting via `@react-native-firebase/crashlytics` (v22+ modular API) — the crashlytics plugin, `firebase.json` config keys, a web/native helper module, and `log` / `recordError` / `setAttribute` / `setUserId` / `crash` usage | Crashlytics, crash reporting, crash logs, non-fatal errors, `recordError`, `setAttribute`, `setUserId`, `firebase.json`, `@react-native-firebase/crashlytics`, `getCrashlytics` |

---

## Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                       USER REQUEST                                 │
│        "Add <Firebase feature> to my React Native app"             │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  PHASE A: Run the shared Firebase baseline (Steps A1–A7 below).     │
│  Idempotent — skip every step already satisfied by Step A1.        │
└───────────────────────────┬────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  PHASE B: MATCH feature → sub-skill, then ~{load_skill} it.        │
│  - Feature match → load it, follow it end-to-end.                  │
│  - No match → list the Firebase features available, ask. No guess. │
└──────────────────────────────────────────────────────────────────┘
```

---

# Phase A — Shared Firebase baseline

This phase owns everything two or more Firebase-backed features need in common:

1. Firebase Console project + per-platform app registration walkthrough.
2. Paste-and-validate intake for `google-services.json` and `GoogleService-Info.plist`.
3. Writing those files into `src/main/webapp/resources/files/`.
4. Installing the core Firebase plumbing (`@react-native-firebase/app`, `expo-build-properties`) via [`plugin-installation`](../plugin-installation/plugin-installation.md).
5. Merging the **shared** `app.json` entries (`googleServicesFile` paths, `useFrameworks: "static"` for iOS, and — when iOS is in scope — `aps-environment` + `UIBackgroundModes: ["remote-notification"]`).

What this phase deliberately **does not** own (always handled by the feature sub-skill in Phase B):

- Enabling provider-specific Firebase Console toggles (FCM, Phone, Sign in with Google, etc.).
- Provider-specific feature packages (`@react-native-firebase/messaging`, etc.).
- Provider-specific `app.json` plugin entries beyond `@react-native-firebase/app`.
- Provider-specific JS modules, page wiring, and verification flows.
- Android SHA-1 / SHA-256 fingerprint upload (only needed by some features — e.g. Sign in with Google).
- APNs **key** upload to Firebase Console (only needed by FCM-sending features — the feature sub-skill owns this).

---

## Step A1 — Detect existing wiring (no question)

Read these files and capture the state:

| Check | How |
|---|---|
| `<appId>` | `src/main/webapp/wm_rn_config.json` → `id`. If missing, empty, or a literal template placeholder (e.g. `{{appId}}`), STOP and tell the developer to set the app ID in Studio first. |
| `firebaseAppInstalled` | `wm_rn_config.json` → `plugins[]` contains `@react-native-firebase/app` |
| `buildPropsInstalled` | `wm_rn_config.json` → `plugins[]` contains `expo-build-properties` |
| `androidConfigPresent` | `src/main/webapp/resources/files/google-services.json` exists |
| `iosConfigPresent` | `src/main/webapp/resources/files/GoogleService-Info.plist` exists |
| `appJsonHasAndroidConfig` | `app.json` → `expo.android.googleServicesFile` is set |
| `appJsonHasIosConfig` | `app.json` → `expo.ios.googleServicesFile` is set |
| `appJsonHasApsEnvironment` | `app.json` → `expo.ios.entitlements["aps-environment"]` is set |
| `appJsonHasUseFrameworks` | `app.json` → `expo.plugins[]` includes `expo-build-properties` with `ios.useFrameworks: "static"` |
| `appJsonHasFirebaseAppPlugin` | `app.json` → `expo.plugins[]` includes `"@react-native-firebase/app"` |

Report one line back to the developer, e.g.:

```
Existing Firebase wiring: app=yes, build-props=yes, android-config=yes, ios-config=no, apsEnv=development, useFrameworks=static
```

Use this state to skip every step below that is already satisfied.

---

## Step A2 — Intake (one prompt)

Ask **both** questions in a **single message** — not two separate prompts. Drop the APNs line if `appJsonHasApsEnvironment` is already set; the developer only answers it when iOS is in scope.

> "Two things before I wire up Firebase:
> 1. **Platform(s)** — iOS, Android, or both? Your app ID from `wm_rn_config.json` is `<appId>` (becomes the Firebase Android `package` / iOS `bundleIdentifier` — must match what's registered in the Firebase Console).
> 2. **iOS APNs build target** (skip if Android-only) — `development` (dev build / APNs sandbox) or `production` (TestFlight / App Store / production APNs)? Default `development` during integration testing."

Item 1 is referred to as **Q1** (platform) and item 2 as **Q2** (APNs env) elsewhere in this skill and the feature sub-skills.

---

## Step A3 — Firebase Console walkthrough (show before Step A4)

Show only the parts relevant to Q1 platform choice, and only when the corresponding config file is missing (`!androidConfigPresent` for Part B, `!iosConfigPresent` for Part C). If both files are already on disk, skip this section entirely.

Use the Console labels verbatim — they reflect the current Firebase Console UI. If a label looks different in the developer's Console, ask for a screenshot before guessing.

### Part A — Create a Firebase project (only if no Firebase project exists)

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Create a project** (or **Add project** if you have existing ones).
2. Enter your desired project name and click **Continue**.
3. You will be prompted to configure Google Analytics; this is optional for most Firebase features and can be toggled off.
4. Click **Create project** (or **Add Firebase to your Google Cloud project** if using an existing GCP workspace).
5. Wait for provisioning to finish, then click **Continue** to land on your Project Overview page.

### Part B — Register the Android app + download `google-services.json` (Android in scope)

1. On the Project Overview page, click **Add app** and select the **Android icon**.
2. In the `Android package name` field, enter `<appId>` (the `id` from `wm_rn_config.json`).
3. The `App nickname` field is optional. The `Debug signing certificate SHA-1` is **optional here** — some features (e.g. Sign in with Google) need it later; if the feature sub-skill requires it, that skill will instruct you to add it after this step and re-download the file.
4. Click **Register app**.
5. Click **Download google-services.json** and save the file.
6. Click **Next** to bypass the "Add Firebase SDK" Gradle instructions — WaveMaker handles the SDK integration automatically.
7. Continue clicking **Next** until you can click **Continue to console**.

### Part C — Register the iOS app + download `GoogleService-Info.plist` (iOS in scope)

1. From the Project Overview page, click **Add app** and select the **iOS icon**.
2. In the `Apple bundle ID` field, enter `<appId>` (the `id` from `wm_rn_config.json`).
3. `App nickname` and `App Store ID` are optional.
4. Click **Register app**.
5. Click **Download GoogleService-Info.plist** (note the capital "I" in "Info") and save the file.
6. Click **Next** to bypass the Xcode / CocoaPods steps — WaveMaker handles the native iOS setup.
7. Continue clicking **Next** until you can click **Continue to console**.

---

## Step A4 — Paste any missing Firebase config files

Only ask for files **not detected** in Step A1. Ask one at a time. Validate before proceeding.

If `!androidConfigPresent` and Android is in scope:

> "Paste the full contents of `google-services.json` (downloaded from Firebase Console → Project settings → General → Your apps → Android) inside a fenced ```json``` block."

If `!iosConfigPresent` and iOS is in scope:

> "Paste the full contents of `GoogleService-Info.plist` (downloaded from Firebase Console → Project settings → General → Your apps → iOS) inside a fenced ```xml``` block."

### Validating `google-services.json`

1. **JSON parses.** Report parse errors verbatim.
2. **Required keys present:** `project_info`, `client` (array), `project_info.project_id` (non-empty).
3. **`client[0].client_info.android_client_info.package_name`** equals `<appId>`. If mismatched:
   ```
   google-services.json package_name = "<from-file>"
   wm_rn_config.json id              = "<appId>"
   These must match. Either update the app ID in Studio so it matches Firebase, or re-download google-services.json from Firebase Console for the correct package.
   ```
4. **`client[0].api_key[0].current_key`** is present (non-empty).

### Validating `GoogleService-Info.plist`

1. **XML parses** with root `<plist version="1.0">` containing one `<dict>`.
2. **Required keys** (case-sensitive): `API_KEY`, `BUNDLE_ID`, `PROJECT_ID`, `GCM_SENDER_ID`, `GOOGLE_APP_ID`.
3. **`BUNDLE_ID`** value equals `<appId>`. Same mismatch report as above.

### Cross-file check (both platforms in scope)

4. **`project_info.project_id`** (Android) equals **`PROJECT_ID`** (iOS plist). Both apps must belong to the same Firebase project — otherwise the developer accidentally pulled from two projects.

> **Validation summary:** Reply with one line, e.g. `Validated: appId=com.example.myapp, project_id=test-stc-skill`. Do not proceed to Step A5 until validation passes.

---

## Step A5 — Write config files to disk

For each file the developer pasted, write the **verbatim** content (no reformatting, no key reordering, no whitespace stripping) to:

- **Android** → `src/main/webapp/resources/files/google-services.json`
- **iOS** → `src/main/webapp/resources/files/GoogleService-Info.plist`

Skip files that already existed. If the feature sub-skill explicitly asked the developer to re-download `google-services.json` after registering SHA fingerprints, overwrite the existing file with the new content.

---

## Step A6 — Install shared npm packages

Delegate to [`plugin-installation`](../plugin-installation/plugin-installation.md):

```
~{load_skill}(plugin-installation)
```

Ask it to install:

| Package | Skip if `firebaseAppInstalled` / `buildPropsInstalled` |
|---|---|
| `@react-native-firebase/app` | yes |
| `expo-build-properties` | yes |

`plugin-installation` is idempotent — already-pinned entries are left alone. After install reports success, the developer will need to follow the project's regenerate → `npm install` → native rebuild cycle once the feature sub-skill has added its own packages too.

---

## Step A7 — Merge shared `app.json` entries

Open `src/main/webapp/app.json` (create with `{ "expo": {} }` if missing). Merge — never replace — the keys below. Skip keys that are already present and correctly valued; preserve existing values that go beyond the minimum.

**Do NOT write `expo.android.package` or `expo.ios.bundleIdentifier`.** Codegen sets both from `wm_rn_config.json` `id` on every export, so hand-writing them either duplicates or fights codegen.

### When Android is in scope

In `expo.android`, ensure:

```json
"googleServicesFile": "./assets/resources/files/google-services.json"
```

### When iOS is in scope

In `expo.ios`, ensure:

```json
"googleServicesFile": "./assets/resources/files/GoogleService-Info.plist",
"entitlements": {
  "aps-environment": "<Q2 answer: development | production>"
},
"infoPlist": {
  "UIBackgroundModes": ["remote-notification"]
}
```

Merge `UIBackgroundModes`: if the array already exists, append `"remote-notification"` (deduped). Do **not** downgrade an existing `"aps-environment": "production"` to `"development"` — keep the existing value and warn the developer.

### `expo.plugins[]` — append (deduped)

Append these entries if not already present:

- `"@react-native-firebase/app"`
- `["expo-build-properties", { "ios": { "useFrameworks": "static" } }]`

If `expo-build-properties` is already in the array with a different shape (e.g. it sets other build properties), merge `ios.useFrameworks: "static"` into the existing entry instead of duplicating it.

> **Why `useFrameworks: "static"`?** The Firebase iOS SDK requires static linking. Omitting it produces a CocoaPods build failure during `npx expo prebuild`.

Report a one-line baseline summary, e.g.:

```
Firebase baseline ready. Wrote: google-services.json (new), GoogleService-Info.plist (new).
Installed: @react-native-firebase/app, expo-build-properties.
app.json merged: googleServicesFile (android, ios), aps-environment=development, useFrameworks=static, plugin @react-native-firebase/app.
```

---

# Phase B — Dispatch to the Firebase feature

With the baseline complete, match the request against the **Available Firebase Feature Sub-Skills**
table above and dispatch:

1. **If a feature matches:** load it (e.g. `~{load_skill}(push-notification)`) and follow
   its instructions exactly. The feature sub-skill owns everything from here — enabling its Firebase
   Console provider, installing its feature package, JS wiring, manual steps, and the final summary.
   It builds on the baseline you just produced; it does **not** re-run Phase A.
2. **If no feature matches:** state that nothing covers this Firebase feature, list the Firebase
   features that *are* available (from the table), and ask the developer to confirm which one they
   want — or to provide implementation notes if it is genuinely new. Do not guess.

---

## Hard rules

- **Baseline before dispatch.** Always complete Phase A before loading a feature sub-skill, and run Phase A **once** per request.
- **Never edit `wm_rn_config.json` directly.** All package installs go through `plugin-installation`.
- **Never write `expo.android.package` / `expo.ios.bundleIdentifier`** into `app.json`.
- **Never reformat, reorder keys, or strip whitespace** from pasted config files. Bit-for-bit fidelity matters.
- **Never downgrade** an existing `aps-environment`, `useFrameworks`, or other already-configured value. Merge, don't overwrite.
- **No provider-specific Console toggles in Phase A.** Enabling FCM, Phone, Sign in with Google, etc. belongs to the feature sub-skill.
- **No guessing.** If `wm_rn_config.json` `id` is missing or a template placeholder, STOP — the developer must set the app ID in Studio first. If no feature sub-skill matches, stop and ask.
- **One feature per request.** If the user asks for multiple Firebase features at once, run the baseline once, then route to the feature sub-skills **sequentially**.

---

## References

| Topic | Link |
|------|------|
| Firebase Console | https://console.firebase.google.com/ |
| Firebase — Project setup | https://firebase.google.com/docs/projects/learn-more |
| Firebase — Android setup | https://firebase.google.com/docs/android/setup |
| Firebase — iOS setup | https://firebase.google.com/docs/ios/setup |
| Plugin install rules | [`plugin-installation.md`](../plugin-installation/plugin-installation.md) |
