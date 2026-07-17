---
name: wavemaker-ui
description: >
  Skill for UI development and code generation in WaveMaker applications.
  Creates, updates, renames, or deletes pages and partials, and generates complete page markup, variables, bindings, and actions following WaveMaker's declarative low-code conventions.
  Produces valid WaveMaker XML markup, JavaScript event handlers, and variable definitions without altering unrelated code.
  Can generate or update markup from user intent, screenshots, images, or API specifications.
  Strictly follows WaveMaker's widget hierarchy, variable-binding rules, and naming conventions.
  Ensures non-destructive edits, validates API and variable configurations before use, and applies design token-based styling using theme variants instead of inline CSS.
  Ideal for all UI composition, markup generation, and layout transformation tasks.
  Manages internationalization (i18n) configuration: adding or removing locales, translating messages, customizing date/time/currency formats, managing prefab locale messages, getting localizable messages from pages and binding locale messages to page content.
  Must use verified WaveMaker widget metadata (all properties, methods, events and other configs) as the only valid reference when answering widget or property queries.
  Fabrication of non-existent metadata is strictly prohibited.
sub-skills:
  - new_page_layout_structure_from_screenshot
  - page_management
  - icons
  - pageParams
  - component_metadata
  - markup
  - formatters
  - containerPatternDesign
  - wavemaker-design-system
  - variables
  - actions
  - binding
  - screenshot_validation_and_completion
  - javascript
  - wavemaker-i18n
  - explore-codebase
---

## Output Brevity

**NEVER** print layout analysis, screenshot descriptions, content contracts, component lists, variant lists, variable lists, dependency orders, reasoning steps, or intermediate findings — not even as a brief summary. This is a hard rule with no exceptions. Do not generate your own execution plan or dependency order — follow the steps in the active workflow exactly.

## ⚠️ STRICT RULES — Non-Negotiable Constraints

These rules apply unconditionally to every task, at every step, without exception.

1. **Minimal file changes:** Do not update markup, JavaScript, variables, or any other project file unless the change is directly required by the user's use case. Only modify the files and sections that are necessary to implement the requested behaviour; leave everything else untouched. Never remove existing comments or commented-out code blocks from any file. Violating this rule is not permitted under any circumstance.

## Key File Paths for UI Development

### Pages and Partials
- `src/main/webapp/pages/` — Root directory for all pages and partials
- `src/main/webapp/pages/<PageName>/<PageName>.html` — Page or partial markup
- `src/main/webapp/pages/<PageName>/<PageName>.js` — Page or partial JavaScript
- `src/main/webapp/pages/<PageName>/<PageName>.css` — Page or partial styles
- `src/main/webapp/pages/<PageName>/<PageName>.variables.json` — Page or partial variables
- `src/main/webapp/pages/pages-config.json` — Pages and partials registry (used to register new pages/partials and look up existing ones by role)

### Design Tokens
- `src/main/webapp/design-tokens/` — Design token root
- `src/main/webapp/design-tokens/overrides/global/<category>/<category>.light.json` — Global token overrides (color, font, space, radius, border, opacity, icon, elevation)
- `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` — Component-level token overrides for variant customization

### App-level Files
- `src/main/webapp/app.css` — Global application styles
- `src/main/webapp/app.js` — Global application script
- `src/main/webapp/index.html` — Root HTML entry point

## WaveMaker Core Concepts

WaveMaker apps are built from pages, partials, components, variables, actions, bindings, and page params. Understand these concepts first before deciding which tools or skills to use.

- **Pages**
  - A page is a complete screen in the application.
  - A page usually contains layout, UI components, page-level variables, page-level actions, and an optional page script.
  - Pages are used for full user flows like dashboard, list view, form page, details page, or settings page.
  - Load skill `page_management` when you need to create, rename, delete, inspect, or update a page. This skill provides the exact safe workflow and tool sequence for page-level changes.

- **Partials**
  - A partial is a reusable UI fragment, not a full screen.
  - Partials are commonly used for repeated or isolated sections such as header, left navigation, footer, filter panel, reusable cards, or embedded content blocks.
  - A partial has its own markup, variables, actions, page params, and script, just like a smaller page.
  - When a layout host such as `wm-header`, `wm-left-panel`, `wm-right-panel`, or `wm-footer` points to a partial through `content="<partialName>"`, update that partial rather than writing standalone markup elsewhere.
  - Load skill `page_management` when working with partials. It explains how to create/update partials correctly and how to handle host-linked partials referenced by layout containers.

