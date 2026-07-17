---
name: actions
description: "Create and configure WaveMaker actions (NavigationAction, NotificationAction, timers, etc.). Use when defining triggered behavior flows: navigation, notifications, login/logout, or any action invoked from UI events."
sub-skills:
- binding
---

# Skill: Actions

## Objective

Define and configure actions correctly with strict scope and binding rules.

## What are Actions?

- Actions assist in navigating from one page to another page or performing tasks such as notifications or toasters when a UI event occurs.
- These actions can be user-initiated, or results of another task being performed.

## Scope Rules

- Actions can be App, Page, or Partial scoped.
- JavaScript access (always use the full path):
    - App scope: `App.Actions.<name>`
    - Page scope: `Page.Actions.<name>`
    - Partial scope: `Partial.Actions.<name>`
- Markup bindings always use (no scope prefix):
    - Actions: `Actions.<name>` (e.g. `on-click="Actions.goToPage_Home.invoke()"`)
- **Partial scope:** Event handlers for components/actions inside a hosted partial must be defined in that partial’s script, not in the 
  parent page script. From a partial, access the parent page via `Partial.App.activePage` (e.g. `Partial.App.activePage.Widgets.label1`, `Partial.App.activePage.Variables.myVar`).
- For full binding syntax and examples, use the `binding` skill.

## Action Type Discovery

- Read `/catalog/actions/actions-list.md` to list all action types.
- Read `/catalog/actions/{name}/{name}.md` (e.g. `/catalog/actions/NavigationAction/NavigationAction.md`) to fetch action metadata before create/update.
- Use **platform_listPageVariables** (Required Args) for Page or Partial and **platform_listAppVariables** (No args) for App to check existing actions in scope.
- Naming: actions must be unique `lowerCamelCase`.
- Page scope by default; app scope only when cross-page reuse is required.

## Non-API-Aware Variables and Actions

Use **ui_createNonApiAwareVariable** (Required Args) for creating:

| Action Type            | Primary Use Case                                    |
| ---------------------- |-----------------------------------------------------|
| `NavigationAction`     | Page-to-page navigation with parameter passing      |
| `NotificationAction`   | Toast messages, alerts, page-level user feedback    |
| `TimerAction`          | Periodic or delayed execution triggers              |
| `LoginAction`          | User login flow                                     |
| `LogoutAction`         | User logout flow                                    |

### Rules

- Use `NavigationAction` for parameterized page routing and param passing.
- Use `NotificationAction` for page-level feedback when needed.
- Use `TimerAction` for triggering an action in a specified time interval.

- Make use of already created App scoped `NavigationAction` for page navigations or page routing. Create new `NavigationAction` only 
  if needed.

## Action Variables

- Action-type variables inherit `BaseAction` and must use `Actions` namespace.
- If needed, make use of already created App scoped Action `appNotification` (`NotificationAction`) to show toaster messages.

## Action Types with dataBinding Support (ONLY THESE TWO) + Mandatory Verification

`dataBinding` support in actions is limited to:

1. `LoginAction`
2. `NavigationAction` (target `pageName`; page params are passed through `dataSet`)

Do not assume `dataBinding` support for other action types unless metadata explicitly confirms it.

After creating either of these actions, run this mandatory verification:

1. Read `/catalog/actions/{name}/{name}.md` for the action category/operation (e.g. `/catalog/actions/LoginAction/LoginAction.md`) to fetch all declared inputs.
2. Enumerate **ALL** declared inputs for the action.
3. Add a binding entry for **EVERY** declared input:
   - Static values: map as static values.
   - Dynamic values: map using binding expressions (widget/variable/pageParams).
   - If no value is provided: still add the binding entry and keep `value` empty.
4. Never skip binding entries just because defaults appear configured elsewhere.

### Example: LoginAction dataBinding (dynamic + empty + static)

```json
{
  "loginAction": {
    "category": "wm.LoginAction",
    "dataBinding": [
      {
        "target": "j_username",
        "type": "string",
        "value": "bind:Widgets.usernameText.datavalue"
      },
      {
        "target": "j_password",
        "type": "string",
        "value": ""
      },
      {
        "target": "rememberme",
        "type": "boolean",
        "value": "true"
      }
    ]
  }
}
```

### Example: NavigationAction dataBinding + dataSet

```json
{
  "goToPage_testp": {
    "category": "wm.NavigationAction",
    "dataBinding": [
      {
        "target": "pageName",
        "value": "testp",
        "type": "string"
      }
    ],
    "dataSet": [
      {
        "type": "string",
        "target": "p1",
        "value": "bind:Widgets.<list_name>.selecteditem.userId"
      }
    ]
  }
}
```

