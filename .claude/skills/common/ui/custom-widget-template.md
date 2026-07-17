# Skill: Custom Widget Template

## Objective

Apply a **custom UI template** (a partial) to WaveMaker widgets that render repetitive list or option data — `wm-search`, `wm-checkboxset`, `wm-radioset`, `wm-tree` — so each row, option, or tree node uses custom markup instead of the default layout.



## When to Use This Skill

- User wants custom look and feel for each item in a **Search / Autocomplete / Typeahead** dropdown.
- User wants custom layout for each option in **Checkboxset** or **Radioset**.
- User wants custom **Tree** node UI (expand/collapse icons, selection styling, per-node actions).
- User asks to apply, reuse, or wire an existing widget template by name.
- User asks to call `setTemplate` from page or partial script.

---

## Supported Widgets

| Widget | Component | Notify via |
|--------|-----------|------------|
| Search / Autocomplete / Typeahead | `wm-search` | `setTemplate('<partialName>')` |
| Checkboxset | `wm-checkboxset` | `setTemplate('<partialName>')` |
| Radioset | `wm-radioset` | `setTemplate('<partialName>')` |
| Tree | `wm-tree` | `setTemplate('<partialName>')` |

Do not apply this skill to widgets outside the list above.

---

## Template Architecture

Three layers:

| Layer | Shape | Wiring |
|-------|-------|--------|
| Host widget | **List** of items (array) | Widget `dataset` bound to a variable / array |
| Template partial | **Single item** per render | Receives one item as `pageParams.item` |
| Template ModelVariable | Single item mirror | `dataBinding: bind:pageParams.item`, `type: "entry"`, `isList: false` |

**Field parity rule:** Every field used in template markup must exist on one element of the host widget’s list. Derive fields from the bound variable outputs — do not invent fields.

### Host widget list example

```json
[
  { "label": "Songs",     "icon": "fa fa-music",         "link": "#/Songs" },
  { "label": "Favorites", "icon": "wi wi-favorite",      "link": "#/Favorites" },
  { "label": "Albums",    "icon": "wi wi-video-library", "link": "#/Albums" }
]
```

### Template ModelVariable mirror (one item)

```json
{ "label": "", "icon": "", "link": "" }
```

---

## Template Partial Structure

### Partial root

```html
<wm-partial type="template" name="<partialName>"> ... </wm-partial>
```

The partial **name** is the value passed to `setTemplate('<partialName>')`.

### Required pieces on the template partial

1. **Page param `item`** (object) — receives the current row/node from the host widget. Load skill `pageParams` for create/merge rules.
2. **ModelVariable** mirroring one item — see table below.
3. **Markup bindings** to the item fields — see Binding Styles below.

### Template ModelVariable spec

| Property | Value |
|----------|--------|
| `category` | `"wm.Variable"` |
| `type` | `"entry"` |
| `isList` | `false` |
| `dataSet` | Object whose keys match one host list item (placeholders for design time) |
| `dataBinding` | `[{ "target": "dataBinding", "value": "bind:pageParams.item" }]` |

**Design-time inspection:** use `~{mcp_ui-mcp-server_getVariableInputsAndOutputs}` to confirm ModelVariable inputs/outputs before binding markup.

### Template ModelVariable JSON example

```json
"staticVariable1": {
  "_id": "wm-staticVariable1-wm.Variable-1779447966025",
  "name": "staticVariable1",
  "owner": "Page",
  "category": "wm.Variable",
  "dataBinding": [
    { "target": "dataBinding", "value": "bind:pageParams.item" }
  ],
  "dataSet": {
    "label": "",
    "icon": "",
    "link": ""
  },
  "type": "entry",
  "isList": false,
  "twoWayBinding": false,
  "saveInPhonegap": false
}
```

### Template-partial `dataSet` shape (exception to generic ModelVariable rule)

Generic `ModelVariable` with `isList: false` normally has `dataSet: { "dataValue": ... }` (refer skill `variables`). On a **template partial**, because `dataBinding` is `bind:pageParams.item`, runtime places the item object into `dataSet` directly. Therefore:

- `dataSet` mirrors the item object **without** a `dataValue` wrapper.
- Style A markup binds to `bind:Variables.<var>.dataSet.<field>` (no `.dataValue.`).

Do not wrap template `dataSet` in `dataValue` and do not set `isList: true`.

---

## Markup Binding Styles

Both styles require the ModelVariable above. Prefer Style A.

### Style A — Variable (preferred)

