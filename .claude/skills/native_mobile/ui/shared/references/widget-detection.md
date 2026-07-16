---
name: widget-detection
description: >
  18 visual pattern to correct WaveMaker widget mapping rules: how to identify forms, code boxes,
  wizards, accordions, segmented controls, lists, selectors, image overlays, navbars, tab bars, FABs,
  badges, ratings, search bars, toggles, progress indicators, carousels, and bottom sheets from a
  screenshot. Load during STEP 1 layout-plan to confirm widget choices before writing any markup.
---

# Widget Detection — Visual Pattern → Correct Widget

Disambiguation rules for choosing the correct WaveMaker widget from a visual design (screenshot or Figma frame). Consumed by `screenshot-to-wavemaker` and `figma-to-wavemaker` during their visual-analysis phase, BEFORE any markup is written, to prevent the most common widget mismatches (form decomposed into loose inputs, wizard built from manual containers, accordion built as a list, etc.).

Run every pattern check against the design before mapping individual widgets. Patterns are independent — a single screen may match several. Set a flag for each match and use those flags to drive markup generation.

If a visual element does not match any pattern below, fall back to the generic widget mapping in the consuming skill.

---

## Form (input fields + submit-like button)

**Visual cue**: 1 or more input fields (text, select, date, toggle, number, phone, email, password) AND a button captioned with any of: Continue, Save, Submit, Sign in, Log in, Send, Apply, Next, Pay, Done, Register, Sign up, Create account, Update, Confirm.

**Decision rule**: ≥1 input widget + ≥1 submit-like button = `wm-form`. Period.

**Correct**: `wm-form` + `wm-form-field` + `wm-form-action`. Load the `wavemaker-forms` skill before writing markup.

**Wrong (common AI mistake)**: Loose `wm-text` / `wm-select` / `wm-checkbox` widgets next to a standalone `wm-button`. Even a single field + Continue button is a form.

**Why it matters**: `wm-form` provides validation, submit handling, and field layout. Loose widgets get none of that and can't be wired to a service variable as a unit.

**Common form patterns the AI often MISSES:**

| Screen pattern | Why it's a form |
|---|---|
| Login: phone/email field + "Continue" / "Sign in" button | Input + submit = form, even with just 1 field |
| Registration: name, email, password + "Sign up" button | Multiple inputs + submit = form |
| Phone entry: country selector + phone number + "Continue" | Select + text + submit = form |
| Settings: toggles, selects, inputs + "Save" button | Input widgets + save = form |
| Checkout: payment fields + "Pay" / "Place order" button | Input + submit = form |
| Search filters: multiple filters + "Apply" button | Input widgets + apply = form |
| Profile edit: inputs + "Update" / "Save" button | Input + submit = form |
| Invite/code entry: single text field + "Submit" / "Next" | Even 1 field + submit = form |

**Hybrid screens**: When a form sits next to social login buttons, "or" dividers, or promo content, `wm-form` wraps ONLY the inputs + submit. The rest are siblings outside the form.

---

## Login / Sign-in (a form, plus `login: true`)

**Visual cue**: a form whose purpose is authentication — a username/email field + a password field (masked dots) + a primary button captioned Log in / Sign in / Login / Continue. Often accompanied by "Forgot password?", social/SSO buttons, or a "Sign up" link.

**Decision rule**: an authentication form → set **both** `form: true` and `login: true`.

**Correct**: `wm-login` as the outer wrapper (NOT a bare `wm-form`), with `wm-form` inside it. Load the `login-widget` skill before writing markup — it covers the mandatory naming rule, structure, width/sizing, and the `login` token variant.

**Wrong (common AI mistake)**: using a bare `wm-form` for a login page, or loose inputs next to a standalone button.

---

## Single-character code box row (OTP / PIN / passcode / unlock code / verification code)

**Visual cue**: A row of **N small, equal-width, single-character input boxes** (typically 4 or 6) where each box accepts ONE digit/character. The pattern is independent of the surrounding label — it covers ALL of these:

- "Verification Code", "Enter verification code", "Enter OTP", "OTP Verification"
- "Enter PIN", "Set PIN", "Confirm PIN"
- "Enter Passcode", "Create Passcode"
- "Enter Unlock Code", "Security Code", "Access Code"
- "Multi-Factor Authentication", "2FA", "We sent a 6-digit code…"
- Any screen where the design shows N (commonly 4 or 6) discrete single-character boxes laid out in a row, regardless of caption

