---
name: wavemaker-design-system
description: "Apply WaveMaker styling using design tokens and component variants. Use when styling components: reuse existing tokens/variants first, then create or update them, before falling back to page CSS."
---

# Skill: Styling, Tokens, and Variants

Helps to match the screenshot styling while preserving WaveMaker token/variant-driven design workflow.

---

## Part 1 — File System Map

Everything in this skill reads from or writes to one of two locations: **catalog files** (read-only reference) and **project override files** (read/write).

### 1.1 Catalog Files (Read-Only Reference)

These are static files shipped with the platform. Never write to them.

#### Design Token Defaults — `/catalog/design-tokens/`

One file per token category. Use these as baseline when no project override exists.

| Token category | Catalog file | Notes |
|---|---|---|
| color | `/catalog/design-tokens/color.md` | |
| font | `/catalog/design-tokens/font.md` | |
| space | `/catalog/design-tokens/space.md` | |
| radius | `/catalog/design-tokens/radius.md` | |
| border-style | `/catalog/design-tokens/borderStyle.md` | ← camelCase filename |
| opacity | `/catalog/design-tokens/opacity.md` | |
| icon | `/catalog/design-tokens/icon.md` | |
| elevation | `/catalog/design-tokens/elevation.md` | |
| border-width | `/catalog/design-tokens/border.md` | ← filename is `border`, not `border-width` |

#### Component Variant Schemas — `/catalog/theme-components/`

One folder per supported component. Each folder contains a `token-structure.md` that defines the valid token keys for variant creation.

- **Supported component list**: `/catalog/theme-components/theme-components-list.md`
- **Per-component token schema**: `/catalog/theme-components/<dir>/token-structure.md`
  - e.g. `/catalog/theme-components/button/token-structure.md`
  - Read this file for every component on which a variant is being created. It defines the JSON structure: root key → `appearances` → variant name → `mapping` → valid token keys. Only token keys present in this file are valid — anything outside the schema is silently ignored.
  - Only components listed in `theme-components-list.md` are eligible for variant creation.

---

### 1.2 Project Override Files (Read/Write)

These are the only files you create or modify. Foundation defaults are never edited directly.

#### Global Token Overrides

```
src/main/webapp/design-tokens/overrides/global/<category>/<file>.json
```

| Token category | Override file path |
|---|---|
| color (light theme) | `src/main/webapp/design-tokens/overrides/global/color/color.light.json` |
| color (dark theme) | `src/main/webapp/design-tokens/overrides/global/color/color.dark.json` (only when design has explicit dark theme) |
| font | `src/main/webapp/design-tokens/overrides/global/font/font.json` |
| radius | `src/main/webapp/design-tokens/overrides/global/radius/radius.json` |
| space | `src/main/webapp/design-tokens/overrides/global/space/space.json` |
| elevation | `src/main/webapp/design-tokens/overrides/global/elevation/elevation.json` |
| opacity | `src/main/webapp/design-tokens/overrides/global/opacity/opacity.json` |
| icon | `src/main/webapp/design-tokens/overrides/global/icon/icon.json` |
| border-style | `src/main/webapp/design-tokens/overrides/global/borderStyle/borderStyle.json` ← **camelCase** folder + file |
| border-width | `src/main/webapp/design-tokens/overrides/global/border/border.json` ← folder + file are `border` (NOT `border-width`) |

The camelCase / renamed paths are platform conventions — don't normalize them.

#### Component Variant Override Files

```
src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json
```

Where `<dir>` is the **directory name** from the Component Names table (Part 2). The JSON root key inside the file is different from the directory name for some components — see Part 2.

- e.g. button variants → `src/main/webapp/design-tokens/overrides/components/button/button.json`
- e.g. cards variants → `src/main/webapp/design-tokens/overrides/components/cards/cards.json`

---

## Part 2 — Component Names and Variant Eligibility

### 2.1 Directory vs JSON Root Key

The token filesystem uses a **directory name** for the file path, while the **root key** inside each JSON is the identifier written in custom tokens. These two are not always the same.

