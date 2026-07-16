---
name: markup-examples
description: >
  Full annotated XML markup examples for real screens: login page, e-commerce product list, dashboard
  with stats cards, settings page, and a catalog of 15 reusable layout patterns from mandatory page
  shell to image overlays. Load when you need a concrete reference for a screen type or pattern not
  yet in widget-templates.
---

# WaveMaker Markup Examples

## Key Patterns Shown
- Paired tags only (never self-closing)
- NO inline styles (no backgroundcolor, color, fontsize, etc.)
- Page structure: `wm-content borderwidth="0px" padding="0px"` + `wm-page-content columnwidth="12" padding="16px"`
- Main content wrapper: single column container with gap wrapping all sections
- Static captions for visible text (NOT bind:), bind: only inside wm-listtemplate
- Pexels URLs for images with distinct photo IDs
- Font Awesome icons (`fa fa-*`) preferred over WaveMaker icons
- Widget quirks handled (showcaptions="false" on rating, etc.)
- Every styled widget has class + variant

## Example 1: Login Page

```xml
<wm-page name="LoginPage">
  <wm-content name="content_root" borderwidth="0px" padding="0px">
    <wm-page-content name="page_content_root" padding="0px" columnwidth="12">

      <!-- Logo Section -->
      <wm-container name="logo_section" class="container-logo-section" variant="logo-section" direction="column" gap="0" alignment="top-center" width="fill" height="hug">
        <wm-label name="logo_label" caption="Bright Bank"></wm-label>
      </wm-container>

      <!-- Login Card -->
      <wm-container name="login_card" class="container-login-card" variant="login-card" direction="column" gap="24" alignment="top-center" width="fill" height="hug">
        <wm-label name="login_heading" caption="Login"></wm-label>

        <wm-login name="loginForm" class="login-main" width="100%">
          <wm-form name="loginFormInner" title="" captionposition="floating" itemsperrow="xs-1 sm-1 md-1 lg-1" captionalign="left" method="post">
            <wm-container name="fields_container" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
              <wm-form-field name="j_username" key="j_username" displayname="Username" type="string" widget="text" required="true" placeholder="Enter username" width="100%"></wm-form-field>
              <wm-form-field name="j_password" key="j_password" displayname="Password" type="string" widget="password" required="true" placeholder="Enter password" width="100%"></wm-form-field>
            </wm-container>
            <wm-container name="actions_container" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
              <wm-form-action name="login_btn" display-name="LOGIN" type="submit" update-mode="true" class="btn-primary" width="100%"></wm-form-action>
            </wm-container>
          </wm-form>
        </wm-login>
        <wm-anchor name="forgot_link" caption="Forgot Password?" hyperlink="#"></wm-anchor>

        <wm-label name="no_account" caption="Don't have an account?"></wm-label>
        <wm-button name="register_btn" caption="REGISTER AS NEW USER" class="btn-default"></wm-button>
      </wm-container>

    </wm-page-content>
  </wm-content>
</wm-page>
```

## Example 2: E-Commerce Product List

```xml
<wm-page name="ProductListPage">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <!-- MANDATORY: main content wrapper -->
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">

        <!-- Top Bar -->
        <wm-mobile-navbar name="top_nav" title="Products" backbutton="false" searchbutton="true" searchbuttoniconclass="fa fa-search"></wm-mobile-navbar>

        <!-- Category Tabs -->
        <wm-tabs name="category_tabs" defaultpaneindex="0" enablegestures="true">
          <wm-tabpane name="tab_all" title="All">
            <!-- Product List -->
            <wm-list name="product_list" dataset="bind:Variables.products.dataSet" direction="column" gap="12" navigation="Scroll" pagesize="20">
              <wm-listtemplate name="product_tmpl">
                <wm-card name="product_card" title="" picturesource="bind:Variables.products.dataSet[$i].image">
                  <wm-card-content name="product_body">
                    <wm-label name="product_name" caption="bind:Variables.products.dataSet[$i].name"></wm-label>
                    <wm-label name="product_desc" caption="bind:Variables.products.dataSet[$i].description" nooflines="2"></wm-label>
                    <wm-container name="price_row" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
                      <wm-label name="product_price" caption="bind:Variables.products.dataSet[$i].price"></wm-label>
                      <wm-rating name="product_rating" datavalue="bind:Variables.products.dataSet[$i].rating" maxvalue="5" readonly="true" showcaptions="false"></wm-rating>
                    </wm-container>
                  </wm-card-content>
                  <wm-card-footer name="product_footer">
                    <wm-button name="add_cart_btn" caption="Add to Cart" iconclass="fa fa-shopping-cart" class="btn-primary"></wm-button>
                  </wm-card-footer>
                </wm-card>
              </wm-listtemplate>
            </wm-list>
          </wm-tabpane>
          <wm-tabpane name="tab_electronics" title="Electronics">
          </wm-tabpane>
        </wm-tabs>

      </wm-container>
    </wm-page-content>
  </wm-content>
</wm-page>
```

