---
name: container-system
description: >
  WaveMaker container auto-layout system: the 6 mandatory attributes (name, direction, gap, alignment,
  width, height), 9 fixed + 3 auto alignment values, gap mechanics, fill/hug/fixed sizing rules,
  scrollable containers, wrapping rows, and 13 common layout patterns. Load before generating any
  container-heavy section or when layout behaviour is unclear.
---

# WaveMaker Container Auto-Layout System (v8)

## 6 Mandatory Attributes

Every `<wm-container>` MUST have ALL 6 attributes:

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `name` | Unique identifier | Element identification |
| `direction` | `row` or `column` | Layout axis (default: `row`) |
| `gap` | `auto` or numeric (`8`, `16`) | Spacing between children (default: `4`) |
| `alignment` | 9 fixed + 3 auto values | Child positioning (default: `top-left`) |
| `width` | `fill`, `hug`, `Npx`, or `N%` | Container width |
| `height` | `fill`, `hug`, `Npx`, or `N%` | Container height |

## Optional Attributes

| Attribute | Values | Purpose |
|-----------|--------|---------|
| `padding` | CSS shorthand (e.g., `"16"`, `"12 16"`, `"12 16 12 16"`) | Padding — supports 1 value (all), 2 values (vertical horizontal), or 4 values (top right bottom left) |
| `overflow` | `"No scrolling"` (default) or `"Scroll"` | Enables ScrollView wrapping |
| `wrap` | `true` or `false` (default) | Enables flex wrapping (row direction only) |
| `columngap` | `auto` or numeric | Gap between wrapped rows (only with `wrap="true"`) |
| `position` | `relative`, `sticky`, `absolute`, `fixed` | CSS-like positioning |
| `zindex` | number | Z-index for layering |
| `clipcontent` | `true` or `false` | Clips overflow (sets `overflow: hidden`) |
| `positionvalue` | `"top right bottom left"` (CSS shorthand) | Position offsets for absolute/fixed |

### Padding on Containers (IMPORTANT)

Container padding is a **direct markup prop** — NOT an inline style violation. Use it to add inner spacing between the container's edge and its children, matching the design's inner padding:

```xml
<!-- Card-like container with 16px inner padding -->
<wm-container name="card_body" class="container-card" variant="card" direction="column" gap="8" alignment="top-left" width="fill" height="hug" padding="16"></wm-container>

<!-- Container with asymmetric padding (vertical horizontal) -->
<wm-container name="header_row" class="container-header" variant="header" direction="row" gap="8" alignment="middle-left" width="fill" height="hug" padding="12 16"></wm-container>
```

**When to use padding props vs design tokens:**
- **Use `padding` prop** when the padding is structural (same across appearances of this container)
- **Use design tokens** when padding varies per appearance/variant (e.g., compact vs spacious card)
- Both work. Direct props override token values. For close design fidelity, prefer direct props.

## Container vs Widget Property Restrictions

| Property | Container Values | Widget Values |
|----------|-----------------|---------------|
| `width` | `"fill"`, `"hug"`, `"Npx"`, `"N%"` | `"Npx"`, `"N%"` ONLY |
| `height` | `"fill"`, `"hug"`, `"Npx"`, `"N%"` | `"Npx"`, `"N%"` ONLY |

Container-only properties (NEVER on widgets): `direction`, `gap`, `alignment`, `overflow`, `wrap`, `columngap`

## Alignment Values

ALL 9 fixed alignments work for **BOTH** `direction="row"` and `direction="column"`. The naming convention is `{vertical}-{horizontal}`:

### Fixed Alignments (9 values — used with numeric `gap`)

