---
name: wavemaker-rn-biometric-auth
description: "Device biometric authentication for WaveMaker React Native Expo apps using expo-local-authentication. Covers the default biometric-prompt flow and the enrollment + server-validated return-login flow. Trigger on biometric, Face ID, Touch ID, fingerprint, local authentication, authenticateAsync, or device re-prompt. Not LDAP / OAuth / SSO / FIDO2."
---

# WaveMaker React Native — Biometric Authentication

## Overview

Adds **device biometric auth** (Face ID, Touch ID, Android fingerprint) via **`expo-local-authentication`**. Work through the steps in order; confirm each before continuing.

## Scope

**This skill covers:**

- WaveMaker **React Native Studio** app sources under `src/main/webapp` — `wm_rn_config.json`, `app.json`, and page script files
- Default `expo-local-authentication` flow (biometric prompt only)
- Enrollment + server-validated return login (challenge / nonce) at the level of **ordered client steps and API contract questions**
- Registering optional npm packages (secure storage, crypto) via the `plugin-installation` sub-skill

**This skill does not cover:**

- LDAP / OAuth / SSO identity providers
- FIDO2 / WebAuthn / Passkey flows
- Full Java / Spring implementation tutorials
- Third-party auth vendor SDKs (Pendo, Auth0, etc.)
- Codegen repo (`wavemaker-rn-codegen`) internals or Studio cloud vs local export differences
- Missing `Page.Actions` / `Page.Variables`, broken navigation, or esbuild errors — treat these as **project / export / toolchain** issues. Verify the Studio export, `wm_rn_config.json`, `package.json`, then regenerate and do a native rebuild using the team's process.

---

## Conventions (apply to every step)

1. **All npm package installs go through `plugin-installation`.** Never hand-edit `wm_rn_config.json` and never ask the developer for a version — `~{load_skill}(plugin-installation)` resolves the `spec` and writes the file. This applies to `expo-local-authentication`, `expo-secure-store`, crypto libraries, and any peer dependencies.
2. **Page handlers live in the page script file** under `src/main/webapp/pages/<page>/<page>.js`. Markup (`on-tap="..."`) lives in the page markup file next to it.
3. **Widget IDs in code examples are placeholders.** `Page.Widgets.message`, `Page.Widgets.authenticate`, etc. come from the WaveMaker tutorial page — replace them with the actual widget IDs from the user's page before pasting.
4. **`Page.msgerror`** is the example's UI flag for "show error styling." It is a page-scope variable defined in the example page; if the user's page doesn't have it, drop the assignments or rename to a flag that does exist.

---

## Before Starting — Intake

Send the developer **one** structured message with both questions below. Do not proceed until they are answered. Plugin specs are **not** asked here — `plugin-installation` resolves them automatically.

### Q1 — Target platforms

iOS, Android, or both? (Determines whether the Face ID step is needed.)

### Q2 — Integration path

| Path | What it means |
|------|---------------|
| **A — Biometric prompt only** | Just show Face ID / fingerprint to unlock a feature. No server calls, no key storage. |
| **B — Enrollment + passwordless return login** | User enrolls after password login, then signs back in with biometrics. Requires a backend API contract. |

