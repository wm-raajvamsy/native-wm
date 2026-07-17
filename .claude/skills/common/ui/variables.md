---
name: variables
description: "Create and configure WaveMaker variables (ModelVariable, service variables, etc.). Use when defining the data layer: adding variables, setting dataBinding inputs, or consuming dataSet outputs. Also filterExpressions can be applied on api aware variables"
sub-skills:
- binding
- filterExpressions
---

# Skill: Variables

## Objective

Define and configure variables correctly with strict scope and binding rules.

## What are Variables?

- Variables form the glue between the frontend UI and the backend API services. They provide data integration for components.
- App variables share data across multiple pages; Page variables exist only within their page and are destroyed when navigating away.

## Scope Rules

- Variables can be App, Page, or Partial scoped.
- JavaScript access (always use the full path):
  - App scope: `App.Variables.<name>`
  - Page scope: `Page.Variables.<name>`
  - Partial scope: `Partial.Variables.<name>`
- Markup bindings always use (no scope prefix):
  - Variables: `Variables.<name>` (e.g. `bind:Variables.employeeService.dataSet`)
- **Partial scope:** Event handlers for components/variables inside a hosted partial must be defined in that partial’s script, not in the parent page script. From a partial, access the parent page via `Partial.App.activePage` (e.g. `Partial.App.activePage.Widgets.label1`, `Partial.App.activePage.Variables.myVar`).
- For full binding syntax and examples, use the `binding` skill.

## Variable Type Discovery

- Read `/catalog/variables/variables-list.md` to list all variable types.
- Read `/catalog/variables/{name}/{name}.md` (e.g. `/catalog/variables/ModelVariable/ModelVariable.md`) to fetch variable metadata before create/update.
- Use **platform_listPageVariables** (Required Args) for Page or Partial and **platform_listAppVariables** (No args) for App to check existing variables and actions in scope.
- Naming: variables and actions must be unique `lowerCamelCase`.
- Page scope by default; app scope only when cross-page reuse is required.
- If the variable/action catalog file defines a top-level `syntax` field (e.g., `<scope>.Variables.<variable_name>`), use it as the canonical access pattern when constructing bind expressions or JavaScript references to that variable. This supplements the scope rules above with the exact catalog-authoritative syntax for each variable type.

## Parallel Variable Creation (Mandatory)

When multiple variables are needed (across the page and all partials):

1. **Read catalog metadata first (MANDATORY before any creation)** — for every distinct variable category you intend to create:
   - Read `/catalog/variables/variables-list.md` to confirm the exact category name.
   - Read `/catalog/variables/{categoryName}/{categoryName}.md` for each category (e.g. `/catalog/variables/ModelVariable/ModelVariable.md`).
   - These files define all mandatory fields and their allowed values. Do not skip this step — creating a variable without reading its metadata will result in missing or incorrect fields.
   - **Options constraint (Hard Rule):** If a property in the variable metadata (`/catalog/variables/{name}/{name}.md`) defines `options`, you MUST pick a value only from that listed options. Do not assign any value outside the listed options unless the property metadata explicitly marks it as allowing free-form or custom values. Do not assign an empty string from `options: [""]`. Exception: if the property supports binding and behavior requires an expression-driven value, use a valid bind expression.
   - **`syntax` (property-level):** If a variable property defines `syntax`, use it as the canonical reference template for constructing bind expressions or JavaScript references to that property.
   - Read all required category metadata files in parallel before proceeding.
2. **Identify all variables** — scan every data-dependent component across the full page and all partials. Produce a complete list: variable name, type, scope (page/partial/app), and data source.
3. **Create all variables in parallel (hard rule):** Issue all `ui_createApiAwareVariable` and `ui_createNonApiAwareVariable` tool calls in a single round. Do not create one variable and then move to the next.
4. **Only then generate markup** — no markup that references a variable should be written until all variables from step 3 are confirmed created.

## API-Aware Variables

Use **ui_createApiAwareVariable** (Required Args) for creating:

- `ServiceVariable`
- `CrudVariable`
- `WebSocketVariable`
- `LiveVariable`

### Mandatory Pre-Checks

Before creating API-aware variables, confirm:

