---
name: new_page_layout_structure_from_screenshot
description: Analyze a screenshot or image to derive the WaveMaker page layout structure (wm-header, wm-content, wm-left-panel, etc.). Use as the first step when creating a page from a screenshot.
---

# Skill: Layout Hosts and Structure

## Objective
Create new pages with correct WaveMaker host regions and a structurally accurate content grid.

## Required Tools

- **platform_getSessionResource** (Required Args) — Extract and inspect the screenshot image for layout analysis.
- **ui_getPageStructure** (Required Args) — Inspect the current page's existing host regions to determine what is already present vs what needs to be added.

## Analysis Scope Boundary
- Layout analysis/classification is structure-only.
- Do not generate widgets, bindings, variables, styling, or event logic during analysis.

## Host Integrity Rules
- Do not break or reorder layout hosts created by `{{createPage}}`: `wm-header`, `wm-footer`, `wm-left-panel`, `wm-right-panel`.
- `wm-header` and `wm-left-panel` position may only change if required by `navtype`.
- If host has `content="<partialName>"`, update that partial only; do not inject regular components into host markup.
- For global regions in screenshot (header/sidebar/footer), prefer layout hosts over generic containers.
- Hosts must remain outside `wm-page-content`.
- In `wm-page`, keep the host/content hierarchy valid: `wm-header`, `wm-content` (with `wm-left-panel` and `wm-page-content`), `wm-footer` as applicable.

## Mandatory Host Recognition Heuristics
- Top full-width strip -> `wm-header`
- Left vertical region -> `wm-left-panel` ONLY IF ALL of the following are true:
  - Contains navigation links, menu items, or app-level routing elements
  - Content is persistent and identical across multiple pages (global nav behavior)
  - Does NOT contain dynamic or contextual page data (charts, cards, forms, chat, insights, metrics)
  - Visually styled as a nav sidebar (icon+label rows, active state indicators, collapse/expand toggle)
  - If ANY of the above conditions fail -> classify as a content column inside `wm-page-content`
- Right vertical side region -> `wm-right-panel`
- Bottom full-width strip -> `wm-footer`
- Horizontal nav below header -> `wm-top-nav`
- Default assumption: Any side vertical region (left or right) is a content column inside `wm-page-content` UNLESS it has explicit positive evidence of ALL criteria for its corresponding host gate. The burden of proof is on host classification, not on content classification. Ambiguity always resolves to content column, never to layout host.

## Host Classification Gate (Mandatory — run before assigning any layout host)
For each side-region candidate, first determine side: LEFT or RIGHT.

### LEFT candidate gate (`wm-left-panel`)
- Q1: Does it contain navigation links or menu items?        YES / NO
- Q2: Is its content identical/persistent across pages?      YES / NO
- Q3: Is it free of dynamic/contextual page data?            YES / NO
- Q4: Is it styled as a nav sidebar (icons, active states)?  YES / NO

-> `wm-left-panel`: Only if ALL four answers are YES
-> `wm-page-content` column: If ANY answer is NO

### RIGHT candidate gate (`wm-right-panel`)
- Q1: Is it a distinct right-edge side region (not part of the main content grid)? YES / NO
- Q2: Is it persistent or app-level utility/supporting region across views?        YES / NO
- Q3: Is it visually/container-separated from main page-content columns?           YES / NO
- Q4: Is it intended as a host side panel (inspectors/tools/filters/chat/etc.)?    YES / NO

-> `wm-right-panel`: Only if ALL four answers are YES
-> `wm-page-content` column: If ANY answer is NO

## Host Detection and Update Requirement (Mandatory)
- During screenshot analysis, explicitly identify whether each layout host region is present in the image:
  - `wm-header`
  - `wm-left-panel`
  - `wm-right-panel`
  - `wm-top-nav`
  - `wm-footer`
- If a host region is present in the screenshot (for example `wm-header`), first check whether that host component already exists in current page structure.
- For each detected host, resolve its linked partial from `content="<partialName>"`.
- If a detected host is missing in page structure, add/restore the correct layout host first, then target its linked partial.
- If a host is not present in screenshot intent, do not force content generation for that host.