```html
<wm-label  caption="bind:Variables.staticVariable1.dataSet.label" name="label1"></wm-label>
<wm-icon   iconclass="bind:Variables.staticVariable1.dataSet.icon" name="icon1"></wm-icon>
<wm-anchor caption="bind:Variables.staticVariable1.dataSet.label"
           hyperlink="bind:Variables.staticVariable1.dataSet.link" name="anchor1"></wm-anchor>
```

Pattern: `bind:Variables.<variableName>.dataSet.<field>`

### Style B — Page param

```html
<wm-label  caption="bind:pageParams.item.label" name="label1"></wm-label>
<wm-icon   iconclass="bind:pageParams.item.icon" name="icon1"></wm-icon>
<wm-anchor caption="bind:pageParams.item.label"
           hyperlink="bind:pageParams.item.link" name="anchor1"></wm-anchor>
```

Pattern: `bind:pageParams.item.<field>`

| Style | Markup pattern | ModelVariable required |
|-------|----------------|------------------------|
| A — Variable (preferred) | `bind:Variables.<variableName>.dataSet.<field>` | Yes |
| B — Page param | `bind:pageParams.item.<field>` | Yes |

Use exact key casing from the source list item (refer skill `binding` for case-sensitivity rules).

---

## Tree Widget Template (`wm-tree`)

Tree uses the same `pageParams.item` + ModelVariable pattern; each rendered node is one `pageParams.item`. Tree commonly uses **Style B** so node data fields and `_node` metadata read uniformly.

### Tree item

- **Data fields** from the host tree dataset (e.g. `title`, `iconClass`).
- **`_node` runtime metadata** (provided by `wm-tree`):

| `_node` property | Use |
|------------------|-----|
| `open` | Node expanded / collapsed (`true` / `false`) |
| `isParent` | Has children — switch parent vs leaf UI |
| `isSelected` | Selection state — drives `conditionalclass` / `conditionalstyle` |
| `level` | Depth — root styling (`level === 0`) |

Binding paths: `bind:pageParams.item._node.open`, `bind:pageParams.item._node.isParent`, `bind:pageParams.item._node.isSelected`, `bind:pageParams.item._node.level`.

Use the underscore form **`_node`** — never `item_node`.

### Tree template partial markup example

```html
<wm-partial type="template" name="tree1Template4">
    <wm-container direction="row" alignment="center" gap="auto" width="300px" name="container1"
        class="app-container-default" variant="default">
        <wm-container direction="row" alignment="center" gap="auto" width="fill" name="container3"
            class="app-container-default" variant="default">
            <wm-button class="btn-customVariant btn-text btn-default" caption="" type="button"
                name="button2" variant="text:default"
                conditionalclass="bind:{'btn-secondary': pageParams.item._node.isSelected}"
                iconclass="bind:pageParams.item.iconClass"></wm-button>
            <wm-label caption="bind:pageParams.item.title" class="h5" name="label1" variant="default:h5"
                conditionalclass="bind:{'text-secondary': pageParams.item._node.isSelected}"
                conditionalstyle="bind:{'font-weight': pageParams.item._node.level === 0 ? 'bold' : 'normal'}">
            </wm-label>
            <wm-icon name="icon4" variant="default:xs"
                iconclass="bind:pageParams.item._node.isParent ? 'fa fa-question' : ''"></wm-icon>
            <wm-icon name="icon1" variant="default:xs"
                iconclass="bind:pageParams.item._node.isParent ? 'mi mi-more-vert' : 'mi mi-arrow-right'"
                show="bind:pageParams.item._node.open == false"></wm-icon>
            <wm-icon name="icon2" variant="default:xs"
                iconclass="bind:pageParams.item._node.isParent ? 'mi mi-arrow-drop-up' : ''"
                show="bind:pageParams.item._node.open == true"></wm-icon>
        </wm-container>
    </wm-container>
    <wm-confirmdialog name="confirmdialog1" variant="default:xs"
        title="bind:pageParams.item.title + ' Details'"
        message="bind:getChildLabelsMessage(pageParams.item)">
    </wm-confirmdialog>
</wm-partial>
```

### Tree template ModelVariable scaffold

```json
{
  "title": "",
  "iconClass": "",
  "_node": {
    "open": false,
    "isParent": false,
    "isSelected": false,
    "level": 0
  }
}
```

---

## Notify the Widget (`setTemplate`)

Call `setTemplate` from page/partial script after the template partial exists and the host widget is in the DOM. Replace `<partialName>` with the exact partial name (case-sensitive).

```javascript
Page.Widgets.search1.setTemplate('<partialName>');
Page.Widgets.checkboxset1.setTemplate('<partialName>');
Page.Widgets.radioset1.setTemplate('<partialName>');
Page.Widgets.tree1.setTemplate('<partialName>');
```