| Directory (file path) | JSON Root Key | Notes |
|---|---|---|
| `accordion/accordion.json` | `accordion` | |
| `anchor/anchor.json` | `anchor` | |
| `audio/audio.json` | `audio` | |
| `badge/badge.json` | `badge` | |
| `breadcrumb/breadcrumb.json` | `breadcrumb` | appearances: classic, attribute-based, path-based |
| `button/button.json` | **`btn`** | ← not `button` |
| `button-group/button-group.json` | `button-group` | |
| `calendar/calendar.json` | `calendar` | |
| `carousel/carousel.json` | `carousel` | |
| `checkbox/checkbox.json` | `checkbox` | |
| `checkboxset/checkboxset.json` | `checkboxset` | |
| `chips/chips.json` | `chips` | appearances: filled, elevated |
| `color-picker/color-picker.json` | `color-picker` | |
| `container/container.json` | `container` | appearances: default, outlined, elevated |
| `currency/currency.json` | `currency` | |
| `data-table/data-table.json` | `data-table` | appearances: default, condensed, striped-even, striped-odd |
| `date/date.json` | **`datepicker`** | ← not `date` |
| `dropdown-menu/dropdown-menu.json` | **`dropdown`** | ← not `dropdown-menu` |
| `fileupload/fileupload.json` | **`file-upload`** | ← hyphen added |
| `form-controls/form-controls.json` | **`form`** | covers ALL text/select/textarea/date/time inputs |
| `grid-layout/grid-layout.json` | `grid-layout` | |
| `icon/icon.json` | `icon` | |
| `iconbutton-toggleable/iconbutton-toggleable.json` | **`iconbutton-toggle`** | |
| `iframe/iframe.json` | `iframe` | |
| `label/label.json` | `label` | appearances: default, text, label |
| `list/list.json` | `list` | (per-item styling lives under `item.*`) |
| `message/message.json` | `message` | appearance: filled |
| `modal-dialog/modal-dialog.json` | **`modal`** | appearances: default, sheet |
| `nav/nav.json` | `nav` | |
| `page-content/page-content.json` | **`page`** | |
| `page-footer/page-footer.json` | **`footer`** | |
| `page-header/page-header.json` | **`header`** | |
| `page-left-nav/page-left-nav.json` | **`aside-left`** | appearances: full, clipped (navtype variants: nav-drawer, nav-rail) |
| `page-right-nav/page-right-nav.json` | **`aside-right`** | appearances: full, clipped (navtype variants: nav-drawer, nav-rail) |
| `page-top-nav/page-top-nav.json` | **`top`** | |
| `pagination/pagination.json` | `pagination` | appearances: basic, pager, advanced |
| `panel/panel.json` | `panel` | appearance: default |
| `picture/picture.json` | `picture` | appearances: default, thumbnail |
| `popover/popover.json` | `popover` | |
| `progress-bar/progress-bar.json` | `progress-bar` | appearances: filled, striped |
| `progress-circle/progress-circle.json` | `progress-circle` | appearance: filled |
| `radioset/radioset.json` | **`radiobutton`** | |
| `rating/rating.json` | `rating` | |
| `richtext-editor/richtext-editor.json` | **`note`** | |
| `scrollbar/scrollbar.json` | **`scroll`** | |
| `search/search.json` | `search` | |
| `slider/slider.json` | `slider` | |
| `spinner/spinner.json` | `spinner` | |
| `switch/switch.json` | `switch` | |
| `tabs/tabs.json` | `tabs` | |
| `tile/tile.json` | `tile` | appearances: default, filled |
| `time/time.json` | **`timepicker`** | |
| `toast/toast.json` | `toast` | appearance: filled |
| `toggle/toggle.json` | `toggle` | |
| `video/video.json` | `video` | |
| `wizard/wizard.json` | `wizard` | appearances: number, iconstepper, iconstepper-textinline, dottedstepper, dottedstepper-textinline, classic, vertical |

Anywhere a root key differs from the directory, using the wrong name results in the token being silently ignored.

### 2.2 Widget to Root Key Mapping (Markup Usage)

Every styled widget needs BOTH attributes in markup:
- `class="<root-key>-<appearance>"` — CSS class for token overrides
- `variant="<appearance>"` — appearance name from token JSON

