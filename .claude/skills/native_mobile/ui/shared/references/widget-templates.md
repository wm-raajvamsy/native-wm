---
name: widget-templates
description: >
  Copy-paste XML markup templates for all widget categories: basic (label, button, icon, picture),
  input (text, select, checkbox, radio, date, slider), data (list with template, table), container
  and layout, navigation, dialog, advanced (carousel, bottomsheet, wizard, accordion), and chart
  widgets. Load when you need a correct starting-point template for any widget type.
---

# WaveMaker Widget Templates

All tags are paired (never self-closing). No space between tags for widgets without children.

> ⚠️ **`fill` / `hug` sizes are ONLY valid on `wm-container`, `wm-list`, and `wm-listtemplate`.**
> NEVER set `width="fill"` or `height="hug"` on leaf widgets (`wm-button`, `wm-label`, `wm-icon`, `wm-picture`, `wm-rating`, `wm-checkbox`, `wm-switch`, `wm-select`, `wm-text`, `wm-number`, `wm-date`, `wm-search`, `wm-chips`, `wm-slider`, `wm-progress-bar`, `wm-spinner`, `wm-anchor`, `wm-message`, `wm-form-field`, `wm-login`).
> Leaf widgets do NOT auto-stretch — set their width from the design: `width="100%"` when it spans the full width, `Npx` for a fixed size, `N%` for proportional / side-by-side, or omit for natural content width.

## Basic Widgets

```xml
<wm-label name="" caption="text" nooflines=""></wm-label>

<wm-button name="" caption="text" class="btn-default" iconclass="" iconposition="left|right"></wm-button>

<wm-icon name="" iconclass="fa fa-home" iconsize="24px"></wm-icon>

<wm-picture name="" picturesource="url" resizemode="cover|contain|stretch" shape="circle|square" width="Npx" height="Npx" aspectratio="" pictureplaceholder=""></wm-picture>

<wm-anchor name="" caption="text" hyperlink="#" iconclass=""></wm-anchor>

<wm-spinner name="" caption="" iconclass="" iconsize="Npx"></wm-spinner>

<wm-message name="" caption="" title="" type="success|warning|error|info|loading" hideclose="false"></wm-message>

<wm-progress-bar name="" datavalue="75" minvalue="0" maxvalue="100" type="default|success|info|warning|danger"></wm-progress-bar>

<wm-progress-circle name="" datavalue="75" minvalue="0" maxvalue="100" title="" subtitle="" captionplacement="inside"></wm-progress-circle>

<wm-skeleton name=""><!-- children shown as skeleton --></wm-skeleton>

<wm-search name="" placeholder="Search..." dataset="" searchkey="" type="search|autocomplete" minchars="1" limit="5" iconclass="wm-sl-l sl-search" showclear="false" debouncetime="0" on-submit="handler()"></wm-search>

<wm-bottomsheet name="" showonrender="false" bottomsheetheightratio="0.3" expand="false" bottomsheetexpandedheightratio="0.5" modal="true" autoclose="outsideClick" disableswipedownclose="false">
  <!-- sheet content -->
</wm-bottomsheet>
```

## Input Widgets

```xml
<wm-text name="" placeholder="" datavalue="" floatinglabel="" hint="" maxchars="" readonly="false" required="false" type="text|email|password" variant="filled|outlined" leadingiconclass="" trailingiconclass="" on-change="handler()" on-leadingiconclick="handler()" on-trailingiconclick="handler()"></wm-text>

<wm-textarea name="" placeholder="" datavalue="" maxchars="" floatinglabel=""></wm-textarea>

<wm-number name="" placeholder="" datavalue="" floatinglabel="" variant="filled|outlined" minvalue="" maxvalue="" step="1"></wm-number>

<wm-currency name="" placeholder="" datavalue="" floatinglabel="" variant="filled|outlined" currency="USD" minvalue="" maxvalue="" step="0.01"></wm-currency>

<wm-select name="" dataset="opt1,opt2,opt3" datavalue="" datafield="" displayfield="" placeholder="Choose..."></wm-select>

<wm-checkbox name="" caption="Label" datavalue="" checkedvalue="true" uncheckedvalue="false"></wm-checkbox>

<wm-checkboxset name="" dataset="" datavalue="" datafield="" displayfield="" itemsperrow="xs-1 sm-2"></wm-checkboxset>

<wm-radioset name="" dataset="" datavalue="" datafield="" displayfield="" itemsperrow="xs-1 sm-2"></wm-radioset>

<wm-checkbox name="" caption="" type="toggle" accessibilityrole="togglebutton" datavalue="" checkedvalue="true" uncheckedvalue="false"></wm-checkbox>

<wm-switch name="" dataset="" datavalue="" datafield=""></wm-switch>

<wm-slider name="" datavalue="50" minvalue="0" maxvalue="100" step="1"></wm-slider>

<wm-rating name="" datavalue="" maxvalue="5" readonly="false" iconsize="Npx" showcaptions="false"></wm-rating>

<wm-date name="" datavalue="" placeholder="" datepattern="yyyy-MM-dd" mindate="" maxdate="" outputformat="yyyy-MM-dd"></wm-date>

<wm-time name="" datavalue="" placeholder="" outputformat="HH:mm:ss"></wm-time>

<wm-datetime name="" datavalue="" placeholder="" outputformat="timestamp"></wm-datetime>

<wm-chips name="" dataset="" datafield="" displayfield="" placeholder="" searchable="true" maxsize="" selectediconclass="wm-sl-l sl-check" selectionmode="single|multiple" datavalue=""></wm-chips>

<!-- Filter pill row pattern (single-select, pre-selected item) -->
<wm-chips name="filter_chips" dataset="bind:Variables.filterOptions.dataSet" datafield="label" displayfield="label" datavalue="All" selectionmode="single" searchable="false" class="chips-filter-row" variant="filter-row"></wm-chips>

<wm-fileupload name="" caption="Upload" iconclass="" contenttype=""></wm-fileupload>

<wm-calendar name="" dataset="" datavalue="" eventstart="" view="month"></wm-calendar>
```

