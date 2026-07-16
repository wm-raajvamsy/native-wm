---
name: interaction-patterns
description: >
  Event handlers (on-* prefix), data binding syntax (bind: prefix), list binding with dataset /
  datafield / displayfield attributes, and list template variable and attribute rules. Load when
  wiring up events, binding expressions, or configuring any data-driven list or repeater widget.
---

# Interaction Patterns: Events, Binding, Lists

## Event Handlers

Use `on-` prefix in markup (transpiles to camelCase props):

```xml
<!-- Tap/click -->
<wm-button caption="Submit" on-tap="submitForm($event)"></wm-button>
<wm-button caption="Save" on-click="saveData($event)"></wm-button>

<!-- With parameters -->
<wm-button on-tap="doSomething($event, $item, customArg)"></wm-button>

<!-- Change events on inputs -->
<wm-text name="email" on-change="validateEmail($event, widget, newVal, oldVal)"></wm-text>
<wm-select name="country" on-change="onCountryChange($event, widget, newVal, oldVal)"></wm-select>
```

Common events: `on-tap`, `on-click`, `on-change`, `on-focus`, `on-blur`, `on-submit`

## Data Binding

Use `bind:` prefix for reactive data binding:

```xml
<!-- Variable binding -->
<wm-label caption="bind:Variables.userName.dataSet.name"></wm-label>

<!-- Two-way binding (inputs) -->
<wm-text datavalue="bind:Variables.formData.dataSet.email"></wm-text>

<!-- Expression binding -->
<wm-label caption="bind:Variables.user.dataSet.firstName + ' ' + Variables.user.dataSet.lastName"></wm-label>

<!-- Conditional show/hide -->
<wm-container name="logged_in_section" class="app-default-container" direction="column" gap="8" alignment="top-left" width="fill" height="hug" show="bind:Variables.isLoggedIn.dataSet"></wm-container>

<!-- Widget value reference -->
<wm-label caption="bind:Widgets.searchInput.datavalue"></wm-label>
```

## List with Data Binding

```xml
<wm-list name="userList" dataset="bind:Variables.users.dataSet" direction="column" gap="8" navigation="None" pagesize="20" class="list-flat" variant="flat">
  <wm-listtemplate name="userListTemplate" class="list-template-flat" variant="flat" direction="row" gap="12" alignment="middle-left" width="fill" height="hug" padding="12">
    <wm-picture name="user_avatar" picturesource="bind:Variables.users.dataSet[$i].avatar" width="48px" height="48px" shape="circle"></wm-picture>
    <wm-container name="user_details" class="app-default-container" direction="column" gap="4" alignment="top-left" width="fill" height="hug">
      <wm-label name="user_name" caption="bind:Variables.users.dataSet[$i].name" class="label-user-name" variant="user-name"></wm-label>
      <wm-label name="user_email" caption="bind:Variables.users.dataSet[$i].email" class="label-user-email" variant="user-email"></wm-label>
    </wm-container>
  </wm-listtemplate>
</wm-list>
```

**List attributes**: `dataset`, `direction` (`column`/`row` — NOT `vertical`/`horizontal`), `gap` (NOT `spacing`), `navigation` (Scroll/On-Demand/None), `pagesize`, `itemsperrow`, `hidehorizontalscrollbar`

**List item variables**: `$i` for index, access fields via `Variables.varName.dataSet[$i].fieldName`
