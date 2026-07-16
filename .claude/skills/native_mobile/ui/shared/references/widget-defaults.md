---
name: widget-defaults
description: >
  Default styles, attribute behaviours, and known quirks for every widget type: buttons, labels,
  icons, pictures, all input types (text, select, checkbox, radio, date, slider), lists, cards,
  forms, containers, panels, tabs, accordions, wizards, navigation widgets, dialogs, and advanced
  widgets. Load when a widget behaves unexpectedly or you need to know which attributes can be omitted.
---

# Widget Defaults & Quirks

## Format Rules
- **ALL widgets use paired tags** — never self-closing `<wm-x />`
- **Widgets without children**: no space between tags → `<wm-button></wm-button>`
- **Widgets with children**: content between tags

## Legend
- **C** = Accepts children | **NC** = No children
- **Defaults** = Built-in styles that may need token overrides
- **Quirks** = Props that MUST be set to avoid unwanted UI

---

## Basic Widgets

### wm-button (NC)
- **Defaults**: padding **0px top/bottom, 24px left/right** (`{space.0.value} {space.6.value}`), height **40px** (`{space.10.value}`), borderRadius **32px** (large default — reads as a pill; measure the design's actual corner and override), text.textTransform: **capitalize**, text.fontSize: 14, text.fontWeight: 500, icon.text.fontSize: 16
- **Built-in appearances**: `filled` (with status: default/primary/secondary/tertiary/success/info/warning/danger), `outlined`, `text`, `standard`, `icon` (40x40 no padding), `elevated` (with shadow), `fab` (56x56 rounded)
- **OVERRIDE WHEN**:
  - **Radius — read it off the screenshot, never accept the 32px default.** Estimate the button's actual corner radius from the design (judge the corner curve against the button's height), then set the `radius` token whose value is closest to what you measured. A `radius.pill`/`radius.circle` (semicircular ends) is correct ONLY when the short vertical edges are fully round in the design; if those edges are straight before the corner curves — rounded but NOT semicircular — it is a rounded rectangle, so pick the matching finite token (commonly `{radius.sm.value}` 8px, `{radius.md.value}` 12px, or `{radius.lg.value}` 16px). Do not map "looks rounded" to `pill`/`xl`/`xxl` by reflex — apply the radius you actually see.
  - Design shows **lowercase or UPPERCASE text** → override `text-transform: "none"` or `"uppercase"` (default is `capitalize`)
  - Design shows **icon-only buttons** → override ALL padding to 0, set explicit `height`/`min-width` (default padding is `0/24` — the vertical 0 is fine but the 24px horizontal pushes icon-only layouts off-centre)
  - Design shows **compact buttons** → override `padding`, `height`/`min-height` (default minHeight is 40px)
- **⚠️ CLASS NAME COLLISION**: The runtime registers built-in styles for `btn-default`, `btn-primary`, `btn-secondary`, `btn-danger`, `btn-success`, `btn-warning`, `btn-info`, `btn-link`, `btn-dark`, `btn-light`, `btn-only-label`. **NEVER use these status names as custom button appearance names.** Use descriptive alternatives (the bare appearance name): `cta` instead of `primary`, `standard` instead of `default`, etc.
- **Quirks**:
  - Icon-only button → set `padding.*: 0px` in tokens to align icon. Always needs `caption` or `iconclass`.
  - The 32px default radius makes an unstyled button look like a pill, so it hides the design's real corner. Always measure the corner radius from the screenshot and set the matching `radius.*` token — most product buttons are rounded rectangles, not pills.
- **Props**: caption, iconclass, iconposition(left|right|top), badgevalue, type(button|submit|reset)

