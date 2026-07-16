---
name: wavemaker-rn-sentry
description: "Integrates Sentry (@sentry/react-native) in WaveMaker React Native Studio: wm_rn_config.json plugin registration, app.json Expo config plugin, app-level Sentry.init script with the DSN hardcoded in app.js. Use when the user mentions Sentry, DSN, captureException, crash reporting, error tracking, @sentry/react-native, sentry-expo, or wm_rn_config plugins for Sentry."
---

# WaveMaker React Native — Sentry Integration

Integrates **`@sentry/react-native`** into a WaveMaker React Native (Expo) app. Work through **Steps 0–4** in order.

> **Expo SDK 50+:** Use `@sentry/react-native` only. The older `sentry-expo` package is deprecated. The WaveMaker docs page for Sentry still references `sentry-expo` — ignore that pattern.

---

## Scope

**What this skill does:**

- Edits `wm_rn_config.json` to register the `@sentry/react-native` plugin
- Edits `app.json` to add the Expo config plugin with org and project slugs
- Edits the Studio app script (`app.js`) to initialize Sentry inside `App.onAppVariablesReady`
- **Hardcodes the DSN** directly into `app.js` using the value collected in Step 0

**What this skill does not do:**

- Run `npx expo`, `npm install`, or any terminal commands — installs are the developer's responsibility after export
- Handle Sentry source maps, auth tokens, or release tracking

---

## Files Modified

All edits are inside **`src/main/webapp/`** in WaveMaker Studio.

- **`src/main/webapp/wm_rn_config.json`** — adds `@sentry/react-native` to `customPlugins` and `plugins`
- **`src/main/webapp/app.json`** — adds the Sentry config plugin entry to `expo.plugins`
- **`src/main/webapp/app.js`** — inserts `Sentry.init` inside `App.onAppVariablesReady`, with the DSN hardcoded inline

---

## Step 0 — Create Sentry Project & Locate Credentials (Instructions Only)

**MANDATORY behaviour for the agent — read carefully:**

- This step is **instructions only**. **Do not** ask the developer for any values here.
- The agent **must output the entire blockquote below verbatim** as its first user-facing message for this skill. Do **not** summarise it into a table. Do **not** drop the project-creation steps. Do **not** combine it with an "Before I proceed, send me these values" ask.
- After showing the blockquote, the agent moves on to Step 1 (which reads `package.json` — no developer input required). The first time the agent asks the developer for a value is **Step 2** (host URL, org slug, project slug), and again at **Step 4** (DSN).

The Sentry UI is identical on SaaS (`sentry.io`) and any self-hosted Sentry instance — only the host differs.

### Blockquote to output verbatim to the developer

> **Before we wire up Sentry, make sure your Sentry project is set up.** If you don't already have a React Native project in Sentry, create one now:
>
> 1. Open your Sentry web UI and sign in.
> 2. In the left sidebar, click **Projects** → click **Create Project** (top right).
> 3. **Choose a platform** → select **React Native** under "Mobile".
> 4. Set the alert frequency, assign a **Team** (or create one with the `+` button), enter a **Project name**, then click **Create Project**.
> 5. The next screen — **"Configure React Native SDK"** — shows the **DSN** inline near the top. Copy it now and keep it handy.
>
> During the integration I'll ask you for these values from this project. Here's where each one lives, so you know where to look when I ask — **you don't need to send them yet**:
>
> - **DSN** *(required)* — the full URL from the onboarding screen above, or later from **Settings → Projects → `<project>` → Client Keys (DSN)**. Format: `https://<public_key>@<host>/<project_id>`. Use the **full URL**, not just the public key, and not the legacy `public:secret@…` form.
> - **Organization slug** *(required)* — **Settings → General Settings → Organization Slug**, or the `<org-slug>` segment in any URL `/organizations/<org-slug>/…`. Lowercase ASCII letters, digits, and hyphens only.
> - **Project slug** *(required)* — **Settings → Projects → `<project>` → General Settings → Slug**. Lowercase ASCII letters, digits, and hyphens only.
> - **Sentry host URL** *(only if self-hosting)* — your browser's address bar on the Sentry UI. Defaults to `https://sentry.io/` if you're using Sentry SaaS. Only send a different value if you're on a self-hosted Sentry instance, e.g. `https://<your-sentry-host>/`. Trailing slash required.
>
> Let me know once your Sentry project exists and you can see the four values above — I'll then start the file edits and ask you for each value at the step it is needed.

### Pitfalls to flag whenever a value comes back later

- Only the **public key** (`abc123…`) sent instead of the **full DSN URL** → reject and ask again.
- Deprecated DSN with a secret (`public:secret@host/id`) → the secret half is no longer accepted by Sentry; strip it.
- **Organization ID** (numeric) sent instead of the **slug** → the Expo plugin requires the slug.
- Self-hosted DSN with a missing/extra path segment → verify it ends in `/<numeric_project_id>`.

---

## Step 1 — `wm_rn_config.json`

