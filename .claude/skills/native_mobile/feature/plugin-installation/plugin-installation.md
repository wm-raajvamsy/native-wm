---
name: plugin-installation
description: >
  Auto-install Expo plugins into wm_rn_config.json whenever a native-mobile flow needs a device
  capability (camera, barcode, location, contacts, calendar, file picker, audio, video, biometric,
  lottie). Maps device widgets and device variables to the correct Expo package + spec, then merges
  entries into the project's wm_rn_config.json via UI MCP file tools. Load whenever device widgets
  are detected in the design, when a device variable is being created, or when the user explicitly
  asks to install a plugin.
---

# Plugin Installation — Native Mobile

WaveMaker React Native projects declare runtime plugins in `src/main/webapp/wm_rn_config.json`. The build server reads `plugins[]` from that file and runs `npm install` for every entry. Device widgets (`wm-camera`, `wm-barcodescanner`, etc.) and device variables (`CameraVariable`, `LocationVariable`, etc.) do **not** work at runtime unless the corresponding Expo plugin is declared here.

This sub-skill is loaded whenever a flow needs to add a plugin. Only update `plugins[]` and `customPlugins[]` in `wm_rn_config.json`.

---

## Widget → plugin mapping

| Widget | Plugin entry to push into `plugins[]` |
|---|---|
| `wm-camera` | `{ "name": "expo-camera", "spec": "17.0.8", "variable": [] }` |
| `wm-barcodescanner` | `{ "name": "expo-camera", "spec": "17.0.8", "variable": [] }` |

---

## Entry fields

Every entry in `plugins[]` (and `customPlugins[]` when applicable) has exactly three fields:

| Field | Type | Description |
|---|---|---|
| `name` | string | Exact npm package name, including scope when applicable (e.g. `expo-camera`, `@react-navigation/native`, `@wavemaker/react-native-ssl-publickey`). |
| `spec` | string | Pinned semver version (e.g. `"17.0.8"`). Never a range (`^`, `~`), wildcard (`*`), or dist-tag (`latest`, `next`). For Git plugins this is the tag/commit/branch label; for local plugins, the version of the uploaded package. |
| `variable` | string[] | Always `[]` here. Holds device-operation handles populated by codegen later — the agent never fills this. |

Canonical entry:
```json
{ "name": "expo-camera", "spec": "17.0.8", "variable": [] }
```

For Git / local packages, add `source` and `url` on the same object (entry still has `name`, `spec`, `variable`):
```json
{ "name": "my-plugin", "spec": "1.0.0", "source": "git",   "url": "https://github.com/org/pkg.git", "variable": [] }
{ "name": "my-plugin", "spec": "1.0.0", "source": "local", "url": "./uploads/my-plugin.zip",       "variable": [] }
```

---

## Spec sourcing (where versions come from)

Resolve `spec` in this exact order. Stop at the first one that yields a value.

1. **Existing project pin.** If `plugins[]` in `wm_rn_config.json` already has an entry with this `name`, keep that `spec` — never downgrade or overwrite.
2. **Canonical version reference** (table below). If `name` appears here, use the listed `spec` exactly.
3. **npm registry.** Fetch `https://registry.npmjs.org/<encoded-name>/latest` (URL-encode scope slashes: `@scope/pkg` → `@scope%2Fpkg`). Use the returned `version` field verbatim. Never default to the string `latest` / `*` / a range.
4. **Ask the user.** Only if the registry lookup fails (network error, 404, private scope).

### Canonical version reference

These are the versions the project's React Native template is built against. Use them exactly when the package appears here.

**Expo packages**

| name | spec |
|---|---|
| `expo` | `54.0.12` |
| `expo-application` | `7.0.7` |
| `expo-av` | `16.0.7` |
| `expo-blur` | `15.0.7` |
| `expo-build-properties` | `1.0.9` |
| `expo-calendar` | `15.0.7` |
| `expo-camera` | `17.0.8` |
| `expo-clipboard` | `8.0.7` |
| `expo-constants` | `18.0.9` |
| `expo-contacts` | `15.0.8` |
| `expo-device` | `8.0.9` |
| `expo-document-picker` | `14.0.7` |
| `expo-file-system` | `19.0.14` |
| `expo-font` | `14.0.8` |
| `expo-image` | `3.0.8` |
| `expo-linear-gradient` | `15.0.7` |
| `expo-local-authentication` | `15.0.1` |
| `expo-localization` | `17.0.7` |
| `expo-location` | `19.0.7` |
| `expo-navigation-bar` | `5.0.8` |
| `expo-network` | `8.0.7` |
| `expo-screen-capture` | `8.0.8` |
| `expo-secure-store` | `15.0.7` |
| `expo-sharing` | `14.0.7` |
| `expo-splash-screen` | `31.0.10` |
| `expo-video` | `3.0.11` |
| `expo-web-browser` | `15.0.8` |
| `@expo/vector-icons` | `15.0.2` |

**React Native libraries**

| name | spec |
|---|---|
| `@react-native-async-storage/async-storage` | `2.2.0` |
| `@react-native-community/datetimepicker` | `8.4.4` |
| `@react-native-community/netinfo` | `11.4.1` |
| `@react-native-community/slider` | `5.0.1` |
| `@react-native-masked-view/masked-view` | `0.3.2` |
| `@react-navigation/drawer` | `7.5.8` |
| `@react-navigation/native` | `7.1.18` |
| `react-native-bundle-splitter` | `3.0.1` |
| `react-native-circular-progress` | `1.4.1` |
| `react-native-gesture-handler` | `2.28.0` |
| `react-native-mime-types` | `2.5.0` |
| `react-native-pager-view` | `6.9.1` |
| `react-native-reanimated` | `4.1.1` |
| `react-native-restart` | `0.0.27` |
| `react-native-safe-area-context` | `5.6.0` |
| `react-native-screens` | `4.16.0` |
| `react-native-ssl-public-key-pinning` | `1.2.3` |
| `react-native-svg` | `15.12.1` |
| `react-native-svg-transformer` | `1.5.0` |
| `react-native-vector-icons` | `10.2.0` |
| `react-native-webview` | `13.15.0` |
| `react-native-worklets` | `0.5.1` |
| `lottie-react-native` | `7.3.4` |
| `victory-native` | `37.3.2` |
| `@wavemaker/react-native-ssl-publickey` | `1.0.2` |