### wm-label (NC)
- **Defaults**: fontSize 16px (body.large), **text.color: #888888 (grey!)**, alignSelf flex-start, wrap true, **text.textAlign: left**, fontWeight: 400 (body.medium)
- **Built-in appearances**: `default` (with size variants: h1, h2, h3, h4, h5, h6, p, media-heading), `text` (with status color variants: primary, secondary, success, warning, danger, info, muted), `label` (badge style with colored bg + padding)
- **⚠️ CRITICAL — CLASS NAME COLLISION**: The foundation defines a `label` appearance group (badge style) with status variants that register selectors: `.label-primary`, `.label-secondary`, `.label-success`, `.label-warning`, `.label-danger`, `.label-info`, `.label-muted`. If you generate a custom appearance with `class="label-muted"`, the runtime matches it to the built-in `.label-muted` selector and applies **badge styles: backgroundColor + padding 32/16px + borderRadius 6 + fontWeight 700**. This creates an unwanted badge/chip look on plain text labels. **NEVER use these status names as custom appearance names for labels**: `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `muted`. Use descriptive alternatives: `label-subtle` instead of `label-muted`, `label-accent` instead of `label-primary`, etc.
- **OVERRIDE WHEN**:
  - Design shows **dark/black text** → override `color` (default is #888888 grey, NOT black)
  - Design shows **different font size** → override `font-size` (default is 16px)
  - Heading styles (h1-h6) add `margin: 4px` which may cause unexpected spacing → override if needed
- **⚠️ LONG TEXT IN ROW (CRITICAL)**: When a multi-line wrapping label shares a `direction="row"` container with any sibling element (icon, button, badge), **never place the label directly in the row**. In React Native, a label without `flexGrow: 1` takes only its minimum content width and truncates. Wrap the label in a `wm-container` with `width="fill"` so React Native allocates the correct flex space:
  ```xml
  <!-- WRONG: label truncates because it has no flexGrow in the row -->
  <wm-container direction="row" gap="auto" alignment="center" width="fill" height="hug">
    <wm-label caption="Long text that needs to wrap across multiple lines..."></wm-label>
    <wm-icon iconclass="fa fa-info-circle"></wm-icon>
  </wm-container>

  <!-- CORRECT: fill container gives the label flexGrow=1 so it wraps properly -->
  <wm-container direction="row" gap="auto" alignment="center" width="fill" height="hug">
    <wm-container class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
      <wm-label caption="Long text that needs to wrap across multiple lines..."></wm-label>
    </wm-container>
    <wm-icon iconclass="fa fa-info-circle"></wm-icon>
  </wm-container>
  ```
  This pattern applies any time a label needs to fill remaining row space alongside any sibling widget. Also do NOT set `nooflines` when the design shows fully wrapped (multi-line) text — it truncates at that line count.
- **Quirks**: Required field → shows red asterisk. Supports markdown: `**bold**` and `[link text](url)`. Use built-in size variants (h1-h6) instead of custom font-size tokens when the design text matches the typography scale. Supports word-by-word fade-in animation via `textanimation="fadeIn"` with `animationspeed` (ms per word).
- **Props**: caption, nooflines, required, textalign, wrap(true), textanimation, animationspeed

### wm-icon (NC)
- **Defaults**: size 24px (icon.size.md), iconclass "wm-sl-l sl-user", **icon.paddingRight: 8px**, **text.paddingLeft: 8px**
- **Built-in**: Foundation icon sizes: xs=12, sm=18, md=24, lg=30, 2x=36, 3x=42
- **OVERRIDE WHEN**:
  - Icon used **standalone without caption** in tight layouts → override `icon.padding: "0px"` to remove the default 8px right padding on the icon element
  - Icon used **with caption** but spacing looks too wide → override `text.padding` and/or `icon.padding`
- **⚠️ `caption` is NOT a badge**: `caption` on `wm-icon` renders text **beside** the icon (like a sibling label), not as an overlay badge. For an icon button that shows a numeric badge (notification count, cart count, unread indicator) → use `wm-button` with `iconclass` + `badgevalue="N"`. Never set `caption` on `wm-icon` to represent a count or status badge.
- **Quirks**: Can be used as a standalone indicator or decorative element. The hidden 8px right padding on the icon element can cause alignment issues in custom container layouts.
- **Props**: iconclass, iconsize, caption, captionposition(left|right)

### wm-picture (NC)
- **Defaults**: width 270px, resizemode stretch, **overflow: hidden**
- **Quirks**: The default width of 270px means pictures without an explicit `width` prop will render at 270px wide, NOT fill their parent. Always set `width` explicitly on `wm-picture`. The `overflow: hidden` default clips content to the picture bounds which is useful for rounded corners.
- **Props**: picturesource, resizemode(cover|contain|stretch), shape(circle|square), aspectratio, pictureplaceholder, fastload(false)

### wm-anchor (NC)
- **Defaults**: caption "Link", target "_blank"
- **Props**: caption, hyperlink, iconclass, badgevalue, encodeurl

### wm-spinner (NC)
- **Props**: caption, iconclass, iconsize

### wm-message (NC)
- **Defaults**: type "success", variant "dark", hideclose false, animation "fadeIn"
- **Quirks**: Auto-assigns icon per type (success→`wm-sl-l sl-check`, error→`fa fa-times-circle`, warning→`wm-sl-l sl-alarm-bell`, info→`wi wi-info`, loading→`fa fa-spinner fa-spin`). Auto-assigns title per type (Success, Warning, Error, Info, Processing). Custom icon via `messageiconclass`, custom close icon via `closeiconclass`.
- **Props**: caption, title, type(success|warning|error|info|loading), hideclose, variant(dark|light), messageiconclass, closeiconclass

### wm-progress-bar (NC)
- **Defaults**: datavalue 30, min 0, max 100, **progressBar.height: 4px**
- **Quirks**: The progress fill bar is only 4px tall by default. If the design shows a thicker bar, override `height` in the progress-bar token's `fill` part.
- **Props**: datavalue, minvalue, maxvalue, type(default|success|info|warning|danger)

### wm-progress-circle (NC)
- **Defaults**: datavalue 30, min 0, max 100
- **Props**: datavalue, minvalue, maxvalue, title, subtitle, captionplacement(inside)

### wm-search (NC)
- **Defaults**: placeholder "Search", showSearchIcon true, **root.borderRadius: 28px**, **text.minHeight: 56px**, text.padding: 8/24/8/14, **text.backgroundColor: #dddddd (grey!)**, text.borderWidth: 1, text.borderColor: #dddddd, searchButton.height: 56, searchButton.borderRadius: 28
- **OVERRIDE WHEN**:
  - Design shows **white or light search background** → override `text.background` (default is #dddddd grey, NOT white!)
  - Design shows **non-pill search** → override `border.radius` (default is 28px pill-shaped). **Visual test**: at the default 56px height, 28px radius makes the short ends fully semicircular. If the corners in the design are visually distinct angles — rounded but NOT semicircular — the radius is less than ~28px and **must be overridden**. Slightly curved ≠ pill. Only skip this override when the short ends are truly semicircular in the screenshot.
  - Design shows **compact search** → override `height` (default minHeight is 56px — quite tall)
  - Design shows **no border** on search → override `text.border.width: "0px"`
- **Quirks**: The search bar is pill-shaped by default (borderRadius 28). The input area has a grey background (#dddddd) by default, not white — this catches many people off guard. Override text background color for white/custom search bars.
- **Props**: placeholder, dataset, searchkey, type(search|autocomplete), minchars, limit, iconclass(wm-sl-l sl-search), showclear(false), debouncetime(0), searchon(typing|onsearchiconclick)

### wm-skeleton (C)
- Children shown as skeleton placeholders

---

## Input Widgets

### wm-text (NC)
- **Defaults**: minHeight 42px, padding 8px/16px, autocapitalize "none"
- **Props**: placeholder, datavalue, floatinglabel, maxchars, readonly, required, type(text|email|password)
- **Input text aligns left by default and there is NO token to recenter it** — `form-controls` (the root key that styles `wm-text`) has no `text-align` key in its base mapping, so emitting `text-align` in a variant mapping FAILS validation. Do NOT add it. For visually-centered single-character boxes (OTP/PIN/passcode digit, verification code), the centered look comes from sizing each box to roughly one character — a small `min-width` with symmetric `padding` — not from `text-align`. **General rule: if a styling value has no matching path in the target component's base mapping (see `token-schema`), drop it — never invent or borrow a path to carry it.**

#### Single-character code box row pattern
Use this when the "Single-character code box row" pattern in `widget-detection.md` matches the design — covers OTP, PIN, passcode, unlock code, verification code, 2FA, and any other "row of N single-character boxes" UI regardless of caption wording.

**Markup** — N `wm-text` siblings inside a row container, NEVER `wm-form-field`, NEVER a single `maxchars="N"` input. Use neutral, screen-appropriate names (`pin_digit_*`, `code_digit_*`, `otp_digit_*` — pick what matches the screen's caption). **Each `wm-text` MUST carry BOTH `variant` AND `class` attributes** — the `class` value is `form-controls-<variant>` (plural "controls", matching the root key in `form-controls.json`):

```xml
<wm-container name="code_section" direction="column" gap="12" width="fill" height="hug" alignment="top-left">
  <wm-label name="code_hint" caption="Enter PIN"></wm-label>
  <wm-container name="code_row" direction="row" gap="8" alignment="middle-center" width="fill" height="hug">
    <wm-text name="code_digit_1" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
    <wm-text name="code_digit_2" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
    <wm-text name="code_digit_3" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
    <wm-text name="code_digit_4" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
    <wm-text name="code_digit_5" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
    <wm-text name="code_digit_6" maxchars="1" placeholder="" variant="code-box-square" class="form-controls-code-box-square"></wm-text>
  </wm-container>