Add `@sentry/react-native` to both `customPlugins` and `plugins`. Append to existing entries — do not remove anything.

**Pick `spec` without asking the developer:** read the Expo SDK version from `package.json` (the `expo` dependency, e.g. `"expo": "~54.0.12"`), then look up the matching `@sentry/react-native` version in the compatibility matrix under **References**.

```json
{
  "customPlugins": [
    { "name": "@sentry/react-native", "spec": "<version from References matrix>", "variable": [] }
  ],
  "plugins": [
    { "name": "@sentry/react-native", "spec": "<version from References matrix>", "variable": [] }
  ]
}
```

**Studio UI alternative:** Build Preferences → Plugins → More Plugins → npm → search `@sentry/react-native` → select version → Add. Verify `wm_rn_config.json` afterwards.

---

## Step 2 — `app.json`

This is the **first time** the agent asks the developer for any value. The user-facing message **must include the project-creation walkthrough** so the developer can set up a Sentry project if they haven't already — do not skip it, do not summarise it into a table.

### Message to send the developer (output verbatim)

> Before I wire up the Expo config plugin in `app.json`, make sure you have a Sentry React Native project ready and grab the org and project slugs.
>
> **If you don't already have a React Native project in Sentry, create one now:**
>
> 1. Open your Sentry web UI and sign in.
> 2. In the left sidebar, click **Projects** → click **Create Project** (top right).
> 3. **Choose a platform** → select **React Native** under "Mobile".
> 4. Set the alert frequency, assign a **Team** (or create one with the `+` button), enter a **Project name**, then click **Create Project**.
> 5. The next screen — **"Configure React Native SDK"** — shows the **DSN** inline near the top. Copy it now and keep it handy (I'll ask for it in the next step).
>
> Then send me these values:
>
> 1. **Organization slug** *(required)* — **Settings → General Settings → Organization Slug**, or the `<org-slug>` segment in any URL `/organizations/<org-slug>/…`. Lowercase ASCII letters, digits, and hyphens only.
> 2. **Project slug** *(required)* — **Settings → Projects → `<project>` → General Settings → Slug**. Lowercase ASCII letters, digits, and hyphens only.
> 3. **Sentry host URL** *(only if you're on self-hosted Sentry)* — your browser's address bar on the Sentry UI, e.g. `https://<your-sentry-host>/` with a trailing slash. **If you're on Sentry SaaS, skip this one** — I'll default it to `https://sentry.io/`.

### Agent rules

- Do **not** ask for the **Sentry host URL** unless the developer says they're on self-hosted Sentry. Default `url` to `https://sentry.io/`. (If a DSN has already been collected and its host does not end in `sentry.io`, treat that as self-hosted and ask.)
- Validate each value against the pitfalls listed at the end of Step 0 before proceeding.
- Once the org slug and project slug (and optionally the host URL) are confirmed, append the Sentry config plugin to the `expo.plugins` array in `src/main/webapp/app.json`. Do not replace the existing array — append only.

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native",
        {
          "url": "<HOST_URL — https://sentry.io/ by default, or self-hosted URL if provided>",
          "project": "<PROJECT_SLUG from Step 0>",
          "organization": "<ORG_SLUG from Step 0>"
        }
      ]
    ]
  }
}
```

> Do **not** add an `authToken` field here. Sentry rejects auth tokens in committed config; the source-map upload step reads `SENTRY_AUTH_TOKEN` from the environment instead (see References).

---

## Step 3 — DSN Placement

The DSN collected in Step 0 is hardcoded directly into `Sentry.init` in `app.js` (see Step 4). No `.env` file, no `process.env` lookup, no build-time variable substitution.

> Hardcoding the DSN means it ships in committed source. The DSN is a public ingestion key (no secret half) so this is acceptable per Sentry's own guidance, but be aware that anyone with access to the repo can submit events to your Sentry project — rotate the DSN by deleting the Client Key in Sentry if it is ever misused.

**Identifying the Sentry host (from the DSN or the Sentry UI URL):**

- Host on `sentry.io` → **Sentry SaaS** (Sentry Cloud)
- Host on any other domain → **self-hosted Sentry**

---

## Step 4 — App Script (`app.js`)

**Ask the developer now** for the **DSN** (Step 0 shows where to find it). Validate against the pitfalls at the end of Step 0 — full URL form, no `public:secret@` legacy shape — before pasting it into the snippet below.

**CRITICAL — editing rule:**

`app.js` already contains the developer's existing lifecycle handlers (`App.onAppVariablesReady`, `App.onPageReady`, `App.onSessionTimeout`, `App.onServiceError`, etc.) and any custom logic. Do **not** remove, replace, or overwrite any existing code.

Make only these two targeted changes:

1. Add `const { Platform } = require('react-native')` at the **top** of the file (after any existing `require` statements if present).
2. Insert the Sentry `if (Platform.OS !== 'web') { ... }` block **inside** the existing `App.onAppVariablesReady` function body, before any existing logic in that function. Leave all other code in the file exactly as-is.

```javascript
const { Platform } = require('react-native');

