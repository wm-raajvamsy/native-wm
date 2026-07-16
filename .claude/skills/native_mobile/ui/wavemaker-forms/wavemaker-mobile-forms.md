---
name: wavemaker-forms
description: >
  WaveMaker Form and Dynamic Form widget system for React Native. Covers static forms
  (markup-declared fields), dynamic forms (metadata-driven fields), form fields, form actions,
  validation, submission, data binding, and styling. Use when generating WaveMaker form markup,
  creating form tokens, building dynamic forms from metadata, or when the user asks about
  "wm-form", "form fields", "form actions", "dynamic form", "form validation", "form submit",
  "metadata form", "form markup", or any form-related WaveMaker task. Also trigger alongside
  screenshot-to-wavemaker or figma-to-wavemaker when the design contains a form.
sub-skills:
  - form-architecture
  - form-markup-examples
  - form-tokens
  - container-system
  - widget-defaults
  - input-widgets
---

# WaveMaker Forms — Static & Dynamic

Generate correct WaveMaker form markup. This skill covers both **static forms** (fields in markup) and **dynamic forms** (fields from metadata at runtime).

**Read first**: `form-markup-examples` — concrete copy-ready examples for all common patterns.
**Architecture/runtime internals**: `form-architecture` (read only when debugging or needing pipeline details).
**Token authoring**: delegate to `figma-to-design-tokens-mobile`. See `form-tokens` for form-wrapper token structure.

## When to Use This Skill

- Design contains a form (login, registration, profile edit, settings, data entry, search filters)
- User asks about `wm-form`, form fields, form actions, validation, submission
- User wants dynamic/metadata-driven forms
- Generating form markup from a screenshot or Figma design (use alongside screenshot-to-wavemaker)
- **Input fields inside a wizard step** — run form detection on EACH wizard step's content independently. Input fields inside a step + the wizard's own Next/Done navigation button = that step's content needs `wm-form` + `wm-form-field`. The wizard's navigation IS the submit action. Do NOT use bare `wm-text` + `wm-label` pairs inside wizard steps that have input fields.

## Quick Decision: Static vs Dynamic

| Use Static Form | Use Dynamic Form |
|---|---|
| Fields known at design time | Fields determined at runtime from API/metadata |
| Fixed field layout | Field list changes based on data/user role |
| Page-specific forms (login, profile) | Generic CRUD forms, configurable surveys |
| Full control over per-field styling | Programmatic field generation |

---

## 1. Static Form — Markup Structure

### Page Template

```xml
<wm-form name="myForm" title="Form Title" subheading="Optional subtitle"
  variant="<variant-name>" class="form-<variant-name>"
  itemsperrow="xs-1 sm-1 md-1 lg-1"
  dataset="bind:Variables.myVar" formdata="bind:Variables.myVar.dataSet"
  messagelayout="Inline"
  postmessage="Saved successfully" errormessage="Save failed"
  on-beforesubmit="onBeforeSubmit($event, widget, formData)"
  on-success="onSuccess($event, widget, data)"
  on-error="onError($event, widget, data)">

  <!-- Body container — ONE container wrapping ALL fields and any inline non-field elements -->
  <wm-container name="fields_container" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="username" key="username" displayname="Username" widget="text"
      variant="field-default" class="form-controls-field-default"
      width="100%"
      required="true" placeholder="Enter username" defaultvalue=""
      validationmessage="Username is required"></wm-form-field>

    <wm-form-field name="email" key="email" displayname="Email" widget="text"
      variant="field-default" class="form-controls-field-default"
      width="100%"
      required="true" placeholder="Enter email"
      regexp="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
      validationmessage="Invalid email format"></wm-form-field>

    <wm-form-field name="role" key="role" displayname="Role" widget="select"
      variant="field-default" class="form-controls-field-default"
      width="100%"
      dataset="admin,editor,viewer" datafield="dataValue" displayfield="dataValue"
      required="true"></wm-form-field>
  </wm-container>

  <!-- Actions container — separate container for form-actions, sibling of body container -->
  <wm-container name="actions_container" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
    <wm-form-action name="save" display-name="Save" type="submit"
      update-mode="true" iconclass="wi wi-check"></wm-form-action>
    <wm-form-action name="cancel" display-name="Cancel" type="cancel"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

### CRITICAL: Form Structure Rules

`<wm-form>` has exactly **two direct `<wm-container>` children**:

1. **Body container** — wraps ALL `wm-form-field` elements. Can also contain nested `<wm-container>` elements for non-field elements (labels, links, dividers) that belong visually within the field area. The order of items inside the body container controls their visual sequence.
2. **Actions container** — sibling of the body container, wraps ALL `wm-form-action` elements.

**Never place `wm-form-field` or `wm-form-action` as direct children of `<wm-form>`.**

**⚠️ NEVER wrap individual `wm-form-field` elements in their own `wm-container`.** Each field is a direct child of the body container. Only wrap in a container when grouping non-field elements (labels, links, dividers) that belong between fields.

```xml
<!-- WRONG — do not do this -->
<wm-container name="fields_container" ...>
  <wm-container name="username_wrap" ...>         <!-- ❌ per-field wrapper -->
    <wm-form-field name="j_username" .../>
  </wm-container>
  <wm-container name="password_wrap" ...>         <!-- ❌ per-field wrapper -->
    <wm-form-field name="j_password" .../>
  </wm-container>