| Widget | Root Key(s)          | Example                                              |
|--------|----------------------|------------------------------------------------------|
| wm-accordion | `accordion`, `panel` | `class="accordion-flush" variant="flush"`            |
| wm-anchor | `anchor`             | `class="anchor-nav-link" variant="nav-link"`         |
| wm-audio | `audio`              | `class="audio-minimal" variant="minimal"`            |
| wm-breadcrumb | `breadcrumb`         | `class="breadcrumb-slim" variant="slim"`             |
| wm-button | `btn`                | `class="btn-cta" variant="cta"`                      |
| wm-buttongroup | `button-group`       | `class="button-group-segmented" variant="segmented"` |
| wm-calendar | `calendar`           | `class="calendar-compact" variant="compact"`         |
| wm-carousel | `carousel`           | `class="carousel-dots" variant="dots"`               |
| wm-checkbox | `checkbox`, `toggle` | `class="checkbox-pill" variant="pill"`               |
| wm-chips | `chips`              | `class="chips-outlined" variant="outlined"`          |
| wm-colorpicker | `color-picker`       | `class="color-picker-compact" variant="compact"`     |
| wm-container | `container`          | `class="container-pill-row" variant="pill-row"`      |
| wm-currency | `currency`, `form`   | `class="currency-inline" variant="inline"`           |
| wm-date | `form`, `date`       | `class="date-inline form-custom" variant="inline"`   |
| wm-dialog | `modal`              | `class="modal-sheet" variant="sheet"`                |
| wm-fileupload | `file-upload`        | `class="file-upload-dropzone" variant="dropzone"`    |
| wm-footer | `footer`             | `class="footer-sticky" variant="sticky"`             |
| wm-form / wm-liveform / wm-livefilter | `form-wrapper`       | `class="form-wrapper-compact" variant="compact"`     |
| wm-header | `header`             | `class="header-transparent" variant="transparent"`   |
| wm-icon | `icon`               | `class="icon-chevron" variant="chevron"`             |
| wm-iframe | `iframe`             | `class="iframe-bordered" variant="bordered"`         |
| wm-label | `label`              | `class="label-product-name" variant="product-name"`  |
| wm-layoutgrid | `grid-layout`        | `class="grid-layout-fixed" variant="fixed"`          |
| wm-left-panel | `aside-left`         | `class="aside-left-rail" variant="rail"`             |
| wm-list | `list`               | `class="list-flat" variant="flat"`                   |
| wm-menu | `dropdown`, `btn`    | `class="dropdown-mega" variant="mega"`               |
| wm-message | `message`            | `class="message-toast" variant="toast"`              |
| wm-nav | `nav`                | `class="nav-pills" variant="pills"`                  |
| wm-navbar | `navbar`             | `class="navbar-transparent" variant="transparent"`   |
| wm-number | `form`               | `class="form-filled" variant="filled"`               |
| wm-page-content | `page`               | `class="page-scrollable" variant="scrollable"`       |
| wm-panel | `panel`              | `class="panel-aside" variant="aside"`                |
| wm-picture | `picture`            | `class="picture-avatar" variant="avatar"`            |
| wm-popover | `popover`            | `class="popover-tooltip" variant="tooltip"`          |
| wm-progress-bar | `progress-bar`       | `class="progress-bar-thin" variant="thin"`           |
| wm-progress-circle | `progress-circle`    | `class="progress-circle-sm" variant="sm"`            |
| wm-radioset | `radiobutton`        | `class="radiobutton-pill" variant="pill"`            |
| wm-rating | `rating`             | `class="rating-inline-sm" variant="inline-sm"`       |
| wm-richtexteditor | `note`               | `class="note-minimal" variant="minimal"`             |
| wm-right-panel | `aside-right`        | `class="aside-right-drawer" variant="drawer"`        |
| wm-search | `form`, `search`     | `class="search-bar form-custom" variant="bar"`       |
| wm-select | `form`               | `class="form-filled" variant="filled"`               |
| wm-spinner | `spinner`            | `class="spinner-sm" variant="sm"`                    |
| wm-switch | `switch`             | `class="switch-compact" variant="compact"`           |
| wm-table / wm-livetable | `data-table`         | `class="data-table-striped" variant="striped"`       |
| wm-tabs | `tabs`               | `class="tabs-underline" variant="underline"`         |
| wm-text | `form`               | `class="form-outlined" variant="outlined"`           |
| wm-textarea | `form`               | `class="form-auto-resize" variant="auto-resize"`     |
| wm-tile | `tile`               | `class="tile-outlined" variant="outlined"`           |
| wm-time | `form`, `time`       | `class="time-inline form-custom" variant="inline"`   |
| wm-top-nav | `top`                | `class="top-sticky" variant="sticky"`                |
| wm-video | `video`              | `class="video-cover" variant="cover"`                |
| wm-wizard | `wizard`             | `class="wizard-stepper" variant="stepper"`           |

### 2.3 Components with Multiple Root Keys

Some widgets render distinct sub-elements, each independently styleable via its own root key. You can apply a separate variant per root key — create one override entry per root key in the component override file, and add one `class="<root-key>-<appearance>"` per root key in markup (space-separated on the same element).

**Example — accordion with separate outer and panel variants:**
```html
<wm-accordion class="accordion-borderless panel-card" variant="borderless">
```
`accordion-borderless` targets the accordion container; `panel-card` targets each inner content pane.

**Example — search with separate field and icon variants:**
```html
<wm-search class="search-compact form-outlined" variant="compact">
```
`search-compact` targets the search icon/view; `form-outlined` targets the text input inside.

| Widget | Root Key | Sub-element targeted | Root Key | Sub-element targeted |
|--------|----------|----------------------|----------|----------------------|
| wm-accordion | `accordion` | Accordion container (headers, expand/collapse chrome) | `panel` | Content pane inside each accordion item |
| wm-search | `search` | Search icon and surrounding view | `form` | Text input field inside |
| wm-date | `form` | Text input shell (border, padding, bg, typography) | `datepicker` | Date-picker popup/calendar |
| wm-time | `form` | Text input shell (border, padding, bg, typography) | `timepicker` | Time-picker popup/clock |
| wm-currency | `currency` | Currency-specific appearance | `form` | Text input shell |
| wm-checkbox | `checkbox` | Checkbox box + label styling | `toggle` | Renders as an on/off toggle switch |
| wm-menu | `dropdown` | The dropdown menu list | `btn` | The menu trigger button |

#### List Items — Always Use a List Variant

To style any element inside each item of `wm-list`, always create a `list` component variant. Do not use page CSS selectors targeting list item children. The list variant controls the full item rendering scope.

#### wm-container — Variant Inheritance

