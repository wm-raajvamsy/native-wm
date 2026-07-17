---
name: formatters
description: Apply built-in pipes or custom formatters to transform/format the value a user sees on a WaveMaker component. Use when a bound value needs to be displayed differently — as currency, a date, masked text, prefixed/suffixed strings, or any other transformed representation.
---

# Skill: Formatters and Pipes

**When to use:** When a bound value needs to be formatted or transformed before it is displayed on a component (e.g. show a number as currency, prefix a value with a label, mask sensitive data, format a date), apply a formatter pipe to the binding expression. This works on any bindable property — `caption`, `datavalue`, `dataset`, etc.

**Syntax:** Append `| <pipeName>: <param>` to any `bind:` expression.
```
<attribute>="bind:<expression> | <pipeName>: <param>"
```

There are two types: **built-in pipes** and **custom formatters**.

---

## Validation Rule — Format Pattern and Formatter Name Must Be Confirmed Before Use

Before applying any formatter or setting any format-related attribute value (e.g. `formatpattern`), the agent **must** complete both checks below. Do NOT skip either check.

**Check 1 — Is it a known built-in option?**
- Look up the component's metadata (`/catalog/components/{name}/{name}.md`) and verify the value is listed as a valid option for that attribute.Refer Built-in Pipes.
- Example: `formatpattern` has a fixed set of allowed values — the value must appear in that list.

**Check 2 — Is it defined as a custom formatter?**
- If Check 1 fails, read `src/main/webapp/extensions/formatters.js` in the project.
- Verify the value is registered as a key inside `WM_CUSTOM_FORMATTERS`.

**If neither check passes → block and report:**
- Do NOT apply the change.
- Tell the user: *"The value `[X]` is not a recognized built-in option for `[attribute]` and was not found in `formatters.js`. Please confirm or provide a valid value."*

**If either check passes → proceed** with the formatter/pipe in the binding expression.

### `formatpattern` — Scope and Number Formatting Rules

- `formatpattern` is **only available on `wm-table-column`**. Do not apply it on any other component.
- When `formatpattern` is set to a number-related pattern (`numberToString` or `stringToNumber`), also set `fractionsize` on the same `wm-table-column` if decimal precision is required.
- `fractionsize="0"` — displays the number with a thousands separator and no decimal places (e.g. `1000` → `1,000`).
- `fractionsize="2"` — displays the number with a thousands separator and 2 decimal places (e.g. `1000` → `1,000.00`).
- Never add `fractionsize` without a number-type `formatpattern` — it has no effect on non-numeric patterns.

**Examples:**
```xml
<!-- fractionsize="0": thousands separator, no decimals — 1000 → 1,000 -->
<wm-table-column formatpattern="numberToString" fractionsize="0" ...></wm-table-column>

<!-- fractionsize="2": thousands separator + 2 decimal places — 1000 → 1,000.00 -->
<wm-table-column formatpattern="numberToString" fractionsize="2" ...></wm-table-column>

<!-- stringToNumber with fractionsize -->
<wm-table-column formatpattern="stringToNumber" fractionsize="2" ...></wm-table-column>

<!-- non-numeric pattern — do NOT add fractionsize -->
<wm-table-column formatpattern="toDate" ...></wm-table-column>
```

---

## Built-in Pipes

Use built-in pipes directly in the binding expression without any setup.

| Pipe | What it does | Usage | Example |
|------|-------------|-------|---------|
| `numberToString` | Converts a number to a formatted string. `fractionSize` defines how many decimal places to round to (e.g. value `12345.6789` with fractionSize `3` → `12,345.679`) | `\| numberToString: '<fractionSize>'` | `caption="bind:Widgets.price1.datavalue \| numberToString: '2'"` |
| `stringToNumber` | Converts a string to a number | `\| stringToNumber` | `caption="bind:Widgets.text1.datavalue \| stringToNumber"` |
| `prefix` | Prepends a string before the value | `\| prefix: '<text>'` | `caption="bind:Widgets.id1.datavalue \| prefix: 'ID-'"` |
| `suffix` | Appends a string after the value | `\| suffix: '<text>'` | `caption="bind:Widgets.label1.datavalue \| suffix: ' USD'"` |
| `currency` | Formats a number as currency | `\| currency` | `caption="bind:Variables.amount.dataValue \| currency"` |
| `toDate` | Formats a value as a date string | `\| toDate: '<datePattern>'` | `caption="bind:Variables.date.dataValue \| toDate: 'yyyy-MM-dd'"` |
| `timeFromNow` | Shows relative time (e.g. "5 minutes ago") | `\| timeFromNow` | `caption="bind:Widgets.date1.datavalue \| timeFromNow"` |
| `templateReplace` | Replaces named `${placeholder}` tokens in a string; primarily used for parameterized i18n messages | `\| templateReplace: {"<key>": "<value or binding>"}` | see below |

