---
name: leftPanelPatternDesign
description: Defines few wm-left-panel markup design templates. Generate or update a wm-left-panel partial. Use when a page or screenshot includes wm-left-panel and its partial needs to be created or updated.
---

# Skill: Left Panel / Sidebar Pattern Design

## Context
These are partial-based sidebar designs rendered inside `wm-left-panel` using WaveMaker autolayout.
Every `wm-container` inside the partial must carry all 7 mandatory autolayout attributes:
`name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`.

## wm-left-panel Declaration (page markup)

- **`navheight="full"`** — `wm-left-panel` is a direct child of `wm-page`, **before** `wm-content` (see Pattern 1 / 3).
- **`navheight="clipped"`** — `wm-left-panel` stays **inside** `wm-content`, but **`wm-header` must not be inside `wm-content`**: place `wm-header` on `wm-page`, **above** `wm-content`.

```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <wm-left-panel name="left_panel" navtype="drawer" navheight="clipped"
            columnwidth="2" content="leftnav_partial">
        </wm-left-panel>
        <wm-page-content name="pagecontent" columnwidth="10"></wm-page-content>
    </wm-content>
</wm-page>
```

---

## Sidebar Layout Mechanics Reference

### wm-nav: layout vs type (critical distinction)

```
layout property → controls DIRECTION of items

  layout="stacked"    → items stack VERTICALLY (one above the other)
                        ✔ use in sidebars / left panels
  (omitted/default)   → horizontal
                        ✘ NEVER omit in a sidebar — items will render across, not down

type property → controls ACTIVE-STATE STYLING only (not direction)

  type="pills"        → pill-shaped highlight on active item
  type="tabs"         → underline on active item

Correct sidebar combo:
  <wm-nav type="pills" layout="stacked">  ← vertical items, pill highlight
  <wm-nav type="tabs"  layout="stacked">  ← vertical items, tab underline

Common mistake:
  <wm-nav type="pills">                   ← renders HORIZONTALLY — wrong in a sidebar
  In a sidebar, layout="stacked" is needed to force vertical stacking.
```

### Container direction for sidebar

```
Root sidebar container must use direction="column":
  direction="column" + alignment="top-left"
    → children stack top → bottom, anchored top-left
  height="fill"
    → sidebar stretches to full height of its parent

direction="row" is wrong for a sidebar — brand and nav render side-by-side instead of stacked.
```

### wm-left-panel placement rules

```
navheight="clipped"
  → wm-left-panel INSIDE wm-content (with wm-page-content)
  → wm-header must be a direct child of wm-page, BEFORE wm-content — not inside wm-content
  → panel is clipped to the content band below the header

navheight="full"
  → wm-left-panel is a direct child of wm-page, BEFORE wm-content (not inside wm-content)
  → full viewport height; panel extends beside header and content zones

navtype="rail"
  → always visible, icon-only strip; narrow columnwidth (1–2 cols)
  → partial shows icon buttons without text labels
  → works with either navheight value; navheight controls vertical span/placement, not rail behavior

navtype="drawer"
  → hidden by default; toggled open/closed via a trigger button

animation="slide-in"
  → drawer pushes page content aside when it opens (layout shifts)
animation="slide-over"
  → drawer overlays content without shifting it (content stays full-width)
```

### Sidebar container checklist

```
Root container (mandatory attrs):
  direction="column"    ← stacks brand + nav vertically
  alignment="top-left"  ← anchors content to top-left
  gap="0"               ← sections touch (add padding inside each section)
  width="fill"          ← expands to panel width
  height="fill"         ← stretches full panel height

wm-nav (mandatory pair):
  type="pills"          ← active item styling
  layout="stacked"      ← vertical item direction   ← BOTH always required

Footer pinned to bottom:
  Place an empty wm-container with height="fill" between nav and footer.
  It expands to fill remaining space, pushing the footer to the bottom.
```

### navheight page structure comparison