| Value | Row: Main (horiz) | Row: Cross (vert) | Column: Main (vert) | Column: Cross (horiz) |
|---|---|---|---|---|
| `top-left` | flex-start | flex-start | flex-start | flex-start |
| `top-center` | center | flex-start | flex-start | center |
| `top-right` | flex-end | flex-start | flex-start | flex-end |
| `middle-left` | flex-start | center | center | flex-start |
| `middle-center` | center | center | center | center |
| `middle-right` | flex-end | center | center | flex-end |
| `bottom-left` | flex-start | flex-end | flex-end | flex-start |
| `bottom-center` | center | flex-end | flex-end | center |
| `bottom-right` | flex-end | flex-end | flex-end | flex-end |

### Auto Alignments (3 values — used with `gap="auto"`)

| Value | Behavior |
|---|---|
| `start` | space-between + cross-axis flex-start |
| `center` | space-between + cross-axis center |
| `end` | space-between + cross-axis flex-end |

**When `gap="auto"`**, use `start`/`center`/`end` (NOT the 9-value names). These distribute children with space-between on the main axis.

### ⚠️ CRITICAL: alignment vocabulary depends on `gap` (`center` vs `middle-center`)

The WaveMaker runtime has TWO separate alignment lookup tables:
- **`alignmentMatrixFixed`** (used when `gap` is a NUMBER like `0`, `8`, `16`): recognizes ONLY the 9 values above (`top-left`, `top-center`, ..., `bottom-right`).
- **`alignmentMatrixAuto`** (used when `gap="auto"`): recognizes ONLY `start`, `center`, `end`.

**The alignment vocabulary is gap-dependent — a mismatch does NOT error, it silently falls back and renders mis-aligned.** This applies to ALL of `start`/`center`/`end`, not just `center`:

- `start` / `center` / `end` live in `alignmentMatrixAuto` and ONLY resolve with `gap="auto"`. Used with a **numeric** gap they are not found in `alignmentMatrixFixed` → fall back to **`top-left`**.
- the 9 fixed values (`top-left` … `bottom-right`) live in `alignmentMatrixFixed` and ONLY resolve with a **numeric** gap. Used with `gap="auto"` they are not found in `alignmentMatrixAuto` → fall back to **`start`**.

So the alignment value MUST match the gap type. Pick the row that matches your gap:

| Gap | Want… | Correct alignment |
|-----|-------|-------------------|
| numeric (`0`, `8`, `16`) | left | `top-left` / `middle-left` / `bottom-left` |
| numeric | centered | `top-center` / `middle-center` / `bottom-center` |
| numeric | right | `top-right` / `middle-right` / `bottom-right` |
| `auto` (space-between) | cross-axis flex-start | `start` |
| `auto` (space-between) | cross-axis center | `center` |
| `auto` (space-between) | cross-axis flex-end | `end` |

(For numeric gaps the same name works for both `row` and `column` — the runtime swaps justifyContent/alignItems per direction so the visual meaning is preserved.)

**A single element pushed to one side uses a NUMERIC gap + a fixed alignment** (the gap value is irrelevant with one child): right-aligned link → `gap="0" alignment="top-right"`; centered FAB → `gap="0" alignment="middle-center"`. `gap="auto"` is space-BETWEEN — with a single child it sits at the start, so never use `auto` to push a lone element right or center.

**Common bugs** (all silent — the container renders mis-aligned, no error is raised):
- A space-between keyword (`start` / `center` / `end`) on a **numeric**-gap container → falls back to `top-left`. Use a fixed value instead: centered → `middle-center`, right → `top-right` / `middle-right`, left → `top-left` / `middle-left`.
- A fixed value (`top-left` … `bottom-right`) on a `gap="auto"` container → falls back to `start`, ignoring the value. Use `start` / `center` / `end`, or switch to a numeric gap.

## Gap Values

```
gap="auto" (2 children):           gap="auto" (3 children):
┌──────────────────────┐           ┌──────────────────────┐
│ [A] ──────────── [B] │           │ [A] ──── [B] ──── [C]│
└──────────────────────┘           └──────────────────────┘

gap="8" (fixed):                   gap="16" (fixed):
┌──────────────────────┐           ┌──────────────────────┐
│ [A] [B] [C] [D]      │           │ [A]  [B]  [C]        │
└──────────────────────┘           └──────────────────────┘
```

