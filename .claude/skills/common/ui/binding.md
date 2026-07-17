---
name: binding
description: "Apply correct WaveMaker binding syntax between variables, actions, page params, and UI components. Use when wiring data flow declaratively in markup using bind: expressions."
---

# Skill: Binding

## Objective
Binding serves two purposes:
- bind component value to variable input (or another component value)
- bind variable output to UI elements.

**PERFORM COMPONENT BINDINGS IF REQUIRED IMMEDIATELY WHEN PAGE MARKUP IS READY. REFER `markup` SKILL.
PERFORM VARIABLE DATABINDINGS ALSO IF REQUIRED. REFER `variables` and `actions` SKILL**

## Binding Namespace Rules
- Variable references in markup for Page or App scope: `bind:Variables.<variableName>...`
  - **Example**: For Page, App and Partial scoped Variable references in markup(donot add <scope> in binding): `bind:Variables.loggedInUser.dataSet.roles`
- Action-type references in markup: `bind:Actions.<actionName>...`
- Component references in markup: `bind:Widgets.<componentName>...`
- Never omit namespace prefixes in markup bindings.
- Bind only properties whose component metadata `bindable` is `in-bound` or `in-out-bound`.
- Always reference variable output using `Variables.<variableName>.dataSet` in markup expressions, and always prefix expressions with `bind:` (example: `bind:Variables.<variableName>.dataSet`).

## Strict Case-Sensitive Binding Rule
- When accessing variable/component nodes for binding, always use the exact casing defined in the variable/component tree. Even small casing differences (e.g., datavalue vs dataValue) will cause the binding to fail.
 **Component Tree Structure Example:**
  ```
  Widgets
  └── text1
      ├── datavalue (string)
      ├── leadingiconclass (string)
      └── trailingiconclass (string)
    ```

**Correct Binding ✅**
  `caption="bind:Widgets.text1.datavalue"`
**Incorrect Binding ❌**
  `caption="bind:Widgets.text1.dataValue"`

 **Variable Tree Structure Example:**
   ```
   Variables
   └── loggedInUser
       ├── dataSet (object)
           ├── name (string)
           └── id (string)
 ```
    
**Correct Binding ✅**
  `caption="bind:Variables.loggedInUser.dataSet.name"`
**Incorrect Binding ❌**
  `caption="bind:Variables.loggedInUser.dataset.name"`

- Similarly case-sensitive binding applies for widget bindings also.

## Scope Format in JavaScript
- Page scope variable: `Page.Variables.<variableName>...`
- App scope variable: `App.Variables.<variableName>...`
- Page scope action: `Page.Actions.<actionName>...`
- App scope action: `App.Actions.<actionName>...`

## Core Output Binding Format
- Use variable output with `dataSet` path:
  - Markup: `bind:Variables.<variableName>.dataSet`
  - JavaScript: `Page.Variables.<variableName>.dataSet` or `App.Variables.<variableName>.dataSet`

## Mandatory Binding Path Validation (Variables + Components)

- Generate bindings only from metadata/tree inspection, never from shortened-name assumptions.
- For variable output bindings, inspect variable outputs first and bind the exact node whose type matches the target property.
- For widget bindings, inspect component metadata and use only declared `out-bound` / `in-out-bound` nodes.
- For form field outputs, always use full hierarchy:
  - `bind:Widgets.<formName>.formWidgets.<formFieldName>.<out-bound|in-out-bound property>`
- Never shorten to `bind:Widgets.<formFieldName>...`.
- Recheck every generated binding path end-to-end before finalizing.
- If path/type is ambiguous, inspect metadata again and regenerate (do not guess).

### Metadata-First Variable Output Binding (MANDATORY)

- Do not generate variable bindings by guessing partial paths.
- Before binding a widget property to a variable output, fetch and inspect variable outputs/schema fully using the correct tool by variable type:
  - `ModelVariable`: use **ui_getVariableInputsAndOutputs** (Required Args).
  - API-aware variables (`ServiceVariable`, `CrudVariable`, `LiveVariable`, `WebSocketVariable`): use **platform_getServiceDetails** (Required Args) for operation input/output metadata.
- Treat this output-node discovery step as mandatory before writing any `bind:Variables...` expression.
- Select the final output node only after matching the target widget property type.
- Recheck the final resolved node type before writing markup.
- If `dataSet` is an object and `dataSet.dataValue` is `array<object>`, then list-like widget properties must bind to:
  - `bind:Variables.<variableName>.dataSet.dataValue`
  - not `bind:Variables.<variableName>.dataSet`

## Syntax Rules
- Use `bind:` for JavaScript expressions.
- Use `bind:()` when expression includes operators.
- For bind-only expression properties, always use `bind:()`.
- `bind:` is not required for simple static literal strings.
- Do not use Angular interpolation (`{{...}}`) in markup bindings.
- Update dependent bindings/keys when dataset schema changes (forms/tables/lists/charts).
- Validate table/chart field bindings against known dataset schema; do not bind to unknown fields.
- Custom table UI columns may exist, but should not pretend to bind non-existent dataset fields.

