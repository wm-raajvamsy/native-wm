---
name: advanced-widgets
description: >
  Complex multi-widget markup patterns with full XML examples: list templates with cards and footers,
  tabs, accordions, panels, wizards, dialogs, carousels (simple and hero with text overlay), bottom sheets,
  multi-column layouts, and navigation elements. Load when the screen contains any composite or
  non-trivial widget arrangement not covered by widget-templates.
---

# Advanced Widget Composition Patterns

## List with Template (Repeated Items)

`wm-listtemplate` IS an auto-layout container — put `direction`, `gap`, `alignment`, `padding` directly on it. NEVER add a wrapper `wm-container` just for layout.

```xml
<wm-list name="user_list" dataset="bind:Variables.users.dataSet" direction="column" gap="8" navigation="None" pagesize="20" class="list-flat" variant="flat">
  <wm-listtemplate name="user_list_tmpl" class="list-template-flat" variant="flat" direction="row" gap="12" alignment="middle-left" width="fill" height="hug" padding="12">
    <wm-picture name="user_avatar" picturesource="bind:Variables.users.dataSet[$i].avatar" width="48px" height="48px" shape="circle"></wm-picture>
    <wm-container name="user_info" class="app-default-container" direction="column" gap="4" alignment="top-left" width="fill" height="hug">
      <wm-label name="user_name" caption="bind:Variables.users.dataSet[$i].name" class="label-user-name" variant="user-name"></wm-label>
      <wm-label name="user_email" caption="bind:Variables.users.dataSet[$i].email" class="label-user-email" variant="user-email"></wm-label>
    </wm-container>
    <wm-icon name="user_chevron" iconclass="fa fa-chevron-right" class="icon-list-chevron" variant="list-chevron"></wm-icon>
  </wm-listtemplate>
</wm-list>
```

## Card with Content & Footer

```xml
<wm-card name="product_card" title="Product Name" subheading="Category" picturesource="https://images.pexels.com/photos/123/pexels-photo-123.jpeg" iconclass="fa fa-star">
  <wm-card-content name="product_card_body">
    <wm-label name="product_desc" caption="Product description text" class="label-card-desc" variant="card-desc"></wm-label>
    <wm-label name="product_price" caption="$99.99" class="label-card-price" variant="card-price"></wm-label>
  </wm-card-content>
  <wm-card-footer name="product_card_footer">
    <wm-button name="add_cart_btn" caption="Add to Cart" class="btn-primary" iconclass="fa fa-shopping-cart"></wm-button>
  </wm-card-footer>
</wm-card>
```

## Tabs with Tab Panes

```xml
<wm-tabs name="profile_tabs" defaultpaneindex="0" enablegestures="true">
  <wm-tabpane name="tab_overview" title="Overview" iconclass="fa fa-user">
    <!-- Tab 1 content -->
  </wm-tabpane>
  <wm-tabpane name="tab_activity" title="Activity" iconclass="fa fa-clock-o">
    <!-- Tab 2 content -->
  </wm-tabpane>
  <wm-tabpane name="tab_settings" title="Settings" iconclass="fa fa-cog">
    <!-- Tab 3 content -->
  </wm-tabpane>
</wm-tabs>
```

## Accordion

```xml
<!-- defaultpaneindex: 0-indexed. The pane showing ↓ chevron / active header in design gets this index.
     All-collapsed design → defaultpaneindex="-1". -->
<wm-accordion name="faq_accordion"
  defaultpaneindex="0"
  closeothers="true"
  expandediconclass="wi-chevron-down"
  collapsediconclass="wi-chevron-up">
  <!-- First pane: open (expanded) — matches defaultpaneindex="0" -->
  <wm-accordionpane name="faq_1" title="How do I reset my password?" iconclass="fa fa-question-circle">
    <wm-label name="faq_1_answer" caption="Go to Settings > Security > Reset Password"></wm-label>
  </wm-accordionpane>
  <!-- Second pane: collapsed -->
  <wm-accordionpane name="faq_2" title="How do I contact support?" subheading="Response in 24h" badgevalue="New">
    <wm-label name="faq_2_answer" caption="Email us at support@example.com"></wm-label>
  </wm-accordionpane>
  <!-- Third pane: collapsed, last pane gets rounded bottom corners automatically -->
  <wm-accordionpane name="faq_3" title="Billing questions">
    <wm-label name="faq_3_answer" caption="Visit billing.example.com"></wm-label>
  </wm-accordionpane>
</wm-accordion>
```

