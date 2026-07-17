---
name: code-review-fix
description: >
  Apply fixes for findings produced by the code-review skill.
  Applies each fix directly; the changes surface in Studio's native changed-files UI
  (preview + apply/reject) for the user to review and accept.
  Use when the user says "fix <issue type> #<n>", "fix <issue type>", "fix <filename>",
  "fix all", "fix this issue", or any equivalent request to resolve code-review findings.
  Loaded on demand by the UI Expert agent.
---

# Code Review Fix — Apply Directly

Apply fixes for one or more code-review findings. Edits are applied immediately and surface in Studio's native changed-files UI (the changed-files panel with a preview button and apply/reject controls) — that is the approval surface. Do not print an in-chat diff and do not ask for textual approval before writing.

---

## Step 0 — Obtain findings

The review output is structured as one `###`-headed markdown table **per issue type**. Each group table has four columns: `# | Widget | Location | Suggestion`. The `#` column restarts at 1 for every group — it is **not** a global row number.

A finding is uniquely identified by the pair **(group heading, #)**. Record:
- **Issue type** — the `###` heading text (e.g. "Deprecated Grid Layout", "CSS Used for Layout", "Missing Variant Attribute").
- **#** — the row number within that group (1-based).
- **Widget** — tag name + quoted name, may be truncated with `…` (e.g. `wm-container "general_det…"`).
- **Location** — path relative to `src/main/webapp/` (e.g. `pages/Login/Login.html`). Max 30 chars; middle may be truncated.
- **Suggestion** — the concrete fix action (5 words max in the cell; use it as the fix instruction).

There are no Severity, File, Issue, or Source columns — the issue type is fully conveyed by the group heading.

If no review tables are visible in the conversation, load the `code-review` skill and run a review first, then return to this skill with the resulting output.

---

## Step 1 — Resolve scope

Determine which findings to fix from the user's request:

| Request pattern | In-scope findings |
|---|---|
| `fix "<issue type>" #<n>` / `fix <issue type> <n>` / natural language ("fix the 2nd deprecated grid layout") | The row numbered `<n>` under the group whose heading matches `<issue type>` |
| `fix "<issue type>"` / `fix <issue type>` (no number) | All rows in the matching group |
| `fix <filename>` | All rows in any group whose Location column ends with or matches `<filename>` |
| `fix all` | Every row in every group |
| `fix this` / `fix this issue` | The single most-recently discussed finding; if ambiguous, ask "Which issue — group name and row number?" before proceeding |

Match group headings on **meaning**, not exact wording (e.g. "deprecated grid", "grid layout", "wm-layoutgrid" all resolve to the "Deprecated Grid Layout" group).

Collect the in-scope findings as a working list of (issue type, #, Widget, Location, Suggestion) tuples. If the list is empty (no match found), report that and stop.

---

## Step 2 — Read current state of affected files

For every unique Location in the working list, derive the full project path by prefixing `src/main/webapp/`:

- `pages/Login/Login.html` → `src/main/webapp/pages/Login/Login.html`
- `pages/Login/Login.css` → `src/main/webapp/pages/Login/Login.css`

Then for each affected file:

1. Call `ui_getPageStructure` **(Required Args)** on the page to get the real component names. Because Widget names in the table may be truncated (ending in `…`), match the truncated prefix against the actual names returned by `ui_getPageStructure` — do **not** use string-exact match on the truncated value.
2. Read the full file directly:
   - Markup: `src/main/webapp/pages/<PageName>/<PageName>.html`
   - CSS: `src/main/webapp/pages/<PageName>/<PageName>.css` or `src/main/webapp/app.css`
   - Variables: `src/main/webapp/pages/<PageName>/<PageName>.variables.json`
   - Token overrides: `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json`

---

## Step 3 — Build the corrected code

Map the **group heading** (issue type) to the appropriate rule and skill. Use the **Suggestion** cell as the specific fix instruction. Follow WaveMaker best practices exactly as the generator skills enforce them.

### Group heading → Rule mapping

| Group heading (match by meaning) | Rule | Skills to load |
|---|---|---|
| Deprecated / legacy grid layout; wm-layoutgrid | Rule 1 | `containerPatternDesign` |
| CSS used for layout; layout in page/app CSS | Rule 2 — layout path | `containerPatternDesign` |
| CSS should be variant; visual CSS in page/app CSS | Rule 2 — variant path | `wavemaker-design-system` |
| Missing variant attribute; class without variant | Rule 3 — missing variant | `markup`, `component_metadata` |
| Reserved appearance name; reserved class name | Rule 3 — reserved name | `markup`, `component_metadata` |
| Unused / dead / dangling class | Rule 3 — dangling class | `markup`, `component_metadata` |
| Any other heading (custom rule) | Custom | Apply per Suggestion; use the skill that matches the change type |

### Rule 1 — deprecated grid → auto-layout

Load `containerPatternDesign`. Replace `wm-layoutgrid` / `wm-gridrow` / `wm-gridcolumn` clusters with `wm-container direction="row|column"` and child `width` props:
- Equal columns: `width="50%"` (2-col), `width="33%"` (3-col), `width="25%"` (4-col)
- Unequal split: `width="240px"` + `width="fill"`, or `width="30%"` + `width="70%"`
- Auto-layout containers always carry `name`, `class`, `variant`, `direction`, `gap`, `alignment`, `width`, `height`.
- Layout-only containers: `class="app-container-default" variant="default"`.
- **NEVER** produce `wm-layoutgrid`, `wm-gridrow`, or `wm-gridcolumn` in the fix output.

### Rule 2 — layout path (CSS-for-layouting)

Load `containerPatternDesign`. Remove the CSS class from the file and replace with equivalent auto-layout attributes on the host `wm-container` (same mapping as Rule 1).

### Rule 2 — variant path (CSS-should-be-variant)

Load `wavemaker-design-system`. Read `/catalog/theme-components/<component>/token-structure.md` for valid token keys. Check the project override at `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` — reuse an existing appearance if it fully matches; otherwise create a new one. Apply `class="<prefix>-<appearance>" variant="<appearance>"` on the widget and remove the CSS class from page/app CSS. Only residual non-variant-expressible properties stay in page CSS.

### Rule 3 — missing variant attribute

Load `markup` and `component_metadata`. Add `variant="<appearance>"` to the widget. The appearance name is the part after the prefix dash (e.g. `btn-cta` → `variant="cta"`).

### Rule 3 — reserved appearance name

Load `markup` and `component_metadata`. Rename both the `class` attribute and the corresponding token override key to a non-reserved name (e.g. `btn-primary` → `btn-main-action`). Update `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` accordingly.

### Rule 3 — dangling/dead class

Load `markup` and `component_metadata`. Remove the dangling class name from the widget's `class` attribute.

---

## Step 4 — Apply directly

Apply the in-scope fixes immediately. Do not print an in-chat diff or ask for textual confirmation first — the changes land as pending checkpoints in Studio's native changed-files UI where the user can preview, apply, or reject each change.

**For markup changes:**
1. Call `ui_getPageStructure` **(Required Args)** on the affected page to confirm component names are still current.
2. Call `ui_applyChangesOnPageMarkup` **(Required Args)** with the exact corrected markup from Step 3. Consolidate all markup changes for the same page into a single call.

**For token / CSS / JS file changes:**
- Use `write_file` with the fully merged file content (preserve all existing content; append or replace only the specific keys/rules that changed).
- For CSS: remove only the specific class definitions that were replaced; leave all other rules intact.
- For token JSON: merge the new/updated appearance into the existing file — never overwrite unrelated appearances.

**For variable changes:**
- Use `wm_variables` with `project_root` and `page_name` and only the new variables to add. Never pass existing variables as `new_variables`.

**Apply order (when a finding touches multiple artifact types):** token/CSS first → markup second → variables last. This ensures variant tokens exist before markup references them.

---

## Step 5 — Summarize

After all writes complete, emit a concise summary:

- List each changed file (one line each).
- One line per fixed finding: `<issue type> #<n>` → brief description of what changed.
- Tell the user: "You can preview and apply (or reject) the changes from the **Changed Files** panel in Studio. Re-run 'review my changes' afterward to confirm no further issues remain."

If any apply step failed (tool returned an error), report the failure immediately, list which findings applied and which did not (by issue type + #), and stop. Do not retry silently.
