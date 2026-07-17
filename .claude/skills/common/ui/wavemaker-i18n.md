---
name: wavemaker-i18n
description: "Configure WaveMaker internationalization (i18n): adding/removing locales, translating messages, customizing date/time/currency formats, managing prefab locale messages, getting localizable messages from pages and binding locale messages to page content."
---

# WaveMaker application internationalization (i18n)
## How WaveMaker i18n works

### Locale files

All locale files live in the `i18n/` folder. Each file is named `{locale}.json` (e.g. `en.json`, `hi.json`, `es.json`) and holds:

- `messages` — flat key-value map of all localized texts for that language
- `formats` — date, time, and currency format patterns for that locale
- `prefabMessages` — overrides for messages defined inside imported prefab components

### Message keys and values

All message keys follow the `LABEL_*` naming convention and are **identical across every locale file** — only the values differ (translated into that language). For example, if a Dashboard page has a static label caption "success":

- `en.json` → `"LABEL_SUCCESS": "success"`
- `es.json` → `"LABEL_SUCCESS": "éxito"`
- `hi.json` → `"LABEL_SUCCESS": "सफलता"`

The key `LABEL_SUCCESS` must exist in every locale file. In HTML pages, static texts are replaced with bindings to these `LABEL_*` keys at localization time.

### Fallback behavior

If a `LABEL_*` key exists in the default locale (e.g. `en`) but is missing in another locale (e.g. `es`), the UI falls back to the default locale value when Spanish is selected — the user sees English text instead. This fallback applies to any missing message in any locale, whether in the app or in a prefab.

The default locale can vary per application (commonly `en` or `de`).

### System messages and backend-maintained translations

WaveMaker backend pre-translates and maintains system messages (commonly used platform messages) for a set of supported locales, returned by **platform_getSystemLocales** (e.g. `ar`, `en`, `hi`, `te`, `ta`, ...).

- **System messages** — only relevant for target locales **not** in the **platform_getSystemLocales** list. For those, fetch system messages via **platform_getSystemLocaleMessages** and translate it. For target locales already in the list, the backend maintains system messages already — do not fetch or send them.
- **Custom/user messages** — any messages added to the default locale by the user, retrieved via **platform_getProjectUserLocaleMessages**. These are always required for every new locale, so the new locale stays populated with the same custom message keys and the application remains consistent across all locales.

### Prefab messages

A prefab is an independent WaveMaker application built as a reusable component and imported into other applications. Prefabs have their own locale files and message keys, defined when the prefab was built.

When a prefab is imported into an application, its messages can be partially overridden from the application side via the `prefabMessages` field in the app's locale files. Rules for prefab message overrides:

- Only existing prefab message **values** can be updated — keys/labels are fixed and cannot be changed or extended from the application.
- Add only the messages whose values need to change; omit the rest.
- The override applies per locale: add the updated messages under the locale where the override should apply.
- If a locale in the app does not have an override for a prefab message, or if the app locale is not configured in the prefab itself, the prefab falls back to its own default locale messages.
- The fallback chain applies broadly: whenever the UI selects a language and the bound message is absent (whether in app messages, system messages, or prefab messages), the default locale value is shown.

## Limitations / Unsupported features

The following features are not supported. Direct the user to WaveMaker Studio for these:

- Dynamic localization of variable/API responses.

## Locale Management

Always call **platform_getConfiguredLocales** first before any add or remove operation to verify existing locales. Never add duplicate locales.

### Adding new locale(s)

Follow these steps in order. When adding new locales, steps 1–2 are each called **once total** and their results reused for every target locale — never re-call them per locale.

1. **platform_getProjectUserLocaleMessages** (No args) — The project's custom/user-defined messages (for `en` if configured, otherwise the first configured locale). **Compulsory for every new locale being added** — translate these values for each target locale. The result may be empty if the project has no custom messages in the default locale.
2. **platform_getSystemLocales** (No args) — The list of locale codes with pre-existing, backend-maintained system translations (e.g. `ar`, `en`, `hi`, `te`, `ta`, ...).
3. For **each** target locale being added, check whether it is in the step-2 list:
   - **Covered** → send only the translated user messages from step 1 to **platform_addLocale** for this locale — if step 1 was empty, send a completely empty `messages` object. Do **not** include system messages — the backend already maintains them, and re-sending them would create duplicate/overwritten keys.
   - **Not covered** → call **platform_getSystemLocaleMessages** (No args) — once total, reused for every uncovered target locale, not once per locale. Translate both the user messages (step 1) and this system messages together, and send the combined set to **platform_addLocale** for this locale.
