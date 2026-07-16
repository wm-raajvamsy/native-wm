---
name: form-tokens
description: >
  Form component token schema: mandatory global-token-first rule, full JSON property structure for
  form-wrapper/form-wrapper.json (root key "form") covering background, border, padding, radius, and
  shadow, and form-controls/form-controls.json (root key "form-controls") covering label, input, error,
  placeholder, and focus-ring tokens. Includes complete override examples and critical validation
  footnotes. Load when generating or validating token overrides for any wm-form or form-control widget.
---

# Form Token Schema

Property structure reference for the two form token files, derived from the canonical WaveMaker Foundation CSS source. Follow this exactly — wrong property paths or types produce CSS variables the component never reads.

## MANDATORY: Global Token First — Static Value Last

**Every token value MUST use a global foundation token reference when one exists.** Static/literal values are the LAST RESORT, used ONLY when no matching global token exists (e.g., custom hex colors, non-standard sizes outside the scale).

**Before writing ANY value**, check these scales:
- `transparent` → `{color.transparent.@.value}` (NEVER literal `"transparent"`)
- `solid` → `{border.style.solid.value}` or `{border.style.base.value}` (NEVER literal `"solid"`)
- no border -> set `border.width` to `{border.width.0.value}` and keep `border.style` as `{border.style.solid.value}` (NEVER `"none"` - it is invalid on mobile and `{border.style.none.value}` does not exist)
- `0px` → `{space.0.value}` or `{border.width.0.value}` depending on context
- `1px` border → `{border.width.1.value}`, `2px` → `{border.width.2.value}`
- Spacing: `4px`→`{space.1.value}`, `8px`→`{space.2.value}`, `12px`→`{space.3.value}`, `16px`→`{space.4.value}`, etc.
- Radius: `4px`→`{radius.xs.value}`, `8px`→`{radius.sm.value}`, `12px`→`{radius.md.value}`, etc.
- Colors: check `{color.primary.@.value}`, `{color.error.@.value}`, `{color.on-surface.@.value}`, `{color.outline.variant.value}`, etc.
- Font size: `12px`→`{body.small.font-size.value}`, `14px`→`{body.medium.font-size.value}`, `16px`→`{body.large.font-size.value}`
- Font weight: `{font.weight.400.value}`, `{font.weight.500.value}`, `{font.weight.600.value}`, `{font.weight.700.value}`

Use literal values ONLY when no foundation token matches (custom hex colors, non-standard sizes).

**Shorthand support**: `padding`, `border.width`, and `border.radius` support CSS shorthand values (1, 2, or 4 values). For single-side borders use `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` (bottom only). NEVER use longhand sub-properties like `padding.top`, `padding.left`.

---

## How form-controls tokens reach every input widget

Each input widget component (`text`, `number`, `textarea`, `select`, `currency`, `datetime`, `search`) reads the `app-input` style from the theme at render time and merges it into its own styles. The `form-controls/form-controls.json` token file targets exactly this `app-input` style slot — that is what `meta.mapping.selector.mobile: ".app-input"` means in the canonical source.

**Consequence: ONE `form-controls.json` file styles ALL form input widgets simultaneously.** You never need per-widget token files (`text/text.json`, `number/number.json`, `select/select.json`) to style inputs inside a `<wm-form>`. Those per-widget files only apply to standalone widgets used outside forms.

`checkbox`, `checkboxset`, `radioset`, `toggle`, and `switch` do not use the `app-input` slot — they are not text-input-chrome widgets. Additionally, `select` and `currency` have parts (dropdown button, modal, currency label wrapper) that are NOT reached by `form-controls` tokens. For all these widgets, generate a per-widget token file with a matching variant to override the parts that `form-controls` cannot reach. See the "Widget-Specific Token Overrides Inside Forms" section in SKILL.md for the full rule, dual-class pattern, and affected widget list.

---

## `form-wrapper/form-wrapper.json` — root key `"form"`

Controls the form shell: outer container, header (title + subtitle), body (field area), footer (action area).

> **Login pages:** the form's outer padding/chrome on a `wm-login` page is controlled by the **`login`** token (a `login` variant — `form.padding`, `error.*`), NOT by `form-wrapper`. The login form has a built-in 36px inset that only the `login` token removes. See `login-widget`.

