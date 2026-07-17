---
name: component_metadata
description: "Look up WaveMaker component metadata: allowed properties, events, methods, and hierarchy constraints. Use before generating or modifying markup to confirm valid component configurations."
sub-skills:
- containerPatternDesign
- wizard
- custom-widget-template
---

# Skill: Component Metadata Rules

## Objective
Use WaveMaker component metadata as the authoritative source for valid properties, events, methods, and CSS constraints.

## Hard Rules
- Components are page-scoped.
- Read `/catalog/components/components-list.md` to know the list of supported components.
- Treat catalog component files as the single source of truth for component properties, events, methods, rules, and supported CSS. Read `/catalog/components/{name}/{name}.md` for each component.
- The LLM MUST STRICTLY FOLLOW all rules returned from the catalog file for every component used.
- Catalog file paths for each component use the pattern: `/catalog/components/{name}/{name}.md` where `{name}` is the component tag (e.g. `wm-button`, `wm-text`). Pick up the component tag name only from the supported components list returned in the above step. 
- Violation of any rule returned from the catalog file is a HARD FAILURE.
- Property names, event names, and method names are case-sensitive and immutable.
- Never alter casing, rename, normalize, or infer alternatives for any property/event/method name from metadata.
- Before markup updates, read `/catalog/components/components-list.md` and only use supported components.
- No assumptions: never guess API details, metadata properties, unsupported CSS, or component behavior.
- Never use unsupported properties, unsupported CSS keys, invented attributes, or invented component tags.
- If metadata shows `children: []`, do not add child elements.
- If metadata defines a property `value`, use it as default unless user intent requires otherwise.
- If a property in either `{name}.md` (`coreProperties`) or `{name}/advanced-props.md` defines `options`, you MUST pick a value only from that listed options. Do not assign any value outside the listed options unless the property metadata explicitly marks it as allowing free-form or custom values. Do not assign empty string from `options: [""]`.
- Exception: if the property supports binding and behavior requires an expression-driven value, use a valid bind expression.
- Include metadata properties marked `mandatory: true` with valid values.
- Exclude metadata properties marked `jsOnly: true` from markup.
- Exclude properties that are only `out-bound` from direct assignment unless metadata explicitly allows value input.
- If a property defines `syntax`, use it as the canonical reference template for constructing bind expressions or usage patterns for that property.
- If a property shows `isList: yes`, its value is a list/array type. When accessing it in JavaScript or binding child widgets, treat the value as an array.
  Any violation → STOP and report. No assumptions, no overrides.
- Catalog file paths use the pattern: `/catalog/components/{name}/{name}.md` where `{name}` is the component tag (e.g. `wm-button`, `wm-text`).

## Key References for Component

### Visual → WM Component Mapping

Use this table to pick the correct `wm-*` component from a screenshot visual element:

| Visual Element | WM Widget | NOT this |
|---|---|---|
| ANY input widget(s) + a submit/action button (Continue, Save, Submit, Sign in, Log in, Send, Next, Pay, Apply — even just 1 field!) | `wm-form` + `wm-form-field` + `wm-form-action` | NEVER place input widgets (`wm-text`, `wm-select`, `wm-number`, `wm-date`, `wm-checkbox`) as loose elements outside a form when a submit button exists nearby. A "Continue" or "Sign in" button IS a submit button. READ wavemaker-forms skill. Non-form elements (social buttons, "or" dividers) go OUTSIDE the form as siblings. |
| Horizontal text pills / filters / categories | `wm-chips` | Not `wm-list` + `wm-button` |
| Repeated items / scrollable list / horizontal thumbnails / any repeated visual pattern (3+ similar elements) | `wm-list` + `wm-listtemplate` | NEVER manually repeat containers, pictures, or buttons for similar items. ANY row of similar items (thumbnails, avatars, cards, images, story circles) MUST use `wm-list` with a variable. Use `direction="row"` for horizontal, `direction="column"` for vertical. |
| Card with image/title/actions | `wm-card` + `wm-card-content` + `wm-card-footer` | Not a styled container |
| Tab navigation / tabbed content | `wm-tabs` + `wm-tabpane` | Not buttons styled as tabs |
| Collapsible sections / FAQ | `wm-accordion` + `wm-accordionpane` | Not containers with show/hide |
| Multi-step form / wizard | `wm-wizard` + `wm-wizardstep` | Not manual step containers |
| Dropdown / selector (any style) | `wm-select` | Use `wm-select` for all dropdown/selector patterns — style via design tokens |
| Text + chevron (location, filter, sort) | `wm-select` | Any label with a down-chevron/arrow = selector. NEVER use label+icon decomposition |
| Search bar | `wm-search` | Not a text input with icon. For custom dropdown row layout (icon + label + link per suggestion), load skill `custom-widget-template` and wire a template partial via `setTemplate`. |
| Checkbox group with custom option layout | `wm-checkboxset` | Not manual checkboxes in a container. For custom per-option markup, load skill `custom-widget-template`. |
| Radio group with custom option layout | `wm-radioset` | Not manual radios in a container. For custom per-option markup, load skill `custom-widget-template`. |
| Tree with custom node UI (icons, expand/collapse, selection styling) | `wm-tree` | Not nested containers mimicking a tree. For custom per-node markup, load skill `custom-widget-template`. |
| Star rating | `wm-rating` | Not icons styled as stars |
| Toggle / switch (pill-shaped track + circular thumb that slides left/right; filled, outlined, or oversized-thumb variants — always a rounded rectangle with a circle) | `wm-checkbox type="toggle"` for pill toggles; `wm-switch` only for segmented button groups | Not a styled checkbox, not two buttons, not a slider |
| Date picker | `wm-date` | Not a text input |
| Time picker | `wm-time` | Not a text input |
| Slider / range | `wm-slider` | Not a progress bar |
| Progress bar | `wm-progress-bar` | Not a colored container |
| Circular progress | `wm-progress-circle` | Not an icon/svg |
| Alert / notification banner | `wm-message` | Not a styled label |
| Bottom sheet | `wm-bottomsheet` | Not a positioned container |
| Modal / popup dialog | `wm-dialog` + content + actions | Not a container overlay |
| App header / top bar | `wm-mobile-navbar` | Not a container row |
| Bottom tab bar (light-themed page) | `wm-mobile-tabbar` (placed outside `<wm-content>`, inside `<wm-page>`) | Not a plain container without fixed positioning |
| Bottom tab bar (dark-themed page) | Custom `wm-container` tab bar (inside `wm-page-content` with `position="fixed"` `positionvalue="auto auto 0px auto"`) styled via dark tokens | NEVER use `wm-mobile-tabbar` on dark pages — its colors come from theme variables that default to light and CANNOT be overridden via per-page design tokens |
| Dropdown menu / more actions | `wm-menu` or `wm-popover` | Not a hidden container |
| Image carousel (simple slides) | `wm-carousel` + `wm-carousel-template` | Not manual slides |
| Hero carousel (image with overlay text) | `wm-carousel` + `wm-carousel-template` with overlay pattern: relative container wrapping image + absolute-positioned text container | NEVER stack text below the image — use `position="absolute"` overlay |
| Image with text overlay (hero banner, media card) | `wm-container` (`position="relative"`) wrapping `wm-picture` + `wm-container` (`position="absolute"`) with text | NEVER stack text in a separate container below the image |
| Number input (standalone field) | `wm-number` | Use `wm-number` for standalone numeric fields — style via design tokens. For custom +/- stepper UI, use containers + buttons + label instead |
| Grid/column layout | `wm-container` `direction="row"` + child widths | NEVER `wm-layoutgrid` |
| FAB / floating action button | `wm-container` with `position="fixed"` + `positionvalue` wrapping a `wm-button` with `class="btn-fab"` | Not a plain `wm-button` without fixed container — WM buttons don't have position props |
| Any fixed-position element (floating badge, sticky header overlay, floating CTA) | `wm-container` with `position="fixed"` + `positionvalue="top right bottom left"` | Not a container without position props — it will scroll away with content |
| Text label / heading / paragraph | `wm-label` | |
| Clickable button / CTA | `wm-button` | |
| Text input, email, phone, password field | `wm-text` (or `wm-textarea` for multiline) | |
| Checkbox | `wm-checkbox` | |
| Radio group | `wm-radioset` | |
| Image / avatar / photo | `wm-picture` | |
| Icon only (decorative) | `iconclass` attribute on parent widget | |
| Static carousel / banner slider | `wm-carousel` with `type="static"` | |
| Dynamic carousel from data | `wm-carousel` with `type="dynamic"` | |
| Card / panel / section box | `wm-container` with `class="app-container-default"` | |
| Layout row/column group (invisible) | `wm-container` with `class=""` | |
| Notification badge on button | `badgevalue` attribute on `wm-button` | |
| Partial / reusable region | `wm-container` with `content="<partialName>"` | |

