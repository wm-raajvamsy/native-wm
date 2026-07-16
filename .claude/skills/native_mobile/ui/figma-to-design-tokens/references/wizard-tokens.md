---
name: wizard-tokens
description: >
  wm-wizard design token schema: when to generate wizard tokens (custom indicator colors, size, flat
  style, body height, typography, connector, heading background), token file setup
  (tokens/wizard/wizard.json, root key "wizard"), full nested property structure across heading, body,
  step, and states sections, property-to-CSS-variable mappings, and a default override checklist.
  Load when generating or validating token overrides for a wm-wizard component.
---

# Wizard Design Tokens Reference

## When to Generate Wizard Tokens

Generate wizard tokens when the design differs from defaults on any of:
- Custom indicator colors (not secondary/success)
- Custom indicator size (not ~33–37px)
- Flat wizard (no shadow)
- Custom body height
- Custom step title/subtitle typography
- Custom connector color or style
- Colored heading area background

---

## Token File Setup

- **File**: `tokens/wizard/wizard.json`
- **Root key**: `wizard`
- **Markup**: `class="wizard-<name>" variant="<name>"` on `wm-wizard`

```xml
<wm-wizard name="wizard1" class="progress-circle-header wizard-branded" variant="branded">
```

---

## Full Token Structure

```json
{
  "wizard": {
    "appearances": {
      "branded": {
        "mapping": {
          "background-color": { "value": "#FFFFFFff", "type": "color" },
          "box-shadow": { "value": "{elevation.shadow.none.value}", "type": "radius" },
          "border-radius": { "value": "{radius.md.value}", "type": "radius" },
          "padding": { "value": "{space.4.value}", "type": "space" },
          "heading": {
            "background-color": { "value": "{color.surface.variant.@.value}", "type": "color" },
            "radius": { "value": "{radius.md.value}", "type": "radius" },
            "padding": { "value": "{space.7.value} {space.7.value} {space.0.value} {space.7.value}", "type": "space" }
          },
          "body": {
            "height": { "value": "400px", "type": "space" },
            "padding": { "value": "{space.4.value} {space.0.value} {space.0.value} {space.0.value}", "type": "space" }
          },
          "step": {
            "gap": { "value": "{space.2.value}", "type": "space" },
            "indicator": {
              "size": { "value": "40px", "type": "space" },
              "background-color": { "value": "transparent", "type": "color" },
              "border-width": { "value": "{border.width.2.value}", "type": "space" },
              "border-style": { "value": "{border.style.base.value}", "type": "radius" },
              "border-color": { "value": "{color.outline.@.value}", "type": "color" },
              "border-radius": { "value": "{radius.circle.value}", "type": "radius" }
            },
            "title": {
              "color": { "value": "{color.on-surface.@.value}", "type": "color" },
              "font-size": { "value": "{label.large.font-size.value}", "type": "font" },
              "font-weight": { "value": "{font.weight.400.value}", "type": "font" },
              "font-family": { "value": "{label.large.font-family.value}", "type": "font" },
              "line-height": { "value": "{label.large.line-height.value}", "type": "font" },
              "letter-spacing": { "value": "{label.large.letter-spacing.value}", "type": "font" }
            },
            "description": {
              "color": { "value": "{color.on-surface.variant.@.value}", "type": "color" },
              "font-size": { "value": "{label.medium.font-size.value}", "type": "font" },
              "font-weight": { "value": "{font.weight.500.value}", "type": "font" },
              "font-family": { "value": "{label.medium.font-family.value}", "type": "font" },
              "line-height": { "value": "{label.medium.line-height.value}", "type": "font" },
              "letter-spacing": { "value": "{label.medium.letter-spacing.value}", "type": "font" }
            },
            "count": {
              "color": { "value": "{color.on-surface.@.value}", "type": "color" },
              "font-size": { "value": "{label.large.font-size.value}", "type": "font" },
              "font-weight": { "value": "{font.weight.400.value}", "type": "font" },
              "font-family": { "value": "{label.large.font-family.value}", "type": "font" },
              "line-height": { "value": "{label.large.line-height.value}", "type": "font" }
            },
            "icon": {
              "color": { "value": "{color.on-surface.@.value}", "type": "color" },
              "size": { "value": "{icon.size.sm.value}", "type": "space" }
            },
            "connector": {
              "width": { "value": "1px", "type": "space" },
              "style": { "value": "{border.style.solid.value}", "type": "radius" },
              "color": { "value": "{color.outline.variant.value}", "type": "color" }
            }
          },
          "states": {
            "current": {
              "step": {
                "indicator": {
                  "background-color": { "value": "{color.secondary.@.value}", "type": "color" },
                  "border-color": { "value": "{color.secondary.@.value}", "type": "color" }
                },
                "count": { "color": { "value": "{color.on-secondary.@.value}", "type": "color" } },
                "icon": { "color": { "value": "{color.on-secondary.@.value}", "type": "color" } }
              }
            },
            "active": {
              "step": {
                "indicator": {
                  "background-color": { "value": "{color.success.@.value}", "type": "color" },
                  "border-color": { "value": "{color.success.@.value}", "type": "color" }
                },
                "count": { "color": { "value": "{color.on-secondary.@.value}", "type": "color" } },
                "icon": { "color": { "value": "{color.on-secondary.@.value}", "type": "color" } }
              }
            }
          }
        }
      }
    }
  }
}
```

