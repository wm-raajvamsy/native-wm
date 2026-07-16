---
name: form-architecture
description: >
  WaveMaker form internals deep reference: component hierarchy (wm-form, wm-form-field, wm-form-action),
  transpilation pipeline for static and dynamic form flows, fragment registration, WmFormField internals,
  data-flow summary from variable to field to submit, edit/view mode management, and styling architecture
  with theme registration. Load when building a non-trivial form, implementing dynamic fields, or
  troubleshooting form data flow.
---

# Form Architecture — Runtime Internals

Deep reference for the WaveMaker form system internals. Read this only when debugging form behavior or understanding how the pipeline works end-to-end.

## Component Hierarchy

```
WmForm (form.component.tsx) — orchestration, dataoutput, submit, validation
  ├── Header (icon + title + subheading) — rendered if any of those props set
  ├── WmMessage — inline success/error (when messagelayout="Inline")
  ├── state.dynamicForm — React elements from metadata (dynamic forms only)
  └── props.children — static markup
      ├── WmFormBody — themed body container (auto-created by transpiler)
      │   └── WmFormField × N — per-field wrapper
      │       ├── WmLabel (displayname) — label for the field
      │       └── WmText / WmSelect / WmDate / ... — actual input widget
      └── WmFormFooter — themed footer container (auto-created by transpiler)
          └── WmFormAction × N — submit/reset/cancel buttons
```

## Transpilation Pipeline

### Static Form Flow (Build Time)

1. **`form.transformer.ts`** processes `<wm-form>`:
   - `pluckFormActionNodes()` — extracts all `wm-form-action` nodes recursively
   - Creates synthetic `<wm-form-body>` and `<wm-form-footer>`
   - Moves children → body, actions → footer
   - Wires `formSubmit` (from dataset variable `.invoke()`), `onChange` (two-way binding), `onBeforerender`
   - With design tokens: passes form `class` to body/footer

2. **`form-field.transformer.ts`** processes each `<wm-form-field>`:
   - Walks up DOM to find parent `wm-form` or `type="dynamic"` container
   - Sets `formRef` to the form's `name`
   - `extractField()` reads `widget` attr → `getFormWidgetTemplate()` → large switch statement
   - Generates render-prop pattern: `<WmFormField renderFormFields={($formField) => (<> label + widget </>)}>`
   - Binds widget props to `$formField.*` (e.g., `datavalue="bind:$formField.defaultvalue"`)
   - Wires `on-change` to bubble to parent form, `on-validate` to field validation

3. **`form-action.transformer.ts`** processes `<wm-form-action>`:
   - Rewrites `type="submit"` → `Widgets.formName.submit()`
   - Rewrites `type="reset"` → `formreset()`
   - Maps `edit()`, `new()`, `cancel()`, `delete()` to form proxy calls
   - Wraps in `formAction={($event) => { ... }}`

### Dynamic Form Flow (Build Time + Runtime)

**Build time** — `form.transformer.ts` detects `metadata` attribute:

```javascript
generateComponent={(metadata, formName, proxy, isHorizontal) => {
  if (!fragment.wmformScope) { fragment.wmformScope = {} }
  fragment.wmformScope[formName] = () => proxy;
  const itemsperrow = proxy?.state?.props?.itemsperrow;
  return dynamicForm(metadata, formName, fragment, isHorizontal, enableDesignTokens, itemsperrow);
}}
```

**Runtime** — when `metadata` prop changes:

1. `WmForm.onPropertyChange('metadata')` → `generateFormFields()`
2. Reads `metadata.data || metadata` as field array
3. Optional `onBeforerender` callback to filter/modify fields
4. Calls `generateComponent(fields, formName, proxy, isHorizontal)` which calls:
5. **`form.generator.js`** → `generateFormFields()`:
   - Iterates metadata array, builds `<wm-form-field ...>` strings
   - Design tokens ON: wraps in `<wm-container type="dynamic" dynamicForm="formName">`
   - Multi-column (itemsperrow > 1): adds `width="100%" direction="row" wrap="true"`
   - Design tokens OFF: wraps in `<wm-layoutgrid>` with `<wm-gridrow>/<wm-gridcolumn>`