### Form Detection (Mandatory)

Scan the screenshot for form screens:
- **FORM TRIGGER**: 1 or more input fields (text input, password, email, phone, date picker, select/dropdown, textarea) **AND** a submit-like button in the same screen region → MUST use `wm-form` (not plain containers).
- **Submit-like button captions**: Continue, Save, Submit, Sign in, Log in, Send, Apply, Next, Pay, Done, Register, Sign up, Create account, Update, Confirm.
- **Hybrid screens**: If the screen has both a form section and non-form content (e.g. a header image above a login form), wrap only the form fields + submit button in `wm-form`; other content stays in normal containers.
- If form detection is ambiguous, prefer `wm-form` over plain containers — false positive is safer than missing a form.

### Data-Dependent Components — Hard Block Rules

The following components require a dataset binding to be functional: `wm-chart`, `wm-table`, `wm-list` etc.

**HARD RULE — No Placeholder Substitution:**
- ❌ NEVER replace a data-dependent component with `wm-label`, `wm-text`, or any static placeholder when no variable exists yet.
- ❌ NEVER silently omit a data-dependent component from the markup because data is unavailable.
- ✅ If no variable exists for a data-dependent component, CREATE a `ModelVariable` with appropriate mock/sample data FIRST, then generate the component markup with proper bindings.
- ✅ Placeholder substitution is a hard failure, not an acceptable fallback.

**Order of operations for any data-dependent component:**
1. Create the `ModelVariable` (with mock data derived from the screenshot or reasonable defaults).
2. Generate the component markup bound to that variable.
3. Never generate the markup stub before the variable exists.

### To ensure charts are rendered:
- Recognize charts in the screenshot.
- **Identify chart type** from the screenshot visual and set the `type` attribute accordingly. Valid values: `Line`, `Area`, `Column`, `Bar`, `Pie`, `Donut`, `Bubble`. Match based on the visual shape — bars = `Column` (vertical) or `Bar` (horizontal), slices = `Pie` or `Donut`, plotted points/curve = `Line` or `Area`.
- Extract data values from the screenshot by analyzing bar heights, pie slices, lines, or area segments.
- Create ModelVariable with sample data matching screenshot so the chart has usable data (apply the hard block rule above — variable first, markup second).
- Add wm-chart component with proper configuration for the detected chart type.
- Bind chart dataset to the variable created from the extracted data.
- Configure all chart properties including type, dataset, x-axis key, y-axis key, labels, and legend.
- **Custom colors**: Use the `customcolors` property to override the theme's predefined color set. Accepts:
    - Comma-separated color names or hex codes: `customcolors="red, green, blue"` or `customcolors="#FF5733, #33FF57"`
    - Binding to a static variable containing color names or hex codes: `customcolors="bind:Variables.chartColors.dataValue"`