- `gap="auto"` — Space-between. Items pushed to edges. Use when design shows elements at opposite ends of a row. **If two children together span ≥80% of the row width, that is edge-to-edge → `gap="auto"`.** Two action buttons filling a row (e.g., "Transfer Funds" + "Fund Account") are edge-to-edge, NOT a "button group."
- `gap="N"` — Fixed px gap. Use ONLY when all children are clustered on one side. Scale: 4=tight, 8=small, 12=medium, 16=standard, 24=large. NEVER estimate a pixel gap from a screenshot for an edge-to-edge row.

## Alignment Quick Reference

| Layout Pattern | `direction` | `alignment` | `gap` |
|---|---|---|---|
| Header row (title left, icon right) | `row` | `center` | `auto` |
| Header with grouped left + right sections | `row` | `center` | `auto` |
| Button pair (left-flush + right-flush) | `row` | `center` | `auto` |
| Action bar (price left, CTA right) | `row` | `center` | `auto` |
| Key-value rows (label left, value right) | `row` | `center` | `auto` |
| Title row (heading left, action icon right) | `row` | `center` | `auto` |
| Filter/chip row (left-aligned, top) | `row` | `top-left` | `8` |
| Row items vertically centered | `row` | `middle-left` | `8`–`12` |
| List item row (image + details, top-aligned) | `row` | `top-left` | `12` |
| Left-aligned stacked text | `column` | `top-left` | `4`–`8` |
| Centered hero / empty state | `column` | `top-center` | `12`–`16` |
| Icon + label stacked (tab) | `column` | `top-center` | `4` |
| Statistics row (value+label per stat) | `column` | `top-center` | `4` |
| Grid row (multi-column) | `row` | `top-left` | `8` |
| Centered modal / dialog | `column` | `middle-center` | `16` |
| Bottom-anchored content | `column` | `bottom-left` | `8` |
| Horizontally scrollable row | `row` | `middle-left` | `12` |
| Wrapping tag/chip grid | `row` (+ `wrap`) | `top-left` | `8` |

**Alignment naming convention**: `{vertical}-{horizontal}` — e.g., `top-left` = top-aligned vertically + left-aligned horizontally. Works the same for both row and column directions; the system swaps justifyContent/alignItems internally.

**Auto gap note**: When using `gap="auto"`, use `start`/`center`/`end` — these apply space-between on the main axis and position children on the cross axis.

## Width/Height Values

| Value | Behavior | Use Case |
|-------|----------|----------|
| `fill` | Expands to fill parent | Full-width/height sections |
| `hug` | Wraps content | Icon columns, nested details, cards |
| `Npx` | Fixed size | Specific dimensions |
| `N%` | Percentage of parent | Multi-column layouts |

**`fill` behavior depends on parent direction:**
- In row parent: `flexGrow=1, flexShrink=1, minWidth=0` (shares space with siblings)
- In column parent: `alignSelf='stretch'` (stretches to full cross-axis width)
- No parent: `width/height: 100%`