**`templateReplace` examples** — given a localized message `LABEL_TRANSACTION_MESSAGE : "${amount} sent to ${receiver} successfully"`:
```
// with empty placeholders
appLocale.LABEL_TRANSACTION_MESSAGE | templateReplace: {"amount":"","receiver":""}

// with static values
appLocale.LABEL_TRANSACTION_MESSAGE | templateReplace: {"amount":"$1000","receiver":"John Doe"}

// with widget bindings
appLocale.LABEL_TRANSACTION_MESSAGE | templateReplace: {"amount": Widgets.amount_number1.datavalue, "receiver": Widgets.receiver_text1.datavalue}
```

---

## Custom Formatters

**Use custom formatters only when the built-in pipes above are not sufficient to achieve the required formatting.** For example, masking credit card digits, role-based display, country-specific formatting, etc.

**Step 1 — Define** the formatter in `src/main/webapp/extensions/formatters.js`:

```javascript
const WM_CUSTOM_FORMATTERS = (function(){
  return {
    myFormatter: {
      formatter: function(data, param1, context){
        // data    → the bound value
        // param1  → config param passed from the binding expression
        // context → current item object (auto-passed for List, Card, Table, Select, Search)
        return formattedValue;
      },
      config: {
        param1: {
          name: 'Display Label',  // label shown in the Bind dialog at design time
          widget: 'text',         // input widget: 'text' or 'select'
          value: 'defaultValue'   // pre-filled default
        }
      }
    }
  };
})();
```

- `data` — the value of the expression on which the formatting is applied (e.g. the credit card number string).
- `param1` — a param passed via the `config` object; the `value` field in config sets its default (e.g. `config: { param1: { value: 'X' } }`). Multiple params can be declared in config and each becomes a successive argument.
- `context` — an optional last argument passed directly from the binding expression as a variable binding or widget binding (e.g. `Variables.loggedInUser.dataSet.roles`). Use it to supply any additional runtime value the formatter needs — roles, user info, or any component out-bound property.
- `config` — optional. used for giving default value for param1

Refer `javascript` skill for more information on adding custom formatters in `src/main/webapp/extensions/formatters.js`.

**Step 2 — Use** in a binding expression with the `custom` keyword:

```
<attribute>="bind:<expression> | custom: '<formatterName>': <param1>: <param2>"
```

Pattern: `EXPRESSION | custom: 'formatterName': customValueToApplyInFormatter`

**Full example** — credit card masking with role-based visibility:

Definition in `formatters.js`:
```javascript
creditcard: {
  formatter: function(data, param1, roles) {
    const hyphenSeparatedStr = data.match(new RegExp('.{1,4}', 'g')).join(" - ");
    const last4 = hyphenSeparatedStr.substring(hyphenSeparatedStr.length - 4);
    let maskedData = '';
    if (roles && roles.length && roles[0] == 'user') {
      maskedData = hyphenSeparatedStr.substring(0, hyphenSeparatedStr.length - 4);
    } else {
      maskedData = hyphenSeparatedStr.substring(0, hyphenSeparatedStr.length - 4).replace(/\d/g, param1);
    }
    return maskedData + "  " + last4;
  },
  config: {
    param1: {
      name: 'Mask char',
      widget: 'text',
      value: 'X'
    }
  }
}
```

Usage in markup:
```xml
caption="bind:Variables.cardDetailsVariable.dataSet[$i].creditcardvalue | custom: 'creditcard': 'X': Variables.loggedInUser.dataSet.roles"
```

- `'creditcard'` — formatter name defined in `formatters.js`
- `'X'` — mask character passed as `param1`
- `Variables.loggedInUser.dataSet.roles` — roles array; requires authentication to be enabled
