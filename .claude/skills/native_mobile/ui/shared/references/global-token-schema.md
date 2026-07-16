---
name: global-token-schema
description: >
  Schema AND consumption guide for WaveMaker GLOBAL design-token override files (the theme/foundation
  layer): override file path map, the value-only sparse-override leaf shape, per-category structure
  templates (color light+dark, font, space, radius, border, border-style, elevation, icon, opacity), the
  color authoring discipline (one-object-per-token / no duplicate keys, the @-anchor on every shade), the
  derived-color companion checklist, the references-must-resolve rule, the leverage-existing-first /
  add-custom-tokens-only-on-request policy, PLUS the slot-selection + blast-radius guide (which global slot
  a sampled brand/design value maps to and how far an override reaches — the establish-vs-mutate call) and
  the component-layer dimensions no global override touches. Load whenever authoring or editing a
  design-tokens/overrides/global/**/*.json file, or when the design plan is picking a global slot or judging
  a rebrand's reach. DISTINCT from token-schema (which covers per-component appearance tokens) — global
  tokens are the brand primitives every component inherits, not component-specific styling.
---

# Global Token Override Schema

Global tokens are the **brand foundation** of the design system — the palette, typography, spacing, radius, and elevation primitives that every component references via `{token.path.value}`. Override them once and the change propagates app-wide (e.g. set `color.primary.@` → every widget that references `{color.primary.@.value}` updates).

This file documents how to author the **override files**. For per-component appearance tokens (the `appearances → mapping` shape), use `token-schema` instead — the two schemas are different.

## What an override changes — slot selection & reach (design-plan input)

Names/defaults/shape are below; this section is what the design plan (STEP 0) needs to **pick the right slot for a sampled value and judge how far an override reaches** — the establish-vs-mutate call. "Reach" = how many foundation components reference the slot.

**Color — map a sampled value to a slot by intended reach:**
- Fills buttons, links, active/selected, progress, tabbar -> `color.primary.@` (+ `on-primary.@`, `primary.container.@`). This IS the brand — the broadest slot.
- Selected chips / toggle-on / tonal accents -> `color.secondary.container.@` (chips/toggle active) or `color.secondary.@`.
- A third decorative accent (badges, tiles) -> `color.tertiary.@`.
- Status meanings -> `success` / `warning` / `error` / `info` (+ their `on-*` and `container`). `warning` also fills the rating star.
- Page canvas -> `background.@`; cards / sheets / controls -> `surface.@` and `surface.container.*`.
- Body vs muted text -> `on-surface.@` vs `on-surface.variant.@`.
- Borders / dividers -> `outline.@` (input borders) and `outline.variant` (subtle dividers, no `@`).

**High-leverage slots — an override here shifts most of the app.** This is why a single-screen difference must NOT mutate an established global (resolve it as a component appearance instead): `on-surface.@` (primary text/icons, nearly every component), `primary.@` (every accent), `surface.@` (control/card bg), `outline.@` (borders), `on-surface.variant.@` (muted text), and the status colors. Narrow slots (`tertiary`, `*.fixed.*`, single-component shades) are safe to set locally.

**Design-language levers (non-color) — change the scale step and it rescales everywhere it is referenced:**
- **Density** -> `space.1`-`space.4` (keep `space.0` at 0). Lower = denser, raise = airier.
- **Roundness** -> `radius.sm` (the workhorse: cards/buttons/inputs/tabs/tiles), then `md`/`lg`. Keep `pill`/`circle` at 1000px.
- **Type** -> `font.family.brand` + `plain` re-fonts the app (must be registered in RN); size via `body.large` (default body text) and `label.large` (button/chip/tab text).
- **Hairline weight** -> `border.width.base` (keep `border.width.0` at 0). **Flatness** -> `elevation.shadow.1` / `none` (or tint via `color.shadow.@`). **Icon scale** -> `icon.size.@` (24px default).