## Example 3: Dashboard with Stats

```xml
<wm-page name="DashboardPage">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <!-- MANDATORY: main content wrapper -->
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">

        <!-- Header -->
        <wm-mobile-navbar name="dash_nav" title="Dashboard" backbutton="false"></wm-mobile-navbar>

        <!-- Stats Row (container-based, NOT grid) -->
        <wm-container name="stats_row" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
        <wm-container name="stat1" class="container-stat-card" variant="stat-card" direction="column" gap="4" alignment="top-center" width="48%" height="hug">
          <wm-icon name="stat1_icon" iconclass="fa fa-dollar" iconsize="24px"></wm-icon>
          <wm-label name="stat1_value" caption="$24,567"></wm-label>
          <wm-label name="stat1_label" caption="Total Sales"></wm-label>
        </wm-container>
        <wm-container name="stat2" class="container-stat-card" variant="stat-card" direction="column" gap="4" alignment="top-center" width="48%" height="hug">
          <wm-icon name="stat2_icon" iconclass="fa fa-shopping-cart" iconsize="24px"></wm-icon>
          <wm-label name="stat2_value" caption="1,234"></wm-label>
          <wm-label name="stat2_label" caption="Orders"></wm-label>
        </wm-container>
      </wm-container>

      <!-- Sales Chart -->
      <wm-container name="chart_card" class="container-chart-card" variant="chart-card" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
        <wm-label name="chart_title" caption="Sales Overview"></wm-label>
        <wm-chart type="Column" name="sales_chart" dataset="bind:Variables.salesData.dataSet" xaxisdatakey="month" yaxisdatakey="sales" height="200px"></wm-chart>
      </wm-container>

      <!-- Recent Transactions -->
      <wm-label name="txn_title" caption="Recent Transactions"></wm-label>
      <wm-list name="txn_list" dataset="bind:Variables.transactions.dataSet" direction="column" gap="8" navigation="None" pagesize="20" class="list-flat" variant="flat">
        <wm-listtemplate name="txn_tmpl" class="list-template-flat" variant="flat" direction="row" gap="12" alignment="middle-left" width="fill" height="hug" padding="12">
          <wm-picture name="txn_icon" picturesource="bind:Variables.transactions.dataSet[$i].icon" width="40px" height="40px" shape="circle"></wm-picture>
          <wm-container name="txn_info" class="app-default-container" direction="column" gap="2" alignment="top-left" width="fill" height="hug">
            <wm-label name="txn_name" caption="bind:Variables.transactions.dataSet[$i].name"></wm-label>
            <wm-label name="txn_date" caption="bind:Variables.transactions.dataSet[$i].date"></wm-label>
          </wm-container>
          <wm-label name="txn_amount" caption="bind:Variables.transactions.dataSet[$i].amount"></wm-label>
        </wm-listtemplate>
      </wm-list>

      </wm-container>
    </wm-page-content>
  </wm-content>
  <!-- wm-mobile-tabbar goes OUTSIDE wm-content, directly inside wm-page -->
  <wm-mobile-tabbar name="bottom_tabs" dataset="bind:Variables.navTabs.dataSet" itemlabel="label" itemicon="icon" itemlink="link"></wm-mobile-tabbar>
</wm-page>
```

## Example 4: Settings Page

