---
name: wavemaker-rn-secure-store
description: "Securely store, retrieve, and delete sensitive data (credentials, tokens, cryptographic keys) in a WaveMaker React Native (Expo) app via the built-in SecureStorageService dependency — backed by iOS Keychain and Android Keystore (expo-secure-store). Covers setItem / getItem / removeItem / isSecureStorageAvailable, the 'Remember Me' login use-case, and persisting auth tokens. Trigger on secure store, SecureStorageService, keychain, keystore, store credentials securely, remember me, save token securely, expo-secure-store, setItem, getItem, removeItem."
---

# WaveMaker React Native — Secure Store

## Overview

Stores sensitive data — user credentials, auth tokens, cryptographic keys — encrypted on-device using the **iOS Keychain** and the **Android Keystore** (industry-standard, hardware-backed, secure-enclave protected). In a WaveMaker React Native app this is exposed through the built-in **`SecureStorageService`** dependency:

```javascript
const secureStore = App.getDependency('SecureStorageService');
```

`SecureStorageService` is part of the WaveMaker RN runtime ([secure-storage.service.ts](../../../../../wavemaker-rn-runtime/src/core/secure-storage.service.ts)) — it wraps `expo-secure-store` on native and falls back to regular storage on web. **No widget, device variable, or app.json change is required to use it** — it is consumed entirely from page / app JavaScript.

---

## Scope

**What this skill covers:**

- Using `App.getDependency('SecureStorageService')` from page script files (`src/main/webapp/pages/<page>/<page>.js`) and `app.js`
- The three core operations — add, retrieve, delete a key/value pair
- Availability check (`isSecureStorageAvailable`)
- The "Remember Me" login use-case and persisting/clearing auth tokens

**What this skill does not cover:**

- LDAP / OAuth / SSO / FIDO2 / biometric flows — for biometrics see [`wavemaker-rn-biometric-auth`](../wavemaker-rn-biometric-auth/wavemaker-rn-biometric-auth.md)
- Encryption schemes, key-pair generation, or signing (Secure Store only stores string values)
- Large or non-sensitive data — use the regular Storage/AppStorage for that
- Server-side credential storage

---

## Conventions (apply to every step)

1. **`SecureStorageService` is built into the runtime — do NOT install a plugin for it.** The standard flow is just `App.getDependency('SecureStorageService')`. Only if the generated app throws *"Cannot find module `expo-secure-store`"* at runtime, register `expo-secure-store` via `~{load_skill}(plugin-installation)` (canonical spec `15.0.7`) and rebuild.
2. **Page handlers live in the page script file** under `src/main/webapp/pages/<page>/<page>.js`. Markup (`on-change="..."`, `on-tap="..."`) lives in the page markup file next to it. App-wide logic lives in `src/main/webapp/app.js`.
3. **Widget IDs in code examples are placeholders** (`loggedInUserForm1`, `j_username`, `rememberme`, …) — replace them with the actual IDs from the user's page before pasting.
4. **All operations are `async`.** Mark the enclosing handler `async` and `await` every call. Values must be **strings** — `JSON.stringify` objects before storing, `JSON.parse` after retrieving.
5. **Secure Store is almost always wired into a form.** Whenever the user asks to add secure storage (without naming a specific form), you MUST first discover the project's forms and ask which one — see [Before Starting — Discover Forms & Ask](#before-starting--discover-forms--ask). **Ask every time. Never assume the form, and never guess from a single match.**

---

## Before Starting — Discover Forms & Ask

Secure Store's highest-usage scenario is persisting/pre-filling form data (credentials, tokens). So before writing any code, find every form in the app and let the user choose the target. **Run this every time** the user asks for secure storage without explicitly naming the form — even if the project appears to have only one form.

### Step 0.1 — List candidate pages

```
~{find_files_by_glob}  src/main/webapp/pages/**/*.markup.xml
```

This returns one markup file per page. The page name is the directory/file stem (`pages/<PageName>/<PageName>.markup.xml`).

### Step 0.2 — Find which pages contain forms

Search the markup for form widgets and capture each form's `name`:

```
~{grep_in_files}  pattern="<wm-(live)?form\b"  glob="src/main/webapp/pages/**/*.markup.xml"
```

For each hit, `~{read_files}` the matched markup to extract:
- the **page** it lives on,
- the form's **`name`** attribute (the widget ID used as `Page.Widgets.<formName>`),
- the form type (`wm-form` vs `wm-liveform`),
- the field widget **`name`**s inside it (`wm-form-field` / input widgets — these become `formWidgets.<fieldName>.datavalue`).

