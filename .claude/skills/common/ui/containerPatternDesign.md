---
name: containerPatternDesign
description: Defines few wm-container markup design templates. Apply correct layout patterns when generating wm-container or wm-listtemplate structures. Use when designing container layouts or list item templates.
---

# Skill: Container Pattern Design

## Context
These are layout patterns using `wm-container` with WaveMaker autolayout.
Every `wm-container` must carry all 7 mandatory autolayout attributes:
`name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`.

`wm-container` is the primary layout primitive — use it for structural grouping, positioning, and spacing. Do not use CSS inline styles for layout; use autolayout attributes instead.

> **HARD RULE:** `wm-container`, `wm-list`, and `wm-listtemplate` MUST always carry all 7 autolayout attributes: `name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`. Missing any one causes broken layout. When implementing from a screenshot, always analyse the visual design to derive the correct value for each — never use defaults or omit them.

## Autolayout Quick Reference

```
direction="row"    → children left → right
direction="column" → children top  → bottom

width="fill"  → expands to 100% of parent
width="hug"   → shrinks to fit children
width="Npx"   → fixed pixel width

height="fill" → expands to full height of parent
height="hug"  → shrinks to fit children
height="Npx"  → fixed pixel height

gap="auto"    → space-between (push children to opposite ends)
gap="N"       → fixed Npx spacing between all children

alignment="center"        → use ONLY with gap="auto"
alignment="middle-center" → use with numeric gap for fully-centered layout
alignment="middle-left"   → vertically centered, left-aligned (most row toolbars)
alignment="top-left"      → default stacked column or left-aligned row

wrap="true"   → children wrap to next line (row only); use columngap for row spacing

FILL/HUG SCOPE: Only wm-container, wm-list, and wm-listtemplate support "fill" and "hug".
For all other widgets (wm-button, wm-label, wm-picture, wm-text, etc.) use px or % values instead.

BORDER STYLING: borderradius, borderwidth, and bordercolor are NOT valid inline props on wm-container.
Apply them via a component variant or a page CSS class instead.
```

---

## Pattern 1 — Basic Row

```
┌─────────────────────────────────────┐
│  [child]  [child]  [child]          │
└─────────────────────────────────────┘
  direction=row, gap=4, alignment=top-left
  width=fill, height=hug
```

**Use for:** Minimal starting point for any horizontal layout. Swap `gap` and `alignment` to suit the use case.

```xml
<wm-container name="container1" class="app-container-default app-container-baseview"
    direction="row" gap="4" alignment="top-left"
    width="fill" height="hug"
    variant="baseview">
</wm-container>
```

---

## Pattern 2 — Compact Row Toolbar

```
┌──────────────────────┐
│ [icon] [icon] [icon] │   ← hugs content, single non-wrapping line
└──────────────────────┘
  direction=row, gap=8, alignment=middle-left
  width=hug, height=hug, wrap=false
```

**Use for:** Compact toolbars housing inline icon or image elements. Everything stays on one line; the container sizes exactly to its children.

```xml
<wm-container name="rowToolbar" class="app-container-default"
    direction="row" gap="8" alignment="middle-left"
    width="hug" height="hug"
    wrap="false" padding="8"
    on-click="containerRowToolbarClick($event, widget)">

    <wm-picture name="icon1" resizemode="cover"
        class="img-rounded" variant="default:rounded">
    </wm-picture>
    <wm-picture name="icon2" resizemode="cover"
        class="img-rounded" variant="default:rounded">
    </wm-picture>

</wm-container>
```

---

## Pattern 3 — Full-Width Header Bar

```
┌──────────────────────────────────────────────────────┐
│ [left-group]          ←gap=auto→          [right-group] │
└──────────────────────────────────────────────────────┘
  direction=row, gap=auto, alignment=center
  width=fill, height=hug
```

**Use for:** Header bars with left, center, and right grouped elements. `gap="auto"` distributes children evenly (space-between). Nest inner row containers to group controls on each side.

```xml
<wm-container name="headerBar" class="app-container-default bordered"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug"
    position="relative" backgroundcolor="#f5f5f5" animation="fadeIn">

    <!-- left group -->
    <wm-picture name="brandLogo" resizemode="contain"
        class="img-rounded" variant="default:rounded">
    </wm-picture>

    <!-- center group (optional — nest a hug row container) -->

    <!-- right group -->
    <wm-container name="rightActions" class="app-container-default"
        direction="row" gap="8" alignment="middle-right"
        width="hug" height="hug">
        <wm-button name="btnAction" caption="Action" class="btn-default"></wm-button>
    </wm-container>

</wm-container>
```

---

## Pattern 4 — Form Fields Column

```
┌─────────────────────────────────────────┐
│                            [field 1]   │
│                            [field 2]   │  ← children anchored to right edge
│                            [field 3]   │
└─────────────────────────────────────────┘
  direction=column, gap=16, alignment=top-right
  width=fill, height=hug
```

**Use for:** Form field layouts where inputs are stacked vertically in a right-aligned arrangement. Change `alignment` to `top-left` for the standard left-aligned form column.