```xml
<wm-page name="SettingsPage">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <!-- MANDATORY: main content wrapper -->
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">

        <wm-mobile-navbar name="settings_nav" title="Settings" backbutton="true" backbuttoniconclass="wi wi-back"></wm-mobile-navbar>

        <!-- Profile Section -->
      <wm-container name="profile_card" class="container-profile-card" variant="profile-card" direction="row" gap="16" alignment="middle-left" width="fill" height="hug">
        <wm-picture name="profile_pic" picturesource="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" width="64px" height="64px" shape="circle"></wm-picture>
        <wm-container name="profile_info" class="app-default-container" direction="column" gap="4" alignment="top-left" width="fill" height="hug">
          <wm-label name="profile_name" caption="John Doe"></wm-label>
          <wm-label name="profile_email" caption="john@example.com"></wm-label>
        </wm-container>
        <wm-icon name="edit_icon" iconclass="fa fa-chevron-right" iconsize="16px"></wm-icon>
      </wm-container>

      <!-- Settings Accordion -->
      <wm-accordion name="settings_accordion" defaultpaneindex="0" closeothers="true">
        <wm-accordionpane name="pane_general" title="General" iconclass="fa fa-cog">
          <wm-container name="notif_row" class="container-setting-row" variant="setting-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
            <wm-label name="notif_label" caption="Push Notifications"></wm-label>
            <wm-checkbox name="notif_toggle" class="toggle-setting" variant="setting" type="toggle" accessibilityrole="togglebutton" datavalue="true"></wm-checkbox>
          </wm-container>
          <wm-container name="dark_row" class="container-setting-row" variant="setting-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
            <wm-label name="dark_label" caption="Dark Mode"></wm-label>
            <wm-checkbox name="dark_toggle" class="toggle-setting" variant="setting" type="toggle" accessibilityrole="togglebutton" datavalue="false"></wm-checkbox>
          </wm-container>
          <wm-container name="lang_row" class="container-setting-row" variant="setting-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
            <wm-label name="lang_label" caption="Language"></wm-label>
            <wm-select name="lang_select" dataset="English,Spanish,French" datavalue="English" placeholder="Choose..."></wm-select>
          </wm-container>
        </wm-accordionpane>
        <wm-accordionpane name="pane_privacy" title="Privacy & Security" iconclass="fa fa-lock">
          <wm-container name="bio_row" class="container-setting-row" variant="setting-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
            <wm-label name="bio_label" caption="Biometric Login"></wm-label>
            <wm-checkbox name="bio_toggle" class="toggle-setting" variant="setting" type="toggle" accessibilityrole="togglebutton" datavalue="true"></wm-checkbox>
          </wm-container>
        </wm-accordionpane>
        </wm-accordion>

      </wm-container>
    </wm-page-content>
  </wm-content>
</wm-page>
```

## Reusable Pattern Catalog

These patterns are **generic building blocks** that apply to any screen design — e-commerce, chat, fitness, food delivery, social, etc. Combine them to compose any page.

### Pattern A: Mandatory Page Shell

Every page MUST start with this exact structure. The `main_content` wrapper with `gap` prevents sections from running together.

```xml
<wm-page name="PageName">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">

        <!-- ALL page sections go here as children -->

      </wm-container>
    </wm-page-content>
  </wm-content>
</wm-page>
```

### Pattern B: Top Nav with Icon Buttons

Use for: back + action (heart, share, cart, settings, etc.)

```xml
<wm-container name="top_nav" class="container-topnav" variant="topnav" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-button name="back_btn" iconclass="fa fa-chevron-left" class="btn-icon-circle" variant="icon-circle"></wm-button>
  <wm-button name="action_btn" iconclass="fa fa-heart-o" class="btn-icon-circle" variant="icon-circle"></wm-button>
</wm-container>
```

Icon-only button token (complete override required — btn uses FLAT `background`, SIBLING `radius`, `shadow`):
```json
{ "btn": { "appearances": { "icon-circle": { "mapping": {
  "background": { "value": "{color.transparent.@.value}", "type": "color" },
  "color": { "value": "#1A1A1Aff", "type": "color" },
  "border": { "color": { "value": "#E5E5E5ff", "type": "color" }, "width": { "value": "{border.width.1.value}", "type": "border" }, "style": { "value": "{border.style.solid.value}", "type": "border" } },
  "radius": { "value": "{radius.circle.value}", "type": "radius" },
  "height": { "value": "{space.10.value}", "type": "space" },
  "min-width": { "value": "{space.10.value}", "type": "space" },
  "icon": { "size": { "value": "{icon.size.sm.value}", "type": "space" } },
  "padding": { "value": "{space.0.value}", "type": "space" },
  "shadow": { "value": "{elevation.shadow.none.value}", "type": "radius" }
} } } } }
```

