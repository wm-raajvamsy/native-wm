---
name: foundation-tokens
description: >
  WaveMaker foundation design token reference: mandatory global-token-first rule, token reference
  syntax ({token.path.value}), complete color, typography, spacing, radius, elevation, icon-size, and
  font-weight scales, plus built-in component appearance tokens. Load before authoring any token
  overrides or verifying a token value exists in the foundation.
---

# WaveMaker Foundation Tokens

## MANDATORY: Global Token First — Static Value Last

**EVERY token value MUST use a global foundation token reference when one exists.** Static/literal values are the LAST RESORT, used ONLY when no matching global token exists (e.g., custom hex colors, non-standard sizes outside the scale).

This rule applies to ALL properties: `height`, `min-width`, `padding`, `gap`, `font-size`, `font-weight`, `line-height`, `icon.size`, `border.radius`, `border.width`, `shadow` — not just padding and gap.

**Before writing ANY value**, check these scales in order:
1. Spacing → `space.*` (0px–48px)
2. Radius → `radius.*`
3. Font size → typography tokens (`h1`–`h6`, `body.*`, `label.*`)
4. Font weight → `font.weight.*`
5. Line height → typography line-height tokens
6. Icon size → `icon.size.*`
7. Color → `color.*` tokens
8. Border → `border.width.*`, `border.style.*`
9. Shadow → `elevation.shadow.*`
10. ONLY if none match → use static value

The WaveMaker theme provides global design tokens and built-in component appearances. ALWAYS check these BEFORE creating custom tokens — only generate custom appearances for the delta (what the design shows differently from the foundation).

Source: `/wavemaker-studio-frontend/wavemaker-foundation-css/src/tokens/mobile`

## Foundation Token Reference Syntax

When generating design tokens, you can reference foundation values using the syntax `{token.path.value}`. This is **MANDATORY** over literal values when the design value matches a foundation token. Examples:

| Reference | Resolves To |
|-----------|-------------|
| `{space.0.value}` | 0px |
| `{space.1.value}` | 4px |
| `{space.2.value}` | 8px |
| `{space.3.value}` | 12px |
| `{space.4.value}` | 16px |
| `{space.5.value}` | 20px |
| `{space.6.value}` | 24px |
| `{space.7.value}` | 28px |
| `{space.8.value}` | 32px |
| `{space.9.value}` | 36px |
| `{space.10.value}` | 40px |
| `{space.11.value}` | 44px |
| `{space.12.value}` | 48px |
| `{radius.none.value}` | 0px |
| `{radius.xs.value}` | 4px |
| `{radius.sm.value}` | 8px |
| `{radius.md.value}` | 12px |
| `{radius.lg.value}` | 16px |
| `{radius.xl.value}` | 28px |
| `{radius.xxl.value}` | 32px |
| `{radius.pill.value}` | 1000px |
| `{radius.circle.value}` | 1000px |
| `{border.style.solid.value}` | solid |
| `{border.style.dotted.value}` | dotted |
| `{border.style.dashed.value}` | dashed |
| `{border.width.0.value}` | 0px |
| `{border.width.1.value}` | 1px |
| `{border.width.2.value}` | 2px |
| `{border.width.3.value}` | 3px |
| `{elevation.shadow.none.value}` | none |
| `{elevation.shadow.1.value}` | subtle shadow |
| `{elevation.shadow.2.value}` | medium shadow |
| `{elevation.shadow.3.value}` | prominent shadow |
| `{elevation.shadow.4.value}` | high shadow |
| `{elevation.shadow.5.value}` | highest shadow |
| `{box-shadow.none.value}` | none |
| `{box-shadow.1.value}` | subtle shadow (rgba) |
| `{box-shadow.2.value}` | medium shadow (rgba) |
| `{box-shadow.3.value}` | prominent shadow (rgba) |

