---
name: code-review
sub-skills: [containerPatternDesign, layout-rules]
description: >
  Review WaveMaker project files against best practices and emit structured review comments.
  Report-only — never edits files. Default scope is DIFF (local draft changes only). Switch to
  FULL FILE or FULL APPLICATION only when the user explicitly uses "entire", "whole", or "full"
  (e.g. "review the entire application", "review the whole Login page").
  Active rules: (1) auto-layout correctness — flags deprecated grid layouts, inconsistent autolayout attributes
  (missing direction when other layout attributes are present) (error), invalid attribute names,
  and invalid attribute values on the six autolayout
  widgets (wm-container, wm-list, wm-listtemplate, wm-accordionpane, wm-tabpane, wm-page-content);
  (2) CSS-for-layouting — flags new page/app CSS classes that should be variants or auto-layout attributes instead;
  (3) variant markup correctness — flags CSS classes defined but unused in markup, reserved name collisions, and missing variant attributes;
  (4) inline style tags — flags any <style> tag inside HTML page files (prohibited);
  (5+) custom project rules from the code review agent's section of src/main/webapp/agents.md — developer-defined rules that merge into
  the built-in catalog and take precedence on conflict.
  Bootstrap classes are always exempt from all rules; auto-layout issues are not flagged when Bootstrap layout classes coexist with WaveMaker auto-layout attributes.
  Additional rules (JS syntax, WaveMaker DSL) are planned but NOT active yet.
---

# Code Review — WaveMaker Best Practices

Review WaveMaker project files and report violations of best practices as structured **review comments**.

**This skill is report-only. NEVER edit, fix, or rewrite files.**

> **Tool timeout rule:** If a call to `~{find_files_by_glob}` does not return a result within 1 minute, do not wait any longer — cancel/kill that tool call immediately and proceed without the results. Do not block the review or retry the call.

## Step 1 — Determine Review Scope

**Default is always DIFF.** Every review request — including requests that name specific pages — uses DIFF scope unless the user's message contains the word "entire", "whole", or "full". Naming a page does **not** imply full scope.

> **Named-page rule:** `Review TestCodeReview3 and TestCodeReview4` → **DIFF** (named pages, no qualifier). `Review the entire TestCodeReview3 page` → **FULL FILE** (qualifier present).

| Condition | Scope |
| --- | --- |
| No qualifier word — any request without "entire", "whole", or "full" | **DIFF** (default) |
| Request contains **"entire"**, **"whole"**, or **"full"** + a specific file/page | **FULL FILE** |
| Request contains **"entire"**, **"whole"**, or **"full"** + the project/app/all pages | **FULL APPLICATION** |

**DIFF scope:** restricted to `+`-prefixed lines in the unified diffs returned by `~{platform_getProjectVcsDiff}`. Unchanged context lines are never flagged.

**FULL FILE scope:** resolve the named file(s) and `~{read_files}` them completely. Do **not** call the diff tools. Every line is in scope.

**FULL APPLICATION scope:** use `~{find_files_by_glob}` to discover all markup and CSS files under `src/main/webapp`, then `~{read_files}` each. Do **not** call the diff tools. Every line of every file is in scope.

If the request genuinely mixes signals and intent is unclear, ask: "Do you want me to review only your **local changes**, or the **entire file/application** regardless of changes?" Wait for the answer before proceeding.

---

## Step 2 — Determine What to Review

File discovery branches based on the scope determined in Step 1.

### DIFF scope — discover local changes

**Diff output format:** `~{platform_getProjectVcsDiff}` returns `{filepath: unified-diff-string}`. Lines prefixed `+` are in scope; space-prefixed context lines and `-` removed lines are never flagged. Derive line numbers from `@@ -a,b +c,d @@` hunk headers.

1. **If the user named specific pages/files**, review exactly those. Call `~{platform_getProjectVcsDiff}` with those file paths to get their unified diffs. Use `~{read_files}` only when you need full surrounding context that the diff hunk does not already include.
2. **Otherwise** (the default for "review my changes"):
   - Call `~{platform_getProjectVCSChanges}` (no args) — it returns every locally changed file in the project draft vs the main branch: **added (new files), modified, and deleted**. This is the source of truth and DOES include brand-new files.
   - If your toolset exposes platform tools only through `~{execute_tool}` (e.g. the orchestrator agent), call `~{get_tool_schema}` / `~{execute_tool}` with `tool_name = "platform_getProjectVCSChanges"` instead of calling it directly.
   - Take the **added + modified** entries, keep the markup files (`.html` for web, `.markup.xml` for mobile) and CSS files (`.css`). Call `~{platform_getProjectVcsDiff}` with those paths to get their unified diffs. If your toolset exposes platform tools only through `~{execute_tool}`, call it with `tool_name = "platform_getProjectVcsDiff"` instead of calling it directly. Do **not** call `~{read_files}` on every file — only use it to expand context around a specific hunk when the diff alone is insufficient to judge a widget correctly. Ignore deleted files.