### Pattern C: Horizontal Image Row

Use for: product galleries, story circles, card carousels

```xml
<wm-container name="image_row" class="container-image-row" variant="image-row" direction="row" gap="8" alignment="middle-left" width="fill" height="hug">
  <wm-picture name="img_1" picturesource="https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg" width="180px" height="220px" resizemode="cover" class="picture-thumb" variant="thumb"></wm-picture>
  <wm-picture name="img_2" picturesource="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg" width="180px" height="220px" resizemode="cover" class="picture-thumb" variant="thumb"></wm-picture>
</wm-container>
```

### Pattern D: Pill Selector Row (wm-select in styled container)

Use for: size pickers, sort options, filter selectors — any row with a label on the left and a value selector on the right inside a pill-shaped border. Use `wm-select` for selector functionality; embed it inside a styled `wm-container` and strip the select's own chrome via tokens.

```xml
<wm-container name="option_row" class="container-pill-row" variant="pill-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-label name="option_label" caption="Size" class="label-pill-label" variant="pill-label"></wm-label>
  <wm-select name="option_select" dataset="bind:Variables.sizeOptions.dataSet" datafield="All Fields" displayfield="name" class="select-pill-inline" variant="pill-inline"></wm-select>
</wm-container>
```

Pill container token (container uses NESTED `background.color` and `border.radius`):
```json
{ "container": { "appearances": { "pill-row": { "mapping": {
  "background": { "color": { "value": "#FFFFFFff", "type": "color" } },
  "border": { "color": { "value": "#E8E8E8ff", "type": "color" }, "width": { "value": "{border.width.1.value}", "type": "border" }, "style": { "value": "{border.style.solid.value}", "type": "border" }, "radius": { "value": "{radius.pill.value}", "type": "radius" } },
  "padding": { "value": "{space.3.value} {space.4.value}", "type": "space" }
} } } } }
```

Select token (strip chrome for inline use — includes arrow-button to fully neutralize):
```json
{ "select": { "appearances": { "pill-inline": { "mapping": {
  "border": { "style": { "value": "{border.style.solid.value}", "type": "border" }, "width": { "value": "{border.width.0.value}", "type": "border" }, "color": { "value": "{color.transparent.@.value}", "type": "color" } },
  "background": { "color": { "value": "{color.transparent.@.value}", "type": "color" } },
  "padding": { "value": "{space.0.value}", "type": "space" },
  "min-width": { "value": "{space.0.value}", "type": "space" },
  "arrow-button": { "background-color": { "value": "{color.transparent.@.value}", "type": "color" }, "padding": { "value": "{space.0.value}", "type": "space" }, "border-width": { "value": "{border.width.0.value}", "type": "border" }, "border-style": { "value": "{border.style.solid.value}", "type": "border" }, "border-color": { "value": "{color.transparent.@.value}", "type": "color" } }
} } } } }
```

### Pattern E: Quantity Stepper

Use for: cart quantity, seat count, guest count, serving size — any +/- control with a value. Do NOT use `wm-number`.

```xml
<wm-container name="stepper_row" class="container-pill-row" variant="pill-row" direction="row" gap="auto" alignment="center" width="fill" height="hug">
  <wm-label name="stepper_label" caption="Quantity" class="label-pill-label" variant="pill-label"></wm-label>
  <wm-container name="stepper_controls" class="app-default-container" direction="row" gap="8" alignment="middle-center" width="hug" height="hug">
    <wm-button name="stepper_plus" iconclass="fa fa-plus" class="btn-circle-filled" variant="circle-filled"></wm-button>
    <wm-label name="stepper_value" caption="1" class="label-stepper-value" variant="stepper-value"></wm-label>
    <wm-button name="stepper_minus" iconclass="fa fa-minus" class="btn-circle-filled" variant="circle-filled"></wm-button>
  </wm-container>
</wm-container>
```

### Pattern F: List with Avatar Row

Use for: reviews, comments, messages, contacts, transactions — any repeated items with an image + text + metadata.