**IMPORTANT — tokens that do NOT exist (never use these):**
- ❌ `{border.style.none.value}` - does NOT exist, and `border.style` is never `"none"` (only `solid`/`dotted`/`dashed`). For no border, set `border.width` to `{border.width.0.value}` and keep `border.style` as `{border.style.solid.value}`
- ❌ `{border.radius.*.value}` — does NOT exist. Use `{radius.*.value}` (no `border.` prefix)
- ❌ `{radius.0.value}` / `{radius.1.value}` / `{radius.2.value}` / `{radius.3.value}` — radius is a NAMED scale, never numeric. Use `none`/`xxs`/`xs`/`sm`/`md`/`lg`/`xl`/`xxl`/`pill`/`circle` (8px → `{radius.sm.value}`, NOT `{radius.2.value}`). Only `space.*` and `border.width.*` are numeric.
- ❌ `{padding.*.value}` — does NOT exist. Use `{space.*.value}` for padding values

Use literal values only when the design value does NOT match any foundation token (e.g., custom hex colors, non-standard sizes).

## Global Color Tokens

| Token Path | Default Value | Use For |
|-----------|---------------|---------|
| `color.primary.@` | `#FF7250` | Primary accent |
| `color.secondary.@` | `#656DF9` | Secondary accent |
| `color.tertiary.@` | `#E0B313` | Tertiary accent |
| `color.success.@` | `#5AC588` | Success states |
| `color.warning.@` | `#ffae00` | **Warnings AND star rating fill** |
| `color.error.@` | `#EF3F3F` | Errors, danger |
| `color.info.@` | `#00c8ff` | Info states |
| `color.background.@` | `#FFFFFF` | Page background |
| `color.on-background.@` | `#35363B` | Text on background |
| `color.surface.@` | `#FFFFFF` | Surface/card bg |
| `color.on-surface.@` | `#1D1B20` | Text on surfaces |
| `color.on-surface.variant.@` | `#4F556D` | Secondary/muted text |
| `color.outline.@` | `#79747E` | Borders, outlines |
| `color.outline.variant` | `#E4E4E4` | Subtle borders, dividers |
| `color.surface.container.@` | `#ebebf7` | Container backgrounds |
| `color.surface.container.lowest.@` | `#f5f7ff` | Subtle container bg |

## Typography Scale

| Token | Size | Weight | Line Height | Use For |
|-------|------|--------|-------------|---------|
| `h1` | 32px | 400 | 40px | Hero headings |
| `h2` | 28px | 400 | 36px | Section headings |
| `h3` | 24px | 400 | 32px | Sub-headings |
| `h4` | 22px | 400 | 28px | Card titles |
| `h5` | 16px | 500 | 24px | Widget headings |
| `h6` | 14px | 500 | 20px | Small headings |
| `body.large` | 16px | 400 | 24px | Default body text |
| `body.medium` | 14px | 400 | 20px | Secondary body text |
| `body.small` | 12px | 400 | 16px | Captions, timestamps |
| `label.large` | 14px | 500 | 20px | Button text, prominent labels |
| `label.medium` | 12px | 500 | 16px | Small labels |
| `label.small` | 11px | 500 | 16px | Tiny labels |
| `p` | 12px | 500 | 18px | Paragraph text |

## Spacing Scale (`space.*`)

Use for: `padding`, `gap`, `margin`, `height`, `min-width`, `min-height` — ANY dimensional value.

| Token | Value | Common Use |
|-------|-------|-----------|
| `space.0` | 0px | No spacing |
| `space.1` | 4px | Tight gap |
| `space.2` | 8px | Small gap |
| `space.3` | 12px | Medium gap |
| `space.4` | 16px | Standard gap, page padding |
| `space.5` | 20px | Medium-large gap |
| `space.6` | 24px | Large gap |
| `space.7` | 28px | Medium-large spacing |
| `space.8` | 32px | Section gap |
| `space.9` | 36px | Large element size |
| `space.10` | 40px | Button/icon standard size |
| `space.11` | 44px | Touch target size |
| `space.12` | 48px | Major section gap |

## Radius Scale (`radius.*`)