</wm-container>
```

**⚠️ Class-name footgun (`form-controls` vs `form-control`)**: The token root key for input chrome is **`form-controls`** (plural, with an "s"). The class on every `wm-text` in this pattern MUST therefore start with `form-controls-` — for example `class="form-controls-code-box-square"`, NOT `class="form-control-code-box-square"`. There is also a separate, unrelated canonical token component named `form-control` (singular) listed in `token-schema.md`; do NOT confuse them. Bootstrap's `.form-control` class is a stronger prior in pretrained models — override it: read the root key inside the generated `form-controls.json` (it is `"form-controls"`) and use that exact string as the class prefix. The `variant` attribute uses just the variant suffix (e.g. `variant="code-box-square"`), but the `class` always carries the full `form-controls-<variant>` form.

**Layout rules:**
- N must equal the box count in the design (4 boxes → 4 widgets, 6 → 6). Never collapse to one input.
- Outer wrapper: `direction="column"`, `width="fill"`, `height="hug"`, `gap` between hint label and the row (commonly 12–16).
- Inner row: `direction="row"`, `width="fill"`, `height="hug"`, `alignment="middle-center"` (or `top-left` if boxes are visibly left-aligned). With a numeric `gap` you MUST use a fixed 9-value alignment (`middle-center`, not `center`) — `center`/`start`/`end` only resolve under `gap="auto"` and otherwise silently fall back to `top-left`. Spacing between boxes comes from `gap` ONLY — never per-box `margin`. Tightly packed boxes use `gap="4"`–`"8"`; spaced-out boxes use `gap="12"`–`"16"`.
- All N widgets share the SAME `variant`.
- **Placeholder is explicit and empty by default.** Always emit the `placeholder` attribute on every `wm-text` in this pattern — do NOT omit it. Set `placeholder=""` (empty string) unless the design clearly shows placeholder text inside an empty box (e.g. faint dashes, dots, or sample digits like "0"). In that case, set `placeholder` to the exact character shown. Never leave it to default. Rationale: keeping the attribute present-but-empty makes the intent explicit at review time and prevents the model from later regenerating it with hallucinated text like "Enter digit" or "0".

**Variant** — emit ONE variant under `form-controls/form-controls.json` → `form-controls.appearances.<variant>.mapping`. Pick a variant name that fits the screen (e.g. `code-box-square`, `pin-box`, `otp-box`, `code-underline`) — the suffix is what matters, not the prefix:

| Sub-style | Suggested variant name | Distinguishing token values |
|---|---|---|
| Rounded square with border on all 4 sides (focus state may use brand color border) | `code-box-square` (or `pin-box`, `otp-box`) | `border.width: {border.width.1.value}` (all sides), `border.radius: {radius.<n>.value}` |
| Underline only (bottom border, no box) | `code-underline` (or `pin-underline`, `otp-underline`) | `border.width: "{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` (shorthand, bottom only), `border.radius: {radius.none.value}`, `background.color: {color.transparent.@.value}` |

**Required mapping keys for ANY code-box variant:**
- `min-width` and `height` — from `{space.*.value}` tokens (typical 40–48px box → `{space.10.value}`–`{space.12.value}`). NEVER hard-code px.
- `padding` — shorthand from `{space.*.value}` tokens (e.g. `"{space.0.value} {space.1.value}"`).
- `border.style` — `{border.style.solid.value}`.
- `border.color` — from foundation color tokens; literal hex only when matching a brand-specific focus accent that has no token.
- `text.align` — **`center` is mandatory** (default left alignment looks broken).
- `font-size` — heading token (commonly `{h4.font-size.value}` or `{h3.font-size.value}`).
- `font-weight` — `{font.weight.700.value}` for bold digits, else theme default.
- `color` — text color from a foundation color token.

**Focused-state block (MANDATORY whenever the design shows a focused box)**: Many code-box designs show one box highlighted with a brand-color border or thicker border to indicate focus (e.g. an orange outline on the active digit). Whenever that visual is present in the screenshot, emit a `states.focused` block inside the same variant — DO NOT skip it. The same rule that applies to `wm-form-field` variants (`wavemaker-forms/SKILL.md` lines 494–496) applies here, because the underlying token slot is the same `form-controls` `.app-input` chrome:

```json
{
  "form-controls": {
    "appearances": {
      "code-box-square": {
        "mapping": { "border": { "color": { "value": "#E0E0E0ff" } }, "...": "..." },
        "states": {
          "focused": {
            "border": {
              "color": { "value": "{color.primary.@.value}" },
              "width": { "value": "{border.width.2.value}" }
            }
          }
        }
      }
    }
  }
}
```

Token paths to capture in `states.focused` (omit any that match the default):
- `states.focused.border.color` — usually `{color.primary.@.value}` or a brand accent.
- `states.focused.border.width` — set if the focused border is visibly thicker than the default (commonly `{border.width.2.value}`).
- `states.focused.background` — only if the focused box has a different fill than the resting state.

If no box is shown focused in the design, omit the `states.focused` block entirely — do NOT emit empty state blocks.

**Form coexistence rule (CRITICAL)**: Wrap in `wm-form` ONLY when the screen ALSO contains regular form fields (name, email, phone, password, etc.). For code-only screens — even with a "Verify" / "Confirm" / "Unlock" / "Continue" button — emit just the container row of `wm-text` plus a sibling `wm-button`. If a `wm-form` is needed for coexistence, the code row still stays as a `wm-container` of `wm-text` siblings inside the form's fields container, NOT as `wm-form-field` widgets.

### wm-textarea (NC)
- **Defaults**: multiline true, numberOfLines 4, placeholder "Place your text"
- **Props**: placeholder, datavalue, maxchars, floatinglabel

### wm-number (NC)
- **Defaults**: keyboardType numeric, same sizing as wm-text
- **Props**: placeholder, datavalue, minvalue, maxvalue, step

### wm-currency (NC)
- **Props**: placeholder, datavalue, currency, minvalue, maxvalue, step

### wm-select (NC)
- **Defaults**: **minWidth: 160px**, padding: 12px, borderWidth: 1px, borderStyle: solid, borderRadius: 6px, backgroundColor: #ffffff, text.fontSize: 16px, popoverwidth: 240px
- **Built-in appearances**: `filled`, `outlined` (default)
- **OVERRIDE WHEN**:
  - Select is **inside a styled container** (pill row, card toolbar) → use the **Inline Select Override Template** from `token-schema` to neutralize ALL chrome: min-width, padding, border, background, radius, **and `arrow-button`** (background-color, padding, border-width, border-style, border-color). Missing arrow-button overrides leaves the dropdown chevron area with its own default background/border even when the rest of the select is transparent.
  - Select should **shrink to content** → override `min-width: "0px"` (default is 160px!)
  - Select is **borderless** -> set `border.width: "{border.width.0.value}"` (0px) and keep `border.style: "{border.style.solid.value}"` (never `"none"`)
  - Select has **custom background** → override `background.color`
- **Quirks**:
  - **CRITICAL: `minWidth: 160px`** — The select ALWAYS renders at least 160px wide. For inline/embedded selects inside pill containers, you MUST override `min-width: "0px"` in the select token, or the select will blow out the container width.
  - The select has its own border (1px solid) and padding (12px) by default. When embedding a select inside a styled container (like a pill row), use the complete inline select override template.
  - The select always takes up `minWidth` space even if its content is shorter.
- **⚠️ MANDATORY: `datafield` prop**: When dataset items are objects (e.g., `{dataValue: "Option A"}`), `datafield` is REQUIRED. Without it, no options render. Set `datafield="dataValue" displayfield="dataValue"` for simple string-list variables.
- **Props**: dataset, datavalue, **datafield (REQUIRED)**, displayfield, placeholder