**IMPORTANT**: `wm-listtemplate` IS an auto-layout container — put `direction`, `gap`, `alignment`, `padding` directly on it. NEVER add a wrapper `wm-container` inside `wm-listtemplate` just for layout. Only use inner containers for nested sub-layouts (e.g., a column group inside a row template).

```xml
<wm-list name="item_list" dataset="bind:Variables.listData.dataSet" navigation="None" pagesize="10" class="list-flat-list" variant="flat-list">
  <wm-listtemplate name="item_tmpl" class="list-template-item" variant="item" direction="column" gap="8" alignment="top-left" width="fill" height="hug" padding="12">
    <wm-container name="item_header" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
      <wm-container name="item_author" class="app-default-container" direction="row" gap="10" alignment="middle-left" width="hug" height="hug">
        <wm-picture name="item_avatar" picturesource="bind:Variables.listData.dataSet[$i].avatar" width="36px" height="36px" shape="circle" class="picture-avatar" variant="avatar"></wm-picture>
        <wm-label name="item_name" caption="bind:Variables.listData.dataSet[$i].name" class="label-item-name" variant="item-name"></wm-label>
      </wm-container>
      <wm-rating name="item_rating" datavalue="bind:Variables.listData.dataSet[$i].rating" maxvalue="5" readonly="true" showcaptions="false" class="rating-inline-stars" variant="inline-stars"></wm-rating>
    </wm-container>
    <wm-label name="item_text" caption="bind:Variables.listData.dataSet[$i].text" class="label-item-body" variant="item-body"></wm-label>
    <wm-label name="item_date" caption="bind:Variables.listData.dataSet[$i].date" class="label-item-meta" variant="item-meta"></wm-label>
  </wm-listtemplate>
</wm-list>
```