```
navheight="clipped" (header above content; panel inside wm-content):
  wm-page
    wm-header         ← on wm-page, before wm-content (never inside wm-content)
    wm-content
      wm-left-panel   ← clipped sidebar
      wm-page-content
    wm-footer       ← optional; may follow wm-content, Rule: when header is outside wm-content then place footer also outside wm-content.

navheight="full" (panel before wm-content):
  wm-page
    wm-left-panel     ← before wm-content
    wm-content
      wm-header
      wm-page-content
      wm-footer       ← optional: as header is inside wm-content, footer is also place inside wm-content
```

---

## Pattern 1 — Rail (Icon-Only, Always Visible)

```
┌──┬──────────────────────────────────────┐
│  │  wm-header                           │
│🏠│──────────────────────────────────────│
│📊│                                      │
│📁│   wm-page-content                    │
│⚙ │                                      │
│  │                                      │
└──┴──────────────────────────────────────┘
  ↑ wm-left-panel (direct child of wm-page, before wm-content)
  navtype="rail"  navheight="full"
  always visible, narrow icon strip
  columnwidth="1"
```

**Use for:** Dashboards and tools where screen space matters. Icons alone identify sections; no labels needed. Always present — no toggle needed.

**Page markup:** This full-height rail pattern uses `navheight="full"` with `wm-left-panel` **outside** `wm-content` (sibling before `wm-content`). `navtype="rail"` controls the rail behavior; `navheight` only controls whether the rail spans the full viewport height or is clipped to the content band.

```xml
<wm-page name="mainpage">
    <wm-left-panel name="left_panel" navtype="rail" navheight="full" columnwidth="1" content="leftnav_rail">
    </wm-left-panel>
    <wm-content name="content">
        <wm-header name="wm_header" content="header"></wm-header>
        <wm-page-content name="pagecontent" columnwidth="11"></wm-page-content>
    </wm-content>
</wm-page>
```

With `navheight="full"`, `wm-header` belongs **inside** `wm-content` (the column beside the rail). The “`wm-header` before `wm-content`” rule applies only to **`navheight="clipped"`** patterns (Patterns 2, 4–6).

**Partial: `leftnav_rail`**
```xml
<wm-container name="rail_root" class="app-container-default"
    direction="column" gap="4" alignment="top-left"
    width="fill" height="fill" padding="8px 0">

    <wm-button name="btn_home" caption=""
        iconclass="wi wi-home"
        class="btn-transparent no-border app-header-action">
    </wm-button>

    <wm-button name="btn_dashboard" caption=""
        iconclass="wi wi-grid-on"
        class="btn-transparent no-border app-header-action">
    </wm-button>

    <wm-button name="btn_projects" caption=""
        iconclass="wi wi-folder-open"
        class="btn-transparent no-border app-header-action">
    </wm-button>

    <wm-button name="btn_reports" caption=""
        iconclass="wi wi-bar-chart"
        class="btn-transparent no-border app-header-action">
    </wm-button>

    <wm-button name="btn_settings" caption=""
        iconclass="wi wi-settings"
        class="btn-transparent no-border app-header-action">
    </wm-button>

</wm-container>
```

**Note:** Rail uses `wm-button` (icon-only, no caption) rather than `wm-nav`. Use `wm-nav layout="stacked"` when active-item highlighting is needed; use `wm-button` when the rail is purely a trigger strip.

---

## Pattern 2 — Full Drawer Navigation (Slide-In)

```
┌────────────────────────────────────────────────┐
│ wm-page                                        │
│ ┌── wm-header ───────────────────────────────┐ │
│ │  [☰] AppName                       [👤]   │ │
│ └────────────────────────────────────────────┘ │
│  ┌────── wm-content ──────────────────────────┐│
│  │ ┌── wm-left-panel ──┐ ┌─ wm-page-content ─┐││
│  │ │ [●] Brand         │ │                   │││
│  │ │ ─────────────── ─│ │                   │││
│  │ │  wi-home  Home    │ │   main content    │││
│  │ │  wi-grid  Dashbrd │ │                   │││
│  │ │  wi-folder Projts │ │                   │││
│  │ │  wi-settings Sett │ │                   │││
│  │ └───────────────────┘ └───────────────────┘││
│  └────────────────────────────────────────────┘│
└────────────────────────────────────────────────┘
  navheight="clipped" → wm-header on wm-page; drawer + page body inside wm-content
  navtype="drawer"  animation="slide-in"
  → panel slides in, pushes content right
  → hamburger button in header triggers open/close
```