- **Components and Markup**
  - The visible UI is built using WaveMaker components in markup.
  - Components include containers, forms, tables, lists, cards, labels, inputs, buttons, dialogs, and layout hosts.
  - Markup defines component hierarchy, properties, events, classes, and bindings.
  - Do not invent component properties or structure. Always follow component metadata and allowed hierarchy.
  - Load skill `component_metadata` first to confirm allowed properties, hierarchy, and constraints, then load `markup` to generate or update valid WaveMaker markup using those rules.

- **Bindings**
  - Binding is how data flows between UI components, variables, actions, and page params.
  - In simple terms, bindings connect one thing to another without hardcoding values everywhere.
  - Typical examples:
    - Bind a widget to a variable dataset.
    - Bind a variable input to a widget value.
    - Bind a component property to page params.
  - In markup, bindings use expressions such as `bind:Variables.employeeVar.dataSet`, `bind:Widgets.searchInput.datavalue`, or `bind:pageParams.categoryId`.
  - Use bindings for declarative data flow first; do not move this logic into JavaScript unless necessary.
  - Load skill `binding` for binding syntax and expression patterns. If the binding source or target is a variable, action, or page param, also load `variables`, `actions`, or `pageParams` to confirm valid fields, input/output shape, and access paths before wiring the binding.

- **Scope**
  - Scope tells where a variable or action belongs and where it can be accessed from.
  - Main scopes are App, Page, and Partial.
  - App scope is shared across multiple pages.
  - Page scope belongs only to one page.
  - Partial scope belongs only to one partial.
  - In JavaScript, access uses explicit scope objects such as `App.Variables.<name>`, `Page.Actions.<name>`, or `Partial.Variables.<name>`.
  - In markup bindings, variables and actions are referenced without the JS scope prefix, for example `Variables.<name>` and `Actions.<name>`.
  - Use the related skill (`variables`, `actions`, `binding`, `javascript`) when scope-sensitive access matters.

- **Variables**
  - Variables are the main data layer in WaveMaker.
  - They hold local state, static data, or backend/service data.
  - Variables can power forms, lists, tables, cards, filters, and any dynamic UI.
  - Common cases:
    - `ModelVariable` for local or static data.
    - Service/API-aware variables for backend calls and datasets.
  - Variable input mapping is usually configured through `dataBinding`, and variable output is commonly read from `dataSet`.
  - Prefer declarative variable configuration over writing manual fetch logic in JavaScript.
  - Load skill `variables` when creating or editing variables. It helps you pick the right variable type, set valid inputs (`dataBinding`), and consume outputs (`dataSet`) correctly.

- **Actions**
  - Actions represent executable UI behavior.
  - They are used for navigation, notifications, timers, login/logout, and other triggered flows.
  - Actions are usually invoked from events such as button click, page event, or another workflow step.
  - Navigation between pages should use `NavigationAction`, not custom JavaScript routing.
  - Action configuration is declarative, and action invocation happens from markup or script using the `Actions` namespace.
  - Load skill `actions` when defining or updating behavior flows. It provides supported action types, correct metadata, and valid input/output mapping patterns.

- **Page Params and Partial Params**
  - Page params are inputs passed into a page so the page can render context-specific data.
  - Example: open a details page and pass `customerId` to it.
  - Partial params work similarly for partials.
  - A calling page typically passes page params through `NavigationAction`, and the receiving page reads them through `pageParams`.
  - In markup use `bind:pageParams.<paramName>`. In JavaScript use the valid page or partial param access patterns defined by the page params skill.
  - Load skill `pageParams` when adding, changing, or consuming page/partial params. It gives the correct patterns for defining params, passing them, and reading them in markup and script.

- **Design System: Tokens, Variants, and Page CSS**
  - WaveMaker styling should follow the design system first, not ad hoc page-level styling.
  - Design tokens are reusable style values such as colors, typography, spacing, borders, and sizing used to keep the application visually consistent.
  - Variants are reusable component style configurations built on top of tokens and applied to components through markup.
  - Always check and use existing tokens and existing/default variants first when they satisfy the required design.
  - Add page CSS only for the remaining styles that cannot be achieved through tokens or variants.
  - Load skill `wavemaker-design-system` when applying visual design. It guides you to reuse existing tokens/variants first, then create or update them safely before falling back to page CSS.

- **JavaScript**
  - JavaScript is the custom scripting layer in WaveMaker used to add behavior that cannot be handled through markup, bindings, variables, or actions alone.
  - Use JavaScript only for custom event handlers, business logic, conditional processing, data transformation, or coordination logic that is not possible cleanly through declarative configuration.
  - Prefer declarative implementation first, and use JavaScript only when it is truly needed.
  - Load skill `javascript` only for non-declarative needs, such as custom handlers or transformation logic. Do not use it for cases that can be solved with markup, bindings, variables, or actions.

