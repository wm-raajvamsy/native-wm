---
name: wavemaker_markup_fixer
description: Fix invalid or non-compliant WaveMaker markup with minimal edits. Use when markup has validation errors, incorrect properties, or structural issues that need to be corrected per component metadata.
---

# Skill: WaveMaker Markup Fixer

## Objective

Fix invalid or non-compliant WaveMaker markup safely and with minimal edits. Enforce component metadata from platform tools; never invent properties, events, or methods.

## Component Metadata Enforcement (Mandatory)

- Read `/catalog/components/{name}/{name}.md` as the **single source of truth** for component usage.
- Use **only** allowed properties from `coreProperties`, `rules`, `events`, `methods`, supported CSS, and `/catalog/components/{name}/advanced-props.md` for additional properties.
- Follow **all** rules returned by this tool for every component used.
- Any violation of tool-returned rules is a hard failure: **stop and report**. No assumptions, no overrides.

## Page Markup

- Page markup is a composition of components in the hierarchy defined by those components.
- Use **ui_getSupportedComponentsList** (No args) for the list of available components.
- **Get component metadata** by reading `/catalog/components/{name}/{name}.md` (core/advanced properties, events, methods).
- Add properties and events from `/catalog/components/{name}/{name}.md` as markup attributes.
- Use properties and methods from `/catalog/components/{name}/{name}.md` in page script as appropriate.
- Use `/catalog/components/{name}/advanced-props.md` for detailed property metadata.
- Update the file at the appropriate path for **all** modifications to an existing page (partial markup + CSS). Before modifying, read page structure with **ui_getPageStructure** (Required Args) to know component names.
- **ui_getPageStructure** (Required Args) reads component hierarchy; it does **not** return full markup.
- To read page files, read directly from the filesystem:
  - Markup: `src/main/webapp/pages/{pageName}/{pageName}.html`
  - Script: `src/main/webapp/pages/{pageName}/{pageName}.js`
  - Variables: `src/main/webapp/pages/{pageName}/{pageName}.variables.json`
  - CSS: `src/main/webapp/pages/{pageName}/{pageName}.css`
- Prefer localized updates:
  - **ui_getPageMarkupByComponent** (Required Args) to read specific components
  - Update portions of the file at the appropriate path (know component names via **ui_getPageStructure** (Required Args) first)
- Use **ui_createNonApiAwareVariable** (Required Args) to create ModelVariable.
- Use **platform_getSessionResource** (Required Args) when the user attaches images — Extract and inspect the screenshot image for layout analysis.

## Types of Variables

- **ui_getSupportedVariablesList** (No args) — all variable types including action variables and descriptions.
- **ui_getVariablesMetadata** (Required Args) — properties, events, methods per variable.
- **platform_listPageVariables** (Required Args) and **platform_listAppVariables** (Required Args) — list existing page/app variables.
- To create variables use **ui_createApiAwareVariable** or **ui_createNonApiAwareVariable** — never create variables via file edits. To update existing variable fields, use **edit_file_content** on the `.variables.json` file; for scope change (page ↔ app), update the destination file first, then remove from the source. For rename, also update all `bind:Variables.<oldName>` and `Page.Variables.<oldName>` references in `.html` and `.js` files.

## General Rules

- Do not invent widget properties, events, or methods.
- Do not introduce unrelated refactors or stylistic rewrites.
- Keep edits minimal and deterministic.
- Always read component capability details from `/catalog/components/{name}/{name}.md`.
- If a component or inherited component name cannot be validated from project context, report clearly and **stop** before guessing.

## Markup Identification and Fix Rules

Mandatory checks to identify issues in markup and fix using available tools.

1. **Component `name`:** If `name` has random/auto-generated suffixes or a default/generic value, replace with a clear, purpose-driven name matching `^[a-zA-Z_][A-Za-z0-9_]+$`. Derive from context in order: component attributes (`binding`, `caption`, `label`, `placeholder`, `hint`) → parent attributes (`caption`, `title`, `name`, `key`, `binding`) → broader ancestor/section context.
2. **Duplicate child names:** A parent cannot have a direct child with the same `name`. Deeper descendants may reuse a name. Update only `name`; change nothing else.
3. **Password:** For password input, set `inputtype="password"`.
4. **Tables:** Inside `<wm-table-column>`, include `<wm-label>` only when custom expressions, formatting, or extra display logic are needed. If label caption binds the same field as column `binding`, remove redundant `<wm-label>`.
5. **Upload:** If file/document upload is a button, replace with `wm-fileupload`.
6. **Repeated siblings:** If siblings share near-identical structure and context implies a dynamic collection (listings, cards, menus, results), convert to one `wm-list` or `wm-card`, model variable as list, bind to component. If siblings differ conditionally, merge into one template and use `show` bindings for variability. **Do not** apply when siblings are intentionally static and independent.
7. **Invalid tag names:** Identify unsupported component tag names.
8. **Supported tags:** Only metadata-listed component tags; exception: `wm-html` and `wm-popover` may contain standard HTML as inner children.
9. **Invalid attributes:** Fix using component metadata. When `widget-type`, `edit-widget-type`, or `widget` appear, resolve metadata per mapping below (e.g. `wm-form-field` with `widget="select"` needs metadata for `wm-form-field`, `wm-select`, and inherited properties).

