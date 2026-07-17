---
name: screenshot_validation_and_completion
description: Validate the generated page structure and visual output against the reference screenshot. Use as the final gate before declaring a screenshot-driven page task complete.
---

# Skill: Screenshot Validation and Completion Gates

## Objective
Complete page generation only when structural and visual fidelity checks pass.

## Pixel-Perfect Contract (Image Input)
- For image/screenshot-driven generation, the default target is pixel-perfect output.
- `MATCH` means no visible deviation at normal zoom and strict numeric tolerance for measurable properties.
- `PARTIAL` is not acceptable for final completion unless user explicitly accepts known gaps.

## Screenshot Authority
- Screenshot is the source of truth.
- Priority:
  1. Screenshot
  2. Corrected layout analysis
  3. Generated markup
- If layout analysis conflicts with screenshot, correct layout analysis first, then regenerate markup.

## Mandatory Validation Sequence
1. Run screenshot validation with **ui_getPageScreenshot** (Required Args).
2. Structural comparison must run before visual comparison.
3. Final screenshot capture after consolidated fixes.
- Maximum screenshot captures in this flow: 2.

## Structural Checks (Mandatory)
- Row count match
- Column count per row match
- Width ratio per row match
- Host-region ratio match (header/top-nav/footer heights, left/right panel vs content widths, where applicable)
- **Layout host span identification (mandatory when header or left panel is present):**
  - Header spans full viewport width (including over sidebar) -> place `wm-header` before `wm-content`.
  - Header starts at sidebar's right edge -> place `wm-header` inside `wm-content`.
  - Sidebar starts at y=0 -> set `navheight="full"` and place `wm-left-panel` before `wm-content`.
  - Sidebar starts below header -> set `navheight="clipped"` and place `wm-left-panel` inside `wm-content`.
  - Treat any mutual-exclusion violation as **Critical**.
- Row/column content placement match
- Grouping vs separation behavior match
- Expected vs current must be recorded per row
- Expected vs current must be recorded for host-region proportions as applicable
- Intra-component layout contract match (LEFT content, RIGHT content, and alignment mechanism for list items/cards/table rows/compound components)
- Width ratio comparison must be explicit and numeric (do not rely on visual approximation only).
- Do not treat `width="fill"` on sibling columns as proof of equal ratio.
- For expected equal/explicit ratios, verify explicit width representation in markup (`%`/fixed values or metadata-supported equivalent), then verify rendered output.
- If ratio mismatch is detected (for example expected `1:1`, rendered/markup effective `20:80`), classify as `Critical`.

### Alignment Property Checks (Mandatory)
- **Page-centering verification:** For each section or container that is visually centered on the page in the reference screenshot, verify the rendered output uses the correct centering mechanism — a constrained-width container with `margin: 0 auto` (or equivalent). Flex centering of children alone is not a substitute for container-level page centering. Classify as `Critical` if the centering mechanism is wrong or absent.
- **Text-align vs flex-align distinction:** For every heading, label, or paragraph that is center-aligned in the reference screenshot, verify BOTH independently in the rendered output:
  1. The parent flex container has the correct `justify-content` value.
  2. The text element itself has `text-align: center`. These are independent — one does not imply the other.
  - Classify as `Critical` if `text-align` is missing when center-alignment is clearly visible in the reference screenshot.
- **Alignment property correctness:** For every button or CTA centered on the page, verify whether centering is achieved via the parent container's flex alignment, a centered wrapper, or both — and confirm the rendered output matches that exact mechanism.

### Viewport Overflow Detection (Mandatory)
- After screenshot capture, scan the rendered output for any text or element that is visually clipped or cut off at the viewport or container boundary.
- Any detected clipping = `Critical` failure. Do not mark complete.
- A heading or text block clipped at the right viewport edge is a definitive signal that the container width or alignment mechanism is wrong and must be corrected before completion.

## Intra-Component Layout Contract

For every container, list template, card, or compound component visible in the screenshot, extract and record the following named, measurable layout properties before comparing against the generated output:

| Property | What to Measure | Example Values |
|---|---|---|
| Child group alignment | How child items are aligned within the parent | `left`, `center`, `right`, `space-between` |
| Gap between siblings | Space between adjacent child items | `0px`, `8px`, `16px`, `tight`, `loose` |
| Padding inset | Internal spacing from the component boundary to its content | `0px`, `8px 16px`, `tight`, `none` |
| Content distribution | How children fill available space | `fill`, `fixed`, `hug` |
| Axis direction | Primary layout direction | `horizontal`, `vertical` |

**Rules:**
- Record expected values from the screenshot before checking the generated output.
- Compare expected vs actual for each property — do not rely on visual approximation alone.
- A mismatch in alignment, gap, or padding is a **critical structural difference** when it causes visible misplacement.
- For repeated components (cards, list rows, table rows), validate at least one representative item plus any variant (e.g. first/last, selected/default).
- This check is mandatory when the screenshot contains any of: lists, cards, tables, nav items, form rows, or multi-column containers.