If the user named no files and `platform_getProjectVCSChanges` returns nothing, report "No local changes to review" and stop.

Restrict the review to these files only — never review unrelated existing files.

**Optional — same-session diff.** Use `~{get_code_checkpoints}` → `~{get_diff_for_checkpoints}` → `~{get_file_patch_for_checkpoints}` to inspect only what changed in this chat session; these are NOT the primary discovery method — prefer `platform_getProjectVCSChanges`.

### FULL FILE scope — read named file(s) in full

1. Identify the file path(s) from the user's request.
   - If the user gave a page name (e.g. "Login") rather than a full path, use `~{find_files_by_glob}` with the pattern `src/main/webapp/pages/<PageName>/<PageName>.html` (web) or `src/main/webapp/pages/<PageName>/<PageName>.markup.xml` (mobile) to resolve the path. Also resolve the corresponding CSS file if you need to evaluate CSS rules.
   - If the user gave an explicit path, use it directly.
2. Call `~{read_files}` on each resolved file to get the complete file contents.
3. Do **not** call `~{platform_getProjectVCSChanges}` or `~{platform_getProjectVcsDiff}` — the diff is irrelevant in this scope.

### FULL APPLICATION scope — read all markup and CSS files

1. Call `~{find_files_by_glob}` with the following patterns to discover all in-scope files:
   - `src/main/webapp/pages/**/*.html` (web page markup)
   - `src/main/webapp/pages/**/*.markup.xml` (mobile page markup)
   - `src/main/webapp/pages/**/*.css` (page CSS)
   - `src/main/webapp/app.css` (global CSS)
   - `src/main/webapp/partials/**/*.html` (partial markup)
   - `src/main/webapp/partials/**/*.css` (partial CSS)
2. Call `~{read_files}` on each discovered file to get complete contents.
3. Do **not** call `~{platform_getProjectVCSChanges}` or `~{platform_getProjectVcsDiff}`.

## Step 2.5 — Load Custom Project Rules

Attempt to read the project's shared agent instructions file:

```
src/main/webapp/agents.md
```

Call `~{read_files}` with that exact path. This file holds instructions for **multiple** agents, not just this one — you must extract only the portion addressed to the code review agent before treating anything as a rule.

1. If the file is **absent, empty, or unreadable**, proceed with built-in rules only. Do not fail or pause the review — `agents.md` is always optional.
2. If the file **exists and has content**, locate the section addressed to the **code review agent**: the heading (at any level) whose text identifies this agent — e.g. "Code Review Agent", "code-review", "code review", or "review agent" (match case-insensitively). The section spans from that heading down to the next heading of the **same or higher** level (or the end of the file). Everything between is the code review agent's instruction block.
3. If **no** heading addresses the code review agent, proceed with built-in rules only — instructions written for other agents are never treated as review rules.
4. Treat the extracted instruction block as the custom-rules source: parse it into discrete rules (see "Custom Project Rules" section below) and hold them as the **custom rule set** for this review. Sections addressed to other agents are ignored entirely.
- Apply the same timeout rule as other tool calls: if the read does not return within 1 minute, skip the file and continue.

## Step 3 — Scan

In **DIFF scope**, `~{platform_getProjectVcsDiff}` returns a `{filepath: unified-diff string}` map — scan the `+`-prefixed lines in each file's unified diff. You may additionally `~{grep_in_files}` the in-scope files for the pattern `wm-layoutgrid|wm-gridrow|wm-gridcolumn` for fast Rule 1 detection. When a diff hunk contains a partial widget tag and you cannot determine the widget's full attributes, use `~{read_files}` to read the surrounding context, then apply the rules.

In **FULL FILE or FULL APPLICATION scope**, scan the complete file contents retrieved in Step 2. You may use `~{grep_in_files}` for fast pattern detection on those same files.

## Rule Catalog

**Rules 1, 2, 3, and 4 are active.** Rules 5 and 6 are listed so the catalog is stable and extensible — do NOT enforce them yet.

### Bootstrap Class Exemption (applies to all rules)

Bootstrap CSS classes are **always permitted** in WaveMaker markup and must never be flagged under any rule. A class is treated as a Bootstrap class when it is **not defined in the project's own diff CSS files** and matches a known Bootstrap naming pattern, including:

`col-*`, `row`, `container`, `container-*`, `d-*`, `flex-*`, `justify-content-*`, `align-items-*`, `align-self-*`, `order-*`, `offset-*`, `g-*`, `gx-*`, `gy-*`, `p-*`, `px-*`, `py-*`, `m-*`, `mx-*`, `my-*`, `mt-*`, `mb-*`, `ms-*`, `me-*`, `text-*`, `bg-*`, `border`, `border-*`, `rounded`, `rounded-*`, `shadow`, `shadow-*`, `float-*`, `position-*`, `w-*`, `h-*`, `fw-*`, `fs-*`, `overflow-*`, `visible`, `invisible`, `btn` (standalone), `badge`, `alert`, `alert-*`, `card`, `card-*`, `nav`, `nav-*`, `navbar`, `navbar-*`, `table-*`, `list-*`, `form-*`, `input-group*`.

**Implications for each rule:**

- **Rule 1:** See Bootstrap coexistence clause below.
- **Rule 2:** Bootstrap utility classes on widgets are not CSS-for-layouting violations — skip them.
- **Rule 3b:** Bootstrap classes used in markup but absent from diff CSS are not dead classes — skip them.
- **Rule 3c:** Bootstrap class names (e.g. `btn-primary`, `btn-secondary`, `container`) must not be flagged as reserved name collisions. Bootstrap's naming predates WaveMaker's variant system and intentionally shares these names.
- **Rule 3d:** Bootstrap classes do not follow WaveMaker's `<root-key>-<appearanceName>` variant pattern and must not be flagged for a missing `variant` attribute.

### Modified-lines Scope (DIFF scope only)

> **This constraint applies exclusively in DIFF scope.** In FULL FILE and FULL APPLICATION scope, every line of every in-scope file is reviewable — the `+`-line trigger requirement does not apply.

**In DIFF scope:** `~{platform_getProjectVcsDiff}` returns a `{filepath: unified-diff string}` map. A finding is in scope only if the widget, attribute, or CSS class it concerns appears on a **`+`-prefixed line** in that unified diff. Space-prefixed context lines and `-`-prefixed removed lines are never the basis for a new finding — but they may be read to understand the widget structure or verify a rule correctly. Specifically:

- A widget that exists only on unchanged lines in a modified file is **never flagged**, even if it would violate a rule.
- A CSS class definition that exists only on unchanged lines is **never flagged** for Rule 2.
- When a modified line is part of a multi-line widget tag, you may read the full tag (via the diff context or `~{read_files}`) to judge correctness, but the **trigger** must be an added/modified line.
- For newly added files (all lines are additions), every line is in scope.

### Rule 1 — Auto-layout correctness [ACTIVE]

> **Autolayout widget scope (Rules 1b, 1c, 1d):** Attribute checks apply **only** to these six widget tags: `wm-container`, `wm-list`, `wm-listtemplate`, `wm-accordionpane`, `wm-tabpane`, `wm-page-content`. Every other widget is out of scope for Rules 1b–1d. The `containerPatternDesign` sub-skill (see **Sub-skills** section at the end of this skill) is the authoritative reference for autolayout attribute semantics, mandatory attributes, and valid value patterns.

#### Rule 1a — Deprecated grid widgets [Error]

Flag every occurrence of `wm-layoutgrid`, `wm-gridrow`, or `wm-gridcolumn` on an added/modified diff line as an **Error**.

**Recommended fix (state it in the comment, do not apply it):** replace the grid with `wm-container direction="row"` (for columns) / `direction="column"` (for stacked sections), giving each child an explicit `width` (`%`, `px`, `fill`, or `hug`). Examples:

- Equal columns: `width="50%"` (2-col), `width="33%"` (3-col), `width="25%"` (4-col).
- Unequal split: `width="240px"` + `width="fill"`, or `width="30%"` + `width="70%"`.

#### Rule 1b — Inconsistent autolayout attributes [Error]

For each in-scope autolayout widget on an added/modified diff line, apply the following check:

**Error — missing `direction`:** flag when the widget has at least one of `alignment`, `gap`, `columngap`, or `wrap` present but **no** `direction` attribute. Suggestion: `Add direction`.

Do **not** flag `name`, `class`, `width`, or `height` as missing — they are not required by this rule.

When a widget tag spans multiple lines, read the full tag (via diff context or `~{read_files}`) before flagging — do not flag an attribute that simply appears on a later line of the same tag.

**Bootstrap coexistence exception (Rules 1b, 1c, 1d):** Do **not** apply these checks to a widget that carries Bootstrap layout classes (`d-flex`, `col-*`, `row`, etc.) with **no** WaveMaker autolayout attributes at all.