## Data Widgets

```xml
<!-- List with template (for repeated items) -->
<wm-list name="" dataset="bind:Variables.items.dataSet" direction="column|row" gap="8" itemsperrow="xs-1" navigation="Scroll|On-Demand|None" pagesize="20" on-tap="handler($event, $item)">
  <wm-listtemplate name="">
    <!-- Item template: use bind:Variables.items.dataSet[$i].field -->
  </wm-listtemplate>
</wm-list>

<!-- Card with structured content -->
<wm-card name="" title="" subheading="" iconclass="" picturesource="">
  <wm-card-content name="">
    <!-- card body -->
  </wm-card-content>
  <wm-card-footer name="">
    <!-- card footer / actions -->
  </wm-card-footer>
</wm-card>

<!-- Form — CRITICAL rules:
     1. Exactly two direct wm-container children: body container + actions container.
     2. wm-form-field elements are DIRECT children of the body container — NEVER wrap each field in its own container.
     3. Only use nested containers inside the body container for non-field elements (labels, links) between fields.
     4. itemsperrow is required. -->
<wm-form name="" title="" captionposition="top|left|floating" captionalign="left" itemsperrow="xs-1 sm-1 md-1 lg-1" method="post" dataset="bind:Variables.formData.dataSet">
  <wm-container name="fields_container" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="" key="" displayname="Label" type="string|number|date" widget="text|number|select|date|radioset|checkboxset|rating|toggle|chips|currency|textarea|slider" required="false" placeholder="" dataset=""></wm-form-field>
    <!-- nested container for any inline non-field element, e.g. forgot password link -->
    <!-- <wm-container name="extra_row" ...><wm-label .../></wm-container> -->
  </wm-container>
  <wm-container name="actions_container" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
    <wm-form-action name="" display-name="Save" type="submit" update-mode="true" class="btn-primary" iconclass=""></wm-form-action>
  </wm-container>
</wm-form>

<!-- Live form (database CRUD) -->
<wm-liveform name="" dataset="bind:Variables.liveVar.dataSet" formdata="bind:Variables.liveVar.dataSet" itemsperrow="xs-1 sm-1 md-1 lg-1">
  <wm-container name="fields_container" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
    <wm-form-field name="" key="" displayname="" type="" widget=""></wm-form-field>
  </wm-container>
  <wm-container name="actions_container" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
    <wm-form-action name="" display-name="Save" type="submit" update-mode="true" class="btn-success"></wm-form-action>
  </wm-container>
</wm-liveform>
```

## Container / Layout Widgets