## Supported Binding Patterns
- Dataset binding:
  - `dataset="bind:Variables.employeeService.dataSet"`
- Repeater/list/array item binding: (isList: true)
  - `caption="bind:Variables.employeeService.dataSet[$i].name"`
- Object field binding: (isList: false)
  - `caption="bind:Variables.employeeService.dataSet.results"`
- Nested list inside object `dataSet` binding:(example: `dataSet = { items: [{ title: "" }] }`):
  - list dataset: `dataset="bind:Variables.ordersVar.dataSet.items"`
  - item field: `caption="bind:Variables.ordersVar.dataSet.items[$i].title"`
- For binding the components present inside the list item itself use `"bind:item.<field>"` where item refers to an item in the dataset. We 
  can also achieve this 
  without `bind:item.<field>`, instead you can also use `bind:Variables.<VariableName>.dataSet[$i].<field>` where dataSet is array of items.
- For table column, do not use `bind:item.<field>` instead use `bind:row.getProperty('<username_field_from_dataset>')`
- Variable invoke from markup:
  - `on-click="Variables.serviceVar.invoke()"`
- Action invoke from markup:
  - `on-click="Actions.goToPage_Dashboard.invoke()"`
- For conditional styles/classes, use supported properties (for example `conditionalclass`, `conditionalstyle`) only when valid for that component.
  - conditionalclass: 
    - Examples:
    - string type expression: `conditionalclass="bind:(Variables.userStats.dataSet[0].promptsCountRank <=10 && Variables.userStats.dataSet[0].promptsCountRank >=6) ? \"btn-pill-primary\" : ((Variables.userStats.dataSet[0].promptsCountRank <=5 && Variables.userStats.dataSet[0].promptsCountRank >=4) ? \"btn-pill-secondary\" : (Variables.userStats.dataSet[0].promptsCountRank <=3 && Variables.userStats.dataSet[0].promptsCountRank >=1) ? \"btn-pill-tertiary\" : \"\"))"`
    - object type expression: `conditionalclass="bind:{'bg-success': Widgets.livelist2.currentItem.status === 'Approved', \n    'bg-info': Widgets.livelist2.currentItem.status === 'Pending',\n    'bg-danger': Widgets.livelist2.currentItem.status === 'Rejected'}"`
    - Array<string> type expression: `conditionalclass="bind:[Variables.variablename.dataSet.datavalue, 'bg-info']"`
    
  - conditionalstyle: 
    - Examples:
    `"bind:{'color': 'red'}",
      "bind:{'color': Widgets.colorPicker1.datavalue}",
      "bind:{'background': Page.Variables.MyVariable.dataSet.status === 'pending' ? 'yellow': 'green'}",
      "bind:{'color': 'red', 'font-size': '30px', 'background': Page.Variables.MyVariable.dataSet.status === 'pending'? 'blue': 'green'}"`
    
- Use only simple property access or basic expressions in bindings. Avoid writing function logic, loops, or complex operations inside bindings. For such cases, define and use user-defined functions and call them from the binding instead.
  **Incorrect Binding ❌**
  `caption="bind:(Variables.cartItemsVar.dataSet || []).reduce(function(sum, item){ return sum + (item.products.price * item.quantity); }, 0) | currency:'USD':'symbol':'1.2-2'"`
  `dataset="bind:Variables.teamMembersData.dataSet.filter(function(item) { let query = Widgets.employeeSearch.query; if (!query) return true; query = query.toLowerCase(); return (item.name && item.name.toLowerCase().indexOf(query) > -1) || (item.title && item.title.toLowerCase().indexOf(query) > -1) || (item.department && item.department.toLowerCase().indexOf(query) > -1); })"`
  **Correct Binding ✅**
  `caption="bind:getTotalPrice(Variables.cartItemsVar.dataSet)"`
  `dataset="bind:Variables.teamMembersData.dataSet"` use Variable and property binding for filtering the data

  - For user defined variables and functions defined in JavaScript, binding expression should be as below:(Refer `javascript` skill for 
    defining a variables and functions in scope (App, Page, Partial))
    - For user defined variables binding expression is: `caption=bind:<userDefinedVariableName>`
      - Example:
        - In javascript,`Page.dashboardTitle = "Accounts Dashboard"`. Using dashboardTitle in Markup: `caption="bind:dashboardTitle"`
    - For user defined functions defined in JavaScript, component bindings should be: `caption="bind:<userDefinedFunctionName>()"`
      - Example:
        `
        // User Define JavaScript function in Page script
        Page.getInitials = function (fullName) {
        // CODE GOES HERE
        };
        `
      - Bind expression should be: `caption="bind:getInitials(item.fullname)"`
  