```xml
<wm-container name="formFieldsColumn" class="app-container-default"
    direction="column" gap="16" alignment="top-right"
    width="fill" height="hug"
    position="relative" positionvalue="auto auto auto auto">

    <wm-text name="field1" caption="Label" class="app-composite-role-caption"></wm-text>
    <wm-text name="field2" caption="Label" class="app-composite-role-caption"></wm-text>

</wm-container>
```

---

## Pattern 5 — Stacked Sections Column

```
┌─────────────────────────────┐
│  [section A]                │
│  [section B]                │  ← stacks top→bottom, smooth scroll, no clip
│  [section C]                │
└─────────────────────────────┘
  direction=column, gap=16, alignment=top-left
  width=fill, height=hug, smoothscroll=true
```

**Use for:** Stacking grouped content sections or blocks vertically. `smoothscroll="true"` and `clipcontent="false"` let the parent scroll container manage overflow.

```xml
<wm-container name="stackMain" class="app-container-default"
    direction="column" gap="16" alignment="top-left"
    width="fill" height="hug"
    smoothscroll="true" margin="0"
    clipcontent="false" overflow="none">

    <!-- section A -->
    <!-- section B -->

</wm-container>
```

---

## Pattern 6 — Wrapping Chip / Tag Row

```
┌───────────────────────────────────────────────┐
│ [chip] [chip] [chip] [chip] [chip] [chip]     │
│ [chip] [chip] [chip]                          │  ← wraps onto new lines
└───────────────────────────────────────────────┘
  direction=row, gap=12, wrap=true, columngap=12
  width=fill, height=hug, alignment=top-left
```

**Use for:** Chip groups, tag lists, badge collections where items flow naturally across multiple rows. Set `gap` and `columngap` to the same value for equal horizontal and vertical spacing.

```xml
<wm-container name="chipWrap" class="app-container-default"
    direction="row" gap="12" alignment="top-left"
    width="fill" height="hug"
    wrap="true" columngap="12">

    <wm-button name="chip1" caption="Tag A" class="btn-chip" variant="chip"></wm-button>
    <wm-button name="chip2" caption="Tag B" class="btn-chip" variant="chip"></wm-button>
    <wm-button name="chip3" caption="Tag C" class="btn-chip" variant="chip"></wm-button>

</wm-container>
```

---

## Pattern 7 — Fixed-Height Scroll Region

```
┌─────────────────────────────┐  ← height=200px, clip boundary
│  [row]                      │
│  [row]                      │
│  [row]  ↕ scrolls           │
│  [row]                      │
└─────────────────────────────┘
  direction=column, gap=8, alignment=top-left
  width=fill, height=200px
  clipcontent=true, overflow=vertical, position=relative
```

**Use for:** Scrollable lists, feeds, or overflow content regions with a constrained visible area. The fixed height creates the clip boundary; `overflow="vertical"` enables the scrollbar.

```xml
<wm-container name="scrollRegion" class="app-container-default"
    direction="column" gap="8" alignment="top-left"
    width="fill" height="200px"
    clipcontent="true" overflow="vertical" position="relative">

    <!-- repeated row children -->

</wm-container>
```

**Note:** For a scroll region that fills its parent instead of using a fixed pixel height, use `height="fill"` on this container and ensure the parent has a bounded height.

---

## Pattern 8 — Branded Panel with Background Image

```
┌──────────────────────┐
│   [logo / content]   │  ← fixed 300×100, bg image centered
└──────────────────────┘
  direction=row, gap=4, alignment=middle-center
  width=300, height=100
  backgroundimage, backgroundrepeat=no-repeat
```

**Use for:** Branded panels, logo display containers, hero banners with a background image. Children are centered over the background.

```xml
<wm-container name="brandedPanel" class="app-container-default"
    direction="row" gap="4" alignment="middle-center"
    width="300" height="100"
    backgroundimage="resources/images/logos/wavemaker_logo.png"
    backgroundrepeat="no-repeat"
    backgroundposition="20px"
    backgroundsize="60px 60px"
    clipcontent="false" position="relative"
    positionvalue="0px auto auto 0px">
</wm-container>
```

---

## Pattern 9 — Sticky Subheader Bar

```
  ↑ page scrolls past this point
┌──────────────────────────────────────┐  ← sticks at top of scroll container
│ [icon]  Section Title  [action]      │
└──────────────────────────────────────┘
  position=sticky, positionvalue=0, zindex=5
  direction=row, gap=8, alignment=middle-left
  width=fill, height=hug
```

**Use for:** Sticky subheaders or persistent section bars that pin to the top of their nearest scroll ancestor. Set `zindex` above siblings; increase `positionvalue` (e.g. `"56px auto auto auto"`) to offset below a fixed top nav.

```xml
<wm-container name="stickySubheader" class="app-container-default alert-info"
    direction="row" gap="8" alignment="middle-left"
    width="fill" height="hug"
    position="sticky" positionvalue="0" zindex="5"
    clipcontent="false" overflow="none">

    <wm-picture name="icon" resizemode="cover"
        class="img-rounded" variant="default:rounded">
    </wm-picture>
    <wm-label name="sectionTitle" caption="Section" class="h5" type="h5"></wm-label>

</wm-container>
```