Flat list token (ROOT-level overrides only — ⚠️ `item.*` tokens don't work in RN):
```json
{ "list": { "appearances": { "flat-list": { "mapping": {
  "background": { "color": { "value": "{color.transparent.@.value}", "type": "color" } },
  "border": { "width": { "value": "{border.width.0.value}", "type": "border" }, "style": { "value": "{border.style.solid.value}", "type": "border" }, "color": { "value": "{color.transparent.@.value}", "type": "color" }, "radius": { "value": "{radius.none.value}", "type": "radius" } },
  "padding": { "value": "{space.0.value}", "type": "space" }
} } } } }
```

Small inline rating token (override 32px default, light gray unfilled stars):
```json
{ "rating": { "appearances": { "inline-stars": { "mapping": {
  "icon": {
    "size": { "value": "{icon.size.xs.value}", "type": "space" },
    "color": { "value": "#D0D0D0ff", "type": "color" }
  },
  "padding": { "value": "{space.0.value}", "type": "space" }
} } } } }
```
NOTE: `icon.color` = unfilled/inactive stars. To override filled star color, use `states.active.icon.color`. NEVER use `activeStar`/`inactiveStar` — those paths don't exist.

### Pattern G: Bottom Action Bar / Tab Bar

Use for: checkout bars, send message bars, save/cancel bars, price + CTA bars, custom tab bars

**CRITICAL — Placement depends on widget type:**

**`wm-mobile-tabbar` (built-in widget)**: Place **outside** `<wm-content>`, directly inside `<wm-page>`. The framework handles positioning automatically. No extra props needed.

```xml
</wm-content>
<wm-mobile-tabbar name="bottom_tabs" dataset="bind:Variables.tabItems.dataSet" itemlabel="label" itemicon="icon" itemlink="link"></wm-mobile-tabbar>
</wm-page>
```

**Custom container bar (action bar or custom tab bar)**: Place inside `wm-page-content` as the last child of the main wrapper. **MUST** include `position="fixed" positionvalue="auto auto 0px auto"` to stay fixed at the bottom.

```xml
<wm-container name="bottom_bar" class="container-action-bar" variant="action-bar" direction="row" gap="auto" alignment="center" width="fill" height="56px" position="fixed" positionvalue="auto auto 0px auto">
  <wm-label name="bar_info" caption="$148" class="label-bar-info" variant="bar-info"></wm-label>
  <wm-button name="bar_action" caption="Add to Bag" class="btn-bar-action" variant="bar-action"></wm-button>
</wm-container>
```

### Pattern H: Color Dot Indicator

Use for: color swatches, status dots, online indicators

```xml
<wm-container name="color_dot" class="container-dot" variant="dot" direction="row" gap="0" alignment="middle-center" width="22px" height="22px"></wm-container>
```

Token: `{ "container": { "appearances": { "dot": { "mapping": { "background": { "color": { "value": "#A3A86Bff", "type": "color" } }, "border": { "radius": { "value": "{radius.circle.value}", "type": "radius" } } } } } } }`

### Pattern I: Section Divider

Use for: visual separators between content sections

```xml
<wm-container name="divider_1" class="container-divider" variant="divider" direction="row" gap="0" alignment="middle-center" width="fill" height="1px"></wm-container>
```

Token: `{ "container": { "appearances": { "divider": { "mapping": { "background": { "color": { "value": "#E8E8E8ff", "type": "color" } } } } } } }`

### Pattern J: Image with Text Overlay (Hero Banner)

Use for: Any image with text/buttons rendered ON TOP of the image — hero sections, promotional banners, media cards, featured content. The key is using `position="relative"` on the wrapper and `position="absolute"` on the overlay container.

```xml
<wm-container name="hero_wrapper" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug" position="relative" clipcontent="true">
  <wm-picture name="hero_bg" picturesource="https://images.pexels.com/photos/54321/pexels-photo-54321.jpeg" width="100%" height="360px" resizemode="cover"></wm-picture>
  <wm-container name="hero_overlay" class="container-overlay-gradient" variant="overlay-gradient" direction="column" gap="8" alignment="bottom-left" width="fill" height="fill" position="absolute" positionvalue="0px 0px 0px 0px" padding="0 16 20 16">
    <wm-label name="hero_source" caption="Source" class="label-overlay-source" variant="overlay-source"></wm-label>
    <wm-label name="hero_title" caption="Title Text" class="label-overlay-title" variant="overlay-title"></wm-label>
    <wm-label name="hero_desc" caption="Short description text" class="label-overlay-desc" variant="overlay-desc" nooflines="2"></wm-label>
    <wm-button name="hero_cta" caption="Take Action" class="btn-overlay-cta" variant="overlay-cta"></wm-button>
  </wm-container>
</wm-container>
```

Overlay gradient token:
```json
{ "container": { "appearances": { "overlay-gradient": { "mapping": {
  "background": { "color": { "value": "rgba(0,0,0,0.5)", "type": "color" } }
} } } } }
```

### Pattern K: Full-Bleed Carousel with Text Overlay

Use for: Hero carousels in streaming apps, news feeds, promotional sliders — full-width slides with text overlaid on each image.

**CRITICAL**: Override carousel defaults (`slide.padding: 0`, `slide.transform: none`) + use overlay pattern inside each slide + set `controls="indicators"` for dots only.

```xml
<wm-carousel name="hero_carousel" type="dynamic" dataset="bind:Variables.heroSlides.dataSet" animation="auto" animationinterval="5" controls="indicators" enablegestures="true" class="carousel-hero" variant="hero">
  <wm-carousel-template name="hero_tmpl">
    <wm-container name="slide_wrapper" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug" position="relative" clipcontent="true">
      <wm-picture name="slide_img" picturesource="bind:Variables.heroSlides.dataSet[$i].image" width="100%" height="400px" resizemode="cover"></wm-picture>
      <wm-container name="slide_overlay" class="container-overlay-gradient" variant="overlay-gradient" direction="column" gap="8" alignment="bottom-left" width="fill" height="fill" position="absolute" positionvalue="0px 0px 0px 0px" padding="0 16 24 16">
        <wm-label name="slide_tag" caption="bind:Variables.heroSlides.dataSet[$i].source" class="label-overlay-source" variant="overlay-source"></wm-label>
        <wm-label name="slide_title" caption="bind:Variables.heroSlides.dataSet[$i].title" class="label-overlay-title" variant="overlay-title"></wm-label>
        <wm-label name="slide_desc" caption="bind:Variables.heroSlides.dataSet[$i].description" class="label-overlay-desc" variant="overlay-desc" nooflines="2"></wm-label>
        <wm-button name="slide_cta" caption="bind:Variables.heroSlides.dataSet[$i].cta" class="btn-overlay-cta" variant="overlay-cta"></wm-button>
      </wm-container>
    </wm-container>
  </wm-carousel-template>
</wm-carousel>
```

Carousel token (override slide defaults for full-bleed):
```json
{ "carousel": { "appearances": { "hero": { "mapping": {
  "slide": {
    "padding": { "value": "{space.0.value}", "type": "space" },
    "transform": { "value": "none", "type": "radius" }
  }
} } } } }
```

### Pattern L: Dark Page with Custom Container Tab Bar

Use for: Any dark-themed page. **NEVER** use `wm-mobile-tabbar` on dark pages — its colors come from theme variables that default to light/white and cannot be overridden via per-page tokens.

**Page structure** — `padding="0px"` on page-content, per-section padding instead:
```xml
<wm-page name="DarkPage">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="0px">
      <wm-container name="main_content" class="container-dark-page" variant="dark-page" direction="column" gap="20" alignment="top-left" width="fill" height="fill">

        <!-- Sections with per-section horizontal padding -->
        <wm-container name="section_1" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug" padding="0 16"
          <!-- section content -->
        </wm-container>

        <!-- Full-bleed section (no side padding) -->
        <wm-list name="horizontal_list" dataset="bind:Variables.items.dataSet" direction="row" gap="10" navigation="None" pagesize="20" hidehorizontalscrollbar="true" class="list-flat" variant="flat">
          <wm-listtemplate name="item_tmpl" class="list-template-flat" variant="flat">
            <!-- item content -->
          </wm-listtemplate>
        </wm-list>

        <!-- Custom dark tab bar — fixed at bottom -->
        <wm-container name="tab_bar" class="container-dark-tabbar" variant="dark-tabbar" direction="row" gap="auto" alignment="center" width="fill" height="hug" padding="12" position="fixed" positionvalue="auto auto 0px auto">
          <wm-container name="tab_1" class="app-default-container" direction="column" gap="4" alignment="top-center" width="hug" height="hug">
            <wm-icon name="tab_1_icon" iconclass="fa fa-home" class="icon-tab" variant="tab"></wm-icon>
            <wm-label name="tab_1_label" caption="Home" class="label-tab" variant="tab"></wm-label>
          </wm-container>
          <wm-container name="tab_2" class="app-default-container" direction="column" gap="4" alignment="top-center" width="hug" height="hug">
            <wm-icon name="tab_2_icon" iconclass="fa fa-user" class="icon-tab-active" variant="tab-active"></wm-icon>
            <wm-label name="tab_2_label" caption="Profile" class="label-tab-active" variant="tab-active"></wm-label>
          </wm-container>
          <wm-container name="tab_3" class="app-default-container" direction="column" gap="4" alignment="top-center" width="hug" height="hug">
            <wm-icon name="tab_3_icon" iconclass="fa fa-bookmark" class="icon-tab" variant="tab"></wm-icon>
            <wm-label name="tab_3_label" caption="Saved" class="label-tab" variant="tab"></wm-label>
          </wm-container>
        </wm-container>

      </wm-container>
    </wm-page-content>
  </wm-content>
</wm-page>
```

### Key Rules Demonstrated

1. **Static captions** — All visible text (`caption="Size"`, `caption="$148"`) uses literal values, NOT `bind:`. The only exception is inside `wm-listtemplate` where `bind:Variables.x.dataSet[$i].field` is required.
2. **Font Awesome icons** — `fa fa-chevron-left`, `fa fa-heart-o`, `fa fa-plus`, `fa fa-minus`. Only use confirmed `wi wi-*` icons (see layout-rules.md).
3. **Pexels images** — Each picture uses a distinct Pexels URL with a different photo ID.
4. **class + variant** — Every styled widget: `class="btn-icon-circle" variant="icon-circle"`.
5. **Token format** — `{ "component": { "appearances": { "name": { "mapping": { "prop": { "value": "...", "type": "..." } } } } } }`.

## Common Mistakes

See SKILL.md "Common Mistakes" table for the full reference. Key pitfalls:
- `bind:` outside `wm-listtemplate` → renders empty in preview (use static captions)
- Root key `"button"` → use `"btn"` for buttons
- Main wrapper `height="hug"` → use `height="fill"` to anchor bottom bars
- `wm-mobile-tabbar` inside `wm-content` → must be outside, directly in `wm-page`
- a space-between keyword (`center`/`start`/`end`) on a numeric-gap container → silently renders `top-left`; use a fixed value (e.g. `middle-center`)
