---
name: wavemaker-bottomsheet
description: >
  WaveMaker BottomSheet widget for React Native. Covers markup structure, all props, visual
  patterns (action sheet, form sheet, expandable, sticky), trigger/dismiss mechanics, events,
  programmatic API, and design token authoring. Use when generating WaveMaker bottomsheet markup,
  creating bottomsheet tokens, or when the design contains a panel sliding up from the bottom.
  Also trigger alongside screenshot-to-wavemaker or figma-to-wavemaker when the design contains
  a bottom sheet. Trigger phrases: "wm-bottomsheet", "bottom sheet", "action sheet", "slide up
  panel", "bottom drawer", "options sheet", "filter sheet", "sheet panel".
sub-skills:
  - bottomsheet-markup
  - container-system
---

# WaveMaker BottomSheet Component

Generate correct WaveMaker bottomsheet markup. This skill covers `wm-bottomsheet` for all bottom-panel UI patterns.

**Markup examples**: `bottomsheet-markup` — complete examples for each pattern.

---

## 1. When to Use BottomSheet

| Design Pattern | Use BottomSheet |
|---|---|
| Panel slides up from bottom edge with drag handle + shadow | ✅ Yes |
| "Share / Copy / Delete" action list triggered by a button tap | ✅ Yes |
| Filter / sort options panel triggered by a button | ✅ Yes |
| Form inputs that appear on a trigger (add comment, quick edit) | ✅ Yes |
| Content that expands on upward swipe to reveal more | ✅ Yes |
| Sticky info panel (no scroll, no dismiss by swipe) | ✅ Yes |
| Centered popup with title + actions | ❌ No — use `wm-dialog` |
| Dropdown anchored to a button | ❌ No — use `wm-popover` |
| Element fixed to bottom of page content (not overlaying) | ❌ No — use `wm-container position="fixed"` |

---

## 2. Anatomy

```
┌─────────────────────────────────────────┐
│                                         │
│           [ page content ]              │
│                                         │
│                                         │  ← backdrop barely visible (rgba 0,0,0,0.1)
╠═════════════════════════════════════════╣  ← shadow at sheet top edge
│                ━━━━━━━                  │  ← drag handle pill (auto-rendered)
│─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                         │
│           [ sheet content ]             │
│                                         │
└─────────────────────────────────────────┘

═══  shadow at sheet top edge — primary visual cue that sheet overlays the page
━━━  drag handle pill — swipe ↓ to close, swipe ↑ to expand (when expand="true")
     backdrop is nearly invisible by default; tap anywhere above sheet still closes it
```

---

## 3. Markup Structure

### Minimal

```xml
<wm-bottomsheet name="options_sheet" bottomsheetheightratio="0.35">
  <!-- content goes directly here — built-in ScrollView wraps it automatically -->
</wm-bottomsheet>
```

> ⚠️ **Sheet does NOT open on its own.** Call `Widgets.options_sheet.open()` from a trigger button's `on-tap`.
> ⚠️ **Do NOT nest a `ScrollView` or `wm-container overflow="Scroll"` inside** — the sheet provides its own internal `ScrollView`.

### Full (all common props)

```xml
<wm-bottomsheet name="filter_sheet"
  bottomsheetheightratio="0.5"
  expand="true"
  bottomsheetexpandedheightratio="0.85"
  autoclose="outsideClick"
  disableswipedownclose="false"
  disablescrollonrest="true"
  modal="true"
  class="bottomsheet-filter" variant="filter"
  on-opened="filter_sheetOpened(widget)"
  on-close="filter_sheetClose(widget)">
  <!-- sheet content -->
</wm-bottomsheet>
```

---

## 4. Props Reference

