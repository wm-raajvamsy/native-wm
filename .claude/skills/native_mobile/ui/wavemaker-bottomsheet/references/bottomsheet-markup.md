---
name: bottomsheet-markup
description: >
  wm-bottomsheet markup patterns with full XML and prop explanations: action list sheet, expandable
  filter sheet with header and scroll content, form sheet with keyboard-avoidance configuration, and
  sticky info sheet. Covers snap points, handle visibility, backdrop behaviour, and content slot
  layout rules. Load before writing any wm-bottomsheet markup.
---

# BottomSheet Markup Reference

## Action List Sheet (short — 30–35% height)

Typical "Share / Copy / Delete" pattern. Trigger button calls `Widgets.options_sheet.open()`.

```xml
<!-- Trigger — placed anywhere in the page markup -->
<wm-button name="more_btn" caption="More" iconclass="fa fa-ellipsis-v"
  on-tap="Widgets.options_sheet.open()"></wm-button>

<!-- Sheet — placed outside all page containers, as a direct child of wm-page-content -->
<wm-bottomsheet name="options_sheet" bottomsheetheightratio="0.35" autoclose="outsideClick">
  <wm-container name="sheet_body" class="app-default-container" direction="column" gap="0"
    alignment="top-left" width="fill" height="hug">
    <wm-label name="sheet_title" caption="Options" class="label-sheet-title" variant="sheet-title"></wm-label>
    <wm-button name="sheet_share" caption="Share" iconclass="fa fa-share-alt"
      class="btn-sheet-action" variant="sheet-action"></wm-button>
    <wm-button name="sheet_copy" caption="Copy Link" iconclass="fa fa-copy"
      class="btn-sheet-action" variant="sheet-action"></wm-button>
    <wm-button name="sheet_delete" caption="Delete" iconclass="fa fa-trash"
      class="btn-sheet-delete" variant="sheet-delete"></wm-button>
  </wm-container>
</wm-bottomsheet>
```

---

## Expandable Sheet (filter / sort — 50% → 85%)

`expand="true"` enables two height levels. `disablescrollonrest="true"` prevents accidental scroll at collapsed height — content only scrolls after the user swipes up to expand.

```xml
<wm-button name="filter_btn" caption="Filter" iconclass="fa fa-sliders"
  on-tap="Widgets.filter_sheet.open()"></wm-button>

<wm-bottomsheet name="filter_sheet"
  bottomsheetheightratio="0.5"
  expand="true"
  bottomsheetexpandedheightratio="0.85"
  autoclose="outsideClick"
  disablescrollonrest="true">
  <wm-container name="filter_body" class="app-default-container" direction="column" gap="16"
    alignment="top-left" width="fill" height="hug">
    <wm-container name="filter_header" class="app-default-container" direction="row" gap="auto"
      alignment="center" width="fill" height="hug">
      <wm-label name="filter_heading" caption="Filter Results"
        class="label-filter-heading" variant="filter-heading"></wm-label>
      <wm-button name="filter_close" iconclass="wi wi-close" class="btn-sheet-close" variant="sheet-close"
        on-tap="Widgets.filter_sheet.close()"></wm-button>
    </wm-container>
    <wm-label name="category_label" caption="Category" class="label-filter-section" variant="filter-section"></wm-label>
    <wm-chips name="category_chips"
      dataset="bind:Variables.categoryOptions.dataSet"
      datafield="dataValue" displayfield="dataValue"
      selectionmode="multiple" class="chips-filter" variant="filter"></wm-chips>
    <wm-label name="price_label" caption="Price Range" class="label-filter-section" variant="filter-section"></wm-label>
    <wm-slider name="price_slider" minvalue="0" maxvalue="1000"></wm-slider>
    <wm-button name="apply_btn" caption="Apply Filters" class="btn-cta" variant="cta"
      on-tap="Widgets.filter_sheet.close()"></wm-button>
  </wm-container>
</wm-bottomsheet>
```

---

## Form Sheet with Keyboard Avoidance (input fields)

When the sheet contains text inputs, keyboard avoidance is built-in — sheet height auto-adjusts when the keyboard appears. No extra `KeyboardAvoidingView` or `wm-container overflow="Scroll"` needed. `autoclose="disabled"` + `disableswipedownclose="true"` prevents accidental dismissal mid-form.

```xml
<wm-button name="comment_btn" caption="Add Comment" iconclass="fa fa-comment"
  on-tap="Widgets.comment_sheet.open()"></wm-button>

<wm-bottomsheet name="comment_sheet"
  bottomsheetheightratio="0.55"
  autoclose="disabled"
  disableswipedownclose="true">
  <wm-container name="comment_body" class="app-default-container" direction="column" gap="12"
    alignment="top-left" width="fill" height="hug">
    <wm-container name="sheet_header" class="app-default-container" direction="row" gap="auto"
      alignment="center" width="fill" height="hug">
      <wm-label name="comment_title" caption="Add Comment"
        class="label-sheet-title" variant="sheet-title"></wm-label>
      <wm-button name="close_btn" iconclass="wi wi-close" class="btn-sheet-close" variant="sheet-close"
        on-tap="Widgets.comment_sheet.close()"></wm-button>
    </wm-container>
    <wm-textarea name="comment_input" placeholder="Write your comment..."></wm-textarea>
    <wm-button name="post_btn" caption="Post" class="btn-cta" variant="cta"
      on-tap="Widgets.comment_sheet.close()"></wm-button>
  </wm-container>
</wm-bottomsheet>
```

---

## Sticky Info Sheet (no scroll, no dismiss)

`issticky="true"` disables internal scrolling entirely. `disableswipedownclose="true"` + `autoclose="disabled"` makes the sheet permanent until explicitly closed via button. Use for mandatory confirmation panels or persistent contextual info.

```xml
<wm-bottomsheet name="info_sheet"
  bottomsheetheightratio="0.25"
  issticky="true"
  disableswipedownclose="true"
  autoclose="disabled"
  showonrender="true">
  <wm-container name="info_body" class="app-default-container" direction="row" gap="12"
    alignment="middle-left" width="fill" height="hug">
    <wm-icon name="info_icon" iconclass="fa fa-info-circle" class="icon-info" variant="info"></wm-icon>
    <wm-container name="info_text" class="app-default-container" direction="column" gap="4"
      alignment="top-left" width="fill" height="hug">
      <wm-label name="info_title" caption="Location access needed"
        class="label-info-title" variant="info-title"></wm-label>
      <wm-label name="info_desc" caption="Enable location to see nearby results."
        class="label-info-desc" variant="info-desc"></wm-label>
    </wm-container>
    <wm-button name="info_action" caption="Enable" class="btn-cta" variant="cta"
      on-tap="Widgets.info_sheet.close()"></wm-button>
  </wm-container>
</wm-bottomsheet>
```