**Dimensions that are NOT global tokens** — the foundation hardcodes these as literals no global override reaches. Set them at the **component-override layer** (`overrides/components/<folder>/<folder>.json`, via `token-schema` / `figma-to-design-tokens-mobile`), and only when the design's dimension clearly differs from the default:

| Dimension | Default | Component token path | Override file (folder -> root key) |
|-----------|---------|----------------------|------------------------------------|
| Navbar height | 80px | `height` | `navbar` |
| Input / control height | 56px | `min-height` | `form-controls` |
| Toggle track / handle | 52x32 / radius 18 | root `width`/`height`, `handle.radius` | `toggle` |
| Rating star size | 32px | `icon.size` (+ `states.active.icon.size`, `text.size`) | `rating` |
| Slider track height | 54px | `height` | `slider` |
| Carousel height | 48px | `height` | `carousel` |
| Calendar height | 456px | `height` | `calendar` |
| Video player | 340x300 | `height` / `width` | `video` |
| Spinner size | 150px | `size` | `spinner` |
| Tabs scroll width | 240px | `width` | `tabs` |

**Two reach caveats — flag rather than promise:** (1) a few rendered values come from a second RN-codegen system as literals a global override may NOT reach — the rating active star (`#eb8600`), tooltip, skeleton, overlay; verify before promising they change. (2) An override to a **zero-consumer** token (a shade no component references) changes nothing until a component reads it — the notable exception is `color.background.@`, which sets the page background at the screen root even though it is not a component token.

## Where global override files live

Write to the project at:

```
src/main/webapp/design-tokens/overrides/global/<category>/<file>.json
```

The codegen (`AppOverrideCSSGenerator`) runs Style Dictionary with these files in its `include` set and **deep-merges** them onto the foundation base. Only the leaves you write change; everything else falls through to the foundation default.

| Category | Override file path | Root key | Themed? |
|----------|--------------------|----------|---------|
| Color (light) | `global/color/color.light.json` | `color` | ✅ light only |
| Color (dark) | `global/color/color.dark.json` | `color` | ✅ dark only |
| Typography | `global/font/font.json` | `font` + top-level ramp keys | mode-less |
| Spacing | `global/space/space.json` | `space` | mode-less |
| Radius | `global/radius/radius.json` | `radius` | mode-less |
| Border width | `global/border/border.json` | `border` | mode-less |
| Border style | `global/border-style/border-style.json` | `border` | mode-less |
| Elevation/shadow | `global/elevation/elevation.json` | `elevation` | mode-less |
| Icon size | `global/icon/icon.json` | `icon` | mode-less |
| Opacity | `global/opacity/opacity.json` | `opacity` | mode-less |
| Gap | `global/gap/gap.json` | `gap` | mode-less |
| Margin | `global/margin/margin.json` | `margin` | mode-less |

**Theme split — color only.** Color is the ONLY theme-specific category: write light values to `color.light.json` and dark values to `color.dark.json`. The build matches theme files by the `*.<mode>.json` suffix, so a single-name file like `color.json` would NOT be picked up as a theme override — always use `color.light.json` / `color.dark.json`. All other categories are single mode-less files that apply to every theme.

## The override leaf shape — value-only, sparse

A foundation **source** leaf carries metadata:

```json
"4": { "value": "16px", "attributes": { "subtype": "space" } }
```

An **override** leaf needs only `value`:

```json
"4": { "value": "18px" }
```

Rules enforced by the validator (`global-token-schema.js`) and the merge:

- **`value` is the only required key.** `type` and `attributes` are optional — omit them. Do NOT copy `attributes`/`subtype`/`derivedFrom`/`formula` from the source.
- **`value` must be a non-empty STRING.** Even numeric-looking values are strings: write a font weight as `"value": "600"`, never `600`.
- **Sparse only.** Author ONLY the leaves you are changing. Never copy the entire foundation tree — unchanged keys fall through automatically.
- **References must resolve.** A `{token.path.value}` reference is validated (`refExists`) — it must point at a token defined in the foundation OR elsewhere in your overrides, or the build fails with "reference does not exist".
- **Leverage existing tokens first.** By default, reuse and override the existing foundation token slots — do NOT mint new global tokens on your own initiative. Adding a brand-new custom token *is* mechanically supported (see "Adding custom global tokens" below), but it is reserved for when the user **explicitly asks** for additional/custom tokens.
- **Mirror the foundation nesting**, rooted at the category key (`{ "color": { ... } }`, `{ "space": { ... } }`). Colors carry the `@` anchor and a strict one-object-per-token shape (see the Color section).