**Stacked sticky tiers:** When multiple sticky rails sit inside the same scroll container, assign descending `zindex` values to lower tiers and offset their `positionvalue` by the cumulative height of rails above them so each rail tucks under the one above it.

---

## Pattern 10 — Absolute Modal / Overlay Backdrop

```
  [page content]
  ┌──────────────────────────────────────┐  ← position=absolute, top:150px
  │                                      │    zindex=200, full width
  │        [dialog / sheet]              │
  │                                      │
  └──────────────────────────────────────┘
  direction=column, gap=16, alignment=middle-center
  width=fill, height=hug
  position=absolute, positionvalue="150px 0px 0px 0px", zindex=200
  clipcontent=true, overflow=vertical
```

**Use for:** Modals, overlays, bottom sheets, or floating panel regions. The `positionvalue` top offset determines how far from the top of the nearest positioned ancestor the overlay begins.

```xml
<wm-container name="modalBackdrop" class="app-container-default"
    direction="column" gap="16" alignment="middle-center"
    width="fill" height="hug"
    position="absolute" positionvalue="150px 0px 0px 0px"
    zindex="200" clipcontent="true" overflow="vertical">

    <!-- dialog content -->
    <wm-container name="dialogCard" class="app-container-default"
        direction="column" gap="8" alignment="top-left"
        width="hug" height="hug"
        clipcontent="false" overflow="none">
        <wm-button name="btnClose" caption="Close" class="btn-default"></wm-button>
    </wm-container>

</wm-container>
```

---

## Pattern 11 — Fixed Bottom Action Bar

```
  ░░░░░░░░░░ page content scrolls ░░░░░░░░░░
┌──────────────────────────────────────────────┐  ← pinned to bottom of viewport
│  [label]         [action A]   [action B]     │
└──────────────────────────────────────────────┘
  position=fixed, positionvalue="auto auto 0px 0px"
  direction=row, gap=12, alignment=middle-center
  width=fill, height=hug, zindex=50
```

**Use for:** Bottom action bars, footer toolbars, persistent CTA buttons. `positionvalue="auto auto 0px 0px"` pins the bar flush to the bottom of the viewport regardless of scrolling.

Add bottom padding to the page content container matching the bar height (typically `padding="0 0 56px 0"`) so the last content row is not hidden under the bar.

```xml
<wm-container name="bottomActionBar" class="app-container-default bordered"
    direction="row" gap="12" alignment="middle-center"
    width="fill" height="hug"
    position="fixed" positionvalue="auto auto 0px 0px"
    zindex="50" padding="16">

    <wm-label name="barLabel" caption="Summary text"
        class="p" type="p" variant="default:p">
    </wm-label>
    <wm-button name="btnPrimary" caption="Confirm" class="btn-primary"></wm-button>
    <wm-button name="btnSecondary" caption="Cancel" class="btn-default"></wm-button>

</wm-container>
```

---

## Positioning Reference

```
position="relative"  → default; element stays in document flow
position="sticky"    → sticks within nearest scroll ancestor (not the viewport)
position="absolute"  → removed from flow; placed relative to nearest positioned ancestor
position="fixed"     → removed from flow; placed relative to the viewport

positionvalue format: "top right bottom left"  (use "auto" for unset sides)

Common positionvalue presets:
  Full-width top bar (fixed/sticky)     → "0px auto auto auto"   (or just "0")
  Full-width bottom bar (fixed)         → "auto auto 0px 0px"
  Full-width bottom bar (flush)         → "auto 0px 0px 0px"
  Offset below 56px fixed header        → "56px auto auto auto"
  Absolute overlay from top:150px       → "150px 0px 0px 0px"
  Bottom-right FAB (fixed)              → "auto 16px 16px auto"
  Bottom-right FAB above tab bar        → "auto 16px 72px auto"
```

---

## Pattern Decision Guide

```
Simple horizontal grouping                    → Pattern 1 (Basic Row)
Compact icon/action toolbar (hug size)        → Pattern 2 (Compact Row Toolbar)
Header bar with left/right groups             → Pattern 3 (Full-Width Header Bar)
Stacked form fields or inputs                 → Pattern 4 (Form Fields Column)
Stacked content sections, smooth scroll       → Pattern 5 (Stacked Sections Column)
Chip, tag, or badge row that wraps            → Pattern 6 (Wrapping Chip Row)
Scrollable region with bounded height         → Pattern 7 (Fixed-Height Scroll Region)
Panel with background image                   → Pattern 8 (Branded Panel)
Bar that sticks while page scrolls            → Pattern 9 (Sticky Subheader Bar)
Modal, overlay, or floating sheet             → Pattern 10 (Absolute Modal Backdrop)
Bar pinned to bottom/top of viewport          → Pattern 11 (Fixed Bottom Action Bar)
```