The boxes may render as rounded squares with full borders, plain squares with light borders, or underline-only (bottom border only) — all three are the same pattern.

**Correct**: A `wm-container direction="row"` holding **N `wm-text` widgets** (one per character), each with `maxchars="1"` and a shared `variant`. Even if a "Verify" / "Confirm" / "Unlock" / "Continue" button is present, do NOT wrap in `wm-form` and do NOT use `wm-form-field`. See the "Single-character code box row pattern" section in `widget-defaults` for markup template, layout, and token variants.

**Wrong (common AI mistakes)**:
- Single `wm-text maxchars="6"` styled to look like multiple boxes — produces one input, not N.
- `wm-form` + N `wm-form-field widget="number"` — each field renders with its own caption row and stacks vertically, breaking the layout.
- Treating it as a "Verification form" because there is a Verify/Unlock/Confirm button. The code box row is one logical input expressed as N siblings; only promote to `wm-form` when the screen ALSO contains regular form fields (name, email, phone, password, etc.).
- Skipping the pattern because the caption says "PIN" or "Unlock Code" instead of "OTP". The visual — N single-character boxes — is the trigger, not the wording.

**Why it matters**: The pattern depends entirely on container `gap` + a uniform per-box variant. Treating it as a form decomposes it into stacked field rows; treating it as one input loses the per-digit boxes.

---

## Wizard (multi-step / stepper / onboarding)

**Visual cue (any of these is sufficient — Back/Next buttons are NOT required)**:
- Numbered step circles (1/2/3) connected by lines, with completed/active/upcoming states.
- "1 of 3" or "Step 1 of 3" progress circle with active step title.
- Thin segmented bars across the top representing steps.
- Dot indicators (● ○ ○) at the top with step content below.
- Vertical step list on the left side of the page.

**⚠️ Navigation buttons (Back/Next/Done) are NOT required** to classify a screen as a wizard. They are often below the fold or on a different scroll position. The step indicator header alone is sufficient. Do NOT downgrade a step header to "display-only stepper" just because nav buttons are not visible in the screenshot.

**Correct**: `wm-wizard` + `wm-wizardstep`. Load the `wavemaker-wizard` skill before writing markup.

**Variant selection (pick by header style):**

| Header style in the screenshot | Variant |
|---|---|
| Numbered circles + connector lines, step label appears BELOW the circle row (only active step label visible) | `default` |
| Step label appears BESIDE the circle on the SAME horizontal row — `① Address Details — ② Billing` style (connector lines may or may not be present; label position is the signal) | `number-text-inline` |
| "1 of 3" progress circle + active step title + popover menu | `progress-circle-header` |
| Thin flat bars (filled/empty) across top | `stepper-basic` |
| Dots (● ○ ○) at top + step content | `dottedstepper` |
| Vertical step list on left | `vertical` |

**Wrong**: Manual numbered containers, `wm-tabs`, or a row of styled circles. These lose step navigation and produce a visible gap between header and step content because they become separate sibling elements instead of one integrated widget.

**Why it matters**: A custom-built stepper has no step state machine, no Back/Next wiring, and no integration with form validation across steps.

---

## Accordion (expandable list / settings menu / FAQ)

**Primary signal — what the rows represent, not their icon:**

Ask: do the rows represent **content sections** (Profile, My Orders, FAQ questions, Settings categories) that would expand to show content inline on the same screen? → `wm-accordion`

Or do the rows represent **navigation destinations** (separate pages, external links, actions) with no inline content at all? → `wm-list`

**Chevron direction, icon shape, and highlight color are NOT reliable discriminators.** Do not use them to decide widget type.

**What determines accordion:**
- Rows are **content sections** — their label names a topic, category, or entity (Profile, My Orders, Payment, FAQ, Shipping, etc.)
- Tapping a row would reveal content **on the same screen** (form, detail info, list items) rather than navigating to a new page
- All rows share the same repeating header structure inside one parent container

**What determines navigation list:**
- Rows are **page/action destinations** — their label names a page or action (Go to Dashboard, View Reports, Log Out, etc.)
- Tapping navigates away; there is never inline content between rows

**State signals (only after widget type is determined):**