> If `~{find_files_by_glob}` returns nothing for `src/main/webapp/pages/**`, this is not a WaveMaker React Native project export — stop and tell the user.

### Step 0.3 — Present the forms and ask (mandatory)

Show the discovered forms as a numbered list and ask the user to pick the target. Do not proceed until they answer. Example message:

```
I found these forms in the app:

  1. LoginForm        (Pages/Login)    — fields: j_username, j_password
  2. ProfileForm      (Pages/Profile)  — fields: email, phone, address
  3. PaymentForm      (Pages/Checkout) — fields: cardNumber, cvv, expiry

Which form should use secure storage? Reply with a number or the form name.
Also tell me which fields should be stored (default: all input fields on that form).
```

If the discovery finds **zero** forms, do **not** assume a target — say no forms were found and **ask the user directly where to implement secure storage** (e.g. which page, lifecycle handler such as `Page.onReady` / `App.onLogout`, or button/event handler). Wait for their answer before writing any code.

### Step 0.4 — Confirm scope before coding

Once a form is chosen, confirm with the user:
- which **fields** to persist (default: all input fields on that form),
- the **storage key** to use (default derived from the form name),
- the **save trigger** — what event writes the data to secure storage (a button/checkbox event, a form `on-submit`, or an App lifecycle handler). Don't assume; ask.
- whether to **pre-fill** the form on page ready (default: yes),
- whether to **clear** stored data on an explicit user action (e.g. logout).

