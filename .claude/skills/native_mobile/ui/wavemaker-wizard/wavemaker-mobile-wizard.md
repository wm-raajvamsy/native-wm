---
name: wavemaker-wizard
description: >
  WaveMaker Wizard and WizardStep widget system for React Native. Covers markup structure,
  all props, header variants, step navigation, events, and design token authoring. Use when
  generating WaveMaker wizard markup, creating wizard tokens, or when the design contains a
  multi-step flow, stepper UI, onboarding flow, or progress-step navigation. Also trigger
  alongside screenshot-to-wavemaker or figma-to-wavemaker when the design contains a wizard.
  Trigger phrases: "wm-wizard", "wizard step", "stepper", "multi-step", "onboarding flow",
  "step 1 of 3", "numbered steps", "progress steps".
sub-skills:
  - wizard-markup
  - wizard-tokens
  - container-system
---

# WaveMaker Wizard Component

Generate correct WaveMaker wizard markup. This skill covers `wm-wizard` + `wm-wizardstep` for all multi-step UI patterns.

**Read first**: `wizard-markup` — complete props tables and all header variant details.
**Token authoring**: delegate to `figma-to-design-tokens-mobile`. See `wizard-tokens` for the full wizard token structure.

---

## 1. When to Use Wizard

Use `wm-wizard` when the design shows **discrete stages with explicit step navigation**:

| Design Pattern | Use Wizard |
|---|---|
| Numbered circles (1 / 2 / 3) at top + content + Next/Back buttons | ✅ Yes |
| "Step 1 of 3" / "1/3" progress circle + content + navigation | ✅ Yes (progress-circle-header) |
| Thin segmented progress bars across top + step content | ✅ Yes (stepper-basic) |
| Dots (● ○ ○) at top + step content + navigation | ✅ Yes (dottedstepper) |
| Vertical step list on side + content area | ✅ Yes (vertical) |
| Multi-step flows: Setup → Review → Confirm, Personal Info → Payment → Done | ✅ Yes |
| Onboarding screens with numbered steps and Back/Next buttons | ✅ Yes |
| Step content only with NO header navigation bar | ❌ No — use `wm-tabs` or containers |
| Tab navigation (user switches tabs freely) | ❌ No — use `wm-tabs` |

---

## 2. Markup Structure

### Minimal Wizard

```xml
<wm-wizard name="wizard1" defaultstep="step1" cancelable="false">
  <wm-wizardstep name="step1" title="Personal Info" subtitle="Enter your details">
    <!-- step content widgets go here -->
  </wm-wizardstep>
  <wm-wizardstep name="step2" title="Review" subtitle="Check your entries">
    <!-- step content -->
  </wm-wizardstep>
  <wm-wizardstep name="step3" title="Confirm" subtitle="Submit your data">
    <!-- step content -->
  </wm-wizardstep>
</wm-wizard>
```

