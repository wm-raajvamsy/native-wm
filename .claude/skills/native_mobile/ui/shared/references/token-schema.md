---
name: token-schema
description: >
  Complete design token JSON schema: component name keys, file structure, token value format, allowed
  type values, per-component property structures (btn, container, label, list, picture, icon, rating),
  shorthand property support, state tokens, variant groups, widget style parts, and common token
  mistakes to avoid. Load whenever authoring or validating a tokens/**/*.json override file.
---

# Design Token Schema

## Component Names — folder vs. JSON root key

A component override is written to `components/<folder>/<folder>.json`. The design system loads it by
**path-matching** that file against the foundation component folder of the same name, then **deep-merging
by the JSON root key inside** the file. So TWO identifiers must both be correct — and they are NOT always
the same string:

- **Override folder + filename** = the foundation **folder name** (e.g. `button/button.json`). This is the path.
- **JSON root key inside the file** = the foundation file's **root key** (e.g. `btn`).

For most components these are identical. **For these 10 they differ — use the wrong one and the override is
a dead file the design system silently never reads:**

| Override folder / file (`components/<folder>/<folder>.json`) | JSON root key inside |
|---|---|
| `button/button.json` | `btn` |
| `cards/cards.json` | `card` |
| `dropdown-menu/dropdown-menu.json` | `dropdown` |
| `form-wrapper/form-wrapper.json` | `form` |
| `listtemplate/listtemplate.json` | `list-template` |
| `modal-dialog/modal-dialog.json` | `modal` |
| `page-content/page-content.json` | `page` |
| `page-left-nav/page-left-nav.json` | `left-panel` |
| `radioset/radioset.json` | `radiobutton` |
| `scrollbar/scrollbar.json` | `scroll` |

**Folder names** — use the foundation folder name for the override path. For every component NOT in the
table above, the folder name doubles as the root key: accordion, accordion-pane, anchor, audio, badge,
barcodescanner, bottomsheet, breadcrumb, button, button-group, calendar, camera, cards, carousel, checkbox,
checkboxset, chips, container, currency, datetime, dropdown-menu, fileupload, form-controls, form-wrapper,
grid-layout, icon, label, list, listtemplate, login, lottie, message, modal-dialog, nav, navbar, navitem,
page, page-content, page-left-nav, panel, panel-footer, partial-container, picture, popover, progress-bar,
progress-circle, radioset, rating, scrollbar, search, select, slider, spinner, switch, tabbar, tabs,
textarea, tile, toast, toggle, video, webview, wizard

## JSON Structure

The top-level key is the component's **root key** (the foundation prefix — see the table above), which is
NOT always the folder/file name. e.g. file `button/button.json` has root key `btn`.