4. **platform_addLocale** (Required Args) — Add each new locale with the message set assembled per the rule in step 3. The locale value is the language bundle name (e.g. `en` for English, `hi` for Hindi). Never modify or fabricate keys — only translate values.

### Removing locale(s)

**platform_removeLocale** (Required Args) — Remove one or more locales. Accepts a comma-separated list of locale codes (e.g. `en` or `en,hi`).

## Prefab Locale Management

Prefabs are independent components that can be developed/tested separately and later imported as application components. Always call **platform_getPrefabNames** first to verify the prefab exists before updating its messages.

- **platform_getPrefabNames** (No args) — List available prefabs.
- **platform_getPrefabMessages** (Required Args) — Retrieve locale messages for a prefab.
- **platform_updatePrefabMessages** (Required Args) — Update locale messages for a prefab. Pass only the messages that need to be updated — do not pass the full message bundle. Adding new locale keys to a prefab from the application is not supported.

## Customizing Formats (Date, Time, Currency)

Always **get** before **set** — never overwrite formats using partial payloads. Preserve existing format configuration unless explicitly modified by the user.

- **platform_getFormats** (Required Args) — Retrieve date, time, and currency format patterns for a specific locale. A locale code must be provided.
- **platform_updateFormats** (Required Args) — Update format patterns for a specific locale. Always call **platform_getFormats** first and merge existing formats into the update — do not omit unchanged formats.

## Updating and Adding Locale Messages

- **platform_updateLocaleMessages** (Required Args) — Updates message values for existing keys and adds new keys that are not yet present in the application. For existing keys, only their values can be modified — never modify or rename the keys themselves. Pass only the messages you want to update or add, not all messages present in the application. Steps:
  1. Use **grep_in_files** to search for the relevant keys or messages using a regex pattern in the `i18n/**` folder of the project. Only if grep does not return relevant information, fall back to **platform_getAllMessages** (No args) as a last resort — avoid this when possible as it fetches all locale messages across all configured locales.
  2. Pass translated message values for **all** locales that need updating.

## HTML Content Analysis & Localization

Execute the following tools strictly in this order:

1. **platform_getAllPageNames** (No args) — Get available page names. Verify the page exists before proceeding.

2. **ui_getLocalizableMessages** (Required Args) —
   - Returns a list of localizable messages from the page, each with the component tag, component name, attribute name, text value, and `existingKeys` (list of locale keys whose value already matches this text in the locale bundle; empty array if the text is new).
   - If the result is **empty**, the page is already fully localized — inform the user and stop.
   - If the result is **non-empty**, proceed with the steps below.

3. **read_files** (Required Args) — Read the page HTML file to inspect the current page markup.

4. **Map existing keys and generate new keys**
   - For each message where `existingKeys` is **non-empty** → decide whether to reuse one of the existing keys or generate a new `LABEL_*` key.
   - For each message where `existingKeys` is **empty** → generate a new `LABEL_*` key.
   - **platform_checkExistenceOfLabelKeys** (Required Args) — Call this only if there are newly generated keys.
     - Pass a list of generated key names to check whether they already exist in the locale files.
     - The result reports: keys not found (safe to add) and keys that already exist with their current value (decide whether to reuse or generate a new key).
     - Skip this call if all messages were resolved using existing keys.

5. **platform_getConfiguredLocales** (No args) — Retrieve all configured locales.

6. **platform_updateLocaleMessages** (Required Args)
   - Only pass keys that are confirmed new (not reused from `existingKeys` and not reused after `platform_checkExistenceOfLabelKeys`) with their translated values — skip any reused key as it already exists in the locale bundle.
   - Never modify or rename existing locale keys.
   - Pass a list of translations, one entry per locale, each containing the locale code and the translated message key-value pairs.
   - For the default locale, use the exact `text` value returned by **ui_getLocalizableMessages** — do not reformat it.
   - Before saving, verify that each non-default locale's values are translated into the respective language.
   - Skip this step if all messages were resolved using existing keys.

7. **ui_applyChangesOnPageMarkup** (Required Args) — For each localizable message, replace the static text attribute value with a `bind:` expression referencing the assigned `LABEL_*` key.

## Rules

- Always confirm user intent before making changes — never modify locale data without explicit user approval.
- Never fabricate locale keys, locale values, page names, prefab names, or locale structures.
- When localizing page content, always use the exact `text` value returned by **ui_getLocalizableMessages** as the default locale message value — never retype, recase, or reformat it. Any change in text will silently alter the displayed text.
- All locale message keys must follow the `LABEL_*` convention — never generate or accept keys in any other format.
- Never ask the user for information already available from tool responses.
- Preserve existing locale structures and update only the requested portions.
- Prefer minimal and scoped updates over full replacements.