App.onAppVariablesReady = function () {
  if (Platform.OS !== 'web') {
    App.Sentry = require('@sentry/react-native');
    App.Sentry.init({
      dsn: '<DSN from Step 0>',
      enableNative: true,
      // debug: true,
      tracesSampleRate: 1.0,
      attachScreenshot: true,
      autoSessionTracking: true,
      replaysSessionSampleRate: 1.0,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
      profilesSampleRate: 1.0,
      profilesSessionSampleRate: 1.0,
      profileLifecycle: 'trace',
      environment: 'staging',
      enableAutoSessionTracking: true,
      integrations: [
        App.Sentry.mobileReplayIntegration({
          maskAllImages: false,
          maskAllVectors: false,
          maskAllText: false,
        }),
        App.Sentry.reactNativeTracingIntegration(),
        App.Sentry.reactNavigationIntegration(),
        App.Sentry.hermesProfilingIntegration({
          platformProfilers: false,
        }),
      ],
    });
  }

  /* existing logic remains here — do not remove */
};
```

**Notes:**

- Replace `<DSN from Step 0>` with the literal DSN string collected from the developer in Step 0. Keep the surrounding single quotes.
- Keep one `Sentry.init` for the entire app. Do not call it again in page scripts.

---

## Optional — Test Sentry from a Page

To verify the integration, add a button tap handler in any page script:

```javascript
Page.testSentryTap = function ($event, widget) {
  const Sentry = require('@sentry/react-native');
  Sentry.captureException(new Error('Sentry test from WaveMaker'));
};
```

Check the Sentry dashboard for the incoming event. Always use `require` — not `import`.

---

## After All Steps — Developer Checklist

The agent does not run installs or builds. After all file edits are complete, tell the developer:

1. Re-export the app from WaveMaker Studio.
2. Run `npm install` in the generated Expo app root.
3. Run `npx expo prebuild` then `npx expo run:ios` / `npx expo run:android` — Sentry is a native module and requires a full native build. It does not work in Expo Go.

---

## Troubleshooting

**Prebuild fails — Sentry plugin not found**
`node_modules/@sentry/react-native` is missing. Developer must run `npm install` after export before running prebuild.

**No events appearing in the Sentry dashboard**
Confirm the hardcoded DSN string in `app.js` is the full DSN URL (not just the public key), the app was built as a native build (not Expo Go), and `Sentry.init` is present inside `App.onAppVariablesReady`.

**Sentry not working in Expo Go**
Expected. `@sentry/react-native` is a native module. A development build is required.

**WaveMaker docs reference `sentry-expo`**
Ignore that pattern for Expo SDK 50+. Use `@sentry/react-native` as documented in this skill.

---

## References

### Official Documentation

| Resource | URL |
|----------|-----|
| Sentry — Expo (React Native) manual setup | https://docs.sentry.io/platforms/react-native/manual-setup/expo/ |
| Sentry — DSN explainer (format & where to find it) | https://docs.sentry.io/concepts/key-terms/dsn-explainer/ |
| Sentry — Migrating from `sentry-expo` to `@sentry/react-native` | https://docs.sentry.io/platforms/react-native/migration/sentry-expo/ |
| Sentry — Projects & onboarding (Create Project flow) | https://docs.sentry.io/product/sentry-basics/integrate-frontend/create-new-project/ |
| `@sentry/react-native` releases (SDK compatibility) | https://github.com/getsentry/sentry-react-native/releases |
| WaveMaker — Integrating Sentry (older `sentry-expo` pattern, SDK < 50) | https://docs.wavemaker.com/learn/react-native/integrating-sentry/ |
| WaveMaker — React Native overview | https://docs.wavemaker.com/learn/react-native/ |

### `@sentry/react-native` ↔ Expo SDK Compatibility

Use these as the `spec` in Step 1's `wm_rn_config.json`. Values come from each Expo SDK's `bundledNativeModules.json` (what `expo install` and `expo-doctor` enforce):

| Expo SDK | Pinned `@sentry/react-native` |
|---|---|
| 52 | `~6.1.0` (often bumped to `~6.10.x` on Xcode 16.3+) |
| 53 | `~6.10.0` |
| 54 | `~7.2.0` |


For other SDKs, check the bundled pin at `https://cdn.jsdelivr.net/npm/expo@<sdk-version>/bundledNativeModules.json`. The latest published `@sentry/react-native` line will usually be ahead of the bundled pin — `expo-doctor` warns if you go past it.

### Source Maps and Auth Token

Source-map upload (for readable stack traces in Sentry) requires `SENTRY_AUTH_TOKEN`:

- **Local builds:** set it in `.env.local` (gitignored), not in `app.json` and not in committed `.env`.
- **EAS builds:** add it as an EAS secret.
- Never put the auth token inside the `@sentry/react-native` plugin entry in `app.json` — the Sentry docs explicitly disallow this.

See the Sentry Expo manual-setup link above for the current upload configuration.