</wm-container>

<!-- CORRECT -->
<wm-container name="fields_container" ...>
  <wm-form-field name="j_username" .../>           <!-- ✓ direct child -->
  <wm-form-field name="j_password" .../>           <!-- ✓ direct child -->
  <wm-container name="forgot_row" ...>             <!-- ✓ container only for non-field element -->
    <wm-label name="forgot_link" .../>
  </wm-container>
</wm-container>
```

**Pattern: fields + inline element (e.g. "Forgot password?") + separate actions**
```xml
<wm-form name="loginForm" captionposition="top" itemsperrow="xs-1 sm-1 md-1 lg-1">
  <!-- Body container: fields + any inline non-field elements as nested containers -->
  <wm-container name="fields_container" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="j_username" key="j_username" displayname="Email" widget="text" required="true" placeholder="you@company.com"></wm-form-field>
    <wm-form-field name="j_password" key="j_password" displayname="Password" widget="password" required="true" placeholder="Enter password"></wm-form-field>
    <!-- "Forgot password?" nested inside body container, after the fields -->
    <wm-container name="forgot_row" class="app-default-container" direction="row" gap="0" alignment="middle-right" width="fill" height="hug">
      <wm-label name="forgot_link" caption="Forgot password?" class="label-link-accent" variant="link-accent"></wm-label>
    </wm-container>
  </wm-container>
  <!-- Actions container: separate direct child of wm-form -->
  <wm-container name="actions_container" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
    <wm-form-action name="signin_action" display-name="Sign in" type="submit" update-mode="true" class="btn-cta"></wm-form-action>
  </wm-container>