## Visual Presence Rule
- Markup presence is not enough.
- An element must be visibly rendered and correctly positioned in the screenshot output.
- If present in markup but not visible/aligned in render, treat as critical.
- Validate presence/placement of key components (charts, tables, cards, filters, nav components) from screenshot.

### Explicit Markup-to-Visual Verification (Mandatory)
- For every component present in the generated markup, explicitly confirm it is **visibly rendered** in the output screenshot.
- Do not infer or assume a component is present based on markup alone — visually locate it in the screenshot.
- Do not exempt components on the assumption they are "hidden by default". If a component is in the markup and is not intentionally hidden by explicit user requirement, it must be visible in the output.
- If a component exists in markup but cannot be located visually in the output screenshot, classify as `Critical` and investigate the root cause (wrong placement, zero size, overflow hidden, color blending with background, etc.) before marking complete.

## Component Color Verification (Mandatory)
For every component rendered in the output screenshot, explicitly verify its colors against the reference screenshot. Do not skip any visible component.

For each component, check and record all applicable color properties:

| Color Property | What to Check | Classify as |
|---|---|---|
| Background color | Container, section, card, header, sidebar background fill | `Critical` if wrong |
| Text color | Heading, label, paragraph, link, badge text color | `Critical` if wrong |
| Button background | Fill color of primary, secondary, ghost buttons | `Critical` if wrong |
| Button text color | Text/icon color inside buttons | `Critical` if wrong |
| Border color | Component borders, dividers, outlines | Minor if subtle, `Critical` if clearly wrong |
| Icon color | Icon fill or stroke color | `Critical` if clearly wrong |
| Gradient | Gradient direction, start color, end color | `Critical` if wrong |
| Overlay/tint | Semi-transparent overlays on images or sections | `Critical` if wrong |
| Badge/chip color | Background and text color of status chips, tags | `Critical` if wrong |
| Active/selected state color | Highlighted nav items, selected tabs, active cards | `Critical` if wrong |

Rules:
- Check colors on **every visible component**, not only layout-level containers. This includes buttons, labels, icons, cards, nav items, badges, and input fields.
- Do not assume a color is correct because the component type is correct. Verify the actual rendered color against the reference.
- For gradient backgrounds, verify both the start and end color, and the direction, match the reference screenshot.
- Color mismatch on text is always `Critical` — never treat it as cosmetic.
- Color delta tolerance for `match_screenshot`: exact token/hex match or visually indistinguishable equivalent.

### Color Mismatch Fix Strategy (Mandatory)
When a color mismatch is detected, fix it in this order:
1. Check if an existing variant on the component already expresses the correct color — if yes, apply that variant.
2. If no existing variant matches, create a new variant on the component with the correct color token(s).
3. Update an existing variant only if it is safe to change without affecting other usages of that variant.
4. Page CSS is not allowed as a fix for color mismatches — always resolve through variants.

## Quantitative Visual Checks
- Component dimensions and variance
- Color comparison (hex/tolerance-based) — see Component Color Verification above for per-component color rules
- Positioning and alignment behavior (`gap="auto"` vs numeric gaps, container direction)
- Spacing and padding/margin differences
- Icon/action placement relative to container edges
- Gap type validation: confirm fixed vs `auto` gap behavior matches screenshot intent.
- Recommended strict tolerances for `match_screenshot`:
  - Position delta: <= 1 px
  - Dimension delta: <= 1 px
  - Spacing delta (margin/padding/gap): <= 1 px
  - Border radius delta: <= 1 px
  - Font size delta: <= 1 px
  - Color delta: exact token/hex match or visually indistinguishable equivalent

## Visual Analysis Fix Scope
Validate and fix all of the following:
- layout alignment,
- spacing/padding,
- gap consistency between adjacent components/containers (MANDATORY, must be fixed for good look and feel),
- typography,
- colors,
- borders/radius,
- icon sizing,
- component hierarchy.

Fix order:
1. reuse/adjust tokens,
2. update variants,
3. adjust component properties (margin/padding/size),
4. page CSS as last resort only, and only when BOTH are true:
   - the CSS property is not listed in `unsupportedPageCssProps` for that component
   - the style cannot be expressed through any token or variant key

## Mandatory Diff Checklist (Per Section)
For each section, explicitly report one status: `MATCH` | `PARTIAL` | `MISMATCH`.
- Enumerate sections from screenshot intent first (for example header, left nav, KPI group, list, table, chart, form, footer).
- For each detected section, verify and report:
  - layout structure and alignment
  - content presence and order (text/icons/actions)
  - component-specific visuals (background, typography, borders, shadows, iconography)
  - spacing and padding
  - interactive/state visuals where applicable (active/sort/selected/hover-like intent)
  - data binding correctness (no unintended hardcoded values where bindings are expected)
