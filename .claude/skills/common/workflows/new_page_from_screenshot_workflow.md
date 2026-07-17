---
name: new_page_from_screenshot_workflow
description: "Complete workflow for creating a new WaveMaker page from a screenshot or image. Delegates to the Screenshot to Code agent which handles the full pipeline. Trigger when the user provides an image/screenshot and asks to create a page. Fill in {pageName} and {imageFileName} from the user request before executing."
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

> Single-task workflow — delegate entirely to the Screenshot to Code agent.

### Task 1 — Generate Page from Screenshot
**Agent:** `wm_screenshot_to_code_agent`

**Input:**
- `{imageFileName}` — raw image file name (do not describe or interpret the image)
- `{pageName}` — page name; if not provided by the user, infer a concise PascalCase name from the image content (e.g. `Dashboard`, `UserProfile`, `OrderList`)

Pass the raw image filename and resolved page name directly. The agent handles its full internal pipeline (layout plan → variables → markup → design tokens → visual verification) in a single session.