</wm-form>
```

### Codegen Auto-Restructuring

The transpiler automatically restructures the form DOM:
1. **All `wm-form-action` nodes** are plucked from anywhere inside the form
2. **Remaining children** (including the fields container) are wrapped in `<wm-form-body>`
3. **Actions** (including the actions container) are placed inside `<wm-form-footer>`
4. You do NOT write `wm-form-body` or `wm-form-footer` manually — codegen creates them

### Form Props Reference

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `name` | string | — | Widget identifier (required) |
| `title` | string | — | Form heading |
| `subheading` | string | — | Subtitle below heading |
| `iconclass` | string | — | Icon next to title |
| `dataset` | bind | — | Bound variable for form data |
| `formdata` | bind | — | Pre-fill data for editing |
| `metadata` | bind | — | **Dynamic form**: field definitions array |
| `defaultmode` | `"Edit"` / `"View"` | — | Initial mode (Edit = updateMode, View = readonly) |
| `layoutposition` | `"vertical"` / `"horizontal"` | `"vertical"` | Label position relative to field |
| `captionposition` | `"floating"` | — | Floating labels on inputs |
| `itemsperrow` | responsive string | — | **(required)** Field columns per breakpoint — always set: `"xs-1 sm-1 md-1 lg-1"` for single-column, `"xs-1 sm-2 md-2 lg-2"` for two-column |
| `messagelayout` | `"Inline"` / `"Toaster"` | `"Inline"` | Where to show success/error messages |
| `postmessage` | string | `"Data posted successfully"` | Success message |
| `errormessage` | string | `"An error occured..."` | Error message |
| `parentForm` | string | — | Name of parent form (nested forms) |

### Form Events

| Event | Signature | When |
|---|---|---|
| `on-beforesubmit` | `($event, widget, formData)` | Before submit — return false to cancel |
| `on-submit` | `($event, widget, formData)` | On submit (no dataset binding) |
| `on-success` | `($event, widget, data)` | After successful variable invoke |
| `on-error` | `($event, widget, error)` | After failed variable invoke |
| `on-result` | `($event, widget, data)` | After any result (success or error) |
| `on-beforerender` | `($metadata, widget)` | **Dynamic form only**: modify metadata before rendering |

---

## 2. Form Field — All Widget Types

### `wm-form-field` Props

| Prop | Purpose |
|---|---|
| `name` | Field identifier (maps to `dataoutput` key) |
| `key` | **(mandatory)** Maps the field to the form dataset property. Set to the direct field name from the form dataset (typically same as `name`). For custom fields not in the form dataset, use `key="custom"` (or `custom1`, `custom2` if multiple custom fields exist). |
| `displayname` | Label text |
| `widget` | Input widget type (see table below) |
| `required` | Validation: field is mandatory |
| `defaultvalue` | Initial value |
| `datavalue` | Current value (usually bound) |
| `placeholder` | Placeholder text |
| `validationmessage` | Custom error message |
| `regexp` | Regex validation pattern |
| `primaryKey` | Mark as primary key field |
| `generator` | `"assigned"` / `"auto"` — primary key generation |
| `readonly` | Read-only state |
| `dataset` | Options for select/radioset/checkboxset/chips |
| `datafield` | Value field in dataset |
| `displayfield` | Display field in dataset |
| `layoutposition` | `"horizontal"` for inline label+input |
| `variant` | Appearance variant name for this field — maps to an entry under `appearances["variant-name"].mapping` in `form-controls/form-controls.json` |
| `on-change` | Change handler |
| `on-validate` | Custom validation handler |

**CRITICAL: Always create variants for form-controls.** All form-controls styling MUST go under `appearances` in `form-controls/form-controls.json` — never in the base `mapping`. Create at least one variant and apply it to all `wm-form-field` elements via the `variant` and `class` attributes. If all fields share the same styling, one variant is enough — apply it to every field. If some fields have visibly distinct styling, create additional variants and assign each field the variant that matches its design.

**Checkbox/toggle text position rule:** `displayname` places the label text ABOVE the widget (standard form-field behavior). `caption` places the text NEXT TO the widget (inline with the box/toggle). When the design shows text beside a checkbox or toggle, use `caption` — NOT `displayname`. Use `displayname` only when the label is visually above the widget.

**⚠️ `iconclass` and `iconposition` are NOT valid attributes on `wm-form-field`** — the validator will reject them. If the design shows an icon inside an input, apply that icon styling through form-controls tokens, not markup attributes.

### Supported Widget Types

| `widget` value | Rendered as | Key bindings from metadata |
|---|---|---|
| `text` | `wm-text` | `updateon`, `maxchars`, `type` (text/email/password) |
| `password` | `wm-text type="password"` | same as text |
| `textarea` | `wm-textarea` | `updateon`, `maxchars` |
| `number` | `wm-number` | `minvalue`, `maxvalue`, `displayValue` |
| `currency` | `wm-currency` | `minvalue`, `maxvalue` |
| `select` | `wm-select` | `dataset`, `displayfield`, `datafield` |
| `autocomplete` | `wm-search type="autocomplete"` | `dataset`, `searchkey`, `limit`, `displayimagesrc` |
| `chips` | `wm-chips` | `dataset`, `displayfield`, `datafield`, `maxsize` |
| `checkbox` | `wm-checkbox` | `caption`, `checkedvalue`, `uncheckedvalue` |
| `checkboxset` | `wm-checkboxset` | `dataset`, `displayfield`, `datafield` |
| `toggle` | `wm-checkbox type="toggle"` | `checkedvalue`, `uncheckedvalue`, `accessibilityrole="togglebutton"` |
| `switch` | `wm-switch` | `dataset`, `displayfield`, `datafield` |
| `radioset` | `wm-radioset` | `dataset`, `displayfield`, `datafield` |
| `date` | `wm-date` | `mindate`, `maxdate`, `datepattern`, `outputformat` |
| `time` | `wm-time` | `timepattern`, `outputformat` |
| `datetime` / `timestamp` | `wm-datetime` | all date + time bindings |
| `slider` | `wm-slider` | `minvalue`, `maxvalue`, `step`, `showmarkers` |
| `rating` | `wm-rating` | `dataset`, `maxvalue`, `showcaptions` |

### Composite Fields (Multiple Widgets in One Row)

A `wm-form-field` maps to exactly ONE input widget. Some designs need **two or more interactive widgets sitting horizontally under a single conceptual field** — the field reads as one thing to the user but requires more than one control. A plain `wm-form-field` cannot express this, and collapsing it into a single field silently drops the secondary widget.

**Detection rule — treat as a composite field when any of these are true:**
- Two interactive widgets sit side-by-side under one visual label
- One widget visually "prefixes" another (narrower selector on the left, wider input on the right, sharing a border or tight spacing)
- The widgets together produce a single logical value (a qualified value, a value with a unit, a value with a context)

**Two approaches — choose based on whether the multi-column applies to ALL fields or SELECTIVE fields:**

**Option A — `itemsperrow` (uniform multi-column, platform-managed)**: When ALL fields in the form should render in 2 columns, set `itemsperrow="xs-1 sm-2"` on `wm-form`. The runtime calculates `48% flexGrow:1` per field and manages wrapping automatically. This is the cleanest approach — no manual widths or containers needed.

**Option B — Composite container (selective multi-column)**: When only SPECIFIC fields sit side-by-side (e.g. Expiry Date + CVV while other fields are full-width), place a `<wm-container direction="row">` directly inside the fields container. Inside, emit each sub-field as a `wm-form-field` (NOT a bare `wm-text`/`wm-label` pair — those bypass the form system entirely, losing validation and `dataoutput` flow).

```xml
<!-- Option A: uniform 2-column -->
<wm-form name="payment_form" itemsperrow="xs-1 sm-2" captionposition="top">
  <wm-container name="fields_container" ...>
    <wm-form-field name="expiry" key="expiry" displayname="Expiry Date*" widget="text" ...></wm-form-field>
    <wm-form-field name="cvv" key="cvv" displayname="CVV*" widget="text" ...></wm-form-field>
  </wm-container>
  ...
</wm-form>

