---
name: markup
description: Generate or update valid WaveMaker XML markup for pages and partials. Use when creating page structure, adding or modifying UI components, changing component hierarchy, properties, events, or bindings. Also use when designing layout host partials (header, left panel), container/list layout structures, multi-step wizard flows, or formatting the value displayed on a component.
sub-skills:
- binding
- formatters
---

# Skill: Markup Rules

## What Markup Is For
- Define WaveMaker page and partial structure using only `wm-*` components.
- Configure component properties via attributes (attribute values can be direct strings or binding expressions).
- Markup must be syntactically valid with no compilation errors.

## Hard Rules

### No Unicode Escaping (MANDATORY)
- **HARD RULE:** Never convert literal characters to `\uXXXX` escape sequences. If the existing markup contains characters like `→` (arrow), `—` (em-dash), `–` (en-dash), `•` (bullet), or any other non-ASCII character, keep them exactly as literals in the output. Never write `\u2192` for `→`, `\u2014` for `—`, `\u2013` for `–`, or `\u2022` for `•`. This applies to attribute values, text content, and any other part of the markup.

### Component Target Selection in Page Markup (MANDATORY)
- Applies when duplicate/repeated component matches exist.
- Treat user order/index (`first`, `second`, `last`, `top`, `bottom`, `left`, `right`, `nth`) as mandatory targeting input.
- For duplicate matches, resolve by deterministic index + component hierarchy path.
- Do not pick targets by label text alone or by API/design convenience heuristics.
- Edit only the requested instance; if uniqueness is unclear, stop and request clarification.

### Widget Pre-Scan (MANDATORY — Run Before Generating Any Markup)

Before decomposing any screen into containers or widgets, scan the ENTIRE screenshot for these patterns in order. Getting the widget wrong at this stage cannot be patched with styling.

**1. Form Pattern → `wm-form` + `wm-form-field` + `wm-form-action`**
Any screen with 1+ input field (text, select, date, toggle, number, password) AND a submit-like button (Save, Submit, Continue, Sign in, Apply, Next, Pay, Register, etc.) MUST use `wm-form`. NEVER place input widgets in loose containers when a submit button exists nearby.

**2. Wizard Pattern → `wm-wizard` + `wm-wizardstep` + `wm-wizardaction`**
When ALL three are true: a stepper indicator is visible (horizontal bar or vertical rail) with 2+ steps showing distinct states, the screen shows ONE step's content at a time, and a Back/Next/Submit progression control is present → use `wm-wizard`. NEVER draw the stepper manually with containers or buttons.

**3. Tab vs Chip Pattern**
Decide BEFORE decomposing a row of similar labels:
- Labels + a content area that **swaps entirely** when a label is selected (including language switchers) → `wm-tabs` + `wm-tabpane`
- Labels **filter or highlight** a single shared list below without swapping content → `wm-container direction="row"` of `wm-button` (fixed set) or `wm-list` + `wm-button` (dataset-driven), each with `chip-active`/`chip-inactive` variants
- **NEVER use `wm-chips`** for filter rows — this project uses a button-row chip pattern
- When unsure between tabs and chips → always prefer `wm-tabs`

**4. Repeated Items Pattern → `wm-list` + `wm-listtemplate`**
3 or more visually similar elements (cards, thumbnails, rows, avatars, story circles, tag chips) MUST use `wm-list` bound to a variable. NEVER manually repeat `wm-container`, `wm-picture`, or `wm-button` for similar items. This applies to both vertical lists and horizontal scrollable rows.

---