## Catalog File Structure

The catalog is a virtual file system served by the WaveMaker platform. Skill files reference catalog paths using `~{read_files}` with `file_paths: ["/catalog/..."]`. These files are the single source of truth for component metadata, variable types, action types, design tokens, and theme component schemas. Never invent or assume content — always read the relevant catalog file before generating markup, variables, actions, or styling.

### `/catalog/components/`
Holds metadata for every WaveMaker UI component.

| Path | Contents                                                                                                                                                                                                                                 |
|------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `components-list.md` | Complete list of allowed component tag names. Read this before using any component to ensure it exists.                                                                                                                                  |
| `{name}/{name}.md` | Primary metadata for a component: supported properties, events, methods, allowed children (`children`), hierarchy rules, and supported CSS classes. Replace `{name}` with the component tag (e.g. `wm-button`, `wm-text`, `wm-container`). |
| `{name}/advanced-props.md` | Extended property detail, including full `class` options (variants/modifiers) available for that component. Read this when `coreProperties` in the main file are not sufficient or when you need to pick a class/variant name for markup. |
| `{name}/events.md` | Full event signatures with parameter names and types.                                                                                                                                                                                    |
| `{name}/methods.md` | Full method signatures with parameter names and types.                                                                                                                                                                                   |

### `/catalog/variables/`
Holds metadata for every WaveMaker variable type.

| Path | Contents |
|------|----------|
| `variables-list.md` | List of all supported variable types (e.g. `ModelVariable`, `ServiceVariable`). Read this to pick the correct variable type. |
| `{name}/{name}.md` | Metadata for a specific variable type: supported properties, `dataBinding` input fields, `dataSet` output shape, methods, and events. Replace `{name}` with the variable type (e.g. `ModelVariable`, `ServiceVariable`). |

### `/catalog/actions/`
Holds metadata for every WaveMaker action type.

| Path | Contents |
|------|----------|
| `actions-list.md` | List of all supported action types (e.g. `NavigationAction`, `NotificationAction`, `LoginAction`). Read this to pick the correct action type. |
| `{name}/{name}.md` | Metadata for a specific action type: category, supported operations, input/output mapping fields. Replace `{name}` with the action type (e.g. `NavigationAction`, `LoginAction`). |

### `/catalog/design-tokens/`
Holds default token structure definitions for each design token category.

| Path | Token category |
|------|---------------|
| `color.md` | Color palette tokens |
| `font.md` | Typography tokens (family, size, weight, line-height) |
| `space.md` | Spacing/margin/padding scale tokens |
| `radius.md` | Border-radius tokens |
| `opacity.md` | Opacity level tokens |
| `icon.md` | Icon size and style tokens |
| `elevation.md` | Shadow/elevation tokens |
| `border.md` | Border width and style tokens |

### `/catalog/theme-components/`
Holds component-level theming schemas used to create or update component variants.

| Path | Contents |
|------|----------|
| `theme-components-list.md` | List of components eligible for variant/token customization. |
| `{name}/token-structure.md` | Valid token keys and schema for a specific component's overrides. |

- Treat the loaded skill workflow as the source of truth for step-by-step execution, allowed write operations, and validation.
- For screenshot/image driven page creation or modification, load skills on-demand by task:
  - Analysis step: load `new_page_layout_structure_from_screenshot`.
  - Markup/content step: load `markup`, `icons`, and dependent skills required by generated content.
  - Validation/finalization step: load `screenshot_validation_and_completion` before closing.
- Just-in-time loading rule (mandatory): load a skill only immediately before the step that uses it; never load unrelated skills upfront.
  - Example: during markup/content generation, do not load `screenshot_validation_and_completion`.
  - Load `screenshot_validation_and_completion` only when entering validation/finalization.

# Skill: Tool Usage Quick Reference

## Objective
Provide strict tool-call contracts for WaveMaker page-generation operations, aligned with the UI Expert tool set.

## File Save Tool Contract (HARD RULE)
- **Markup** (`.html` — page/partial structure, components, attributes, events, bindings): save via **ui_applyChangesOnPageMarkup** (Required Args) first. Fall back to `write_file`/`edit_file_content`/`replace_in_files` only as a last resort, when that tool is unavailable or fails for the operation.
- **Everything else** (JavaScript `.js`, `.variables.json`, CSS `.css`, tokens, or any other project file): use `write_file`, `edit_file_content`, or `replace_in_files` directly — no fallback needed.

## Response After Execution

After completing any task, do **NOT** include:
- "Changes Made on the Page" sections
- "How was it implemented" sections
- Any post-execution explanations, summaries, or implementation details

Just execute and stop. No explanation needed.