Then apply the wiring shown in the [Core API](#core-api) and use-cases below, substituting the real page name, form `name`, field `name`s, and chosen trigger for the placeholders.

---

## Core API

`getItem`, `setItem`, and `removeItem` each return a Promise **and** accept an optional Node-style callback `(error, result?)` as the last argument. Prefer `await`.

### Add a key/value pair — `setItem(key, value)`

```javascript
await App.getDependency('SecureStorageService').setItem("superHero", "Batman");
```

Stores `"Batman"` under key `"superHero"`. `value` must be a string. Rejects (throws) on write failure — wrap in `try/catch` when failure must be handled.

### Retrieve a key/value pair — `getItem(key)`

```javascript
const hero = await App.getDependency('SecureStorageService').getItem("superHero");
```

Returns the stored string, or **`null`** if the key is absent (also resolves to `null` on read error — it logs rather than throwing). Always null-check before `JSON.parse`.

### Delete a key/value pair — `removeItem(key)`

```javascript
await App.getDependency('SecureStorageService').removeItem("superHero");
```

### Check availability — `isSecureStorageAvailable()`

Returns `true` only when native secure storage is available; always `false` on web. Use it to decide whether to store secrets or skip:

```javascript
const secureStore = App.getDependency('SecureStorageService');
if (await secureStore.isSecureStorageAvailable()) {
    await secureStore.setItem('auth', JSON.stringify(auth));
}
```

> **Web behaviour:** On `Platform.OS === 'web'` the service delegates to the non-secure regular storage. Treat web builds as **not** providing hardware-backed security — do not rely on it for secrets in a browser preview.

---

## Use-Case 1 — Remember Credentials on a Login Screen

This is **one example** of wiring secure storage to a form, applied **after** the target form is chosen in [Before Starting — Discover Forms & Ask](#before-starting--discover-forms--ask). It happens to use a login form with a "Remember Me" checkbox as the save trigger; the same store/retrieve/clear shape works for any form and any trigger — swap in the page name, form `name`, field `name`s, and the trigger the user selected.

### Requirement
- A login page with a "Remember Me" checkbox.
- Credentials saved to the secure store when the box is checked, and pre-filled on the next visit.

### Assumption
- The WaveMaker project has a login page with username and password input fields (e.g. inside a `loggedInUserForm1` login form).

### Step 1 — Add the checkbox (page markup)

In `Pages/Login`, add a checkbox wired to a change handler:

```xml
<wm-checkbox caption="Remember me" name="rememberme"
    on-change="remembermeChange($event, widget, newVal, oldVal)">
</wm-checkbox>
```

### Step 2 — Save credentials on check (page script)

In `src/main/webapp/pages/Login/Login.js`:

```javascript
Page.remembermeChange = async function ($event, widget, newVal, oldVal) {
    const secureStore = App.getDependency('SecureStorageService');
    if (newVal) {
        setTimeout(async () => {
            const username =
                Page.Widgets.loggedInUserForm1.formWidgets.j_username.datavalue;
            const password =
                Page.Widgets.loggedInUserForm1.formWidgets.j_password.datavalue;

            const auth = { username, password };
            await secureStore.setItem('auth', JSON.stringify(auth));
        }, 400);
    } else {
        // Unchecking clears the stored credentials
        await secureStore.removeItem('auth');
    }
};
```

> The `setTimeout(…, 400)` lets the form fields settle their `datavalue` before reading them. Adjust or drop it to match the user's page behaviour.

### Step 3 — Pre-fill on page ready (page script)

```javascript
Page.onReady = async function () {
    const res = await App.getDependency('SecureStorageService').getItem('auth');
    if (res) {
        const auth = JSON.parse(res);
        if (auth.username && auth.password) {
            Page.Widgets.loggedInUserForm1.formWidgets.j_username.datavalue = auth.username;
            Page.Widgets.loggedInUserForm1.formWidgets.j_password.datavalue = auth.password;
        }
    }
};
```

The `if (res)` guard is required — `getItem` returns `null` on first launch, and `JSON.parse(null)` would throw.

---

## Use-Case 2 — Persist an Auth Token After Login

Store the token returned by the login API, then read it before authenticated calls.

```javascript
// After a successful login — e.g. a login Variable's onSuccess handler
Page.loginSuccess = async function (variable, data) {
    await App.getDependency('SecureStorageService').setItem('accessToken', data.accessToken);
};
```

```javascript
// Before an authenticated API call
Page.attachToken = async function () {
    const token = await App.getDependency('SecureStorageService').getItem('accessToken');
    if (token) {
        // attach token to the request header / variable input
    }
};
```

---

## Use-Case 3 — Clear All Secrets on Logout

Wipe stored secrets when the user signs out. Place this in `src/main/webapp/app.js`:

```javascript
App.onLogout = async function () {
    const secureStore = App.getDependency('SecureStorageService');
    await secureStore.removeItem('auth');
    await secureStore.removeItem('accessToken');
};
```

---

## Notes & Gotchas

- **Strings only** — `JSON.stringify` objects before `setItem`; `JSON.parse` after `getItem`.
- **`getItem` returns `null`** for a missing key — always null-check before parsing.
- **`setItem` / `removeItem` reject on failure**; `getItem` resolves to `null` on failure. Wrap writes in `try/catch` when you must react to failure.
- **Web is not secure** — on web the service falls back to regular storage with no hardware backing. Gate secret writes behind `isSecureStorageAvailable()` if web is a target.
- **No plugin install in the normal path** — it's a runtime dependency. See Convention 1 for the rare `expo-secure-store` missing-module case.

---

## Troubleshooting

**`App.getDependency('SecureStorageService')` returns undefined**
The dependency name is case-sensitive and must be exactly `'SecureStorageService'`. Confirm the project is on a runtime version that ships the service.

**`Cannot find module 'expo-secure-store'` at runtime**
The native module isn't present in the generated app. Register `expo-secure-store` via `~{load_skill}(plugin-installation)` (canonical spec `15.0.7`), then regenerate + native rebuild.

**`JSON.parse` throws "Unexpected token ... in JSON"**
You called `getItem` for a key that was never set (returns `null`) or stored a non-JSON string. Null-check the result and only `JSON.parse` values you stored with `JSON.stringify`.

**Secrets not persisted / readable on web preview**
Expected — web falls back to non-secure storage and provides no Keychain/Keystore backing. Test secure behaviour on a device or emulator.

**`await is only valid in async functions`**
Mark the enclosing handler (or `App.onLogout` / `Page.onReady`) `async` as shown above.

---

## References

| Topic | Link |
|------|------|
| WaveMaker — Integrating Secure Store | https://docs.wavemaker.com/learn/react-native/integrating-secure-store/ |
| Expo — `expo-secure-store` API | https://docs.expo.dev/versions/latest/sdk/securestore/ |
| Runtime source — `SecureStorageService` | `../../../../../wavemaker-rn-runtime/src/core/secure-storage.service.ts` |
| Biometric authentication (related security skill) | `../wavemaker-rn-biometric-auth/wavemaker-rn-biometric-auth.md` |
| Plugin install rules (only if `expo-secure-store` missing) | `../plugin-installation/plugin-installation.md` |