### Element Rules
- Prefer declarative markup updates over JavaScript-driven UI behavior.
- Prefer direct declarative attributes first; use bindings only when required by dynamic data; avoid shifting logic to JavaScript unless declarative options cannot satisfy the requirement.
- **Root**: Page has exactly either of only one root element `wm-page`/`wm-partial`; no nested `wm-page`/`wm-partial` inside each other.
- **Partial recursion**: A partial must not use `content="<same_partial_name>"` or contain the layout host that loads it (e.g. leftnav partial must not contain `wm-left-panel`).
- Main page UI content must be placed under `wm-page-content` (dialogs are exceptions).
- Partial UI content must be direct children of `wm-partial`.
- **Layout host placement**: `wm-left-panel`/`wm-right-panel` with `navheight="clipped"` must be inside `wm-content`; with `navheight="full"` must be outside `wm-content` inside `wm-page`. `wm-header` and `wm-left-panel` must not appear after `wm-content` or `wm-page-content`.
- **Layout host post-creation verification (mandatory)**: Immediately after saving a page that includes `wm-header` or `wm-left-panel`, read back the created page file and verify placement matches the structure contract before proceeding to content generation. Use this decision table:

  | Screenshot shows | Required markup |
  |---|---|
  | Header spans full viewport width (over sidebar) | `wm-header` before `wm-content` |
  | Header starts at sidebar's right edge | `wm-header` inside `wm-content` |
  | Sidebar starts at y=0 (viewport top) | `navheight="full"`, `wm-left-panel` before `wm-content` |
  | Sidebar starts below the header | `navheight="clipped"`, `wm-left-panel` inside `wm-content` |
  | Header is a pill/capsule (rounded bar, page background visible on both sides, does not touch viewport edges) | `wm-header` before `wm-content`; **apply a variant on `wm-header` first** for pill shape styling; only fall back to inner partial root container variant if `wm-header` theme tokens cannot express it; never use inline styles |

  Full-width header and full-height sidebar are mutually exclusive — both cannot be true simultaneously. Any markup setting both is a **critical failure**. Fix before proceeding to Task 3.

- **`wm-left-panel` navtype — pick before writing markup**: `navtype` controls the sidebar's visual width and nav-item layout. Read the screenshot to decide:

  | Screenshot shows | `navtype` | Effective width |
  |---|---|---|
  | Wide sidebar with icon + label text side by side, full-width items | `"drawer"` (default) | 220px |
  | Narrow sidebar with icon centered, label text below (or icons only) | `"rail"` | 102–120px |

  **Drawer**: items are horizontal rows (icon left, label right). Submenus expand inline.  
  **Rail**: items are vertical stacks (icon top, label centered below). Submenus pop out to the right.

- **`wm-header height="auto"`**: Always set `height="auto"` on `wm-header`. Without it the header may collapse or overflow. The root container inside the header partial controls actual visual height via `padding` and `gap`.
- **Pill/floating header**: When the screenshot shows a header that is a pill or capsule shape — a rounded bar that does not touch the viewport edges, with the page background visible on both sides — follow this order strictly: (1) `wm-header` remains the layout host before `wm-content`, (2) **first apply a variant on `wm-header`** to achieve the pill shape (`border-radius`, `background`, `box-shadow`, `max-width`, `margin: auto`) — read the `wm-header` theme component token structure from `/catalog/theme-components/wm-header/token-structure.md` and apply the variant there before touching the inner partial, (3) only if the required styling cannot be expressed via a `wm-header` variant, fall back to a variant on the root container of the header partial — never use inline styles or raw page CSS. **Always scan for this pattern before assuming a standard full-width header bar.**
- **`wm-nav` placement**: For page navigation links, place `wm-nav` inside the `wm-header` partial (top navigation) or the `wm-left-panel` partial (sidebar navigation).
- **`wm-nav` layout attribute — do not set unless necessary**: Only set `layout` on `wm-nav` when you know exactly what it does and the design requires it. The known valid value is `layout="stacked"` for sidebar/left-panel navs where items must stack vertically. Do NOT set `layout` on header navbars — the default horizontal rendering is correct and setting an incorrect layout value (e.g., one that stretches items to fill available width) causes oversized gaps between nav links inside a `gap="auto"` container.
- **Dialogs**: `wm-dialog` (and dialog-like components) must be direct children of `wm-page` or `wm-partial`.
- **wm-html**: Use inner HTML as children or bind `content` to some expression: donot put raw HTML in `content="..."`.
- **Dataset**: When `dataset` is comma-separated string, leave `datafield` and `displayfield` empty.
- **HARD RULE — Autolayout mandatory attributes**: `wm-container`, `wm-list`, and `wm-listtemplate` MUST always include all 7 autolayout attributes. Missing any one causes broken layout. No exceptions.

  | Attribute | wm-container | wm-list | wm-listtemplate |
  |-----------|:---:|:---:|:---:|
  | `name` | ✅ | ✅ | ✅ |
  | `class` | ✅ (`app-container-default`) | ✅ | ✅ |
  | `direction` | ✅ | ✅ | ✅ |
  | `gap` | ✅ | ✅ | ✅ |
  | `alignment` | ✅ | ✅ | ✅ |
  | `width` | ✅ | ✅ | ✅ |
  | `height` | ✅ | ✅ | ✅ |

  For each attribute, always derive the correct value from the visual intent — do not leave defaults or placeholders:
  - `direction` — row if children sit side-by-side; column if they stack top-to-bottom
  - `gap` — numeric (fixed spacing between children) or `"auto"` (space-between / push to edges); never guess — read the visual spacing
  - `alignment` — see gap/alignment contract below
  - `width` — `"fill"` (expands to parent), `"hug"` (wraps children), or explicit px/% — only `wm-container`, `wm-list`, `wm-listtemplate` support `fill`/`hug`; use px or % for all other widgets
  - `height` — same rules as width