- Match styling from the screenshot where possible.
- Do NOT use placeholder labels.
- Render actual functional charts rather than static or placeholder UI elements.

### To ensure tables are rendered:
    When a screenshot contains tables, bind wm-table dataset to the variable (apply the hard block rule above — variable first, markup second).
- Map each dataset field to a wm-table-column.
- Each dataset field should normally correspond to one table column.
  Custom Columns
  - If a column shown in the UI does not exist in the dataset:
    Create a custom wm-table-column with a unique name (not matching dataset fields/ other table column names).
    Use inner components inside the column to render UI elements.
    Access row data using row.getProperty('<field_name>').

    Example:
    <wm-table-column name="userInfo">
        <wm-picture picturesource="bind:row.getProperty('<src_field_from_dataset>')"></wm-picture>
        <wm-label caption="bind:row.getProperty('<username_field_from_dataset>')"></wm-label>
    </wm-table-column>

## Metadata Validation Rules
- Property name, event name, and method name matching must be exact and case-sensitive.
- Use exact metadata event names and metadata parameter order.
- Respect `unsupportedPageCssProps` from metadata (`getComponentsSummary`) and avoid those CSS properties in page CSS for that component.
- If a property defines `examples` or `example` at the property level, treat each entry as a valid usage pattern for that property's value. Prefer these patterns when constructing values or bind expressions for the property.
- If an event defines `syntax`, it contains the full JavaScript function signature for that event handler. ALWAYS use this exact signature when writing the page JavaScript handler for that event. Never guess argument names or order.
- Event parameter `options` vs property `options` are different: a property `options` field is an enum list — you MUST pick a value only from it; an event parameter named `options` is an object type passed to the handler (configuration/context data) — treat it as an object, not a value list.
- For widget mapping attributes (`widget-type`, `widget`, `edit-widget-type`), use WaveMaker-compatible mappings only.
- Widget mapping reference:
  - `autocomplete` -> `wm-search`
  - `checkbox` -> `wm-checkbox`
  - `checkboxset` -> `wm-checkboxset`
  - `chips` -> `wm-chips`
  - `colorpicker` -> `wm-colorpicker`
  - `currency` -> `wm-currency`
  - `custom-widget` -> `wm-custom-widget`
  - `date` -> `wm-date`
  - `datetime` -> `wm-datetime`
  - `number` -> `wm-number` (or metadata-compliant text fallback)
  - `password` -> `wm-text`
  - `radioset` -> `wm-radioset`
  - `rating` -> `wm-rating`
  - `richtext` -> `wm-richtexteditor`
  - `select` -> `wm-select`
  - `toggle` -> `wm-checkbox`
  - `slider` -> `wm-slider`
  - `switch` -> `wm-switch`
  - `text` -> `wm-text`
  - `textarea` -> `wm-textarea`
  - `time` -> `wm-time`
  - `timestamp` -> `wm-time`
  - `typeahead` -> `wm-search`
  - `upload` -> `wm-fileupload`
- **Widget-type catalog load (mandatory):** When adding or modifying a `wm-form-field` (or any component with a `widget-type`, `widget`, or `edit-widget-type` attribute), you MUST also read the catalog file for the mapped widget component in the same batch call. Use the widget mapping reference above to resolve the WaveMaker component tag, then read `/catalog/components/{mapped-name}/{mapped-name}.md`. This is required because properties of the inner widget can be set directly on the `wm-form-field` in markup — for example, `wm-form-field widget="text"` supports the `updateon` property from `wm-text.md`. Without loading the mapped widget's catalog, those pass-through properties are invisible and cannot be set correctly. Skipping the mapped widget's catalog is a hard failure.
- Charts must fit within their parent container; assign explicit width using percentage (for example `100%`) or static px value.
- If sibling elements have near-identical structure and context indicates a dynamic/data-driven collection (for example product listings, user cards, menu items, search results), convert to a repeating component (`wm-list`, `wm-accordion` with collapse/expand icons, or any supported repeater-template component from WaveMaker metadata).