**Use for:** Apps with many nav sections that benefit from a show/hide panel. Content reflows when panel opens.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <wm-left-panel name="left_panel" navtype="drawer" navheight="clipped"
            columnwidth="2" animation="slide-in" content="leftnav_drawer">
        </wm-left-panel>
        <wm-page-content name="pagecontent" columnwidth="10">
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Partial: `leftnav_drawer`**
```xml
<wm-container name="drawer_root" class="app-container-default"
    direction="column" gap="0" alignment="top-left"
    width="fill" height="fill">

    <wm-container name="sidebar_brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="fill" height="hug" padding="16px 12px">
        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>
        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>
    </wm-container>

    <wm-nav name="drawer_nav" type="pills" layout="stacked" class="app-header-actions">
        <wm-nav-item name="item_home">
            <wm-anchor name="link_home" caption="Home"
                iconclass="wi wi-home" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_dashboard">
            <wm-anchor name="link_dashboard" caption="Dashboard"
                iconclass="wi wi-grid-on" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_projects">
            <wm-anchor name="link_projects" caption="Projects"
                iconclass="wi wi-folder-open" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_settings">
            <wm-anchor name="link_settings" caption="Settings"
                iconclass="wi wi-settings" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
    </wm-nav>

</wm-container>
```

**Key rule:** `type="pills"` + `layout="stacked"` — both required. `type` controls visual style only; `layout` controls direction. Omitting `layout` renders items horizontally.

---

## Pattern 3 — Full-Height Sidebar (Extends Behind Header)

```
┌──────────────────────────────────────────────────┐
│ wm-page                                          │
│ ┌── wm-left-panel ──┐ ┌── wm-content ──────────┐ │
│ │ [●] Brand         │ │ ┌── wm-header ────────┐ │ │
│ │ ─────────────── ─│ │ │  AppName     [👤]   │ │ │
│ │  Home             │ │ └────────────────────┘ │ │
│ │  Dashboard        │ │ ┌── wm-page-content ──┐ │ │
│ │  Projects         │ │ │                    │ │ │
│ │  Reports          │ │ │   main content     │ │ │
│ │  Settings         │ │ │                    │ │ │
│ │                   │ │ └────────────────────┘ │ │
│ └───────────────────┘ └────────────────────────┘ │
└──────────────────────────────────────────────────┘
  navheight="full" → wm-left-panel OUTSIDE wm-content
  sidebar spans full viewport height (beside header + content + footer)
```

**Use for:** Admin panels and productivity apps where the sidebar is equally prominent to the header — not clipped under it.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-left-panel name="left_panel" navtype="rail" navheight="full"
        columnwidth="2" content="leftnav_fullheight">
    </wm-left-panel>
    <wm-content name="content">
        <wm-header name="wm_header" content="header_partial"></wm-header>
        <wm-page-content name="pagecontent" columnwidth="10">
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Partial: `leftnav_fullheight`**
```xml
<wm-container name="fullheight_root" class="app-container-default"
    direction="column" gap="0" alignment="top-left"
    width="fill" height="fill">

    <wm-container name="sidebar_brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="fill" height="hug" padding="16px 12px">
        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>
        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>
    </wm-container>

    <wm-nav name="fullheight_nav" type="pills" layout="stacked" class="app-header-actions">
        <wm-nav-item name="item_home">
            <wm-anchor name="link_home" caption="Home"
                iconclass="wi wi-home" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_dashboard">
            <wm-anchor name="link_dashboard" caption="Dashboard"
                iconclass="wi wi-grid-on" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_projects">
            <wm-anchor name="link_projects" caption="Projects"
                iconclass="wi wi-folder-open" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_reports">
            <wm-anchor name="link_reports" caption="Reports"
                iconclass="wi wi-bar-chart" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_settings">
            <wm-anchor name="link_settings" caption="Settings"
                iconclass="wi wi-settings" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
    </wm-nav>

</wm-container>
```

**Key rules:**
- `navheight="full"` → `wm-left-panel` is a direct child of `wm-page`, **before** `wm-content` — not inside it.
- `navheight="full"` → `wm-header` stays **inside** `wm-content` (beside the full-height panel). For **`navheight="clipped"`**, `wm-header` must be **on** `wm-page` **before** `wm-content` instead.