| Token | Value | Use For |
|-------|-------|---------|
| `radius.none` | 0px | Sharp corners |
| `radius.xxs` | 2px | Subtle rounding |
| `radius.xs` | 4px | Input fields |
| `radius.sm` | 8px | Cards, buttons, images |
| `radius.md` | 12px | Medium rounding |
| `radius.lg` | 16px | Large rounding |
| `radius.xl` | 28px | Pill-ish shapes |
| `radius.xxl` | 32px | Full pill buttons |
| `radius.pill` | 1000px | Perfect pills |
| `radius.circle` | 1000px | Perfect circles |

## Elevation / Shadow

| Token | Description |
|-------|------------|
| `elevation.shadow.none` | No shadow |
| `elevation.shadow.1` | Subtle card shadow |
| `elevation.shadow.2` | Medium elevation |
| `elevation.shadow.3` | Prominent card shadow |
| `elevation.shadow.4` | Floating element |
| `elevation.shadow.5` | High elevation (modals) |

## Icon Sizes (`icon.size.*`)

| Token | Value |
|-------|-------|
| `icon.size.xs` | 12px |
| `icon.size.sm` | 18px |
| `icon.size.md` | 24px (default) |
| `icon.size.lg` | 30px |
| `icon.size.2x` | 36px |

## Font Weight Tokens (`font.weight.*`)

| Token | Value |
|-------|-------|
| `font.weight.400` | 400 (Regular) |
| `font.weight.500` | 500 (Medium) |
| `font.weight.600` | 600 (Semi-bold) |
| `font.weight.700` | 700 (Bold) |

**Reference syntax**: `{font.weight.400.value}`, `{font.weight.600.value}`, etc.

## Typography Reference Tokens

Every typography entry has referenceable `font-size`, `line-height`, `font-weight`, and `font-family` sub-tokens.

| Token | font-size | line-height | font-weight |
|-------|-----------|-------------|-------------|
| `h1` | `{h1.font-size.value}` = 32px | `{h1.line-height.value}` = 40px | `{h1.font-weight.value}` = 400 |
| `h2` | `{h2.font-size.value}` = 28px | `{h2.line-height.value}` = 36px | `{h2.font-weight.value}` = 400 |
| `h3` | `{h3.font-size.value}` = 24px | `{h3.line-height.value}` = 32px | `{h3.font-weight.value}` = 400 |
| `h4` | `{h4.font-size.value}` = 22px | `{h4.line-height.value}` = 28px | `{h4.font-weight.value}` = 400 |
| `h5` | `{h5.font-size.value}` = 16px | `{h5.line-height.value}` = 24px | `{h5.font-weight.value}` = 500 |
| `h6` | `{h6.font-size.value}` = 14px | `{h6.line-height.value}` = 20px | `{h6.font-weight.value}` = 500 |
| `body.large` | `{body.large.font-size.value}` = 16px | `{body.large.line-height.value}` = 24px | `{body.large.font-weight.value}` = 400 |
| `body.medium` | `{body.medium.font-size.value}` = 14px | `{body.medium.line-height.value}` = 20px | `{body.medium.font-weight.value}` = 400 |
| `body.small` | `{body.small.font-size.value}` = 12px | `{body.small.line-height.value}` = 16px | `{body.small.font-weight.value}` = 400 |
| `label.large` | `{label.large.font-size.value}` = 14px | `{label.large.line-height.value}` = 20px | `{label.large.font-weight.value}` = 500 |
| `label.medium` | `{label.medium.font-size.value}` = 12px | `{label.medium.line-height.value}` = 16px | `{label.medium.font-weight.value}` = 500 |
| `label.small` | `{label.small.font-size.value}` = 11px | `{label.small.line-height.value}` = 16px | `{label.small.font-weight.value}` = 500 |

**Use these INSTEAD of static values**:
- `"font-size": { "value": "{body.large.font-size.value}", "type": "font" }` NOT `"font-size": { "value": "16px", "type": "font" }`
- `"line-height": { "value": "{body.medium.line-height.value}", "type": "font" }` NOT `"line-height": { "value": "20px", "type": "font" }`
- `"font-weight": { "value": "{font.weight.600.value}", "type": "font" }` NOT `"font-weight": { "value": "600", "type": "font" }`