1. `serviceId`
2. `operationId`
3. Input parameter structure and types

If any of these are missing, **do not create** the variable; request for exact service/operation details first.
When serviceId, operationId are available, Read swagger operation details with **platform_getServiceDetails** (Required Args) which is used for creating variable.

### API-Aware Variable Inputs and Outputs

1. For existing variables, To get the variable info, use:
  - **platform_describePageServiceVariables** (Required Args)
  - **platform_describeAppServiceVariables** (No args)
2. For creating or updating the dataBinding on variable, use the tool **platform_getServiceDetails** (Required Args). 
   - input from this tool can be used to represent dataBinding on variable (also prepare the dataBinding type based on schema or isList flag). dataBinding is array when isList:true and object when isList:false. dataBinding object with target, type, value. value can be bound to any variable or component or static value.
   - output from this tool can be bound to any other ui component or Variable as required.
3. When serviceId, service definition is given then read definition/schema details with **platform_getDefinitionInformation** (Required Args).
4. Update existing variables via **ui_updateVariable** (Required Args) when needed. This tool can also be used to **rename** a variable and to **change its scope** (Page ↔ App).
5. Reject API variable creation if required service metadata is incomplete.

Rules:

- For API variables, require complete service details (`serviceId`, `operationId`, params) before creation.
- Never invent API identifiers or response fields.
- Do not configure service variables through JavaScript file edits.

### Post-Creation Mandatory Step: dataBinding Verification (MANDATORY)

After creating any API-aware variable (`ServiceVariable`, `CrudVariable`):

1. Call `getServiceDetails` with the `serviceId` and `operationId`.
2. Collect **ALL** declared inputs:
    - Header params (including hardcoded ones like `x-api-key`)
    - Query params
    - Path params
    - Request body fields
3. For **EVERY** declared input, add a corresponding `dataBinding` entry on the variable.
    - Hardcoded static values: bind as a static string value.
    - Dynamic values: bind to the appropriate widget/variable expression.
    - If no value is provided for an input: still add the `dataBinding` entry and keep `value` empty.
4. **NEVER** skip `dataBinding` because a value appears "already configured" at the service level.
    - Service-level config and variable-level `dataBinding` serve different purposes.

❌ DO NOT: Skip `dataBinding` because the header is hardcoded at import time.  
✅ DO: Always explicitly wire every input through `dataBinding` on the variable.

## Non-API-Aware Variables

Use **ui_createNonApiAwareVariable** (Required Args) for creating:

| Variable Type          | Primary Use Case                                    |
| ---------------------- |-----------------------------------------------------|
| `ModelVariable`        | Local/static data storage, form state, temporary values |

### Non-API-Aware Variable
- **ui_getVariableInputsAndOutputs** (Required Args) can be used to get any variable input and outputs of Model Variable. inputs returned from this tool will return the dataBinding and outputs will return the dataSet value. isList from this tool will tell whether dataSet is array or object type.
  Based on inputs and outputs, bindings can be added.

### ModelVariable JSON Structure

**`isList: true`** — `dataSet` is a direct array:

```json
{
  "sampleModelVariable": {
    "_id": "wm-sampleModelVariable-wm.Variable-1776421249410",
    "name": "sampleModelVariable",
    "owner": "Page",
    "category": "wm.Variable",
    "dataSet": [
      {
        "name": "name0",
        "dataValue": "dataValue0"
      }
    ],
    "type": "entry",
    "isList": true,
    "twoWayBinding": false
  }
}
```

**`isList: false`** — `dataSet` is an object with `dataValue` holding the value:

```json
{
  "sampleObjectVariable": {
    "category": "wm.Variable",
    "owner": "Page",
    "dataSet": {
      "dataValue": {
        "firstName": "John",
        "lastName": "Doe",
        "age": 30
      }
    },
    "type": "entry",
    "isList": false,
    "twoWayBinding": false
  }
}
```

Key fields:
- `category`: always `"wm.Variable"` for ModelVariable.
- `dataSet`: holds the actual data — array when `isList: true`, object when `isList: false`.
- `isList`: `true` when `dataSet` is a collection; `false` when `dataSet` is a single object.
- `type`: `"entry"` when `isList: true`. When `isList: false`, `type` depends on the data — `"entry"` for an object value, or a primitive type (`"string"`, `"number"`, `"boolean"`) for scalar values.