---

## Pattern 4 — Sidebar with User Profile + Pinned Footer

```
┌── wm-left-panel ──────────────┐
│ ┌──────────────────────────┐  │
│ │  [👤]  John Doe          │  │  ← user profile section
│ │        Admin             │  │
│ └──────────────────────────┘  │
│  ───────────────────────────  │
│  Home                         │  ← nav items
│  Dashboard                    │    (layout="stacked")
│  Projects                     │
│  Analytics                    │
│                               │  ← spacer (height="fill") pushes footer down
│  ───────────────────────────  │
│  Help                         │  ← footer actions pinned to bottom
│  Logout                       │
└───────────────────────────────┘
  Empty wm-container with height="fill" expands between nav and footer,
  pushing footer to the very bottom of the panel.
```

**Use for:** Apps with user context always visible in the sidebar — useful for multi-role or multi-tenant systems. Bottom-pinned logout is a common UX pattern.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <wm-left-panel name="left_panel" navtype="drawer" navheight="clipped"
            columnwidth="2" animation="slide-in" content="leftnav_profile">
        </wm-left-panel>
        <wm-page-content name="pagecontent" columnwidth="10">
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Partial: `leftnav_profile`**
```xml
<wm-container name="profile_root" class="app-container-default"
    direction="column" gap="0" alignment="top-left"
    width="fill" height="fill">

    <!-- User profile at top -->
    <wm-container name="user_profile" class="app-container-default"
        direction="row" gap="10" alignment="middle-left"
        width="fill" height="hug" padding="16px 12px">
        <wm-picture name="user_avatar"
            picturesource="resources/images/avatar.png"
            width="36px" height="36px"
            shape="circle" resizemode="cover">
        </wm-picture>
        <wm-container name="user_info" class="app-container-default"
            direction="column" gap="2" alignment="top-left"
            width="fill" height="hug">
            <wm-label name="user_name" caption="John Doe"
                class="h6">
            </wm-label>
            <wm-label name="user_role" caption="Admin"
                class="text-muted">
            </wm-label>
        </wm-container>
    </wm-container>

    <!-- Main nav -->
    <wm-nav name="profile_nav" type="pills" layout="stacked" class="app-header-actions">
        <wm-nav-item name="item_home">
            <wm-anchor name="link_home" caption="Home"
                iconclass="wi wi-home" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_dashboard">
            <wm-anchor name="link_dashboard" caption="Dashboard"
                iconclass="wi wi-grid-on" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_projects">
            <wm-anchor name="link_projects" caption="Projects"
                iconclass="wi wi-folder-open" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_analytics">
            <wm-anchor name="link_analytics" caption="Analytics"
                iconclass="wi wi-bar-chart" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
    </wm-nav>

    <!-- Spacer: expands to push footer to the bottom -->
    <wm-container name="spacer" class="app-container-default"
        direction="column" gap="0" alignment="top-left"
        width="fill" height="fill">
    </wm-container>

    <!-- Footer actions pinned to bottom -->
    <wm-container name="sidebar_footer" class="app-container-default"
        direction="column" gap="4" alignment="top-left"
        width="fill" height="hug" padding="8px 12px">
        <wm-button name="btn_help" caption="Help"
            iconclass="wi wi-help-outline"
            class="btn-transparent no-border app-header-action">
        </wm-button>
        <wm-button name="btn_logout" caption="Logout"
            iconclass="wi wi-exit-to-app"
            class="btn-transparent no-border app-header-action">
        </wm-button>
    </wm-container>

</wm-container>
```

**Key rule:** The empty spacer `wm-container` with `height="fill"` expands to fill all remaining vertical space, pushing the footer down. This is the autolayout way to pin content to the bottom — no CSS needed.

---

## Pattern 5 — Slide-Over Drawer (Overlay, No Content Shift)

