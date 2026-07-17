---
name: pageParams
description: Create and consume WaveMaker page params and partial params. Use when adding, changing, or reading params passed between pages or into partials, in markup or JavaScript.
---

# Skill: Page Params

## Page Params
- Page params pass data across pages.
- Parameterized page: a page needing input to render data should define page-level params.
- Caller page: pass values to the parameterized page through a NavigationAction before invoking navigation.

## Required Tools
- Read existing params first: **ui_getPageParams** (Required Args).
- Update params with merged values: **ui_setPageParams** (Required Args).

## Mandatory Update Sequence
1. Get current page params with **ui_getPageParams** (Required Args).
2. Merge existing params and newly added params.
3. Set the merged list with **ui_setPageParams** (Required Args).
4. Do not overwrite by sending only the new params.

## Access Patterns
- JavaScript current-page access: `App.activePage.pageParams.<page_param_name>`.
- JavaScript partial-page script access: `Partial.pageParams.<page_param_name>`.
- Binding expression access: `bind:pageParams.<page_param_name>`.
- Use `pageParams`, not `params`, when referencing page params.
- Do not use page-name scoped params paths. i.e. Pages.<pageName>.pageParams is wrong. Instead, use Page.pageParams which is valid

## Invalid Page Params Examples
- Invalid JavaScript: `Pages.<pageName>.params.<page_param_name>`
- Invalid JavaScript: `Pages.<pageName>.pageParams.<page_param_name>`
- Invalid JavaScript current-page access: `App.activePage.params.<page_param_name>`
- Invalid binding expression: `bind:Pages.<pageName>.params.<page_param_name>`
- Invalid binding expression: `bind:Pages.<pageName>.pageParams.<page_param_name>`

Use these instead:
- Javascript page access: `Page.pageParams.<page_param_name>`
- JavaScript current-page access: `App.activePage.pageParams.<page_param_name>`
- JavaScript partial-page script access: `Partial.pageParams.<page_param_name>`
- Binding expression in the page: `bind:pageParams.<page_param_name>`
- Binding expression using activePage: `bind:activePage.pageParams.<page_param_name>`

## Partial Params
- For partials linked via `content="<partialName>"`, pass partial params using inner `<wm-param>` elements.
- Access the partial params using `Partial.pageParams` in script file

Static value:

```html
<wm-param name="deptName" value="Engineering" type="string"></wm-param>
```

Binding expression:

```html
<wm-param name="size" value="bind:Variables.listEmpVar.dataSet.length" type="integer"></wm-param>
```