## Color (`color.light.json` / `color.dark.json`)

Color is a nested tree under the `color` root. Two shape rules govern every color file — and the validator enforces **neither**, so they are on you (a violation builds a silently wrong theme, with no error).

**Rule 1 — One object per color token; never repeat a key.** Group every shade of a color (`@`, `container`, `fixed`, `variant`, …) inside a **single** parent object. Writing the same key twice at one level is silent corruption: `JSON.parse` keeps only the LAST occurrence, so the earlier shade is dropped before the validator ever runs. This is the most common way a brand color vanishes — write `"primary"` twice and its `@` shade disappears, so primary reverts to the foundation default.

```json
// ❌ "primary" appears twice → the @ shade is dropped on parse; primary stays the foundation colour
{ "color": {
  "primary": { "@": { "value": "#0E7A5F" } },
  "primary": { "container": { "@": { "value": "#CDEBE2" } } }
} }

// ✅ ONE "primary" object holding every shade
{ "color": {
  "primary": {
    "@":         { "value": "#0E7A5F" },
    "container": { "@": { "value": "#CDEBE2" } }
  },
  "on-primary": {
    "@":         { "value": "#FFFFFF" },
    "container": { "@": { "value": "#0a3328" } }
  }
} }
```

**Rule 2 — Every color leaf ends in `@`** (including nested shades like `primary.container.@`, `surface.container.@`). The reference syntax is `{color.<name>.@.value}`. The ONLY no-`@` color path is `color.outline.variant`.

```json
// ❌ nested shade with no @ — accepted by the validator, but builds the wrong variable
"primary": { "container": { "value": "#CDEBE2" } }
// ✅
"primary": { "container": { "@": { "value": "#CDEBE2" } } }
```

### Overridable color paths (and their light-theme defaults)

| Path | Default (light) | Role |
|------|-----------------|------|
| `color.primary.@` | `#FF7250` | Primary brand |
| `color.primary.container.@` | `#ffe3dc` | Primary tint surface |
| `color.on-primary.@` | `#FFFFFF` | Text/icon ON primary |
| `color.on-primary.container.@` | `#2d201d` | Text ON primary container |
| `color.secondary.@` | `#656DF9` | Secondary brand |
| `color.secondary.container.@` | `#e2e3ff` | Secondary tint surface |
| `color.on-secondary.@` | `#FFFFFF` | Text ON secondary |
| `color.tertiary.@` | `#E0B313` | Tertiary brand |
| `color.tertiary.container.@` | `#fff5d3` | Tertiary tint surface |
| `color.on-tertiary.@` | `#FFFFFF` | Text ON tertiary |
| `color.success.@` | `#5AC588` | Success |
| `color.on-success.@` | `#FFFFFF` | Text ON success |
| `color.warning.@` | `#ffae00` | Warning + star-rating fill |
| `color.on-warning.@` | `#FFFFFF` | Text ON warning |
| `color.error.@` | `#EF3F3F` | Error/danger |
| `color.on-error.@` | `#FFFFFF` | Text ON error |
| `color.info.@` | `#00c8ff` | Info |
| `color.on-info.@` | `#FFFFFF` | Text ON info |
| `color.background.@` | `#FFFFFF` | Page background |
| `color.on-background.@` | `#35363B` | Text ON background |
| `color.surface.@` | `#FFFFFF` | Card/surface bg |
| `color.surface.variant.@` | `#FBFBFC` | Alt surface |
| `color.surface.container.@` | `#ebebf7` | Container bg |
| `color.surface.container.lowest.@` | `#f5f7ff` | Subtle container bg |
| `color.surface.container.low.@` / `.high.@` / `.highest.@` | `#f0f2ff` / `#e8e8f1` / `#dfe0e9` | Container elevation tiers |
| `color.on-surface.@` | `#1D1B20` | Primary text on surfaces |
| `color.on-surface.variant.@` | `#4F556D` | Secondary/muted text |
| `color.outline.@` | `#79747E` | Borders, outlines |
| `color.outline.variant` | `#E4E4E4` | Subtle borders/dividers — **NO `@`** |
| `color.shadow.@` | `#dfdfdf` | Shadow tint (used by elevation) |
| `color.scrim.@` | `#000000` | Modal/overlay scrim |