- **HARD RULE — `fill`/`hug` on non-container widgets causes a validation error**: `fill` and `hug` are ONLY valid on `wm-container`, `wm-list`, and `wm-listtemplate`. Every other widget (`wm-button`, `wm-label`, `wm-picture`, `wm-icon`, `wm-text`, `wm-select`, etc.) MUST use `Npx` or `N%` for `width` and `height`. Setting `fill` or `hug` on any other widget throws a validation error and breaks the page.

- **HARD RULE — `wm-label` does not support `iconclass`**: `wm-label` has no `iconclass` property. To render an icon alongside a label, place a `wm-icon` and a `wm-label` as siblings inside a `wm-container direction="row"`. Never add `iconclass` to `wm-label`.

- **HARD RULE — gap/alignment contract**: The `gap` and `alignment` values are coupled. Violating this contract causes a save error.
  - `gap="auto"` → `alignment` MUST be `"center"` (no other value is valid)
  - `gap="N"` (any number) → `alignment` MUST be a compound value: `"middle-center"`, `"middle-left"`, `"middle-right"`, `"top-left"`, `"top-center"`, `"top-right"`, `"bottom-left"`, `"bottom-center"`, `"bottom-right"` — NEVER `"center"`
  - **Pre-save check**: Before writing markup, verify every `wm-container`, `wm-list`, and `wm-listtemplate` — if `gap="auto"` then `alignment="center"`; if `gap` is a number then `alignment` is NOT `"center"`.

- **HARD RULE — edge-to-edge gap detection**: For every `direction="row"` container, decide `gap` using this test before writing the attribute:
  - If 2+ children together visually span ≥80% of the container width (items at opposite edges, e.g. logo left + actions right, title left + button right) → `gap="auto"`
  - If all children are clustered together on one side with consistent spacing between them → numeric gap (`8`, `12`, `16`, etc.)
  - Never guess — always read the visual position of children relative to the container edges.

- **wm-listtemplate as root**: Do NOT nest an extra container inside `wm-listtemplate` just to apply direction/gap/alignment — apply them directly on `wm-listtemplate`. In addition to the 7 mandatory autolayout attributes, `wm-listtemplate` also supports `padding`, `paddingtop`, `paddingright`, `paddingbottom`, and `paddingleft` for inner spacing. Set these directly on `wm-listtemplate` when the design shows space between the item border and its content — do NOT wrap content in an inner container just to add padding.
- **List item radius and background**: When every repeated list item needs rounded corners, add a class on `wm-listtemplate` and define `border-radius` in that class so the radius applies uniformly to all items. For per-item background color or state-based highlighting, apply `background`/`conditionalstyle` on the inner `wm-container`.
- **Container optional layout attributes**:
  - `columngap` — gap between wrapped rows when `wrap="true"` on a row container. Use the same numeric value as `gap` unless the design shows different row vs column spacing. Example: `gap="8" columngap="8" wrap="true"` for a chip/tag grid.
  - `backgroundimage` — sets `background-image` on the container (CSS `background-size: cover; background-position: center`). Use this directly on the container for hero banners and section backgrounds instead of nesting a `wm-picture` with an absolute overlay. Accepts an absolute URL or a project-relative path (`resources/images/foo.jpg`). Pair with a variant-level semi-transparent background color for text contrast — do NOT use inline style for the overlay color.