| Visual on the design | Meaning |
|---|---|
| One row highlighted (brand color bg, white text) | That pane is currently active/expanded — use `defaultpaneindex` |
| Content block visible below a row | That pane is expanded in the design view |
| All rows without inline content visible | All panes collapsed — `defaultpaneindex="-1"` |

**Correct**: ONE `wm-accordion` with one `wm-accordionpane` per row — including rows that appear collapsed in the design.

**Wrong**: `wm-list` with styled rows, or separating the highlighted row from the rest into a different container.

---

## Segmented control (option switcher inside a single pill)

**Visual cue**: 2–3 labeled options inside a single rounded/pill container, with one option visually highlighted (white background, raised, selected) and the others flat.

**Correct**: `wm-switch` with `dataset="opt1,opt2,opt3"` and `datavalue="opt1"` to pre-select the active option. (For a string dataset, OMIT `datafield` — setting it causes a silent rendering failure.)

**Wrong**: Individual `wm-button` per option. Buttons have no built-in selection state, so the "highlighted" look has to be faked and won't toggle on tap.

**Why it matters**: `wm-switch` renders as a native button group with managed selected state.

---

## Repeated items (lists, cards, thumbnails, chips)

**Visual cue**: 2 or more items sharing the same structural template — even if colors, badges, images, or button labels differ between items.

**Correct**: `wm-list` + `wm-listtemplate` bound to a variable. Use `direction="row"` for horizontal, `direction="column"` for vertical. Horizontal lists MUST set `hidehorizontalscrollbar="true"`.

**Wrong**: Manually repeated `wm-picture` / `wm-container` / `wm-button` elements. Test: can you describe ONE template where data fills the slots? If yes → list.

**Why it matters**: Different colors / badges / actions per item are DATA variation, not structural variation, and belong in the variable.

**Exception**: If items expand to reveal content below them on tap, this is an **accordion**, not a list — see the Accordion pattern above.

---

## Selector (text + chevron, dropdown, location/filter/sort)

**Visual cue**: Any label paired with a down-chevron or arrow — location pickers, filter labels, sort selectors, or any visible dropdown affordance.

**Correct**: `wm-select`. Style via design tokens (no need to decompose).

**Wrong**: A `wm-label` + `wm-icon` row mimicking a dropdown. It looks right but has no selection menu behavior.

---

## Image with text overlay (hero banner, media card)

**Visual cue**: Text or buttons positioned ON TOP of an image (not below it).

**Correct**: A relative `wm-container` wrapping `wm-picture` + an absolute `wm-container` (`position="absolute" positionvalue="0px 0px 0px 0px"`) holding the text. See `container-system` Pattern 13.

**Wrong**: Stacking the text in a sibling container below the image. The visual layering is lost.

---

## Mobile navbar (top app bar)

**Visual cue A — built-in fits**: Plain title, optional back button, optional left panel icon, optional search icon, optional logo image — and nothing else on the right side.

**Correct A**: `wm-mobile-navbar` with `title`, `backbutton`, `leftnavpaneliconclass`, `searchbutton`, `imgsrc` props.

**Visual cue B — built-in does NOT fit**: Multi-color brand text, custom right-side icons (cart, notifications, profile), per-icon badges, or multiple right icons.

**Correct B**: Custom `wm-container direction="row" position="fixed" positionvalue="0px auto auto auto"` styled via tokens. Do NOT also emit a `wm-mobile-navbar` — pick exactly one.

**Why it matters**: Without `position="fixed"` the custom navbar scrolls away with the page.

---

## Mobile tab bar (bottom nav)

**Visual cue A — light page**: Bottom nav on a light/white-themed page.

**Correct A**: `wm-mobile-tabbar` placed OUTSIDE `<wm-content>` but INSIDE `<wm-page>`.

**Visual cue B — dark page**: Bottom nav on a dark-themed page.

**Correct B**: Custom `wm-container` tab bar inside `wm-page-content` with `position="fixed" positionvalue="auto auto 0px auto"`, styled via dark tokens.

**Wrong**: `wm-mobile-tabbar` on a dark page. Its colors come from theme variables that default to light and CANNOT be overridden via per-page tokens.

---

## Fixed-position element (FAB, sticky CTA, floating badge)

**Visual cue**: An element that visually floats over content — a floating action button, a sticky CTA, a floating badge.