<!-- Option B: selective side-by-side inside a form -->
<wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
  <wm-form-field name="card_holder" key="card_holder" displayname="Card holder name*" widget="text" ...></wm-form-field>
  <!-- Selective 2-column row: use gap="16" minimum to avoid congestion -->
  <wm-container name="expiry_cvv_row" class="app-default-container" direction="row" gap="16" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="expiry" key="expiry" displayname="Expiry Date*" widget="text"
      placeholder="--/--/--" required="true" width="48%"></wm-form-field>
    <wm-form-field name="cvv" key="cvv" displayname="CVV*" widget="text"
      placeholder="***" required="true" width="48%"></wm-form-field>
  </wm-container>
</wm-container>
```

**⚠️ NEVER use bare `wm-text` + `wm-label` pairs inside a form instead of `wm-form-field`.** Raw widgets bypass form validation, don't register with `dataoutput`, and don't respond to form reset/submit lifecycle.

**Gap rule for side-by-side fields:** Use `gap="16"` minimum on the row container. `gap="12"` or less makes two nearly-full-width fields look congested with no breathing room between them.

**Rules:**

- A standalone widget (e.g. `wm-select`) inside the form body is NOT a `wm-form-field` — its value does NOT flow into the form's `dataoutput` automatically. Bind it to its own variable, or merge it into form data in `on-beforesubmit`
- Set `displayname=""` on the inner `wm-form-field` to suppress the duplicate label; place the visible label as a sibling `<wm-label>` above the container, or carry it on the container itself
- Token styling scope: the inner `wm-form-field` is styled by `form-controls/form-controls.json` (via `.app-input`); a standalone `wm-select` in this position is styled by its own `select/select.json`. For `wm-form-field` elements with widgets that need per-widget overrides, see "Widget-Specific Token Overrides Inside Forms" section below
- The codegen auto-restructuring rule still applies: `wm-form-action` nodes are hoisted to the footer; the composite container stays in the body alongside the other fields
- Widths on the two sub-widgets should reflect the design's visible proportions; do not hardcode 30/70

---

## 3. Form Actions

**`wm-form-action` does NOT support the `variant` attribute.** To apply a button appearance, use only the `class` attribute with the button token class name (e.g. `class="btn-use-address"`). Never add `variant` to `wm-form-action`.

### Action Types

| `type` | Behavior | Button class |
|---|---|---|
| `submit` | Calls `form.submit()` → validate → invoke variable | `btn-primary` |
| `reset` | Calls `form.formreset()` — clears to defaults | — |
| `cancel` | Calls `form.cancel()` — switches to View mode | — |
| (custom) | Custom `action` expression | — |

### Action Visibility via `update-mode`

Actions show/hide based on the form's `isUpdateMode` state:
- `update-mode="true"` → visible when form is in **Edit** mode (Save, Cancel)
- `update-mode="false"` → visible when form is in **View** mode (Edit, Delete)

```xml
<wm-form-action name="save" display-name="Save" type="submit"
  update-mode="true" iconclass="wi wi-check"></wm-form-action>
<wm-form-action name="edit" display-name="Edit" type="button"
  update-mode="false" action="edit()"></wm-form-action>
```

### Proportional Action Layout

Actions are always inside the actions container (`<wm-container name="actions_container" class="app-default-container" direction="row" width="fill">`). **When the design specifies explicit action widths** — the buttons are clearly different widths, or the primary is visibly wider/narrower than the secondary — add a `width` attribute on each action that matches the design's visible proportions, and set `gap` and `alignment` on the actions container.

```xml
<wm-container name="actions_container" class="app-default-container" direction="row" gap="<extracted-gap>" alignment="middle-center" width="fill">
  <wm-form-action name="<secondary_action>" display-name="<label>" type="<cancel|reset|button>"
    update-mode="true" width="<narrower-%>">
  </wm-form-action>
  <wm-form-action name="<primary_action>" display-name="<label>" type="submit"
    update-mode="true" width="<wider-%>">
  </wm-form-action>
</wm-container>
```

**Width extraction rule:** measure the actual width proportions from the design, do not use default 40/60 or 50/50 splits. If the design shows a clearly narrower secondary (≈40% vs ≈55%) vs a balanced layout (≈48% vs ≈48%), those are different layouts and should produce different widths.

---

## 4. Dynamic Form — Metadata-Driven

### How It Works

1. Form has `metadata` prop bound to a variable/expression
2. Codegen emits `generateComponent` prop that calls `dynamicForm()`
3. At runtime, `dynamicForm()` converts metadata → WM XML → transpiles → React elements
4. Result stored in `state.dynamicForm` and rendered alongside static children

### Metadata Array Format

Each entry is an object with form field properties as keys:

```json
[
  {
    "name": "firstName",
    "displayname": "First Name",
    "widget": "text",
    "required": "true",
    "placeholder": "Enter first name",
    "defaultvalue": "",
    "validationmessage": "First name is required"
  },
  {
    "name": "age",
    "displayname": "Age",
    "widget": "number",
    "required": "false",
    "minvalue": "0",
    "maxvalue": "150"
  },
  {
    "name": "country",
    "displayname": "Country",
    "widget": "select",
    "dataset": "USA,UK,India,Canada",
    "datafield": "dataValue",
    "displayfield": "dataValue",
    "required": "true"
  },
  {
    "name": "birthdate",
    "displayname": "Date of Birth",
    "widget": "date",
    "datepattern": "yyyy-MM-dd"
  }
]
```

### Dynamic Form Markup

```xml
<wm-form name="dynamicForm" title="Dynamic Form"
  metadata="bind:Variables.formMetadata.dataSet"
  on-beforerender="onBeforeRender($metadata, widget)"
  on-beforesubmit="onBeforeSubmit($event, widget, formData)"
  on-success="onSuccess($event, widget, data)">

  <!-- Actions container — still required even for dynamic forms -->
  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="submit" display-name="Submit" type="submit"
      update-mode="true"></wm-form-action>
    <wm-form-action name="reset" display-name="Reset" type="reset"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