**Active header styling (default):** The expanded pane header automatically receives `states.active.header.background-color` (primary brand color) and white title/icon. Only add token overrides if the design uses a different color.

**Custom toggle icons** (e.g., + / −):
```xml
<wm-accordion name="settings_accordion"
  defaultpaneindex="1"
  expandediconclass="wi-minus"
  collapsediconclass="wi-plus">
  ...
</wm-accordion>
```

## Panel (Collapsible Section)

```xml
<wm-panel name="details_panel" title="Order Details" subheading="Order #12345" collapsible="true" expanded="true" iconclass="fa fa-shopping-bag">
  <wm-panel-content name="details_panel_body">
    <!-- panel body content -->
  </wm-panel-content>
  <wm-panel-footer name="details_panel_footer">
    <wm-button name="reorder_btn" caption="Reorder"></wm-button>
  </wm-panel-footer>
</wm-panel>
```

## Wizard (Multi-Step)

```xml
<wm-wizard name="signup_wizard" defaultstep="0" cancelable="true" nextbtnlabel="Continue" donebtnlabel="Submit">
  <wm-wizardstep name="step_personal" title="Personal Info" iconclass="fa fa-user" description="Name and email">
    <wm-text name="wiz_name" placeholder="Full Name" required="true"></wm-text>
    <wm-text name="wiz_email" placeholder="Email" type="email" required="true"></wm-text>
  </wm-wizardstep>
  <wm-wizardstep name="step_address" title="Address" iconclass="fa fa-map-marker" description="Shipping address">
    <wm-textarea name="wiz_address" placeholder="Address"></wm-textarea>
  </wm-wizardstep>
  <wm-wizardstep name="step_confirm" title="Confirm" iconclass="fa fa-check" description="Review and submit">
    <wm-label name="wiz_summary" caption="Please review your information"></wm-label>
  </wm-wizardstep>
</wm-wizard>
```

## Dialogs

```xml
<!-- Alert -->
<wm-alertdialog name="success_alert" title="Success" message="Your changes have been saved." oktext="OK" iconclass="fa fa-check-circle"></wm-alertdialog>

<!-- Confirm -->
<wm-confirmdialog name="delete_confirm" title="Delete Item" message="This action cannot be undone." oktext="Delete" canceltext="Cancel" iconclass="fa fa-exclamation-triangle"></wm-confirmdialog>

<!-- Custom dialog -->
<wm-dialog name="edit_dialog" title="Edit Profile" closable="true" modal="true" iconclass="fa fa-edit">
  <wm-dialogcontent name="edit_dialog_body">
    <wm-text name="dialog_name" placeholder="Name" datavalue=""></wm-text>
    <wm-text name="dialog_email" placeholder="Email" datavalue=""></wm-text>
  </wm-dialogcontent>
  <wm-dialogactions name="edit_dialog_actions">
    <wm-button name="dialog_save" caption="Save" class="btn-primary"></wm-button>
    <wm-button name="dialog_cancel" caption="Cancel"></wm-button>
  </wm-dialogactions>
</wm-dialog>
```

## Navigation