## Layout Analysis Heuristics
- Detect rows from horizontal whitespace, container boundaries, section dividers, and background shifts.
- Detect columns from vertical boundaries, side-by-side grouping, and alignment symmetry.
- Capture repeated groups (for example KPI cards/list items) as grouped content, not isolated fragments.
- Capture nested structures when a column contains stacked or internal sub-sections.
- Validate alignment consistency; misalignment can indicate wrong row/column segmentation.
- Detect full-height spanning elements as primary columns before defining nested rows.
- Treat side panels whose height equals multiple stacked sections on the other side as sibling main columns (not nested siblings).

## Layout Analysis Checklist (Before Markup)
- Identify full-height/full-width spanning regions.
- Count main content rows (excluding nested rows inside a column).
- For each row, count columns and note width ratios.
- For each column, note nested row structure if present.
- Build and validate hierarchy: `row -> columns -> nested rows`.

## Intra-Component Layout Contract (MANDATORY)
For every list item, card, table row, or compound component detected:
- Document LEFT content: [what goes here]
- Document RIGHT content: [what goes here]
- Document alignment mechanism: [space-between / flex-end / absolute / etc.]
- Include this contract in analysis output so downstream generation and validation can verify it.

## Structure Rules for New Page Content
- Build `wm-page-content` scaffolding first:
  - row containers
  - column containers within rows
  - widgets only inside columns
- Treat `wm-page-content` as the container for all main page content except dialogs.
- Do not place widgets directly in row wrappers.
- Do not split main `wm-page-content` into segment partials during new page creation.
- Save `wm-page-content` exactly once in a single consolidated update in a generation cycle.
- Preserve row count, column count, and ratio intent from the layout contract.
- Encode row ratio intent explicitly in markup for each row's column containers (for example via supported `width`/`columnwidth`/flex-distribution attributes from metadata).
- Do not leave sibling column sizing as implicit auto distribution when contract specifies explicit ratios.
- Do not use `width="fill"` as evidence of equal split (for example 1:1 / 50:50). For ratio-locked rows, use explicit widths such as `50%`/`50%`, `20%`/`80%`, or supported fixed values.
- Use `width="fill"` only for true remaining-space scenarios (for example search input filling space next to fixed-size controls).
- Nested containers are allowed only within column containers when layout requires them.
- `navheight` placement rule:
  - `clipped`: panel should be placed in `wm-content` flow.
  - `full`: panel may be page-level host as per layout.
- For native mobile layouts, prefer `wm-mobile-navbar` instead of `wm-header` when platform context requires native mobile host patterns.

## Structure Lock and Stability
- Perform explicit layout analysis before markup generation:
  - total rows
  - column count per row
  - width ratio per row
  - content placement per row/column
- Never generate rows/columns not present in screenshot.
- Never alter the analyzed width ratios during later styling or content updates.
- For each row, maintain a ratio lock record:
  - expected ratio from structure contract
  - current ratio represented in markup attributes
  - status: PASS/FAIL
- After structure checkpoint passes, styling changes must not alter row/column structure.
- Use this contract format:
  - `Total rows: <N>`
  - `Row <i>: <colCount> columns | ratios: <...> | content: <...>`

## Ratio Lock Enforcement (Mandatory)
- Before saving `wm-page-content`, run a structure checkpoint that verifies row/column counts and ratio representation in markup.
- If any row ratio deviates from the contract (for example expected `1:1`, actual effective `20:80`), treat it as a critical structural mismatch and fix markup before save.
- For ratio-locked rows, treat sibling `width="fill"` usage as non-compliant unless metadata explicitly guarantees the required ratio.
- Validation tools and screenshot comparison are not substitutes for ratio encoding in markup; ratios must already be correct in generated markup.

## Host Region Ratio Lock (Mandatory)
- Apply ratio lock rules to layout host regions as well, not only `wm-page-content`.
- When screenshot intent includes host-region width/height proportions (for example left panel vs content, right panel vs content, header/top-nav/footer height proportions), encode those proportions explicitly in host markup using supported metadata attributes.
- If a host is linked via `content="<partialName>"`, enforce ratio lock across host container and linked partial structure as applicable.
- During checkpoints, report expected vs current proportions for:
  - host-to-content distribution
  - host internal row/column ratios (if present)
- Any host-region ratio drift from structure contract is critical and must be corrected before save/finalization.