Brand colors also have `fixed.@` / `fixed.dim` / `fixed.variant` shades and `inverse.*` shades — override these only if the design uses them.

### ⚠️ Derived colors are NOT recomputed — set companions explicitly

In the foundation source, `container`, `on-*`, and `fixed.*` carry `derivedFrom`/`formula` metadata (e.g. `on-primary = contrast(...)`). **These formulas are design-time metadata only — the app build does NOT re-evaluate them.** Each is a plain static leaf. So when you change a base brand color, its derived companions keep the OLD values unless you override them too.

When you override any of these base colors, also set the listed companions (in **both** light and dark files):

| Override | Also set (companions) |
|----------|-----------------------|
| `color.primary.@` | `color.on-primary.@` (readable contrast text), `color.primary.container.@`, `color.on-primary.container.@` |
| `color.secondary.@` | `color.on-secondary.@`, `color.secondary.container.@` |
| `color.tertiary.@` | `color.on-tertiary.@`, `color.tertiary.container.@` |
| `color.success.@` / `warning.@` / `error.@` / `info.@` | the matching `color.on-<name>.@` |
| `color.background.@` | `color.on-background.@`, and review `color.surface.@` / `on-surface.@` |
| `color.surface.@` | `color.on-surface.@`, `color.on-surface.variant.@` |

Pick each `on-*` so text remains legible on the new base (light text on dark bg, dark text on light bg — aim for WCAG AA, ~4.5:1).

### Light vs dark parity

`color.dark.json` has the same paths as light but **inverted** brightness: in dark, brand colors are usually *lighter* and `on-*` colors *darker*; `background`/`surface` are near-black (foundation dark default `#141218`), `on-surface` near-white. Author the dark palette with the same companion discipline — don't leave dark text dark on a dark surface.

### Self-check before saving a color file