> Path B has its own follow-up questions in [Path B — Intake](#path-b--intake). Do not write any code for Path B until those are answered too.

---

## Path A — Biometric Prompt Only

Run Steps A1 → A4 in order.

### Step A1 — Register `expo-local-authentication`

Delegate the install per [Conventions](#conventions-apply-to-every-step):

```
~{load_skill}(plugin-installation)
```

Ask it to install **`expo-local-authentication`**. After it reports success, follow the project's regenerate → `npm install` → native rebuild cycle.

> **Confirmation:** Reply when `expo-local-authentication` is present in `plugins[]`. Do not proceed to Step A2 until confirmed.

### Step A2 — iOS Face ID Permission (iOS targets only)

> **Pre-condition:** Skip this step if Android-only was confirmed in Q1.

Merge the following into `expo.plugins` inside `src/main/webapp/app.json`. Append — do not replace the whole array.

```json
{
  "expo": {
    "plugins": [
      [
        "expo-local-authentication",
        { "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID." }
      ]
    ]
  }
}
```

`$(PRODUCT_NAME)` expands to the app name at build time; a plain string also works. Omitting this on iOS risks runtime failures or App Store rejection. Android does not need a Face ID block — the native module handles the manifest declaration.

> **Confirmation (iOS targets):** Reply when the `faceIDPermission` config plugin is in `app.json`. Do not proceed to Step A3 until confirmed.

### Step A3 — Handler Requirements

Every biometric handler must satisfy the checklist below. The complete reference handlers in [Step A4](#step-a4--complete-handlers) implement all of these — read this checklist first, then use Step A4 as the canonical code.

1. **`async` handler** — every `LocalAuthentication.*` API returns a Promise.
2. **`require`, not `import`** — WaveMaker event scripts do not support ES `import`. Use `require('expo-local-authentication')` and `require('react-native')` for `Platform`.
3. **Web platform guard first** — `expo-local-authentication` is not available on web. Return early when `Platform.OS === 'web'`.
4. **Hardware capability check** — call `LocalAuthentication.hasHardwareAsync()` before `authenticateAsync`. If `false`, surface "biometric hardware not available" to the user and return.
5. **Enrollment check** — call `LocalAuthentication.isEnrolledAsync()` next. If `false`, prompt the user to set up biometrics in device Settings and return.
6. **`authenticateAsync` options** — set `promptMessage` so the native dialog is meaningful. For biometrics-only, also pass `disableDeviceFallback: true` and (Android) `requireConfirmation: false`.
7. **Branch on `results.success`** — on `false`, map `results.error` (`unknown`, `user_cancel` / `system_cancel` / `app_cancel`, `not_available`, `lockout`) to user-facing messages. `lockout` requires the user to unlock the device with their PIN first.
8. **`try` / `catch` wraps the full flow** — OS-level failures (permission denial, hardware faults) throw, they do not return a `result.error`.
9. **Update the UI** via `Page.Widgets.<id>.*` and finish with `Page.refresh()`.

#### `authenticateAsync` option reference

| Option | Notes |
|--------|-------|
| `disableDeviceFallback` | `false` (default) — allows PIN/passcode fallback. `true` = biometrics-only. |
| `requireConfirmation` | **Android only.** Extra tap after a successful scan. Default `true`; set `false` for a single-step flow. Omit on iOS. |
| `promptMessage` | Text on the native dialog. Always set. |
| `cancelLabel` | Label on the cancel button (Android). |

#### Optional — list supported modalities

Useful for UI copy or feature gating. Still run the hardware and enrollment checks before `authenticateAsync`.

```javascript
const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
```

Returns an array of `LocalAuthentication.AuthenticationType` constants.

### Step A4 — Complete Handlers

Two canonical handlers adapted from the WaveMaker docs ([Integrating Biometric Authentication](https://docs.wavemaker.com/learn/react-native/integrating-biometric-authentication/)), with the [Conventions](#conventions-apply-to-every-step) and [Step A3](#step-a3--handler-requirements) guards applied.

> Widget IDs (`message`, `resetauth`, `authenticate`, `authWithBiometric`) and the `Page.msgerror` flag are from the example page — rename them to match the user's page before pasting.

**Default flow — biometrics with device PIN/passcode fallback.**

```javascript
Page.authenticateTap = async function($event, widget) {
    const LocalAuthentication = require('expo-local-authentication');
    const { Platform } = require('react-native');
    var result = '';
    try {
        if (Platform.OS === 'web') { return; }
        if (!(await LocalAuthentication.hasHardwareAsync())) {
            Page.msgerror = true;
            result = 'Biometric hardware not available';
        } else if (!(await LocalAuthentication.isEnrolledAsync())) {
            Page.msgerror = true;
            result = 'No biometrics enrolled — set up in device Settings';
        } else {
            const results = await LocalAuthentication.authenticateAsync();
            if (results.success) {
                Page.msgerror = false;
                result = 'Successfully authenticated';
            } else if (results.error === 'unknown') {
                Page.msgerror = true;
                result = 'Biometric authentication has been disabled';
            } else if (
                results.error === 'user_cancel' ||
                results.error === 'system_cancel' ||
                results.error === 'app_cancel'
            ) {
                Page.msgerror = true;
                result = 'Authentication process has been cancelled';
            } else if (results.error === 'not_available') {
                Page.msgerror = true;
                result = 'BioMetric Authentication is not enabled';
            }
        }
    } catch (error) {
        Page.msgerror = true;
        result = 'There was an error in authentication';
    }
    Page.Widgets.message.show = true;
    Page.Widgets.resetauth.show = true;
    Page.Widgets.authenticate.show = false;
    Page.Widgets.message.caption = result;
    Page.refresh();
};
```

**Biometrics-only flow.** Same shape; pass options to disable the device passcode fallback.

```javascript
Page.authWithBiometricTap = async function($event, widget) {
    const LocalAuthentication = require('expo-local-authentication');
    const { Platform } = require('react-native');
    var result = '';
    try {
        if (Platform.OS === 'web') { return; }
        if (!(await LocalAuthentication.hasHardwareAsync())) {
            Page.msgerror = true;
            result = 'Biometric hardware not available';
        } else if (!(await LocalAuthentication.isEnrolledAsync())) {
            Page.msgerror = true;
            result = 'No biometrics enrolled — set up in device Settings';
        } else {
            const results = await LocalAuthentication.authenticateAsync({
                disableDeviceFallback: true,
                requireConfirmation: false,
                cancelLabel: 'cancel',
                promptMessage: 'Authenticate with Biometric',
            });
            if (results.success) {
                Page.msgerror = false;
                result = 'Successfully authenticated';
            } else if (results.error === 'unknown') {
                Page.msgerror = true;
                result = 'Biometric authentication has been disabled';
            } else if (
                results.error === 'user_cancel' ||
                results.error === 'system_cancel' ||
                results.error === 'app_cancel'
            ) {
                Page.msgerror = true;
                result = 'Authentication process has been cancelled';
            } else if (results.error === 'not_available') {
                Page.msgerror = true;
                result = 'BioMetric Authentication is not enabled';
            }
        }
    } catch (error) {
        Page.msgerror = true;
        result = 'There was an error in authentication';
    }
    Page.Widgets.message.show = true;
    Page.Widgets.resetauth.show = true;
    Page.Widgets.authWithBiometric.show = false;
    Page.Widgets.message.caption = result;
    Page.refresh();
};
```

In WaveMaker markup, `on-tap="authenticateTap($event, widget)"` maps to `Page.authenticateTap` in the script. The same naming convention applies to variable callbacks (`onSuccess`, `onError`) and lifecycle hooks (`onReady`).

---

## Path B — Enrollment + Server-Validated Login

Use this path for **enrollment + biometric return login** against a backend. The exact device-side responsibilities depend on the backend flow (see Q1 below) — only some flows do nonce signing.

### Path B — Intake

Send the developer **one** structured message with the questions below. Do not write any code or register any package until answered. If a spec doc is attached, extract answers from it and confirm only the gaps.

**Q1 — Backend flow.** Pick one. Share the API spec if unsure.

| # | Flow | How it works |
|---|------|-------------|
| 1 | **Asymmetric key + challenge** | Device generates a key pair at enrollment, sends public key to server. On login, server issues a nonce → device signs it with the private key → server verifies signature. |
| 2 | **Token re-use** | Server issues a biometric token at enrollment. On login, device sends the token back → server validates it. No device-side crypto. |
| 3 | **Local gate only** | Biometric just unlocks a stored refresh/session token. No new server endpoints — uses the existing auth token flow. |
| 4 | **HMAC shared secret** | Server issues a shared secret at enrollment. On login, server issues a nonce → device HMACs it with the shared secret → server recomputes and compares. |

**Q2 — API endpoints** (skip for Flow 3 — no new endpoints). For the confirmed flow, provide each endpoint's URL + method, request body field names, and response shape.

**Q3 — Session token source after primary login.** Pick one — where does the credential (token / `idToken` / session) that gets stored for biometric re-use come from?
- Already in an App-level variable
- Returned in the login API response
- Passed as a page parameter to the enable-biometrics screen

**Q4 — npm packages** (Flows 1, 2, 4 only):

| Role | Question |
|------|----------|
| **Secure on-device storage** | Which package should store credentials? Default `expo-secure-store` — confirm if not. |
| **Crypto / signing** *(Flows 1 and 4 only)* | Which package for key generation + signing? Present options (e.g. `@noble/curves` for pure JS, hardware-backed Keystore APIs) and run the [pre-install compatibility check](#crypto--secure-storage-pre-install-compatibility-check) for whichever they choose. |

> Do not proceed past this point until Q1–Q4 (applicable ones) are answered.

### Required npm Packages

| Role | Default | Used by |
|------|---------|---------|
| **Biometric prompt** | `expo-local-authentication` | All flows |
| **Secure on-device storage** | `expo-secure-store` (confirm with developer) | Flows 1, 2, 3, 4 |
| **Asymmetric key generation + signing** | None — ask the developer | Flows 1, 4 |

For every confirmed package, delegate to `~{load_skill}(plugin-installation)` per [Conventions](#conventions-apply-to-every-step). If the package requires an `app.json` config plugin, merge it into `expo.plugins` per the package's own docs after the install completes.

> **Peer dependencies:** crypto libraries often pull in required peers. Confirm them with the developer and install each via `plugin-installation` too.

### Enrollment Flow (after primary sign-on)

Order matters. All API field names and response shapes come from the spec gathered in Q2.

1. User completes **primary authentication** (e.g. username / password or OTP) — the server session must already be established.
2. App presents an **enable device biometrics** screen. User opts in.
3. Run `LocalAuthentication.authenticateAsync` with all guards from [Step A3](#step-a3--handler-requirements). **Do not generate keys before this succeeds.**
4. **(Flows 1, 4 only)** Generate an asymmetric key pair (Flow 1) or receive a shared secret (Flow 4) using the chosen module.
5. **Store the secret material** in the chosen secure-storage module. The private key / shared secret **never** leaves the device.
6. **Call the enroll API**: send the public key (Flow 1) or device identifier (Flows 2, 4) per the spec. Persist the `idToken` (or equivalent enrollment handle) from the response in secure storage.
7. On failure or the user disabling the feature: **clear** secure storage and call the revoke / disable API if the backend provides one.

### Return Login Flow

1. On app open, check secure storage for enrollment artifacts. If present, offer **login with biometrics**.
2. `authenticateAsync` passes all guards and succeeds.
3. Call the **biometric login API** with `deviceId` + stored `idToken` (or equivalent).
4. **Flows 1, 4** — server returns a **nonce**; device signs it (Flow 1, asymmetric private key) or HMACs it (Flow 4, shared secret); device calls the **validate** API.
   **Flow 2** — device sends the stored biometric token; server validates.
   **Flow 3** — device unlocks the stored refresh/session token locally and proceeds via the existing auth flow.
5. On success, complete app login. On failure, fall back to primary login per product rules.

### How Challenge-Response Signing Works (Flow 1)

The server never receives the private key. It issues a **nonce** (random one-time value), the device signs it with the private key, and the server verifies the signature using the public key it stored at enrollment. A valid signature proves the device holds the private key without revealing it.

```
Enrollment:  device generates keypair → sends publicKey to server → server stores it
Login:       server issues nonce → device signs nonce with privateKey
             → server verifies signature with stored publicKey → grants access
```

The nonce must be **one-time use** with a short TTL on the server. Reusing or replaying a captured signed nonce must not be accepted.

### Crypto / Secure-Storage Pre-Install Compatibility Check

This is the **developer-facing decision gate**. Run it before delegating to `plugin-installation` (which only resolves the `spec` and writes `wm_rn_config.json` — it does not validate suitability).

1. Open the package's npm / docs page and capture:

   | Check | What to look for |
   |---|---|
   | **Peer dependencies** | Additional packages required alongside it. List them. |
   | **Native module** | Pure JS, or requires a native binary (`npx expo prebuild`)? |
   | **Expo Go support** | Works in Expo Go, or requires a development build? |
   | **Expo SDK compatibility** | Is the version compatible with the project's Expo SDK? |
   | **`app.json` config plugin** | Needs one in addition to `plugins` / `customPlugins`? |

2. Present a summary to the developer before installing:

   ```
   Package: <name@version>
   ─────────────────────────────────────────────
   Peer dependencies : <none / list>
   Native module     : yes / no
   Expo Go support   : yes / no (requires dev build)
   SDK compatibility : confirmed / mismatch (project SDK: X, package needs: Y)
   app.json plugin   : required / not required
   ─────────────────────────────────────────────
   Recommendation: <proceed / flag issue>
   ```

3. Flag before proceeding if any of:
   - Peer dependencies exist that the developer hasn't mentioned — list them and ask
   - Package requires a native rebuild and the developer is using Expo Go — warn that testing needs a dev build
   - SDK version mismatch — confirm which version to use

4. Once accepted, hand the package off to `~{load_skill}(plugin-installation)` for the install. Then add any required `app.json` config plugin per the package's docs.

**Do not** use a lightweight hash or random-bytes helper as a substitute for full keygen + sign.

---

## Advanced Options (surface only when asked)

Do not include these in the default implementation path unless the developer explicitly requests them.

**`biometricsSecurityLevel` (Android only)** — restricts to Class 3 strong biometrics. Default `'weak'` also accepts Class 2.

```javascript
{ biometricsSecurityLevel: 'strong' }
```

**`getEnrolledLevelAsync()` — granular enrollment check.** Use instead of `isEnrolledAsync()` when the app must confirm **biometric** enrollment specifically (not just a PIN). Returns `SecurityLevel`: `NONE`, `SECRET`, `BIOMETRIC_WEAK`, `BIOMETRIC_STRONG`.

```javascript
const level = await LocalAuthentication.getEnrolledLevelAsync();
```

**Complete `result.error` codes** — `user_cancel` · `system_cancel` · `app_cancel` · `lockout` · `not_available` · `unknown` · `user_fallback` · `timeout` · `authentication_failed` · `passcode_not_set` · `unable_to_process` · `not_enrolled` · `no_space` · `invalid_context`.

---

## Platform Behaviour

| | iOS | Android |
|---|---|---|
| **Modalities** | Face ID · Touch ID | Fingerprint (BiometricPrompt API 28+) |
| **PIN/passcode fallback** | Yes, if `disableDeviceFallback: false` | Yes, if `disableDeviceFallback: false` |
| **`requireConfirmation`** | Not applicable | Supported (default `true`) |
| **Web preview** | Not supported | Not supported |
| **Face ID in Expo Go** | Not supported — use dev build | N/A |

---

## Troubleshooting

**Cannot find module `expo-local-authentication`** — plugin missing from `wm_rn_config.json`, or the native binary hasn't been rebuilt since Step A1. Re-run `~{load_skill}(plugin-installation)` to verify, then regenerate + native rebuild.

**Runtime error from the crypto / signing library (Path B)** — errors during key generation or signing (missing globals, native module not found, etc.) are almost always a **package compatibility issue**, not a biometric-prompt issue. Re-run the [pre-install compatibility check](#crypto--secure-storage-pre-install-compatibility-check). Common root causes:

- Peer dependency was not installed — check the package's docs
- Package needs a native rebuild but the app is running in Expo Go — switch to a dev build
- Package expects a **global** that needs to be wired early in `index.js` — follow the package's own setup, not a generic polyfill

**iOS `NSFaceIDUsageDescription` error** — complete Step A2; add the `expo-local-authentication` config plugin with `faceIDPermission` to `app.json`.

**Face ID not working during testing (iOS)** — Expo Go does not support Face ID. Use a development build on a real device. Touch ID and Android fingerprint work in Expo Go.

**No prompt on web** — expected; `expo-local-authentication` is not available in a browser preview. Use a device or emulator.

**`result.error: lockout`** — user must unlock the device with their PIN/passcode before biometrics become available again.

---

## References

| Topic | Link |
|------|------|
| WaveMaker — Integrating biometric authentication | https://docs.wavemaker.com/learn/react-native/integrating-biometric-authentication/ |
| Expo — `expo-local-authentication` API | https://docs.expo.dev/versions/latest/sdk/local-authentication/ |
| Expo — Development builds (Face ID not supported in Expo Go on iOS) | https://docs.expo.dev/develop/development-builds/introduction/ |
| `expo-secure-store` (default secure storage) | https://docs.expo.dev/versions/latest/sdk/securestore/ |
| Plugin install rules (canonical specs, `wm_rn_config.json` writes) | `../plugin-installation/plugin-installation.md` |