#### Rule 1c — Invalid attribute name [Error]

For each in-scope widget on an added/modified diff line, flag any attribute not in the whitelist below as an **Error**. For obvious typos suggest the correct attribute (e.g. `space` → `Use gap`; `align` → `Use alignment`; `dir` → `Use direction`).

**Shared whitelist (all six in-scope widgets):**

- Autolayout: `name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`
- Layout extras: `wrap`, `columngap`, `padding`, `margin`, `position`, `positionvalue`, `zindex`, `clipcontent`, `overflow`, `smoothscroll`
- Visibility / base: `show`, `deferload`, `accessroles`, `showindevice`, `conditionalclass`, `hint`, `disabled`
- Visual: `variant`, `backgroundcolor`, `backgroundimage`, `backgroundrepeat`, `backgroundposition`, `backgroundsize`, `backgroundattachment`, `backgroundgradient`, `animation`

**Per-widget additions:**

| Widget             | Extra allowed attributes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `wm-container`     | `content`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `wm-tabpane`       | `content`, `title`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `wm-accordionpane` | `content`, `title`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `wm-listtemplate`  | `layout`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `wm-page-content`  | `columnwidth`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `wm-list`          | `dataset`, `pagesize`, `itemsperrow`, `itemclass`, `listclass`, `navigation`, `navigationalign`, `multiselect`, `selectfirstitem`, `groupby`, `match`, `orderby`, `nodatamessage`, `loadingdatamsg`, `enablereorder`, `selectionlimit`, `collapsible`, `showcount`, `disableitem`, `ondemandmessage`, `itemkey`, `title`, `subheading`, `tabindex`, `responsive`, `pagesizeoptions`, `allowpagesizechange`, `statehandler`, `hidehorizontalscrollbar`, `numberofskeletonitems`, `disabletoucheffect`, `templateview`, `showrecordcount`, `iconclass`, `dateformat`, `fallback`, `pulltorefresh`, `direction` |

**Escape hatches (always valid — never flag):**

- Event handlers: any attribute matching `on-*` (e.g. `on-click`, `on-load`, `on-change`)
- Bindings: any attribute whose value starts with `bind:`, or attributes named with a `.bind` suffix
- HTML / accessibility standard: `aria-*`, `role`, `tabindex`, `data-*`

#### Rule 1d — Invalid attribute value [Error]

For each in-scope widget on an added/modified diff line, validate present autolayout attributes against the table below. Flag as an **Error** when the value is outside the allowed set. Suggestion names the correct value or format.

| Attribute   | Allowed values                                             | Suggestion when invalid                           |
| ----------- | ---------------------------------------------------------- | ------------------------------------------------- |
| `direction` | `row`, `column`                                            | `direction must be row or column`                 |
| `gap`       | `auto` or any non-negative integer (`0`, `4`, `8`, `16` …) | `gap must be auto or a number`                    |
| `width`     | `fill`, `hug`, `Npx` (e.g. `200px`), `N%` (e.g. `50%`)     | `width must be fill, hug, Npx, or N%`             |
| `height`    | `fill`, `hug`, `Npx` (e.g. `200px`), `N%` (e.g. `50%`)     | `height must be fill, hug, Npx, or N%`            |
| `wrap`      | `true`, `false`                                            | `wrap must be true or false`                      |
| `position`  | `relative`, `sticky`, `absolute`, `fixed`                  | `position must be relative/sticky/absolute/fixed` |

**gap-to-alignment dependency (strict):** The valid `alignment` values depend on whether `gap` is numeric or `auto`. Evaluate both attributes together:

- When `gap` is a number → `alignment` must be one of: `top-left`, `top-center`, `top-right`, `middle-left`, `middle-center`, `middle-right`, `bottom-left`, `bottom-center`, `bottom-right`
- When `gap="auto"` → `alignment` must be one of: `start`, `center`, `end`

Flag any `alignment` value that violates this constraint as an **Error**. Suggestion: `alignment must be top-*/middle-*/bottom-* when gap is numeric` or `alignment must be start/center/end when gap=auto`.

### Rule 2 — Avoid CSS for layouting; prefer variants over page CSS [ACTIVE]

CSS classes written in `app.css` or `page.css` are a code smell when WaveMaker's variant/token system or auto-layout attributes can express the same intent natively.