### `on-beforerender` — Modify Fields at Runtime

```javascript
// Add/remove/modify fields before the dynamic form renders
function onBeforeRender($metadata, widget) {
  // Filter fields by user role
  return $metadata.filter(f => f.visibleTo.includes(currentRole));
}
```

### Multi-Column Dynamic Layout

Set `itemsperrow` for responsive multi-column:

```xml
<wm-form name="multiColForm" metadata="bind:Variables.formMeta.dataSet"
  itemsperrow="xs-1 sm-2 md-3 lg-3">
  ...
</wm-form>
```

The generator checks `itemsperrow` and when any breakpoint > 1, wraps fields in a container with `direction="row" wrap="true"` and per-field width.

---

## 5. Validation

### Built-in Validators

| Validator | How to set | Error key |
|---|---|---|
| Required | `required="true"` on form-field | `"required"` |
| Regex | `regexp="^pattern$"` on form-field | `"regexp"` |
| Widget-level | Widget's own validation (min/max, date ranges) | widget-specific |

### Validation Flow

1. **On field change**: `WmFormField.validateFormField()` runs sync validators, then async
2. **On submit**: `WmForm.validateFieldsOnSubmit()` checks all fields:
   - Empty required fields (excluding auto-generated primary keys)
   - Per-field `onValidate` callback
   - Each `formwidget.state.isValid`
3. If any field invalid → submit is blocked, error messages shown

### Cross-Field Validation

Fields can observe other fields via `observeOn` and re-validate when dependencies change.

---

## 6. Submission Flow

```
form.submit()
  → debounced handleSubmit (250ms)
  → cloneDeep(dataoutput)
  → validateFieldsOnSubmit()
  → onBeforesubmit callback (return false to cancel)
  → formSubmit(formData, successCb, errorCb)  [if dataset bound]
    OR onSubmit callback  [if no dataset]
  → onResultCb → onSuccess / onError
  → toggleMessage (Inline or Toast)
```

### Data Output

- `form.dataoutput` / `form.formdataoutput` — object with `{ fieldName: value }` for each field
- Updated on every field change via `updateDataOutput(key, value)`
- Nested forms merge into parent form's dataoutput

---

## 7. Form Styling

Form token authoring is handled by `figma-to-design-tokens-mobile`. When the design requires custom form styling, delegate token generation to that skill.

### CSS Parts Reference

| Part | CSS Class | Token prefix |
|---|---|---|
| Root | `.app-form` | `--wm-form-wrapper-*` |
| Header | `.app-form-header` | `--wm-form-header-*` |
| Header title | `.app-form-title` | `--wm-form-header-title-*` |
| Header subtitle | `.app-form-sub-title` | `--wm-form-header-sub-title-*` |
| Body | `.app-form-body` | `--wm-form-body-*` |
| Footer | `.app-form-footer` | `--wm-form-footer-*` |
| Field | `.app-form-field` | `--wm-form-field-*` |
| Field error | `.app-form-field-error-msg` | `--wm-form-error-*` |
| Label | `.form-label` | `--wm-form-controls-label-*` |
| Placeholder | `.app-*-place-holder-*`, `.app-select-placeholderText` | `--wm-form-controls-placeholder-color` |
| Input | `.app-input` | `--wm-form-controls-*` |
| Input (focused) | `.app-input-focused` | `--wm-form-controls-*` |
| Input (disabled) | `.app-input-disabled`, `.app-select-disabled` | `--wm-form-controls-*` |
| Floating label | `.app-*-with-label .app-text-*-flotaing-label` | `--wm-form-controls-floating-*` |

### Design Token Files for Forms

Two independent token files govern form styling. **Generate BOTH for any styled form.** Generating only `form-controls` is incomplete — `form-wrapper` controls the footer separator, body padding, and header typography which almost always differ from defaults.

| File | Root key | Controls | Generate when… |
|---|---|---|---|
| `form-wrapper/form-wrapper.json` | `"form"` | Form shell: background, padding, border, header, body, footer | **Always generate** when a form exists on screen, and **always set the root `background`** — it defaults to grey (`color.outline.variant`), so a wrapper that styles only footer/body still renders a grey shell. The footer separator and body padding usually need override too. Never skip the wrapper. |
| `form-controls/form-controls.json` | `"form-controls"` | ALL input widgets: border, background, label, placeholder, focus/disabled states | Design specifies a custom input border color, input background, label color, placeholder color, or error text color |