```
Before open:                    After open:
┌──────────────────────────┐   ┌──────────────────────────┐
│ wm-header  [☰]  AppName  │   │ wm-header  [☰]  AppName  │  ← wm-header on wm-page
├──────────────────────────┤   ├──────────────────────────┤
│ wm-content               │   │ wm-content               │
│   wm-page-content        │   │┌ wm-left-panel ┐ page    │
│   (full width)           │   ││ Home, etc.    │ content │
│                          │   │└───────────────┘ (under) │
└──────────────────────────┘   └──────────────────────────┘
  animation="slide-over" → drawer overlays; content stays full-width
  animation="slide-in"   → drawer pushes; content reflows and shrinks
```

**Use for:** Map-heavy UIs, canvas apps, mobile-style apps, or any case where layout reflow on drawer open would be jarring.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <wm-left-panel name="left_panel" navtype="drawer" navheight="clipped"
            columnwidth="2" animation="slide-over" content="leftnav_overlay">
        </wm-left-panel>
        <wm-page-content name="pagecontent" columnwidth="12">
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Partial: `leftnav_overlay`**
```xml
<!-- Right-side border (border-width: 0 1px 0 0, border-color: #e0e0e0) must be applied
     via a component variant or a page CSS class — do NOT use borderwidth/bordercolor as inline props -->
<wm-container name="overlay_root" class="app-container-default container-<variantname>"
    direction="column" gap="0" alignment="top-left"
    width="fill" height="fill"
    backgroundcolor="#ffffff">

    <wm-container name="overlay_brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="fill" height="hug" padding="16px 12px">
        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>
        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>
    </wm-container>

    <wm-nav name="overlay_nav" type="pills" layout="stacked" class="app-header-actions">
        <wm-nav-item name="item_home">
            <wm-anchor name="link_home" caption="Home"
                iconclass="wi wi-home" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_dashboard">
            <wm-anchor name="link_dashboard" caption="Dashboard"
                iconclass="wi wi-grid-on" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_projects">
            <wm-anchor name="link_projects" caption="Projects"
                iconclass="wi wi-folder-open" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
        <wm-nav-item name="item_settings">
            <wm-anchor name="link_settings" caption="Settings"
                iconclass="wi wi-settings" class="app-header-action">
            </wm-anchor>
        </wm-nav-item>
    </wm-nav>

</wm-container>
```

---

## Pattern 6 — Multi-Level Nav (Dataset-Driven)

```
┌── wm-left-panel ──────────────┐
│  Home                         │
│  Dashboard                    │
│  ▶ Projects                   │  ← parent with children array in dataset
│    ├ Active Sprints            │  ← sub-items auto-rendered by wm-nav
│    ├ Backlog                   │
│    └ Archived                  │
│  Reports                      │
│  Settings                     │
└───────────────────────────────┘
  dataset rows with a "children" array auto-generate
  collapsible sub-menus inside wm-nav
```

**Use for:** Large apps with many sections grouped hierarchically. Avoids a flat list of top-level items.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <wm-left-panel name="left_panel" navtype="drawer" navheight="clipped"
            columnwidth="2" animation="slide-in" content="leftnav_multilevel">
        </wm-left-panel>
        <wm-page-content name="pagecontent" columnwidth="10">
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Variable: `NavMenuVar` (Static Variable, isList: true)**
```json
[
  { "label": "Home",      "icon": "wi wi-home",        "link": "#Home" },
  { "label": "Dashboard", "icon": "wi wi-grid-on",     "link": "#Dashboard" },
  {
    "label": "Projects",  "icon": "wi wi-folder-open",
    "children": [
      { "label": "Active Sprints", "icon": "wi wi-flash-on",  "link": "#Sprints" },
      { "label": "Backlog",        "icon": "wi wi-list",       "link": "#Backlog" },
      { "label": "Archived",       "icon": "wi wi-archive",    "link": "#Archived" }
    ]
  },
  { "label": "Reports",  "icon": "wi wi-bar-chart",   "link": "#Reports" },
  { "label": "Settings", "icon": "wi wi-settings",    "link": "#Settings" }
]
```

**Partial: `leftnav_multilevel`**
```xml
<wm-container name="multilevel_root" class="app-container-default"
    direction="column" gap="0" alignment="top-left"
    width="fill" height="fill">

    <wm-container name="sidebar_brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="fill" height="hug" padding="16px 12px">
        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>
        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>
    </wm-container>

    <wm-nav name="multilevel_nav" type="pills" layout="stacked"
        class="app-header-actions"
        dataset="bind:Variables.NavMenuVar.dataSet"
        datafield="all fields"
        displayfield="label"
        iconfield="icon"
        linktarget="_self">
    </wm-nav>

</wm-container>
```