> ⚠️ **`defaultstep` is mandatory.** Always set it to the `name` of the first `wm-wizardstep`. The runtime only activates a step when `defaultstep` is explicitly set — omitting it leaves all steps blank in the preview.
> ⚠️ **`defaultstep` MUST be a step name string — NEVER a numeric index.** `defaultstep="0"` or `defaultstep="1"` silently does nothing. Correct: `defaultstep="step_address"` (the value of the first step's `name` attribute).

### Full Wizard (all common props)

```xml
<wm-wizard name="wizard1"
  class="progress-circle-header wizard-branded"
  defaultstep="step1"
  cancelable="true"
  cancelbtnlabel="Cancel"
  nextbtnlabel="Next"
  previousbtnlabel="Back"
  donebtnlabel="Submit"
  actionsalignment="right"
  headernavigation="true"
  showalltitles="false"
  progresstitle="bind:(Widgets.wizard1.state.currentStep + 1 + ' of ' + Widgets.wizard1.steps.length)"
  menudataexpr="bind:menuStepCaption($item, $index)"
  on-next="wizard1Next(widget, steps)"
  on-prev="wizard1Prev(widget, steps)"
  on-done="wizard1Done(widget, steps)"
  on-cancel="wizard1Cancel(widget, steps)"
  on-change="wizard1Change(widget, newStep, oldStep)">

  <wm-wizardstep name="step1"
    title="Change"
    subtitle="UPDATE CONTRIBUTION RATES"
    showprev="false"
    shownext="true"
    showdone="false"
    disablenext="false"
    enableskip="false"
    on-next="step1Next(widget, currentStep, stepIndex)">
    <!-- content -->
  </wm-wizardstep>

  <wm-wizardstep name="step2" title="Review" subtitle="UPDATE NEW RULES">
    <!-- content -->
  </wm-wizardstep>

  <wm-wizardstep name="step3" title="Complete" subtitle="CONFIRMATION &amp; NEXT STEPS"
    showprev="true" shownext="false" showdone="true">
    <!-- content -->
  </wm-wizardstep>
</wm-wizard>
```

---

## 3. WmWizard Props Reference

| Prop | Default | Notes |
|---|---|---|
| `name` | — | Required. Widget identifier |
| `class` | — | Header variant + custom appearance class (see Section 4) |
| `cancelable` | `true` | Shows Cancel button in footer |
| `cancelbtnlabel` | `'Cancel'` | |
| `nextbtnlabel` | `'Next'` | |
| `previousbtnlabel` | `'Previous'` | |
| `donebtnlabel` | `'Done'` | |
| `donebtniconclass` | `'wm-sl-l sl-check'` | Icon on Done button |
| `actionsalignment` | `'right'` | `'right'` or `'left'` — footer button order |
| `defaultstep` | `'none'` | Step `name` to jump to on mount; supports `bind:` for variable binding |
| `headernavigation` | `true` | Allow tapping completed steps in header to navigate back |
| `showalltitles` | `false` | Show title/subtitle under ALL step indicators (not just active) |
| `progresstitle` | `''` | Text inside progress circle (progress-circle-header only) — usually bound |
| `progresstype` | `'default'` | `default` / `success` / `info` / `warning` / `error` |
| `popovericonclass` | `'fa fa-caret-down'` | Icon for popover trigger (progress-circle-header only) |
| `menudataexpr` | — | `bind:fn($item, $index)` — caption per step row in popover menu |
| `on-next` | — | Fires when Next is pressed (wizard level) |
| `on-prev` | — | Fires when Back is pressed |
| `on-done` | — | Fires when Done is pressed (last step) |
| `on-cancel` | — | Fires when Cancel is pressed |
| `on-skip` | — | Fires when Skip link is tapped |
| `on-change` | — | Fires on every step change: `(widget, newStep, oldStep)` — 1-indexed |

---

## 4. WmWizardstep Props Reference

| Prop | Default | Notes |
|---|---|---|
| `name` | — | Required. Step identifier |
| `title` | `'Step Title'` | Shown in header indicator and popover menu |
| `subtitle` | `'Sub Title'` | Shown below title in header (active step or `showalltitles=true`) |
| `iconclass` | `'wm-sl-l sl-check'` | Icon shown inside the step indicator when step is completed |
| `showprev` | `true` | Show Previous button on this step |
| `shownext` | `true` | Show Next button on this step |
| `showdone` | `true` | Show Done button on this step (only renders on last step anyway) |
| `disableprev` | `false` | Disable Previous button; supports `bind:` for dynamic control |
| `disablenext` | `false` | Disable Next button; supports `bind:` |
| `disabledone` | `false` | Disable Done button; supports `bind:` |
| `enableskip` | `false` | Show Skip anchor link in footer for this step |
| `show` | `true` | Hide step from header + skip it during navigation; supports `bind:` |
| `on-next` | — | Called before advancing; **return `false` to block navigation** |
| `on-prev` | — | Called before going back; **return `false` to block navigation** |
| `on-load` | — | Fires after step content renders for the first time (lazy load) |

**Common pattern — first step hides Previous, last step hides Next:**
```xml
<wm-wizardstep name="step1" title="Step 1" showprev="false">...</wm-wizardstep>
<wm-wizardstep name="step2" title="Step 2">...</wm-wizardstep>
<wm-wizardstep name="step3" title="Step 3" shownext="false" showdone="true">...</wm-wizardstep>
```

---

## 5. Header Variant Guide

Set the variant via `class` on `wm-wizard`. Variants can be **combined** (space-separated).

### Visual Decision Table — pick variant from design signal

The PRIMARY signal is **WHERE the step label appears relative to the circle**, NOT whether connector lines are present.

| Visual signal in design | Variant to use |
|---|---|
| Step label appears BELOW the circle row (title renders under the whole step indicator bar) — only active step's label visible | Default (no class) |
| Step label appears BESIDE the circle on the SAME horizontal row (circle + label inline) — connector lines may or may not be present, this is secondary | `number-text-inline` |
| Thin segmented bars across top, no numbers or labels | `stepper-basic` |
| Single "X of N" circle with active title beside it + dropdown caret | `progress-circle-header` |
| Dots for future steps, filled circle for active, checkmark for done | `dottedstepper` |
| Steps listed vertically on the left with connector line running down | `vertical` |
| Any of the above but stacked top-to-bottom instead of left-to-right | add `vertical` |

**⚠️ Common misclassification:** If the design shows `① Address Details — ② Billing — ③ Check out` all on one horizontal row with each label right beside its circle, that is `number-text-inline` even if connector lines are visible between steps. Do NOT use Default just because connectors are present.

### UI Layout Previews

**Default** — numbered circles + horizontal connector
```
┌─────────────────────────────────────────┐
│  ①━━━━━━━━━━━━○━━━━━━━━━━━○            │
│  Step Title                             │
│  Step subtitle                          │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
① active  ✓ completed  ○ future  ━ connector
```

**`number-text-inline`** — inline number + label, no connector
```
┌─────────────────────────────────────────┐
│  ① Step One   2 Step Two   3 Step Three │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
active step expands; others stay compact
```

**`stepper-basic`** — flat progress bars, no labels
```
┌─────────────────────────────────────────┐
│  ████████████  ░░░░░░░░░░  ░░░░░░░░░░  │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
█ current/done bar   ░ future bar (2px height)
```

**`progress-circle-header`** — "X of N" circle + popover
```
┌─────────────────────────────────────────┐
│  ╭───╮  Step Title              [˅]    │
│  │1/3│  Step subtitle                  │
│  ╰───╯                                 │
│                        ┌─────────────┐ │
│                        │ 2 of 3 ...  │ │
│                        │ 3 of 3 ...  │ │
│                        └─────────────┘ │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
[˅] opens dropdown listing all other steps
```

**`dottedstepper`** — dots → circle → checkmark
```
┌─────────────────────────────────────────┐
│       ✓        ①        •        •     │
│              Step 2                    │
│              subtitle                  │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
✓ completed   ① active (full circle)   • future (dot)
```

**`vertical`** — steps stacked on the left
```
┌─────────────────────────────────────────┐
│  ①  Step One                           │
│  │  subtitle                           │
│  ○  Step Two                           │
│  │                                     │
│  ○  Step Three                         │
├─────────────────────────────────────────┤
│  [ step content ]                       │
├─────────────────────────────────────────┤
│                        [Back]  [Next ›] │
└─────────────────────────────────────────┘
connector │ runs vertically on the left
```

**`dottedstepper vertical` / `stepper-basic vertical`** — combined
```
┌──────────────┬──────────────────────────┐
│  ✓  Step 1  │                          │
│  │          │  [ step content ]        │
│  ①  Step 2  │                          │
│  │          │                          │
│  •  Step 3  │                          │
└──────────────┴──────────────────────────┘
```

---

### Default (numbered circles + connector lines)

```xml
<wm-wizard name="wizard1">
```

- Numbered circles per step, connected by horizontal lines
- Only active step shows its title below the indicator
- Clicking a completed step navigates back (when `headernavigation="true"`)
- Completed steps show a checkmark icon instead of the number

### `number-text-inline`

```xml
<wm-wizard name="wizard1" class="number-text-inline">
```

- Step label appears BESIDE the circle on the SAME horizontal row (inline layout)
- **Connector lines are secondary** — the key signal is label position, not whether connectors exist
- Active step expands, non-active steps stay compact; all labels are visible simultaneously
- Good for short step names (3–4 characters)

### `stepper-basic`

```xml
<wm-wizard name="wizard1" class="stepper-basic">
```

- Each step is a flat colored bar (height 2px)
- No numbers, no icons, no titles in header
- Good for clean minimal UIs
- Can combine: `class="stepper-basic vertical"` for vertical bars

### `progress-circle-header`

```xml
<wm-wizard name="wizard1" class="progress-circle-header"
  progresstitle="bind:(Widgets.wizard1.state.currentStep + 1 + ' of ' + Widgets.wizard1.steps.length)"
  menudataexpr="bind:menuStepCaption($item, $index)">
```

- Shows ONE `WmProgressCircle` for the current step position
- Circle text = `progresstitle` prop (e.g., "1/3")
- Active step title + subtitle shown to the right of the circle
- Popover (caret-down icon) lists all steps as a dropdown menu
- `menudataexpr` controls the caption in each popover row

**`menudataexpr` example:**
```js
// $item = { count: totalSteps }, $index = step index (0-based)
// Return null to HIDE a step from the dropdown (e.g., the current step)
Page.menuStepCaption = function(item, index) {
  return Page.Widgets.wizard1.state.currentStep != index
    ? (index + 1) + " of " + item.count  // → "2 of 3", "3 of 3"
    : null; // current step not shown in dropdown
};
```

### `dottedstepper`

```xml
<wm-wizard name="wizard1" class="dottedstepper">
```

- Future/incomplete steps show as small dots
- Completed steps show a checkmark icon inside the circle
- Active step shows the full circle
- Good for simple step count indicators

### `vertical`

```xml
<wm-wizard name="wizard1" class="vertical">
```

- Header stacks vertically (column direction)
- Each step row is horizontal: circle + title side by side
- Connector line appears on the LEFT side of the circles
- Good for taller screens or sidebar navigation

### Combining variants

```xml
<wm-wizard name="wizard1" class="dottedstepper vertical">
<wm-wizard name="wizard1" class="stepper-basic vertical">
```

---

## 6. Navigation & Events

### Step-level blocking (on-next / on-prev returning false)

The `on-next` callback on `wm-wizardstep` can **block** navigation by returning `false`:

```xml
<wm-wizardstep name="step1" on-next="validateStep1(widget, currentStep, stepIndex)">
```

```js
Page.validateStep1 = function(widget, currentStep, stepIndex) {
  if (!Page.Widgets.nameField.datavalue) {
    Page.showNotification("Name is required", "error");
    return false; // blocks navigation to next step
  }
  // returning undefined/true allows navigation
};
```

The same applies to `on-prev`. Skip bypasses `on-next` validation entirely.

### skipdefault* flags (advanced)

These are set automatically when custom button actions are used in Studio. They tell the wizard to fire the event but NOT perform the default navigation:
- `skipdefaultnext="true"` — `on-next` fires but step does NOT advance
- `skipdefaultprevious="true"` — `on-prev` fires but step does NOT go back
- `skipdefaultdone="true"` — `on-done` fires but wizard does NOT mark complete
- `skipdefaultcancel="true"` — `on-cancel` fires with no default behavior

### Programmatic navigation

From script:
```js
Page.Widgets.wizard1.next();    // advance one step
Page.Widgets.wizard1.prev();    // go back one step
Page.Widgets.wizard1.done();    // complete wizard
Page.Widgets.wizard1.skip();    // skip current step
Page.Widgets.wizard1.updateCurrentStep(2); // jump to step index 2 (0-based)
```

### Dynamic step visibility

```xml
<wm-wizardstep name="premiumStep" show="bind:Variables.isPremiumUser.dataValue">
```

Hidden steps are automatically skipped during Next/Previous navigation.

---

## 7. Design Token Authoring

Wizard token authoring is handled by `figma-to-design-tokens-mobile`. When the design requires custom wizard styling, delegate token generation to that skill.

Full wizard token structure, property paths → CSS variable mapping, and default override checklist: see `wizard-tokens`.

**Markup wiring** (the only wizard-skill concern):
- Add `class="wizard-<appearance-name>"` and `variant="<appearance-name>"` on `wm-wizard`
- The appearance name in tokens must match the `variant` value

```xml
<wm-wizard name="wizard1" class="progress-circle-header wizard-branded" variant="branded">
```

---

## 8. Wizard Markup Checklist

- [ ] `wm-wizard` + one `wm-wizardstep` per step — no manual step containers
- [ ] `name` on both wizard and each step (required)
- [ ] `defaultstep` set to the **name string** of the first step (e.g. `defaultstep="step1"`) — NEVER a numeric index (`"0"`, `"1"` silently fail)
- [ ] `title` on each step (shown in header)
- [ ] `subtitle` on each step (shown below title for active step)
- [ ] Header variant set via `class` on `wm-wizard` — key: is the label BESIDE the circle (→ `number-text-inline`) or BELOW the circle row (→ Default)?
- [ ] `showprev="false"` on first step
- [ ] `shownext="false"` + `showdone="true"` on last step
- [ ] `cancelable="false"` if design has no Cancel button
- [ ] `actionsalignment="right"` unless design shows left-aligned buttons
- [ ] For progress-circle-header: `progresstitle` bound + `menudataexpr` bound to script function
- [ ] **Form detection per step**: each wizard step's content is scanned independently for form patterns. Input fields inside a step + the wizard's Next/Done button = that step needs `wm-form` + `wm-form-field` + `wm-form-action`. The wizard's navigation IS the submit action — do NOT use bare `wm-text` / `wm-label` pairs inside wizard steps that have input fields.
- [ ] If tokens needed: `class="wizard-<name>"` + `variant="<name>"` on markup matches appearance name in token file
