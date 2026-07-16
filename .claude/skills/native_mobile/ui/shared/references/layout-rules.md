---
name: layout-rules
description: >
  Seven core layout rules for WaveMaker pages: container auto-layout requirement, icon class
  conventions (Font Awesome preferred), size constraints, image source conventions (Pexels),
  design fidelity principles, widget consistency rules, naming conventions, and a Figma-to-WaveMaker
  mapping table. Load at the start of any layout-plan step.
---

# WaveMaker Layout Rules

## Rule 1: Use Container Auto-Layout

Use `<wm-container>` with the 6 mandatory attributes for ALL layouts. Every container MUST have: `name`, `direction`, `gap`, `alignment`, `width`, `height`.

## Rule 2: Icon Classes

### IMPORTANT: Prefer Font Awesome (`fa fa-*`)
Font Awesome has the widest coverage and most reliable rendering. **Always use `fa fa-*` as the default** unless you need a specific confirmed WaveMaker icon.

### ⚠️ Font Awesome version: 4.7 ONLY
WaveMaker renders `fa fa-*` icons with **Font Awesome 4.7** (web/Studio and mobile/RN). **Only use FA 4.7 class names** — FA 5 / FA 6 names do not exist in WaveMaker and render as a blank box. Never emit a modern Font Awesome name; if unsure a name exists in FA 4.7, pick a simpler FA 4.7 icon you are certain of.

### Available Icon Sets
- **Font Awesome (PREFERRED)**: `iconclass="fa fa-{icon-name}"` — Use this for most icons
- **Streamline Light**: `iconclass="wm-sl-l sl-{icon-name}"` — Light weight icons
- **Streamline Regular**: `iconclass="wm-sl-r sl-{icon-name}"` — Regular weight icons
- **WaveMaker Icons**: `iconclass="wi wi-{icon-name}"` — ONLY use confirmed icons listed below

### Icon Sizes (append to any icon class)
- `fa-lg` — 24px
- `fa-2x` — 36px
- `fa-3x` — 48px
- `fa-4x` — 60px
- `fa-5x` — 72px

Example: `iconclass="wm-sl-l sl-android fa-lg"` for 24px Streamline Light Android icon

### Confirmed WaveMaker Icons (wi) — ONLY use these
`wi wi-back`, `wi wi-arrow-back`, `wi wi-chevron-down`, `wi wi-chevron-up`, `wi wi-chevron-left`, `wi wi-chevron-right`, `wi wi-close`, `wi wi-check`, `wi wi-user`, `wi wi-lock`, `wi wi-event`, `wi wi-star`, `wi wi-star-border`

**WARNING**: Do NOT guess `wi` icon names. If a `wi` icon is not in the list above, use the Font Awesome equivalent instead. For example:
- ❌ `wi wi-heart-o` (doesn't exist, renders as "?")  →  ✓ `fa fa-heart-o`
- ❌ `wi wi-plus` (doesn't exist)  →  ✓ `fa fa-plus`
- ❌ `wi wi-minus` (doesn't exist)  →  ✓ `fa fa-minus`
- ❌ `wi wi-search` (doesn't exist)  →  ✓ `fa fa-search`

## Rule 3: Size Constraints
Children elements cannot exceed their parent's dimensions.

## Rule 4: Image Sources
Use Pexels as primary image source: `picturesource="https://images.pexels.com/photos/{photo-id}/pexels-photo-{photo-id}.jpeg"`
Always use fixed width and height on picture widgets.

## Rule 5: Design Accuracy
- Match exact colors (hex codes) from the Figma design
- Match exact border radius values
- Match exact spacing (padding, margin, gap)
- Match exact font sizes, weights, families
- Match exact layout positioning and alignment

## Rule 6: Widget Consistency
Use the same widget type for the same function throughout the page. Never use `<wm-container>` or `<wm-label>` styled as buttons — always use `<wm-button>`.

## Rule 7: Naming Convention
- Use descriptive, unique names for all elements
- Use snake_case for names
- Group related elements with common prefixes (e.g., `header_title`, `header_icon`, `header_action`)

## Figma-to-WaveMaker Mapping

### Figma Auto Layout → WaveMaker Container
- Figma `direction: horizontal` → `direction="row"`
- Figma `direction: vertical` → `direction="column"`
- Figma `gap: N` → `gap="N"`
- Figma `padding` → set via container styles or inner spacing
- Figma `align items: center` → `alignment="middle-left"` (for row) or `alignment="top-center"` (for column)
- Figma `justify content: space-between` → `gap="auto"`
- Figma `wrap` → `wrap="true"` (row direction only)
- Figma `overflow: scroll` → `overflow="Scroll"`
- Figma `clip content` → `clipcontent="true"`

### Figma Alignment → WaveMaker Alignment
All 9 alignment values work for BOTH row and column directions. Naming is `{vertical}-{horizontal}`:
- Figma top-left → `alignment="top-left"`
- Figma center-center → `alignment="middle-center"`
- Figma bottom-right → `alignment="bottom-right"`
- With space-between → `gap="auto"` + `alignment="start|center|end"`

### Figma Constraints → WaveMaker Width/Height
- Figma `fill container` → `width="fill"` or `height="fill"`
- Figma `hug contents` → `width="hug"` or `height="hug"`
- Figma `fixed: N` → `width="Npx"` or `height="Npx"`

### Figma Components → WaveMaker Widgets
- Text layers → `<wm-label>`
- Buttons → `<wm-button>`
- Input fields → `<wm-text>`, `<wm-textarea>`, `<wm-select>`, etc.
- Images → `<wm-picture>`
- Icons → `<wm-icon>`
- Frames/Auto Layout → `<wm-container>`
- Grid/Columns → `<wm-container direction="row">` with child widths (**NEVER** `wm-layoutgrid`)
- Forms → `<wm-form>` with `<wm-form-field>`