**Correct**: `wm-container` with `position="fixed"` + `positionvalue="top right bottom left"` wrapping the actual widget. Common values: FAB → `"auto 16px 16px auto"`; bottom bar → `"auto auto 0px auto"`.

**Wrong**: A bare `wm-button` styled to look floating. WM widgets don't support position props — only containers do. Without the wrapper, the element scrolls away with the page.

---

## Numeric badge on an icon

**Visual cue**: A small number (e.g., "3") overlaid on the corner of an icon — cart, notifications, inbox.

**Correct**: `wm-button iconclass="..." badgevalue="3"`. Badge overlays always require `wm-button`.

**Wrong**: `wm-icon caption="3"`. `caption` renders as text BESIDE the icon, not as an overlay badge.

---

## Star rating

**Visual cue**: A row of star icons indicating a rating.

**Correct**: `wm-rating`. Set `showcaptions="false"` when no caption is shown. Set `readonly="true"` for display-only ratings.

**Wrong**: A row of `wm-icon` widgets styled as stars. No rating value, no half-star handling, no a11y.

---

## Search bar

**Visual cue**: A text input with a magnifier icon, often with placeholder like "Search…".

**Correct**: `wm-search`.

**Wrong**: `wm-text` with a `wm-icon` overlay. No search-specific behavior (clear button, debounce, suggestion handling).

---

## On/off toggle (single boolean)

**Visual cue**: A rounded-rectangle track with a circular thumb that slides between two positions (ON / OFF). The track and thumb may vary in color, size, fill, or outline — the defining shape is always **pill + circle**.

```
  ON                OFF
 ┌──────(●)┐      ┌(○)──────┐
 └─────────┘      └─────────┘
```

Do NOT confuse with a progress bar (no thumb), a slider (thin rail with min/max labels), or a segmented button group (`wm-switch`).

**Correct**: `wm-checkbox` with `type="toggle"` and `accessibilityrole="togglebutton"`.

**Wrong**: A standalone `wm-toggle` widget, two buttons, or `wm-switch` (segmented button group, not a pill toggle).

---

## Progress / slider widgets

**Visual cue**: A horizontal track (a thin rounded-rectangle rail) where a leading portion is filled with a different (usually accent) color and the trailing portion is a lighter/grey remainder — i.e. the fill does NOT span the full width. Often paired with a percentage label ("75%"), a "3 of 5" / "Step 2/4" caption, an amount-vs-goal ("$320 / $500"), or a download/upload/storage/profile-completion context. The bar has **NO draggable thumb/knob** and **NO min/max end labels**.

**Decision rule**: Horizontal rail + partial fill of a different color + no thumb = `wm-progress-bar`. Period. The presence of a percentage/ratio caption next to it is confirmation, not a requirement.

**Correct**: `wm-progress-bar` (linear) or `wm-progress-circle` (circular ring/arc with a center value).

**Wrong (common AI mistake — this is the failure we are guarding against)**: Building it as a `wm-container` (or two nested containers) with a background color and `border-radius` to fake the fill. A styled container has no `datavalue`/`minvalue`/`maxvalue`, cannot be data-bound, and the "fill width" is hard-coded instead of driven by the value. **A partially-filled colored bar is NEVER a container.**

| Visual cue | Correct | Wrong |
|---|---|---|
| Linear bar, partial fill, no thumb | `wm-progress-bar` | Colored / nested container |
| Circular ring or arc with a center % or value | `wm-progress-circle` | Styled icon / SVG / image |
| Horizontal rail WITH a draggable thumb (knob) + min/max labels | `wm-slider` | `wm-progress-bar` or colored container |

**Disambiguation**:
- **vs container/divider**: a divider/decorative bar is one uniform color edge-to-edge; a progress bar has two regions (filled + remainder). Two color regions on one rail → progress bar.
- **vs slider**: slider has a thumb the user drags and usually min/max end labels; progress bar is display-only with neither.
- **vs stepper bars (wizard)**: several short segments across the top representing steps → `wm-wizard` (`stepper-basic` variant), not a single progress bar.

**Why it matters**: `wm-progress-bar` renders a value via `datavalue`/`minvalue`/`maxvalue` and is themeable via the `progress-bar` token (`root`, `track`, `fill`) and `type` (default|success|info|warning|danger). A faked container loses all of that and silently drifts from the real value.

---

## Carousel (image slides)