> **Diff scope (DIFF scope only):** In DIFF scope, every step in Rule 2 operates exclusively on the diff returned by `~{platform_getProjectVcsDiff}`. This means:
>
> - Only CSS classes that appear on **`+` (added) lines** in the diff of `app.css` / page CSS files are in scope. Classes on unchanged or removed lines are never evaluated.
> - Only markup widgets that appear on **`+` (added or modified) lines** in the diff of markup files are in scope. Widgets on unchanged lines of the same file are never evaluated.
> - Do NOT read or scan any file that is not part of the changed file set from Step 2. Never open unrelated pages, CSS files, or project-wide files to look for usages.
>
> In **FULL FILE or FULL APPLICATION scope**, Rule 2 evaluates all CSS classes and markup widgets in the in-scope files (every line, not just `+` lines). Never open files outside the scope set determined in Step 2.

#### Step 2a — Discover changed CSS files

From the in-scope changed files (identified in Step 2), filter to:

- `app.css`
- `<PageName>.css` (any page CSS file)

If neither type is changed, skip this rule entirely.

#### Step 2b — Extract new CSS class definitions and their deep selectors

Read each changed CSS file. Identify every **new CSS class introduced in the diff** (added lines only — classes present in unchanged or removed lines are out of scope). For each new class, extract two levels:

**Level 1 — Direct properties** (rules on the class itself, e.g. `.card-wrapper { … }`):

- The class name
- The CSS properties it defines directly
- Whether those properties are primarily **layout** (e.g. `display`, `flex`, `grid`, `width`, `height`, `gap`, `align-items`, `justify-content`, `flex-direction`, `padding`, `margin`) or **visual** (e.g. `color`, `background`, `border`, `font-*`, `border-radius`, `box-shadow`).

**Level 2 — Deep selector rules** (rules that use the class as a scope to target descendants, e.g. `.card-wrapper .wm-button { … }`, `.card-wrapper > wm-label { … }`, `.card-wrapper wm-container .title { … }`):

- For each deep selector block, record:
  - The **target selector** (what element/widget is being styled)
  - The **CSS properties** applied to that target
  - The **implied widget type** — map element selectors or class names back to WaveMaker widget types where possible (e.g. `wm-button` → `wm-button`, `.app-button` → likely `wm-button`, `wm-label` → `wm-label`)

Treat Level 2 rules as styling applied to **child widgets** of the parent class's host widget — they are candidates for variants on those child widgets, not on the parent.

#### Step 2c — Find usages in markup

For each new CSS class, search only the **diff markup files** (added + modified markup files from Step 2) for widgets that reference that class via `class="…"`. Use `~{grep_in_files}` scoped to those files only. Note the widget type (`wm-container`, `wm-button`, etc.) and its location. Only consider widget instances that appear in **added or modified lines** of the diff — ignore unchanged lines even if they are in a changed file.

#### Step 2d — Evaluate: can a variant replace the class(es)?

Group by widget instance first, not by class. A single widget may carry several new CSS classes — evaluate them together, not independently.

**For each widget instance:**

1. **Collect all new CSS classes on the widget.** From the markup, read the full `class="…"` attribute and intersect with the set of new classes discovered in Step 2b. This gives you the complete list of new classes applied to this specific widget.

2. **Merge the CSS properties.** Combine the property sets from all collected classes into a single flat property map for this widget. Where two classes set the same property, the last class in the list wins (standard CSS cascade). The result is the **effective style** the widget actually receives from those classes.

3. **Check variant eligibility.** Look up the widget's root key in the `wavemaker-design-system` skill (Part 2.1 / Part 2.2). If the component is listed in `/catalog/theme-components/theme-components-list.md`, a variant can express most visual properties.

4. **Check supported CSS props.** Read `/catalog/theme-components/<dir>/supported-css-props.md` for the component. Partition the merged property map into:
   - **Variant-expressible** — properties listed in `supported-css-props.md` → must go through a variant (flag as Error if in page CSS).
   - **Non-variant** — properties not listed → page CSS is permitted as a last resort.

5. **Check existing variants before suggesting a new one.** Before proposing any new variant, read the component's existing variants from:
   - The project override file at `src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json` (if it exists)
   - The built-in appearances in `/catalog/theme-components/<dir>/token-structure.md`

   Compare the merged effective property map against each existing variant's token mapping. An existing variant **suffices only if every single property in the effective map is already covered** by that variant's mapping — even one property mismatch means the existing variant does not suffice and a new one must be suggested. Do not suggest combining an existing variant with extra page CSS as an acceptable outcome.
   - **If a fully matching existing variant is found:** suggest reusing it (set `variant="<name>"` and `class="<root-key>-<name>"` on the widget). Do not suggest creating a new variant.
   - **If no fully matching variant exists:** propose **one new variant** that encodes all the variant-expressible properties together. State the suggested variant name and the token mappings it would need. For example: "No existing variant covers all required properties — create a `container` variant `card-section` mapping `background → {color.surface.@}`, `padding → {space.md}`, `border-radius → {radius.md}`."

