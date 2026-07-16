---
name: wizard-markup
description: >
  wm-wizard markup reference: minimal viable structure, full prop tables for wm-wizard (25+ props
  including headertype, stepstyle, progressvalue, showheader, showfooter) and wm-wizardstep (25+ props
  including title, subtitle, iconclass, disablenext, showdone), 6 header variants with markup examples
  (default, number-text-inline, stepper-basic, progress-circle-header, dottedstepper, vertical),
  variant combination examples, and a complete annotated screen-level markup example. Load before
  writing any wm-wizard or wm-wizardstep markup.
---

# Wizard Markup Reference

## Minimal Structure

```xml
<wm-wizard name="wizard1" cancelable="false">
  <wm-wizardstep name="step1" title="Personal Info" subtitle="Enter your details">
    <!-- step content widgets go here -->
  </wm-wizardstep>
  <wm-wizardstep name="step2" title="Review" subtitle="Check your entries">
    <!-- step content -->
  </wm-wizardstep>
  <wm-wizardstep name="step3" title="Confirm" subtitle="Submit your data"
    shownext="false" showdone="true">
    <!-- step content -->
  </wm-wizardstep>
</wm-wizard>
```

**First step**: always `showprev="false"` (no Back button with nowhere to go).
**Last step**: always `shownext="false" showdone="true"`.

---

## Full Props — wm-wizard

| Prop | Default | Notes |
|---|---|---|
| `name` | — | Required. Widget identifier |
| `class` | — | Header variant + custom appearance class (see Header Variants below) |
| `cancelable` | `true` | Shows Cancel button in footer |
| `cancelbtnlabel` | `'Cancel'` | |
| `nextbtnlabel` | `'Next'` | |
| `previousbtnlabel` | `'Previous'` | |
| `donebtnlabel` | `'Done'` | |
| `donebtniconclass` | `'wm-sl-l sl-check'` | Icon on Done button |
| `actionsalignment` | `'right'` | `'right'` or `'left'` — footer button order |
| `defaultstep` | `'none'` | Step `name` to jump to on mount; supports `bind:` |
| `headernavigation` | `true` | Allow tapping completed steps in header to navigate back |
| `showalltitles` | `false` | Show title/subtitle under ALL step indicators (not just active) |
| `progresstitle` | `''` | Text inside progress circle (`progress-circle-header` only) — usually bound |
| `progresstype` | `'default'` | `default` / `success` / `info` / `warning` / `error` |
| `popovericonclass` | `'fa fa-caret-down'` | Icon for popover trigger (`progress-circle-header` only) |
| `menudataexpr` | — | `bind:fn($item, $index)` — caption per step row in popover menu |
| `on-next` | — | Fires when Next is pressed (wizard level) |
| `on-prev` | — | Fires when Back is pressed |
| `on-done` | — | Fires when Done is pressed (last step) |
| `on-cancel` | — | Fires when Cancel is pressed |
| `on-skip` | — | Fires when Skip link is tapped |
| `on-change` | — | Fires on every step change: `(widget, newStep, oldStep)` — 1-indexed |

---

## Full Props — wm-wizardstep

| Prop | Default | Notes |
|---|---|---|
| `name` | — | Required. Step identifier |
| `title` | `'Step Title'` | Shown in header indicator and popover menu |
| `subtitle` | `'Sub Title'` | Shown below title in header (active step or `showalltitles=true`) |
| `iconclass` | `'wm-sl-l sl-check'` | Icon shown inside step indicator when step is completed |
| `showprev` | `true` | Show Previous button on this step |
| `shownext` | `true` | Show Next button on this step |
| `showdone` | `true` | Show Done button (only renders on last step anyway) |
| `disableprev` | `false` | Disable Previous button; supports `bind:` |
| `disablenext` | `false` | Disable Next button; supports `bind:` |
| `disabledone` | `false` | Disable Done button; supports `bind:` |
| `enableskip` | `false` | Show Skip anchor link in footer for this step |
| `show` | `true` | Hide step from header + skip during navigation; supports `bind:` |
| `on-next` | — | Called before advancing; **return `false` to block navigation** |
| `on-prev` | — | Called before going back; **return `false` to block navigation** |
| `on-load` | — | Fires after step content renders for the first time (lazy load) |