**Visual cue**: A horizontal slide region with dot indicators OR a single image with overlay text intended to slide.

**Correct**: `wm-carousel` + `wm-carousel-template`. For hero with overlay text, use the relative/absolute pattern inside the template. For full-bleed slides, override `slide.padding: "0px"` and `slide.transform: "none"`.

**Wrong**: Manual sibling slides; stacking text below the image.

---

## Modal / dialog / popover

| Visual cue | Correct | Wrong |
|---|---|---|
| Centered popup with title + content + actions | `wm-dialog` + content + actions | A positioned overlay container |
| Floating menu anchored to a trigger | `wm-menu` or `wm-popover` | Hidden container toggled via JS |

---

## Bottom sheet (sheet sliding up from bottom)

**Visual cue**: A panel that overlays the bottom portion of the screen. Any ONE of these signals is sufficient — you will rarely see all of them at once:

**Fully-open sheet** (classic case):
- Drag handle pill (short rounded bar) at the top of the sheet
- Semi-transparent backdrop visible behind/above the sheet
- Sheet occupies a fraction of screen height with page content dimmed above it

**Partially-visible / peek case** (easy to miss — the image above is this case):
- A white/surface panel visible only at the very bottom of the screen, showing just the top strip (drag handle + first row of content), as if it has been partially slid up
- Shadow or elevated border at the panel's top edge separates it from the scrollable content above
- The panel's content is contextually distinct from the main page (e.g., an action or input like a stepper, a CTA button, or a summary row) while the rest of the page shows detail/read content
- No backdrop visible — the sheet is partially open so the backdrop has not faded in yet

**No-backdrop / invisible-backdrop case** (sheet looks like a sticky bottom bar):
- A panel anchored to the bottom with rounded top corners and a subtle drop shadow at its top edge
- Content above is NOT dimmed — the sheet is small enough that the backdrop (`rgba(0,0,0,0.1)`) is effectively invisible
- The panel contains an interactive element (stepper, button, select) that is contextually tied to the page content above

**Blurred background case**:
- The page content above the sheet appears blurred, frosted, or darkened — this is an explicit backdrop signal
- Even if no drag handle is visible, a blurred/darkened page behind a bottom panel = `wm-bottomsheet`
- Override `backdrop.background` token to match the design (e.g. `rgba(0,0,0,0.4)` for dark, or a blur effect via a darker overlay)

**Hard cases — ALWAYS flag as `bottomsheet: true` when you see:**
- A white card panel at the bottom with a shadow line at its top edge, even if the rest of the screen looks like a normal page
- A "Quantity", "Add to Cart", "Apply", or action-label row pinned to the bottom that appears to float over the scrollable content above it
- Any panel whose top-left and top-right corners are visibly rounded while the sides and bottom are flush with the screen edges
- Page content above is blurred, frosted, or darkened in any way

**Trigger & dismiss wiring (MANDATORY when detected)**:

Scan the ENTIRE design — not just the sheet itself — for any element that opens or closes the sheet:

| Trigger pattern | Wire as |
|---|---|
| Button, icon, FAB, or chip that contextually opens the sheet (e.g. "Filter", "⋮", "+", "Share", "Add") | `on-tap="Widgets.<name>.open()"` |
| Close icon (✕ / wi-close) inside the sheet | `on-tap="Widgets.<name>.close()"` |
| "Apply", "Done", "Save", "Submit" button inside the sheet | `on-tap="Widgets.<name>.close()"` (after any action) |
| "Cancel" or "Dismiss" link inside the sheet | `on-tap="Widgets.<name>.close()"` |
| Backdrop tap | Handled automatically via `autoclose="outsideClick"` — do NOT add manual wiring |

**NEVER leave a detected trigger un-wired.** If a button visually suggests it opens a sheet (by position, caption, or icon), wire it. If the sheet has a close button, wire it. If the sheet has a submit/apply action, wire the close on that button too.

**Correct**: `wm-bottomsheet`. Place all sheet content as direct children — the component provides its own internal `ScrollView` and drag handle automatically. Set `bottomsheetheightratio` to match the fraction of screen the sheet occupies.