Child containers automatically inherit the parent container's variant (background, border, radius, shadow). Any child that needs distinct visual styling MUST have its own `class` + `variant`. Layout-only containers with no visual styling (no background, no border, no shadow) should use `class=""` with no `variant` to avoid unintended style inheritance.

#### wm-container — Background Color Must Use a Variant

`wm-container` supports `background` as a first-class token key in its variant schema (root-level `mapping.background`). Any container that needs a non-default background color **must use a component variant** — not page CSS.

This rule applies equally to all containers regardless of where they appear: page-content, host partials (`wm-left-panel`, `wm-header`, etc.), sub-panels, icon rails, and drawer panels.

**Correct approach — create a container variant with background:**
```json
// src/main/webapp/design-tokens/overrides/components/container/container.json
{
  "container": {
    "appearances": {
      "icon-rail": {
        "mapping": {
          "background": { "value": "#1A1744" }
        }
      },
      "tree-panel": {
        "mapping": {
          "background": { "value": "#ECEEFF" }
        }
      }
    }
  }
}
```
Then in markup: `<wm-container class="container-icon-rail" variant="icon-rail">`

**Wrong — page CSS for container background (HARD FAILURE):**
```css
.leftnav-icon-rail { background: #1A1744; }  /* ❌ background is a variant token key */
```

#### Partial Widget Styling — Token on the Partial Widget, Not Its Root Container

Visual tokens (background, border, shadow) for scaffold partials (`wm-header`, `wm-left-panel`, `wm-footer`) must be applied via `class`/`variant` on the **partial widget itself** — NOT on the root `wm-container` inside the partial content.

- The partial widget's token controls the surface (background, border, shadow of the host region).
- The root `wm-container` inside the partial is **layout-only**: set `direction`, `gap`, `alignment`, `padding`, `width`, `height` on it, but no visual variant.

**Correct:**
```xml
<wm-header name="header1" class="header-primary" variant="primary">
  <wm-container name="header_root" class="" direction="row" gap="auto" alignment="center" width="fill" height="hug" padding="0px 24px">
    <!-- content -->
  </wm-container>
</wm-header>
```
Token file: `src/main/webapp/design-tokens/overrides/components/page-header/page-header.json`
```json
{ "header": { "appearances": { "primary": { "mapping": { "background": { "value": "..." }, "shadow": { "value": "..." } } } } } }
```

**Wrong — visual variant on root container inside partial:**
```xml
<wm-header name="header1">
  <wm-container name="header_root" class="container-header-bg" variant="header-bg" ...>
    <!-- ❌ background token here is on the wrong element -->
  </wm-container>
</wm-header>
```

The same rule applies to `wm-left-panel` and `wm-footer`:

| Widget | Root key (web) | Class naming pattern | Token file path |
|---|---|---|---|
| `wm-header` | `header` | `header-<variantname>` (e.g. `header-primary`, `header-darkbg`) | `components/page-header/page-header.json` |
| `wm-left-panel` | `aside-left` | `aside-left-<variantname>` (e.g. `aside-left-dark`, `aside-left-bordered`) | `components/page-left-nav/page-left-nav.json` |
| `wm-footer` | `footer` | `footer-<variantname>` (e.g. `footer-sticky`) | `components/page-footer/page-footer.json` |

---

## Part 3 — Design Principles

### 3.1 Fidelity Gate

For screenshot-driven page creation, confirm one mode:
- `maintain_brand`
- `match_screenshot`

Track:
- `styling_fidelity`
- `prefer_existing_variants`

Fidelity behavior:
- Both fidelity modes start by evaluating existing/default tokens and variants.
- `maintain_brand`: if existing/default style is reasonably close, keep it and avoid creating new variants/tokens.
- `match_screenshot`: require pixel-perfect screenshot fidelity; if defaults are not exact enough, create/update tokens and/or variants.

Flag interpretation:
- `prefer_existing_variants=true`: prefer existing/default/closest variants first; create new variants only if no acceptable close match exists.
- `prefer_existing_variants=false`: new variants may be created when needed, while still allowing reuse of existing variants when suitable.

### 3.2 Background Scan (MANDATORY — Before Writing Any Token)

Before generating any token or variant, scan every section of the screenshot for background color. **Every non-white / non-transparent section MUST get a background token.** Frequently missed areas:
- Colored cards or KPI tiles
- Promotional banners and hero sections
- Section bands with a tinted background
- Sidebar / left-panel shell
- Header shell

Skipping this means those sections render white, producing a visually wrong page regardless of how accurate the other tokens are.

### 3.3 Default Override Analysis (MANDATORY — Per Widget, Before Writing Tokens)

WaveMaker components ship with built-in defaults (shadow, border, radius, padding, min-height). Before writing token values for any widget, ask these 6 questions. If the design says **NO** to any of them, generate an explicit override to remove the default:

| Question | Design shows NO → generate override |
|---|---|
| Does the design show a **shadow / elevation**? | `shadow: "{elevation.shadow.none.value}"` |
| Does the design show a **border**? | `border.width: "{border.width.0.value}"`, `border.style: "none"` |
| Does the design show a **background color**? | `background: "transparent"` or `background-color: "none"` |
| Does the design show **inner padding**? | `padding: "{space.0.value}"` |
| Does the design show **rounded corners**? | `border.radius: "{radius.none.value}"` |
| Does the design need a **smaller size**? | `min-height: "0px"` or explicit `height: "Npx"` |

### 3.4 Core Design System Rules

- Keep customizations update-safe: never edit default theme files directly; only write to global/component override files.
- Treat default structures as schema source of truth; all token/variant JSON must follow platform-returned structure.
- Supported global token property families: `color`, `font`, `space`, `radius`, `border-style`, `opacity`, `icon`, `elevation`, `border-width`.
- Create required missing tokens/variants before main markup generation.
- Do not add page CSS during main markup generation unless no variant (existing or new) can handle the required styling after passing the Part 6.2 gate.
- Never delete existing global tokens while modifying component variants.

---

## Part 4 — Global Token Overrides

### 4.1 When to Override

To change a global value (brand color, brand font, custom radius scale, etc.), write a **sparse override file** at the canonical path from Part 1.2. The platform layers your override on top of the foundation at runtime — your file only needs the keys you're changing.

### 4.2 Workflow

1. Identify all token categories needed (color, font, radius, space, etc.).
2. Batch-read all relevant files in a single `read_files` call — pass all paths together as an array. For each category include whichever applies:
   - The project override file at its canonical path (Part 1.2) if it exists, OR
   - The corresponding catalog file (Part 1.1) as baseline if no override exists.
   - Do not read one category at a time; gather all needed paths and read them together.
3. Map styling needs to existing token values first; create new tokens only when no exact token exists.
4. Save to `src/main/webapp/design-tokens/overrides/global/<category>/<file>.json` only when a real token gap exists.
5. Append newly created tokens to the end of the token JSON structure.
6. When font files are involved, write font-face definitions for each font family from Google Fonts API to `src/main/webapp/app.css`.

### 4.3 Override JSON Shape — Sparse Mirror of the Foundation Tree

Every override file mirrors the foundation tree with **only** the keys you're changing. Each leaf is `{ "value": "<override>" }` — no `type`, no `attributes`.

**Override `color.primary.@` to brand `#3366FF`:**

```json
{
  "color": {
    "primary": {
      "@": { "value": "#3366FF" }
    }
  }
}
```

**Override font family + body size:**

```json
{
  "font": { "family": { "value": "Inter, sans-serif" } },
  "body": { "medium": { "font-size": { "value": "15px" } } }
}
```

**Bump the `lg` radius to 20px:**

```json
{ "radius": { "lg": { "value": "20px" } } }
```

### 4.4 Hard Rules

1. **The path must already exist in the foundation.** You cannot invent new global tokens — e.g., `color.brand.@` is invalid if `brand` isn't in the foundation. If the design needs a value that doesn't fit any foundation slot, leave it as a per-component appearance value instead.
2. **Sparse only.** Never copy the whole foundation tree into the override file. Only the keys you actually change.
3. **No `type`, no `attributes`.** Override leaves are `{ "value": "..." }` — period.
4. **Top-level key matches the property.** `color.*` overrides start with `"color": {…}`; `radius.*` start with `"radius": {…}`; `border-width.*` start with `"border": { "width": {…} }`; `border-style.*` start with `"border": { "style": {…} }`. Don't drop the top-level wrapper.
5. **No empty files.** If you didn't change anything in a category, don't create the file.

---

## Part 5 — Component Variant Overrides

### 5.1 When to Override

Custom component appearances are never written into the foundation directly. Write a **sparse override file** at the canonical path from Part 1.2. The platform merges your appearances on top of the foundation at runtime.

### 5.2 Workflow

1. Identify all components that need variant overrides.
2. For each component, batch-read both the existing override file and the catalog token-structure in a single `read_files` call — pass all paths together as an array:
   - `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json` (if it exists — skip silently if not)
   - `/catalog/theme-components/<dir>/token-structure.md`
   - Do this for all components at once, not one component at a time.
3. From `token-structure.md`, identify the valid token key schema — root key → `appearances` → variant name → `mapping` → valid token keys. Only keys present in this schema are valid.
4. If a required global token is missing, add it first via the Global Token Workflow (Part 4) before proceeding.
5. Save/update component variant definitions to `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json`.

### 5.3 Override JSON Shape

The override file contains only the `appearances` you are adding or modifying. The JSON root key must be the **JSON Root Key** from Part 2.1 (e.g., `btn` for the `button` directory, `card` for the `cards` directory).

```json
{
  "<rootKey>": {
    "appearances": {
      "<appearanceName>": {
        "mapping": {
          "<tokenKey>": { "value": "{globalTokenRef}" }
        }
      }
    }
  }
}
```

**Example — custom "cta" appearance on a button (`...overrides/components/button/button.json`):**