- **wm-list — pagination and scroll attributes (MANDATORY)**: In addition to the 7 autolayout attributes, every `wm-list` MUST also set `navigation` and `pagesize`. Optional scroll/wrap attributes apply per the decision table below.

  | Attribute | Required | Values | Rule |
  |---|:---:|---|---|
  | `navigation` | ✅ | `None` \| `Basic` \| `Classic` \| `Pager` \| `Scroll` \| `On-Demand` | Use `"None"` whenever all items should be visible without pagination |
  | `pagesize` | ✅ | numeric | Set high enough to avoid hiding rows; always pair with `navigation` |
  | `clipcontent` | conditional | `"true"` | Set only when the list has a bounded viewport that scrolls |
  | `overflow` | conditional | `"Vertical"` \| `"Horizontal"` \| `"Both directions"` \| `"No scrolling"` | Required when `clipcontent="true"` |
  | `wrap` | conditional | `"true"` | Set only when items should reflow to multiple rows (chip/card grids). Requires a bounded `width`. Ineffective on `direction="column"`. |
  | `columngap` | conditional | numeric | Set when `wrap="true"` to control the vertical gap between wrapped rows. Use the same value as `gap` unless the design shows different horizontal vs vertical spacing. Example: `gap="12" columngap="12" wrap="true"` for a card grid. |

  **`wrap` and `clipcontent` are orthogonal** — `wrap` controls layout flow (items reflow to a new row); `clipcontent` controls overflow visibility (content beyond the boundary is hidden/scrollable). Use independently or together.

  **Decision table — pick attributes from the screenshot pattern:**

  | Screenshot pattern | `direction` | `height` | `wrap` | `columngap` | `clipcontent` | `overflow` |
  |---|---|---|---|---|---|---|
  | Main-page list, grows with content (page scrolls) | `column` | `hug` | — | — | — | — |
  | Sidebar / card-body list, scrolls within its bounds | `column` | `fill` or `Npx` | — | — | `true` | `Vertical` |
  | Horizontal thumbnail strip, scrolls sideways | `row` | `Npx` | — | — | `true` | `Horizontal` |
  | Chip / tag / card grid that wraps to multiple rows | `row` | `hug` | `true` | same as `gap` | — | — |
  | Wrapping grid inside a bounded scrollable region | `row` | `Npx` or `fill` | `true` | same as `gap` | `true` | `Vertical` |

  **Note:** `hidehorizontalscrollbar` does NOT exist on the web `wm-list` (mobile-only prop). Never use it on web pages.
- **wm-rating**: Set `showcaptions="false"` when no caption text is shown beside the stars. Set `readonly="true"` for display-only (non-interactive) rating.
- **wm-form vs containers**: Any screen with 1+ input field AND a submit-like button MUST use `wm-form` — never plain containers for form screens.

### Positioning Rules

- **Fixed-position elements (FAB, floating buttons, sticky headers)**: MUST be wrapped in a `wm-container` with `position="fixed"` and `positionvalue="<top> <right> <bottom> <left>"`. Only `wm-container` supports position props — never apply position directly on buttons or other components.
    - FAB (bottom-right): `positionvalue="auto 16px 16px auto"`
    - Bottom bar: `positionvalue="auto auto 0px auto"`
- **Overlay text (text ON image)**: Use a `position="relative"` `wm-container` wrapper containing the image, then place the text in a second `wm-container` with `position="absolute"` and `positionvalue="0px 0px 0px 0px"` as an overlay. NEVER stack text below the image.
- **Full-bleed hero (edge-to-edge)**: Set `padding="0px"` on `wm-page-content`; apply `paddingleft`/`paddingright` per-section inside as needed.
- **Full-bleed carousel**: Override `slide.padding: "0px"` and `slide.transform: "none"` on the carousel. Use `controls="indicators"` for dots-only navigation.

### Examples (Typical Structures)

#### Typical page skeleton (with partials via `content`)
```xml
<wm-page name="page" pagetitle="Test Pg">
    <wm-left-panel columnwidth="2" content="leftnav" navtype="rail" navheight="full" name="left_panel1"></wm-left-panel>
    <wm-content name="content">
        <wm-header content="header" name="header1" height="auto"></wm-header>
        <wm-top-nav content="topnav" name="top_nav1"></wm-top-nav>
        <wm-page-content columnwidth="8" name="pagecontent"></wm-page-content>
        <wm-footer content="footer" name="footer1"></wm-footer>
    </wm-content>
    <wm-right-panel columnwidth="2" content="rightnav" navtype="rail" navheight="full" name="right_panel1"></wm-right-panel>
</wm-page>
```