| Prop | Default | Notes |
|---|---|---|
| `name` | — | Required. Widget identifier used in `Widgets.<name>.open()` |
| `bottomsheetheightratio` | `0.3` | Height as fraction of screen (0–1). **Default is 0.3 (30%), NOT 0.5** |
| `showonrender` | `false` | Open sheet immediately on page load — use only for page-load sheets |
| `expand` | `false` | Enable two-height mode; upward swipe on handle expands the sheet |
| `bottomsheetexpandedheightratio` | `0.5` | Expanded height ratio (min `0.5`, clamped by runtime) |
| `modal` | `true` | Render as RN Modal — overlays tab bar and navbar. Set `false` to keep tab bar visible |
| `autoclose` | `outsideClick` | `outsideClick` closes on backdrop tap; `disabled` prevents tap-to-close |
| `disableswipedownclose` | `false` | Prevent swipe-down-to-dismiss gesture |
| `issticky` | `false` | Disable all internal scrolling (for short fixed-content sheets) |
| `disablescrollonrest` | `false` | Block scroll at collapsed height; scroll enabled only when expanded |
| `enabledragsettle` | `false` | Sheet settles at dragged position instead of snapping back/closed |
| `bottomsheetminimumheight` | `0.1` | Minimum height ratio when `disableswipedownclose="true"` |
| `enablemodalsupport` | `true` | Allow `wm-dialog` / `wm-popover` to render inside the sheet |
| `keyboardverticaloffset` | `100` | Vertical offset adjustment when keyboard appears |

---

## 5. Visual Patterns

### Height ratios

```
      0.3 (default)         0.5                   0.85
   ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
   │               │     │               │     │               │
   │ page content  │     │ page content  │     ╠═══════════════╣
   │               │     │               │     │    ━━━━━      │
   │               │     │               │     │               │
   │               │     │               │     │  tall content │
   ╠═══════════════╣     ╠═══════════════╣     │               │
   │    ━━━━━      │     │    ━━━━━      │     │               │
   │ short content │     │ medium content│     │               │
   └───────────────┘     └───────────────┘     └───────────────┘
   action lists,          forms, filters,       full-detail views,
   quick menus            sort options          long content
```

### Expandable mode (`expand="true"`)

```
   collapsed (ratio=0.5)       expanded (expandedheightratio=0.85)

   ┌───────────────┐             ┌───────────────┐
   │               │             │               │
   │ page content  │    swipe    ╠═══════════════╣
   │               │      ↑      │    ━━━━━      │
   │               │  on handle  │               │
   ╠═══════════════╣             │  full content │
   │    ━━━━━      │             │  now visible  │
   │ partial view  │             │               │
   │  (scroll off) │             │               │
   └───────────────┘             └───────────────┘

   disablescrollonrest="true"  →  content not scrollable at collapsed height
   Widgets.<name>.expandBottomSheet()  →  expand programmatically
   Widgets.<name>.collapseBottomSheet()  →  return to collapsed height
```

---

## 6. Trigger & Dismiss

### Opening (mandatory — sheet does NOT open on its own)

```xml
<!-- Trigger button anywhere on the page -->
<wm-button name="open_btn" caption="More Options" iconclass="fa fa-ellipsis-v"
  on-tap="Widgets.options_sheet.open()"></wm-button>
```

Use `showonrender="true"` only when the sheet must appear immediately on page load.

### Closing options

| Method | How |
|---|---|
| Swipe down on sheet | Default (`disableswipedownclose="false"`) |
| Tap backdrop | Default (`autoclose="outsideClick"`) |
| Close button inside sheet | `on-tap="Widgets.<name>.close()"` on a `wm-button` |
| After form submit | `Widgets.<name>.close()` in script |
| Android hardware back | Handled automatically — closes sheet or top-most modal inside it |

---

## 7. Events & Programmatic API

### Events

| Event | Fires when |
|---|---|
| `on-opened` | Sheet fully slides into view |
| `on-close` | Sheet fully closes |
| `on-expand` | Sheet reaches `bottomsheetexpandedheightratio` (only with `expand="true"`) |
| `on-collapse` | Sheet returns from expanded to default height |
| `on-draghandleiconclick` | Drag handle pill is tapped (not dragged) |

### Programmatic API

```js
Widgets.<name>.open()                // open the sheet
Widgets.<name>.close()               // close the sheet
Widgets.<name>.expandBottomSheet()   // expand to bottomsheetexpandedheightratio
Widgets.<name>.collapseBottomSheet() // collapse back to bottomsheetheightratio
Widgets.<name>.isSheetExpanded()     // returns true if currently expanded
```

---

## 8. Design Token Authoring