> **Excluded — do NOT install via this skill.** Framework and build toolchain are managed by the project template, not by plugin installs: `react`, `react-dom`, `react-native`, `react-native-web`, `@react-native/assets`, `@react-native/assets-registry`, `@react-native/metro-babel-transformer`, `@expo/metro-runtime`, `hermes-engine`, `@babel/*`, `setimmediate`, `punycode`, `react-lottie-player`. If a flow asks for one of these → no-op.

---

## `wm_rn_config.json` shape

The relevant keys are:

```json
{
  "plugins": [
    { "name": "expo-camera", "spec": "17.0.8", "variable": [] }
  ],
  "customPlugins": []
}
```

- `plugins[]` — canonical list consumed by the build server. Entry shape: `{name, spec, variable: []}`.
- `customPlugins[]` — subset of `plugins[]` for non-registry plugins (Git URL, local zip, or NPM package outside the registry).

Other keys in the file (`author`, `buildMode`, `icon`, `preferences`, `splash`, `serverPath`, `platformConfigs`, `version`, `id`, `name`) are untouched.

---

## Install flow (UI MCP tool sequence)

Auto-write silently — do NOT prompt the user. Report what was added at the end.

**Step 1 — Read.** `~{read_files}` on `src/main/webapp/wm_rn_config.json`. Parse JSON. Capture `plugins`, `customPlugins` (default `[]`). If the file does not exist → STOP; surface that this is not a React Native project.

**Step 2 — Resolve spec.** For every package the trigger asks for, resolve `spec` using the Spec sourcing order above (existing pin → canonical reference → npm registry → ask).

**Step 3 — Diff.** Build `required` (deduplicated by `name`). `missing = required − any entry already in plugins[] with the same name`. If empty → no-op; log "no plugins to install" and skip Step 4.

**Step 4 — Merge.** For each entry in `missing`:
- Append `{name, spec, variable: []}` to `plugins[]`.
- If the package is in the canonical version reference → do NOT add to `customPlugins[]`.
- If the package was resolved via npm registry, or is Git / local → also append to `customPlugins[]`. For Git / local, include `source` and `url` on the same object.

Write the merged JSON back via `~{write_file}` to `src/main/webapp/wm_rn_config.json`. Preserve every other top-level key untouched.

**Step 5 — Verify.** Re-read the file. Confirm each missing entry now appears in `plugins[]`. Log one line: `Added plugins: expo-camera@17.0.8, date-fns@3.6.0 (registry)`.

---

## Hard rules

- Never write `package.json`, `package-lock.json`, or anything under `node_modules`. The build server runs `npm install` from `plugins[]`.
- Never invent a `spec`. Resolve in this order: existing project pin → canonical version reference → npm registry (`https://registry.npmjs.org/<name>/latest`) → ask the user.
- Never use ranges (`^x.y.z`, `~x.y.z`), wildcards (`*`), or dist-tags (`latest`, `next`) as `spec`. Always a pinned semver string.
- Never add packages from the Excluded list (framework / build toolchain).
- Never downgrade an existing plugin entry. If `plugins[]` already contains the plugin with a different `spec`, leave the existing entry as-is.
- Never write to `customPlugins[]` for registry plugins (those in the tables above).
- Never prompt the user before writing — auto-write and report after.
- Never edit `wm_rn_config.json` for anything outside the `plugins` / `customPlugins` keys.
- If `src/main/webapp/wm_rn_config.json` is missing → STOP and tell the user this is not a React Native project.

---

## Worked examples

### Example 1 — device widget (canonical version)

Screenshot of a product-detail screen with a "Scan barcode" button and a "Take photo" tile.

1. Phase 1 widget detection maps: Scan → `wm-barcodescanner`; Photo → `wm-camera`.
2. Trigger fires → load this reference before Phase 4.
3. `~{read_files}` `wm_rn_config.json` → `plugins: []`, `customPlugins: []`.
4. Resolve spec: `expo-camera` is in the canonical reference → `17.0.8`.
5. `required` after dedup: `[{ "name": "expo-camera", "spec": "17.0.8", "variable": [] }]` (barcode + camera both resolve to `expo-camera`).
6. Canonical reference hit → push to `plugins[]` only. Do NOT touch `customPlugins[]`.
7. `~{write_file}` merged JSON.
8. Verify, log: `Added plugins: expo-camera@17.0.8`.

### Example 2 — out-of-reference package (registry lookup)

User asks: "format the dates with date-fns".

1. Generated JS will `import { format } from 'date-fns'`.
2. Trigger fires. `date-fns` is NOT in the canonical reference.
3. Fetch `https://registry.npmjs.org/date-fns/latest` → `{ "version": "3.6.0", ... }`.
4. `required`: `[{ "name": "date-fns", "spec": "3.6.0", "variable": [] }]`.
5. Resolved via registry → push to BOTH `plugins[]` and `customPlugins[]`.
6. `~{write_file}`. Verify. Log: `Added plugins: date-fns@3.6.0 (registry)`.