### `isList` and Binding Behavior

The value of `isList` determines both the `dataSet` structure and the correct binding path:

| `isList` | `dataSet` structure | Markup binding |
|----------|---------------------|----------------|
| `true`   | Direct array `[...]` | `bind:Variables.<variableName>.dataSet` |
| `false`  | Object `{ "dataValue": ... }` | `bind:Variables.<variableName>.dataSet.dataValue` |

Examples:

```xml
<!-- isList: true — dataSet is a direct array, bind directly -->
<wm-list dataset="bind:Variables.tabbarItems.dataSet" ...></wm-list>
```

```
<!-- Here binding user name to label caption using sampleObjectVariable variable -->
<wm-label caption="bind:Variables.sampleObjectVariable.dataSet.dataValue.firstName" ...></wm-label>
```

### Common ModelVariable Mistake — Wrong `dataSet` Structure

`isList: true` means the variable holds a collection — so `dataSet` **must** be a direct JSON array `[...]`.

❌ **Wrong** — `isList: true` but `dataSet` wraps the array inside `dataValue`:

```json
{
  "tabbarItems": {
    "category": "wm.Variable",
    "isList": true,
    "dataSet": {
      "dataValue": [
        { "label": "Dashboard", "icon": "wm-sl-l sl-analytics-bars" },
        { "label": "Accounts",  "icon": "wm-sl-l sl-bank" }
      ]
    }
  }
}
```

When `isList: true` but `dataSet` is an object, the binding `bind:Variables.<variableName>.dataSet` will not resolve the collection correctly. Avoid this pattern.

✅ **Correct** — `isList: true` with `dataSet` as a direct array:

```json
{
  "tabbarItems": {
    "category": "wm.Variable",
    "type": "entry",
    "isList": true,
    "dataSet": [
      { "label": "Dashboard", "icon": "wm-sl-l sl-analytics-bars" },
      { "label": "Accounts",  "icon": "wm-sl-l sl-bank" }
    ]
  }
}
```

Binding: `bind:Variables.tabbarItems.dataSet`

**Rule:** When `isList: true`, `dataSet` must be a direct JSON array — never wrap it in `{ "dataValue": [...] }`. If the wrong structure is generated, fix it by flattening `dataSet.dataValue` to `dataSet` and ensure `isList: true` and `type: "entry"` are set.

### Rules

- Default to `ModelVariable` unless API-backed data is explicitly needed.

- If needed, make use of already created App scoped Variable `supportedLocale` (ModelVariable) to get all supported locales in the app.

### Decision Tree: Which Variable Type to choose?

```
Is the data coming from a backend API/service?
├── YES → Is there a specific operation to call?
│   ├── YES → ServiceVariable (REST APIs, Swagger/Open API, Java Service, Database services including Queries and Procedures, Security Services)
│   │         CrudVariable (CRUD operations on Swagger/Open API)
│   │         LiveVariable (CRUD operations on Database entities)
│   │         WebSocketVariable (WebSocket endpoints)
│   └── NO  → Stop. Discover the API first before creating a variable.
│
└── NO → What is the purpose?
    ├── Hold local/static data       → ModelVariable
```

### Core Rules

- Refer variables through `Variables` namespace.
- Do not use `.then()` or `.catch()` on WaveMaker methods such as `invoke()`; use variable lifecycle events and callback patterns defined by metadata instead.
- **Do not modify or delete existing variables** unless the user's use case explicitly requires it. When an existing variable already serves the required purpose, reuse it. When a change is needed, update only the required fields using `ui_updateVariable` — do not recreate or overwrite unrelated variable configuration.

## Variable Configuration

- Prefer declarative implementation first: make changes in declarative files (`.html`, variables JSON) instead of JavaScript whenever possible.
- In markup, prefer declarative attributes first, then bindings only when needed; use JavaScript only for behavior that cannot be achieved declaratively.
- Prefer declarative `dataBinding` in variable JSON using updateVariable tool call over JS `setInput`.
- Use variable JSON properties for automatic API-aware variable updates:
  - `startUpdate: true` triggers the variable automatically when its scope is ready. Page variables are invoked on page ready; app variables are invoked on app load.
  - When `startUpdate: true` is configured, do not add an explicit `Page.Variables.<variableName>.invoke()` inside `Page.onReady` in the page script file.
  - `autoUpdate: true` triggers the variable automatically when any input field configured through `dataBinding` changes.