### Component Selection
- Read `/catalog/components/components-list.md` to get allowed components.
- Read `/catalog/components/{name}/{name}.md` to get component metadata (properties, events, methods, rules, supported CSS). Fetch multiple component files in one call for multiple components.
- In component metadata, `coreProperties` contains complete property details.
- **When to read `advanced-props.md`** — do not read it for every component; only when one of these conditions applies:
  - A component is not rendering correctly (user reports it) → read `advanced-props.md` first, then fix.
  - A component has complex visual behavior (charts, grids, data tables, carousels) that needs precise configuration → read `/catalog/components/{name}/advanced-props.md` before generating its markup to ensure correct advanced properties are applied.
  - Standard properties in `coreProperties` are clearly sufficient for simple components (labels, buttons, containers) → skip; no need to read.
- When the above conditions apply, read `/catalog/components/{name}/advanced-props.md` and use that response as the source of truth.
- The component catalog file returns `coreProperties`, `inherits`, `events`, `methods`, and `examples`.
- **Inherited properties, events, and methods**: If the component's own `coreProperties`, `events`, and `methods` (and `advanced-props.md`) do not contain the property, event, or method needed to implement the required functionality, check the `inherits` field in the component's `{name}/{name}.md`. Read the file paths listed there to discover additional inherited properties, events, and methods that the component also supports. Treat those inherited catalog files with the same authority as the component's own catalog file. Do not read inherited files upfront — only fetch them when the component's direct metadata is insufficient for the current task.
- **Inherited file path conventions**: When the `inherits` field lists an entry (e.g. `"wm.base.events"`), use the following path patterns to access its catalog files — replacing `{inherited_name}` with the exact entry from `inherits`:
  - **coreProperties**: read `/catalog/components/{inherited_name}/{inherited_name}.md` — e.g. `/catalog/components/wm.base.events/wm.base.events.md`
  - **events**: read `/catalog/components/{inherited_name}/events.md` — e.g. `/catalog/components/wm.base.events/events.md`
  - **advanced-props**: read `/catalog/components/{inherited_name}/advanced-props.md` — e.g. `/catalog/components/wm.base.events/advanced-props.md`. Only attempt this file when one of the `advanced-props.md` read conditions applies (see "When to read `advanced-props.md`" above); do not read it unconditionally.
  - Apply these same path patterns for every entry listed in `inherits`, not just `wm.base.events`.
- In `events` and `methods`, the catalog may include only the property/event/method names and omit internal details.
- Never guess event argument lists or method parameters from the main component catalog file.
- If markup generation needs complete event or method details, read `/catalog/components/{name}/events.md` or `/catalog/components/{name}/methods.md` first and use the returned parameter metadata as the source of truth.
- **Missing or insufficient events.md / methods.md**: If `/catalog/components/{name}/events.md` or `/catalog/components/{name}/methods.md` does not exist, or exists but does not contain the specific event or method needed, do not assume the component has no further events or methods. Instead, check the `inherits` field in the component's `{name}/{name}.md` and read the inherited file paths using the **Inherited file path conventions `/catalog/components/{inherited_name}/methods.md`** above to discover additional events and methods the component supports through inheritance.
- This is mandatory before generating event bindings such as `on-eventname="onMethodInvoke($event, widget, var1, var2)"` or widget method calls with arguments. In javascript, `Page.onMethodInvoke = function($event, widget, var1, var2){}`
- In detailed method metadata, if a parameter type is `event` or `Event`, treat it as the event object.
- In detailed method metadata, if a parameter is named `widget` and its type is `Widget`, treat it as the current component instance. Use this widget object to access the current component properties or methods in JavaScript. Example: read a caption with `widget.caption`.
- Do not remap `widget` to another component or infer a different widget instance.
- List Component: Accessing list items:
  - `currentItem` is the bind object for the current list item and can be used to bind data to widgets placed inside the list template.
  - `currentItemWidgets` is available as the fourth argument in widget events fired from within a list template. It provides access to widgets in the current list item instance.
  - Example:
    `Page.button1Click = function($event, widget, item, currentItemWidgets) { alert(currentItemWidgets.Name.caption); };`
  - `selecteditem` captures the selected item from the list when list selection is enabled. For multi-select lists, `selecteditem` returns an array.
  - `selectedItemWidgets` gives access to the widgets of the selected list item through the list widget instance.
  - Example:
    `Page.button1Click = function($event, widget, item, currentItemWidgets) { alert(Page.Widgets.livelist1.selecteditem.firstname); alert(Page.Widgets.livelist1.selectedItemWidgets.Name.caption); };`
