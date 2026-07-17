---
name: headerPatternDesign
description: Defines few wm-header markup design templates. Generate or update a wm-header partial. Use when a page or screenshot includes wm-header and its partial needs to be created or updated.
---

# Skill: Header Pattern Design

## Context
These are partial-based header designs rendered inside `wm-header` using WaveMaker autolayout.
Every `wm-container` inside the partial must carry all 7 mandatory autolayout attributes:
`name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`.

## wm-header vs wm-top-nav
- `wm-header` — page-specific branding, title, contextual actions. **Must use `content` partial — no direct children.**
- `wm-top-nav` — global navigation shared across pages. Can have inline children or `content` partial.

## wm-header Declaration (page markup)
```xml
<wm-header name="wm_header" content="header_partial"></wm-header>
```

## Supported Styling Props (wm-container runtime)
- `backgroundcolor` — background fill
- `borderradius` — rounded corners (mapped via styler.ts → `borderRadius`)
- `borderwidth` — border thickness (mapped via styler.ts → `borderWidth`)
- `bordercolor` — border color (mapped via styler.ts → `borderColor`)
- `padding` — inner spacing (CSS shorthand: top right bottom left)
- These are runtime-supported on all stylable components even if not listed in the metadata JSON properties panel.

## Border Styling (borderradius, borderwidth, bordercolor)
`borderradius`, `borderwidth`, and `bordercolor` are **not valid inline metadata props** on `wm-container`.
Do NOT set them as inline attributes in markup.
To apply border styling, use one of these approaches:
- **Component variant** (preferred): Create or pick a variant that includes the required `border-radius`, `border-width`, and `border-color` values, then assign the variant to the container's `class` attribute.
- **Page CSS class**: Add a named CSS class in the page stylesheet with the border properties, then reference it in the container's `class` attribute.

## wm-nav Rule
Always set `type` on header `wm-nav`.
Use `type="pills"` or `type="tabs"` for active-state styling.
`type` does not control item direction.

---

## Pattern 1 — Full-Bleed Dashboard Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [☰] [●] AppName                          [🔔]  [⚙]  [👤 User ▾]       │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│  ←── brand_section (hug) ──────── gap=auto ────── action_section (hug) ───→  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Dashboards, SaaS apps. Full-width background. Icons and user menu on the right.

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="0 16px">

    <wm-container name="brand_section" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="hug" height="hug">
        <wm-button name="btn_menu" caption=""
            iconclass="wi wi-menu"
            class="btn-transparent no-border app-header-action">
        </wm-button>
        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="32px" height="32px" resizemode="contain">
        </wm-picture>
        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>
    </wm-container>

    <wm-container name="action_section" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">
        <wm-button name="btn_notifications" caption=""
            iconclass="wi wi-notifications"
            class="btn-transparent no-border app-header-action">
        </wm-button>
        <wm-button name="btn_settings" caption=""
            iconclass="wi wi-settings"
            class="btn-transparent no-border app-header-action">
        </wm-button>
        <wm-menu name="user_menu" caption="User"
            iconclass="wm-sl-l sl-user" iconposition="left"
            menuclass="btn-transparent app-header-action"
            menuposition="down,left" type="menu"
            dataset="Profile, Settings, Logout">
        </wm-menu>
    </wm-container>

</wm-container>
```

**Variant — Enterprise (no logo, help button added):**
Replace `brand_section` content and extend `action_section`:
```xml
<!-- brand_section: text name only, no logo -->
<wm-container name="brand_section" class="app-container-default"
    direction="row" gap="12" alignment="middle-left"
    width="hug" height="hug">
    <wm-button name="btn_sidebar" caption=""
        iconclass="wi wi-menu"
        class="btn-transparent no-border app-header-action">
    </wm-button>
    <wm-label name="app_name" caption="Enterprise Suite"
        type="h5" class="h5">
    </wm-label>
</wm-container>