## Color Tokens — Complete Reference

All color tokens use `{color.X.@.value}` syntax (note `@` as theme key). Use these instead of hardcoded hex.

| Reference | Default Value | Use For |
|-----------|---------------|---------|
| `{color.primary.@.value}` | #FF7250 | Primary accent buttons, links |
| `{color.secondary.@.value}` | #656DF9 | Secondary accent |
| `{color.tertiary.@.value}` | #E0B313 | Tertiary accent |
| `{color.success.@.value}` | #5AC588 | Success states |
| `{color.warning.@.value}` | #ffae00 | Warnings, star rating fill |
| `{color.error.@.value}` | #EF3F3F | Errors, danger |
| `{color.info.@.value}` | #00c8ff | Info states |
| `{color.background.@.value}` | #FFFFFF | Page background |
| `{color.on-background.@.value}` | #35363B | Text on background |
| `{color.surface.@.value}` | #FFFFFF | Surface/card bg |
| `{color.on-surface.@.value}` | #1D1B20 | Primary text on surfaces |
| `{color.on-surface.variant.@.value}` | #4F556D | Secondary/muted text |
| `{color.outline.@.value}` | #79747E | Borders, outlines |
| `{color.outline.variant.value}` | #E4E4E4 | Subtle borders, dividers (NO `@`) |
| `{color.surface.container.@.value}` | #ebebf7 | Container backgrounds |
| `{color.surface.container.lowest.@.value}` | #f5f7ff | Subtle container bg |
| `{color.transparent.@.value}` | transparent | Transparent backgrounds |
| `{color.border.@.value}` | (outline.variant) | Default border color |

**When to use color tokens vs hex**: If the design color matches or is close to a theme color, use the token. Only use custom hex (with `ff` alpha suffix) when the color is unique to this design and not a theme color.

## Common Mobile Element Sizes → Token Mapping

Use this as a reference when estimating sizes from screenshots. **Prefer the smaller token when uncertain.**

| Element | Typical px | Recommended Token |
|---------|-----------|-------------------|
| Toolbar icon button (back, heart) | 32px | `{space.8.value}` |
| Toolbar icon inside button | 18px | `{icon.size.sm.value}` |
| Compact action button (+/-) | 28-32px | `{space.7.value}`–`{space.8.value}` |
| Standard button height | 40px | `{space.10.value}` |
| Large/FAB button | 48px | `{space.12.value}` |
| Pill row vertical padding | 12px | `{space.3.value}` |
| Pill row horizontal padding | 16px | `{space.4.value}` |
| Color swatch dot | 20px | `{space.5.value}` |
| Bottom action bar vert padding | 12px | `{space.3.value}` |
| Review avatar | 36-40px | `{space.9.value}`–`{space.10.value}` |
| Small inline star rating | 12-16px | `{icon.size.xs.value}`–`{space.4.value}` |
| Section gap | 16px | `{space.4.value}` |
| Inner element gap | 4-8px | `{space.1.value}`–`{space.2.value}` |
| Chevron icon | 18px | `{icon.size.sm.value}` |

---

## Built-in Component Appearances

These appearances are pre-defined in the theme. Use them via `class` + `variant` instead of creating custom tokens when they match the design.

### Button (`btn`)

| Appearance | Description | Key Properties |
|-----------|-------------|----------------|
| `filled` | Solid background button | bg: surface, text: on-surface, border: 1px, radius: sm(8px) |
| `filled` + status `primary` | Primary filled | bg: primary color, text: white |
| `filled` + status `secondary` | Secondary filled | bg: secondary color, text: white |
| `outlined` | Transparent bg, colored border | bg: transparent, border: colored |
| `text` | No bg, no border, colored text | bg: none, border: transparent, padding: 8/12 |
| `standard` | Same as text, no decoration | bg: none, border: transparent |
| `icon` | Icon-only, square | 40x40, padding: 0, icon: md |
| `elevated` | With shadow | shadow: elevation.1 |
| `fab` | Floating action | 56x56, radius: 16px, shadow: elevation.1 |