## Existing Markup Attribute binding rules
- Update existing bindable attributes when possible; avoid adding unrelated properties.
- **Do not touch existing bindings or markup attributes** that are not part of the requested change. Only update the binding(s) the user's use case requires; leave all other existing bindings exactly as-is.
- If parent dataset changes, update dependent child keys and related bindings consistently with the latest variable dataset fields.
  - **Example:**
    - Before: parent dataset is `dataset="bind:Variables.autoModelmanagerdashboard4.dataSet"` and child component binding is 
      `caption="bind:Variables.autoModelmanagerdashboard4.dataSet[$i].caption1"`
    - After: parent dataset is `dataset="bind:Variables.teamManagementServiceVariable.dataSet"` and child component bindings should be updated based on parent dataset  
      `caption="bind:Variables.teamManagementServiceVariable.dataSet[$i].<field>"` 
- Perform required component bindings and variable dataBindings immediately once markup is ready.

## Critical API Binding Rules (Must Follow)
- Always determine turn type from actual project state, not conversation memory.
  - **REFINEMENT**: existing variable is already bound to widget/page -> update the existing variable.
  - **INITIAL BINDING**: no existing variable binding -> create a new variable.
- Never create duplicate variables for the same widget binding unless the user explicitly asks for a new variable.
- Validate endpoint schema before generating any variable `dataBindings`.
- Do not bind fields without schema evidence.
  - Remove inferred/generic fields (like `id`, `name`, `status`) unless present in endpoint schema.
- Build and enforce `requiredTargets` from endpoint metadata:
  - Required query/path/body fields must not be omitted.
  - If required UI field is missing, use a temporary static fallback and report it.
- Use exact widget field names from markup for UI-to-API mapping; do not invent field names.
  - Extract from actual tags such as `<wm-form-field name="...">`.
- `dataBindings` entries must follow this structure:
  - `target`: API field path (`name`, `category.id`, `address.street`)
  - `value`: widget binding (`bind:Widgets.<widget>...`)
  - `isList`: `true|false`
  - `type`: schema type (`string`, `number`, `boolean`, `object`, `array`)
  - `invalid`: `false` for valid mappings
- Direction rule for variable/action `dataBinding`:
  - Allowed: map widget/static/variable values into variable/action inputs (example: `{"target":"result","value":"bind:Widgets.<widgetname>.datavalue"}`).
  - Not allowed: bind widget markup properties to `Variables.<variable>.dataBinding...` or `Actions.<action>.dataBinding...`.
  - Wrong examples:
    - `datavalue="bind:Variables.<variableName>.dataBinding.result"`
    - `datavalue="bind:Actions.loginAction.dataBinding.j_username"`
- HTTP method rules:
  - GET/List with no params -> `dataBindings: []`
  - GET/List with params -> bind request params
  - POST/PUT/PATCH/DELETE -> bind form/widget inputs to API input fields
- OAS 2.0 body naming rule:
  - If `in: body` parameter has a non-empty `name`, use that as request-body root.
  - Example: use `ClaimActions.password` (not `body.password`) when body parameter name is `ClaimActions`.
- Markup update safety:
  - Update only binding attributes; do not add unrelated widgets.
  - Update both parent `dataset` and all dependent inner bindings (`[$i]`, row bindings, template bindings).
  - Use complete widget markup blocks for replacement; do not use partial start-tag-only replacements.

## Critical API Binding Examples
- **GET endpoint with no parameters**
  - `dataBindings: []`
  - Markup: `dataset="bind:Variables.ordersListVar.dataSet"`

- **GET endpoint with required query parameter**
  - Required API field: `status`
  - UI field exists: `<wm-form-field name="statusFilter">`
  - Binding entry:
    - `{"target":"status","value":"bind:Widgets.filterForm.formWidgets.statusFilter.datavalue","isList":false,"type":"string","invalid":false}`

- **Required field missing in UI (temporary fallback)**
  - Required API field: `tenantId`
  - No widget field available in markup
  - Temporary fallback:
    - `{"target":"tenantId","value":"TENANT_REQUIRED","isList":false,"type":"string","invalid":false}`
  - Report that fallback must be replaced before production.

- **Nested target mapping using real form field name**
  - UI markup field: `<wm-form-field name="body_category_id">`
  - API target: `category.id`
  - Binding entry:
    - `{"target":"category.id","value":"bind:Widgets.productForm.formWidgets.body_category_id.datavalue","isList":false,"type":"number","invalid":false}`

- **Refinement update (no duplicate variable)**
  - Existing variable: `productServiceUpdateVar`
  - Change requested: map `description` field differently
  - Action: update `productServiceUpdateVar` bindings; keep unrelated variable config unchanged.

## Invalid Format
- Avoid angularJS contructs $scope, $parent, $controller, $rootScope, this, Application.*
- Donot include angularJS code.