**Override mechanism: `appearances`.** The `<wm-form>` takes a `variant` attribute. Write only the properties that differ from defaults inside `appearances["variant-name"].mapping`. Never write `meta` — that is internal to the canonical file.

### Property structure (inside `appearances["name"].mapping`)

```json
"background": { "value": "...", "type": "color" },
"padding": { "value": "...", "type": "space" },
"border": {
  "radius": { "value": "...", "type": "radius" },
  "width":  { "value": "...", "type": "space" },
  "style":  { "value": "...", "type": "radius" },
  "color":  { "value": "...", "type": "color" }
},
"header": {
  "background": { "value": "...", "type": "color" },
  "padding": {
    "vertical":   { "value": "...", "type": "space" },
    "horizontal": { "value": "...", "type": "space" }
  },
  "border": {
    "color":  { "value": "...", "type": "color" },
    "radius": { "value": "...", "type": "radius" },
    "style":  { "value": "...", "type": "radius" },
    "width":  { "value": "...", "type": "space" }
  },
  "title": {
    "color": { "value": "...", "type": "color" },
    "font": {
      "size":   { "value": "...", "type": "font" },
      "weight": { "value": "...", "type": "font" },
      "family": { "value": "...", "type": "font" }
    },
    "margin": {
      "vertical":   { "value": "...", "type": "space" },
      "horizontal": { "value": "...", "type": "space" }
    }
  },
  "sub-title": {
    "color": { "value": "...", "type": "color" },
    "font": {
      "size":   { "value": "...", "type": "font" },
      "weight": { "value": "...", "type": "font" },
      "family": { "value": "...", "type": "font" }
    },
    "margin": {
      "vertical":   { "value": "...", "type": "space" },
      "horizontal": { "value": "...", "type": "space" }
    }
  }
},
"body": {
  "background": { "value": "...", "type": "color" },
  "padding": {
    "vertical":   { "value": "...", "type": "space" },
    "horizontal": { "value": "...", "type": "space" }
  },
  "border": {
    "color":  { "value": "...", "type": "color" },
    "radius": { "value": "...", "type": "radius" },
    "style":  { "value": "...", "type": "radius" },
    "width":  { "value": "...", "type": "space" }
  }
},
"footer": {
  "background": { "value": "...", "type": "color" },
  "padding": {
    "vertical":   { "value": "...", "type": "space" },
    "horizontal": { "value": "...", "type": "space" }
  },
  "border": {
    "color":  { "value": "...", "type": "color" },
    "radius": { "value": "...", "type": "radius" },
    "style":  { "value": "...", "type": "radius" },
    "width":  { "value": "...", "type": "space" }
  }
}
```