- If JavaScript invocation is required, pass inputs 
  - For **Service Variables** use `setInput()` or `inputFields` before `invoke()`.
    - **Example:**
      ```javascript
      Page.Variables.[variable_name].invoke({
      "inputFields": {
        "fname": "Steve",
        "lname": "Rogers"
        }
      });
      ```
      (or)
      ```javascript
      Page.Variables.[variable_name].setInput({
        "fname": "Peter",
        "lname": "Parker"
      });
      Page.Variables.[variable_name].invoke();
      ```
  
  - For **Live Variables** prefer to use declarative-first approach reduces code complexity, improves maintainability, and aligns with 
    WaveMaker-recommended patterns for performance.
  
- `dataBinding` supports:
  - Static values
  - Widget bindings: `bind:Widgets.<widget>.<field>`
  - Variable bindings: `bind:Variables.<variable>.<field>`
  - `dataBinding` values can be mapped from widget default values (for example `bind:Widgets.<widget>.datavalue`) or static literals.
  - `dataBinding` is for variable input mapping only; widget properties must not bind to `Variables.<variable>.dataBinding...`.
- Add event handlers in variable config using `eventName: "handlerCall(...)"` format.
- In variable JSON, metadata properties and events can be represented as key-value pairs under the variable name.
- **Event `syntax` (Hard Rule):** If the variable's event metadata (from `/catalog/variables/{name}/events.md`) defines a `syntax` field, that is the exact JavaScript function signature for the event handler. ALWAYS use this exact signature when writing the handler in the page/app script. Never guess argument names or order.
- **Event parameter `options` vs property `options`:** A property `options` field is an enum list — you MUST pick a value only from it; an event parameter named `options` is an object type passed to the handler (configuration/context data) — treat it as an object, not a value list.
- Methods from variable metadata are not configured in variable JSON; methods can only be invoked in JavaScript page script files. Example Page.Variables.<variableName>.invoke(options);
- For App-scoped variables, add event handler function implementations in `app.js` (not in page script files).

### Service Variable Pagination with `setPagination`

- `setPagination(data)` is a JavaScript-only method exposed on all service variables for server-side pagination.
- Configure it in `Page.onReady` for page variables or `App.onAppVariablesReady` in `app.js` for app variables.
- Supported pagination types: `offset`, `page`, `cursor`.
- Intended usage: service variables bound to supported data widgets such as Data Table, List, or Cards, typically for Web Services and Imported APIs.
- The `input` and `output` mappings must follow JMESPath-style expressions as used by WaveMaker pagination config.
- Do not try to declare `setPagination` inside variable JSON; call it from script after the variable is ready.

- Offset pagination uses numeric position-based requests.
- Example progression: if the first request uses `offset: 0` and `limit: 10`, the next request uses `offset: 10` and `limit: 10`, then `offset: 20` and `limit: 10`.
- Offset pagination example:
```javascript
Page.onReady = function () {
  Page.Variables.serviceVariable1.setPagination({
    type: 'offset',
    input: {
      offset: '$offset',
      size: '$limit'
    },
    output: {
      size: '$body."_meta"."$limit"',
      totalElements: '$body."_meta".itemCount',
      hasMoreItems: '$body."_meta".hasMoreItems'
    }
  });
};
```

- Offset pagination with proxied response header example:
  If the backend returns `X-Total-Count` as the total record count in response headers, it can be mapped through `totalElements`.
```javascript
Page.Variables.serviceVariable1.setPagination({
  type: 'offset',
  input: {
    offset: 'offset',
    size: 'limit'
  },
  output: {
    totalElements: '$header."X-Total-Count"'
  }
});
```

- Header names with special characters such as hyphens must be wrapped in double quotes inside the JMESPath-style header expression, for example: `$header."X-Total-Count"`.

