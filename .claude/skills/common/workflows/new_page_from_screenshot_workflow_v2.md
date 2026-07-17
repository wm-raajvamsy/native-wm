---
name: new_page_from_screenshot_workflow_v2
description: "Complete workflow for creating a new WaveMaker page from a screenshot or image. Provides the full execution plan and skill assignments. Trigger when the user provides an image/screenshot and asks to create a page. Fill in {pageName} and {imageFileName} from the user request before executing."
---

# New Page Creation from Screenshot Workflow

## When to Use

When the user provides an image or screenshot and asks to create a new WaveMaker page. Examples:

- "Create this page from screenshot"
- "Build a dashboard matching this UI image"
- "Generate a page from this mock"
- "Replicate this layout exactly"

---

## Task Sequence

> When showing the plan to the user, display top-level task names only — no sub-tasks or implementation detail.

**After each task, output exactly one line:** `Task N complete.` — nothing else. No step breakdowns, no lists of what was created, no markup summaries. Silence is better than detail.

### Task 1 — Analyze + Create Page Skeleton

**Skill:** `wavemaker-ui`
**Load skills:** `new_page_layout_structure_from_screenshot`, `page_management`, `markup`, `component_metadata`

**Input:**

- `{imageFileName}` — image file name (read via `platform_getSessionResource`)
- `{pageName}` — page name

**Output:**

- Page skeleton created
- Any layout host partials created (header, leftnav, etc.) must be linked to the page immediately — do not defer linking to a later task
- Internal manifest: identify all partials and the page-content unit — keep this in context only, do not print it
- Proceed immediately to Task 2 without printing any analysis, summary, or manifest to the user

---

### Task 2 — Generate Content (Parallel)

**Skill:** `wavemaker-ui` _(image and context already loaded from Task 1 — do not re-read)_
**Load skills:** `wavemaker-design-system`, `variables`

**Input from Task 1:** parallel work manifest (page-content + all partials)

Execute in this order:

**Step A — Identify and create all variables (before any markup):**

- Scan every data-dependent component across page-content and all partials to produce a complete variable list (name, type, scope, data source).
- Create all identified variables simultaneously in parallel — do not create them one at a time.
- Do not start Step B until all variables are confirmed created.

**Step B — Identify and create tokens + variants (before any markup):**

- Scan the image and all units to identify every required design token (colors, spacing, typography) and component variant (custom style classes).
- Create all tokens and variants simultaneously in parallel — do not create them one at a time.
- Record the produced variant class names for use in Step C.
- Do not start markup generation until all tokens and variants are confirmed created.

**Step C — Generate and save markup for all units in parallel:**

- Generate markup for page-content and all partials one by one.
- Apply the variant class names produced in Step B directly on the relevant widgets as the markup is written — do not add styling as a post-step.
- For any newly created layout host partial, also add it to the page as part of this same step so it is linked and rendered.
- Each unit must have widgets, bindings, and variant/token usage **co-generated together**.

---

### Task 3 — Visual Verification + Auto-Fix

**Skill:** `wavemaker-ui`

Execute immediately after Task 2 — do not wait for user input.

**Pre-validation setup (before loading skill):**

1. Re-read the reference image using `platform_getSessionResource` with `{imageFileName}`.
2. Capture a screenshot of the generated page using `ui_getPageScreenshot`.

**Load skill:** `screenshot_validation_and_completion` — this skill owns all validation and fix steps for this task. Follow it exactly. Use the re-read reference image and the captured screenshot as inputs to the comparison.

**Fix rule:** Apply all identified fixes in one single consolidated pass. Do not take another screenshot after fixing. Do not re-run validation. No iterative fix loops.

---

### Optional Task 4 — JavaScript / Event Logic

**Skill:** `wavemaker-ui`
**Condition:** Execute only if the user explicitly requests interactions or business logic after Task 3 is complete

---

## Split-Left Detection Rule (Mandatory — apply during Task 1 layout analysis)

After reading the screenshot, inspect the left region and count how many distinct vertical sub-columns are visible side by side.

**If the left region contains only one sub-column:** proceed with normal host classification.

**If the left region contains two or more distinct vertical sub-columns visible simultaneously:**
- The leftmost sub-column → `wm-left-panel`. Apply the host classification gate only to this sub-column to confirm it qualifies. Use its actual visual width from the image to set `columnwidth` or `width`.
- Each additional sub-column → a `wm-container` placed as an ordered child inside `wm-page-content`, in the same left-to-right sequence seen in the image. Assign each a fixed `width` derived from the image. These containers are always visible — no `show` binding.
- The remaining page area after all sidebar sub-columns → `width="fill"` inside `wm-page-content`.
- Never create a second `wm-left-panel` — only one layout-host left panel is supported.
- Never omit a sub-column that is visible in the image — every sub-column must be generated.
- Record the split in the layout contract: `Left region: <N> sub-columns | sub-col-1 (wm-left-panel) | sub-col-2 (wm-container, fixed width) | ... | main content (fill)`

## Left Panel and Page Content Column Width Assignment (Mandatory — apply during Task 1 layout analysis)

`wm-left-panel` and `wm-page-content` share a 12-column grid via their `columnwidth` attributes. Do not use default values — derive both from the visual proportions in the screenshot.

**Step 1 — Estimate the left panel's share of the total page width from the image.**
- Narrow icon-only rail (≈ 4–6 % of page width) → `columnwidth="1"` on `wm-left-panel`, `columnwidth="11"` on `wm-page-content`
- Compact sidebar (≈ 15–20 %) → `columnwidth="2"` / `columnwidth="10"`
- Standard sidebar (≈ 20–25 %) → `columnwidth="3"` / `columnwidth="9"`
- Wide sidebar (≈ 30 %) → `columnwidth="4"` / `columnwidth="8"`
- The two values must always sum to 12.

**Step 2 — When `columnwidth` alone cannot express the required proportion** (for example a very narrow rail that does not align to a whole column), set an explicit pixel or percentage `width` on `wm-left-panel` instead and let `wm-page-content` use `width="fill"` to take the remaining space. Drop `columnwidth` from both in this case.

**Step 3 — Record the chosen values in the layout contract:**
`Left panel: columnwidth=<N> | Page content: columnwidth=<12-N>` (or `width=<px> / fill` if step 2 applies).

**Step 4 — Checkpoint before save:** verify that the encoded `columnwidth` (or `width`) values visually reproduce the proportions seen in the screenshot. Treat any mismatch as a ratio-lock failure and fix before saving.

## Standing Rules

**Fidelity default:** `match_screenshot` (pixel-perfect). Switch to `maintain_brand` only on explicit user instruction.