Token file: `tokens/bottomsheet/bottomsheet.json`
Class/variant on markup: `class="bottomsheet-<name>" variant="<name>"`

```json
{
  "bottomsheet": {
    "appearances": {
      "<appearance-name>": {
        "mapping": {
          "background": { "value": "#F8F8F8ff", "type": "color" },
          "border": {
            "radius": { "value": "20", "type": "radius" }
          },
          "backdrop": {
            "background": { "value": "rgba(0,0,0,0.4)", "type": "color" }
          },
          "handle": {
            "background": { "value": "#F8F8F8ff", "type": "color" },
            "icon": {
              "background": { "value": "#C0C0C0ff", "type": "color" }
            }
          },
          "content": {
            "padding": { "value": "0 16 24", "type": "space" }
          }
        }
      }
    }
  }
}
```

### Token parts reference

| Token path | Default | Controls |
|---|---|---|
| `background` | `{color.surface.bright.@.value}` | Sheet background color |
| `border.radius` | `{radius.lg.value}` | Top-left + top-right corner radius (≈28px) |
| `border.width` | `{border.width.0.value}` | Sheet border width (0 = no border) |
| `border.color` | `transparent` | Sheet border color |
| `border.style` | `{border.style.base.value}` | Sheet border style |
| `margin` | `0 0` | Sheet outer margin (top/bottom, left/right) |
| `width` | `100%` | Sheet width |
| `backdrop.background` | `rgba(0,0,0,0.1)` | Backdrop overlay color (nearly invisible by default) |
| `handle.background` | `{color.surface.bright.@.value}` | Drag handle area background |
| `handle.padding` | `{space.4.value} 0` | Drag handle area padding (top/bottom, sides) |
| `handle.border.width` | `1` | Handle area bottom border thickness |
| `handle.border.color` | `transparent` | Handle area bottom border color |
| `handle.icon.width` | `{space.9.value}` | Drag handle pill width (≈36px) |
| `handle.icon.height` | `{space.1.value}` | Drag handle pill height (≈4px) |
| `handle.icon.background` | `{color.outline.@.value}` | Drag handle pill color |
| `content.padding` | `0 {space.5.value} {space.5.value}` | Content padding (top, sides, bottom) ≈ 0/20/20 |

**Override when:**
- Design shows **colored sheet** → override `background` (default is surface-bright/white)
- Design shows **smaller top radius** → override `border.radius` (default ≈28px is very rounded)
- Design shows **darker backdrop** → override `backdrop.background` (default is nearly invisible)
- Design shows **no visible drag handle pill** → override `handle.icon.background` to `transparent`
- Design shows **content flush to sheet edges** → override `content.padding` to remove 20px horizontal default
- Design shows **separator line below handle area** → override `handle.border.color` (default is `transparent`)

---

## 9. BottomSheet Markup Checklist

- [ ] `wm-bottomsheet` used (NOT a `position="fixed"` container, NOT `wm-dialog`, NOT `wm-popover`)
- [ ] `name` set — required for `Widgets.<name>.open()` / `Widgets.<name>.close()`
- [ ] `bottomsheetheightratio` matches the fraction of screen the design shows (default `0.3`)
- [ ] Trigger button wired: `on-tap="Widgets.<name>.open()"` — sheet does NOT open on its own
- [ ] No nested `ScrollView` or `overflow="Scroll"` container inside — built-in ScrollView handles it
- [ ] `modal="false"` set if the design shows the tab bar visible behind the open sheet
- [ ] `autoclose="disabled"` set if the sheet must not close on backdrop tap (e.g., mandatory form)
- [ ] `disableswipedownclose="true"` set if swipe-down-to-dismiss is not in the design
- [ ] `expand="true"` + `bottomsheetexpandedheightratio` set if design shows a two-height sheet
- [ ] `disablescrollonrest="true"` set if content should only scroll after expanding
- [ ] `issticky="true"` set if the sheet has no scrollable content at all
- [ ] If tokens needed: `class="bottomsheet-<name>"` + `variant="<name>"` on `wm-bottomsheet`, token file at `tokens/bottomsheet/bottomsheet.json`
- [ ] Close button inside sheet (if design shows one): `on-tap="Widgets.<name>.close()"`