```xml
<!-- App top bar -->
<wm-mobile-navbar name="top_navbar" title="My App" backbutton="true" backbuttoniconclass="wi wi-back" searchbutton="true" searchbuttoniconclass="wm-sl-l sl-search"></wm-mobile-navbar>

<!-- Bottom tab bar — MUST be placed outside <wm-content>, directly inside <wm-page> -->
<wm-mobile-tabbar name="bottom_tabbar" dataset="" itemlabel="" itemicon="" itemlink=""></wm-mobile-tabbar>

<!-- Dropdown menu -->
<wm-menu name="actions_menu" caption="More" iconclass="fa fa-ellipsis-v" dataset="Edit,Delete,Share" itemlabel=""></wm-menu>

<!-- Popover -->
<wm-popover name="filter_popover" caption="Filter" iconclass="fa fa-filter" type="dropdown" autoclose="outsideClick">
  <wm-container name="filter_body" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
    <wm-select name="filter_category" placeholder="Category" dataset="All,Electronics,Clothing"></wm-select>
    <wm-slider name="filter_price" minvalue="0" maxvalue="1000"></wm-slider>
    <wm-button name="filter_apply" caption="Apply" class="btn-primary"></wm-button>
  </wm-container>
</wm-popover>
```

## Carousel

### Simple Image Carousel (peek effect OK)
```xml
<wm-carousel name="promo_carousel" type="dynamic" dataset="bind:Variables.promos.dataSet" animation="auto" animationinterval="3" controls="both" enablegestures="true">
  <wm-carousel-template name="promo_slide_tmpl">
    <wm-picture name="promo_img" picturesource="bind:Variables.promos.dataSet[$i].image" width="100%" height="200px" resizemode="cover"></wm-picture>
  </wm-carousel-template>
</wm-carousel>
```

### Full-Bleed Hero Carousel with Text Overlay (CRITICAL PATTERN)
Use for: Streaming apps, news feeds, promotional pages — any full-width carousel where text overlays each slide image.

**3 things that MUST be overridden:**
1. `slide.padding: "0px"` — removes 16px side gaps (default causes slides to not be edge-to-edge)
2. `slide.transform: "none"` — removes 80% scaling on inactive slides (default shrinks non-active slides)
3. `controls="indicators"` — shows only dot indicators (default `"both"` adds large 48x48 prev/next arrow buttons)

```xml
<wm-carousel name="hero_carousel" type="dynamic" dataset="bind:Variables.heroSlides.dataSet" animation="auto" animationinterval="5" controls="indicators" enablegestures="true" class="carousel-hero-fullbleed" variant="hero-fullbleed">
  <wm-carousel-template name="hero_tmpl">
    <wm-container name="slide_wrap" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug" position="relative" clipcontent="true">
      <wm-picture name="slide_bg" picturesource="bind:Variables.heroSlides.dataSet[$i].image" width="100%" height="400px" resizemode="cover"></wm-picture>
      <wm-container name="slide_text_overlay" class="container-overlay-gradient" variant="overlay-gradient" direction="column" gap="8" alignment="bottom-left" width="fill" height="fill" position="absolute" positionvalue="0px 0px 0px 0px" padding="0 16 24 16">
        <wm-label name="slide_source" caption="bind:Variables.heroSlides.dataSet[$i].source" class="label-overlay-source" variant="overlay-source"></wm-label>
        <wm-label name="slide_title" caption="bind:Variables.heroSlides.dataSet[$i].title" class="label-overlay-title" variant="overlay-title"></wm-label>
        <wm-label name="slide_desc" caption="bind:Variables.heroSlides.dataSet[$i].description" class="label-overlay-desc" variant="overlay-desc" nooflines="2"></wm-label>
        <wm-button name="slide_cta" caption="bind:Variables.heroSlides.dataSet[$i].cta" class="btn-overlay-cta" variant="overlay-cta"></wm-button>
      </wm-container>
    </wm-container>
  </wm-carousel-template>
</wm-carousel>
```

Carousel token (full-bleed override):
```json
{ "carousel": { "appearances": { "hero-fullbleed": { "mapping": {
  "slide": {
    "padding": { "value": "{space.0.value}", "type": "space" },
    "transform": { "value": "none", "type": "radius" }
  }
} } } } }
```