### Decision Tree: Which Action Type to choose?

```
Select the Action type?
├── Navigate to another page     → NavigationAction
├── Show toast/alert messages    → NotificationAction
├── Trigger timed actions        → TimerAction
├── Handle user login            → LoginAction
└── Handle user logout           → LogoutAction
```

### Core Rules

- Do not reference action variables through `Variables` namespace.
- **Do not modify or delete existing actions** unless the user's use case explicitly requires it. Reuse existing app-level actions (e.g. `appNotification`, `goToPage_<PAGE_NAME>`) when they already serve the required purpose; do not recreate or overwrite them.
- Default page navigation action exists as `goToPage_<PAGE_NAME>`.
- Navigation `invoke()` examples:
    - Markup: `on-click="Actions.goToPage_<PAGE_NAME>.invoke()"`
    - JavaScript: `App.Actions.goToPage_<PAGE_NAME>.invoke()` or `Page.Actions.goToPage_<PAGE_NAME>.invoke()`
- When security is enabled or available, Login and Logout actions are available by default. Accessing login Action and logout Action in
  markup as: `on-click="Actions.<LOGIN_ACTION>.invoke()"` or JavaScript as: `Page.Actions.<LOGIN_ACTION>.invoke()`
    - Examples:
        - Markup: `on-click="Actions.loginAction.invoke()` or `on-click="Actions.logoutAction.invoke()`
        - JavaScript: `App.Actions.loginAction.invoke();` or `App.Actions.logoutAction.invoke();`
- For app-level status/error feedback, prefer:
    - For toaster type of notification:
        - `
          App.Actions.appNotification.invoke({
          message: 'An error occurred. Please try again.',
          position: "bottom right",
          class: 'error',
          duration: 5000
          });
          `
    - For alert type of notifications, prefer:
        - `App.Actions.notificationAction1.invoke({
          title: 'Alert Title',
          message: 'Alert Message here',
          alerttype: 'error',
          okButtonText: 'OK'
          });`
- `NavigationAction` should not be created for Partial scoped pages.
- Do not use `.then()` or `.catch()` on WaveMaker methods such as `invoke()`; use action lifecycle events and callback patterns defined by 
  metadata instead.

## Action Configuration

- Prefer declarative implementation first: make changes in declarative files (`.html`, variables JSON) instead of JavaScript whenever possible.
- In markup, prefer declarative attributes first, then bindings only when needed; use JavaScript only for behavior that cannot be achieved declaratively.
- Prefer declarative `dataBinding` in variable JSON using updateVariable tool call over JS `setInput`.
- In action JSON, metadata properties and events can be represented as key-value pairs under the action variable name.
- Methods from action metadata are not configured in action JSON; methods can only be invoked in JavaScript page script files. Example: Page.Actions.<actionVarName>.invoke();
- For App-scoped action variables, add event handler function implementations in `app.js` (not in page script files).
- If JavaScript invocation is required, pass inputs
    - For **Login Action** use `input` before `invoke()`
        - **Example:**
      ```javascript
      App.Actions.loginAction.invoke({
        input: {
            j_username: <value>,
            j_password: <value>
        }
      })
      ```
- NOTE: Do not bind widget properties to `dataBinding` paths.
  Wrong example: `datavalue="bind:Actions.loginAction.dataBinding.j_username"`

### NavigationAction Params

- NavigationAction page params are passed through `dataSet`.
- Static values, widget bindings, variable bindings, and page-param bindings can be used as `dataSet` values.
- For page-param binding values in `dataSet`, use `bind:pageParams.<page_param_name>`.
- INVALID page param format:
  - `bind:Pages.<pageName>.params.<param_name>`
  - `bind:Pages.Dashboard.params.categoryId`

Example NavigationAction `dataSet` page param:

```json
{
  "dataSet": [
    {
      "type": "string",
      "target": "categoryId",
      "value": "bind:pageParams.categoryId"
    }
  ]
}
```

### Action Metadata Representation in JSON

- Notification action (alert operation) example with metadata property and event:

```json
{
  "notificationAction1": {
    "category": "wm.NotificationAction",
    "operation": "alert",
    "onOk": "notificationAction1onOk(variable, data, options)"
  }
}
```
onOk event handler added in json is written in javascript like below 
```javascript
    Page.notificationAction1onOk = function (variable, data) {
        // CODE GOES HERE
    };
```

### Binding Examples

- Markup variable invoke: `on-click="Actions.goToPage_Main.invoke()"`
- JS action invoke: `App.Actions.goToPage_Main.invoke()`
- Use `Actions` namespace for action type bindings and invocations.