6. **`component-generator.js`** → `generate()`:
   - `transpileMarkup()` — runs same transpiler pipeline
   - `@babel/standalone` with react preset → `React.createElement` code
   - `new Function(...)` evaluates with React + fragment + component map
   - Returns live React elements

## Fragment Registration (base-fragment.component.tsx)

`BaseFragment.onComponentInit` wires forms together as child components mount:

| Component type | Registration action |
|---|---|
| `WmForm` | `Widgets[name] = form`; collects `formFields`, `formWidgets`, `buttonArray`; calls `registerFormFields()` + `registerFormActions()` |
| Widget with `formfield="true"` | `Widgets[formRef].formWidgets[name] = widget` |
| `WmFormAction` | `Widgets[formKey].buttonArray.push(action)` |
| `WmFormField` | `Widgets[formRef].formFields.push(field)` |

`onComponentDestroy` clears `formWidgets`, `formFields`, `formfields` from the form.

## WmFormField Internals

### Field-to-Widget Bridge

`WmFormField` acts as middleware between the form and the actual input widget:

1. **Mount**: Resolves `formwidget` from `form.formWidgets[formKey || name]`
2. **Render**: `renderFormFields(proxy)` → `cloneElement` injects:
   - `datavalue`, `value`, `isValid`
   - `invokeEvent`, `triggerValidation`, `onFieldChange`
   - `formRef` (the form instance)
3. **Change**: `onFieldChangeEvt` → updates `datavalue` → `validateFormField()` → `form.updateDataOutput(key, newVal)`
4. **Validation**: `setValidators()` wires sync rules, `setAsyncValidators()` for async. `validateFormField()` mirrors widget invalid state, runs sync then async.

### Cross-Field Validation

- `observeOn(fieldNames)` — registers this field to watch other fields
- `notifyChanges()` — when this field changes, re-validates observer fields
- Observer fields' `formwidget.validate` + `validateFormField` are called

## Data Flow Summary

```
User types → input widget onChange
  → WmFormField.onFieldChangeEvt(newVal)
    → field.props.onChange callback
    → field.validateFormField()
    → form.updateDataOutput(fieldName, newVal)
      → form.formdataoutput[fieldName] = newVal
      → parentFormRef?.updateDataOutput() (nested forms)
      → setState({ props: { dataoutput: formdataoutput } })
```

## Mode Management

- `isUpdateMode: true` = **Edit** mode (fields editable, save/cancel visible)
- `isUpdateMode: false` = **View** mode (fields readonly, edit/delete visible)
- `form.edit()` / `form.new()` → sets `isUpdateMode = true`
- `form.cancel()` → sets `isUpdateMode = false`
- `defaultmode="Edit"` → initial `isUpdateMode = true`
- `defaultmode="View"` → initial `isUpdateMode = false`
- `showActions()` toggles each action's `show` based on `action.updateMode === isUpdateMode`

## Styling Architecture

### Theme Registration

| Class name | Style file | Part |
|---|---|---|
| `app-form` | `form.styles.ts` | Root form |
| `app-form-body` | `form-body.styles.ts` | Body region |
| `app-form-footer` | `form-footer.styles.ts` | Footer region |
| `app-form-field` | `form-field.styles.ts` | Field wrapper |
| `app-form-action` | `form-action.styles.ts` | Action button |

### Foundation Token Sources

- **form-wrapper.json** → `--wm-form-*` (root, header, body, footer)
- **form-controls.json** → `--wm-form-controls-*` (input chrome, labels, floating labels, states)
- **form.less** → Maps CSS variables to selectors, handles floating labels, error states, disabled states

### Design Token Application

- `WmFormBody` merges `this.styles.root` with `theme.getStyle('app-form')?.body?.root`
- `WmFormFooter` merges with `theme.getStyle('app-form')?.footer?.root`
- Field width/flex comes from `form.state.fieldLayoutStyle` (responsive columns)
- Horizontal layout adds `app-form-field-horizontal` class
