---
name: filterExpressions
description: Define and configure filterExpressions for WaveMaker LiveVariable. Use when adding nested logical filter rules with correct operator mapping.
---

# Skill: Filter Expressions

## Objective

Define and configure `filterExpressions` for `LiveVariable` correctly, including nested logical rules and operator mapping.

## Filter expressions only on LiveVariable

Use `filterExpressions` on `LiveVariable` when you need to fetch only specific records from the datasource based on conditions. They are used to apply filters such as equals, contains, greater than, or between on dataset fields so that the backend returns only matching data instead of all records.

### liveVariable supported keys (databaseVariable1 reference)

Example: liveVariable sample json looks like
{
"databaseVariable1" : {
  ...
  "filterExpressions" : {
    "condition" : "AND",
    "rules" : [ {
    "target" : "deptId",
    "type" : "integer",
    "matchMode" : "greaterthan",
    "value" : 1,
    "required" : false,
    "secondvalue" : ""
    }, {
    "target" : "department.deptCode",
    "type" : "string",
    "matchMode" : "anywhereignorecase",
    "value" : "ng",
    "required" : false,
    "secondvalue" : ""
    }, {
    "condition" : "AND",
    "rules" : [ {
    "target" : "jobTitle",
    "type" : "string",
    "matchMode" : "anywhereignorecase",
    "value" : "Manager",
    "required" : false,
    "secondvalue" : ""
      } ]
    } ]
    }
  }
}

Use the following tree as the canonical structure for supported `LiveVariable` keys and nested `filterExpressions`:

``` LiveVariable sample json keys structure
databaseVariable1
├── _id
├── name
├── owner
├── category
├── dataBinding
├── operation
├── dataSet
├── type
├── isList
├── saveInPhonegap
├── maxResults
├── designMaxResults
├── inFlightBehavior
├── startUpdate
├── autoUpdate
├── transformationRequired
├── liveSource
├── ignoreCase
├── matchMode
├── orderBy
├── propertiesMap
├── tableName
├── tableType
├── properties
├── relatedTables
├── filterFields
│   └── {}  (optional map of filter values)
├── filterExpressions
│   ├── condition (AND / OR)
│   └── rules[]
│       ├── rule
│       │   ├── target
│       │   ├── type
│       │   ├── matchMode
│       │   ├── value
│       │   ├── required
│       │   └── secondvalue
│       └── group rule
│           ├── condition
│           └── rules[]
│               └── rule
│                   ├── target
│                   ├── type
│                   ├── matchMode
│                   ├── value
│                   ├── required
│                   └── secondvalue
└── package
```

### Rules for filter criteria (filterExpression / rule objects)

1. The rules in this section apply only to `LiveVariable`. Do not use them for other variable types.
2. Use the **"condition"** property for logical operators (`AND`, `OR`).
3. Each condition is a **rule object**. Preserve parentheses using nested logical groups; every non-logical condition is one atomic rule with these keys:

```json
{
  "target": "<field name from dataset>",
  "type": "<data type>",
  "matchMode": "<operator mapping>",
  "value": "<primary value>",
  "required": false,
  "secondvalue": ""
}
```

4. Nested logical groups are rule objects with their own **"condition"** and **"rules"** array:

```json
{
  "condition": "AND | OR",
  "rules": [ ... ]
}
```

Use **matchMode** (lowercase) in rule objects. Refer `matchMode and operator mapping` section below.

### matchMode and operator mapping

| matchMode (use in rules) | operator |
| ------------------------ | -------- |
| start | STARTING_WITH |
| end | ENDING_WITH |
| anywhere | CONTAINING |
| exact | EQUALS |
| notequals | NOT_EQUALS |
| between | BETWEEN |
| in | IN |
| lessthan | LESS_THAN |
| lessthanequal | LESS_THAN_OR_EQUALS |
| greaterthan | GREATER_THAN |
| greaterthanequal | GREATER_THAN_OR_EQUALS |
| null | NULL |
| isnotnull | IS_NOT_NULL |
| empty | EMPTY |
| isnotempty | IS_NOT_EMPTY |
| nullorempty | NULL_OR_EMPTY |

### Example: filterExpression from logical criteria

Logical criteria:

