---
name: input-widgets
description: >
  M3-compliant input widget reference for wm-text, wm-number, wm-currency, and wm-select:
  full props tables (including variant filled/outlined, floatinglabel, leadingiconclass,
  trailingiconclass, hint), style parts, correct token override paths using form-controls
  (root key "form-controls", selector .app-input) and component-specific tokens (currency,
  select), and markup examples for standard, filled, and outlined variants. Load when
  generating or styling any input field widget.
---

# Input Widgets — M3 Reference

## wm-text

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | string | — | Required |
| `placeholder` | string | — | |
| `datavalue` | any | — | |
| `floatinglabel` | string | — | Label that floats above the field when focused/filled |
| `hint` | string | — | Helper text shown below the field |
| `maxchars` | number | — | |
| `readonly` | boolean | false | |
| `required` | boolean | false | |
| `type` | string | `text` | `text\|email\|password\|url\|tel` |
| `variant` | string | — | `filled\|outlined` — M3 appearance variant |
| `leadingiconclass` | string | — | Icon class shown at the left of the input (e.g. `fa fa-search`) |
| `trailingiconclass` | string | — | Icon class shown at the right of the input (e.g. `fa fa-times`) |
| `on-change` | event | — | |
| `on-leadingiconclick` | event | — | Fires when the leading icon is tapped |
| `on-trailingiconclick` | event | — | Fires when the trailing icon is tapped |

### Style Parts

| CSS Class | Style Part | Controls |
|---|---|---|
| `app-text` | `root` | Outer wrapper |
| `app-text-input-container` | `inputContainer` | Row containing icon(s) + input |
| `app-text-leading-icon` | `leadingIcon` | Leading icon element |
| `app-text-trailing-icon` | `trailingIcon` | Trailing icon element |
| `app-text-icon-wrapper` | `iconWrapper` | Touchable wrapper around icons |
| `app-text-input-with-leading-icon` | `inputWithLeadingIcon` | Input field when leading icon is present |
| `app-text-input-with-trailing-icon` | `inputWithTrailingIcon` | Input field when trailing icon is present |
| `app-text-floating-label` | `floatingLabel` | Floating label at resting position |
| `app-text-active-floating-label` | `activeFloatingLabel` | Floating label when field is active/filled |

---

## wm-number

### Props (M3 additions)

| Prop | Type | Notes |
|---|---|---|
| `variant` | string | `filled\|outlined` — M3 appearance variant |
| `floatinglabel` | string | Label floats above when focused |

All other props unchanged: `name`, `placeholder`, `datavalue`, `minvalue`, `maxvalue`, `step`, `readonly`, `required`.

---

## wm-currency

### Props (M3 additions)

| Prop | Type | Notes |
|---|---|---|
| `variant` | string | `filled\|outlined` — M3 appearance variant |
| `floatinglabel` | string | Label floats above when focused |

All other props unchanged: `name`, `placeholder`, `datavalue`, `currency`, `minvalue`, `maxvalue`, `step`.

### Style Parts

| CSS Class | Style Part | Controls |
|---|---|---|
| `app-currency` | `root` | Outer wrapper |
| `app-currency-label-wrapper` | `labelWrapper` | Prefix column (holds currency symbol — background, border-radius, padding) |
| `app-currency-label` | `label` | Currency symbol/label text |
| `app-currency-floating-label` | `floatingLabel` | Floating label at resting position |
| `app-currency-active-floating-label` | `activeFloatingLabel` | Floating label when field is active/filled |

---

## wm-select

No new M3 props on `wm-select`. Props unchanged: `name`, `dataset`, `datavalue`, `datafield`, `displayfield`, `placeholder`.

### Style Parts

| CSS Class | Style Part | Controls |
|---|---|---|
| `app-select` | `root` | Outer wrapper |
| `app-select-arrow-button` | `arrowButton` | Dropdown arrow button |
| `app-select-modal` | `modal` | Modal overlay |
| `app-select-modal-content` | `modalContent` | Modal list container |
| `app-select-check-icon` | `checkIcon` | Selected item checkmark |
| `app-select-select-item` | `selectItem` | Individual option row |
| `app-select-selected-item` | `selectedItem` | Currently selected row highlight |
| `app-select-placeholder-text` | `placeholderText` | Placeholder color |

---

## Token Overrides

### `form-controls` — applies to wm-text, wm-number, wm-currency, wm-select

Root key: `"form-controls"` | Selector: `.app-input` | File: `tokens/form-controls/form-controls.json`

Appearances: `standard` (default), `filled`, `outlined`