```json
{
  "<root-key>": {
    "appearances": {
      "<appearance-name>": {
        "mapping": {
          "<token>": { "value": "<literal-or-reference>", "type": "<type>" },
          "states": {
            "<state>": {
              "<token>": { "value": "<literal-or-reference>", "type": "<type>" }
            }
          }
        },
        "variantGroups": {
          "<groupType>": {
            "<variant>": {
              "<token>": { "value": "<literal-or-reference>", "type": "<type>" },
              "states": {
                "<state>": {
                  "<token>": { "value": "<literal-or-reference>", "type": "<type>" }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

## Token Value Format

Each leaf token is an object with `value` and `type` keys:
```json
{ "value": "#7C4DFFff", "type": "color" }
{ "value": "16px", "type": "space" }
{ "value": "{space.4.value}", "type": "space" }
{ "value": "{radius.circle.value}", "type": "radius" }
{ "value": "600", "type": "font" }
```

### Allowed `type` Values (from actual foundation source)

| `type` | Used for |
|--------|----------|
| `color` | background, color, border.color, ripple.color, icon.color |
| `space` | padding, gap, height, min-width, icon.size, skeleton.*, border.width |
| `font` | font-size, font-family, font-weight, line-height, letter-spacing |
| `radius` | radius, border.radius, opacity, box-shadow, shadow, cursor, text-transform, text-decoration (catch-all) |
| `border` | border.width, border.style |

**NOTE**: There is NO `shadow` or `misc` type. Shadow uses `"type": "radius"`. Border-style and border-width use `"type": "border"`. Opacity, cursor, text-transform, text-decoration use `"type": "radius"`.

### Foundation Token References

When a design value matches a foundation token, prefer the reference syntax `{token.path.value}`. Override tokens resolve references because the codegen includes foundation tokens via Style Dictionary.

| Reference | Resolves To | When to Use |
|-----------|-------------|-------------|
| `{space.0.value}` | 0px | No spacing |
| `{space.1.value}` | 4px | Tight gap |
| `{space.2.value}` | 8px | Small gap |
| `{space.3.value}` | 12px | Medium gap |
| `{space.4.value}` | 16px | Standard gap |
| `{space.5.value}` | 20px | Medium-large gap |
| `{space.6.value}` | 24px | Large gap |
| `{space.8.value}` | 32px | Section gap |
| `{space.12.value}` | 48px | Major gap |
| `{radius.none.value}` | 0px | Sharp corners |
| `{radius.xs.value}` | 4px | Subtle rounding |
| `{radius.sm.value}` | 8px | Cards, buttons |
| `{radius.md.value}` | 12px | Medium rounding |
| `{radius.lg.value}` | 16px | Large rounding |
| `{radius.xl.value}` | 28px | Pill-ish shapes |
| `{radius.xxl.value}` | 32px | Full pill buttons |
| `{radius.pill.value}` | 1000px | Perfect pills |
| `{radius.circle.value}` | 1000px | Perfect circles |
| `{border.style.solid.value}` | solid | Solid borders |
| `{border.style.dotted.value}` | dotted | Dotted borders |
| `{border.style.dashed.value}` | dashed | Dashed borders |
| `{border.style.base.value}` | solid | Default border style |
| `{border.width.0.value}` | 0px | No border width |
| `{border.width.1.value}` | 1px | Thin border |
| `{border.width.2.value}` | 2px | Medium border |
| `{border.width.3.value}` | 3px | Thick border |
| `{border.width.base.value}` | 1px | Default border width |
| `{elevation.shadow.none.value}` | none | No shadow |
| `{elevation.shadow.1.value}` | subtle shadow | Card shadow |
| `{elevation.shadow.2.value}` | medium shadow | Elevated |
| `{elevation.shadow.3.value}` | prominent shadow | High elevation |
| `{box-shadow.none.value}` | none | No shadow (alt) |
| `{box-shadow.1.value}` | subtle shadow (rgba) | Card shadow (alt) |
| `{box-shadow.2.value}` | medium shadow (rgba) | Elevated (alt) |
| `{icon.size.xs.value}` | 12px | Extra-small icon |
| `{icon.size.sm.value}` | 18px | Small icon |
| `{icon.size.md.value}` | 24px | Medium icon |
| `{icon.size.lg.value}` | 30px | Large icon |
| `{icon.size.2x.value}` | 36px | 2x icon |
| `{font.weight.400.value}` | 400 | Normal weight |
| `{font.weight.500.value}` | 500 | Medium weight |
| `{font.weight.600.value}` | 600 | Semi-bold weight |
| `{font.weight.700.value}` | 700 | Bold weight |
| `{body.small.font-size.value}` | 12px | Small body text |
| `{body.medium.font-size.value}` | 14px | Medium body text |
| `{body.large.font-size.value}` | 16px | Large body text |
| `{label.small.font-size.value}` | 11px | Small label text |
| `{h4.font-size.value}` | 22px | Heading 4 |
| `{h3.font-size.value}` | 24px | Heading 3 |
| `{h2.font-size.value}` | 28px | Heading 2 |
| `{h1.font-size.value}` | 32px | Heading 1 |
| `{color.primary.@.value}` | #FF7250 | Primary color |
| `{color.on-primary.@.value}` | #FFFFFF | Text on primary |
| `{color.on-surface.@.value}` | #1D1B20 | Default text |
| `{color.on-surface.variant.@.value}` | #4F556D | Muted text |
| `{color.surface.@.value}` | #FFFFFF | White surface |
| `{color.warning.@.value}` | #ffae00 | Gold/warning |
| `{color.error.@.value}` | #EF3F3F | Error/danger |
| `{color.transparent.@.value}` | transparent | Transparent |
| `{color.border.@.value}` | outline.variant | Border color |
| `{color.outline.variant.value}` | #E4E4E4 | Outline (no `@`) |

**INVALID references — these tokens do NOT exist, NEVER use them:**
- ❌ `{border.style.none.value}` — does not exist
- ❌ `{border.radius.*.value}` — Use `{radius.*.value}` (no `border.` prefix)
- ❌ `{radius.0.value}` / `{radius.1.value}` / `{radius.2.value}` / `{radius.3.value}` — radius tokens are NAMED, not numeric. Use `none`/`xxs`/`xs`/`sm`/`md`/`lg`/`xl`/`xxl`/`pill`/`circle` (e.g. 8px → `{radius.sm.value}`, NOT `{radius.2.value}`). Only `space.*` and `border.width.*` use numeric indices.
- ❌ `{padding.*.value}` — Use `{space.*.value}` for padding values
- ❌ `{shadow.*.value}` — Use `{elevation.shadow.*.value}` or `{box-shadow.*.value}`

**⚠️ `border.style` NEVER accepts `"none"`.** Valid values are ONLY `"solid"`, `"dashed"`, or `"dotted"`. To express "no border", set `width` to `"{border.width.0.value}"` (0px) and `style` to `"solid"`.

When the design value does NOT match any foundation token, use a literal value (e.g., `"#7C4DFFff"`, `"30px"`, `"18px"`). Use `ff` alpha suffix on hex colors for full opacity (e.g., `"#7C4DFFff"`).

## Per-Component Property Structure

**CRITICAL** — Property paths are NOT universal. Each component has its own structure derived from the WaveMaker foundation. Using the wrong path produces CSS variables the component doesn't read, causing silent failures.

### Property Structure Reference (from actual foundation source)

#### `btn` — override file `components/button/button.json`, JSON root key `btn`
```json
"background": { "value": "#7C4DFFff", "type": "color" },
"color": { "value": "#FFFFFFff", "type": "color" },
"radius": { "value": "{radius.sm.value}", "type": "radius" },
"border": {
  "width": { "value": "{border.width.0.value}", "type": "border" },
  "style": { "value": "solid", "type": "border" },
  "color": { "value": "{color.transparent.@.value}", "type": "color" }
},
"shadow": { "value": "none", "type": "radius" },
"padding": { "value": "{space.0.value} {space.6.value}", "type": "space" },
"min-height": { "value": "40px", "type": "space" },
"min-width": { "value": "40px", "type": "space" },
"font-size": { "value": "16px", "type": "font" },
"font-weight": { "value": "600", "type": "font" },
"text-transform": { "value": "none", "type": "radius" },
"icon": {
  "size": { "value": "{icon.size.md.value}", "type": "space" },
  "color": { "value": "#FFFFFFff", "type": "color" }
},
"gap": { "value": "{space.2.value}", "type": "space" }
```
- `background` is FLAT (not `background.color`)
- `radius` is a SIBLING of `border` (not `border.radius`) — `border` holds ONLY `width`, `style`, `color`
- the height key is `min-height` and the width key is `min-width` — `btn` has NO `height` or `width` key. For a full-width button, set the markup `width="100%"` attribute, NOT a token.
- typography is FLAT: `font-size`, `font-weight`, `font-family`, `line-height`, `letter-spacing` (there is NO `font` object — never write `font.size` or a `font` node)
- `shadow` (not `box-shadow`)
- `icon.size` and `icon.color` (nested under `icon`)

#### `container`
```json
"background": {
  "color": { "value": "#FFFFFFff", "type": "color" }
},
"border": {
  "style": { "value": "{border.style.solid.value}", "type": "border" },
  "width": { "value": "{border.width.1.value}", "type": "border" },
  "color": { "value": "#E8E8E8ff", "type": "color" },
  "radius": { "value": "{radius.pill.value}", "type": "radius" }
},
"box-shadow": { "value": "{elevation.shadow.none.value}", "type": "radius" },
"padding": { "value": "{space.4.value}", "type": "space" },
"opacity": { "value": "1", "type": "radius" }
```
- `background.color` NESTED
- `border.radius` INSIDE border
- `box-shadow` (not `shadow`)
- NO `width` / `height` key — size a container via its markup `width`/`height` attributes, never a token override

#### `label`
```json
"color": { "value": "#1A1A1Aff", "type": "color" },
"font-size": { "value": "18px", "type": "font" },
"font-weight": { "value": "600", "type": "font" },
"font-family": { "value": "{body.medium.font-family.value}", "type": "font" },
"line-height": { "value": "22px", "type": "font" },
"letter-spacing": { "value": "{body.medium.letter-spacing.value}", "type": "font" },
"text": {
  "decoration": { "value": "none", "type": "radius" }
},
"background-color": { "value": "none", "type": "color" },
"border": {
  "radius": { "value": "{border.width.0.value}", "type": "radius" },
  "width": { "value": "{border.width.0.value}", "type": "space" },
  "style": { "value": "{border.style.base.value}", "type": "radius" },
  "color": { "value": "{color.primary.@.value}", "type": "color" }
},
"padding": { "value": "{space.0.value}", "type": "space" }
```
- `background-color` FLAT KEY (not `background` or `background.color`)
- typography is FLAT — `font-size`, `font-weight`, `font-family`, `line-height`, `letter-spacing`. There is NO `font` object — never write a `font` node (`font.size` / `font.weight`)
- `border.radius` INSIDE border
- `padding` uses SHORTHAND (same as other components)
- `text.decoration` for underline/line-through/none (CSS variable: `--wm-label-text-decoration`)

#### `list`
```json
"background": {
  "color": { "value": "{color.transparent.@.value}", "type": "color" }
},
"border": {
  "style": { "value": "{border.style.base.value}", "type": "border" },
  "width": { "value": "{border.width.0.value}", "type": "border" },
  "color": { "value": "{color.transparent.@.value}", "type": "color" },
  "radius": { "value": "{radius.none.value}", "type": "radius" }
},
"padding": { "value": "{space.0.value}", "type": "space" }
```
- `background.color` NESTED (same as container)
- `border.radius` INSIDE border
- **⚠️ `item.*` sub-part tokens DO NOT WORK in React Native** — see "List `item.*` Token Limitation" section below. Only ROOT-level properties (`background`, `border`, `padding`) are effective.

#### `picture`
```json
"background": { "value": "{color.transparent.@.value}", "type": "color" },
"radius": { "value": "{radius.none.value}", "type": "radius" },
"border": {
  "color": { "value": "{color.border.@.value}", "type": "color" },
  "style": { "value": "{border.style.base.value}", "type": "border" },
  "width": { "value": "{border.width.0.value}", "type": "border" }
},
"padding": { "value": "{space.0.value}", "type": "space" }
```
- `background` is FLAT (like button)
- `radius` is a SIBLING of `border` (like button, NOT `border.radius`)

#### `icon`
```json
"color": { "value": "{color.on-background.@.value}", "type": "color" },
"font-size": { "value": "{icon.size.@.value}", "type": "font" },
"min-width": { "value": "{icon.size.@.value}", "type": "space" },
"height": { "value": "{icon.size.@.value}", "type": "space" }
```
- Icon size uses `font-size` (NOT bare `size`, `icon-size`, or `icon.size` — all three are rejected on the `icon` component)
- No background property

#### `rating`
```json
"padding": { "value": "{space.2.value}", "type": "space" },
"opacity": { "value": "1", "type": "radius" },
"icon": {
  "color": { "value": "{color.on-surface.@.value}", "type": "color" },
  "size": { "value": "32px", "type": "space" }
},
"text": {
  "size": { "value": "32px", "type": "space" },
  "color": { "value": "{color.warning.@.value}", "type": "color" }
},
"states": {
  "active": {
    "icon": {
      "color": { "value": "{color.warning.@.value}", "type": "color" },
      "size": { "value": "32px", "type": "space" }
    }
  }
}
```
- **Unselected/inactive star color**: `icon.color` (default: dark `{color.on-surface.@.value}`)
- **Selected/active star color**: `states.active.icon.color` (default: gold `{color.warning.@.value}`)
- **Star size**: `icon.size` (both active and inactive)
- **Caption text color**: `text.color`
- ❌ **`activeStar.color` and `inactiveStar.color` DO NOT EXIST** — never use these
- To make inactive stars light gray (common pattern), override `icon.color`
- To change filled star color, override `states.active.icon.color`

#### `form-controls` (input widgets: text, number, textarea, select, etc.)
Root key is `"form-controls"`. **All styling goes under `appearances["variant"].mapping` — never the base `mapping`.** Apply each variant to its `wm-form-field` / `wm-text` via BOTH `variant` and `class="form-controls-<variant>"`.
```json
"min-height": { "value": "48px", "type": "space" },
"padding": { "value": "{space.2.value} {space.3.value}", "type": "space" },
"background": { "value": "#FFFFFFff", "type": "color" },
"color": { "value": "#1A1A1Aff", "type": "color" },
"font": {
  "size": { "value": "16px", "type": "font" },
  "weight": { "value": "400", "type": "font" },
  "family": { "value": "Inter", "type": "font" }
},
"border": {
  "color": { "value": "#E8E8E8ff", "type": "color" },
  "radius": { "value": "{radius.sm.value}", "type": "radius" },
  "style": { "value": "solid", "type": "style" },
  "width": { "value": "{border.width.1.value}", "type": "space" }
},
"placeholder": {
  "color": { "value": "#9AA0A6ff", "type": "color" }
},
"label": {
  "color": { "value": "#1A1A1Aff", "type": "color" },
  "font": {
    "size": { "value": "14px", "type": "font" },
    "weight": { "value": "500", "type": "font" }
  }
}
```
- typography is **NESTED**: `font.size`, `font.weight`, `font.family` — NEVER flat `font-size`/`font-weight`/`font-family`.
- the label's typography is likewise nested: `label.font.size`, `label.font.weight`, `label.font.family` — NEVER `label.font-size`.
- the input itself IS the root — `background`, `color`, `border.*`, `padding` style the input; there is NO `input.*` part.
- `border.radius` is NESTED inside `border` (NOT a top-level `radius`).
- ⚠️ form-controls border `type` values differ from the general "Allowed type Values" table: `border.style` uses `"type": "style"` and `border.width` uses `"type": "space"` (NOT `"border"`).
- height is `min-height` (there is no `height` key).
- focus / disabled / error styling lives under `states.{focused,disabled,error}`; floating-label styling under `floating.*`. See `form-tokens` for the complete states/floating structure.
- ❌ NO `text-align` — `form-controls` has no `text-align` key; emitting it fails validation.

### Quick Lookup: Which structure does each component use?

| Property | `btn` | `container` | `label` | `list` | `picture` | `icon` | `rating` |
|----------|-------|-------------|---------|--------|-----------|--------|----------|
| bg color | `background` | `background.color` | `background-color` | `background.color` | `background` | — | — |
| radius | `radius` | `border.radius` | `border.radius` | `border.radius` | `radius` | — | — |
| shadow | `shadow` | `box-shadow` | — | — | — | — | — |
| padding | shorthand | shorthand | shorthand | shorthand | shorthand | — | shorthand |
| icon size | `icon.size` | — | — | — | — | `font-size` | `icon.size` |
| bg type | `color` | `color` | `color` | `color` | `color` | — | — |
| radius type | `radius` | `radius` | `radius` | `radius` | `radius` | — | — |
| shadow type | `radius` | `radius` | — | — | — | — | — |

### Common Token Shapes (canonical syntax)

Canonical path, `type`, and example syntax for each property. **Paths are NOT universal** — they differ per component (typography is flat `font-size` on some, nested `font.size` on others; not every component has a `height` key). Confirm the exact path in the component's block above before emitting; if a property is absent from that component's structure, drop the value rather than invent or borrow a path from another component. The validator rejects any `mapping.<path>` not present in the component's base mapping.

| Visual Property | Canonical path | Example |
|----------------|------------|---------|
| Text / foreground color | `color` | `"color": { "value": "#1A1A1Aff", "type": "color" }` |
| Border color | `border.color` | `"border": { "color": { "value": "#E8E8E8ff", "type": "color" } }` |
| Border width | `border.width` | `"border": { "width": { "value": "{border.width.1.value}", "type": "border" } }` — supports shorthand: `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` for single-side borders |
| Border style | `border.style` | `"border": { "style": { "value": "solid", "type": "border" } }` — valid values: `"solid"`, `"dashed"`, `"dotted"` ONLY. **Never `"none"`** — use `width: 0` instead |
| Font size | `font-size` (flat) **or** `font.size` (nested) | FLAT on `btn`/`label`/most components; nested under a `font` object ONLY on input components (`form-controls`, etc.). `"font-size": { "value": "16px", "type": "font" }` |
| Font weight | `font-weight` (flat) **or** `font.weight` (nested) | `"font-weight": { "value": "600", "type": "font" }` |
| Font family | `font-family` (flat) **or** `font.family` (nested) | `"font-family": { "value": "Inter", "type": "font" }` |
| Line height | `line-height` | `"line-height": { "value": "24px", "type": "font" }` |
| Letter spacing | `letter-spacing` | `"letter-spacing": { "value": "0.5px", "type": "font" }` |
| Text transform | `text-transform` (flat) **or** `text.transform` (nested) | `"text-transform": { "value": "none", "type": "radius" }` |
| Text decoration | `text.decoration` | `"text": { "decoration": { "value": "underline", "type": "radius" } }` — values: `none`, `underline`, `line-through` |
| Min width | `min-width` | `"min-width": { "value": "40px", "type": "space" }` |
| Min height | `min-height` | `"min-height": { "value": "40px", "type": "space" }` — many components expose height as `min-height`, not `height` |
| Height | `height` | `"height": { "value": "40px", "type": "space" }` — not every component has a height key; some are sized only via markup attributes |
| Gap | `gap` | `"gap": { "value": "{space.2.value}", "type": "space" }` |
| Opacity | `opacity` | `"opacity": { "value": "1", "type": "radius" }` |
| Cursor | `cursor` | `"cursor": { "value": "pointer", "type": "radius" }` |

## Nested Properties — Full Examples

### Border (groups color, width, style, and radius together)
```json
"border": {
  "style": { "value": "{border.style.solid.value}", "type": "border" },
  "width": { "value": "{border.width.1.value}", "type": "border" },
  "color": { "value": "#E8E8E8ff", "type": "color" },
  "radius": { "value": "{radius.pill.value}", "type": "radius" }
}
```

### Border (no border — full override for embedded widgets)
```json
"border": {
  "style": { "value": "{border.style.solid.value}", "type": "border" },
  "width": { "value": "{border.width.0.value}", "type": "border" },
  "color": { "value": "{color.transparent.@.value}", "type": "color" },
  "radius": { "value": "{radius.none.value}", "type": "radius" }
}
```

## Shorthand Property Support

**`padding`, `margin`, `border.width`, and `border.radius` ALL support CSS shorthand values.** Use shorthand format — NEVER use longhand (per-side sub-properties like `padding.top`, `padding.left`, `border.width.top`, etc.).

Shorthand formats (same as CSS):
- **1 value** — all sides: `"16px"` or `"{space.4.value}"`
- **2 values** — vertical horizontal: `"4px 8px"` or `"{space.1.value} {space.2.value}"`
- **4 values** — top right bottom left: `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` or `"{space.0.value} {space.0.value} {space.1.value} {space.0.value}"`

You can mix foundation token references and literal values in the same shorthand string.

### Padding — shorthand (all sides equal)
```json
"padding": { "value": "{space.4.value}", "type": "space" }
```

### Padding — shorthand (vertical/horizontal differ)
```json
"padding": { "value": "{space.1.value} {space.2.value}", "type": "space" }
```

### Padding — shorthand (all sides differ)
```json
"padding": { "value": "{space.2.value} {space.4.value} {space.2.value} {space.4.value}", "type": "space" }
```

### Border Width — shorthand (all sides equal)
```json
"border": {
  "width": { "value": "{border.width.1.value}", "type": "border" }
}
```

### Border Width — shorthand (bottom-only border)
When the design shows a border on only ONE side (e.g., bottom border on a text label), use 4-value shorthand with `0px` for the sides without a border:
```json
"border": {
  "width": { "value": "{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}", "type": "border" },
  "style": { "value": "{border.style.solid.value}", "type": "border" },
  "color": { "value": "{color.primary.@.value}", "type": "color" }
}
```
⚠️ **CRITICAL**: If the design shows a border on only one side, do NOT set `border.width` to `0` or `{border.width.0.value}`. That removes ALL borders. Use shorthand: `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` (bottom only), `"{border.width.0.value} {border.width.0.value} {border.width.0.value} {border.width.1.value}"` (left only), `"{border.width.1.value} {border.width.0.value} {border.width.0.value} {border.width.0.value}"` (top only), `"{border.width.0.value} {border.width.1.value} {border.width.0.value} {border.width.0.value}"` (right only).

### Border Radius — shorthand (all corners equal)
```json
"border": {
  "radius": { "value": "{radius.sm.value}", "type": "radius" }
}
```

### Border Radius — shorthand (top corners only)
```json
"border": {
  "radius": { "value": "{radius.sm.value} {radius.sm.value} {radius.none.value} {radius.none.value}", "type": "radius" }
}
```

### Border Radius — shorthand (per-corner — top-left top-right bottom-right bottom-left)
```json
"border": {
  "radius": { "value": "12px 12px 0px 0px", "type": "radius" }
}
```

### Background (container/list — nested)
```json
"background": {
  "color": { "value": "#7C4DFFff", "type": "color" }
}
```

### Background (button/picture — flat)
```json
"background": { "value": "#7C4DFFff", "type": "color" }
```

### Background (label — unique key)
```json
"background-color": { "value": "#7C4DFFff", "type": "color" }
```

## States

Include only states visible in the design: disabled, hover, focus, pressed, active, selected, checked, error, loading.

## Variant Groups

Common groups: size (sm/md/lg), status (primary/secondary/destructive), density (compact/cozy), emphasis (subtle/strong).

## Widget Style Parts

Tokens target specific **parts** of a widget. Use dot notation for part-specific tokens:

| Widget | Parts | Token prefix examples |
|--------|-------|-----------------------|
| `btn` (file `button/button.json`) | root, text, icon | `background` (root), `color` (text), `icon.size` |
| `label` | root, text | `background-color`, `color`, `font-size`, `text.decoration` (nested under `text`) |
| `cards` (root key `card`) | root, header | `background`, `border.radius`, `padding`, `shadow`, `header.background-color`, `header.padding` — *(no `title`/`subheading`/`content`/`footer` parts)* |
| `list` | root only (⚠️ `item.*` broken in RN) | ROOT tokens only: `background.color`, `padding`. **`item.*` tokens have NO EFFECT** — see limitation section below |
| `tabs` | root, heading, item.heading, states.active.item.heading | `item.heading.text.color`, `item.heading.icon.color`, `item.heading.indicator.background`, `states.active.item.heading.text.color` — *(not `tabItem`/`activeTabItem`)* |
| `accordion` | root, header, text, title (pane content = separate `accordion-pane`) | `header.background-color`, `text.color`, `title.icon.color`, `states.active.header.background-color`; `accordion-pane`: `content.background-color`, `content.padding` |
| `panel` | root, heading, description (footer = separate `panel-footer`) | `heading.background`, `heading.text.color`, `heading.font-size`, `description.color` — *(not `header`/`content`/`footer`)* |
| `form-controls` | root (the input), label, floating, placeholder | root `background`, `border.color`, `color`, `padding`; `label.color`, `placeholder.color`, `floating.color` — *(input styling is at ROOT; no `input.*` part)* |
| `select` | arrow-button (background-color, icon, border), modal-content, modal-text, check | `arrow-button.background-color`, `arrow-button.icon.color`, `modal-content.background-color` |
| `checkbox` | root (height, width, background.color, icon, border), label, states.checked, states.disabled | `border.color`, `icon.color`, `states.checked.background.color`, `states.checked.icon.color` |
| `radioset` (root key: `"radiobutton"`) | root (size, color.@, indicator, border), label, title, set.item, states.checked, states.disabled | `border.color`, `color.@`, `states.checked.color.@`, `states.checked.border.color` |
| `toggle` | root (width, height, background.color, border), handle (color, width, height, radius, margin), states.on, states.disabled | `background.color`, `handle.color`, `states.on.background.color`, `states.on.handle.color` |
| `switch` | button (background.color, font, text.transform, height, color, border, padding, ripple), states.selected.button, states.disabled | `button.background.color`, `button.color`, `states.selected.button.background.color` |
| `currency` | labelwrapper (background, border.radius, padding, width, min.height), label (color, font) | `labelwrapper.background`, `label.color`, `label.font.size` |
| `rating` | root, icon (inactive stars), states.active.icon (filled stars), text (caption) | `icon.color` (inactive), `states.active.icon.color` (filled), `icon.size` |
| `search` | root, text (the input), placeholder.text, btn.icon, clear-btn.icon | `text.background.color`, `text.color`, `placeholder.text.color`, `border.color`, `btn.icon.color` — *(no `input.*`; the input is the `text.*` part)* |
| `chips` | root (background-color, color), item, list, states.active | `background-color` (chip bg), `color` (chip text), `item.border.color`, `states.active.background-color`, `states.active.color` — *(no `chip.*`/`chipText.*`)* |
| `progress-bar` | root | `background.active` (fill), `background.inactive` (track), `height`, `radius` — *(no `track.*`/`fill.*`)* |
| `progress-circle` | root, stroke, sub-title | `stroke.active` (fill), `stroke.inactive` (track), `sub-title.color`, `sub-title.font.size` — *(no `fill.*`/`track.*`/`text.*`)* |
| `spinner` | root, icon, text | `icon.color`, `icon.size`, `text.color` — *(`icon.size`, not `icon-size`)* |
| `message` | root, container, text, title, icon | `container.background`, `text.color`, `title.color`, `icon.size`, `color` — *(root bg is `container.background`; icon has `size` only)* |
| `modal-dialog` (root key `modal`) | root, header, body, footer, title, btn.ok, btn.cancel | `header.background`, `body.padding`, `footer.padding`, `title.color`, `btn.ok.background` — *(content→`body.*`; `header.background` is flat)* |

**Part token syntax in JSON:**
```json
{
  "title": {
    "color": { "value": "#212121ff", "type": "color" },
    "font-size": { "value": "18px", "type": "font" }
  },
  "footer": {
    "background": {
      "color": { "value": "#f5f5f5ff", "type": "color" }
    }
  }
}
```

## Complete Example — Full Appearance

```json
{
  "container": {
    "appearances": {
      "pill-row": {
        "mapping": {
          "background": {
            "color": { "value": "#FFFFFFff", "type": "color" }
          },
          "border": {
            "style": { "value": "{border.style.solid.value}", "type": "border" },
            "width": { "value": "{border.width.1.value}", "type": "border" },
            "color": { "value": "#E8E8E8ff", "type": "color" },
            "radius": { "value": "{radius.pill.value}", "type": "radius" }
          },
          "padding": { "value": "14px 20px", "type": "space" }
        }
      }
    }
  }
}
```

```json
{
  "btn": {
    "appearances": {
      "circle-accent": {
        "mapping": {
          "background": { "value": "#7C4DFFff", "type": "color" },
          "color": { "value": "#FFFFFFff", "type": "color" },
          "radius": { "value": "{radius.circle.value}", "type": "radius" },
          "border": {
            "width": { "value": "{border.width.0.value}", "type": "border" },
            "style": { "value": "{border.style.solid.value}", "type": "border" },
            "color": { "value": "{color.transparent.@.value}", "type": "color" }
          },
          "height": { "value": "36px", "type": "space" },
          "min-width": { "value": "36px", "type": "space" },
          "icon": {
            "size": { "value": "14px", "type": "space" }
          },
          "padding": { "value": "{space.0.value}", "type": "space" }
        }
      }
    }
  }
}
```

## Widget Default Overrides

For the complete per-widget defaults table (list, button, search, label, select, card, rating, etc.), see `widget-defaults.md`. When generating tokens, check each widget against the design and override any defaults that don't match.

### CRITICAL: Flat List Override Template

When a list is used for flat/clean layouts (filter pills, message threads, promo cards, thumbnail rows — any list where items should NOT look like cards), style the list ROOT and the `wm-listtemplate` component.

#### Step 1: List component token (`tokens/list/list.json`)

Override ROOT-level properties only (these DO work):

```json
{
  "background": {
    "color": { "value": "{color.transparent.@.value}", "type": "color" }
  },
  "border": {
    "width": { "value": "{border.width.0.value}", "type": "border" },
    "style": { "value": "{border.style.solid.value}", "type": "border" },
    "color": { "value": "{color.transparent.@.value}", "type": "color" },
    "radius": { "value": "{radius.none.value}", "type": "radius" }
  },
  "padding": { "value": "{space.0.value}", "type": "space" }
}
```

**DO NOT add `item.*` tokens** — they are silently ignored in React Native.

#### Step 2: List template token (`tokens/listtemplate/listtemplate.json`, root key `list-template`)

Generate a flat appearance for the list template to neutralize its white background. This is the PRIMARY mechanism for making flat lists work:

```json
{
  "list-template": {
    "appearances": {
      "flat": {
        "mapping": {
          "background": {
            "color": { "value": "{color.transparent.@.value}", "type": "color" }
          }
        }
      }
    }
  }
}
```

#### Step 3: Add class/variant to `wm-listtemplate` in markup

Every `wm-listtemplate` in a flat list MUST have `class` and `variant` attributes:
```xml
<wm-listtemplate name="tmpl" class="list-template-flat" variant="flat">
```

**When to use this template:** Almost always! The majority of designs use clean/flat lists. Only SKIP this template when the design explicitly shows card-like list items with visible shadows, borders, and backgrounds per item.

**What about the item wrapper defaults (shadow, white bg, borderRadius, padding)?** These come from the `wm-list` component's hardcoded `item` styles. Because `item.*` tokens don't work in RN, these defaults persist. The `list-template` transparent background helps by making the inner content visually dominant. For most designs, styling the template content (via containers/labels inside the template) is sufficient. The item wrapper's 4px padding and 6px borderRadius are usually subtle enough to be acceptable.

### CRITICAL: Inline Select Complete Override Template

When a `wm-select` is embedded inside a styled container (like a pill selector row), always generate ALL of these tokens to fully neutralize the select's defaults:

```json
{
  "min-width": { "value": "{space.0.value}", "type": "space" },
  "background": {
    "color": { "value": "{color.transparent.@.value}", "type": "color" }
  },
  "border": {
    "width": { "value": "{border.width.0.value}", "type": "border" },
    "style": { "value": "{border.style.solid.value}", "type": "border" },
    "color": { "value": "{color.transparent.@.value}", "type": "color" },
    "radius": { "value": "{radius.none.value}", "type": "radius" }
  },
  "padding": { "value": "{space.0.value}", "type": "space" },
  "arrow-button": {
    "background-color": { "value": "{color.transparent.@.value}", "type": "color" },
    "padding": { "value": "{space.0.value}", "type": "space" },
    "border-width": { "value": "{border.width.0.value}", "type": "border" },
    "border-style": { "value": "{border.style.solid.value}", "type": "border" },
    "border-color": { "value": "{color.transparent.@.value}", "type": "color" }
  }
}
```

## Rules

- Every leaf token has `value` AND `type` keys
- `type` must be one of: `color`, `space`, `font`, `radius`, `border` (no `shadow`, no `misc`)
- Values are either literal CSS values or foundation references (`{token.path.value}`)
- Prefer foundation token references when the value matches a foundation token
- Use 8-digit hex colors with `ff` alpha suffix for full opacity (e.g., `"#7C4DFFff"`)
- `background` and `radius` paths **depend on the component** — use the per-component table above. `btn`/`picture`: flat `background`, sibling `radius`. `container`/`list`: nested `background.color`, nested `border.radius`. `label`: `background-color`. NEVER assume one rule applies everywhere.
- `shadow` is `box-shadow` for container/list, `shadow` for btn/picture
- No meta, no selectors — only appearances
- No linear gradients
- Use px for sizes, CSS keywords where evident (none, solid, pointer)
- Appearance names should be descriptive (filled, outlined, ghost) — not "1", "2"
- Button: the override file is `button/button.json` (folder + filename `button`); the JSON **root key inside** is `btn`, not `button`. This folder≠root-key split applies to 10 components — see the table in **Component Names** (cards→card, modal-dialog→modal, dropdown-menu→dropdown, form-wrapper→form, radioset→radiobutton, listtemplate→list-template, page-content→page, page-left-nav→left-panel, scrollbar→scroll)
- When a design has sub-part styling (e.g., card title color differs from body), use part-prefixed tokens
- Root-level tokens (no prefix) apply to the widget's root/container part
- **Always check the Widget Default Overrides Checklist above** before writing tokens
- **Use shorthand for `padding`, `margin`, `border.width`, and `border.radius`** — NEVER use longhand sub-properties (`padding.top`, `padding.left`, etc.). Use CSS shorthand: 1 value (all sides), 2 values (vertical horizontal), or 4 values (top right bottom left). For single-side borders, use `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` — NOT `border.width: 0`.

## Common Token Mistakes

| Wrong | Right | Why |
|-------|-------|-----|
| `{ "value": "#FF0000" }` (no type) | `{ "value": "#FF0000ff", "type": "color" }` | Need `type`; add `ff` alpha |
| `"type": "shadow"` | `"type": "radius"` | No shadow type; use radius |
| `"type": "misc"` | `"type": "radius"` or `"border"` | No misc type exists |
| `"background": { "value": "#7C4DFF" }` (for container) | `"background": { "color": { "value": "#7C4DFFff", "type": "color" } }` | Container nests under `.color` |
| `"radius": { "value": "30px" }` (for container) | `"border": { "radius": { "value": "30px", "type": "radius" } }` | Container nests radius in border |
| `"shadow": { "value": "..." }` (for container) | `"box-shadow": { "value": "...", "type": "radius" }` | Container uses `box-shadow` |
| `"activeStar.color"` | `"states": { "active": { "icon": { "color": ... } } }` | Rating uses states path |
| Folder `components/btn/btn.json` | Folder `components/button/button.json` (root key still `btn`) | Override path = foundation **folder** `button`; a `btn/` folder is a dead path never read. Folder ≠ root key for 10 components — see **Component Names** |
| Root key `"button"` | Root key `"btn"` | Buttons use `btn` prefix |
| `{ "btn": { "x": { "mapping": ... } } }` | `{ "btn": { "appearances": { "x": { "mapping": ... } } } }` | Missing `appearances` level |
| `"border.color": { "value": "..." }` | `"border": { "color": { "value": "..." } }` | Must be nested object |
| `"font.size"` / `"font.weight"` / `"min.height"` (dotted) where the base key is hyphenated | `"font-size"` / `"font-weight"` / `"min-height"` (verbatim hyphenated key) | A `.` is a NESTING separator — `font.size` builds a non-existent `font` object. These are single hyphenated keys; write them as-is. (Only input components like `form-controls` truly nest as `font.size`.) |
| `"border.radius"` on `btn` / `picture` | top-level `"radius"` | btn/picture have no nested `border.radius`; radius is a top-level sibling of `border` |
| `"width"` on `btn` | `"min-width"` (+ markup `width="100%"` for full-width) | `btn` has `min-width`, no `width` key |
| `"text.align"` on `label` | (drop it) | label has no `text-align`/`text.align` key — it cannot be text-aligned via tokens |
| `"size"` on the `icon` component | `"font-size"` | icon sizes via `font-size`, not `size`/`icon.size` |
| `"border": { "width": { "value": "{border.width.0.value}" } }` (design has bottom-only border) | `"border": { "width": { "value": "{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}" } }` | `0` removes ALL borders; use shorthand for single-side borders |
| `"padding": { "top": {...}, "bottom": {...}, "left": {...}, "right": {...} }` | `"padding": { "value": "14px 20px", "type": "space" }` | Longhand padding removed; use shorthand (1, 2, or 4 values) |
| `"border": { "radius": { "value": "{radius.none.value}" } }` (design has top-only rounding) | `"border": { "radius": { "value": "{radius.sm.value} {radius.sm.value} 0px 0px" } }` | Use shorthand for per-corner radius |