**Multi-class output rule:** When a widget carries multiple CSS classes, always evaluate them as a single unit (as described above) and emit **at most one finding per widget** — the combined variant suggestion. Never list each class as a separate row. If the merged property set contains no variant-expressible properties (i.e. nothing to put into a variant), do not flag the widget at all — omit it from the output entirely.

6. **Evaluate deep selector rules on child widgets.** For every Level 2 deep selector block, identify the child widget type, merge its CSS properties, and run the same variant eligibility check (steps 3–5) on that child widget. If the properties are variant-expressible, suggest a variant on the child widget directly instead of a deep selector. Flag as **Error** (variant-expressible) or **Warning** (best-practice). Evaluate each targeted child widget type independently.

7. **Report residual page CSS** only if non-variant properties remain — these stay in page CSS and are not flagged.

#### Step 2e — Evaluate: does the class define layout? Use auto-layout attributes instead.

If the CSS class is primarily layout-oriented (`display: flex`, `gap`, `align-items`, `justify-content`, `flex-direction`, etc.), suggest the equivalent `wm-container` auto-layout attributes (`direction`, `gap`, `alignment`, `width`, `height`) instead. Cross-reference `layout-rules` for the full mapping.

**Simple widget exemption:** Do not flag layout-related CSS on simple leaf widgets (`wm-label`, `wm-button`, `wm-anchor`, `wm-icon`, `wm-picture`, `wm-text`, `wm-textarea`, `wm-select`, `wm-checkbox`, `wm-checkboxset`, `wm-radioset`, `wm-switch`, `wm-slider`, `wm-rating`, `wm-colorpicker`, `wm-date`, `wm-time`, `wm-datetime`, `wm-spinner`, `wm-progressbar`, `wm-search`, `wm-chips`, `wm-currency`, `wm-number`, `wm-password`, `wm-fileupload`) — these are not layout hosts.

#### Findings — Severity

- **Error** — a CSS property is used in page/app CSS that is listed in the component's `supported-css-props.md` (should be a variant).
- **Warning** — a layout CSS class is used where `wm-container` auto-layout attributes would be the idiomatic WaveMaker approach.
- **Warning** — a visual CSS class is used on a variant-eligible component where a component variant could express the same styling, but the property is not in `supported-css-props.md` (best-practice suggestion, not a hard error).

### Rule 3 — Proper variant usage in markup [ACTIVE]

Rule 2 audits CSS files and works toward the markup. Rule 3 audits the markup directly and catches variant misuse that Rule 2 cannot see — it does not require any CSS file to have changed.

> **Scope of exemptions:** The simple widget exemption (from Rules 1 and 2) does NOT apply here. Every widget type — including `wm-label`, `wm-button`, `wm-icon`, and all other leaf widgets — must be checked for variant misuse. A `wm-button` with `class="btn-cta"` and no `variant="cta"` is always an error regardless of its widget type.

> **Diff scope (DIFF scope only):** In DIFF scope, every step in Rule 3 operates exclusively on the diff returned by `~{platform_getProjectVcsDiff}`. This means:
>
> - Only widgets that appear on **`+` (added or modified) lines** in the diff of markup files are in scope. Widgets on unchanged lines of the same file are never evaluated — even if the file itself is in the changed set.
> - CSS definition lookups (Step 3b) check only the **diff CSS files** (added + modified `app.css` / page CSS from Step 2). Do not open CSS files that are not part of the changed set to look for class definitions.
> - Do NOT open any file outside the changed file set from Step 2 to satisfy any check in this rule.
>
> In **FULL FILE or FULL APPLICATION scope**, Rule 3 evaluates all widgets and CSS classes in the in-scope files (every line, not just `+` lines). Never open files outside the scope set determined in Step 2.

#### Step 3a — Find all widgets with a `class` attribute

From the **added and modified lines** of the diff markup files only, collect every widget that has a `class="…"` attribute. For each, collect:

- The widget type (e.g. `wm-button`, `wm-container`)
- The full list of class names on that widget
- Whether a `variant="…"` attribute is also present

#### Step 3b — Flag CSS classes defined but not used in markup

For each **new CSS class introduced in the diff CSS files** (added lines in `app.css` / page CSS from Step 2), check whether that class name appears in any diff-scoped markup widget's `class="…"` attribute. If a class is defined in the CSS diff but referenced by no widget in the markup diff, flag it as a warning — it is a dead CSS class with no effect.