- For repeated components (cards/list rows/table rows), validate representative item pattern plus notable variants.
- If the page has host regions (header/left/right/top/footer), include them as separate checklist entries.

### Gap rule:
- Any visual gap/alignment mismatch must be fixed before completion.
- Create a detailed difference list from the single screenshot comparison (include each layout/styling mismatch explicitly).
- Classify differences as:
  - critical structural differences (row/column/count/placement/alignment),
  - minor visual differences (style/spacing/typography/colors).
- Apply all required fixes from that difference list in one consolidated pass.
- Do not perform iterative screenshot-compare/fix loops.
- Do not split fixes into multiple save calls; complete fixes with one consolidated update flow.
- Completion gate: do not mark task complete while any critical structural difference remains.

## Difference Matrix and Fix Policy
- Build matrix for major UI elements (cards/charts/tables/headers).
- Use an element-by-element comparison matrix format:
  - `Element A | Element B | Expected | Actual | Delta | Status`
- Classify issues:
  - Critical: structure/alignment/placement
  - Minor: spacing/typography/color variance
- Fix all critical issues before completion in one consolidated pass.
- Do not run iterative screenshot-fix loops.
- Fix priority order:
  1. structure/markup ratio corrections (row/column widths and distribution)
  2. tokens
  3. variants
  4. component properties
  5. page CSS last resort only. Each page CSS entry must name the component and property and confirm BOTH:
     - property is not in `unsupportedPageCssProps`
     - style cannot be expressed via token or variant key
- Confidence scores (for example `95% match`) are forbidden unless every mandatory checklist item is explicitly resolved.
- Any checklist item with `MISMATCH` or `PARTIAL` must be fixed before completion, unless explicitly accepted as known gap.
- Do not use soft language such as "close enough", "near-exact", or "best effort" for `match_screenshot` completion decisions.

## Output Contract
- Report validation result in a compact structure:
  - `Structure: PASS|FAIL`
  - `Visual Fidelity: PASS|MINOR_DIFF|FAIL`
  - `Issues: <list>`

## Validation Agent Directive (Screenshot-to-Page)
Going forward, for screenshot-to-page tasks, the validation agent must:
- Compare every visible component, not only layout structure.
- Treat text color mismatches as `Critical` (not cosmetic).
- Treat broken image rendering as `Critical` (not acceptable).
- Verify each applied variant produces the expected visual result before sign-off.
- Never declare completion until the difference matrix reports zero `Critical` issues and zero notable visual gaps.

## Completion Gate
- Do not mark complete with any unresolved critical structural/visual mismatch.
- After style fixes, re-check structure stability to ensure no accidental layout drift.
- For any failed width-ratio check, completion is blocked until markup-level ratios are corrected and revalidated.
- This blocking rule applies to both `wm-page-content` grid ratios and layout host-region ratios.
- Validation PASS is not allowed unless the intra-component layout contract is verified and matched.

## User Satisfaction Check and Refinement Loop

After all internal validation checks pass and the page is provisionally complete, present the result to the user and explicitly ask for feedback before declaring final completion.

### Mandatory Satisfaction Prompt
Once the page is ready, ask the user exactly one question in chat:

> "The page has been generated. Are you happy with the output, or would you like me to refine it further?"

- Do not declare the task complete until the user responds.
- Do not skip this prompt even if the internal validation result is `PASS`.

### On User Acceptance
If the user confirms they are satisfied (e.g., "looks good", "yes", "happy with it"):
- Mark the task as complete.
- No further screenshot capture or validation is needed.

### On User Dissatisfaction (Refinement Pass)
If the user is not satisfied or requests changes (e.g., "not quite", "fix X", "refine it"):
1. Ask the user to describe what is wrong or what they want changed, if they have not already.
2. Apply the requested changes.
3. Re-run the full **Mandatory Validation Sequence** (capture screenshot → structural comparison → visual comparison → fix pass) as defined above.
4. After the refinement pass, present the updated output and ask the satisfaction prompt again.

### Refinement Loop Limits
- Maximum refinement iterations: **3**.
- After 3 refinement passes, if the user is still not satisfied, surface a summary of remaining known gaps and ask the user whether to continue or accept the current state as a known limitation.
- Do not silently loop — every refinement pass must be preceded by a user-described concern and followed by the satisfaction prompt.

### Refinement Scope
- Treat the user's description of dissatisfaction as the new reference intent.
- If the user points to a specific area, run targeted structural and visual checks on that area in addition to the full checklist.
- All fix-order rules and completion-gate rules from this skill still apply during refinement passes.