**Key rules:**
- When `dataset` is set, do NOT add `wm-nav-item` children — dataset drives all items.
- `datafield="all fields"` — required; lets wm-nav read `label`, `icon`, `link`, and `children` from each row.
- Rows with a `children` array automatically generate a collapsible sub-menu.
- `layout="stacked"` is still required in dataset mode — it does not default to vertical.

---

## Pattern 7 — Rail + Sub-Panel (VS Code style, Split Sidebar)

```
Collapsed state (sub-panel hidden):
┌────┬──────────────────────────────────────┐
│ 🏠 │                                      │
│ 📊 │   CONTENT AREA  (full width)         │
│ 👥 │                                      │
└────┴──────────────────────────────────────┘
  ↑ wm-left-panel rail
  (always visible, columnwidth="1")

After icon click (sub-panel shown):
┌────┬───────────────────┬──────────────────┐
│ 🏠 │ Reports           │                  │
│ 📊 │ ─────────────── │  CONTENT AREA    │
│ 👥 │  Daily            │                  │
│    │  Monthly          │                  │
│    │  Yearly           │                  │
└────┴───────────────────┴──────────────────┘
  ↑ rail    ↑ sub-panel (200px)   ↑ main (fill)

Sub-panel is inside wm-page-content as a row-sibling
of the main content — NOT inside wm-left-panel.
When show="false", main content auto-fills full width.
```

**Why sub-panel must be inside `wm-page-content` as a `wm-container` — NOT a second `wm-left-panel`:**

`wm-left-panel` with `navtype="drawer"` does NOT render side-by-side with `wm-page-content`. From the source (`left-panel.directive.ts`):

`wm-container` with `show="bind:..."` is a plain flex child. When `show="false"` it becomes `display:none`, the flex row drops it, and `main_content` (`width="fill"`) expands automatically. This is the only reliable way to get a true side-by-side sub-panel that opens and closes without stacking.

**Use for:** Developer tools, admin panels, analytics dashboards — apps with deep section hierarchies where context-sensitive sub-navigation is needed without losing sight of the top-level icon rail.

**Page markup:**
```xml
<wm-page name="mainpage">
    <wm-header name="wm_header" content="header_partial"></wm-header>
    <wm-content name="content">
        <!-- Rail: always visible, icon-only, navtype="rail" sits inline as a grid column -->
        <wm-left-panel name="left_panel" navtype="rail" navheight="clipped"
            columnwidth="1" content="leftnav_rail">
        </wm-left-panel>

        <wm-page-content name="pagecontent" columnwidth="11">
            <!-- Row: sub-panel (conditional) + main content -->
            <wm-container name="content_row" class="app-container-default"
                direction="row" gap="0" alignment="top-left"
                width="fill" height="fill">

                <!-- Sub-panel: hidden until an icon is clicked -->
                <!-- Right-side border (border-width: 0 1px 0 0, border-color: #e0e0e0) must be applied
                     via a component variant or a page CSS class — do NOT use borderwidth/bordercolor as inline props -->
                <wm-container name="sub_panel" class="app-container-default"
                    direction="column" gap="0" alignment="top-left"
                    width="200px" height="fill"
                    show="bind:Variables.SubPanelVisible.dataSet.dataValue">

                    <wm-label name="sub_panel_title"
                        caption="bind:Variables.ActiveSectionLabel.dataSet.dataValue"
                        type="h6" class="h6" padding="12px 12px 8px">
                    </wm-label>

                    <wm-nav name="sub_nav" type="pills" layout="stacked"
                        class="app-header-actions"
                        dataset="bind:Variables.SubNavItemsVar.dataSet"
                        datafield="all fields"
                        displayfield="label">
                    </wm-nav>

                </wm-container>

                <!-- Main content: fills remaining width automatically -->
                <wm-container name="main_content" class="app-container-default"
                    direction="column" gap="0" alignment="top-left"
                    width="fill" height="fill" padding="16px">
                    <!-- page widgets go here -->
                </wm-container>

            </wm-container>
        </wm-page-content>
    </wm-content>
</wm-page>
```