- `wm-header`, `wm-left-panel`, and `wm-right-panel` positioning/behavior can vary based on panel configuration based on `navheight`. Treat this structure as a common pattern, not a fixed layout rule.

#### Typical partial skeleton
```xml
<wm-partial name="partial"></wm-partial>
```

### Component and Attribute Rules

- Use only component tag names listed in `/catalog/components/components-list.md` (exception: `wm-html` and `wm-popover` may contain standard HTML as inner children).
- Read `/catalog/components/{name}/{name}.md` as the single source of truth for component properties, events, methods, and supported CSS; never invent or assume attributes.
- Deprecated markup components `wm-layoutgrid`, `wm-gridrow`, `wm-gridcolumn` and `wm-card` are not allowed in any new markup additions or updates.
- If existing markup already contains `wm-layoutgrid` or `wm-gridcolumn` or `wm-gridrow`, do not remove or refactor them as part of unrelated changes; leave existing usage unchanged unless explicitly requested.
- **Do not remove, restructure, or modify existing markup ** that are not part of the requested change. When adding new components, insert only what the user's use case requires without altering surrounding existing markup or component attributes.
- `component_metadata`: use this to refer  Property(attribute)/event/method rules, widget-type mappings, and metadata validation.
- Attribute values can be:
    - Direct literal values (e.g., `name="myButton"`, `label="Click Me"`).
    - Binding expressions (see `binding` skill for syntax).
- Every component must have a meaningful, unique `name` attribute.
- Do not use attributes marked `jsOnly: true` in metadata (these belong in JavaScript, see `javascript` skill).
- Do not add the property as attribute whose property has bindable set as `out-bound`
- Include all attributes marked `mandatory: true` in metadata with valid values.
- **Use distinct, relevant images**  
  Assign a unique, thematically appropriate photo ID to each `wm-picture`. Match the image subject to the UI context (e.g., food images for a food app, landscapes for travel screens). Avoid reusing the same ID across multiple images.  
  **Format:** `picturesource="https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg"`

- **Maintain consistent dimensions for images when needed**  
  For images that require fixed height and width (such as in repeaters like list components), use a source that enforces sizing and cropping. This helps keep layouts visually consistent.  
  **Format:** `picturesource="https://images.unsplash.com/{id}?w={w}&h={h}&fit=crop"`

### Content Attribute Rules
- The `content` attribute is case-sensitive and immutable.
- Format: `content="<partialName>"` where `<partialName>` is the exact partial page name.
- Example: `content="header"` must target partial `header`, not `Header`.
- If set, the value must be a single word (partial name).
- Any layout host or container with `content="<partialName>"` can contain only `<wm-param>` as children (no other components).

### Children Rules (from Metadata)
- Check `children` property from the component catalog file (`/catalog/components/{name}/{name}.md`):
    - `children: null` → any child allowed.
    - `children: []` → no children allowed.
    - `children: ["wm-..."]` → only listed children are allowed.
- Any component with `content` attribute can have ONLY `wm-param` as children.

### Markup Content Rules
- Do not use `.bind` suffix in attribute names.
- **Static captions (HARD RULE)**: Use literal text for all visible captions — NEVER `bind:` on caption/label text except inside `wm-listtemplate` where `bind:Variables.varName.dataSet[$i].field` is required. `bind:` on a static label produces empty or broken text at render time.
- Inline styles are not allowed; use supported component attributes (class, padding, height, width, background, etc.) or component variants. Page CSS is the last resort — only permitted when BOTH conditions are confirmed: (a) the CSS property is NOT listed in `unsupportedPageCssProps` for that component, AND (b) the style cannot be expressed via any token or variant key. Do NOT add page CSS during markup generation; exhaust tokens and variants first.
- For ratio-locked layouts (for example `1:1`, `1:2`, `20:80`), set explicit container widths (`%` or metadata-supported fixed values). Do not rely on sibling `width="fill"` for guaranteed equal/target ratios.
- Use `width="fill"` only for flexible remaining-space behavior (for example a search field filling space next to fixed-width action buttons).