### Container (`container`)

| Appearance | Description | Key Properties |
|-----------|-------------|----------------|
| `default` | No visual chrome | transparent bg, no border, no shadow |
| `outlined` | With border | 1px border, outline.variant color |
| `elevated` | With shadow | shadow: elevation.1, 1px border, radius: sm |

### Label (`label`)

| Appearance | Description |
|-----------|-------------|
| `default` | Base label. Has size variants: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `media-heading` |
| `text` | Has status color variants: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `muted` |
| `label` | Badge style — padded, bold, colored bg. Has status variants same as `text` |

> **⚠️ COLLISION DANGER**: The `label` appearance group registers selectors `.label-primary`, `.label-secondary`, `.label-success`, `.label-warning`, `.label-danger`, `.label-info`, `.label-muted`. These apply **badge chrome**: `backgroundColor` + `padding 32/16px` + `borderRadius 6px` + `fontWeight 700`. Custom appearances MUST NOT use these names. Use descriptive alternatives (the bare appearance name): `subtle`, `accent`, `highlight`, etc.

### Chips (`chips`)

| Property | Default Value |
|----------|--------------|
| Item border radius | `radius.sm` (8px) |
| Item min-width | 80px |
| Item min-height | 32px |
| Item border | 1px solid, `color.outline` |
| Item elevation | 1 (Android shadow) |
| Item padding | `space.1` `space.3` |
| List gap | `space.3` (12px) |
| List height | 70px |
| **Active bg** | `color.secondary.container` |
| **Active text color** | `color.on-surface.variant` |
| **Active border color** | `color.secondary.container` |

**Built-in appearances**: `filled` (status: default/primary/secondary/tertiary), `elevated` (with shadow)

**Active/selected state**: `wm-chips` has built-in `states.active` tokens. When a chip is selected, these tokens apply automatically:
- `states.active.background-color` — override for custom selected bg (e.g., dark bg)
- `states.active.color` — override for custom selected text (e.g., white)
- `states.active.item.border.color` — override for custom selected border

> **⚠️ USE `wm-chips` FOR FILTER/PILL ROWS**: Horizontal rows of selectable pills (e.g., "All", "Unread", "Favorites") with one item highlighted MUST use `wm-chips` with `selectionmode="single"` and `datavalue="<selected>"`. NEVER decompose into `wm-list` + `wm-button` — buttons have no selected state.

### Rating (`rating`)

| Property | Default Value |
|----------|--------------|
| Active star color | `color.warning.@` = **#ffae00 (gold)** |
| Inactive star color | `color.on-surface.@` = #1D1B20 |
| Icon size | 32px |
| Padding | space.2 (8px) |

**Important**: The foundation default for filled/active stars is gold (`{color.warning.@.value}` = #ffae00). The inactive star color is dark (`{color.on-surface.@.value}` = #1D1B20).
- To change **inactive/unfilled star color** (e.g., to light gray): override `icon.color`
- To change **filled/active star color**: override `states.active.icon.color`
- ❌ **NEVER use `activeStar.color` or `inactiveStar.color`** — these property names do not exist in the rating component

---

## When to Use Foundation vs Custom Tokens

| Scenario | Use Foundation | Use Custom Token |
|----------|---------------|-----------------|
| Gold/yellow star ratings | Yes — foundation default | No (unless different color) |
| Primary-colored button | Yes — `filled` + `primary` | No |
| Transparent text button | Yes — `text` appearance | No |
| Icon-only button, standard size | Yes — `icon` appearance | Only if non-standard size |
| Card with shadow | Yes — container `elevated` | Only for custom shadow |
| Muted/secondary text label | Yes — `text` + `muted` | Only for custom color |
| Custom color that matches no foundation token | No | Yes — generate custom |
| Custom radius not in scale | No | Yes — hardcode px value |
| Non-standard spacing | No | Yes — hardcode px value |