### wm-checkbox (NC)
- **Defaults**: icon 20x20, borderWidth 2, borderRadius 4, text marginLeft 8
- **Props**: caption, datavalue, checkedvalue, uncheckedvalue

### wm-checkboxset (NC)
- **Props**: dataset, datavalue, datafield, displayfield, itemsperrow

### wm-radioset (NC)
- **Defaults**: radiosetscroll true
- **Props**: dataset, datavalue, datafield, displayfield, itemsperrow, groupby

### Toggle (wm-checkbox type="toggle") (NC)
- **Quirks**: A toggle is a `wm-checkbox` with `type="toggle"` and `accessibilityrole="togglebutton"`. There is no standalone `wm-toggle` widget.
- **Props**: caption, datavalue, checkedvalue(true), uncheckedvalue(false), type(toggle), accessibilityrole(togglebutton)

### wm-switch (NC)
- **Quirks**: Renders as a segmented button group, NOT a toggle. Uses `dataset` for the options; `datavalue` pre-selects the active one.
- **⚠️ Static vs dynamic dataset**:
  - Options visible in the design (not loaded from a server) -> use a comma-separated string: `dataset="Option A,Option B"`. This is the correct default for any segmented control whose options are fixed.
  - Variable binding (`dataset="bind:Variables.x.dataSet"` + `datafield`) is only for options fetched at runtime that vary per user/session.
  - **`datafield` must be omitted for string datasets** - it only applies when each dataset item is an object. Setting `datafield` on a string dataset renders every option as an empty button.
- **✓ Styling: fully token-supported via `variant` + `class`.** Root key `switch`, override file `switch/switch.json`. Emit `variant="<name>"` plus `class="switch-<name>"` on the widget, the same dual-attribute pattern as every other styled widget. A segmented control almost always needs an authored appearance - do NOT leave the switch bare and expect the wrapper container to carry the look; the wrapper cannot reach the buttons or the selected state. Key paths (see `token-schema` for the full list):
  - Unselected buttons -> `button.background.color`, `button.color`, `button.border.color`, `button.border.radius` (foundation default `{radius.pill.value}`), `button.font.*`, `button.padding`, `button.height`.
  - **Selected (highlighted) option -> `states.selected.button.background.color` and `states.selected.button.color`.** This is the raised active pill; foundation defaults are `{color.secondary.fixed.@.value}` background on `{color.on-secondary.container.@.value}` text. A design whose active option is a brand color (e.g. teal) is styled HERE and will not appear without this state.
  - Disabled -> `states.disabled.opacity`.
- **⚠️ Sizing / placement**: `wm-switch` is a leaf widget - do NOT put `width="fill"` on the switch itself. Wrap it in a `wm-container width="fill"` and control placement with the container's `alignment` (e.g. `alignment="top-left"` to pin left, `alignment="top-center"` to center). Without the wrapper the switch collapses to minimum width and floats wherever the parent's flex-start lands, misaligned from the design intent. Always emit the wrapper container, even when the switch is the only child in its section.
- **Props**: dataset, datavalue, datafield (only for object datasets), variant, class

### wm-slider (NC)
- **Defaults**: min 0, max 100, step 1, range false
- **Props**: datavalue, minvalue, maxvalue, step