### Widget mapping (`widget-type` / `edit-widget-type` / `widget` → WaveMaker component)

|Value|Component|
|-----|--------|
|`autocomplete`|`wm-search`|
|`checkbox`|`wm-checkbox`|
|`checkboxset`|`wm-checkboxset`|
|`chips`|`wm-chips`|
|`colorpicker`|`wm-colorpicker`|
|`currency`|`wm-currency`|
|`custom-widget`|`wm-custom-widget`|
|`date`|`wm-date`|
|`datetime`|`wm-datetime`|
|`number`|`wm-number`, `wm-text`|
|`password`|`wm-text`|
|`radioset`|`wm-radioset`|
|`rating`|`wm-rating`|
|`richtext`|`wm-richtexteditor`|
|`select`|`wm-select`|
|`toggle`|`wm-checkbox`|
|`slider`|`wm-slider`|
|`switch`|`wm-switch`|
|`text`|`wm-text`|
|`textarea`|`wm-textarea`|
|`time`|`wm-time`|
|`timestamp`|`wm-time`|
|`typeahead`|`wm-search`|
|`upload`|`wm-fileupload`|

## Visual Component Replacement Rules (Image vs Markup)

Use when validating markup against a provided image.

### 1. Textbox vs textarea

Multi-line in image → use `wm-textarea` instead of single-line textbox.

### 2. Picture-like components

- Icon → `wm-icon` with matching class (Material Icons first, else Font Awesome).
- Chart → `wm-chart`, matching type, model variable for data.
- Rating → `wm-rating`.
- Progress bar/circle → `wm-progress-bar` / `wm-progress-circle`.
- Checkbox/toggle appearance → `wm-checkbox` with appropriate type attribute.

### 3. Button misidentification
    
- Menu → `wm-menu`
- Search → `wm-search`
- Date input → `wm-date`

### 4. Accordion

Collapsible sections in image but wrong markup → `wm-accordion` with `wm-accordionpane` children.

### 5. Select

Select in image but wrong control → `wm-select`.

### 6. Search from input + button

Separate input + search button/icon → single `wm-search`.

### 7. Table

- Verify structure and row actions; use `wm-table-row-action` for row actions, `wm-table-action` for table-level actions (e.g. add row).
- Wrong component → `wm-table` with correct `wm-table-row-action` entries.
- Columns with picture/checkbox/etc. → use `widget-type` as appropriate.
- Ensure all row actions from the image exist in markup via `wm-table-row-action`.

### 8. Chips

Chips in image but wrong widgets → `wm-chips`; set `readonly` per intended behavior (readonly hides input field).

### 9. Text input

Standard text input in image but wrong component → `wm-text`.

### 10. Form actions

For save/submit/reset on `wm-form`, use `wm-form-action`, not raw `wm-button` inside the form for those operations (per metadata).

### 11. Badge

If badge on button/icon/anchor, prefer native `badgevalue` when supported instead of manual badge markup.

## Data Binding Rules

- Only properties with `bindable` `in-bound` or `in-out-bound` may use bind expressions.

### Binding namespace

- Variables: `bind:Variables.<variable_name>`.
- **All** variable references in markup must use the `Variables` prefix, e.g. `bind:Variables.variableName`, `bind:Variables.variableName.dataset.<field>`.

### Examples

- Dataset: `dataset="bind:Variables.employeeService.dataSet"`
- Repeater (`wm-list` / `wm-card`, `isList=true`): `bind:Variables.<name>.dataSet[$i].<field>`
- Object dataset (`isList=false`): `bind:Variables.<name>.dataSet.<field>`

## Execution Workflow

1. **Inventory pass (mandatory first):** Read full markup; apply every rule from **Markup Identification and Fix Rules** and **Visual Component Replacement Rules**. Output a numbered list for **every** rule (pass or fail) before any metadata fetch or fix:
   - `[N] PASS — <rule name>: <one-line confirmation>`
   - `[N] FAIL — <rule name>: <component-name> — <brief fix description>`
2. **Metadata fetch:** For each unique component type in the issue list, read `/catalog/components/{name}/{name}.md` once (no duplicate reads).
3. **Fix plan:** Map each step-1 issue to a fix validated against metadata; every issue must appear.
4. **Apply:** Update the file at the appropriate path — apply targeted fixes one issue at a time. Track which issue numbers each update covers.
5. **Completion check:** Confirm every issue number from step 1 is addressed before finishing.
6. **Deliverable:** Return only applied markup changes (see Output Expectations).

## Output Expectations

- Return **only** the final updated markup changes.
- Do **not** include issue descriptions, classifications, or fix summaries in the delivered output.