**`hug` behavior depends on parent direction:**
- In row parent: `flexGrow=0, flexBasis='auto', flexShrink=0` (takes only content width, doesn't shrink)
- In column parent: `alignSelf='flex-start'` (takes only content width)

Common patterns:
- `width="fill" height="hug"` — Full-width section (most rows)
- `width="hug" height="hug"` — Compact group (nav tabs, icon columns)
- `width="fill" height="fill"` — Full width and height sections

### Insetting a `fill` element — side gutters come from the PARENT's padding

A `width="fill"` child stretches to its **parent's content box**, so its left/right gap is set by the **parent's horizontal `padding`** — never by anything on the child itself. This is the rule for any element that should sit inset from the edges rather than span them:

- **Content inset, background to the edge** (a card/panel/sheet floating on a colored background, a section with side gutters, anything that must not touch the screen edges while the background does): put the background **and** a horizontal `padding` on the **parent** container. Its `fill` children then inset automatically, and the background still paints edge-to-edge because the padding area is part of the parent's own background.
- **Do NOT inset a `fill` child with `margin`.** `margin` is not a layout lever for these containers (and is not a valid markup attribute — see the screenshot skill's no-inline-styles rule). A `fill` child always resolves to its parent's full content width, so a margin cannot carve out a side gutter; the gap must be reclaimed from the parent via `padding`. The same applies vertically — separate a child from its siblings with the parent's `gap` (or a section's own `padding`), not a margin on the child.
- A `fill` child under a **zero-padding** parent is **edge-to-edge / full-bleed by definition**. If a card or panel renders full-bleed but the design shows the background around it, the cause is missing parent padding — add it to the parent, don't change the child.

## Scrollable Containers

Use `overflow="Scroll"` to make a container scrollable:
- Row direction → horizontal scrolling
- Column direction → vertical scrolling

```xml
<wm-container name="scroll_row" class="app-default-container" direction="row" gap="12" alignment="middle-left" overflow="Scroll" width="fill" height="hug">
  <!-- Horizontally scrollable children -->
</wm-container>
```

## Wrapping Row Layouts

Use `wrap="true"` on row containers to allow children to flow to the next line. Combine with `columngap` to control the vertical gap between wrapped rows:

```xml
<wm-container name="tag_grid" class="app-default-container" direction="row" gap="8" columngap="8" wrap="true" alignment="top-left" width="fill" height="hug">
  <!-- Children wrap to next line when they exceed container width -->
</wm-container>
```

- `columngap="auto"` — Uses space-between for vertical distribution
- `columngap="N"` — Fixed px gap between rows, content aligns to flex-start
- No `columngap` — Rows align to flex-start (prevents RN Web stretch default)

## Layout Patterns

### Pattern 1: Full-Width Row (Edge-to-Edge)
Use for: Headers, toolbars, navigation bars, action bars

```xml
<wm-container name="header" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-label name="title" caption="Title" class="label-title" variant="title"></wm-label>
  <wm-button name="action" caption="Save"></wm-button>
</wm-container>
```

### Pattern 1b: Two-Element Row (Edge-to-Edge Detection)
Use for: Any row with exactly 2 children positioned at opposite ends — button pairs, label + action, price + CTA, title + icon. On narrow screens (375px), the visual gap may look like 12-16px, but if the children are flush against opposite edges of a `width="fill"` row, the intent is `gap="auto"` (space-between), not a fixed pixel gap.

**How to detect**: If the combined natural width of both children is significantly less than the container width and neither child has a percentage/fill width, the row is edge-to-edge.

```xml
<!-- CORRECT: children at opposite ends of the row -->
<wm-container name="actions_row" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-button name="left_action" caption="Action A" class="btn-left" variant="left"></wm-button>
  <wm-button name="right_action" caption="Action B" class="btn-right" variant="right"></wm-button>
</wm-container>

<!-- WRONG: fixed gap pushes both children to the left, leaving dead space on the right -->
<!-- <wm-container name="actions_row" class="app-default-container" direction="row" gap="12" alignment="top-left" width="fill" height="hug"> -->
```

### Pattern 2: Compact Content Group
Use for: Centered content, dialogs, empty states, button groups

```xml
<wm-container name="group" class="app-default-container" direction="column" gap="8" alignment="top-center" width="hug" height="hug">
  <wm-label name="title" caption="Title" class="label-group-title" variant="group-title"></wm-label>
  <wm-label name="desc" caption="Description" class="label-group-desc" variant="group-desc"></wm-label>
  <wm-button name="action" caption="Action"></wm-button>
</wm-container>
```

### Pattern 3: Icon + Label Column
Use for: Navigation tabs, action buttons with stacked icon/text

```xml
<wm-container name="tab" class="app-default-container" direction="column" gap="4" alignment="top-center" width="hug" height="hug">
  <wm-icon name="icon" iconclass="fa fa-home"></wm-icon>
  <wm-label name="label" caption="Home" class="label-tab-label" variant="tab-label"></wm-label>
</wm-container>
```

### Pattern 4: List Item Row
Use for: Product lists, transaction rows, contact lists, chat messages

```xml
<wm-container name="list_item" class="app-default-container" direction="row" gap="12" alignment="middle-left" width="fill" height="hug">
  <wm-picture name="avatar" width="48px" height="48px" shape="circle"></wm-picture>
  <wm-container name="details" class="app-default-container" direction="column" gap="4" alignment="top-left" width="hug" height="hug">
    <wm-label name="title" caption="Title" class="label-item-title" variant="item-title"></wm-label>
    <wm-label name="subtitle" caption="Subtitle" class="label-item-subtitle" variant="item-subtitle"></wm-label>
  </wm-container>
  <wm-button name="action" caption="Action" class="btn-sm" variant="sm"></wm-button>
</wm-container>
```

### Pattern 5: Nested Detail Columns
Use for: Multi-line text in list items, metadata, stacked labels

```xml
<wm-container name="details" class="app-default-container" direction="column" gap="4" alignment="top-left" width="hug" height="hug">
  <wm-label name="primary" caption="Primary Text" class="label-primary" variant="primary"></wm-label>
  <wm-label name="secondary" caption="Secondary Text" class="label-secondary" variant="secondary"></wm-label>
</wm-container>
```

### Pattern 6: Card Container
Use for: Product cards, content cards, dashboard widgets

```xml
<wm-container name="card" class="container-card" variant="card" direction="column" gap="12" alignment="top-left" width="hug" height="hug">
  <wm-picture name="image" width="200px" height="200px" resizemode="cover"></wm-picture>
  <wm-label name="title" caption="Title" class="label-card-title" variant="card-title"></wm-label>
  <wm-label name="desc" caption="Description" class="label-card-desc" variant="card-desc"></wm-label>
  <wm-button name="action" caption="Action" class="btn-primary"></wm-button>
</wm-container>
```

### Pattern 7: Toolbar with Grouped Actions
Use for: Toolbars with left content and right-grouped buttons

```xml
<wm-container name="toolbar" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-button name="back" caption="Back"></wm-button>
  <wm-container name="right_actions" class="app-default-container" direction="row" gap="8" alignment="middle-center" width="hug" height="hug">
    <wm-button name="share" caption="Share"></wm-button>
    <wm-button name="delete" caption="Delete"></wm-button>
  </wm-container>
</wm-container>
```

### Pattern 9: Multi-Column Grid (NEVER use wm-layoutgrid)
Use for: Product grids, image galleries, settings rows, any 2- or 3-column layout

**Rule**: Columns use percentage widths. `gap` sets pixel spacing between children.

**2-column (equal)** — each child `width="48%"`, `gap="8"`:
```xml
<wm-container name="grid_row" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
  <wm-container name="col_1" class="container-product-card" variant="product-card" direction="column" gap="8" alignment="top-left" width="48%" height="hug">
    <wm-picture name="img_1" width="100%" height="160px" resizemode="cover"></wm-picture>
    <wm-label name="name_1" caption="Product Name" class="label-card-title" variant="card-title"></wm-label>
    <wm-label name="price_1" caption="$49" class="label-card-price" variant="card-price"></wm-label>
  </wm-container>
  <wm-container name="col_2" class="container-product-card" variant="product-card" direction="column" gap="8" alignment="top-left" width="48%" height="hug">
    <wm-picture name="img_2" width="100%" height="160px" resizemode="cover"></wm-picture>
    <wm-label name="name_2" caption="Product Name" class="label-card-title" variant="card-title"></wm-label>
    <wm-label name="price_2" caption="$79" class="label-card-price" variant="card-price"></wm-label>
  </wm-container>
</wm-container>
```

**3-column** — each `width="32%"`, `gap="4"`:
```xml
<wm-container name="grid_row" class="app-default-container" direction="row" gap="4" alignment="top-left" width="fill" height="hug">
  <wm-container name="col_1" class="app-default-container" direction="column" gap="4" alignment="top-left" width="32%" height="hug"><!-- content --></wm-container>
  <wm-container name="col_2" class="app-default-container" direction="column" gap="4" alignment="top-left" width="32%" height="hug"><!-- content --></wm-container>
  <wm-container name="col_3" class="app-default-container" direction="column" gap="4" alignment="top-left" width="32%" height="hug"><!-- content --></wm-container>
</wm-container>
```

**Asymmetric** (label 40% + value 60%):
```xml
<wm-container name="info_row" class="app-default-container" direction="row" gap="8" alignment="middle-left" width="fill" height="hug">
  <wm-label name="key" caption="Category" class="label-info-key" variant="info-key" width="40%"></wm-label>
  <wm-label name="val" caption="Outerwear" class="label-info-val" variant="info-val" width="60%"></wm-label>
</wm-container>
```

### Pattern 8: Bottom Navigation Bar
See SKILL.md Page Structure template for placement rules. Two options:
- **`wm-mobile-tabbar`**: outside `<wm-content>`, inside `<wm-page>`
- **Custom container**: `position="fixed" positionvalue="auto auto 0px auto"`, `gap="auto" alignment="center"`

### Pattern 10: Horizontally Scrollable Row
Use for: Category tabs, image galleries, horizontal product lists

```xml
<wm-container name="category_scroll" class="app-default-container" direction="row" gap="12" alignment="middle-left" overflow="Scroll" width="fill" height="hug">
  <wm-button name="cat_1" caption="All" class="btn-pill-active" variant="pill-active"></wm-button>
  <wm-button name="cat_2" caption="Shoes" class="btn-pill" variant="pill"></wm-button>
  <wm-button name="cat_3" caption="Bags" class="btn-pill" variant="pill"></wm-button>
</wm-container>
```

### Pattern 11: Wrapping Tag Grid
Use for: Tag selections, filter chips, skill badges

```xml
<wm-container name="tag_grid" class="app-default-container" direction="row" gap="8" columngap="8" wrap="true" alignment="top-left" width="fill" height="hug">
  <wm-button name="tag_1" caption="React" class="btn-tag" variant="tag"></wm-button>
  <wm-button name="tag_2" caption="TypeScript" class="btn-tag" variant="tag"></wm-button>
  <wm-button name="tag_3" caption="Node.js" class="btn-tag" variant="tag"></wm-button>
  <wm-button name="tag_4" caption="GraphQL" class="btn-tag" variant="tag"></wm-button>
</wm-container>
```

### Pattern 12: Fixed-Position Elements (FAB, Floating Buttons, Overlays)
Only `wm-container` supports `position="fixed"` + `positionvalue`. Wrap any fixed element in a container.

```xml
<wm-container name="fab_wrapper" class="container-fab" variant="fab" direction="row" gap="0" alignment="middle-center" width="56px" height="56px" position="fixed" positionvalue="auto 16px 16px auto">
  <wm-button name="fab_btn" iconclass="fa fa-plus" class="btn-fab" variant="fab"></wm-button>
</wm-container>
```

| Position | `positionvalue` |
|----------|----------------|
| Bottom-right (FAB) | `"auto 16px 16px auto"` |
| Bottom-right (above tab bar) | `"auto 16px 72px auto"` |
| Bottom-center (full width) | `"auto auto 0px auto"` |
| Top-right | `"16px 16px auto auto"` |
| Top-center (full width) | `"0px auto auto auto"` |

### Pattern 13: Image with Text Overlay (Absolute Positioning)
Use for: Hero banners, media cards — text rendered ON TOP of an image (not stacked below).

Parent: `position="relative" clipcontent="true"`. Overlay: `position="absolute"`.

```xml
<wm-container name="hero_wrapper" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug" position="relative" clipcontent="true">
  <wm-picture name="hero_image" picturesource="..." width="100%" height="360px" resizemode="cover"></wm-picture>
  <wm-container name="hero_overlay" class="container-overlay-gradient" variant="overlay-gradient" direction="column" gap="8" alignment="bottom-left" width="fill" height="fill" position="absolute" positionvalue="0px 0px 0px 0px" padding="0 16 20 16">
    <wm-label name="hero_title" caption="Title" class="label-overlay-title" variant="overlay-title"></wm-label>
    <wm-button name="hero_cta" caption="Action" class="btn-overlay-cta" variant="overlay-cta"></wm-button>
  </wm-container>
</wm-container>
```

**Rules**: bottom-anchored = `positionvalue="0px 0px 0px 0px"` + `alignment="bottom-left"`; top-anchored = `positionvalue="0px 0px auto 0px"`; overlay bg = `rgba(0,0,0,0.4-0.6)` for readability; text labels use white/light token colors.

### Pattern 14: Inset Card / Panel on a Full-Bleed Background
Use for: a card, form, or panel that floats on a colored / full-screen background with the background visible as a gap on all sides — e.g. a sign-in card on a branded background, a content sheet on a tinted page.

The background container reaches the screen edges; its **horizontal `padding`** creates the side gutters, and the `width="fill"` card insets into them. The card carries only its own look (radius, shadow, inner `padding`) — it never sets its own side margin.

```xml
<!-- Full-bleed background: paints to the edges; its padding insets every child -->
<wm-container name="page_bg" class="container-page-bg" variant="page-bg" direction="column" gap="24" alignment="top-center" width="fill" height="fill" padding="0 20">
  <wm-container name="hero" class="app-default-container" direction="column" gap="0" alignment="middle-center" width="fill" height="hug" padding="40 0">
    <wm-label name="title" caption="Title" class="label-hero-title" variant="hero-title"></wm-label>
  </wm-container>
  <!-- Floating card: fill width, inset by the parent's 20px horizontal padding -->
  <wm-container name="card" class="container-card" variant="card" direction="column" gap="16" alignment="top-left" width="fill" height="hug" padding="24">
    <!-- card content -->
  </wm-container>
</wm-container>
```

**Rules**: the side gutters come from the **parent's** horizontal `padding` (here `0 20`), NOT a margin on the card; the card's `radius` / `box-shadow` / inner `padding` live in its own variant token; the vertical gap between the background's sections comes from the parent `gap` (or a section's vertical padding), since the card cannot space itself off its siblings with a margin either. A `fill` card with a zero-padding parent renders full-bleed — wrong whenever the design shows the background around it.