<!-- action_section: add help before notifications -->
<wm-button name="btn_help" caption=""
    iconclass="wi wi-help-outline"
    class="btn-transparent no-border app-header-action">
</wm-button>
```

---

## Pattern 2 — Constrained Pill Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                 │
│                                                                              │
│       ╭──────────────────────────────────────────────────────────────╮       │
│       │  [●] Brand               Home    Docs    Blog        Login   │       │
│       ╰──────────────────────────────────────────────────────────────╯       │
│                                                                              │
│  outer: width=fill, padding=12px 24px (breathing room around the pill)      │
│         inner: borderradius="40px" + backgroundcolor="#HEX_VALUE"              │
│                borderwidth="1px" + bordercolor="#e0e0e0"                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Marketing sites, documentation. Content constrained to 1200px inside a pill floating on a colored header background.

```xml
<!-- Outer: full-width, padding floats the pill -->
<wm-container name="header_outer" class="app-container-default"
    direction="row" gap="0" alignment="middle-center"
    width="fill" height="hug" padding="12px 24px"
    backgroundcolor="<HEX_VALUE>">

    <!-- Inner pill: apply capsule border (border-radius: 40px, border-width: 1px, border-color: #e0e0e0)
         via a component variant or a page CSS class — do NOT use borderradius/borderwidth/bordercolor as inline props -->
    <!-- Here container-capsule-border is the custom variant class added -->
    <wm-container name="header_pill" class="app-container-default container-capsule-border"
        direction="row" gap="auto" alignment="center"
        width="1200px" height="hug" padding="8px 20px"
        backgroundcolor="#ffffff"
        borderradius="40px"
        borderwidth="1px"
        bordercolor="#e0e0e0">

        <wm-container name="brand" class="app-container-default"
            direction="row" gap="8" alignment="middle-left"
            width="hug" height="hug">
            <wm-picture name="brand_logo"
                picturesource="resources/images/app-logo.png"
                width="28px" height="28px" resizemode="contain">
            </wm-picture>
            <wm-label name="brand_name" caption="Brand"
                type="h5" class="h5">
            </wm-label>
        </wm-container>

        <wm-nav name="main_nav" type="pills" class="app-header-actions">
            <wm-nav-item name="item_home">
                <wm-anchor name="link_home" caption="Home"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_docs">
                <wm-anchor name="link_docs" caption="Docs"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_blog">
                <wm-anchor name="link_blog" caption="Blog"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_login">
                <wm-anchor name="link_login" caption="Login"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
        </wm-nav>

    </wm-container>
</wm-container>
```
wm-header also needs to be styled to match the background color behind the pill header

```xml 
    <wm-header class="app-header <variant-cls>" backgroundcolor="<HEX_VALUE>"></wm-header>
```

---

## Pattern 3 — Center Nav Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│    ┌──────────────────────────────────────────────────────────────────────┐  │
│    │ [●] Brand       Home   Features   Pricing   Docs         [Sign Up]  │  │
│    └──────────────────────────────────────────────────────────────────────┘  │
│  brand(hug) ←── gap=auto ──→ nav(hug) ←── gap=auto ──→ action(hug)          │
│  NOTE: wm-nav must set type for styling (pills/tabs); do not set layout       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** SaaS landing pages, portals. Three-section layout with nav in the center. Two variants based on nav component and width.

### Variant A — Constrained SaaS (wm-nav, 1200px centered)
Nav links as pill anchors inside a constrained block. Best for marketing/landing pages.

```xml
<!-- Outer: full-width, centers the constrained inner block -->
<wm-container name="header_outer" class="app-container-default"
    direction="row" gap="0" alignment="middle-center"
    width="fill" height="hug">

    <!-- Inner: constrained 1200px width -->
    <wm-container name="header_inner" class="app-container-default"
        direction="row" gap="auto" alignment="center"
        width="1200px" height="hug" padding="8px 0">

        <wm-container name="brand" class="app-container-default"
            direction="row" gap="8" alignment="middle-left"
            width="hug" height="hug">
            <wm-picture name="brand_logo"
                picturesource="resources/images/app-logo.png"
                width="32px" height="32px" resizemode="contain">
            </wm-picture>
            <wm-label name="brand_name" caption="Brand"
                type="h5" class="h5">
            </wm-label>
        </wm-container>

        <wm-nav name="main_nav" type="pills" class="app-header-actions">
            <wm-nav-item name="item_home">
                <wm-anchor name="link_home" caption="Home"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_features">
                <wm-anchor name="link_features" caption="Features"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_pricing">
                <wm-anchor name="link_pricing" caption="Pricing"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
            <wm-nav-item name="item_docs">
                <wm-anchor name="link_docs" caption="Docs"
                    class="app-header-action">
                </wm-anchor>
            </wm-nav-item>
        </wm-nav>

        <wm-button name="btn_signup" caption="Sign Up"
            class="btn-primary btn-sm">
        </wm-button>

    </wm-container>
</wm-container>
```

### Variant B — Full-Bleed Portal (wm-buttongroup, full-width)
Nav links as a joined button toolbar. Best for portals and internal tools with section switching.

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="0 16px">

    <wm-picture name="brand_logo"
        picturesource="resources/images/app-logo.png"
        width="32px" height="32px" resizemode="contain">
    </wm-picture>

    <wm-buttongroup name="portal_nav" class="btn-toolbar">
        <wm-button name="btn_dashboard" caption="Dashboard"
            class="btn-default">
        </wm-button>
        <wm-button name="btn_reports" caption="Reports"
            class="btn-default">
        </wm-button>
        <wm-button name="btn_analytics" caption="Analytics"
            class="btn-default">
        </wm-button>
        <wm-button name="btn_users" caption="Users"
            class="btn-default">
        </wm-button>
        <wm-button name="btn_settings" caption="Settings"
            class="btn-default">
        </wm-button>
    </wm-buttongroup>

    <wm-menu name="user_menu" caption="User"
        iconclass="wm-sl-l sl-user" iconposition="left"
        menuclass="btn-transparent app-header-action"
        menuposition="down,left" type="menu"
        dataset="Profile, Settings, Logout">
    </wm-menu>

</wm-container>
```

---

## Pattern 4 — Simple Single Action Header

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [●] AppName                                            [Get Started]    │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│  ←── brand (hug) ──────────────── gap=auto ─────────────── btn-primary ───→  │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Internal tools, small apps, onboarding flows. Minimal chrome — logo left, one primary CTA right. Nothing in between.

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="8px 24px">

    <wm-container name="brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="hug" height="hug">

        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="32px" height="32px" resizemode="contain">
        </wm-picture>

        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>

    </wm-container>

    <wm-button name="btn_cta" caption="Get Started"
        class="btn-primary">
    </wm-button>

</wm-container>
```

---

## Pattern 5 — Global Search Dominant

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [●]   [ 🔍  Search anything...                        ]   [🔔]  [👤 ▾] │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│  logo   ←─────── wm-search width="fill" grows to fill space ──────→  icons  │
│         gap=16 fixed; search expands, logo and icons stay fixed size         │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Admin dashboards, data apps. Search is the primary interaction — takes all remaining space between logo and actions.

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="16" alignment="middle-left"
    width="fill" height="hug" padding="8px 16px">

    <wm-picture name="brand_logo"
        picturesource="resources/images/app-logo.png"
        width="36px" height="36px" resizemode="contain">
    </wm-picture>

    <wm-search name="global_search"
        placeholder="Search anything..." type="search"
        navsearchbar="true" width="fill">
    </wm-search>

    <wm-container name="icon_actions" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">

        <wm-button name="btn_notifications" caption=""
            iconclass="wi wi-notifications"
            class="btn-transparent no-border app-header-action">
        </wm-button>

        <wm-menu name="user_menu" caption=""
            iconclass="wm-sl-l sl-user"
            menuclass="btn-transparent no-border app-header-action"
            menuposition="down,left" type="menu"
            dataset="Profile, Settings, Logout">
        </wm-menu>

    </wm-container>

</wm-container>
```

---

## Pattern 6 — Hamburger Mobile-First

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [☰]            [●] AppName                         [🔍]  [👤]          │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│  toggle   ←── gap=auto ──→   brand (hug, CENTER)   ←── gap=auto ──→  icons  │
│                                                                              │
│  Brand sits in the CENTER between two gap=auto sections — structurally       │
│  different from Pattern 1 where brand is anchored left.                      │
│  ☰ tap → sidebar slides in (handled by page layout, not this partial)        │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Mobile-first, responsive apps. No inline nav — navigation lives entirely in a sidebar triggered by the hamburger.

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="0 8px">

    <wm-button name="btn_sidebar_toggle" caption=""
        iconclass="wi wi-menu"
        class="btn-transparent no-border app-header-action">
    </wm-button>

    <wm-container name="brand_center" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="hug" height="hug">

        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>

        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>

    </wm-container>

    <wm-container name="right_icons" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">

        <wm-button name="btn_search" caption=""
            iconclass="wm-sl-l sl-search"
            class="btn-transparent no-border app-header-action">
        </wm-button>

        <wm-picture name="user_avatar"
            picturesource="resources/images/avatar.png"
            width="32px" height="32px"
            shape="circle" resizemode="cover">
        </wm-picture>

    </wm-container>

</wm-container>
```

---

## Pattern 7 — Workspace Context (Multi-tenant)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header                                                                    │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [●]  [Acme Corp ▾]  /  [Engineering ▾]  /  [Q4 Sprint ▾]  [🔔] [👤 ▾] │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│  logo   ←──── breadcrumb selectors (each a wm-menu dropdown) ────→  actions  │
│         gap=auto splits workspace_context (hug) ←→ action_section (hug)     │
│  Each [label ▾] dropdown opens on click with bound dataset                   │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Use for:** Collaboration tools, multi-tenant SaaS. Each breadcrumb level is a `wm-menu` dropdown bound to a variable dataset (orgs, workspaces, projects).

```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="0 16px">

    <wm-container name="workspace_context" class="app-container-default"
        direction="row" gap="4" alignment="middle-left"
        width="hug" height="hug">

        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="28px" height="28px" resizemode="contain">
        </wm-picture>

        <wm-menu name="org_selector" caption="Acme Corp"
            menuclass="btn-transparent app-header-action"
            menuposition="down,right" type="menu"
            dataset="bind:Variables.OrgListVar.dataSet">
        </wm-menu>

        <wm-label name="sep1" caption="/" class="text-muted"></wm-label>

        <wm-menu name="workspace_selector" caption="Engineering"
            menuclass="btn-transparent app-header-action"
            menuposition="down,right" type="menu"
            dataset="bind:Variables.WorkspaceListVar.dataSet">
        </wm-menu>

        <wm-label name="sep2" caption="/" class="text-muted"></wm-label>

        <wm-menu name="project_selector" caption="Q4 Sprint"
            menuclass="btn-transparent app-header-action"
            menuposition="down,right" type="menu"
            dataset="bind:Variables.ProjectListVar.dataSet">
        </wm-menu>

    </wm-container>

    <wm-container name="action_section" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">

        <wm-button name="btn_notifications" caption=""
            iconclass="wi wi-notifications"
            class="btn-transparent no-border app-header-action">
        </wm-button>

        <wm-menu name="user_menu" caption=""
            iconclass="wm-sl-l sl-user"
            menuclass="btn-transparent no-border app-header-action"
            menuposition="down,left" type="menu"
            dataset="Profile, Settings, Logout">
        </wm-menu>

    </wm-container>

</wm-container>
```

---

## Pattern 8 — Tabs Secondary Nav

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ wm-header  → partial: header_primary                                         │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ [●] AppName                                         [🔔]  [👤 User ▾]  │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────────┤
│ wm-top-nav → partial: header_tabs  (or inline children)                      │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │  Overview   Reports   Analytics   Team   Settings                        │ │
│ │  ─────────                                                               │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
  Two separate layout components on the page — wm-header for branding/actions,
  wm-top-nav for tab navigation. Do NOT stack both rows inside one header partial.
```

**Use for:** Settings pages, detail views, multi-section apps.

**Page markup:**
```xml
<wm-header name="wm_header" content="header_primary"></wm-header>
<wm-top-nav name="wm_top_nav" content="header_tabs"></wm-top-nav>
```

**Partial: `header_primary`** (rendered inside `wm-header`)
```xml
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="auto" alignment="center"
    width="fill" height="hug" padding="8px 24px">

    <wm-container name="brand" class="app-container-default"
        direction="row" gap="8" alignment="middle-left"
        width="hug" height="hug">

        <wm-picture name="brand_logo"
            picturesource="resources/images/app-logo.png"
            width="32px" height="32px" resizemode="contain">
        </wm-picture>

        <wm-label name="brand_name" caption="AppName"
            type="h5" class="h5">
        </wm-label>

    </wm-container>

    <wm-container name="right_actions" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">

        <wm-button name="btn_notifications" caption=""
            iconclass="wi wi-notifications"
            class="btn-transparent no-border app-header-action">
        </wm-button>

        <wm-menu name="user_menu" caption="User"
            iconclass="wm-sl-l sl-user" iconposition="left"
            menuclass="btn-transparent app-header-action"
            menuposition="down,left" type="menu"
            dataset="Profile, Settings, Logout">
        </wm-menu>

    </wm-container>

</wm-container>
```

**Partial: `header_tabs`** (rendered inside `wm-top-nav`)
```xml
<wm-nav name="section_tabs" type="tabs" class="app-header-actions">
    <wm-nav-item name="tab_overview">
        <wm-anchor name="link_overview" caption="Overview"
            class="app-header-action">
        </wm-anchor>
    </wm-nav-item>
    <wm-nav-item name="tab_reports">
        <wm-anchor name="link_reports" caption="Reports"
            class="app-header-action">
        </wm-anchor>
    </wm-nav-item>
    <wm-nav-item name="tab_analytics">
        <wm-anchor name="link_analytics" caption="Analytics"
            class="app-header-action">
        </wm-anchor>
    </wm-nav-item>
    <wm-nav-item name="tab_team">
        <wm-anchor name="link_team" caption="Team"
            class="app-header-action">
        </wm-anchor>
    </wm-nav-item>
    <wm-nav-item name="tab_settings">
        <wm-anchor name="link_settings" caption="Settings"
            class="app-header-action">
        </wm-anchor>
    </wm-nav-item>
</wm-nav>
```

---

## Pattern 9 — Fixed Header (Viewport-Pinned)

```
  Page scrolls down ↓
┌──────────────────────────────────────────────────────────────────────────────┐  ← pinned to top
│ wm-header  (any pattern above + position="fixed" positionvalue="0px 0px auto 0px")│
│ │ [●]   [ 🔍 Search... ]                              [🔔]  [👤 ▾]        │ │
└──────────────────────────────────────────────────────────────────────────────┘
  ░░░░░░░░░░░░░░░░░░░░░░░ page content scrolls underneath ░░░░░░░░░░░░░░░░░░░░
```

**Use for:** Any pattern where the header must stay visible while page or list content scrolls.

**Why `position="sticky"` does NOT work inside the partial:**
```
wm-page
  wm-header
    [partial container ← sticky set here]   ← NOT inside the scroll container
  wm-content
    wm-page-content
      wm-list  ← scroll source
```
`position: sticky` requires the element to be inside the scroll container. The partial container is inside `wm-header` which is outside `wm-page-content`'s scroll context — sticky has no scroll ancestor and falls back to `relative`.

**Correct fix — `position="fixed"` with `positionvalue` on the partial root container.**
`positionvalue` format: `"top right bottom left"` — use `auto` for unset sides.
`positionvalue="0px 0px auto 0px"` → top:0 · right:0 · left:0 — full-width pinned to top.

```xml
<!-- Add position="fixed", positionvalue, zindex to root container of any pattern -->
<wm-container name="header_root" class="app-container-default"
    direction="row" gap="16" alignment="middle-left"
    width="fill" height="hug" padding="8px 16px"
    position="fixed" positionvalue="0px 0px auto 0px" zindex="100">

    <wm-picture name="brand_logo"
        picturesource="resources/images/app-logo.png"
        width="36px" height="36px" resizemode="contain">
    </wm-picture>

    <wm-search name="global_search"
        placeholder="Search anything..." type="search"
        navsearchbar="true" width="fill">
    </wm-search>

    <wm-container name="icon_actions" class="app-container-default"
        direction="row" gap="4" alignment="middle-right"
        width="hug" height="hug">

        <wm-button name="btn_notifications" caption=""
            iconclass="wi wi-notifications"
            class="btn-transparent no-border app-header-action">
        </wm-button>

        <wm-menu name="user_menu" caption=""
            iconclass="wm-sl-l sl-user"
            menuclass="btn-transparent no-border app-header-action"
            menuposition="down,left" type="menu"
            dataset="Profile, Settings, Logout">
        </wm-menu>

    </wm-container>

</wm-container>
```

**Side effect:** Fixed removes the element from document flow — `wm-page-content` renders behind it.
Compensate by adding top padding to `wm-page-content` matching header height (typically `padding="56px 0 0 0"`).

---

## Layout Mechanics Reference

```
gap="auto"  + alignment="center"        → space-between, vertically centered
gap="N"     + alignment="middle-left"   → fixed spacing, left-aligned, vertically centered
gap="N"     + alignment="middle-center" → fixed spacing, fully centered

width="fill" → expands to 100% of parent
width="hug"  → shrinks to fit children
width="Npx"  → fixed pixel width (use for constrained inner blocks)

direction="row"    → children left → right
direction="column" → children top  → bottom
```

## Pill Shape Key Attributes
`borderradius`, `borderwidth`, and `bordercolor` are not valid inline props — apply them via a component variant or a page CSS class.

Target CSS values for the pill shape which can be added through design token and component variant
```
borderradius="40px"       → true capsule ends (use fixed px, not %)
borderradius="12px"       → softer rounded rectangle
borderwidth="1px"         → subtle border
bordercolor="#e0e0e0"     → light neutral border
backgroundcolor="HEX_VALUE" → some background color like #ff0aff (CSS standard) wm-container inside partial in wm-header
backgroundcolor="HEX_VALUE" → white pill on colored outer background on wm-header
```
`backgroundcolor="#ffffff"` is a valid inline prop and can be set directly on the container.

## Pattern Decision Guide
```
Full-bleed, icon actions right         → Pattern 1
Pill floating on colored background    → Pattern 2
Nav links in center row                → Pattern 3 Variant A (wm-nav, constrained)
Nav buttons in center row              → Pattern 3 Variant B (wm-buttongroup, full-bleed)
Logo + single CTA only                 → Pattern 4
Search bar dominates center            → Pattern 5
Hamburger + brand centered             → Pattern 6
Multi-tenant context breadcrumbs       → Pattern 7
Brand row + tabs row (two components)  → Pattern 8
Header must stay fixed while scrolling → Pattern 9
```

## Styling wm-header as a Whole

To apply background color, border, shadow, or other styles to the entire `wm-header` component (not just its inner container), create a component variant on `wm-header` and apply it via the `class` attribute:

```xml
<wm-header name="wm_header" class="header-primary" content="header_partial"></wm-header>
```

The variant name follows the pattern `header-<variantname>` (e.g. `header-custom-primary`, `header-darkbg`, `header-transparentbg`).
Use this approach for styles that must affect the outer header shell — such as `background-color`, `box-shadow`, `border-bottom`, or `height` — rather than setting them on the root container inside the partial.