**Key rules:**
- `background` is a FLAT value (not `background.color`) — same for `header.background`, `body.background`, `footer.background`
- root `background` defaults to grey (`{color.outline.variant.value}` = #E4E4E4), NOT transparent — always set it explicitly to the sampled fill, or `{color.transparent.@.value}` if see-through, otherwise the grey leaks through. `header`/`body`/`footer` default to transparent, so omit those when unstyled.
- `border.radius` is INSIDE `border` (same as container)
- `border.width` uses `"type": "space"` (not `"border"`)
- `border.style` uses `"type": "radius"` (not `"border"`)
- padding inside header/body/footer splits into `vertical` / `horizontal` (never shorthand)

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `background` | `{color.outline.variant.value}` |
| `padding` | `{space.3.value}` |
| `border.radius` | `{radius.sm.value}` |
| `border.color` | `{color.transparent.@.value}` |
| `header.background` | `{color.transparent.@.value}` |
| `header.title.color` | `{color.on-surface.@.value}` |
| `header.title.font.size` | `{h4.font-size.value}` |
| `header.title.font.weight` | `{font.weight.700.value}` |
| `header.sub-title.color` | `{color.on-surface.variant.@.value}` |
| `header.sub-title.font.size` | `{h6.font-size.value}` |
| `body.background` | `{color.transparent.@.value}` |
| `footer.background` | `{color.transparent.@.value}` |

### Complete example

```json
{
  "form": {
    "appearances": {
      "login": {
        "mapping": {
          "background": { "value": "{color.transparent.@.value}", "type": "color" },
          "padding": { "value": "{space.0.value}", "type": "space" },
          "border": {
            "width": { "value": "{border.width.0.value}", "type": "space" },
            "style": { "value": "{border.style.solid.value}", "type": "radius" },
            "color": { "value": "{color.transparent.@.value}", "type": "color" },
            "radius": { "value": "{radius.none.value}", "type": "radius" }
          },
          "header": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.0.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          },
          "body": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.0.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          },
          "footer": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.4.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          }
        }
      }
    }
  }
}
```

**Matching markup:**
```xml
<wm-form name="loginForm" class="form-login" variant="login"
  captionposition="top" messagelayout="Inline"
  on-beforesubmit="onLogin($event, widget, $data)">

  <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
    <wm-form-field name="username" key="username" displayname="Username"
      widget="text" required="true" placeholder="Enter username">
    </wm-form-field>

    <wm-form-field name="password" key="password" displayname="Password"
      widget="password" required="true" placeholder="Enter password">
    </wm-form-field>
  </wm-container>

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="login_action" display-name="LOGIN"
      type="submit" update-mode="true">
    </wm-form-action>
  </wm-container>
</wm-form>
```

---

## `form-controls/form-controls.json` — root key `"form-controls"`

Controls every input widget (text, number, textarea, select, checkbox, radioset, toggle) and its label, placeholder, and focus/disabled states. Applied via the `.app-input` CSS class and its state variants.

**Override mechanism: `appearances` ONLY.** All form-controls styling MUST go under `appearances["variant-name"].mapping` — never in the base `mapping`. Always create at least one variant and apply it to every `wm-form-field` via the `variant` and `class` attributes. If all fields share the same design, one variant covers all of them. If fields differ visually, create additional variants and assign each field accordingly. Never write `meta` — that is internal to the canonical file.

### Property structure (inside `appearances["variant-name"].mapping`)

```json
"opacity":    { "value": "...", "type": "radius" },
"min-height": { "value": "...", "type": "space" },
"min-width":  { "value": "...", "type": "space" },
"padding":    { "value": "...", "type": "space" },
"font": {
  "size":   { "value": "...", "type": "font" },
  "weight": { "value": "...", "type": "font" },
  "family": { "value": "...", "type": "font" }
},
"border": {
  "color":  { "value": "...", "type": "color" },
  "radius": { "value": "...", "type": "radius" },
  "style":  { "value": "...", "type": "style" },
  "width":  { "value": "...", "type": "space" }
},
"background": { "value": "...", "type": "color" },
"color":      { "value": "...", "type": "color" },
"placeholder": {
  "color": { "value": "...", "type": "color" }
},
"label": {
  "color":      { "value": "...", "type": "color" },
  "background": { "value": "...", "type": "color" },
  "font": {
    "size":   { "value": "...", "type": "font" },
    "weight": { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "margin": {
    "vertical":   { "value": "...", "type": "space" },
    "horizontal": { "value": "...", "type": "space" }
  }
},
"floating": {
  "color":   { "value": "...", "type": "color" },
  "font": {
    "size":   { "value": "...", "type": "font" },
    "weight": { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "top":     { "value": "...", "type": "space" },
  "left":    { "value": "...", "type": "space" },
  "padding": { "value": "...", "type": "space" }
},
"states": {
  "focused": {
    "border": {
      "color": { "value": "...", "type": "color" },
      "width": { "value": "...", "type": "space" }
    },
    "background": { "value": "...", "type": "color" },
    "color":      { "value": "...", "type": "color" },
    "floating": {
      "color": { "value": "...", "type": "color" },
      "font": {
        "size":   { "value": "...", "type": "font" },
        "weight": { "value": "...", "type": "font" },
        "family": { "value": "...", "type": "font" }
      },
      "top":     { "value": "...", "type": "space" },
      "left":    { "value": "...", "type": "space" },
      "padding": { "value": "...", "type": "space" }
    }
  },
  "disabled": {
    "border": {
      "color": { "value": "...", "type": "color" },
      "width": { "value": "...", "type": "space" }
    },
    "background": { "value": "...", "type": "color" },
    "color":      { "value": "...", "type": "color" },
    "opacity":    { "value": "...", "type": "radius" }
  },
  "error": {
    "border": {
      "color": { "value": "...", "type": "color" },
      "width": { "value": "...", "type": "space" }
    },
    "color": { "value": "...", "type": "color" }
  }
}
```

**Key rules:**
- `background` is FLAT (not `background.color`) — same for `label.background`
- `border.radius` is INSIDE `border`
- `border.width` uses `"type": "space"` (not `"border"`)
- `border.style` uses `"type": "style"` (unique to this component)
- `opacity` uses `"type": "radius"` (catch-all for non-standard CSS props)
- `label.margin` splits into `vertical` / `horizontal`
- `floating` is only relevant when `captionposition="floating"` — omit if not used
- `states.error` is NOT used in base `mapping` — error tokens always go under `appearances["error"].mapping` in `border.color` and `color`. Do NOT emit `variant="error"` on any `wm-form-field` in markup; the form skill has no explicit error state UI

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `min-height` | `48px` |
| `min-width` | `160px` |
| `padding` | `{space.2.value}` |
| `font.size` | `{body.large.font-size.value}` |
| `border.color` | `{color.outline.@.value}` |
| `border.radius` | `{radius.sm.value}` |
| `border.width` | `{border.width.1.value}` |
| `background` | `{color.outline.variant.value}` |
| `color` | `{color.black.@.value}` |
| `placeholder.color` | `{color.on-surface.@.value}` |
| `label.color` | `{color.on-surface.@.value}` |
| `label.font.size` | `{label.large.font-size.value}` |
| `states.focused.border.color` | `{color.primary.@.value}` |
| `states.disabled.background` | `{color.surface.dim.@.value}` |
| `states.disabled.opacity` | `0.67` |

### Complete example

All styling goes under `appearances` — never in the base `mapping`. Every `wm-form-field` in markup gets a `variant` and `class` attribute pointing to its appearance.

```json
{
  "form-controls": {
    "appearances": {
      "branded": {
        "mapping": {
          "border": {
            "color":  { "value": "#3D1F8Cff", "type": "color" },
            "radius": { "value": "{radius.md.value}", "type": "radius" },
            "style":  { "value": "{border.style.base.value}", "type": "style" },
            "width":  { "value": "{border.width.1.value}", "type": "space" }
          },
          "background": { "value": "#FFFFFFff", "type": "color" },
          "color":      { "value": "#1A1A2Eff", "type": "color" },
          "placeholder": {
            "color": { "value": "{color.on-surface.variant.@.value}", "type": "color" }
          },
          "label": {
            "color": { "value": "#3D1F8Cff", "type": "color" }
          },
          "states": {
            "focused": {
              "border": {
                "color": { "value": "#6A3FB5ff", "type": "color" },
                "width": { "value": "{border.width.2.value}", "type": "space" }
              },
              "background": { "value": "#F9F5FFff", "type": "color" }
            }
          }
        }
      }
    }
  }
}
```

**Matching markup** — every field carries the same variant:
```xml
<wm-form-field name="username" key="username" variant="branded" class="form-controls-branded"
  displayname="Username" widget="text" required="true"></wm-form-field>

<wm-form-field name="password" key="password" variant="branded" class="form-controls-branded"
  displayname="Password" widget="password" required="true"></wm-form-field>
```

### Common Token Mistakes for Form Files

| Wrong | Right | Why |
|---|---|---|
| `{ "form-wrapper": { ... } }` | `{ "form": { ... } }` | Root key is `"form"`, not the filename |
| `"background": { "color": { "value": "..." } }` | `"background": { "value": "...", "type": "color" }` | `background` is flat in both form files (not nested like container) |
| `"border.width": { "type": "border" }` | `"border.width": { "type": "space" }` | Width uses `"space"` type in form files |
| `"border.style": { "type": "border" }` | `"border.style": { "type": "style" }` for form-controls, `"type": "radius"` for form-wrapper | Different across the two files |
| Putting any styling in base `mapping` | Always put styling under `appearances["variant-name"].mapping` | All form-controls styling must use variants; base `mapping` should never contain styling properties |
| Putting error tokens in base `mapping.states.error` | Put them under `appearances["error"].mapping` with `border.color` and `color` | Form skill has no error state UI; error tokens are a variant, never in base mapping. Never add `variant="error"` to markup. |
| Including `meta` in output | Omit `meta` entirely | Meta is internal to the canonical foundation file |
| `"padding": { "top": ..., "left": ... }` in header/body/footer | `"padding": { "vertical": ..., "horizontal": ... }` | Form uses vertical/horizontal split, not TRBL |

---

## Per-Widget Token Schemas for Form Overrides

These schemas apply when the widget type appears inside a `<wm-form>`. Generate a per-widget token file alongside `form-controls/form-controls.json` with a variant under `appearances["variant-name"].mapping`. Only include properties where the design differs from the widget's defaults.

---

### `select/select.json` — root key `"select"`

Controls the dropdown button, modal, and check icon. The input area itself is styled by `form-controls`.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"arrow-button": {
  "padding":          { "value": "...", "type": "space" },
  "background-color": { "value": "...", "type": "color" },
  "icon": {
    "color":     { "value": "...", "type": "color" },
    "height":    { "value": "...", "type": "space" },
    "padding":   { "value": "...", "type": "space" },
    "font-size": { "value": "...", "type": "font" },
    "border": {
      "radius": { "value": "...", "type": "radius" },
      "width":  { "value": "...", "type": "border" },
      "style":  { "value": "...", "type": "radius" },
      "color":  { "value": "...", "type": "color" }
    }
  },
  "border": {
    "radius": { "value": "...", "type": "radius" },
    "width":  { "value": "...", "type": "border" },
    "style":  { "value": "...", "type": "radius" },
    "color":  { "value": "...", "type": "color" }
  }
},
"modal-content": {
  "background-color": { "value": "...", "type": "color" },
  "border": {
    "radius": { "value": "...", "type": "radius" },
    "width":  { "value": "...", "type": "border" },
    "style":  { "value": "...", "type": "radius" },
    "color":  { "value": "...", "type": "color" }
  }
},
"modal-text": {
  "font-size":   { "value": "...", "type": "font" },
  "font-family": { "value": "...", "type": "font" },
  "color":       { "value": "...", "type": "color" }
},
"check": {
  "icon": {
    "color":     { "value": "...", "type": "color" },
    "font-size": { "value": "...", "type": "font" }
  }
}
```

**Key rules:**
- `background-color` is hyphenated (not nested `background.color`) — unique to select
- `arrow-button.border` is the button's own border; `arrow-button.icon.border` is the icon's border inside the button
- `border.width` uses `"type": "border"` (not `"space"`)
- `border.style` uses `"type": "radius"` (catch-all)
- Do NOT add root-level `background`, `border`, `padding`, `color`, `font-size`, `min-width` — those properties do not exist in the select token schema

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `arrow-button.padding` | `{space.1.value}` |
| `arrow-button.background-color` | `{color.outline.variant.value}` |
| `arrow-button.icon.color` | `{color.on-background.@.value}` |
| `arrow-button.icon.font-size` | `{body.large.font-size.value}` |
| `arrow-button.border.width` | `{border.width.0.value}` |
| `modal-content.background-color` | `{color.outline.variant.value}` |
| `modal-content.border.radius` | `{radius.base.value}` |
| `modal-text.font-size` | `{body.large.font-size.value}` |
| `modal-text.color` | `{color.on-surface.variant.@.value}` |
| `check.icon.color` | `{color.on-background.@.value}` |

---

### `checkbox/checkbox.json` — root key `"checkbox"`

Controls the checkbox box, checkmark icon, label next to box, and checked/disabled states.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"height": { "value": "...", "type": "space" },
"width":  { "value": "...", "type": "space" },
"background": {
  "color": { "value": "...", "type": "color" }
},
"icon": {
  "color": { "value": "...", "type": "color" },
  "size":  { "value": "...", "type": "space" }
},
"border": {
  "width":  { "value": "...", "type": "space" },
  "radius": { "value": "...", "type": "radius" },
  "color":  { "value": "...", "type": "color" }
},
"label": {
  "font": {
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "color":       { "value": "...", "type": "color" },
  "margin-left": { "value": "...", "type": "space" }
},
"states": {
  "checked": {
    "background": { "color": { "value": "...", "type": "color" } },
    "border":     { "color": { "value": "...", "type": "color" } },
    "icon":       { "color": { "value": "...", "type": "color" } },
    "label": {
      "font": {
        "size":   { "value": "...", "type": "font" },
        "family": { "value": "...", "type": "font" }
      },
      "color": { "value": "...", "type": "color" }
    }
  },
  "disabled": {
    "opacity": { "value": "...", "type": "radius" },
    "label": {
      "font": {
        "size":   { "value": "...", "type": "font" },
        "family": { "value": "...", "type": "font" }
      },
      "color": { "value": "...", "type": "color" }
    }
  }
}
```

**Key rules:**
- `background.color` is NESTED (not flat like form-controls) — `"background": { "color": { ... } }`
- The checkmark icon is `icon.color` and `icon.size` — there is NO `checkmark` property
- `border.width` uses `"type": "space"` (not `"border"`)
- `label.margin-left` is hyphenated (not nested `label.margin.left`)

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `height` | `{space.6.value}` |
| `width` | `{space.6.value}` |
| `background.color` | `transparent` |
| `icon.color` | `transparent` |
| `icon.size` | `{icon.size.@.value}` |
| `border.width` | `2px` |
| `border.radius` | `{radius.xxs.value}` |
| `border.color` | `{color.on-surface.variant.@.value}` |
| `label.color` | `{color.on-surface.variant.@.value}` |
| `label.margin-left` | `8px` |
| `states.checked.background.color` | `{color.primary.@.value}` |
| `states.checked.border.color` | `{color.primary.@.value}` |
| `states.checked.icon.color` | `{color.on-primary.@.value}` |
| `states.disabled.opacity` | `0.8` |

---

### `checkboxset/checkboxset.json` — root key `"checkboxset"`

Same box/icon/border structure as checkbox, plus title and item spacing.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"height": { "value": "...", "type": "space" },
"width":  { "value": "...", "type": "space" },
"background": {
  "color": { "value": "...", "type": "color" }
},
"icon": {
  "size":  { "value": "...", "type": "space" },
  "color": { "value": "...", "type": "color" }
},
"border": {
  "width":  { "value": "...", "type": "space" },
  "radius": { "value": "...", "type": "radius" },
  "color":  { "value": "...", "type": "color" }
},
"label": {
  "font": {
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "color": { "value": "...", "type": "color" },
  "margin": {
    "left": { "value": "...", "type": "space" }
  }
},
"title": {
  "background": { "color": { "value": "...", "type": "color" } },
  "color":   { "value": "...", "type": "color" },
  "font": {
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "padding": { "value": "...", "type": "space" }
},
"item": {
  "margin": {
    "right":  { "value": "...", "type": "space" },
    "left":   { "value": "...", "type": "space" },
    "top":    { "value": "...", "type": "space" },
    "bottom": { "value": "...", "type": "space" }
  }
},
"states": {
  "checked": {
    "background": { "color": { "value": "...", "type": "color" } },
    "border":     { "color": { "value": "...", "type": "color" } },
    "icon":       { "color": { "value": "...", "type": "color" } },
    "label": {
      "font": {
        "size":   { "value": "...", "type": "font" },
        "family": { "value": "...", "type": "font" },
        "margin": { "left": { "value": "...", "type": "space" } }
      },
      "color": { "value": "...", "type": "color" }
    }
  },
  "disabled": {
    "opacity": { "value": "...", "type": "radius" },
    "border": {
      "width":  { "value": "...", "type": "space" },
      "radius": { "value": "...", "type": "radius" },
      "color":  { "value": "...", "type": "color" }
    },
    "label": { "color": { "value": "...", "type": "color" } }
  }
}
```

**Key rules:**
- Same as checkbox: `background.color` is nested, icon is `icon.color`/`icon.size`, no `checkmark` property
- `label.margin.left` is nested (unlike checkbox's hyphenated `label.margin-left`)
- Has `title` and `item.margin` sections that checkbox does not

---

### `currency/currency.json` — root key `"currency"`

Controls the currency symbol prefix area (label wrapper) and its label text. The input area is styled by `form-controls`.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"labelwrapper": {
  "min": {
    "height": { "value": "...", "type": "space" }
  },
  "background": { "value": "...", "type": "color" },
  "border": {
    "radius": { "value": "...", "type": "space" }
  },
  "padding": { "value": "...", "type": "space" },
  "width":   { "value": "...", "type": "border" }
},
"label": {
  "color": { "value": "...", "type": "color" },
  "font": {
    "weight": { "value": "...", "type": "font" },
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  }
}
```

**Key rules:**
- `labelwrapper.background` is FLAT (not `background.color`) — unique to currency
- `labelwrapper.border.radius` uses `"type": "space"` (not `"radius"`)
- `labelwrapper.width` uses `"type": "border"` (not `"space"`)
- `labelwrapper.min.height` is nested under `min`

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `labelwrapper.min.height` | `30px` |
| `labelwrapper.background` | `#4263eb` |
| `labelwrapper.border.radius` | `6px {space.0.value} {space.0.value} 6px` |
| `labelwrapper.padding` | `{space.2.value} {space.4.value}` |
| `labelwrapper.width` | `{space.12.value}` |
| `label.color` | `{color.white.@.value}` |
| `label.font.size` | `{body.large.font-size.value}` |
| `label.font.weight` | `{body.medium.font-weight.value}` |

---

### `radioset/radioset.json` — root key `"radiobutton"`

> **CRITICAL: The root key is `"radiobutton"`, NOT `"radioset"`.** The filename is `radioset.json` but the JSON root key is `"radiobutton"`.

Controls the radio circle, indicator dot, label, title, item spacing, and checked/disabled states.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"size": { "value": "...", "type": "space" },
"gap":  { "value": "...", "type": "space" },
"color": {
  "@": { "value": "...", "type": "color" }
},
"indicator": {
  "size": { "value": "...", "type": "space" }
},
"border": {
  "width": { "value": "...", "type": "space" },
  "color": { "value": "...", "type": "color" }
},
"label": {
  "font-size":      { "value": "...", "type": "font" },
  "font-family":    { "value": "...", "type": "font" },
  "font-weight":    { "value": "...", "type": "font" },
  "line-height":    { "value": "...", "type": "font" },
  "letter-spacing": { "value": "...", "type": "font" },
  "color": {
    "@": { "value": "...", "type": "color" }
  }
},
"title": {
  "background": { "color": { "value": "...", "type": "color" } },
  "color":   { "value": "...", "type": "color" },
  "font": {
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" }
  },
  "line-height": { "value": "...", "type": "font" },
  "padding":     { "value": "...", "type": "space" }
},
"set": {
  "item": {
    "column": { "gap": { "value": "...", "type": "space" } },
    "row":    { "gap": { "value": "...", "type": "space" } }
  }
},
"states": {
  "checked": {
    "label":  { "color": { "@": { "value": "...", "type": "color" } } },
    "color":  { "@": { "value": "...", "type": "color" } },
    "border": { "color": { "value": "...", "type": "color" } }
  },
  "disabled": {
    "label":   { "color": { "@": { "value": "...", "type": "color" } } },
    "border":  { "color": { "value": "...", "type": "color" } },
    "opacity": { "value": "...", "type": "radius" }
  }
}
```

**Key rules:**
- Root key is `"radiobutton"` — never `"radioset"`
- `color.@` and `label.color.@` use the `@` nesting pattern (not flat)
- Label font properties are hyphenated at the leaf level: `label.font-size`, `label.font-family` (not nested under `label.font`)
- `size` is the radio circle size; `indicator.size` is the inner dot size
- `border.width` uses `"type": "space"`

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `size` | `20px` |
| `indicator.size` | `16px` |
| `gap` | `{space.1.value}` |
| `color.@` | `transparent` |
| `border.width` | `2px` |
| `border.color` | `{color.on-surface.variant.@.value}` |
| `label.color.@` | `{color.on-surface.@.value}` |
| `states.checked.color.@` | `{color.secondary.@.value}` |
| `states.checked.border.color` | `{color.secondary.@.value}` |
| `states.disabled.opacity` | `0.8` |

---

### `toggle/toggle.json` — root key `"toggle"`

Controls the toggle track, handle (thumb), border, and on/disabled states.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"width":   { "value": "...", "type": "space" },
"height":  { "value": "...", "type": "space" },
"opacity": { "value": "...", "type": "radius" },
"background": {
  "color": { "value": "...", "type": "color" }
},
"handle": {
  "color":  { "value": "...", "type": "color" },
  "width":  { "value": "...", "type": "space" },
  "height": { "value": "...", "type": "space" },
  "radius": { "value": "...", "type": "space" },
  "margin": {
    "left":  { "value": "...", "type": "space" },
    "right": { "value": "...", "type": "space" }
  }
},
"border": {
  "color":  { "value": "...", "type": "color" },
  "radius": { "value": "...", "type": "space" },
  "width":  { "value": "...", "type": "border" }
},
"states": {
  "on": {
    "background": { "color": { "value": "...", "type": "color" } },
    "border": {
      "color":  { "value": "...", "type": "color" },
      "radius": { "value": "...", "type": "space" },
      "width":  { "value": "...", "type": "border" }
    },
    "handle": {
      "color":  { "value": "...", "type": "color" },
      "width":  { "value": "...", "type": "space" },
      "height": { "value": "...", "type": "space" },
      "radius": { "value": "...", "type": "space" },
      "margin": {
        "left":  { "value": "...", "type": "space" },
        "right": { "value": "...", "type": "space" }
      }
    }
  },
  "disabled": {
    "opacity": { "value": "...", "type": "radius" }
  }
}
```

**Key rules:**
- `background.color` is NESTED (not flat)
- `handle.radius` uses `"type": "space"` (not `"radius"`)
- `border.radius` uses `"type": "space"` (not `"radius"`)
- `border.width` uses `"type": "border"`
- The `on` state repeats the full handle structure (width, height, radius, margin, color)

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `width` | `52px` |
| `height` | `32px` |
| `background.color` | `{color.secondary.container.@.value}` |
| `handle.color` | `{color.on-secondary.fixed.variant.value}` |
| `handle.width` / `handle.height` | `16px` |
| `handle.radius` | `18px` |
| `border.color` | `{color.outline.@.value}` |
| `border.width` | `2px` |
| `states.on.background.color` | `{color.secondary.@.value}` |
| `states.on.handle.color` | `{color.on-secondary.@.value}` |
| `states.disabled.opacity` | `0.5` |

---

### `switch/switch.json` — root key `"switch"`

Controls the segmented button group (button background, text, border), selected and disabled states.

#### Property structure (inside `appearances["variant-name"].mapping`)

```json
"button": {
  "background": {
    "color": { "value": "...", "type": "color" }
  },
  "font": {
    "size":   { "value": "...", "type": "font" },
    "family": { "value": "...", "type": "font" },
    "weight": { "value": "...", "type": "font" }
  },
  "text": {
    "transform": { "value": "...", "type": "font" }
  },
  "height":  { "value": "...", "type": "space" },
  "color":   { "value": "...", "type": "color" },
  "border": {
    "color":  { "value": "...", "type": "color" },
    "width":  { "value": "...", "type": "radius" },
    "radius": { "value": "...", "type": "radius" }
  },
  "padding": { "value": "...", "type": "space" },
  "ripple": {
    "color": { "value": "...", "type": "color" }
  }
},
"states": {
  "selected": {
    "button": {
      "background": { "color": { "value": "...", "type": "color" } },
      "color":   { "value": "...", "type": "color" },
      "border":  { "color": { "value": "...", "type": "color" } },
      "font": {
        "size":   { "value": "...", "type": "font" },
        "family": { "value": "...", "type": "font" },
        "weight": { "value": "...", "type": "font" }
      },
      "text": {
        "transform": { "value": "...", "type": "font" }
      }
    }
  },
  "disabled": {
    "opacity": { "value": "...", "type": "radius" }
  }
}
```

**Key rules:**
- Everything is nested under `button` — not at root level
- `button.border.width` uses `"type": "radius"` (not `"space"` or `"border"`)
- `button.text.transform` uses `"type": "font"`
- Selected state is `states.selected` (not `states.checked` or `states.active`)

**Foundation defaults (only override when the design differs):**

| Property | Default |
|---|---|
| `button.background.color` | `{color.surface.@.value}` |
| `button.color` | `{color.outline.@.value}` |
| `button.height` | `{space.10.value}` |
| `button.border.color` | `{color.outline.@.value}` |
| `button.border.radius` | `{radius.lg.value}` |
| `button.padding` | `{space.0.value} {space.4.value}` |
| `button.font.weight` | `{font.weight.500.value}` |
| `button.text.transform` | `capitalize` |
| `states.selected.button.background.color` | `{color.secondary.fixed.@.value}` |
| `states.selected.button.color` | `{color.on-secondary.container.@.value}` |
| `states.disabled.opacity` | `0.6` |