Partial-scoped host:

```javascript
Partial.Widgets.search1.setTemplate('<partialName>');
```

### Placement

```javascript
Page.onReady = function ($event, $widget) {
    Page.Widgets.employeeSearch.setTemplate('EmployeeSearchItemTemplate');
};
```

- Use `Partial.onReady` when the host widget lives on a partial.
- If the host widget is inside a dialog, tab, accordion, or wizard step, call `setTemplate` in that container’s load/open handler — components inside unloaded containers are not in the DOM (refer skill `wizard` / `javascript` for DOM-timing rules).

Add the script with `~{mcp_ui-mcp-server_updateJSContent}`.

---

## Creating the Template Partial

1. Create a **partial** (never a page). Use `{{createPage}}` with partial type, or Studio **+** → **Widget Template** layout. Load skill `page_management`.
2. Provide the **partial name** — this is the `<partialName>` for `setTemplate()`.
3. Add partial page param **`item`** (object). Load skill `pageParams`.
4. Inspect one **list item shape** from the host widget’s bound variable (`~{mcp_ui-mcp-server_getVariableInputsAndOutputs}` or service variable describe tools per skill `variables`).
5. Create the **ModelVariable** with the spec above (`type: "entry"`, `isList: false`, `dataBinding: bind:pageParams.item`, `dataSet` keys = one item).
6. Bind template markup using Style A (preferred) or Style B.
7. Verify with `~{mcp_platform-server_listPages}` that the result is a partial (`wm-partial` root), not a page.

---

## Hard Rules

1. **Partial only** — Widget templates must be partials. Never create or wire a full-page template.
2. **Exact partial name** — Use the partial name in `setTemplate('<partialName>')`. Case-sensitive.
3. **Exact widget name** — `Page.Widgets.<widgetName>` / `Partial.Widgets.<widgetName>` must match markup `name` exactly.
4. **JavaScript only** — `setTemplate` is a widget method called from script; do not put the template name in markup bindings.
5. **List dataset on host** — Host widget must have a valid list-shaped dataset before `setTemplate` is wired. Fix dataset per skills `variables` / `binding` first.
6. **Template ModelVariable shape** — `type: "entry"`, `isList: false`, `dataBinding: bind:pageParams.item`, `dataSet` keys mirror one host list item with **no `dataValue` wrapper**. Never set `isList: true` on the template ModelVariable.
7. **`pageParams.item` is mandatory** — Template partial must define page param `item` and the ModelVariable must bind to it. Required for both Style A and Style B.
8. **Tree `_node`** — Use only `open`, `isParent`, `isSelected`, `level` from `pageParams.item._node`. Do not rename `_node` or invent unsupported properties.
9. **Reuse** — One template partial may serve multiple host widgets only when their list item shapes match (field parity).
10. **Metadata-first** — Before generating script, verify the host widget supports `setTemplate` via `~{mcp_ui-mcp-server_getComponentsSummary}` for `wm-search`, `wm-checkboxset`, `wm-radioset`, or `wm-tree`. Verify item fields via variable outputs.
11. **No invention** — Do not fabricate template partials, `item` schema, ModelVariable fields, or partial names. Confirm via `~{mcp_platform-server_listPages}` and variable inspection tools.

---

## Agent Workflow

1. Confirm host **page/partial** and **widget name**; verify widget type via `getComponentsSummary`.
2. Inspect host widget’s **list** binding and derive one item’s field names/types from variable outputs.
3. Confirm or create the **template partial** via `listPages` (partial only). Use `page_management` for create.
4. On the template partial:
   - Add page param **`item`** (object) — `pageParams` skill.
   - Create **ModelVariable** matching one item (`entry`, `isList: false`, `dataBinding: bind:pageParams.item`) — `variables` skill.
   - Bind markup via Style A or Style B — `binding` skill.
5. Wire `setTemplate('<partialName>')` on the host widget from the appropriate script handler (`Page.onReady`, partial `onReady`, or container load) — `javascript` skill.
6. For Tree, ensure `_node` paths are correct (`open`, `isParent`, `isSelected`, `level`).
7. Do not modify existing template field bindings unless explicitly requested.

---

## Related Skills

- `binding` — `bind:` syntax, case-sensitive paths, conditional class/style.
- `variables` — ModelVariable JSON, `isList` semantics, `dataBinding`.
- `pageParams` — defining and consuming partial page params.
- `javascript` — `setTemplate`, scope (`Page` / `Partial`), DOM timing.
- `page_management` — creating partials.
- `component_metadata` — host widget types (`wm-search`, `wm-checkboxset`, `wm-radioset`, `wm-tree`).