**Corner rounding and vertical placement mirror the design — do NOT default to a bottom-sheet shape.** Read two things off the screenshot and reproduce them exactly:
- **Corners**: a card with background visible on *all* sides has **all four corners rounded** — set the variant `radius` to a single value (e.g. `{radius.lg.value}`), not a top-only shorthand. Round only the top corners (`"24px 24px 0px 0px"`) when the panel is genuinely flush against the bottom of the screen.
- **Placement**: if the background shows **above AND below** the card, the card sits in normal flow — keep the preceding section `height="hug"` and let the parent `gap` / section padding space it. Do NOT give a sibling `height="fill"` or set the parent `alignment` to `bottom-*` to shove the card against the bottom edge unless the design actually shows it bottom-pinned. A centered/free-floating card that gets stretched to the bottom reads as a bottom sheet, which is a different component (see `widget-detection.md`).

> **The #1 way this goes wrong: the card's OWN padding does NOT inset the card.** A `fill` card's `padding` pushes its *content* inward but leaves the card itself spanning the full parent width — it stays edge-to-edge. Do **not** write a `width="fill"` card, give it inner `padding`, and call that the inset. The side gap only appears when the **parent** has the horizontal padding (or the card is wrapped in a parent that does). If you planned "inset card → parent padding," the parent container in the markup MUST actually carry that horizontal `padding` — verify it before finishing.