**Wrong (common AI mistakes)**:
- A `wm-container` with `position="fixed" positionvalue="auto auto 0px auto"` — looks similar but has no backdrop, no swipe-to-close, no animated open/close, no keyboard avoidance.
- A `wm-dialog` — dialog is always centered on screen, not a bottom slide-up.
- A `wm-popover` with `type="action-sheet"` — popover is anchored to a trigger element; `wm-bottomsheet` is a standalone page-level overlay.

**Why it matters**: `wm-bottomsheet` renders as a React Native Modal (overlays everything including tab bars and navigation bars), provides animated slide-up/slide-down, swipe-to-dismiss, keyboard avoidance when the sheet contains input fields, and an expandable two-height mode. None of these behaviors exist on a positioned container.

**Height guidance**:
- Default `bottomsheetheightratio` is `0.3` (30% of screen height) — suitable for short action lists (3–5 items)
- For forms or medium content: use `0.5`–`0.6`
- For content-heavy sheets that may need scrolling: use `expand="true"` with `bottomsheetexpandedheightratio="0.85"` so the user can swipe up to expand
- For full-screen sheets: `bottomsheetheightratio="0.9"`

**Trigger pattern**: `wm-bottomsheet` is opened and closed programmatically — set `name` and call `Widgets.<name>.open()` / `Widgets.<name>.close()` from a button's `on-tap` event. Use `showonrender="true"` only when the sheet should appear immediately on page load.

**Downstream skill loading**: `bottomsheet: true` → load `wavemaker-bottomsheet` at the start of Phase 2. Do not write `wm-bottomsheet` markup until you have read it.

---

## Tabs

**Visual cue**: A row of horizontally laid out labels with one underlined/highlighted, and content below that swaps when a label is tapped.

**Correct**: `wm-tabs` + `wm-tabpane`.

**Wrong**: Buttons styled as tabs with manual content swapping.

---

## Chart (data visualization)

**Visual cue**: a region that plots DATA as a visualization — axes with a plotted or filled series, a group of bars, a circle split into slices, or a ring with multiple segments plus a legend/value labels. The defining trait is that shapes are DRIVEN BY NUMERIC VALUES (bar heights, slice angles, a line's y-positions), not decorative.

**Decision rule**: pick the chart type from the visual, then set `chart: true` plus a per-instance note of the type.

| Visual signal | `chartType` |
|---|---|
| Vertical bars (grow UP from a baseline) | `Column` |
| Horizontal bars (grow SIDEWAYS from a left axis) | `Bar` |
| A plotted line connecting points | `Line` |
| A line with the region under it filled | `Area` |
| A full circle of slices | `Pie` |
| A ring with a hole | `Donut` |
| Stacked segments within each bar | `Column`/`Bar` + `viewtype="Stacked"` |
| Bubble scatter (points sized by a value) | `Bubble` |

**Bar vs Column is the classic mistake**: vertical bars are `Column`, horizontal bars are `Bar` — map the orientation literally.

**Correct**: ONE `wm-chart type="..."` per chart, bound to a dataset variable. Load the `wavemaker-mobile-charts` skill before writing markup.

**Wrong (common AI mistakes)**:
- Building a chart from styled containers, images, or icons instead of `wm-chart`.
- Using `wm-progress-circle` for a multi-slice donut — a ring with several segments + a legend is a Donut chart. Conversely, a single-value ring with ONE center number and NO slices/legend is `wm-progress-circle`, NOT a Donut chart.
- Reading thin stepper bars at the top of a flow as a bar chart — those are `wm-wizard` (`stepper-basic` variant).
- Reading a single partial-fill rail as a Bar chart — that is `wm-progress-bar`.

**Why it matters**: a faked chart has no data binding, no legend/tooltip behavior, and cannot re-render from variable data — it is a static picture that silently drifts from the real values.

---

## Adding a new pattern

Append a new `## <Pattern name>` section using this template:

```markdown
## <Pattern name>

**Visual cue**: <one-sentence description of what to look for in the screenshot>

**Correct**: <WM widget(s) and any required props/structure>

**Wrong (common AI mistake)**: <the widget combo the AI tends to pick instead>

**Why it matters**: <one sentence on what behavior/feature is lost if the wrong widget is used>
```

Keep each section focused on **detection from a visual design**, not on markup authoring details (those belong in the other files under `` or in the relevant downstream skill). If a new pattern needs a downstream skill (like `wavemaker-forms` or `wavemaker-wizard`), mention "Load the `<skill-name>` skill before writing markup" inside the **Correct** block.