```json
{
  "btn": {
    "appearances": {
      "cta": {
        "mapping": {
          "background": { "value": "{color.primary.@.value}" },
          "color": { "value": "{color.on-primary.@.value}" },
          "border": {
            "color": { "value": "{color.primary.@.value}" }
          },
          "radius": { "value": "{radius.full.value}" }
        }
      }
    }
  }
}
```

### 5.4 Hard Rules

1. **Root key must match the JSON Root Key** from Part 2.1, not the directory name. Using the directory name as the root key (e.g. `button` instead of `btn`) silently breaks the token.
2. **Sparse only** — only include the `appearances` being added or modified. Never copy the entire token-structure schema into the override file.
3. **Only keys from the token schema are valid.** Read `/catalog/theme-components/<dir>/token-structure.md` to confirm which keys are allowed inside `mapping`. Keys not in that schema are silently ignored.
4. **Use global token references** as values where possible — never hardcode raw hex/px values when a token reference exists:
   - ❌ `"background": {"value": "#419f7e"}`
   - ✅ `"background": {"value": "{color.green.500.value}"}`
5. **No `type`, no `attributes`** in override leaves — just `{ "value": "..." }`.
6. **8-digit hex for all color values** — always include the alpha channel: `"#7C4DFFff"` (append `ff` for fully opaque). 6-digit hex is not valid in the token engine and will produce incorrect or ignored colors.

---

## Part 5B — Built-in Component Appearances

Read `/catalog/theme-components/<dir>/token-structure.md` for the target component. The `appearances` object lists all foundation-defined appearances and their `mapping`. If a matching appearance exists, use it directly — set `variant="<appearanceName>"` and `class="<root-key>-<appearanceName>"` on the component. Only create a new appearance in the override file when no built-in appearance matches the required styling.

When creating a new appearance, use the exact same JSON structure as the built-in appearances in `token-structure.md` — `{ "<rootKey>": { "appearances": { "<name>": { "mapping": { ... } } } } }`.

### Button (`btn`)

| Appearance | Description |
|-----------|-------------|
| `filled` | Solid background, default shape |
| `outlined` | Transparent bg, colored border |
| `text` | No bg, no border, colored text |
| `transparent` | Fully transparent |

Each appearance has a `variantGroups.status` sub-structure with variants: `default`, `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `danger`, `light`, `dark`, `link`.

### Container (`container`)

| Appearance | Description |
|-----------|-------------|
| `default` | Transparent bg, no border, no shadow |
| `outlined` | With border |
| `elevated` | With elevation shadow |

### Label (`label`)

| Appearance | Description |
|-----------|-------------|
| `default` | Typography variants: h1-h6, p, display.large/medium/small |
| `text` | Status color variants: primary, secondary, success, warning, danger, info, muted |
| `label` | Badge-style (padded, bold) — same status variants as `text` |

### Cards (`card` — directory `cards/`)

| Appearance | Description |
|-----------|-------------|
| `default` | Standard card |
| `filled` | Filled background |
| `elevated` | With shadow elevation |

### Other Components with Appearances

| Component (root key) | Appearances |
|---|---|
| `breadcrumb` | classic, attribute-based, path-based |
| `chips` | filled, elevated |
| `data-table` | default, condensed, striped-even, striped-odd |
| `iconbutton-toggle` | default, outlined, filled |
| `message` | filled |
| `modal` | default, sheet |
| `pagination` | basic, pager, advanced |
| `panel` | default |
| `picture` | default, thumbnail |
| `progress-bar` | filled, striped |
| `progress-circle` | filled |
| `tile` | default, filled |
| `toast` | filled |
| `accordion` | default |
| `icon` | default |
| `aside-left` / `aside-right` | full, clipped — with variantGroups: nav-drawer, nav-rail |
| `wizard` | number, iconstepper, iconstepper-textinline, dottedstepper, dottedstepper-textinline, classic, vertical, tabstepper |

Components with NO foundation appearances (root `mapping` only, no `appearances` object): `anchor`, `audio`, `badge`, `button-group`, `calendar`, `carousel`, `checkbox`, `checkboxset`, `color-picker`, `currency`, `datepicker`, `dropdown`, `file-upload`, `form`, `grid-layout`, `iframe`, `list`, `nav`, `page`, `footer`, `header`, `top`, `popover`, `radiobutton`, `rating`, `note`, `scroll`, `search`, `slider`, `spinner`, `switch`, `tabs`, `timepicker`, `toggle`, `video`.

### Rating — Default Colors

| Property | Default Value |
|----------|--------------|
| Active star color | `{color.warning.@.value}` = **#ffae00 (gold)** |
| Inactive star color | inherits `color.on-surface.@` = `#1D1B20` |

---

## Part 5C — When to Use Foundation vs Custom Tokens