**Filled appearance**
```json
{ "form-controls": { "appearances": { "filled": { "mapping": {
  "background": { "value": "{color.surface.dim.@.value}", "type": "color" },
  "border": {
    "radius": { "value": "{radius.sm.value} {radius.sm.value} 0 0", "type": "radius" },
    "width": { "value": "0 0 {border.width.1.value} 0", "type": "space" }
  },
  "floating": {
    "color": { "value": "{color.on-surface.variant.@.value}", "type": "color" }
  }
} } } } }
```

**Outlined appearance**
```json
{ "form-controls": { "appearances": { "outlined": { "mapping": {
  "background": { "value": "{color.white.@.value}", "type": "color" },
  "border": {
    "radius": { "value": "{radius.md.value}", "type": "radius" },
    "color": { "value": "{color.outline.@.value}", "type": "color" },
    "width": { "value": "{border.width.1.value}", "type": "space" },
    "style": { "value": "{border.style.base.value}", "type": "style" }
  }
} } } } }
```

**Base mapping override (any appearance)**
```json
{ "form-controls": { "mapping": {
  "min-height": { "value": "56px", "type": "space" },
  "border": {
    "color": { "value": "{color.outline.@.value}", "type": "color" },
    "radius": { "value": "{radius.sm.value}", "type": "radius" },
    "style": { "value": "{border.style.base.value}", "type": "style" },
    "width": { "value": "{border.width.1.value}", "type": "space" }
  },
  "states": {
    "focused": {
      "border": { "color": { "value": "{color.primary.@.value}", "type": "color" } }
    }
  }
} } }
```

### `currency` — prefix column tokens

Root key: `"currency"` | Selector: `.app-currency` | File: `tokens/currency/currency.json`

```json
{ "currency": { "mapping": {
  "labelwrapper": {
    "background": { "value": "{color.primary.@.value}", "type": "color" },
    "border": { "radius": { "value": "6px 0 0 6px", "type": "space" } },
    "padding": { "value": "{space.2.value} {space.4.value}", "type": "space" },
    "width": { "value": "{space.12.value}", "type": "border" }
  },
  "label": {
    "color": { "value": "{color.white.@.value}", "type": "color" },
    "font": {
      "weight": { "value": "{body.medium.font-weight.value}", "type": "font" },
      "size": { "value": "{body.large.font-size.value}", "type": "font" }
    }
  }
} } }
```

### `select` — modal and arrow tokens

Root key: `"select"` | Selector: `.app-select` | File: `tokens/select/select.json`

```json
{ "select": { "mapping": {
  "modal-content": {
    "background-color": { "value": "{color.outline.variant.value}", "type": "color" },
    "border": { "radius": { "value": "{radius.base.value}", "type": "radius" } }
  },
  "arrow-button": {
    "icon": {
      "color": { "value": "{color.on-background.@.value}", "type": "color" }
    }
  }
} } }
```

---

## Markup Examples

```xml
<!-- Standard text (default, no variant) -->
<wm-text name="email_field" placeholder="Email" type="email" required="true" floatinglabel="Email address"></wm-text>

<!-- Filled with leading and trailing icons -->
<wm-text name="search_field" placeholder="Search" variant="filled" leadingiconclass="fa fa-search" trailingiconclass="fa fa-times" on-trailingiconclick="Widgets.search_field.datavalue = ''" hint="Enter product name or SKU"></wm-text>

<!-- Outlined with floating label -->
<wm-text name="name_field" placeholder="Full Name" variant="outlined" floatinglabel="Full Name" required="true"></wm-text>

<!-- Password field with trailing icon to toggle visibility -->
<wm-text name="password_field" placeholder="Password" type="password" variant="outlined" floatinglabel="Password" trailingiconclass="fa fa-eye" on-trailingiconclick="handler()"></wm-text>

<!-- Number with filled variant -->
<wm-number name="age_field" placeholder="Age" variant="filled" floatinglabel="Age" minvalue="0" maxvalue="120" step="1"></wm-number>

<!-- Currency with outlined variant -->
<wm-currency name="price_field" placeholder="0.00" currency="USD" variant="outlined" floatinglabel="Price" step="0.01"></wm-currency>

<!-- Select (no variant prop — uses form-controls token for appearance) -->
<wm-select name="country_field" dataset="bind:Variables.countries.dataSet" datafield="code" displayfield="name" placeholder="Select country" datavalue=""></wm-select>
```

---

## Rules

- `variant="filled"` renders a bottom-border-only M3 filled input with a surface background.
- `variant="outlined"` renders a full-border M3 outlined input with white background and rounded corners.
- Omitting `variant` uses the `standard` appearance (default WaveMaker style).
- `floatinglabel` and `hint` are independent — both can be set together.
- `leadingiconclass` and `trailingiconclass` are only valid on `wm-text`, not on `wm-number` or `wm-currency`.
- Token file for all four input types: `form-controls` (root key `"form-controls"`). Per-component extras: `currency` and `select`.