**Inversion rule (strictly enforced):** Do NOT flag a class that is used in markup but has no definition in the diff CSS files. A class may be defined in non-diff CSS files, in a design system, or via a variant pattern — absence from the diff CSS is not an error. Only flag the opposite direction: defined in CSS diff → not used anywhere in markup diff.

#### Step 3c — Reserved appearance name collisions [SKIPPED — disabled]

#### Step 3d — Evaluate all CSS classes for variant consolidation

For every widget collected in Step 3a, evaluate **all** its CSS classes — regardless of whether they follow the `<root-key>-<appearanceName>` naming pattern — to determine if their combined properties are adequately covered by a variant. Never flag based on class names alone.

1. **Collect classes.** Take the full `class="…"` attribute. Exclude Bootstrap-exempt classes. Skip classes whose definition cannot be found anywhere in the project.
2. **Look up CSS properties.** For each remaining class, find its property definitions: check in-scope CSS files first; fall back to `~{grep_in_files}` across `src/main/webapp/**/*.css`.
3. **Merge properties.** Combine all found definitions into a single flat effective style map (last class in `class="…"` wins on conflict).
4. **Check variant eligibility.** Look up the widget's component in `wavemaker-design-system` (`/catalog/theme-components/theme-components-list.md`). If not listed → no finding.
5. **Partition.** Using `/catalog/theme-components/<dir>/supported-css-props.md`, split the effective style map into variant-expressible and non-variant properties. If the variant-expressible set is empty → no finding.
6. **Check coverage.** Look up the existing `variant` attribute value (if present) in the project override file (`src/main/webapp/design-tokens/overrides/components/<dir>/<dir>.json`) and built-in appearances (`/catalog/theme-components/<dir>/token-structure.md`):
   - If the variant's token mapping **fully covers** all variant-expressible properties → **no finding**.
   - If there is **no `variant`**, or the existing variant **does not fully cover** the variant-expressible properties → flag as **Error**. Check all existing variants for a full match first; if one exists suggest reusing it, otherwise propose one new composite variant encoding all variant-expressible properties with token mappings.

Emit **one finding per widget**, never one per class. If the combined variant-expressible properties cannot be expressed as any single variant, do not flag — omit the widget entirely. If the widget was already flagged by Rule 2 for the same classes, omit it here to avoid duplicates.

#### Findings — Severity

- **Error** — widget has CSS classes whose merged variant-expressible properties are not covered by the existing `variant` attribute (or no `variant` is present); suggest a composite variant.
- **Warning** — CSS class defined in diff CSS files but not referenced in any diff markup widget (dead CSS, no effect).

### Custom Project Rules (`agents.md` → code review agent section) [ACTIVE when present]

When the code review agent's section of `src/main/webapp/agents.md` was located successfully in Step 2.5, treat its rules as active additional entries in this catalog. Only that section's content is in scope — instructions addressed to other agents are never treated as review rules.

#### Authoring format

`agents.md` uses plain Markdown, with one section per agent. Inside the code review agent's section, each sub-heading (one level deeper than the section heading) starts one rule. Two optional metadata lines may follow the rule heading — in any order — before the rule body:

```markdown
# Code Review Agent

## No inline styles on widgets

Severity: error
Applies to: \*.html
Widgets must not use the `style="..."` attribute. Use a variant or auto-layout attribute instead.

## Buttons must have a name

Severity: warning
Every wm-button must declare a `name` attribute.

# Some Other Agent

Instructions here belong to a different agent and are ignored by the code review agent.
```

- **`Severity:`** — `error` or `warning`. Defaults to `warning` when absent.
- **`Applies to:`** — a glob or file-type hint (e.g. `*.html`, `*.css`). Defaults to all in-scope files when absent.
- Everything else under the rule heading is the rule body (description, constraint, recommendation).

Parse the extracted section into this structure. Lines that do not follow the `Key: value` pattern on the first two lines after a rule heading are treated as rule body text.

#### Rule Merging & Conflict Resolution

After parsing all custom rules, compare each one against the built-in catalog (Rules 1–5 and any other active built-in rules) by **concern** — the widget type, attribute, CSS property, topic, or scenario the rule addresses.

**Matching criteria (apply when ANY of the following are true):**

- The custom rule targets the same WaveMaker widget(s) as a built-in rule.
- The custom rule restricts or allows the same CSS property/attribute that a built-in rule addresses.
- The custom rule addresses the same higher-level practice (e.g. "layouting strategy", "variant usage", "CSS for styling") as a built-in rule, even if the specific directive differs.

**When overlap is detected:**

1. The **custom rule wins entirely** for the overlapping concern — use its directive and severity.
2. Suppress the conflicting portion of the built-in rule for this review run only. If the built-in rule covers multiple concerns and only part of it overlaps, suppress only the overlapping part; retain the rest.
3. Apply the custom rule's directive and severity for that concern.