```xml
<!-- Auto-layout container (6 mandatory attrs + optional) -->
<wm-container name="" class="app-default-container" direction="row|column" gap="N|auto" alignment="top-left|top-center|top-right|middle-left|middle-center|middle-right|bottom-left|bottom-center|bottom-right|start|center|end" width="fill|hug|Npx|N%" height="fill|hug|Npx|N%" padding="N|N N|N N N N" overflow="No scrolling|Scroll" wrap="true|false" columngap="N|auto">
  <!-- children -->
</wm-container>

<!-- Panel (collapsible section) -->
<wm-panel name="" title="" subheading="" collapsible="false" expanded="true" iconclass="">
  <wm-panel-content name=""><!-- body --></wm-panel-content>
  <wm-panel-footer name=""><!-- footer --></wm-panel-footer>
</wm-panel>

<!-- Tabs -->
<wm-tabs name="" defaultpaneindex="0" enablegestures="true">
  <wm-tabpane name="" title="Tab 1" iconclass=""><!-- content --></wm-tabpane>
  <wm-tabpane name="" title="Tab 2" iconclass=""><!-- content --></wm-tabpane>
</wm-tabs>

<!-- Accordion -->
<wm-accordion name="" defaultpaneindex="0" closeothers="true">
  <wm-accordionpane name="" title="Section" iconclass="" badgevalue="">
    <!-- content -->
  </wm-accordionpane>
</wm-accordion>

<!-- Wizard -->
<wm-wizard name="" defaultstep="0" cancelable="true" nextbtnlabel="Next" previousbtnlabel="Back" donebtnlabel="Done">
  <wm-wizardstep name="" title="Step 1" iconclass="" description="">
    <!-- step content -->
  </wm-wizardstep>
</wm-wizard>

<!-- Multi-column layout (container-based — NEVER use wm-layoutgrid/wm-gridrow/wm-gridcolumn) -->
<wm-container name="" class="app-default-container" direction="row" gap="8" alignment="top-left" width="fill" height="hug">
  <wm-container name="" class="app-default-container" direction="column" gap="4" alignment="top-left" width="48%" height="hug"><!-- col 1 --></wm-container>
  <wm-container name="" class="app-default-container" direction="column" gap="4" alignment="top-left" width="48%" height="hug"><!-- col 2 --></wm-container>
</wm-container>

<!-- Tile -->
<wm-tile name=""><!-- content --></wm-tile>
```

## Navigation Widgets

```xml
<wm-mobile-navbar name="" title="" backbutton="true" backbuttoniconclass="wi wi-back" searchbutton="false" searchbuttoniconclass="wm-sl-l sl-search" hideonscroll="false"></wm-mobile-navbar>

<wm-mobile-tabbar name="" dataset="" itemlabel="" itemicon="" itemlink=""></wm-mobile-tabbar>

<wm-menu name="" caption="" iconclass="" dataset="" itemlabel="" itemicon="" itemlink="" animateitems="slide"></wm-menu>

<wm-popover name="" caption="" iconclass="" type="action-sheet|dropdown" autoclose="outsideClick" title="" draghandle="false">
  <!-- popover content -->
</wm-popover>

<wm-nav name="" dataset="" itemlabel="" itemlink="" itemicon="" itembadge="" type="pills"></wm-nav>
```

## Dialog Widgets

```xml
<wm-alertdialog name="" title="" message="" oktext="OK" alerttype="" iconclass=""></wm-alertdialog>

<wm-confirmdialog name="" title="" message="" oktext="Yes" canceltext="No" iconclass=""></wm-confirmdialog>

<wm-dialog name="" title="" closable="true" modal="true" iconclass="">
  <wm-dialogcontent name=""><!-- body --></wm-dialogcontent>
  <wm-dialogactions name=""><!-- buttons --></wm-dialogactions>
</wm-dialog>
```

## Advanced Widgets

```xml
<wm-carousel name="" dataset="" type="static|dynamic" animation="auto" animationinterval="3" controls="both|navs|indicators|none" enablegestures="true" stopatlast="false">
  <wm-carousel-template name="">
    <!-- slide template -->
  </wm-carousel-template>
</wm-carousel>

<wm-webview name="" src=""></wm-webview>

<wm-video name="" mp4format="" autoplay="false" controls="true" loop="false" videoposter=""></wm-video>

<wm-audio name="" mp3format="" autoplay="false" controls="true" loop="false"></wm-audio>

<wm-lottie name="" source="" autoplay="true" loop="true" speed="1"></wm-lottie>

<wm-camera name="" capturetype="IMAGE" iconclass="" caption="Camera"></wm-camera>

<wm-barcodescanner name="" barcodeformat="ALL" caption="Scan" iconclass=""></wm-barcodescanner>

<wm-login name=""></wm-login>
```

## Chart Widgets

Every chart is ONE generic tag `<wm-chart type="...">` — there are no per-type tags. The `type` value is capitalized and case-sensitive: `Line`, `Area`, `Column`, `Bar`, `Pie`, `Donut`, `Bubble`, `Stack`.

```xml
<wm-chart type="Column" name="" dataset="" xaxisdatakey="" yaxisdatakey="" height="250px"></wm-chart>
```

- `Column` = vertical bars, `Bar` = horizontal bars.
- Pie/Donut use the SAME `xaxisdatakey` (label field) + `yaxisdatakey` (value field) — never `labelkey`/`datakey`.
- Multi-series: comma-separate the value fields in `yaxisdatakey` (`yaxisdatakey="sales,profit"`).
- `height` MUST be a fixed px value (never a percentage/`fill`).

Full attribute reference and per-type examples: `wavemaker-mobile-charts`.