Overlay gradient token:
```json
{ "container": { "appearances": { "overlay-gradient": { "mapping": {
  "background": { "color": { "value": "rgba(0,0,0,0.5)", "type": "color" } }
} } } } }
```

## Bottom Sheet

Full documentation: load the `wavemaker-bottomsheet` skill. Key rule: open/close via `Widgets.<name>.open()` / `Widgets.<name>.close()` — the sheet does NOT open on its own.

```xml
<wm-button name="open_btn" iconclass="fa fa-ellipsis-v"
  on-tap="Widgets.options_sheet.open()"></wm-button>

<wm-bottomsheet name="options_sheet" bottomsheetheightratio="0.35" autoclose="outsideClick">
  <wm-container name="sheet_body" class="app-default-container" direction="column" gap="0"
    alignment="top-left" width="fill" height="hug">
    <wm-label name="sheet_title" caption="Options" class="label-sheet-title" variant="sheet-title"></wm-label>
    <wm-button name="sheet_share" caption="Share" iconclass="fa fa-share-alt"></wm-button>
    <wm-button name="sheet_delete" caption="Delete" iconclass="fa fa-trash"></wm-button>
  </wm-container>
</wm-bottomsheet>
```

## Form with Varied Field Types

**CRITICAL**: `wm-form` has two direct `wm-container` children — a body container (fields + any nested non-field containers) and an actions container. Nothing else is a direct child of `wm-form`.

```xml
<wm-form name="profile_form" title="Edit Profile" captionposition="top" itemsperrow="xs-1 sm-1 md-1 lg-1" method="post">
  <!-- body container: all fields, plus nested containers for inline non-field elements -->
  <wm-container name="ff_fields" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="ff_name" key="name" displayname="Full Name" type="string" widget="text" required="true" placeholder="Enter name"></wm-form-field>
    <wm-form-field name="ff_email" key="email" displayname="Email" type="string" widget="text" placeholder="Enter email"></wm-form-field>
    <wm-form-field name="ff_phone" key="phone" displayname="Phone" type="number" widget="number"></wm-form-field>
    <wm-form-field name="ff_dob" key="dob" displayname="Date of Birth" type="date" widget="date"></wm-form-field>
    <wm-form-field name="ff_gender" key="gender" displayname="Gender" type="string" widget="radioset" dataset="Male,Female,Other"></wm-form-field>
    <wm-form-field name="ff_country" key="country" displayname="Country" type="string" widget="select" dataset="bind:Variables.countries.dataSet"></wm-form-field>
    <wm-form-field name="ff_bio" key="bio" displayname="Bio" type="string" widget="textarea" placeholder="Tell us about yourself"></wm-form-field>
    <wm-form-field name="ff_rating" key="rating" displayname="Experience Level" type="number" widget="rating"></wm-form-field>
    <wm-form-field name="ff_notify" key="notify" displayname="Email Notifications" type="boolean" widget="toggle"></wm-form-field>
  </wm-container>
  <!-- actions container: separate sibling, wraps all form-actions -->
  <wm-container name="ff_actions" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
    <wm-form-action name="fa_save" display-name="Save" type="submit" update-mode="true" class="btn-primary" iconclass="fa fa-save"></wm-form-action>
    <wm-form-action name="fa_cancel" display-name="Cancel" type="reset" update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Multi-Column Layout (Container-Based — NOT grid)

```xml
<wm-container name="stats_row" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
  <wm-container name="stat_card1" class="container-stat-card" variant="stat-card" direction="column" gap="4" alignment="top-center" width="48%" height="hug">
    <!-- stat card 1 -->
  </wm-container>
  <wm-container name="stat_card2" class="container-stat-card" variant="stat-card" direction="column" gap="4" alignment="top-center" width="48%" height="hug">
    <!-- stat card 2 -->
  </wm-container>
</wm-container>
```