`(deptId GREATER_THAN 1 AND department.deptCode CONTAINS_IGNORE_CASE ng AND (jobTitle CONTAINS_IGNORE_CASE Manager))`

Equivalent **filterExpressions** metadata:

```json
"filterExpressions": {
  "condition": "AND",
  "rules": [
    {
      "target": "deptId",
      "type": "integer",
      "matchMode": "greaterthan",
      "value": 1,
      "required": false,
      "secondvalue": ""
    },
    {
      "target": "department.deptCode",
      "type": "string",
      "matchMode": "anywhereignorecase",
      "value": "ng",
      "required": false,
      "secondvalue": ""
    },
    {
      "condition": "AND",
      "rules": [
        {
          "target": "jobTitle",
          "type": "string",
          "matchMode": "anywhereignorecase",
          "value": "Manager",
          "required": false,
          "secondvalue": ""
        }
      ]
    }
  ]
}
```

## Filter expression for markup attributes

Use these rules for `wm-form-field` in `wm-liveform` and for `wm-table-column` when `wm-table` dataset is bound to `LiveVariable`.

### Rules for filterexpression (for wm-form-field in wm-liveform / wm-table-column with LiveVariable dataset)

1. The rules in this section apply only to `wm-form-field` in `wm-liveform` or `wm-table-column` when `wm-table` dataset is bound to
   `LiveVariable`. Do not use them for other component or attribute binding types.
2. Use the same rule-object structure described in `Rules for filter criteria (filterExpression / rule objects)`.
3. Use **matchMode** (lowercase) in rule objects, based on the `matchMode and operator mapping` table above.
4. The final output must be a valid JSON string escaped for use inside an HTML attribute for `wm-form-field` or `wm-table-column`.

### Example: escaped filterexpression attribute

Logical criteria:

`(deptId GREATER_THAN 1 AND department.deptCode CONTAINS_IGNORE_CASE ng AND (jobTitle CONTAINS_IGNORE_CASE Manager))`

Equivalent escaped `filterexpressions` attribute:

```text
filterexpressions="{&quot;condition&quot;:&quot;AND&quot;,&quot;rules&quot;:[{&quot;target&quot;:&quot;q1&quot;,&quot;type&quot;:&quot;integer&quot;,&quot;matchMode&quot;:&quot;greaterthan&quot;,&quot;value&quot;:1234,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;},{&quot;target&quot;:&quot;deptCode&quot;,&quot;type&quot;:&quot;string&quot;,&quot;matchMode&quot;:&quot;anywhereignorecase&quot;,&quot;value&quot;:&quot;ng&quot;,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;},{&quot;condition&quot;:&quot;AND&quot;,&quot;rules&quot;:[{&quot;target&quot;:&quot;location&quot;,&quot;type&quot;:&quot;string&quot;,&quot;matchMode&quot;:&quot;anywhereignorecase&quot;,&quot;value&quot;:&quot;US&quot;,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;}]}]}"
```

For `wm-form-field` markup:

```agsl
<wm-form-field name="department" displayname="Department" matchmode="startignorecase" show="true"
                        primary-key="false" is-related="true" generator="assigned" placeholder="" required="false"
                        type="list" key="department" widget="select"
                        filterexpressions="{&quot;condition&quot;:&quot;AND&quot;,&quot;rules&quot;:[{&quot;target&quot;:&quot;q1&quot;,&quot;type&quot;:&quot;integer&quot;,&quot;matchMode&quot;:&quot;greaterthan&quot;,&quot;value&quot;:1234,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;},{&quot;target&quot;:&quot;deptCode&quot;,&quot;type&quot;:&quot;string&quot;,&quot;matchMode&quot;:&quot;anywhereignorecase&quot;,&quot;value&quot;:&quot;ng&quot;,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;},{&quot;condition&quot;:&quot;AND&quot;,&quot;rules&quot;:[{&quot;target&quot;:&quot;location&quot;,&quot;type&quot;:&quot;string&quot;,&quot;matchMode&quot;:&quot;anywhereignorecase&quot;,&quot;value&quot;:&quot;US&quot;,&quot;required&quot;:false,&quot;secondvalue&quot;:&quot;&quot;}]}]}">
                    </wm-form-field>
```