**Partial: `leftnav_rail`**
```xml
<wm-container name="rail_root" class="app-container-default"
    direction="column" gap="4" alignment="top-left"
    width="fill" height="fill" padding="8px 0">

    <wm-button name="btn_home" caption=""
        iconclass="wi wi-home"
        class="btn-transparent no-border app-header-action"
        on-click="onRailClick('home')">
    </wm-button>

    <wm-button name="btn_reports" caption=""
        iconclass="wi wi-bar-chart"
        class="btn-transparent no-border app-header-action"
        on-click="onRailClick('reports')">
    </wm-button>

    <wm-button name="btn_users" caption=""
        iconclass="wi wi-group"
        class="btn-transparent no-border app-header-action"
        on-click="onRailClick('users')">
    </wm-button>

</wm-container>
```

**Variable scope split — critical:**

The `on-click` handler is on a button **inside the partial**. This means the function runs in the **partial script scope**, not the page script.

**Page markup bindings** (`SubPanelVisible` and `ActiveSectionLabel` are page variables — bind directly):
```xml
show="bind:Variables.SubPanelVisible.dataSet.dataValue"
caption="bind:Variables.ActiveSectionLabel.dataSet.dataValue"
dataset="bind:Variables.SubNavItemsVar.dataSet"
```

**Partial script (`leftnav-rail`) — NOT page script:**

```javascript

// Partial script — prefix is Partial, not Page
Partial.onRailClick = function(section) {
    // script goes here for showing the container by setting the variable dataValue to true or false based on condition
};
```

**Why `ActiveSection` lives in the partial and not the page:**
The toggle check (`currentSection === section && isOpen`) needs to know which icon the partial last set. Keeping this state in the partial avoids the partial reaching back into the page just to read a value it owns. Page variables (`SubPanelVisible`, `ActiveSectionLabel`, `SubNavItemsVar`) control the page-level sub-panel UI, so they stay on the page.

**Key rules:**
- Sub-panel is a `wm-container`, not a `wm-left-panel` — mandatory for side-by-side rendering.
- `wm-left-panel navtype="drawer"` stacks vertically above `wm-page-content` (CSS transforms target the entire page element, not a flex sibling).
- `wm-container show="false"` → `display:none` → flex row drops it → `main_content width="fill"` auto-expands.
- `on-click` in partial → function in **partial script** (`Partial.onRailClick`) not page script.
- Page variables from partial script → `Partial.App.activePage.Variables.X.dataSet.dataValue`.
- Partial's own variables → `Partial.Variables.X.dataSet.dataValue`.
- handle the toggle of the container using show flag
---

## Pattern Decision Guide

```
Always visible, icons only, no labels      → Pattern 1 (Rail)
Toggleable, full labels, content shifts    → Pattern 2 (Drawer slide-in)
Full viewport height, beside header/footer → Pattern 3 (navheight="full")
User profile at top, logout pinned bottom  → Pattern 4 (Profile + footer spacer)
Toggleable, overlays content, no shift     → Pattern 5 (Slide-over)
Hierarchical nav from variable/data        → Pattern 6 (Dataset multi-level)
Icon rail + context sub-panel on click     → Pattern 7 (Rail + sub-panel)
```

## Styling wm-left-panel as a Whole

To apply background color, border, shadow, or width to the entire `wm-left-panel` component (not just its inner container), create a component variant on `wm-left-panel` and apply it via the `class` attribute:

```xml
<wm-left-panel name="wm_left_panel" class="<variantdefaultRootKey>-<variantname>" content="leftpanel_partial"></wm-left-panel>
```
where <variantdefaultRootKey> in web it is 'aside-left' and native_mobile it is 'left-nav'

The variant name follows the pattern `left-panel-<variantname>` (e.g. `left-panel-dark`, `left-panel-bordered`, `left-panel-compact`).
Use this approach for styles that must affect the outer panel shell — such as `background-color`, `border-right`, `box-shadow`, or `width` — rather than setting them on the root container inside the partial.
