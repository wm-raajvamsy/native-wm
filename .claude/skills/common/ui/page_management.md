---
name: page_management
description: Create, rename, delete, inspect, or update WaveMaker pages and partials. Provides the exact safe workflow and tool sequence for page-level changes including host-linked partials.
---

# Skill: Page Management

## Objective
Manage WaveMaker pages and partials safely: create, inspect, rename, and delete pages.

## Page Types
- `Page`: full page container (`wm-page`) with `wm-page-content` and optional layout hosts.
- `Partial`: reusable fragment with root `wm-partial`; no nested `wm-page` or nested `wm-partial`.
- `Layout host regions` (inside pages): `wm-header`, `wm-footer`, `wm-left-panel`, `wm-right-panel`, `wm-top-nav`.

## Page vs Partial vs Layout Host Rules
- If page or partial target name is not provided for new page creation, ask user.
- Always start by reading `src/main/webapp/pages/pages-config.json` to confirm target existence and avoid duplicates. **Never write to this file.**
- If a layout host has `content="<partialName>"`, update that linked partial only.
- Donot delete or rename "Common" page or donot make any changes to the "Common" page content

## Layout Host Placement — Identify Before Generating Markup

Before placing `wm-header` or `wm-left-panel` in the page markup, identify the visual span of each layout host. This determines their exact position in the page structure.

### Identify Header Width

Is the header **full-width** (spans the entire viewport, including over any sidebar column) or **content-column-only** (starts at the right edge of the sidebar)?

```
Full-width header:
  → wm-header is a direct child of wm-page, BEFORE wm-content
  → applies when: no left panel present, OR left panel uses navheight="clipped"

  wm-page
    wm-header                              ← full-width, before wm-content
    wm-content
      [wm-left-panel navheight="clipped"]  ← optional
      wm-page-content

Content-column-only header (header beside the left panel):
  → wm-header is INSIDE wm-content
  → applies only when left panel uses navheight="full"

  wm-page
    wm-left-panel  navheight="full"        ← before wm-content
    wm-content
      wm-header                            ← inside wm-content, beside the panel
      wm-page-content
```

**Screenshot signal:** Header background stretches edge-to-edge across the full viewport → full-width → before `wm-content`. Header background starts at the sidebar's right edge (sidebar extends behind the header row) → content-column-only → inside `wm-content`. Header is a rounded pill/capsule shape that does not touch the viewport edges (page background visible on both sides) → pill/floating header → `wm-header` before `wm-content` with transparent background; the visual styling (shape, shadow, spacing) lives on the root container of the header partial, not on the `wm-header` host itself.

### Identify Sidebar Height

Is the left panel **full-height** (spans the full viewport height, extending behind the header row) or **clipped** (starts below the header)?

```
Full-height sidebar:
  → navheight="full"
  → wm-left-panel is a direct child of wm-page, BEFORE wm-content
  → wm-header must be INSIDE wm-content (beside the panel)

  wm-page
    wm-left-panel  navheight="full"        ← before wm-content
    wm-content
      wm-header                            ← inside wm-content
      wm-page-content

Clipped sidebar:
  → navheight="clipped"
  → wm-left-panel is INSIDE wm-content
  → wm-header must be on wm-page, BEFORE wm-content

  wm-page
    wm-header                              ← before wm-content, full-width
    wm-content
      wm-left-panel  navheight="clipped"
      wm-page-content
```

**Screenshot signal:** Sidebar background runs from the very top of the viewport (beside or behind the header) → full-height → `navheight="full"`, panel before `wm-content`. Sidebar background starts below the header → clipped → `navheight="clipped"`, panel inside `wm-content`.

> These two are mutually exclusive — **both cannot be full at the same time** (they would overlap). Examine the screenshot carefully: if the sidebar reaches the top edge of the viewport, the header is NOT full-width; if the header reaches the left edge, the sidebar is NOT full-height. Full-height sidebar → header inside `wm-content`. Clipped sidebar → header before `wm-content`.

## Page CRUD Operations
1. List pages/partials:
   - Read `src/main/webapp/pages/pages-config.json` (Never write to this file)
2. Create page/partial:
   - **platform_createWebPage** (Required Args)
   - When creating layout pages, pass required layout types explicitly (`HEADER`, `LEFTNAV`, `RIGHTNAV`, `FOOTER`, `TOPNAV`).
   - After creating a **page**, a navigation action gets created for the page (e.g. `goToPage_<PAGE_NAME>`); NOT FOR PARTIAL PAGE.
3. Rename page/partial:
   - **platform_renamePage** (Required Args)
4. Delete page/partial:
   - **platform_deletePage** (Required Args)

## Page Markup Management
- Inspect hierarchy with **ui_getPageStructure** (Required Args).
- To read full page markup/content, read directly from the filesystem:
  - Markup: `src/main/webapp/pages/{pageName}/{pageName}.html`
  - Script: `src/main/webapp/pages/{pageName}/{pageName}.js`
  - Variables: `src/main/webapp/pages/{pageName}/{pageName}.variables.json`
  - CSS: `src/main/webapp/pages/{pageName}/{pageName}.css`

## Page Params and Partial Params
- Load skill `pageParams` to know regarding page params and partial params.

## Scope Hierarchy for App and Page

```
Scope
├── App
│   ├── Variables
│   └── Actions
└── Page
    ├── Variables
    ├── Actions
    └── Widgets
        ├── <widgetName>
        │   └── <field>
        └── <containerName> (Container bound to Partial)
            └── Widgets
                └── <widgetNameInsidePartial>
                    └── <field>
```

## Rename/Delete Safety Checklist
- Confirm correct target name and type (page vs partial) from `src/main/webapp/pages/pages-config.json`.
- Ensure no host `content` references are left broken after rename/delete.
- If deleting a partial used by hosts/containers, update or remove those references first.

## Minimal Workflow
1. Read `src/main/webapp/pages/pages-config.json` → validate target and type.
2. If create: call **platform_createWebPage** (Required Args), then **ui_getPageStructure** (Required Args).
3. If rename/delete: run rename/delete tool, then re-read `src/main/webapp/pages/pages-config.json` to confirm outcome.
4. If page/partial params are required, load skill `pageParams` to know about how to configure and use it.