**⚠️ Do NOT generate `form-controls` alone and skip `form-wrapper`.** The footer separator default (`color.outline.variant`) and body padding defaults almost always produce a visual mismatch with the design.

**Do NOT generate `text/text.json`, `textarea/textarea.json`, or other text-input-chrome token files for form inputs.** Those widgets share styling entirely through `form-controls/form-controls.json` via the `.app-input` slot.

**However, some widget types have visual parts NOT controlled by `form-controls` tokens.** These parts render with their component defaults unless explicitly overridden via a per-widget token file. See the **"Widget-Specific Token Overrides Inside Forms"** section below for the full rule.

### Design Property → Token Path Mapping

When a design spec / layout plan lists custom input styling values, map each property to its exact token path inside `appearances["variant-name"].mapping` in `form-controls/form-controls.json`. **Only include paths where the design value differs from the foundation default** — omit everything that matches the default.

| Design property | Token path (inside `appearances["variant-name"].mapping`) | Type |
|---|---|---|
| Input background | `background` | `color` |
| Input text color | `color` | `color` |
| Input border color | `border.color` | `color` |
| Input border radius | `border.radius` | `radius` |
| Input border width | `border.width` | `space` |
| Input border style | `border.style` | `style` |
| Input min height | `min-height` | `space` |
| Input padding | `padding` | `space` |
| Input font size | `font.size` | `font` |
| Input font weight | `font.weight` | `font` |
| Placeholder color | `placeholder.color` | `color` |
| Label color | `label.color` | `color` |
| Label font size | `label.font.size` | `font` |
| Label font weight | `label.font.weight` | `font` |
| Label margin (vertical) | `label.margin.vertical` | `space` |
| Floating label color | `floating.color` | `color` |
| Focused border color | `states.focused.border.color` | `color` |
| Focused border width | `states.focused.border.width` | `space` |
| Focused background | `states.focused.background` | `color` |
| Disabled background | `states.disabled.background` | `color` |
| Disabled border color | `states.disabled.border.color` | `color` |
| Disabled opacity | `states.disabled.opacity` | `radius` |
| Error border color | `appearances["error"].mapping.border.color` | `color` |
| Error text color | `appearances["error"].mapping.color` | `color` |

For form shell properties (`form-wrapper.json`), the analogous mapping is in the property-structure reference at `form-tokens`.

### Token Generation Completeness Checklist

Before finalising `form-controls/form-controls.json`, verify each row — either a value was captured, or it matches the foundation default and was intentionally omitted:

```
[ ] input background        — captured / matches default
[ ] input text color        — captured / matches default
[ ] input border color      — captured / matches default
[ ] input border radius     — captured / matches default
[ ] input border width      — captured / matches default
[ ] input min-height        — captured / matches default
[ ] label color             — captured / matches default
[ ] label font size         — captured / matches default
[ ] placeholder color       — captured / matches default
[ ] focused border color    — captured / matches default
[ ] focused border width    — captured / matches default
[ ] error color             — captured (as appearances["error"] variant) / matches default
[ ] disabled state          — captured / matches default
```

**Error tokens go in an appearances variant, never in base mapping.** If the design specifies an error text or border color, place it under `appearances["error"].mapping` in `form-controls/form-controls.json`. Do NOT add `variant="error"` or any error-related attribute to `wm-form-field` in the markup — the form handles error display via its own validation system.

### CRITICAL: form-wrapper.json Top-Level Key

> **The top-level key in `form-wrapper/form-wrapper.json` is `"form"` — NOT `"form-wrapper"`.**

The filename is `form-wrapper.json` but the JSON root object uses `"form"` as its key. Always use `"form"`, never `"form-wrapper"`.

### CRITICAL: Variant Class Naming in Markup

When emitting a `variant` attribute, the `class` attribute follows the **`<root-key>-<variant-name>`** pattern — where `<root-key>` is the JSON root key of the token file that holds the appearance. The class prefix comes from the root key, NEVER from the filename.

| Widget | Token file | Root key | `variant` | Correct `class` | Wrong `class` |
|---|---|---|---|---|---|
| `<wm-form>` | `form-wrapper.json` | `"form"` | `login` | `form-login` | `form-wrapper-login` |
| `<wm-form-field>` | `form-controls.json` | `"form-controls"` | `email` | `form-controls-email` | `form-field-email` |

Do not pattern-match the JSON filename into the class name. `form-wrapper.json` → prefix `form`. `form-controls.json` → prefix `form-controls`. Always read the root key in the JSON.

For the full property structure, correct types, and worked examples see `form-tokens`.

### Key Foundation Defaults

