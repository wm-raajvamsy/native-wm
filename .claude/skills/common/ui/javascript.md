---
name: javascript
description: "Add JavaScript event handlers and custom logic to WaveMaker pages. Use only when the user explicitly requests JavaScript or when logic cannot be achieved through markup, bindings, variables, or actions."
---

# Skill: JavaScript Event and Runtime Safety

## Objective

Produce valid, functional WaveMaker JavaScript using only metadata-supported APIs, acquired knowledge, and existing components/variables. Operate strictly within provided file context and knowledge—do not invent or assume.

## Declarative-First Gate (Mandatory — evaluate before writing any JS)

Before writing any JavaScript, verify that the requirement **cannot** be satisfied through:

1. **Markup attributes** — static component properties set directly in HTML (e.g. `caption`, `show`, `disabled`, `type`).
2. **Data bindings** — binding component properties to variables or widget values in markup.
3. **Variable configuration** — input bindings, filter criteria, `startUpdate`, `autoUpdate`, or event wiring in `.variables.json` / `app.variables.json`.
4. **Actions** — Navigation, Notification, Timer, or other built-in actions wired declaratively to events.

| Scenario                                                                                                                                     | Correct approach                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Show/hide a widget based on a variable value                                                                                                 | Bind the `show` property to the variable output in markup                            |
| Set a label's text from a variable                                                                                                           | Bind the `caption` property to the variable output in markup                         |
| Disable a button while a variable is loading                                                                                                 | Bind the `disabled` property to the variable's loading state in markup               |
| Trigger a service variable on page load                                                                                                      | Set `startUpdate: true` / `autoUpdate: true` in variable config                      |
| Navigate on button click                                                                                                                     | Wire a Navigation Action to `on-click` in markup                                     |
| Show a notification on variable success                                                                                                      | Wire a Notification Action to `onSuccess` event in variable config                   |
| Search/filter table columns (e.g. "add search to employee table", "let user filter by name")                                                 | Set `filtermode` attribute on the table component in markup — no JS needed           |
| Search/filter with custom logic (e.g. filter via an API call, computed multi-condition filter, filter depending on another variable's state) | Write JS to set inputs on the variable and invoke it with the computed filter values |

**Write JavaScript only when the requirement involves logic, computation, or orchestration that has no declarative equivalent.** If a declarative solution exists, use it and do not generate JS.

**Exception — prefer JS over a declarative expression when the declarative equivalent would be:**

- A long, hard-to-read binding expression with multiple conditions or ternaries
- A binding that calls multiple chained functions or nested accessors
- An expression that mixes concerns (e.g. formatting + conditional + fallback in one binding)

In these cases, move the logic into a named JS handler and bind the result, keeping markup readable.

## Workflow

1. **Analyze context:** Retrieve only context relevant to the user query (e.g., for UI interaction don’t fetch variables if unnecessary; for a new JS method don’t fetch existing JS—just create and add the method).
2. **Acquire knowledge (mandatory — no exceptions):** Read `/catalog/components/{name}/{name}.md` for every component you will write or modify JavaScript for, and `/catalog/variables/{name}/{name}.md` for variable properties/methods/events. This step cannot be skipped regardless of prior knowledge — WaveMaker component APIs differ from browser-native and Angular APIs. Use only what is explicitly listed in the catalog response.
3. **Generate code:** Write clean JavaScript based *only* on that knowledge.
4. **Propose changes:** Integrate new JS and event bindings into project files (`.html`, `.variables.json`, `app.variables.json`, `app.js`) using the specified file modification tools.
5. **Fallback:** If the requested functionality cannot be achieved with existing HTML components and variables, inform the user to create the component/variable manually or that it cannot be implemented—do not provide an incorrect solution.

## MCP Tools

1. Read `src/main/webapp/pages/pages-config.json` to get all available pages, page types, and page params. **Never write to this file.**
2. **grep_in_files** (Required Args): Searches file contents using a regex pattern in the project or catalog files.
3. **read_files** (Required Args): Retrieves the content of specific files (use this tool only for accessing service definitions files, wm_rn_config.json, app.json, app.js and package.json files).For catalog knowledge, read paths directly:
   - Component metadata: `/catalog/components/{name}/{name}.md` — returns properties, methods, events, rules, and supported CSS. Fetch multiple component files in one call.
   - Component event signatures: `/catalog/components/{name}/events.md`
   - Component method signatures: `/catalog/components/{name}/methods.md`
   - Variable metadata: `/catalog/variables/{name}/{name}.md` — returns variable properties, methods, events. Replace `{name}` with the variable type (e.g. `ServiceVariable`, `ModelVariable`).
4. Save markup changes using file system tools to the page html file (`src/main/webapp/pages/{pageName}/{pageName}.html`).
5. Update the app.js/page/partial JS file — preserve every other existing function, handler, and line exactly as-is. Never omit or rewrite existing code that is not part of the requested change.
6. **ui_updateVariable** (Required Args) for updating existing variable configuration.
7. **platform_describePageServiceVariables** (Required Args): Gets the page service variables inputs and outputs structure.
8. **platform_describeAppServiceVariables** (No args): Gets the app service variables inputs and outputs structure.
9. **platform_getTypeInformation** (Required Args): Gets the java objects type info for variable api output or input types.
10. **find_files_by_glob** (Required Args): Lists files and directories in a specific directory.
11. **platform_getServiceDetails** (Required Args): Gets service operation input/output schemas (including definition references) required for correct `setInput()` payload shape.
12. **platform_getDefinitionInformation** (Required Args): Resolves schema definition references from service details into concrete property structures.

## Context Retrieval

- **Page name:** If the user does not specify the page, ask for it.
- **Fetch only what’s needed:** Page components, page variables/actions, page JS, app variables/actions, and service definitions only when required for the query.
- **Remember what you read:** When updating files, use the previously fetched content; do not re-fetch the file. Preserve all existing code that is not part of the requested change.

## JavaScript Restrictions

- Do not create or configure variables through JS; use variable tools.
- Do not add static sample data in JS.
- Do not write fetch logic for project-declared APIs; use variables.
- Generate JavaScript only from **available** components and variables in the current application context, never assume components, variables, or actions.
- Use only properties, methods, and events that appear in the knowledge response; method arguments must match the event signatures from knowledge.

## Hard Rules

- **HARD RULE — No Unicode escaping:** Never convert literal characters to `\uXXXX` escape sequences. If the existing file contains characters like `→` (arrow), `—` (em-dash), `–` (en-dash), `•` (bullet), or any other non-ASCII character, keep them exactly as literals in the output. Never write `\u2192` for `→`, `\u2014` for `—`, `\u2013` for `–`, or `\u2022` for `•`. This rule applies to all string literals, comments, and any other content in the JS file.
- Always use `const` or `let` for variable declarations — never use `var`.
  - Use `const` when the variable is not reassigned.
  - Use `let` when the variable needs to be reassigned.
- Avoid AngularJS constructs (`$scope`, `$parent`, `Application.*`).
- Prefer declarative files and configuration (`.html`, variables JSON) over JavaScript whenever possible.
- Prefer declarative attributes first; use binding expressions only when needed; write JavaScript only for functionality that cannot be achieved declaratively.
- Prefer notification actions for user-visible status and errors.
- Use minimal or no JSDoc and few comments in generated code.
- Check `binding` and `variables` and `actions` skills when configuring bindings or variables.
- **Do not reformat or alter existing code** that is not part of the requested change — this includes quote style (single ↔ double), whitespace, indentation, or any cosmetic edits. Preserve the original style of all pre-existing lines exactly as-is.
- **Do not modify, rewrite, or delete existing JavaScript functions or handlers** unless the user's use case explicitly requires changing them. Only add new handler methods or modify the specific function the user has asked to change. Leave all other existing functions untouched.

## UI Rendering Strategy

- Follow an HTML-first, data-bound approach for UI rendering in WaveMaker.
- Use framework templates/components for repeated or dynamic UI output, and bind data directly in markup.
- Keep JavaScript focused on orchestration (input shaping, variable invocation, event handling), not DOM rendering.

Avoid JavaScript DOM manipulation for normal WaveMaker UI rendering flows, including:
- `querySelector`/`querySelectorAll`
- manual cloning/inserting/removing nodes
- direct `textContent`/`innerHTML` updates for data rendering
- direct display toggling via inline style operations

- Use DOM APIs only when strictly necessary and unsupported by WaveMaker bindings/components.

## Knowledge and API Usage

- Always use `setInput()` or pass `inputFields` when invoking a variable.
- For login action `invoke(...)`, use `input` as the payload key; do not use `inputData`.
- Treat `inputData` as callback/event-handler payload terminology, not as the runtime invocation key for login action.
- For service variables, derive `setInput()` payload keys from **platform_getServiceDetails** (Required Args).
- Property/event/method names and schema field names are case-sensitive and must be used exactly as metadata defines.
- For service variable request/response modeling, treat names as immutable; never rename or change casing.
- **Before writing any JavaScript that accesses a property, calls a method, or binds an event on a WaveMaker component, read the component's catalog file first:** `/catalog/components/{name}/{name}.md` (core properties/events/methods), `/catalog/components/{name}/methods.md` (full method signatures), `/catalog/components/{name}/events.md` (full event signatures). Use only what is explicitly listed there. If a property, method, or event is not present in the catalog, it does not exist on the widget — do not invent, infer, or assume it from browser-native APIs, Angular patterns, or general JavaScript knowledge. Fabricating widget APIs is a hard failure.
- Get variable dataset via `dot` notation: `variableName.dataSet`.
- Set and get component properties via `dot` notation (e.g. `ComponentName.propertyName`); do not use setter/getter methods.
- For direct JavaScript methods/properties like `addClass` or `removeClass`, use the direct HTML element instance, which can be obtained via the component's `nativeElement` property.
- Use `setValidators()` and `setAsyncValidators()` to add custom validations to Form and DataTable fields (see **Form and DataTable field validators** below).
- WaveMaker methods such as `invoke()` and `submit()` do not support promises, do not use `.then()`/`.catch()`. Use callbacks or variable events and follow the syntax in knowledge for callbacks and success/error events.
- Prefer Notification Actions over dialogs for showing status to the user. 
- Use app-level common dialogs when it is required for the similar use-case.
- Page parameters are for data transfer between pages (e.g. `Page.pageParams.<paramName>`).
- For service-variable pagination via `setPagination()`, load skill `variables` and refer to `Service Variable Pagination with setPagination`.
- Minimal `setPagination()` syntax example:

```javascript
Page.onReady = function () {
  Page.Variables.serviceVariable1.setPagination({
    type: 'offset',
    input: {
      offset: '$offset',
      size: '$limit'
    },
    output: {
      totalElements: '$header."X-Total-Count"'
    }
  });
};
```

### Mandatory Output-Path Validation in JavaScript (Variables + Components)

- Apply the same binding-path validation discipline even in JavaScript when reading variable outputs or component outputs.
- Do not access output paths by guessing partial nodes.
- Resolve output metadata first, then use exact output path and exact casing.
- For `ModelVariable` outputs, use **ui_getVariableInputsAndOutputs** (Required Args) before reading `dataSet` fields.
- For API-aware variable outputs (`ServiceVariable`, `CrudVariable`, `LiveVariable`, `WebSocketVariable`), use **platform_getServiceDetails** (Required Args) (and **platform_getDefinitionInformation** (Required Args) when needed) before reading output fields.
- For component outputs/properties, read `/catalog/components/{name}/{name}.md` and access only metadata-supported fields.
- For form field component output access, use full hierarchy in JS:
  - `Page.Widgets.<formName>.formWidgets.<formFieldName>.<out-bound|in-out-bound property>`
- Recheck final resolved node type before using it in JavaScript logic.
- Example: if `dataSet` is object and `dataSet.dataValue` is `array<object>`, use `Page.Variables.<variableName>.dataSet.dataValue` for list operations, not `Page.Variables.<variableName>.dataSet`.

### Service Variable `setInput()` Schema Flow (Mandatory)

1. Call **platform_getServiceDetails** (Required Args) for the target service operation.
2. Read request payload root from `inputs` (example: `inputs: [{"name":"UserInfo","schema":{"$ref":"#/definitions/UserInfo"}}]`).
3. Read response schema ref from `outputs` (example: `outputs.200.schema.$ref -> "#/definitions/ClaimActions"`).
4. Resolve referenced definitions with **platform_getDefinitionInformation** (Required Args) and use returned `properties` to construct request/response objects.
5. Build `setInput()` with exact root key and schema-compliant object shape.

Raw `getServiceDetails` example response:

```json
{
  "inputs": [
    {
      "in": "body",
      "name": "UserInfo",
      "required": true,
      "schema": {
        "$ref": "#/definitions/UserInfo",
        "x-WM-TYPE_ARGUMENTS": []
      }
    }
  ],
  "outputs": {
    "200": {
      "description": "Success",
      "schema": {
        "$ref": "#/definitions/UserInfo",
        "x-WM-TYPE_ARGUMENTS": []
      }
    }
  }
}
```

Raw `getDefinitionInformation` example for output schema (`#/definitions/UserInfo`):

```json
{
  "properties": {
    "tenantId": {"type": "integer", "format": "int64"},
    "userId": {"type": "integer", "format": "int64"},
    "actionBy": {"type": "integer", "format": "int64"},
    "action": {"type": "string"},
    "remarks": {"type": "string"},
    "actionDate": {"type": "string", "format": "date", "x-WM-SUB_FORMAT": "timestamp"},
    "users": {"$ref": "#/definitions/Users", "x-WM-TYPE_ARGUMENTS": []},
    "claims": {"$ref": "#/definitions/Claims", "x-WM-TYPE_ARGUMENTS": []}
  },
  "x-WM-FULLY_QUALIFIED_NAME": "com.hdfc.hdfc_claim_db.UserInfo"
}
```

Example pattern (dummy payload variable):

```javascript
Page.Variables.userServiceVar.setInput({
    UserInfo: {
        userId: userId,
        actionBy: null,
        action: "APPROVED",
        remarks: Page.Widgets.reasonInput.datavalue,
        actionDate: new Date().toISOString()
    }
});
```

## Event Binding Rules

- Derive event names and handler signatures from component/variable metadata (knowledge) only.
- **Markup:** `on-<eventname-lowercase>="<methodName>(<metadataParams>)"`. Do not prefix the method name with `Page.`, `Partial.`, or `App.`.
- Follow `markup` skill rules for event-attribute patterns and allowed expression style in markup.
- **JS handler:**
  - Page: `Page.<methodName> = function(<metadataParams>) { ... };`
  - Partial: `Partial.<methodName> = function(<metadataParams>) { ... };`
  - Examples: 
  For Components:
  `Page.detailsButtonClick = function(event, $widget){};`,
  `Partial.accountstableBeforedatrender = function(widget, data, columns){};`
  For Variables:
  `Page.createuserServiceVariable1onBeforeUpdate = function (variable, inputData, options) {};`
  `Partial.dbcrudonResult = function (variable, data) {};`
  `App.webSocketVariable1onBeforeOpen = function (variable, data) {};`  
  For Actions:
  `App.appNotificationonClick = function(variable, data) {};`
  `Page.pageNotificationonHide = function(variable, data) {};`
- When adding an event to a component, use the fetched component tag as `original_content`; do not fetch the component again.
- Do not use `.on(...)` or `addEventListener(...)` for WaveMaker widget events.

## Variable Events

Variable events run during the variable lifecycle and let you validate or transform input, handle success/error, or transform response data. Assign handlers in the variable definition (e.g. in variables.json) and implement the corresponding JavaScript functions in the page/partial or app script.
- If Javascript invocation is required for variables with success and error callbacks during `invoke()`:
    - **Example:**
      ```javascript
          Page.Variables.<variable_name>.invoke({},
               function(data){ // data here refers to the dataSet of the variable
                  //success code goes here
               },
               function(error){ // error here refers to the error object or message received from the variable
                   //error code goes here
               }
          );
      ```
      (or) along with `setInput()` and `invoke()` methods
        ```javascript
          Page.Variables.<variable_name>.setInput({
            "fname": "Peter",
            "lname": "Parker"
          });
          Page.Variables.<variable_name>.invoke({},
               function(data){ // data here refers to the dataSet of the variable
                  //success code goes here
               },
               function(error){ // error here refers to the error object or message received from the variable
                   //error code goes here
               }
          );
          ```

### `data` Parameter Meaning in Variable Handlers

- For handler signatures like `Page.<variableName><METHOD_NAME> = function(variable, data) {}`, `data` represents the variable output dataset.
- Treat `data` as the service/variable response object available to that event.
- Before writing logic on `data`, identify the variable outputs from metadata/tooling and access only those output fields.
- Do not assume unknown response keys; use only schema-defined output properties.

### Event flow (typical update cycle)

```
                    ┌─────────────────┐
                    │   onCanUpdate   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ onBeforeUpdate  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Servive Call    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    onResult     │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
     ┌──────────────────────┐       ┌─────────────┐
     │ onBeforeDatasetReady │       │   onError   │
     └──────────┬───────────┘       └─────────────┘
                │
                ▼
       ┌─────────────────┐
       │    onSuccess    │
       └─────────────────┘
```

- Multiple items (e.g., JavaScript, another variable, notification action) can be bound to the same event.
- Fetch detailed knowledge for each event from variable and action metadata.

## Detailed Examples

### onBeforeListRecords (Database CRUD READ only)

```javascript
Page.HrdbEmployeeDataonBeforeListRecords = function(variable, dataFilter, options) {
    if (dataFilter.getCriteria("jobtitle")[0].value === "Product Manager") {
        return true;
    }
    dataFilter.getCriteria("jobtitle")[0].value = "Product Manager";
};
```

```javascript
Page.HrdbEmployeeDataonBeforeListRecords = function(variable, dataFilter, options) {
    if (dataFilter.getCriteria("deptId")[0].value === 1) {
        return false;  // block the call
    }
    dataFilter.getCriteria("deptId")[0].value = 3;
};
```

### onBeforeUpdate / onBeforeInsertRecord / onBeforeUpdateRecord / onBeforeDeleteRecord

Example: modify in place:

```javascript
Page.empInsertonBeforeInsertRecord = function(variable, inputData, options) {
    inputData.firstname = "Steve";
    inputData.lastname = "Rogers";
};
```

Example: return new input object:

```javascript
Page.MyJavaServiceVariableonBeforeUpdate = function(variable, inputData, options) {
    return {
        firstname: "Steve",
        lastname: "Rogers"
    };
};
```

Example: validation and block:

```javascript
Page.empInsertonBeforeInsertRecord = function(variable, inputData, options) {
    if (!inputData.firstname || !inputData.lastname) {
        return false;
    }
};
```

### onBeforeDatasetReady

Example: add a computed field:

```javascript
Page.HrdbEmployeeDataonBeforeDatasetReady = function(variable, data) {
    const new_data = [];
    if (data && data.length) {
        data.forEach(function(datum) {
            datum.fullname = datum.firstname + " " + datum.lastname;
            new_data.push(datum);
        });
        return new_data;
    }
};
```

### onSuccess / onError

- Use for post-success logic (e.g. trigger another variable or show a message) and for error handling (e.g. notification, logging).

### Rules

- Implement only variable events and signatures that are supported by the variable type (use knowledge/metadata when available).
- Do not call `setInput()` or `setData()` from inside **onBefore\*** or **onBeforeDatasetReady**; only modify the passed object or return a new one.

## Unknown or Unsupported Events

- If an event is unclear, search the codebase.
- If still unresolved, stop and request correct metadata.
- Never invent event names or parameter signatures.
- If the requested behavior cannot be implemented with available metadata/components/variables, stop and ask for the missing setup.

## Runtime and Scope Safety

- **Scopes:** Use explicit `Page`, `Partial`, or `App`; do not use `this`.
- **Page/Partial:** `Page.Variables.<name>`, `Page.Actions.<name>`, `Page.Widgets.<name>`; same for `Partial.*`. For page params, load skill `pageParams`.
- **App:** `App.Variables.<name>`, `App.Actions.<name>`. App-level variables and actions are available on any page or partial.
- **Custom widget templates (Search, Checkboxset, Radioset, Tree):** load skill `custom-widget-template` before calling `Page.Widgets.<name>.setTemplate('<templateName>')`.
- **DOM readiness:** Components inside dialogs or unopened tabpane/wizardstep/accordionpane are not available at page ready. Access them in `dialogOpened`, `tabpaneLoad`, `wizardstepLoad`, or `accordionpaneExpand` events.
- **Common partial dialogs:** From any page/partial use `App.Widgets.<dialogName>.open()`, `App.Widgets.<dialogName>.close()`.
- **Hosted partial from page:** Use `Page.Widgets.<PartialLoadedComponentName>.Widgets.<ComponentName>`, `Page.Widgets.<PartialLoadedComponentName>.Variables.<variableName>`, `Page.Widgets.<PartialLoadedComponentName>.Actions.<actionName>`. Event handlers for hosted partial components/variables must be defined in the partial script, not in the page script.
- **Libraries:** WaveMaker preloads **lodash** (`_`). And also moment library can be imported — use moment for date calculations and lodash for collection operations. Prefer lodash utilities when working with complex logic operations.

### Lodash Usage

Lodash is globally available as `_`. Prefer lodash for complex logic involving collection iteration, filtering, grouping, mapping, and object manipulation instead of writing manual loops.

```javascript
Page.onReady = function () {
    const items = Page.Variables.taskList.dataSet;
    _.forEach(items, (item) => {
        console.log(item.name);
    });
};
```

### Moment Usage

Moment is not globally available. Import it at the top of the script file if it is not available before use:

```javascript
const moment = App.importModule('moment');
```

Then use any moment method:

```javascript
const moment = App.importModule('moment');

Page.onReady = function () {
    const now = moment.now();
    console.log(now);
};
```
- For JS-only change requests, limit edits to handler methods and required event bindings; do not alter unrelated markup, styles, or variables.

## Dependency Injection and Lifecycle Callbacks

### Dependency Injection

- Use **`App.getDependency`** to resolve application-level services (e.g. i18n, CONSTANTS).
- Example: `const i18nService = App.getDependency('i18nService');`

### App-level callbacks (by default present in app.js)

- **`App.onAppVariablesReady`** — runs when app variables are ready. Access variables via `App.Variables` (e.g. `App.Variables.staticVariable1.getData()`).
- **`App.onSessionTimeout`** — runs on session timeout. Use for cleanup (e.g. clearing data). On re-login: same user keeps app state; different user causes app reload and redirect to landing page per Security config.
- **`App.onPageReady(activePageName, activePageScope, $activePageEl)`** — runs after the **page-level** `onPageReady`. Use for shared logic across pages. Args: page name, page scope, page jQuery element.
- **`App.onServiceError(errorMsg, xhrObj)`** — runs when a Variable gets an error from the target service. Use for app-wide error handling. Override message via `App.Variables.appNotification.setMessage(YOUR_CUSTOM_MESSAGE)`. `xhrObj` has statusCode, url, request/response body.
  - Example: Customise the error message if the API status code is 404.

   ```javascript
    App.onServiceError = function(errorMsg, xhrObj) {
        let custom_message;
        // logic to compute error message
        if (xhrObj.status === 404) {
             custom_message = 'Requested resource "' + xhrObj.url + '" not found. Please contact admin.';
        }
        // set message on the default notification variable
        App.Actions.appNotification.setMessage(custom_message);
    };
    ```
-  **`App.setMode()`** - Sets the application-wide UI color mode (theme mode) so the UI renders using the selected mode from the start.
   - **Syntax:** ```App.setMode({ color: 'dark' });``` or ```App.setMode({ color: 'light' });```
   - **Example:** When the user toggles the switch component in the header, the application should dynamically change its theme between 
     light mode and dark mode, updating the UI colors accordingly across all components.
     ```javascript
        //If Toggle component checked value is set as "light" and unchecked value as "dark" 
        Page.toggleThemeChange = function ($event, widget, newVal, oldVal) { 
          App.setMode({ color: newVal })
        };
        ```
- **`App.onBeforeAppReady`** - run logic **before the application UI is initialized and rendered**. This is the earliest safe hook for app pre-initialization logic.
    - **What’s available in this hook**
      - App-level variables
      - Platform metadata (security configuration)
      - Logged-in user context (if authentication is enabled)
    - **Execution behavior**
      - Runs before UI initialization.
      - If the function returns a **Promise**, app startup waits until it resolves.
      - If the Promise **rejects** or the function **throws**, app initialization stops (can be used to block startup with a controlled failure).
    - **Recommended usage**
      - Keep logic minimal to avoid delaying startup.
      - Use for pre-init tasks like loading org/user configuration, setting UI mode, role-based redirects, or maintenance checks. 
    - **Example (`app.js`)** : Add this hook in `app.js`.

      - ```javascript
        App.onBeforeAppReady = function () {
          // Check if the user is authenticated
          if (App.Variables.loggedInUser.dataSet.isAuthenticated) {
              const userId = App.Variables.loggedInUser.dataSet.id;
              App.Variables.getUserData.setInput('userId', userId);
              return App.Variables.getUserData.invoke().then((result) => {  //result is the variable dataSet
                  // code here to resolve promise
              }).catch((err) => {
                  console.error("Failed to load user theme:", err);
                  App.Actions.navigateToPage('errorPage');
                  return Promise.reject(err);
              });
          }
        };
        ```

### Page-level callbacks (by default present in page JS)

- **`Page.onReady`** — runs when the page is ready. Use for initializing widgets/variables.
  - Variables: `Page.Variables.<name>` (e.g. `Page.Variables.loggedInUser.getData()`).
  - Widgets: `Page.Widgets.<name>` (e.g. `Page.Widgets.username.datavalue`).

### Partial-level callbacks (by default present in partial JS)

- **`Partial.onReady`** — runs when the partial is ready. Use for initializing widgets/variables.
  - Variables: `Partial.Variables.<name>` (e.g. `Partial.Variables.loggedInUser.getData()`).
  - Widgets: `Partial.Widgets.<name>` (e.g. `Partial.Widgets.username.datavalue`).

### User-defined Variables

- Define variables in the **app script(app.js)** **page script** or **partial script**
- Example:

```javascript
// Define JavaScript variable in Page script
Page.summaryData = 'Total Sales: 100000';
```

- Make sure to define the variable in the correct scope (e.g., `Page` or `Partial` or `App`).
- Refer to `binding` skill for more details.

## Cross-Scope and Conventions

### Partial from parent page

- Access widgets and variables of a partial from the parent page script via the partial **container** widget’s `Widgets` and `Variables`:

`Page.Widgets.<container_name>.Widgets.<widget_name>.<property>` (e.g. `Page.Widgets.panel1.Widgets.label1.caption = "New Caption"`).

`Page.Widgets.<container_name>.Variables.<variable_name>` (e.g. `Page.Widgets.contianer1.Variables.staticVariable1.dataSet = {"dataValue": "new value"}`).

- Same pattern for panel or tab content: `Page.Widgets.[panel_name].Variables.[variable_name]`, `Page.Widgets.[tab_content_name].Variables.[variable_name]`.

### Parent page from partial page

- Access the parent page from the partial script via **`Partial.App.activePage`** (parent page scope):

`Partial.App.activePage.Widgets.<widget_name>.<property>` (e.g. `Partial.App.activePage.Widgets.label1.caption = "New Caption"`).

`Partial.App.activePage.Variables.<variable_name>.<fieldOrMethod>` (e.g. `Partial.App.activePage.Variables.staticVariable1.dataSet = {"dataValue": "new value"}`).

- Event handlers for hosted partial components/variables must be defined in the **partial script**, not in the parent page script.

## Hard Rules for Form and Liveform JavaScript

- Do not use AngularJS or Angular **NgForm** / native form-controller APIs on WaveMaker forms.
- Avoid AngularJS methods such as `$rollbackViewValue()`, `$commitViewValue()`, `$addControl(control)`, `$getControls()`, `$removeControl(control)`, `$setDirty()`, `$setPristine()`, `$setUntouched()`, `$setSubmitted()`, `$setValidity(validationErrorKey, isValid, controller)`, and state properties such as `$pristine`, `$dirty`, `$valid`, `$invalid`, `$submitted`, `$pending`, and `$error`.
- Avoid Angular `ngModel`, `NgForm` form APIs: `pristine`, `dirty`, `valid`, `invalid`, `submitted`, `pending`, `touched`, `untouched`, `errors`.
- Never rely on Angular Form directives (e.g. `FormControl`, `FormGroup`,`ReactiveForms`) or AngularJS controllers (e.g. `NgModelController`, `FormController`).
- Avoid using `<scope>.Widgets.<form-name>.ngform`.
- Do not call browser-native HTML5 form validation APIs on WaveMaker widget or `formfields` objects. The following do not exist on WaveMaker widgets and must never be used: `setCustomValidity()`, `checkValidity()`, `reportValidity()`, `validate()`. These methods exist on raw `<input>` DOM elements, not on WaveMaker component objects. Using them by analogy is API fabrication.
- Use only properties, methods, and events of the component from `/catalog/components/{name}/{name}.md`.

## Form and DataTable field validators

Validations apply to **Liveform**, **Form** (`formfields`) and **DataTable** (`columns`) fields. Use:

- **`setValidators`** — sync validations: array of default-validator objects and/or custom functions.
- **`observeOn`** — array of field names; re-runs this field’s validators when those fields change (e.g. confirm password observing password).
- **`setAsyncValidators`** — async validations: array of promises or functions that return a promise; `resolve()` when valid, `reject({ errorMessage: "..." })` when invalid.

> **Initialisation rule:** `setValidators`, `setAsyncValidators`, and `observeOn` must **always** be called inside `Page.onReady`. **Never** place these calls inside render callbacks such as `onBeforeFormRender`, `onFormRender`, `onBeforeDataRender`, `onDataRender`, or any other render/lifecycle callback of the form or table.

### Target paths

- **Form:** `Page.Widgets.<formName>.formfields.<fieldName>.setValidators(...)` / `setAsyncValidators(...)` / `observeOn([...])`.
- **DataTable:** `Page.Widgets.<tableName>.columns.<columnName>.setValidators(...)` / `setAsyncValidators(...)` / `observeOn([...])`.

### Default validators (VALIDATOR constant)

Get the constant with getDependency add it to the javascript (app.js or page/partial js) files: 
`const VALIDATOR = App.getDependency('CONSTANTS').VALIDATOR;`

| Purpose      | Constant                 |
| ------------ | ------------------------ |
| required     | `VALIDATOR.REQUIRED`     |
| maxchars     | `VALIDATOR.MAXCHARS`     |
| minvalue     | `VALIDATOR.MINVALUE`     |
| maxvalue     | `VALIDATOR.MAXVALUE`     |
| regexp       | `VALIDATOR.REGEXP`       |
| mindate      | `VALIDATOR.MINDATE`      |
| maxdate      | `VALIDATOR.MAXDATE`      |
| excludedates | `VALIDATOR.EXCLUDEDATES` |
| excludedays  | `VALIDATOR.EXCLUDEDAYS`  |
| mintime      | `VALIDATOR.MINTIME`      |
| maxtime      | `VALIDATOR.MAXTIME`      |

Example (required + regex):

```javascript
Page.onReady = function () {
    const VALIDATOR = App.getDependency('CONSTANTS').VALIDATOR;
    Page.Widgets.EmployeeForm1.formfields.email.setValidators([emailRequired, {
        type: VALIDATOR.REGEXP,
        validator: /\w+@\w+\.\w{2,3}/,
        errorMessage: "Not a Valid Email"
    }]);
};
```

### Custom validator functions

- **Form:** `function(field, form)` — return `{ errorMessage: "..." }` when invalid; return nothing when valid.
- **DataTable:** `function(field, table)` — same return convention.

Example:

```javascript
Page.onReady = function () {
    Page.Widgets.EmployeeForm1.formfields.confirmpassword.setValidators([confirmPasswordEval]);
    Page.Widgets.EmployeeForm1.formfields.confirmpassword.observeOn(['password']);
};

function confirmPasswordEval(field, form) {
    if (field.value && form.formfields.password.value != field.value) {
        return { errorMessage: "Password & ConfirmPassword are not the same value" };
    }
}
```

### setAsyncValidators

Use for async validation (e.g. checking if a value already exists). Accepts an array of promises or functions that return a promise.

- **Form:** `Page.Widgets.formName.formfields.fieldName.setAsyncValidators([fn])`
- **DataTable:** `Page.Widgets.tableName.columns.columnName.setAsyncValidators([fn])`

Function signature:
`function(field, form)` or `function(field, table)`. Return a Promise; call `reject({ errorMessage: "..." })` when invalid, `resolve()` when valid.

Example (email uniqueness check):

```javascript
Page.onReady = function () {
    Page.Widgets.employeeInfoForm3.formfields.email.setAsyncValidators([emailAsync]);
};

function emailAsync(field, form) {
   if (field.value) {
       return new Promise(function(resolve, reject) {
           const emailExists = Page.Variables.EmailData.dataSet.filter(function(data) {
               return data.dataValue === field.value;
           });
           if (emailExists.length !== 0) {
               reject({ errorMessage: "The email address is already registered." });
           } else {
               resolve();
           }
       });
   }
}
```

### Validator that depends on another widget

When a validator depends on another widget’s value, use a **function** that returns that value so it is evaluated when the validator runs, not at setup time.

- **Recommended:** `validator: function() { return Page.Widgets.date1.datavalue; }`
- **Not recommended:** `validator: Page.Widgets.date1.datavalue;`

### errorMessage

- Can be a string: `errorMessage: "This field cannot be empty."`
- Or a function for dynamic text: `errorMessage: function(field, form) { return field.value + " is not a valid Email."; }` (use `(field, table)` for DataTable).