- Page pagination uses page numbers and typically starts at page index `1`.
- Example progression: after page `1` is requested, the next request is page `2`.
- Page pagination example:
```javascript
Page.Variables.serviceVariable1.setPagination({
  type: 'page',
  input: {
    page: 'page',
    size: 'size'
  },
  output: {
    totalElements: '$body.totalPassengers'
  }
});
```

- Cursor pagination uses `next` and `prev` links returned in response headers to fetch adjacent result sets.
- Cursor pagination example:
```javascript
Page.Variables.serviceVariable1.setPagination({
  type: 'cursor',
  input: {
    page: 'page'
  },
  output: {
    next: '$header.x-links-next',
    prev: '$header.x-links-previous'
  }
});
```

### Variable Metadata Representation in JSON

- Service variable example with metadata property and event:

```sample json
{
  "serviceVariable1": {
    "category": "wm.ServiceVariable",
    "operation": "getEmployees",
    ...
    "onResult": "serviceVariable1onResult(variable, data, options)"
  }
}
```

### Binding Examples

- Markup variable invoke: `on-click="Variables.employeeService.invoke()"`
- JS variable invoke: `Page.Variables.employeeService.invoke()`

## Bindings and Dataset Rules

- Variable namespace in markup: `bind:Variables.<name>...`
- Variable output dataset path: `Variables.<var>.dataSet` — if `dataSet` is an object, access its key directly: `Variables.<var>.dataSet.<key>` (e.g. `Variables.<var>.dataSet.dataValue`).
- Do not bind `dataSet` as a variable input target.
- For page parameter inputs in variable `dataBinding`, use `bind:pageParams.<page_param_name>` only (MANDATORY).
- Invalid page param path formats in binding expressions: `bind:Pages.<pageName>.params.<param_name>`, `bind:Pages.Dashboard.params.categoryId`.

- When binding a widget (`wm-select`, `wm-chips`, `wm-checkboxset`,`wm-radioset`, `wm-rating`, `wm-search`) to a Variable:
  - `datafield` must match an existing field name in each object in the variable's `dataSet` array.
  - `displayfield` must match an existing field name in each object in the variable's `dataSet` array.
  - If the variable uses string arrays (not objects), leave both `datafield` and `displayfield` empty.
  - **Silent failure**: If `datafield` or `displayfield` references a field that does not exist in the dataSet objects, the widget renders empty with no error — always verify field names match.

## DataBinding Usage Examples

- Static value example:

```json
{
  "target": "results",
  "value": "100",
  "type": "java.lang.String"
}
```

- Widget binding value example:

```json
{
  "target": "results",
  "value": "bind:Widgets.resultsDropdown.datavalue",
  "type": "java.lang.String"
}
```

- Correct variable input mapping example:

```json
{
  "dataBinding": [
    {
      "target": "result",
      "value": "bind:Widgets.<widgetname>.datavalue",
      "type": "integer"
    }
  ]
}
```

- Variable binding value example:

```json
{
  "isList": false,
  "target": "Leads",
  "value": "bind:Variables.databaseVariable2.firstRecord",
  "type": "com.webapptesting.salesdb.Leads"
}
```

### DataBinding Wrong Usage Examples

- Invalid input target (`dataSet` cannot be input target in variable `dataBinding`):

```json
{
  "dataBinding": [
    {
      "target": "dataSet",
      "value": "[{\"name\":\"Steven\"}]",
      "type": "array"
    }
  ]
}
```

- Invalid markup usage (do not bind widget properties to variable `dataBinding`):
  - `datavalue="bind:Variables.<variableName>.dataBinding.result"`

- INVALID page param bindings in `dataBinding`:

```json
{
  "dataBinding": [
    {
      "target": "categoryId",
      "value": "bind:Pages.Collection.params.categoryId",
      "type": "integer"
    }
  ]
}
```

- VALID page param bindings in `dataBinding`:

```json
{
  "dataBinding": [
    {
      "target": "categoryId",
      "value": "bind:pageParams.categoryId",
      "type": "integer"
    }
  ]
}
```

## Filter Expressions

For `LiveVariable` filter criteria structure, nested rules, and `matchMode` mapping, load skill `filterExpressions`.