### wm-rating (NC)
- **Defaults**: maxvalue 5, padding `{space.2.value}` (8px), **showcaptions true**, icon.size: 32px, text.size: 32px
- **Foundation colors**:
  - Inactive/unfilled stars: `icon.color` = `{color.on-surface.@.value}` (dark #1D1B20)
  - Active/filled stars: `states.active.icon.color` = `{color.warning.@.value}` (gold #ffae00)
- **Quirks**:
  - If NO caption needed → MUST set `showcaptions="false"`.
  - **Star icons are 32px by default** — quite large. If design shows smaller stars, override `icon.size` in the rating token.
  - **Inactive star color is DARK by default** — Most designs show light gray unfilled stars. You almost always need to override `icon.color` to a light gray (e.g., `#D0D0D0ff`).
  - **Active star color is GOLD by default** — Only override `states.active.icon.color` if the design shows non-gold filled stars.
  - ❌ **NEVER use `activeStar.color` or `inactiveStar.color`** — these property paths do not exist. The correct paths are `icon.color` (inactive) and `states.active.icon.color` (active).
  - Icons: filled=wi-star, empty=wi-star-border.
- **Props**: datavalue, maxvalue, readonly, iconsize, showcaptions

### wm-date (NC)
- **Props**: datavalue, placeholder, datepattern, mindate, maxdate, outputformat

### wm-time (NC)
- **Props**: datavalue, placeholder, outputformat

### wm-datetime (NC)
- **Props**: datavalue, placeholder, outputformat

### wm-chips (NC)
- **Defaults**: searchable false, minchars 1, selectionmode "multiple", inputposition "last", **chip.borderRadius: 8px**, chip.minWidth: 80px, chip.minHeight: 32px, chip.borderWidth: 1px, **chip.elevation: 1 (Android shadow!)**, chip.paddingVertical: 4px, chip.paddingHorizontal: 4px, **chipLabel.fontSize: 14px**, chipLabel.fontWeight: 500
- **⚠️ USE FOR SELECTABLE PILL/FILTER ROWS**: Any horizontal row of pills/tags/filters where ONE item is visually selected (different bg color, text color) MUST use `wm-chips` with `selectionmode="single"`. NEVER decompose into `wm-list` + `wm-button` — buttons have no built-in selected state. Set `datavalue="<selected label>"` to pre-select the item shown in the design.
- **Active/selected state tokens**: `wm-chips` has built-in `states.active` tokens that style the selected chip:
  - `states.active.background-color` — selected chip background (e.g., `"#1A1A1Aff"` for dark)
  - `states.active.color` — selected chip text color (e.g., `"#FFFFFFff"` for white)
  - `states.active.item.border.color` — selected chip border color
  - These tokens make the selected state work automatically — no conditional class binding needed.
- **OVERRIDE WHEN**:
  - Design shows **flat chips without shadow** → override chip elevation/shadow (default `elevation: 1` adds shadow on Android)
  - Design shows **borderless chips** → override `chip.border.width: "0px"`
  - Design shows **smaller chips** → override `chip.min-width: "0px"`, `chip.min-height: "0px"`
  - Design shows **pill-shaped chips** → override `item.border.radius.@: "{radius.pill.value}"`
  - Design shows **selected chip with dark bg / white text** → override `states.active.background-color` and `states.active.color`
- **Common patterns**:
  - Filter row: `selectionmode="single"`, `datavalue="All"`, horizontal scrollable, pill-shaped
  - Category tabs: `selectionmode="single"`, outlined unselected, filled selected
  - Tag selection: `selectionmode="multiple"`, removable chips
- **⚠️ MANDATORY: `datafield` prop**: `datafield` is REQUIRED when dataset items are objects (e.g., `{dataValue: "All"}`). Without it, the widget **silently renders zero chips** — all items fail the internal value extraction and get dropped. ALWAYS set `datafield` to match the object key holding the value (e.g., `datafield="dataValue"`). Also set `displayfield` to the same key for the visible text.
- **Quirks**: Chips have their own border, padding, AND elevation shadow by default. The chip minimum dimensions (80x32) may not match the design. Override `chip.*` part tokens for custom chip sizing and styling. Default `selectionmode` is "multiple" — set to "single" for filter rows.
- **Props**: dataset, **datafield (REQUIRED)**, displayfield, placeholder, searchable, maxsize, selectediconclass(wm-sl-l sl-check), selectionmode(single|multiple), inputposition(last), datavalue

### wm-fileupload (NC)
- **Props**: caption, iconclass, contenttype

### wm-calendar (NC)
- **Props**: dataset, datavalue, eventstart, view(month)

---

## Data Widgets

### wm-list (C)
- **Defaults**: item.minHeight **56px**, item.padding **4px** all sides, **item.borderRadius: 6px**, **item.borderStyle: solid**, item.borderColor: primaryColor (#4263eb), **item.boxShadow: `1px 1px 1px rgba(0,0,0,0.08)`**, **item.backgroundColor: #ffffff** (white), navigation: 'None', pagesize: 20
- **Directional class defaults** (applied automatically by the runtime):
  - **Vertical lists** (`direction="column"`) → `app-vertical-list` adds: `item.marginBottom: 6px`, `item.width: 100%`
  - **Horizontal lists** (`direction="row"`) → `app-horizontal-list` adds: `item.marginRight: 6px`
- **Built-in appearances**: `default` (with shadow + white bg + rounded corners per item)
- **⚠️ CRITICAL LIMITATION — `item.*` tokens DO NOT WORK in React Native**:
  - The design token system generates CSS variables for `item.*` overrides (e.g., `--wm-list-item-background-color`), but `css-to-react-native-transform` CANNOT convert these to React Native inline styles. The `variants` object is EMPTY for `item.*` sub-part overrides at runtime.
  - **DO NOT put `item.*` in `list.json` mapping** — it has no effect and creates false confidence.
  - The item wrapper defaults (white bg, shadow, 6px borderRadius, 4px padding, 56px minHeight, 6px margins) **persist** regardless of tokens.
  - These can only be changed by overriding foundation-level theme variables (global, affects ALL lists) or custom page-level style registration (outside the token system).
- **OVERRIDE WHEN (CRITICAL — applies to MOST list usages)**:
  - Design shows **flat/clean items** → use the **Flat List Override Template** from `token-schema`: override list ROOT properties (`background.color`, `border.*`, `padding`) + create a `list-template` token with `background.color: transparent`. Style the content INSIDE `wm-listtemplate` to visually mask item wrapper defaults.
  - **IMPORTANT: The primary mechanism for flat lists is the `list-template` token** — `background.color: transparent` on the template root DOES work and is essential.
- **Quirks**:
  - MUST contain `wm-listtemplate` child. Items rendered from dataset, NOT static children.
  - **TWO layers of visual defaults**: The list component's `item` wrapper has shadow/bg/border/padding defaults (⚠️ cannot be overridden via per-appearance tokens in RN). The `wm-listtemplate` component ALSO has `root.backgroundColor: #ffffff` (CAN be overridden via `list-template` token). These are SEPARATE components.
  - **Tappable wrapper hardcoded styles**: Inside each item, a `Tappable` component applies `flexDirection: 'row'` (always) and `paddingRight` for horizontal/multi-col lists (= `item.marginRight || 4`). These cannot be overridden via tokens.
  - **`direction` uses `'row'`/`'column'`** (from AutoLayout) — NOT `'vertical'`/`'horizontal'`. Use `direction="column"` for vertical lists, `direction="row"` for horizontal scrollable lists.
  - **`spacing` is REMOVED** — use `gap="N"` instead (from AutoLayout). For item separation, use `gap="8"` on the list.
  - **List inherits ALL AutoLayout props** — `gap`, `alignment`, `wrap`, `columngap`, `overflow`, etc.
  - For visual separation between list items, use `gap="8"` combined with `item.border.width`/`item.border.color` tokens. Do NOT manually add dividers inside list templates.
  - **CRITICAL: Default pagination may hide items** — Without `navigation` and `pagesize` props, the list may paginate and only show a subset of items. When the design shows ALL items visible (no "load more", no pagination), ALWAYS set `navigation="None"` and `pagesize="N"` where N >= the number of visible items.
  - **Horizontal lists** — Use `direction="row"` for horizontal scrollable lists. **MUST set `hidehorizontalscrollbar="true"`** to prevent a visible scrollbar/scroll indicator from appearing at the bottom of the list. This default scrollbar rarely matches any design.
- **Props**: dataset, direction(column|row), gap(N|auto), alignment, itemsperrow, navigation(Scroll|On-Demand|None), pagesize, multiselect, **hidehorizontalscrollbar**(ALWAYS "true" for row lists), disableitemselect

### wm-listtemplate (C) — INSIDE wm-list ONLY — IS AN AUTO-LAYOUT CONTAINER
- **Defaults**: root.backgroundColor: **#ffffff** (white) — from `themeVariables.listHeaderBgColor`. This is a SEPARATE component (`app-list-template` class) with its own style resolution, independent from the parent `wm-list`'s `item` styles.
- **AUTO-LAYOUT (CRITICAL)**: `wm-listtemplate` supports ALL container auto-layout props: `direction`, `gap`, `alignment`, `width`, `height`, `padding` (CSS shorthand: 1, 2, or 4 values). It IS the layout container for list item content. **NEVER add a wrapper `wm-container` inside `wm-listtemplate` solely for row/column layout.** Put layout props directly on the `wm-listtemplate`. Only use inner `wm-container` for NESTED sub-layouts (e.g., a column group within a row template).
- **OVERRIDE WHEN (CRITICAL — applies to MOST list usages)**:
  - Design shows **flat/transparent list** → MUST add `class` and `variant` to `wm-listtemplate` and create a `list-template` token with `background.color: "transparent"`. Without this, even if the list item wrapper is transparent, the template root paints a white rectangle inside each item.
- **Quirks**:
  - ALWAYS add `class` and `variant` attributes: `class="list-template-<name>" variant="<name>"`
  - Extends `BaseProps` so it supports `classname` (mapped from `class` in markup)
  - The token file goes in `tokens/listtemplate/listtemplate.json` (folder name `listtemplate`; JSON root key inside is `list-template`, NOT `listTemplate`)
  - For horizontal lists, the runtime also applies `horizontal-list-template` class; for vertical lists, `vertical-list-template` class
  - The `list-template` token handles BOTH the background override (transparent for flat lists) AND visual styling (border, radius, padding) — combining what would otherwise require a wrapper container token
- **Props**: name (required), class, variant, showskeletonchildren(true), **direction**(row|column), **gap**(N|auto), **alignment**(all 9 fixed + 3 auto values), **width**(fill|hug|Npx|N%), **height**(fill|hug|Npx|N%), **padding**(N), padding supports CSS shorthand (1, 2, or 4 values)

### wm-card (C)
- **Defaults**: image height 200px, **heading.backgroundColor: #dddddd (grey!)**, heading padding 8px, **root.width: 100%**, title.text.fontSize: 16px, title.text.lineHeight: 24px, subheading.text.fontSize: 12px, subheading.text.lineHeight: 18px
- **OVERRIDE WHEN**:
  - Design shows **white/custom header background** → override `heading.background.color` (default is #dddddd grey, NOT white!)
  - Design shows **different header padding** → override `heading.padding`
  - Design shows **fixed-width cards** → override root width
- **Quirks**:
  - MUST contain `wm-card-content`. Optional `wm-card-footer`. Header renders from props (title, subheading, iconclass, picturesource).
  - Card header has a grey background by default — this is one of the most frequently missed overrides.
  - Title and subheading have specific font sizes — override in `title.*` and `subheading.*` token parts if the design differs.
- **Props**: title, subheading, iconclass, picturesource

### wm-form (C)
- **Defaults**: itemsperrow {xs:1,sm:1,md:1,lg:1}, layoutposition "vertical"
- **Quirks**: Contains `wm-form-field` and `wm-form-action` children.
- **Props**: title, captionposition(top|left|floating), captionalign, method, dataset

### wm-form-field (NC)
- **Props**: key, displayname, type(string|number|date), widget(text|number|select|date|radioset|checkboxset|rating|toggle|chips|currency|textarea|slider), required, placeholder, dataset

### wm-form-action (NC)
- **Props**: caption, type(submit|reset|cancel), class, iconclass

### wm-liveform (C)
- Same as wm-form but for database CRUD operations
- **Props**: dataset, formdata

---

## Container / Layout Widgets

### wm-container (C)
- **Defaults**: root: {} (empty — no visual styles), content.flexDirection: column, gap: 4, direction: row, alignment: top-left, wrap: false
- **Built-in appearances**: `default` (transparent, no border), `outlined` (1px border, outline.variant color), `elevated` (shadow: elevation.1, radius: sm)
- **Quirks**:
  - MUST have all 6 mandatory attributes: name, direction, gap, alignment, width, height.
  - **Container root has NO built-in visual styles** — no background, no border, no padding, no shadow. ALL visual styling comes exclusively from design tokens. This is by design: containers are pure layout primitives.
  - The `content.flexDirection` defaults to `column` but is overridden by the markup `direction` attribute.
  - **Use containers instead of grid components** — For multi-column layouts, use `direction="row"` with children sized via `width` prop. NEVER use `wm-layoutgrid`/`wm-gridrow`/`wm-gridcolumn`.
  - **Scrollable containers** — Set `overflow="Scroll"` to wrap content in a ScrollView. Row direction scrolls horizontally, column direction scrolls vertically.
  - **Wrapping rows** — Set `wrap="true"` on row containers to enable flex wrapping. Use `columngap` to control vertical gap between wrapped rows.
  - **`fill` width in row parent** — Uses `flexGrow=1, flexShrink=1, minWidth=0` so siblings share space. In column parent, uses `alignSelf='stretch'`.
  - **`hug` width in row parent** — Uses `flexGrow=0, flexShrink=0, flexBasis='auto'` so content doesn't shrink. In column parent, uses `alignSelf='flex-start'`.
  - **All 9 alignment values work for both directions** — `top-left`, `top-center`, `top-right`, `middle-left`, `middle-center`, `middle-right`, `bottom-left`, `bottom-center`, `bottom-right`. With `gap="auto"`, use `start`/`center`/`end` instead.
- **Mandatory Props**: direction(row|column), gap(auto|N), alignment(9 fixed + 3 auto values), width(fill|hug|Npx|N%), height(fill|hug|Npx|N%)
- **Optional Props**: padding(N), padding supports CSS shorthand (1, 2, or 4 values), overflow(No scrolling|Scroll), wrap(true|false), columngap(auto|N), position(relative|sticky|absolute|fixed), zindex(N), clipcontent(true|false), positionvalue("top right bottom left")
- **Fixed positioning (IMPORTANT)**: `wm-container` is the ONLY widget that supports `position="fixed"` + `positionvalue`. For ANY element that must stay fixed on screen (FAB buttons, floating CTAs, sticky overlays, bottom bars), wrap it in a container with these props. Other widgets like `wm-button`, `wm-label`, `wm-icon` do NOT have position props. `positionvalue` uses CSS shorthand `"top right bottom left"` with `auto` for unset edges (e.g., `"auto 16px 16px auto"` for bottom-right FAB). See `../container-system` Pattern 12 for common patterns.
- **Padding**: Direct props on container markup — NOT an inline style violation. Use CSS shorthand: `padding="16"` (all sides), `padding="12 16"` (vertical horizontal), or `padding="12 16 12 16"` (top right bottom left). Direct props override design token padding. Use padding props to closely match the design's inner content spacing.

### wm-panel (C)
- **Defaults**: padding 12px, collapsible false, expanded true
- **Quirks**: Contains `wm-panel-content` and optional `wm-panel-footer`.
- **Props**: title, subheading, collapsible, expanded, iconclass, badgevalue

### wm-tabs (C)
- **Defaults**: defaultpaneindex 0, enablegestures true
- **Quirks**: MUST contain `wm-tabpane` children. Non-selected tabs lazy-loaded.
- **Props**: defaultpaneindex, enablegestures

### wm-tabpane (C)
- **Props**: title, iconclass

### wm-accordion (C)
- **Defaults**: `defaultpaneindex=0` (0-indexed), `closeothers=true`, `animation="fadeInDown"`
- **Quirks**: MUST contain `wm-accordionpane` children. Do NOT hand-code collapsed/expanded state — set `defaultpaneindex` to control which pane starts open; runtime handles toggle.
- **Props**: `defaultpaneindex`, `closeothers`, `expandediconclass` (default `wi-chevron-down`), `collapsediconclass` (default `wi-chevron-up`)
- **Icon customization**: override both props when design shows a different toggle icon (e.g., `+`/`-` → `expandediconclass="wi-minus" collapsediconclass="wi-plus"`). Icon appears at the trailing edge of the header row.
- **Header style parts** (controlled by tokens or `class`/`variant`):
  - `header` — all collapsed headers: white bg, bottom separator border (`#333333`)
  - `first-header` — first pane header: adds top-left + top-right corner radius (`6px 6px 0 0`)
  - `last-header` — last pane's header when collapsed: adds bottom-left + bottom-right radius (`0 0 6px 6px`), no bottom border
  - `activeHeader` — expanded pane header: background becomes `color.primary` (brand color), overrides `header` bg
  - `activeHeaderTitle` / `activeIcon` — title text + icon turn white on the active header
  - `badge` — 24×24 circular badge on the header right side (use `badgevalue` on `wm-accordionpane`)
- **Key tokens** (in `tokens/accordion/accordion.json` → `accordion.appearances.<name>.mapping`):
  - `header.background-color` — collapsed header bg (default white)
  - `header.border.color` — header separator color (default `#333333`)
  - `header.padding` — header row padding (default `{space.2}` ≈ 8px)
  - `first-header.border.radius` — top corners of first header (default `6px 6px 0 0`)
  - `last-header.border.radius` — bottom corners of last header (default `0 0 6px 6px`)
  - `states.active.header.background-color` — expanded header bg (default `{color.primary}`)
  - `states.active.text.color` — title text on expanded header (default white)
  - `states.active.icon.color` — chevron/icon on expanded header (default white)
  - `icon.color` — chevron icon color for collapsed headers (default `{color.on-background}`)
- **OVERRIDE WHEN**:
  - Design shows **no colored active header** → override `states.active.header.background-color` to match design (e.g., lighter tint)
  - Design shows **+ / − toggle icons** → set `expandediconclass="wi-minus" collapsediconclass="wi-plus"`
  - Design shows **tighter header rows** → override `header.padding`
  - Design shows **no rounded corners** on accordion → override `first-header.border.radius` and `last-header.border.radius` to `0`
  - Design shows **separator line between panes** → override `header.border.color`

### wm-accordionpane (C)
- **Props**: `title`, `iconclass` (leading icon on header row), `subheading` (subtitle below title), `badgevalue` (badge label), `badgetype`
- **Pane content token**: `accordion-pane.appearances.<name>.mapping.content.background-color` — pane body bg (default `{color.surface}`)
- **Pane content padding token**: `accordion-pane.appearances.<name>.mapping.content.padding` (default `0px` — add when design shows padding inside pane body)

### wm-wizard (C)
- **Quirks**: MUST contain `wm-wizardstep` children.
- **Props**: defaultstep, cancelable, nextbtnlabel, previousbtnlabel, donebtnlabel

### wm-wizardstep (C)
- **Props**: title, iconclass, description

### ~~wm-layoutgrid / wm-gridrow / wm-gridcolumn~~ — BANNED
- **NEVER use these widgets.** For any grid/column layout, use `wm-container` with `direction="row"` and size children via `width` prop (e.g., `width="48%"` for 2-column, `width="32%"` for 3-column).

### wm-tile (C)
- Simple content wrapper

### wm-bottomsheet (C)
- **Defaults**: showonrender `false`, **bottomsheetheightratio `0.3`** (30% screen — NOT 0.5), modal `true`, expand `false`, bottomsheetexpandedheightratio `0.5`, autoclose `outsideClick`, disableswipedownclose `false`, issticky `false`, enabledragsettle `false`, disablescrollonrest `false`, enablemodalsupport `true`, keyboardverticaloffset `100`, bottomsheetminimumheight `0.1`
- **Runtime visual defaults** (from styles — override via tokens when design differs):
  - Sheet background: `#ffffff` (white)
  - Top border radius: `28px` (rounded top corners)
  - Drag handle: `36px wide × 4px tall` pill, grey color
  - Drag handle area padding: `16px` top/bottom
  - Content padding: `20px` horizontal, `20px` bottom, `0` top
  - Backdrop: semi-transparent `rgba(0,0,0,0.1)` overlay behind sheet
- **Rendering model**: `modal=true` (default) renders inside a React Native `Modal` — overlays EVERYTHING including tab bars and navigation bars. `modal=false` renders inline in the page z-stack (useful when tab bar should remain visible above the sheet).
- **OVERRIDE WHEN**:
  - Design shows **colored sheet background** → override `background` token (default is white `#fff`)
  - Design shows **smaller/no top radius** → override `border.radius` (default is `{radius.lg.value}` ≈ 28px)
  - Design shows **darker backdrop** → override `backdrop.background` (default `rgba(0,0,0,0.1)` is very light)
  - Design shows **no visible drag handle pill** → override `handle.icon.background` to `transparent`
  - Design shows **content flush to sheet edges** → override `content.padding` to remove the 20px horizontal default
  - Design shows **handle area with bottom border** → override `handle.border.color` (default is `transparent`)
- **Opening/closing** (IMPORTANT — not controlled by a prop toggle):
  - Call `Widgets.<name>.open()` / `Widgets.<name>.close()` from script or event bindings
  - Use `showonrender="true"` only when the sheet should be visible on page load
  - Swipe-down-to-dismiss is enabled by default; `disableswipedownclose="true"` prevents it
  - Backdrop tap closes by default (`autoclose="outsideClick"`); set `autoclose="disabled"` to prevent
- **Expandable mode** (`expand="true"`):
  - Enables two height levels: default (`bottomsheetheightratio`) and expanded (`bottomsheetexpandedheightratio`)
  - Upward swipe on drag handle triggers expand; `Widgets.<name>.expandBottomSheet()` does it programmatically
  - `Widgets.<name>.collapseBottomSheet()` returns to default height
  - `bottomsheetexpandedheightratio` minimum is `0.5` (clamped by runtime even if set lower)
- **Scroll behavior**:
  - Sheet content is wrapped in a `ScrollView` automatically — no need to add one inside
  - `issticky="true"` disables all scrolling (useful for sheets with only a few fixed items)
  - `disablescrollonrest="true"` disables scroll when at default height; scroll unlocks only after expanding
  - `enabledragsettle="true"` lets the sheet partially settle at a dragged position instead of snapping back
- **Keyboard handling**: Built-in — sheet height auto-adjusts when keyboard appears (important for form sheets)
- **Dialogs/popovers inside sheet**: `enablemodalsupport="true"` (default) allows `wm-dialog` and `wm-popover` to render correctly inside the sheet's z-stack
- **Events**:
  - `onOpened` — fires when sheet fully slides into view
  - `onClose` — fires when sheet fully closes
  - `onExpand` — fires when sheet expands to `bottomsheetexpandedheightratio`
  - `onCollapse` — fires when sheet collapses back from expanded height
  - `onDraghandleiconclick` — fires when drag handle pill is tapped (not dragged)
- **Programmatic API**:
  - `Widgets.<name>.open()` — open the sheet
  - `Widgets.<name>.close()` — close the sheet
  - `Widgets.<name>.expandBottomSheet()` — expand to full expanded height
  - `Widgets.<name>.collapseBottomSheet()` — collapse back to default height
  - `Widgets.<name>.isSheetExpanded()` — returns `true` if currently expanded
- **Props**: showonrender, bottomsheetheightratio, expand, bottomsheetexpandedheightratio, modal, autoclose(`outsideClick`|`disabled`), disableswipedownclose, bottomsheetminimumheight, enabledragsettle, disablescrollonrest, issticky, enablemodalsupport, keyboardverticaloffset

---

## Navigation Widgets

### wm-mobile-navbar (NC)
- **Defaults**: backbutton true, backbuttoniconclass `'wi wi-back'`, searchbuttoniconclass `'wm-sl-l sl-search'`
- **Quirks**: The `backbuttoniconclass` is `'wi wi-back'` (NOT `'wi wi-arrow-back'`). New `hideonscroll` prop hides navbar on scroll down.
- **Props**: title, backbutton, backbuttonlabel, backbuttoniconclass, leftnavpaneliconclass, searchbutton, searchbuttoniconclass, imgsrc, badgevalue, hideonscroll
- **⚠️ CAPABILITY LIMITS — use custom container navbar when these are needed**:
  - `wm-mobile-navbar` supports: plain-text `title`, logo via `imgsrc`, back button, left panel icon via `leftnavpaneliconclass`, search button
  - It does NOT support: multi-color/styled brand text, custom right-side action icons (cart, notifications, profile), multiple right-side icons, per-icon badge values on right icons
  - **When the design's navbar requires any unsupported element → use a custom container navbar**: `wm-container direction="row" position="fixed" positionvalue="0px auto auto auto"` with the layout children inside. Do NOT emit a `wm-mobile-navbar` at all in this case.
  - **`position="fixed"` is mandatory on the custom navbar container** — without it the navbar scrolls away with the page content. Use `positionvalue="0px auto auto auto"` to pin it to the top edge.
  - **NEVER emit both** — an empty or partial `wm-mobile-navbar` alongside a custom container navbar creates two conflicting header regions. Make one clear choice: built-in navbar OR custom container, never both on the same page.

### wm-mobile-tabbar (NC)
- **Defaults**: root.height: **80px**, menu.backgroundColor: **themeVariables.tabbarBackgroundColor** (typically WHITE), tabLabel.color: **themeVariables.tabbarTextColor** (dark), tabLabel.fontSize: 12px, tabLabel.fontWeight: 500, tabIcon.icon.fontSize: 24px, tabIcon.icon.color: **themeVariables.tabbarIconColor** (dark), activeTabItem.backgroundColor: **themeVariables.tabActiveBackgroundColor** (accent), activeTabLabel.fontWeight: 700, activeTabLabel.color: **themeVariables.tabLabelTextColor**
- **OVERRIDE WHEN (CRITICAL)**:
  - **Dark-themed pages** → **DO NOT USE `wm-mobile-tabbar`**. Its colors (background, text, icons) come from theme-level variables (`tabbarBackgroundColor`, `tabbarTextColor`, `tabbarIconColor`) that CANNOT be overridden via per-page design tokens. On a dark page, the tab bar will appear with a white/light background, creating a jarring mismatch. Use a custom container tab bar instead (see Pattern 8 in `../container-system`).
  - **Custom styling needs** → If the design requires non-standard tab bar styling (gradient, custom icons, badges, unusual layout), use a custom container tab bar.
- **Quirks**: 
  - **MUST be placed outside `<wm-content>`, directly inside `<wm-page>`** — NOT inside the main wrapper or `wm-page-content`. The framework handles bottom positioning automatically.
  - **Theme-dependent colors** — All visual properties (background, text color, icon color, active state) are controlled by theme variables, NOT by per-page design tokens. This means `wm-mobile-tabbar` always matches the global theme, not the individual page design.
  - If you need a custom tab bar with container-based layout instead, use `wm-container` with `position="fixed" positionvalue="auto auto 0px auto"` and place it as the last child of the main wrapper inside `wm-page-content`.
- **Props**: dataset, itemlabel, itemicon, itemlink, morebuttoniconclass

### wm-menu (NC)
- **Defaults**: iconclass "fa fa-caret-down", animateitems "slide"
- **Props**: caption, iconclass, dataset, itemlabel, itemicon, itemlink

### wm-popover (C)
- **Defaults**: popoverwidth 240, popoverheight 360, autoopen false, autoclose "outsideClick", draghandle false
- **Quirks**: Use `type="dropdown"` for positioned dropdowns, `type="action-sheet"` for bottom sheets. Action-sheets support drag-to-dismiss via PanResponder. `draghandle="true"` shows a drag handle icon at the top.
- **Props**: caption, iconclass, type(action-sheet|dropdown), title, autoclose(outsideClick|disabled|always), draghandle(false), contentanimation

### wm-nav (NC)
- **Props**: dataset, itemlabel, itemlink, itemicon, itembadge, type(pills)

---

## Dialog Widgets

### wm-alertdialog (NC)
- **Props**: title, message, oktext, alerttype, iconclass

### wm-confirmdialog (NC)
- **Props**: title, message, oktext, canceltext, iconclass

### wm-dialog (C)
- **Defaults**: show false, modal true, showheader true, closable true
- **Quirks**: MUST contain `wm-dialogcontent`. Optional `wm-dialogactions`.
- **Props**: title, closable, modal, iconclass

---

## Advanced Widgets

### wm-carousel (C)
- **Defaults**: animationinterval 3 (seconds), controls "both", enablegestures true, stopatlast false, **slide.paddingHorizontal: 16px** (side gaps!), **slide.transform: scale(0.8)** (inactive slide shrink!), dotStyle.width: 10px, dotStyle.height: 10px, dotStyle.opacity: 0.6, activeDotStyle.opacity: 1, prevBtn/nextBtn.width: 48px, prevBtn/nextBtn.height: 48px, prevBtn/nextBtn.borderRadius: 48px
- **OVERRIDE WHEN (CRITICAL — most hero/feature carousels need these)**:
  - Design shows **full-bleed slides** (no visible "peek" of adjacent slides, no side gaps) → override `slide.padding: "0px"` and `slide.transform: "none"`. Without this, every slide has 16px horizontal padding and inactive slides scale to 80%, creating visible side gaps that rarely match the design.
  - Design shows **only dot indicators** (no prev/next arrows) → set `controls="indicators"` (default is `"both"` which adds large 48x48 circular arrow buttons)
  - Design shows **no controls at all** → set `controls="none"`
  - Design shows **custom dot size** → override `dotStyle.width`, `dotStyle.height`, `dotStyle.borderRadius`
  - Design shows **custom dot colors** → override `dotStyle.backgroundColor` and `activeDotStyle.backgroundColor`
- **Quirks**:
  - Contains `wm-carousel-template` children.
  - **`animationinterval` is in SECONDS** (not milliseconds). Default is `3` = 3 seconds.
  - **Inactive slides are scaled down to 0.8 by default** — this creates a "peek" effect where adjacent slides are partially visible and smaller. For full-bleed hero carousels (streaming apps, news feeds, promotional banners), you almost ALWAYS need to override this to `scale(1)` or `"none"`.
  - **Each slide has 16px horizontal padding by default** — this prevents slides from being edge-to-edge. Override `slide.padding` for full-bleed layouts.
  - Navigation dots are 10x10px by default. Override `dotStyle.*` part tokens for custom indicator sizing.
  - Prev/Next buttons are large (48x48) circles by default.
  - `stopatlast="true"` prevents infinite looping.
  - **For overlay text on carousel slides** — put a relative + absolute container pattern INSIDE the `wm-carousel-template` (see Pattern 13 in `../container-system`).
- **Props**: dataset, type(static|dynamic), animation(auto|none), animationinterval(seconds), controls(both|navs|indicators|none), stopatlast, enablegestures

### wm-webview (NC)
- **Props**: src

### wm-video (NC)
- **Props**: mp4format, autoplay, controls, loop, videoposter

### wm-audio (NC)
- **Props**: mp3format, autoplay, controls, loop

### wm-lottie (NC)
- **Props**: source, autoplay, loop, speed

### wm-camera (NC)
- **Props**: capturetype(IMAGE), iconclass, caption

### wm-barcodescanner (NC)
- **Props**: barcodeformat(ALL), caption, iconclass