- Whenever wizard component is used, load `wizard` skill.
- Whenever a host widget needs **custom markup for each list item or option** (not the default widget layout), load skill `custom-widget-template` before generating markup or script. Applies to: `wm-search` (dropdown suggestions), `wm-checkboxset`, `wm-radioset`, `wm-tree`. Do not apply to other widgets.
- While generating `wm-container` or `wm-list` or `wm-listtemplate` structures, load skill `containerPatternDesign` to apply the correct container layout patterns.

#### Using Component Examples from Metadata
- `examples` is an optional array in the metadata response. Each entry may contain:
  - `markup` — a valid WaveMaker XML snippet showing the component configured correctly.
  - `script` — an optional JavaScript snippet showing the corresponding page JavaScript (event handlers, variable access, etc.) for the markup.
  - **Always treat `examples` as reference-quality code.** They demonstrate correct attribute usage, valid property values, event handler signatures, and JavaScript patterns for that component.
  - When generating markup or JavaScript for a component, **check `examples` first** before constructing from scratch. Use the example as a template and adapt it to the user's intent rather than guessing attribute combinations.
  - If an example contains both `markup` and `script`, treat them as a pair — the script shows the JavaScript that complements the markup event bindings; replicate the same handler signature when writing page JavaScript.
  - Examples do not override the hard rules in this skill (mandatory properties, jsOnly exclusions, etc.) — they are canonical usage patterns, not exhaustive specifications. Always cross-check property names and values against `coreProperties` and `/catalog/components/{name}/advanced-props.md`.
  - If multiple examples exist, pick the one whose context best matches the current task (e.g., prefer a dynamic-data example when a variable binding is involved).

### Custom Item Templates (per-row / per-option / per-node UI)

Use when the screenshot or user intent requires **custom look and feel for each item** in a repeating host dataset — not the widget’s default row/option/node layout.

**Supported host widgets**

| Host widget | Use case |
|---|---|
| `wm-search` | Custom autocomplete / typeahead dropdown row (icon, subtitle, link, etc.) |
| `wm-checkboxset` | Custom layout per checkbox option |
| `wm-radioset` | Custom layout per radio option |
| `wm-tree` | Custom node UI (expand/collapse icons, selection styling, per-node actions) |

**When to load `custom-widget-template` skill**

- Custom dropdown suggestion rows for search/autocomplete/typeahead.
- Custom option layout for checkboxset or radioset.
- Custom tree node UI (including `_node` metadata: `open`, `isParent`, `isSelected`, `level`).
- User asks to apply, reuse, or wire an existing widget template by name, or to call `setTemplate` from script.

**Hard rules (summary)**

- Template must be a **partial**, never a full page.
- `setTemplate` is **JavaScript only** — do not bind template name in markup.
- Template partial requires **`pageParams.item`** and ModelVariable bound to it.
- Verify `setTemplate` and item fields via component catalog and variable outputs before generating script.

Full templates, JSON examples, tree `_node` patterns, and agent workflow: load skill **`custom-widget-template`** (`skills/common/ui/custom-widget-template.md`).