- **Form shell (root) `background`: defaults to `color.outline.variant` (#E4E4E4 grey), NOT transparent.** Always set `background` explicitly — the fill sampled from the design, or `{color.transparent.@.value}` when the form sits directly on the page. Omit it and the form renders a grey shell behind the fields.
- Header title: `h4` font size, weight 700
- Header subtitle: `h6` font size, weight 500
- Footer: top border (`color.outline.variant`)
- Body: transparent background, `space.1` padding
- Input min-height: 48px, min-width: 160px
- Form-action buttons: default WM button styling (pill shape, 12/24 padding)

---

## 8. Integration with Screenshot-to-WaveMaker

When a screenshot contains a form, apply these rules IN ADDITION to the standard screenshot-to-wavemaker workflow:

### Form Detection Checklist

- Input fields (text boxes, dropdowns, date pickers) → `wm-form` + `wm-form-field`
- Submit/Save/Cancel buttons at the bottom → `wm-form-action`
- Labels paired with inputs → `displayname` on `wm-form-field`
- Grouped input section with a title → `wm-form` with `title`

### ⚠️ Expanded Form Detection — Don't Miss These

Forms aren't always obvious. The AI frequently decomposes these into containers + loose widgets. **These are ALL forms:**

| If You See This... | ...It's a Form |
|---|---|
| Phone number field + "Continue" button | Login/auth form |
| Email + password + "Sign in" / "Log in" button | Login form |
| Single text field + "Send" / "Submit" / "Next" button | Form (even 1 field!) |
| Country selector + phone input + "Continue" button | Login form with 2 fields |
| Name + email + password + "Sign up" / "Register" button | Registration form |
| Toggles/switches grouped with a "Save" button | Settings form |
| Payment fields + "Pay" / "Place order" button | Checkout form |
| Multiple filters + "Apply" / "Search" button | Filter form |
| Profile fields + "Update" / "Save changes" button | Edit form |
| Invite code / single text field + "Verify" / "Submit" button (NOT a single-character code box row — see exception below) | Verification form |

**Decision rule**: ≥1 input widget + ≥1 submit-like button = `wm-form`. Period. The submit-like button includes: Continue, Save, Submit, Sign in, Log in, Send, Apply, Next, Pay, Done, Register, Sign up, Create account, Update, Confirm, Verify, Unlock.

**Exception — single-character code box row (OTP / PIN / passcode / unlock code / verification code)**: A row of N small single-character input boxes (typical 4 or 6) is NOT a `wm-form`, even with a "Verify" / "Confirm" / "Unlock" / "Continue" button — and regardless of whether the caption says "OTP", "PIN", "Passcode", "Unlock Code", or "Verification Code". The N boxes are one logical input expressed as siblings — wrapping them in `wm-form-field` stacks them vertically and breaks the layout. Render as a `wm-container direction="row"` of `wm-text maxchars="1"` widgets with a sibling `wm-button`. Promote to `wm-form` ONLY if the same screen ALSO contains regular fields (name, email, phone, password). See `widget-detection.md` "Single-character code box row" and `widget-defaults.md` "Single-character code box row pattern".

**Hybrid screens**: When a form coexists with non-form elements (social login buttons, "or" dividers, OAuth options, promotional sections), the `wm-form` wraps ONLY the input fields + submit button. Non-form elements go outside as sibling containers.

### Markup Generation Rules for Forms

1. **Wrap ALL input fields in `wm-form`** — never place form inputs as loose widgets
2. **Two containers inside every form** — a fields container for all `wm-form-field` elements, an actions container for all `wm-form-action` elements. Never place fields or actions as direct children of `wm-form`.
3. **Use `wm-form-field`** for each input — set the correct `widget` type
4. **Use `wm-form-action`** for buttons — NOT standalone `wm-button` widgets
5. **Set `update-mode`** on actions to control Edit/View visibility
6. **Match `widget` type to the visual**: text input → `text`, dropdown → `select`, toggle → `toggle`, calendar icon → `date`, star rating → `rating`, phone input → `text`
7. **Required fields — `required` is design-driven, never a default.** Set `required="true"` ONLY when the design marks the field mandatory (a visible asterisk on/after the label, the word "required", or a "* indicates required fields" legend). At runtime it does two things: renders a required-marker asterisk next to the label AND blocks submit until the field is filled. Setting it on an unmarked field invents both. Omit it when the design shows no marker — including on most login/sign-in fields, which rarely display asterisks. Do not fake the marker by typing a literal `*` into `displayname` either.
8. **Placeholders** — extract placeholder text from the design
9. **Default values** — if inputs show pre-filled values, set `defaultvalue`
10. **Helper text** — text below the form (e.g., "We'll call or text to confirm...") goes OUTSIDE the form as a sibling `wm-label`, not inside it

### Token Generation for Forms

- **MANDATORY: Global Token First** — Every token value MUST use a foundation token reference when one exists (`{space.*.value}`, `{radius.*.value}`, `{border.width.*.value}`, `{border.style.solid.value}`, `{color.transparent.@.value}`, `{font.weight.*.value}`, etc.). Static/literal values are LAST RESORT only. See `form-tokens` for the complete lookup.
- Form wrapper tokens go in `form-wrapper/form-wrapper.json`
- Only create custom tokens when the design differs from foundation defaults
- Common overrides: header background, footer border, field spacing, error message color
- **Shorthand support**: `padding`, `border.width`, and `border.radius` support CSS shorthand (1, 2, or 4 values). For single-side borders use `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"`. NEVER use longhand sub-properties.

For detailed architecture and runtime internals, see [references/form-architecture.md](references/form-architecture.md).
For concrete markup examples, see [references/form-markup-examples.md](references/form-markup-examples.md).

---

## 9. Form-Field & Form-Controls Styling

Two token files govern form styling. `form-wrapper/form-wrapper.json` (root key `"form"`) styles the form shell. `form-controls/form-controls.json` (root key `"form-controls"`) styles every input widget — text, number, textarea, select, checkbox, radioset, toggle — plus labels, placeholders, and focus/disabled states.

**How overrides work in each file:**
- `form-wrapper` — `<wm-form>` takes a `variant` attribute; overrides go under `appearances["variant-name"].mapping`. Do NOT write meta or base mapping — only what differs per variant.
- `form-controls` — `<wm-form-field>` takes a `variant` attribute. All styling MUST go under `appearances["variant-name"].mapping` — never in the base `mapping`. Always create at least one variant and apply it to every `wm-form-field`. If fields share the same design, one variant covers all of them. If fields differ visually, create additional variants and assign each field accordingly.

**Floating label rules:** Supported on `text`, `password`, `number`, `textarea`, `date`, `time`, `datetime`, `currency`. NOT supported on `select`, `checkbox`, `radioset`, `toggle`. Enabled via `captionposition="floating"` on `<wm-form>`. Note: the LESS class has a typo — `flotaing` not `floating` — do not correct it.

For the complete property structure, correct token types, and a worked example for each file see `form-tokens`.

---

## 10. Widget-Specific Token Overrides Inside Forms

`form-controls/form-controls.json` targets the `.app-input` style slot, which styles the text-input chrome of widgets like `text`, `textarea`, `number`, `select` (input area only), `currency` (input area only), `datetime`, and `search`. However, several widget types have visual parts that are NOT reached by `form-controls` tokens. These parts render with their component defaults unless explicitly overridden via a separate per-widget token file.

### Which widgets need per-widget overrides

| Widget type | Parts NOT styled by `form-controls` | Per-widget token file needed |
|---|---|---|
| `select` | Arrow/dropdown button (background, icon, border), modal content, modal text, check icon | `select/select.json` (root key: `"select"`) |
| `checkbox` | Box (height, width, border, background, icon), checked/disabled states, label next to box | `checkbox/checkbox.json` (root key: `"checkbox"`) |
| `checkboxset` | Same as checkbox, per-item styling | `checkboxset/checkboxset.json` (root key: `"checkboxset"`) |
| `currency` | Label wrapper (background, border, padding, width), currency symbol label (color, font) | `currency/currency.json` (root key: `"currency"`) |
| `radioset` | Radio button circle, selected/disabled states | `radioset/radioset.json` (root key: `"radioset"`) |
| `toggle` | Track, thumb/handle, on/off states | `toggle/toggle.json` (root key: `"toggle"`) |
| `switch` | Button group (button background, text, border), selected/disabled states | `switch/switch.json` (root key: `"switch"`) |

Widgets that are fully styled by `form-controls` alone (no per-widget file needed): `text`, `password`, `textarea`, `number`, `date`, `time`, `datetime`.

### How to apply per-widget overrides inside forms

1. **Create a variant** in the widget's own token file under `appearances["variant-name"].mapping` — use the same variant name as the form-controls appearance for consistency.
2. **Add the widget class alongside the form-controls class** on the `wm-form-field`. The `class` attribute carries BOTH classes; the `variant` attribute stays unchanged (it references the form-controls appearance only).

```xml
<!-- Select inside form — dual class -->
<wm-form-field name="country" key="country" displayname="Country/Region" widget="select"
  variant="field-default" class="form-controls-field-default select-field-default"
  dataset="bind:Variables.countries.dataSet"
  datafield="code" displayfield="name"></wm-form-field>

<!-- Checkbox inside form — dual class, caption for inline text -->
<wm-form-field name="defaultAddr" key="defaultAddr" caption="Make this my default address" widget="checkbox"
  variant="field-default" class="form-controls-field-default checkbox-field-default"
  checkedvalue="true" uncheckedvalue="false"></wm-form-field>

<!-- Currency inside form — dual class -->
<wm-form-field name="amount" key="amount" displayname="Amount" widget="currency"
  variant="field-default" class="form-controls-field-default currency-field-default"></wm-form-field>
```

3. **Generate the per-widget token file** alongside `form-controls/form-controls.json`. Only include properties where the design differs from the widget's defaults. Refer to the canonical foundation token files for the full property structure of each widget.

### When to generate per-widget overrides

**ALWAYS** when any widget from the table above appears inside a form:

1. **Create a variant** in the widget's per-widget token file under `appearances["variant-name"].mapping` — override the non-input parts to match the form's design.
2. **Add the per-widget variant class** alongside the form-controls class in the `class` attribute. Multiple classes are supported — combine them space-separated: `class="form-controls-<variant> select-<variant>"`, `class="form-controls-<variant> checkbox-<variant>"`, etc.

These widgets have visual parts that never inherit from `form-controls` tokens — their parts will render with component defaults and visually mismatch the styled form inputs unless explicitly overridden.

For the property structure of each widget's token file, refer to the canonical foundation CSS source files.