### Validation Rules
- Markup must have no syntax or compilation errors.
- Never invent component tags, attributes, or properties not present in metadata.

### Adding Events in Markup

You can bind events in markup in two ways:

1. **Call a widget method**
   Use this pattern:

   `<eventName>="Widgets.<widgetName>.<methodName>(<...params>)"`

   Example:
   `on-click="Widgets.wizard1.next()"`

2. **Call a custom JavaScript function**
   Use this pattern:

   `<eventName>="myCustomFn(<...params>)"`

   Example in markup:
   `on-click="onSelect(<...params>)"`

   Then define the function in the page JavaScript file:

   ```javascript
   Page.onSelect = function(<...params>) {
       // business logic
   };
   ```

### Variable/Action Invoke Event Pattern

- Do not pass dynamic business payload objects directly inside markup event expressions.
- Prefer one of these click patterns:
  - Declarative invoke: `on-click="Actions.<actionName>.invoke()"` and provide input through action/variable data binding.
  - Method indirection: `on-click="<methodName>()"` and prepare invoke payload in page JavaScript.
- Wrong pattern:
  - `on-click="Actions.<actionName>.invoke({inputData: {...}})"`
- Correct pattern (declarative):
  - `on-click="Actions.<actionName>.invoke()"`
- Correct pattern (method indirection):
  - `on-click="<methodName>()"`
- JavaScript method example:

```javascript
Page.triggerAction = function() {
    Actions.someAction.invoke({
        <invokePayloadKey>: {
            field1: Page.Widgets.widget1.datavalue,
            field2: Page.Widgets.widget2.datavalue
        }
    });
};
```

- Determine `<invokePayloadKey>` from action/variable metadata (example: login action commonly uses `input`).
- `inputData` naming is for callback/event payloads, not a generic invocation payload key whereas `input` is used specially for loginAction.



## Markup + CSS Update Flow
- **MANDATORY pre-generation gate (ALL markup operations)**: Before generating or modifying markup for any component — whether creating a new page, adding a new widget, or modifying a property/event on an existing widget — follow these steps in order:
  1. **Adding new components**: Read `/catalog/components/components-list.md` first to confirm the component tag is valid. Only use tag names present in that list.
  2. **All components (new or existing)**: Batch-read all required component catalog files in a single `read_files` call — pass all `/catalog/components/{name}/{name}.md` paths together as an array. Do not read them one file at a time.
  3. This gate applies unconditionally to every markup task. Skipping catalog reads for any widget, including familiar ones such as `wm-textarea` or `wm-button`, is a hard failure. For screenshot-driven new pages, also include `/catalog/components/{name}/advanced-props.md` paths in the same batch call.
- **Variables before markup (mandatory for data-dependent components):** Before writing any markup, scan all components across the entire page and all partials to identify every variable required. Create all identified variables simultaneously in parallel — do not create them one at a time or interleaved with markup generation. Only after all variables exist should markup generation begin. Never write markup that references a variable that doesn't exist yet, and never use a placeholder variable name. A data-dependent component with a missing variable at markup generation time is a critical failure.
- Variant/class selection rule (mandatory):
    - Preferred path: use available `class` options from the component catalog file (`/catalog/components/{name}/{name}.md`), pick the suitable variant/class, and assign it to the component `class` in markup.
    - Alternate path: read `/catalog/components/{name}/advanced-props.md` for all required components to fetch available class options, pick suitable ones, and add those class names to markup.
    - Unsupported target component path: if the intended component for a visual style is unavailable, select a metadata-supported alternate component and apply equivalent class/variant styling to preserve the same UI intent (for example, use `wm-label` to emulate badge-like appearance).