| Scenario | Use Foundation | Use Custom Token |
|----------|---------------|-----------------|
| Gold star rating | Yes — `{color.warning.@.value}` is the default | No |
| Primary-colored button | Yes — `btn.filled` appearance with status `primary` | No |
| Transparent text button | Yes — `btn.text` or `btn.transparent` appearance | No |
| Muted / secondary text label | Yes — `label.text` with status `muted` | Only if custom color |
| Custom brand shade not in theme | Check `primary.container`, `surface.container.*` variants first | Yes — if no foundation match |
| Standard spacing (4, 8, 16, 24 px) | Yes — `space.*` | No |
| Unusual spacing (18px, 30px) | No — nearest `space` won't match | Yes — static px value |

---

## Part 6 — Variant Rules and Conventions

### 6.1 Variant Selection Rules

- If `prefer_existing_variants=true`, first attempt reuse of existing/default/closest matching variants.
- If no acceptable close match exists, new variant creation is allowed even when `prefer_existing_variants=true`.
- If `prefer_existing_variants=false`, create new variants as needed after evaluating existing options.
- Under `styling_fidelity=match_screenshot`, "acceptable close match" is not allowed; required threshold is pixel-perfect (within strict rendering tolerance). If unmet, create/update variants/tokens.
- Under `styling_fidelity=maintain_brand`, "acceptable close match" threshold is relaxed (visually close within brand consistency).
- Only components listed in `/catalog/theme-components/theme-components-list.md` are eligible for variant creation.
- If a component is not in the supported list, do not create/update a variant for it; use token/property/CSS fallback path.
- For component planning and file operations, always use the directory name exactly as listed in `/catalog/theme-components/theme-components-list.md`.
- Prefer new variant creation by default; modify an existing custom variant only when user explicitly asks to update it.

**Invalid/alternate use case rule (mandatory):** if the intended variant target component is unavailable/unsupported, choose the closest metadata-supported alternate component that can reproduce the same visual intent, then apply equivalent class/variant styling on that alternate.
- Example: if `badge` variant path is unavailable, use `wm-label` with suitable class/variant to produce badge-like label look and feel.
- Do not skip styling intent; preserve role, prominence, size, and color semantics when using alternates.

### 6.2 HARD RULE — Variants Before Page CSS (Mandatory)

**Always create or reuse a component variant first. Page CSS is the last resort, not a convenience shortcut.**

Before writing any page CSS, read `/catalog/theme-components/{name}/supported-css-props.md` for the target component (e.g. `/catalog/theme-components/button/supported-css-props.md`). This file lists every CSS property that can be expressed through component tokens/variants.

- If the CSS property **is listed** in `supported-css-props.md` → it must go through a variant or token. **Do not use page CSS.**
- If the CSS property **is not listed** in `supported-css-props.md` → page CSS is permitted as a last resort.

You MUST also verify ALL of the following — if any check passes, use a variant instead:
- Can the style be set via a token (color, spacing, radius, border, typography)? → **Use token, or create new token.**
- Can the style be expressed as a component variant (background, border, padding, font, shadow)? → **Create/use a variant, not page CSS.**
- Is the CSS property achievable on this component through the variant token schema? → **Use variant, not page CSS.**

Page CSS is only permitted when:
- The required CSS property is **not listed** in `/catalog/theme-components/{name}/supported-css-props.md` for that component, AND
- The style cannot be expressed via any token or variant key for that component.

Both conditions must be true. If only one is true, use a variant.

**Common violation to avoid:** Using page CSS for `wm-container` background color is a canonical HARD FAILURE. `background` is a valid token key in the container variant schema — always create a variant instead (see wm-container section in Part 2).

Violation: adding page CSS for a property that could have been handled via a variant is a **HARD FAILURE**.

If page CSS is required after the above gate:
- Create/use a new dedicated CSS class name; do not overload existing variant class names.
- Page CSS fallback must use class-only selectors (`.className`) tied to markup class usage.
- Do not use element selectors, descendant/child selectors, pseudo-classes/elements, or attribute selectors in page CSS fallback.
- Write page CSS to `src/main/webapp/pages/{pageName}/{pageName}.css`.

### 6.3 Reserved Appearance Names — NEVER Use as Custom Appearance Names

WaveMaker's foundation registers built-in styles with specific class names. If a custom appearance name collides with one of these, built-in styles silently merge in, causing unwanted visual chrome.