The validator cannot catch a duplicate key (it's gone before validation) or a missing `@` (it looks like a valid leaf), so re-read each file you wrote and confirm:

1. **No key repeats** at any level — every `primary` / `on-surface` / `outline` / … appears exactly once; all shades merged into one object.
2. **Every color leaf ends in `@`** (including nested shades), except `color.outline.variant`.
3. **Companions set** for each base color you changed (`on-*`, `container`) — per the derived-color table.
4. **Light/dark parity** — `color.light.json` and `color.dark.json` carry the same paths.

## Typography (`font.json`)

`font.json` holds two kinds of tokens. `font.weight.*` and `font.family.*` nest under `font`. The **type-ramp entries are TOP-LEVEL keys** — `body` (`large`/`medium`/`small`), `h1`–`h6`, `p`, `label` (`large`/`medium`/`small`), `display` (`large`/`medium`/`small`) — they are NOT nested under `font`. (That is why the reference is `{body.large.font-size.value}`, not `{font.body...}`.)

Each ramp entry has five leaves: `font-family`, `font-weight`, `font-size`, `line-height`, `letter-spacing`.

```json
{
  "font": {
    "family": {
      "brand": { "value": "Plus Jakarta Sans" },
      "plain": { "value": "Plus Jakarta Sans" }
    }
  },
  "body": {
    "large": {
      "font-size":   { "value": "17px" },
      "line-height": { "value": "26px" }
    }
  },
  "h1": {
    "font-weight": { "value": "{font.weight.700.value}" },
    "font-size":   { "value": "34px" }
  }
}
```

Notes:
- Changing `font.family.brand` re-fonts the whole app, because every ramp entry references `{font.family.brand.value}`. The font must be registered/available in the RN app for it to render.
- `font.weight.*` values are weight numbers as **strings** (`"100"`…`"900"`); reference them with `{font.weight.600.value}`.
- Override only the leaves you change — e.g. bump `h1.font-size` without restating `font-family`/`letter-spacing`.

## Spacing (`space.json`)

Numeric scale `0`–`12` (4px step) plus `rule` (the 4px base step).

```json
{ "space": { "4": { "value": "18px" }, "6": { "value": "28px" } } }
```

Rescale only when the design is notably tighter or airier than the default 4px rhythm. Most designs keep the default scale.

| Token | Default | | Token | Default |
|-------|---------|-|-------|---------|
| `space.0` | 0px | | `space.7` | 28px |
| `space.1` | 4px | | `space.8` | 32px |
| `space.2` | 8px | | `space.9` | 36px |
| `space.3` | 12px | | `space.10` | 40px |
| `space.4` | 16px | | `space.11` | 44px |
| `space.5` | 20px | | `space.12` | 48px |
| `space.6` | 24px | | `space.rule` | 4px |

## Radius (`radius.json`)

Named scale (never numeric). Set the design's "corner personality" here.

```json
{ "radius": { "sm": { "value": "10px" }, "md": { "value": "14px" } } }
```

| Token | Default | | Token | Default |
|-------|---------|-|-------|---------|
| `radius.none` | 0px | | `radius.lg` | 16px |
| `radius.xxs` | 2px | | `radius.xl` | 28px |
| `radius.xs` | 4px | | `radius.xxl` | 32px |
| `radius.sm` | 8px | | `radius.pill` | 1000px |
| `radius.md` | 12px | | `radius.circle` | 1000px |
| `radius.base` | 2px | | | |

- **Sharp** design → leave defaults (or lower `sm`/`md`). **Rounded** → raise `sm`/`md`/`lg`. **Pill-heavy** → components should reference `radius.pill`/`radius.circle` (don't change those — keep 1000px).

## Border width (`border.json`) & style (`border-style.json`)

```json
{ "border": { "width": { "1": { "value": "1.5px" } } } }
```
```json
{ "border": { "style": { "base": { "value": "{border.style.dashed.value}" } } } }
```

- Width scale: `base` (1px), `0`–`12` (px = index). Style: `base`, `solid`, `dotted`, `dashed`. There is **no** `border.style.none` — express "no border" with width `0` in component tokens, not here.

## Elevation (`elevation.json`)

Shadow levels `1`–`5` plus `none`. Values are box-shadow strings; the default scale references `{color.shadow.@.value}` for the shadow tint. To make the whole system flatter, lower these; to tint shadows, override `color.shadow.@` instead (cleaner).

```json
{ "elevation": { "shadow": { "1": { "value": "0px 2px 6px 0px {color.shadow.@.value}" } } } }
```

## Icon size (`icon.json`) & opacity (`opacity.json`)

```json
{ "icon": { "size": { "md": { "value": "22px" } } } }
```
```json
{ "opacity": { "focus": { "value": "10%" } } }
```

- Icon sizes: `@` (default 24px), `xs` 12 / `sm` 18 / `md` 24 / `lg` 30 / `2x` 36 / `3x` 42 / `4x` 48 / `5x` 54. Opacity: `focus` (12%), `active` (100%) — percentage strings.

## Adding custom global tokens (only when the user asks)

**Default: leverage existing tokens.** Reuse and override the foundation slots above. Do NOT invent new global tokens on your own — a design need almost always maps to an existing semantic slot (a "brand accent" is usually `tertiary`; an "extra-tight gap" is a `space.*` step). Only add a brand-new global token when the **user explicitly requests** additional/custom tokens (e.g. "add a separate brand-accent color", "add an XL spacing step").

When the user does ask, it is fully supported (verified against the validator and Style Dictionary build):

- A new namespaced path **validates** (the schema accepts new keys), **builds** to a `--wm-…` CSS variable, and **resolves** when referenced (`{your.custom.path.value}`).

But mind the difference in effect — this is the whole reason adding tokens is gated:

- **Overriding an existing foundation slot propagates automatically.** The foundation's own component layer already references slots like `color.primary.@`, so changing them updates widgets app-wide with no extra wiring.
- **A new custom token is inert until something references it.** Nothing reads `color.brand.accent.@` by default. It only takes effect once a component appearance (in `components/**`, via `token-schema`) — or another token — references it. **Always pair a custom token with the appearance(s) that consume it**, or it is dead.

Rules for custom tokens:
- **Namespace cleanly** under the category root with a collision-free name: `color.brand.accent`, `space.gutter`, `radius.card`. Don't shadow an existing foundation path.
- Same shape as any override: value-only string, and for colors the one-object-per-token / `@`-anchor discipline above.
- Provide **light AND dark** for custom colors, same as foundation colors.

```json
{ "color": { "brand": { "accent": { "@": { "value": "#7C3AED" } } } } }
```
→ builds to `--wm-color-brand-accent: #7C3AED`; reference it from a component appearance with `{color.brand.accent.@.value}`.

## Hard rules

1. Override leaves are `{ "value": "<non-empty string>" }` — no `type`/`attributes`. Numbers (weights) are strings.
2. Sparse only — never restate the whole foundation tree.
3. **Colors: one object per token (never repeat a key), and every color leaf — including nested shades — ends in `@` except `color.outline.variant`.** The validator catches neither mistake; re-read the file (color self-check) to confirm.
4. Color goes in `color.light.json` / `color.dark.json` (theme suffix required). All other categories are single mode-less files.
5. Every `{...}` reference must resolve. Leverage existing foundation tokens by default; add new custom global tokens ONLY when the user explicitly asks — then namespace cleanly and reference each from a component appearance (an unreferenced custom token has no effect).
6. Changing a base color requires overriding its `on-*` / `container` companions (formulas are not recomputed) — light AND dark.
7. Keep light/dark in parity: same paths, inverted brightness, legible `on-*` contrast.

## Common mistakes

| Wrong | Right | Why |
|-------|-------|-----|
| `"primary": { "@": {...} }, "primary": { "container": {...} }` (key twice) | one `"primary"` object holding `@` + `container` + shades | JSON keeps only the last → the dropped shade silently reverts to foundation; validator won't catch it |
| `"primary": { "value": "#0E7A5F" }` / `"primary": { "container": { "value": "#…" } }` (no `@`) | wrap in `@`: `"primary": { "@": { "value": "#0E7A5F" } }` / `"container": { "@": { ... } }` | Every color leaf needs `@` (incl. nested shades), except `outline.variant` |
| `"primary": { "@": { "value": "#0E7A5F", "type": "color", "attributes": {...} } }` | `"primary": { "@": { "value": "#0E7A5F" } }` | Overrides are value-only |
| `"font-weight": { "value": 600 }` | `"font-weight": { "value": "600" }` | `value` must be a string |
| `"font": { "body": { "large": {...} } }` | top-level `"body": { "large": {...} }` | Ramp keys are top-level, not under `font` |
| `color.json` (single file) | `color.light.json` / `color.dark.json` | Theme suffix required for color |
| Override `primary.@` only, leave `on-primary.@` | also set `on-primary.@` (+ `container` companions) | Derived colors are not recomputed |
| `{radius.2.value}` | `{radius.sm.value}` | Radius is a named scale, not numeric |
| Minting `color.brandAccent.@` unprompted | reuse/override an existing foundation slot (e.g. `tertiary`) | Default is leverage-existing; add custom tokens only on explicit request, then reference them |