---

## Header Variants

Set via `class` on `wm-wizard`. Variants can be **combined** (space-separated).

### Default (numbered circles + connector lines)
```xml
<wm-wizard name="wizard1">
```
- Numbered circles per step connected by horizontal lines
- Only active step shows its title below the indicator
- Completed steps show a checkmark icon

### `number-text-inline`
```xml
<wm-wizard name="wizard1" class="number-text-inline">
```
- Step label appears BESIDE the circle on the SAME horizontal row (inline layout)
- **Connector lines are secondary** — use this variant whenever the label is beside the circle, regardless of whether connectors are present
- All step labels visible simultaneously; active step expands, others compact
- Good for short step names (3–4 characters)

### `stepper-basic`
```xml
<wm-wizard name="wizard1" class="stepper-basic">
```
- Each step is a flat colored bar (2px height)
- No numbers, no icons, no titles in header
- Good for clean minimal UIs

### `progress-circle-header`
```xml
<wm-wizard name="wizard1" class="progress-circle-header"
  progresstitle="bind:(Widgets.wizard1.state.currentStep + 1 + ' of ' + Widgets.wizard1.steps.length)"
  menudataexpr="bind:menuStepCaption($item, $index)">
```
- Shows ONE `WmProgressCircle` for current step position
- Circle text = `progresstitle` prop (e.g., "1/3")
- Active step title + subtitle shown to the right of the circle
- Popover lists all steps as a dropdown menu

**`menudataexpr` example:**
```js
// Return null to HIDE the current step from the dropdown
Page.menuStepCaption = function(item, index) {
  return Page.Widgets.wizard1.state.currentStep != index
    ? (index + 1) + " of " + item.count  // → "2 of 3", "3 of 3"
    : null;
};
```

### `dottedstepper`
```xml
<wm-wizard name="wizard1" class="dottedstepper">
```
- Future steps show as small dots
- Completed steps show a checkmark inside the circle
- Active step shows full circle

### `vertical`
```xml
<wm-wizard name="wizard1" class="vertical">
```
- Header stacks vertically (column direction)
- Each step row is horizontal: circle + title side by side
- Connector line appears on the LEFT side of circles

### Combining Variants
```xml
<wm-wizard name="wizard1" class="dottedstepper vertical">
<wm-wizard name="wizard1" class="stepper-basic vertical">
```

---

## Full Example

```xml
<wm-wizard name="wizard1"
  class="progress-circle-header wizard-branded"
  variant="branded"
  defaultstep="step1"
  cancelable="false"
  nextbtnlabel="Next"
  previousbtnlabel="Back"
  donebtnlabel="Submit"
  actionsalignment="right"
  progresstitle="bind:(Widgets.wizard1.state.currentStep + 1 + ' of ' + Widgets.wizard1.steps.length)"
  menudataexpr="bind:menuStepCaption($item, $index)"
  on-done="wizard1Done(widget, steps)">

  <wm-wizardstep name="step1" title="Details" subtitle="ENTER INFORMATION"
    showprev="false" shownext="true" showdone="false"
    on-next="validateStep1(widget, currentStep, stepIndex)">
    <!-- step 1 content -->
  </wm-wizardstep>

  <wm-wizardstep name="step2" title="Review" subtitle="CHECK YOUR ENTRIES">
    <!-- step 2 content -->
  </wm-wizardstep>

  <wm-wizardstep name="step3" title="Confirm" subtitle="SUBMIT"
    showprev="true" shownext="false" showdone="true">
    <!-- step 3 content -->
  </wm-wizardstep>
</wm-wizard>
```