- Do not generate initial screenshot-driven markup until one of the above class-selection paths is completed.
- When a variant-related class is assigned to a component in markup, also set the `variant` attribute with the corresponding variant name. If no new or custom variant is being created, look up the component's default variant from the catalog and use its class name and variant name.
- **HARD RULE:** Save markup changes via **ui_applyChangesOnPageMarkup** (Required Args) first — only fall back to file system tools (`write_file`/`edit_file_content`/`replace_in_files`) as a last resort if that tool is unavailable or fails for the operation. Save CSS file changes to the appropriate `.css` path using file system tools. When saving markup for multiple units (page-content + partials), update all of them simultaneously in parallel via **ui_applyChangesOnPageMarkup** — do not save one unit and then proceed to the next.
- Apply metadata-supported class names directly in markup during the one-shot update/save flow.
- For both new and existing variants, set the variant attribute and the variant-related class directly in markup during generation — do not use a separate tool call to apply them after save. Every component that receives a variant must have both attributes in markup: `class="<root-key>-<appearanceName>"` and `variant="<appearanceName>"`, for example `class="btn-cta" variant="cta"`.
- Before calling apply/save, batch-read all required catalog files in a single `read_files` call — include both `/catalog/components/{name}/{name}.md` and `/catalog/components/{name}/advanced-props.md` for every component needed, all in one array. Do not issue a separate read per component or per file.
- Never invent variant class names; select only from metadata-supported class options.
- For cross-skill guidance on composing the final markup payload, refer to this `markup` skill.

## Markup + CSS File Update Rules

- Always confirm class/variant names from catalog files (`/catalog/components/{name}/{name}.md` or `/catalog/components/{name}/advanced-props.md`) before writing markup or CSS.
- CSS changes go to `src/main/webapp/pages/{pageName}/{pageName}.css`; markup changes go to `src/main/webapp/pages/{pageName}/{pageName}.html`.
- Update only class blocks that are actually referenced in markup.
- When adding/updating a class block, ensure that class is attached to the intended component(s) in markup. When the class being added is a variant-related class, also set the `variant` attribute on those components with the corresponding variant name.
- When no new or custom variant is being created, resolve the component's existing default variant from the catalog and include the default variant class name on the component in markup, along with setting `variant` to the default variant name.
- Class keys must be plain class names only (no `.`, pseudo selectors, combinators, or nested selectors).
- CSS declarations must not include selectors — write selectors in the CSS file, not in markup attributes.

## Common Mistakes to Prevent

- Multiple root elements for a page; Angular `{{ }}` in attributes.
- Any child other than `<wm-param>` when `content="<partial>"` is set.
- Attributes not in component metadata; jsOnly or out-bound properties in markup; `bind:` on non-bindable properties.
- Building header/topnav/footer/leftpanel/rightpanel with containers when layout hosts exist. Instead use wm-header for header, wm-left-panel for leftnav and so on.

## Technical Skills Reference

### Component Selection
- Use **ui_getPageMarkupByComponent** (Required Args) for getting the specific markup element including its children based on component name.

### Saving Markup Changes (HARD RULE)
- Use **ui_applyChangesOnPageMarkup** (Required Args) to save any markup change (page or partial `.html`) — this is the preferred/first tool for every markup save. Fall back to `write_file`/`edit_file_content`/`replace_in_files` only as a last resort when this tool is unavailable or fails.
- Use `write_file`/`edit_file_content`/`replace_in_files` directly (no fallback needed) for non-markup files: `.js`, `.variables.json`, `.css`, tokens, etc.

## Skills to load when required
- **Variable declarations/definitions, variable expressions, and action definitions** → Refer to `variables`and `actions` skill for 
  variable usage, expressions, variable-related operations, and action definitions.
- **Binding expression syntax** → Refer to `binding` skill for binding rules.
- **JavaScript code/logic and event handler implementations** → Refer to `javascript` skill for event handlers, component methods, and JavaScript logic.
- **Component properties, events, methods, and CSS constraints (mandatory)** → Load skill `component_metadata` before adding or modifying any property, event, or method on a component in markup. This is required to know valid configurations, widget-type mappings, and metadata constraints — do not assume property or event names from prior knowledge.
- **Formatting/transforming the displayed value** → Refer to `formatters` skill for built-in pipes and custom formatter authoring.

## Formatters and Pipes

When a bound value needs to be formatted or transformed before it is displayed (e.g. currency, date, masked text, prefix/suffix, number formatting), refer to the `formatters` skill for the full syntax, built-in pipes, and custom formatter authoring guide. Load only when required to format the display value.

## Filter Expressions for Markup

Only referenced or related column/form fields can have the filterexpressions. Applies when type="list" and is-related="true" on wm-form-field or wm-table-column.
For `wm-form-field` in `wm-liveform` and `wm-table-column` with `wm-table` dataset bound to `LiveVariable`, load skill `filterExpressions`.