> **State naming**: `current` = step the user is ON now (secondary color). `active` = COMPLETED/done steps (success color). The naming feels inverted but is intentional.

---

## Property Paths → CSS Variables

| Section | Property | CSS Variable |
|---|---|---|
| root | `background-color` | `--wm-wizard-background-color` |
| root | `border-radius` | `--wm-wizard-border-radius` |
| root | `box-shadow` | `--wm-wizard-box-shadow` |
| root | `padding` | `--wm-wizard-padding` |
| root | `gap` | `--wm-wizard-gap` |
| heading | `background-color` | `--wm-wizard-heading-background-color` |
| heading | `radius` | `--wm-wizard-heading-radius` |
| heading | `padding` | `--wm-wizard-heading-padding` |
| body | `height` | `--wm-wizard-body-height` |
| body | `padding` | `--wm-wizard-body-padding` |
| step | `gap` | `--wm-wizard-step-gap` |
| step.indicator | `size` | `--wm-wizard-step-indicator-size` |
| step.indicator | `background-color` | `--wm-wizard-step-indicator-background-color` |
| step.indicator | `border-width` | `--wm-wizard-step-indicator-border-width` |
| step.indicator | `border-style` | `--wm-wizard-step-indicator-border-style` |
| step.indicator | `border-color` | `--wm-wizard-step-indicator-border-color` |
| step.indicator | `border-radius` | `--wm-wizard-step-indicator-border-radius` |
| step.title | `color`, `font-*` | `--wm-wizard-step-title-*` |
| step.description | `color`, `font-*` | `--wm-wizard-step-description-*` |
| step.count | `color`, `font-*` | `--wm-wizard-step-count-*` |
| step.icon | `color`, `size` | `--wm-wizard-step-icon-color/size` |
| step.connector | `width`, `style`, `color` | `--wm-wizard-step-connector-*` |
| states.current | `step.indicator.background-color` | Applied to `.app-wizard-active-step` |
| states.active | `step.indicator.background-color` | Applied to `.app-wizard-done-step` |

---

## Default Override Checklist

These wizard defaults render even without tokens. Override when the design differs:

| Default | Token to override | Neutralizing value |
|---|---|---|
| Shadow (elevation.shadow.1) | `box-shadow` | `"{elevation.shadow.none.value}"` |
| Body height 50vh | `body.height` | `"400px"` or specific px value |
| Indicator 33–37px circle | `step.indicator.size` | `"Npx"` |
| Active step: secondary color | `states.current.step.indicator.*` | Your custom color |
| Done step: success color | `states.active.step.indicator.*` | Your custom color |

> **Only include the delta.** Do NOT include `step.indicator.border-radius` if the design shows the same circular indicators — the foundation already sets `{radius.circle.value}`.