| Root Key | Reserved names | What happens if used |
|---------------|----------------|----------------------|
| `btn` | `default`, `primary`, `secondary`, `danger`, `success`, `warning`, `info`, `link`, `dark`, `light`, `only-label` | Built-in colored button styles override your token (bg, border, text color) |
| `label` | `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `muted` | Badge styles applied: background-color + padding + borderRadius + fontWeight |
| `container` | `default`, `outlined`, `elevated` | Built-in container chrome (border or shadow) applied |
| `picture` | `default`, `thumbnail` | Built-in picture sizing/shape applied |
| `list` | `flat` | Foundation flat list styles (intentional — DO use `flat` for flat lists) |

Also avoid these standalone class names on labels (they match built-in heading/text styles):
- Heading classes: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `media-heading`
- Text-status classes: `text-primary`, `text-secondary`, `text-success`, `text-warning`, `text-danger`, `text-info`, `text-muted`

**Use descriptive alternatives instead:**

| Avoid | Use instead |
|-------|-------------|
| `label-muted` | `label-subtle`, `label-quiet`, `label-secondary-text` |
| `label-primary` | `label-accent`, `label-brand`, `label-highlight` |
| `btn-primary` | `btn-main-action`, `btn-cta`, `btn-accent` |
| `btn-default` | `btn-standard`, `btn-base`, `btn-neutral` |
| `label-info` | `label-detail`, `label-note`, `label-helper` |
| `label-danger` | `label-error-text`, `label-alert`, `label-negative` |
| `label-success` | `label-positive`, `label-confirmed`, `label-done` |
| `btn-warning` | `btn-caution`, `btn-alert`, `btn-notice` |

---

## Part 7 — Execution Workflow

### 7.1 Styling File Write Order (Mandatory)

Use this exact sequence for styling preparation and application:

1. Read `/catalog/theme-components/theme-components-list.md` to get components eligible for variant customization.

2. Check if the relevant override global token file exists at its canonical path (see Part 1.2 path table). If it exists, continue to the token read step.

3. Read token overrides or defaults:
   - If override global token file exists: read it directly from its canonical path (e.g. `src/main/webapp/design-tokens/overrides/global/color/color.light.json`).
   - If no override global token file exists: read the corresponding catalog file (see Part 1.1) to get the default token structure.

4. Write global token overrides to `src/main/webapp/design-tokens/overrides/global/<category>/<file>.json` — only when a token gap exists.
   - Create/update only missing/required tokens for target styling.

5. Check if the component variant file exists at `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json` (where `<dir>` is the directory name from Part 2.1). If it exists, continue to the component token read step.

6. Read component variant file and schema (when variant creation/update is required):
   - If the component variant file exists: read it directly from `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json`.
   - Read `/catalog/theme-components/<dir>/token-structure.md` to fetch valid token keys/schema — root key → `appearances` → variant name → `mapping` → valid token keys. Only keys present in this schema are valid.
   - If a required global token is missing at this point, add it first (step 4) before proceeding. Based on the token-structure generate the content and save it in next step.

7. Write component variant definitions to `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json` — only when custom variant definitions are needed.

8. Call **ui_savePageComponentVariant** (Required Args) after markup is saved:
   - This tool does NOT rely on the `variant` attribute being present. It scans each component in the markup for variant-related class names (pattern: `<root-key>-<appearance>`, e.g. `btn-cta`, `container-icon-rail`) and ensures those variant mappings are persisted.
   - If a component has a matching class but the `variant` attribute is missing or the mapping was never saved, this call detects and applies it.
   - **Always invoke this step** — variant saving does not happen automatically from markup. Any component with a `<root-key>-<appearance>` class that is not yet persisted must be caught and saved here before the styling is considered complete.


### 7.2 Variant/Class Application Workflow

1. Identify components required for the target markup.
2. Read `/catalog/theme-components/<dir>/token-structure.md` for each component to get the available built-in appearances and their token schema.
3. Pick a matching built-in appearance (from the `appearances` list in token-structure) or create a new one in the override file using the same JSON format.
4. During markup generation, set `variant="<appearanceName>"` and `class="<root-key>-<appearanceName>"` on components. Also add the class attribute value to set the class for that variant.
   - If no existing or new variant can handle the required styling (component not eligible for variants per `theme-components-list.md`, or CSS property not expressible via the token schema), apply page CSS inline during markup generation using class-only selectors per Part 6.2 rules.
5. Save markup to `src/main/webapp/pages/<PageName>/page.html`, then call **ui_savePageComponentVariant** (Required Args):
   - This tool scans each component for variant-related class names (`<root-key>-<appearance>` pattern) regardless of whether the `variant` attribute is set.
   - For each component with a matching class, it checks whether the variant mapping is already persisted and saves any that are missing.
   - Always invoke this after saving markup — it is the safety net that catches any variant not saved during markup generation.

### 7.3 Batch Operation Efficiency

Batch multiple items into a single file write wherever possible. The following file types support batch writes:
- `src/main/webapp/design-tokens/overrides/global/<category>/<file>.json` — write all token changes for a category together
- `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json` — write all appearances for a component together

---

## Part 8 — Additional Rules

### 8.1 Variant Consistency Rules

- Maintain visual hierarchy from screenshot (primary action, secondary action, metric icon classes, chart treatment).
- For components with same semantic role, use consistent variant families across the page.
- If metadata lacks a required class option, do not invent class names; fallback to tokens or minimal CSS.

### 8.2 Layout Host Styling Coverage

- Include layout hosts (`wm-header`, `wm-left-panel`, `wm-right-panel`, `wm-footer`, `wm-top-nav`) in styling gap analysis.
- For host styling mismatch, always try variants first — create a variant if none exists.
- Example: `wm-header` can have a variant created for it and assign to the markup. Similarly for other layout hosts too for styling the layout hosts.
- When partial CSS is genuinely required, apply it on a top-level container inside `wm-partial` (not on `wm-partial` directly).
- variant-first approach applies even for these layout host elements.