**When no overlap is detected:**

Treat the custom rule as an additional active rule and enforce it alongside the built-in rules.

**Diff-scope applies to custom rules in DIFF scope:** in DIFF scope, custom rules follow the same constraint as built-in Rules 2 and 3 — only evaluate widgets and lines that appear in added or modified lines of the diff. In FULL FILE or FULL APPLICATION scope, custom rules evaluate all lines of in-scope files. In all scopes, do not scan files outside the scope set determined in Step 2.

**Stay report-only:** custom rules do not change the report-only constraint of this skill. Never fix or rewrite files.

### Rule 4 — No `<style>` tags in HTML pages [ACTIVE]

Inline `<style>` tags anywhere inside a WaveMaker page HTML file are strictly prohibited. All styling must go through design tokens, component variants, or page/app CSS files.

Flag every occurrence of a `<style>` tag found in any in-scope `.html` markup file as an **Error**.

**Diff scope:** apply only to added or modified lines in the diff — do not flag `<style>` tags on unchanged lines.

**Recommended fix:** move the contents into the page's `.css` file (or `app.css`), then evaluate whether those styles should instead be expressed as variants or auto-layout attributes per Rules 2 and 3.

## Output — Review Comments

Output is tables only. No text before, between, or after the tables. No summary, no footer, no explanation.

**Exhaustiveness — mandatory:** List **every** occurrence of each issue across all in-scope files. Never truncate, sample, stop early, or write "and N more". One table row per occurrence, no exceptions.

**Table format — two sections:**

Emit findings in two clearly separated sections. Each section contains one or more `###`-headed tables grouped by issue type. Omit a section entirely if it has no findings.

**Section 1 — Layout & CSS Issues** (Rules 1, 2, and 4): findings from deprecated grid widgets (Rule 1a), inconsistent autolayout attributes — missing `direction` when other layout attributes are present (Rule 1b), invalid attribute names (Rule 1c), invalid attribute values (Rule 1d), CSS-for-layouting (Rule 2), and inline `<style>` tags (Rule 4).

**Section 2 — Variant Issues** (Rule 3): findings from missing `variant` attributes, dead CSS classes, and classes consolidatable into a variant. Always in a separate section — never mixed with Section 1 tables.

Use standard markdown table syntax. Emit a `###` heading naming the issue category, then a markdown table listing every widget across all files that shares that issue. Omit a group entirely if it has no findings.

**Column rules:**

- **#** — sequential number, restarting at 1 for each issue group.
- **Widget** — 3 words max. Tag name and `name` value only, no `name=` key: `wm-button "submitBtn"`. Truncate long names with `…`: `wm-container "general_det…"`.
- **Location** — path relative to `src/main/webapp/`, no leading slash. Keep short: `pages/Login/Login.html`. Max 30 chars; truncate middle with `…` if needed.
- **Suggestion** — 5 words max. Fix only: `Use wm-container direction="row"`, `Rename to btn-cta`, `Add variant="cta"`.

**Example output structure:**

```
### Deprecated Grid Layout

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-layoutgrid "grid1"` | `pages/Login/Login.html` | Use `wm-container direction="row"` |
| 2 | `wm-layoutgrid "grid2"` | `pages/Dashboard/Dashboard.html` | Use `wm-container direction="row"` |

### Inconsistent Autolayout Attributes

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-container "card"` | `pages/Dashboard/Dashboard.html` | Add `direction` |

### Invalid Attribute

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-container "row1"` | `pages/Login/Login.html` | `space` → Use `gap` |
| 2 | `wm-container "col1"` | `pages/Login/Login.html` | `align` → Use `alignment` |

### Invalid Attribute Value

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-container "hero"` | `pages/Home/Home.html` | `direction` must be `row` or `column` |
| 2 | `wm-tabpane "tab1"` | `pages/Home/Home.html` | `alignment` must be `start/center/end` when `gap=auto` |

### CSS Used for Layout

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-container "cardWrap"` | `pages/Dashboard/Dashboard.html` | Use `direction="row"` instead |

---

### Missing Variant Attribute

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-button "saveBtn"` | `pages/Login/Login.html` | Add `variant="cta"` |

### Unused Dead Classes

| # | Widget | Location | Suggestion |
| --- | --- | --- | --- |
| 1 | `wm-container "wrapper"` | `pages/General/General.html` | Remove unused class |
```

If there are no findings at all, output nothing.


**Report-only:** custom rules, like built-in rules, are enforced as review comments only — this skill never edits files.
