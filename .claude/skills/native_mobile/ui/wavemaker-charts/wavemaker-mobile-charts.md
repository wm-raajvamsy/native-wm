---
name: wavemaker-mobile-charts
description: >
  WaveMaker chart widget system for React Native. Covers the single generic wm-chart tag, all chart
  types (Line, Area, Column, Bar, Pie, Donut, Bubble, Stack), the dataset contract, the full
  attribute reference, and styling via widget props. Use when generating WaveMaker chart markup —
  whether the chart comes from a design (trigger alongside screenshot-to-wavemaker or
  figma-to-wavemaker when the design contains a chart) or directly from a user request. Trigger
  phrases: "chart", "graph", "bar chart", "line chart", "pie chart", "donut", "area chart",
  "dashboard analytics", "data visualization", "wm-chart", trend / sparkline-like panels, "add a
  chart", "plot this data", "show this as a pie chart", "chart from this data/variable", or any
  request where the user supplies data and asks for a visualization.
---

# WaveMaker Chart Component

Generate correct WaveMaker chart markup. Every chart is ONE flat tag `<wm-chart type="...">` — there are no per-type tags, no child elements, and no design-token surface.

---

## 1. Two Entry Modes

A chart request arrives one of two ways. Identify the mode first — it decides where the type, data, and colors come from. Both modes converge on the SAME core markup contract (Section 3), attribute reference (Section 7), gotchas (Section 8), and verification checklist (Section 9) — those sections are mode-neutral and stated once.

**Mode A — Design-driven (screenshot/Figma pipeline).** The active pipeline skill flagged `chart: true` via `widget-detection`. The chart's type comes from the VISUAL, its dataset rows MIRROR the design's visible data points, and its series colors are sampled from the design.

**Mode B — User-driven (direct prompt, no design).** The user asks for a chart in words and/or brings their own data — "add a line chart of monthly sales", "plot this data as a pie chart", pasted rows/JSON/CSV-ish values, or the name of an existing variable/service. User-specified details ALWAYS win over defaults and inference: type, colors, height, legend position, titles, etc. No design plan or token pipeline exists in this mode — chart props are decided directly from the user's words plus the defaults in this skill; any surrounding container follows normal page-edit rules.

---

## 2. Chart Type Selection

### Mode A — pick the type from the visual

| Visual pattern in the design | `type=` |
|---|---|
| Vertical bars (bars grow UP from a baseline) | `Column` |
| Horizontal bars (bars grow SIDEWAYS from a left axis) | `Bar` |
| A plotted line connecting data points | `Line` |
| A line with the region under it filled | `Area` |
| A full circle split into slices | `Pie` |
| A ring with a hole in the middle | `Donut` (use `centerlabel` for center text) |
| Stacked segments within each bar (segments sum per bar) | `Column` or `Bar` + `viewtype="Stacked"` |
| Bubble scatter (points sized by a third value) | `Bubble` (rare) |

**Disambiguation — do NOT reach for a chart when a single-value widget fits:**
- A single-value ring with ONE center number and NO slices/legend -> `wm-progress-circle`, NOT a Donut chart.
- Thin stepper bars across the top of a multi-step flow -> `wm-wizard` (`stepper-basic` variant), NOT a bar chart.
- A single horizontal rail with a partial fill -> `wm-progress-bar`, NOT a Bar chart.

### Mode B — take the user's type; otherwise infer from the DATA SHAPE

If the user names a type, use it. If not, choose from the shape of their data and state the choice in one line rather than asking:

| Data shape | `type=` |
|---|---|
| Categories + one numeric field | `Column` |
| Time/sequence-ordered numeric values | `Line` (or `Area` if they say trend/cumulative) |
| Parts-of-a-whole or percentages summing to ~100 | `Pie` / `Donut` |
| Two numeric axes + a size value | `Bubble` |

### Rules that apply in BOTH modes

**Bar vs Column — the classic mistake.** `Bar` = HORIZONTAL bars; `Column` = VERTICAL bars. A monthly-sales chart with bars rising vertically is `Column`, NOT `Bar`.

**Stacked bars use `viewtype`, not `type="Stack"`.** Segments stacked inside each bar -> `type="Column"` (or `Bar`) + `viewtype="Stacked"`. `type="Stack"` is a distinct LEGACY widget (a horizontal stack / arc gauge, different `viewtype` vocabulary of `Bar`/`Arc`) — avoid it unless the request unmistakably matches that gauge shape.

**Mandatory type re-check — run it immediately before writing the tag.** Re-verify the chosen `type` against the visual/data one more time:
- Region under the line FILLED -> `Area`, not `Line`.
- Ring with a visible hole -> `Donut`, not `Pie`.
- Orientation: bars grow UP -> `Column`; bars grow SIDEWAYS -> `Bar`.
- Segments stacked WITHIN each bar -> keep `Column`/`Bar` and add `viewtype="Stacked"`.
- Side-by-side grouped bars per category -> multi-series (comma-separated `yaxisdatakey`) with `viewtype="Grouped"` (the default).

**Unsupported visuals — never invent a type value.** Scatter, heatmap, candlestick, radar, geo/map, and gauge visuals have NO `wm-chart` type. Map them to the closest supported type or to the correct non-chart widget (a single-value gauge/ring -> `wm-progress-circle`). Only the eight values in Section 3 exist.

---

## 3. Core Markup Contract (both modes)

- **ONE flat tag**: `<wm-chart type="...">`. There are no `wm-bar-chart` / `wm-pie-chart` tags in authored markup — always the generic tag with a `type`.
- **`type` values are capitalized and case-sensitive**: `Line`, `Area`, `Column`, `Bar`, `Pie`, `Donut`, `Bubble`, `Stack`. A wrong value (e.g. `column`, `bar-chart`) means the widget is silently dropped from the output.
- **Paired tags only**: `<wm-chart ...></wm-chart>` — never self-closing.
- **Flat attributes only**: NO child XML elements. Legend, axes, labels, colors are all attributes ON the one tag.
- **`width`/`height` NEVER accept `fill`/`hug`** — they do not work on charts.
  - `height`: FIXED px ONLY (`height="250px"` typical). Never a percentage — a percentage height breaks rendering.
  - `width`: px or % — or omit entirely (the chart self-measures to its container width, the default-safe choice).
- **`name` unique per page.**
- **Every chart binds a dataset**: `dataset="bind:Variables.<VarName>.dataSet"`; `xaxisdatakey` = the category/label field, `yaxisdatakey` = the numeric value field(s) — full axis-mapping rules in Section 4.

---

## 4. Dataset & Variables

**Variable authoring is delegated to the `variables` skill** — load it and generate the chart's variable through it (variable type and `isList` rules, `dataSet` structure, `dataBinding`, binding paths). This section supplies only the CHART-SPECIFIC rules that layer on top: the dataset shape the chart consumes, field naming tied to the datakeys, and the per-mode row rules below.

Shared contract (both modes):
- The variable is a ModelVariable of `type: "entry"` with `isList: true`; its `dataSet` is a direct JSON array of FLAT objects, one object per data point.
- **Axis mapping (fixed rule)**: `xaxisdatakey` = ALWAYS the category/label/independent field; `yaxisdatakey` = ALWAYS the numeric value field(s).
  - **`type="Bar"` trap**: the category axis RENDERS vertically (categories on the left, bars growing sideways), but the datakey mapping does NOT swap — `xaxisdatakey` stays the category field, `yaxisdatakey` stays the value field.
  - Time/date series: the time field is the X (`xaxisdatakey`).
  - Bubble: `xaxisdatakey` and `yaxisdatakey` are the two numeric axes; `bubblesize` names the third numeric field (the radius).
- **Multi-series**: comma-separate the value fields in `yaxisdatakey` (`"sales,profit,cost"`) — one series per field, shared X axis.
- **Pie/Donut use the SAME keys** — `xaxisdatakey` (label field) + `yaxisdatakey` (value field). There is NO `labelkey`/`datakey`.

Verbatim working variable template:
```json
"Dataset1" : {
  "name" : "Dataset1",
  "owner" : "App",
  "category" : "wm.Variable",
  "dataBinding" : [ ],
  "dataSet" : [
    { "name" : "1y", "value" : -2500 },
    { "name" : "2y", "value" : -1000 },
    { "name" : "3y", "value" : -500 },
    { "name" : "4y", "value" : 0 },
    { "name" : "5y", "value" : 1000 },
    { "name" : "6y", "value" : 2000 },
    { "name" : "7y", "value" : 3000 },
    { "name" : "8y", "value" : 6000 }
  ],
  "type" : "entry",
  "isList" : true,
  "twoWayBinding" : false,
  "saveInPhonegap" : false
}
```

**Silent demo-data trap (both modes, full force).** An empty or mis-keyed dataset renders BUILT-IN placeholder data with NO error. If `xaxisdatakey`/`yaxisdatakey` do not EXACTLY match the variable's field names, the chart shows fake demo data that looks plausible. Always cross-check the datakeys against the variable's actual field names.

### Mode A — rows mirror the design

Row count and values MUST mirror the screenshot's visible data points. A 6-bar chart gets EXACTLY 6 rows whose values approximate the drawn bar heights. **The 15-entry minimum for list widgets does NOT apply to chart datasets** — a chart is a fixed visual, not a scrollable list.

### Mode B — resolve the user's data source

- **(a) User pasted/inline data** -> create the ModelVariable FROM their data verbatim — their rows ARE the dataset. No mirroring rule, no row minimum. Map THEIR field names to `xaxisdatakey`/`yaxisdatakey` (do not rename their fields).
- **(b) User names an existing variable** -> bind to it; do NOT mint a new one. Read its `dataSet` field names and set the datakeys to match — the silent demo-data trap applies here with full force.
- **(c) User names a service/API source** -> create the service variable per the `variables` skill, then bind the chart to its `dataSet` with datakeys matching the response's field names.

---

## 5. Example Gallery

Area (verbatim working example):
```xml
<wm-chart type="Area" title="Area Chart1" height="250px" iconclass="fa fa-area-chart" name="chart1"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"
    subheading="Subheading"></wm-chart>
```

Line:
```xml
<wm-chart type="Line" name="lineChart1" height="250px" linethickness="2"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

Column (vertical bars):
```xml
<wm-chart type="Column" name="columnChart1" height="250px" showvalues="true"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

Bar (horizontal bars):
```xml
<wm-chart type="Bar" name="barChart1" height="250px"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

Stacked Column:
```xml
<wm-chart type="Column" name="stackCol1" height="250px" viewtype="Stacked"
    dataset="bind:Variables.SalesData.dataSet" xaxisdatakey="month" yaxisdatakey="sales,profit,cost"></wm-chart>
```

Pie:
```xml
<wm-chart type="Pie" name="pieChart1" height="250px" showlegend="bottom"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

Donut with center label:
```xml
<wm-chart type="Donut" name="donutChart1" height="250px" centerlabel="Total"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

Multi-series Line:
```xml
<wm-chart type="Line" name="multiLine1" height="250px" customcolors="#2563EB,#F59E0B"
    dataset="bind:Variables.SalesData.dataSet" xaxisdatakey="month" yaxisdatakey="sales,profit"></wm-chart>
```

Real attribute usages seen in the sample project:
```xml
<wm-chart type="Area" name="chart2" height="250px" width="350px" theme="Azure"
    customcolors="Green" showlegend="hide" tooltip="kpi"
    areafill="transparent" areaopacity="0.5" xdomain="Min" ydomain="Min"
    ynumberformat=".2f" ticksymbol="roundRect"
    dataset="bind:Variables.Dataset1.dataSet" xaxisdatakey="name" yaxisdatakey="value"></wm-chart>
```

---

## 6. Styling via Props (the token exception)

**Charts have NO design-token surface.** Never author `overrides/components/chart/*` and — in Mode A — never add a chart appearance row to the STEP 0 design plan. The chart's colors and appearance are set with DIRECT markup attributes on `wm-chart` (`theme`, `customcolors`, `labelcolors`, `areafill`, `areaopacity`, `linethickness`, and the rest in Section 7). This is a scoped exception to the no-inline-styles rule, and it applies to `wm-chart` ONLY. The surrounding card/section wrapper stays a normal tokenized container (e.g. `container-chart-card`), styled the usual way.

Series colors, by mode:
- **Mode A**: `customcolors` with the exact hexes sampled from the design, comma-separated (`customcolors="#2563EB,#F59E0B"`) — aligned with the STEP 0 brand palette where they coincide (charts take literal hexes, not token references) — OR a named `theme` when a palette matches the design's mood.
- **Mode B**: colors the user names win; otherwise pick a named `theme` (or leave the defaults).

Theme names: `Terrestrial` (default), `Annabelle`, `Retro`, `Mellow`, `Orient`, `GrayScale`, `Flyer`, `Luminosity`, `Azure`. Pie/Donut default to `Azure`; all other types default to `Terrestrial`.

---

## 7. Attribute Reference

### Base props (all chart types)

| attr | type / default | notes |
|---|---|---|
| `type` | string | drives the widget; capitalized, case-sensitive |
| `dataset` | array (bindable) | `bind:Variables.<Var>.dataSet`; array of flat objects |
| `xaxisdatakey` | string | field name for X / label / category |
| `yaxisdatakey` | string | value field; COMMA-SEPARATED for multi-series (`"sales,profit"`) |
| `title` / `subheading` / `iconclass` | string | header row above the chart |
| `theme` | `Terrestrial` (Pie/Donut default `Azure`) | palette; see theme names in Section 6 |
| `customcolors` | comma-sep string | series colors overriding the theme palette, applied in SERIES ORDER, e.g. `"#2563EB,#F59E0B"` or `"Green,Red"` |
| `labelcolors` | comma-sep string | overrides label text colors |
| `xaxislabel` / `yaxislabel` / `xunits` / `yunits` | string | caption text displayed along the axis |
| `xaxislabeldistance` / `yaxislabeldistance` | number | axis label offset |
| `offsettop` / `offsetbottom` / `offsetleft` / `offsetright` | number, defaults 70 / 50 / 65 / 25 | grid/plot-area positioning offsets (Stack overrides left/right to 25/35) |
| `showlegend` | `top`(default) / `bottom` / `left` / `right` / `hide` | `top`/`bottom` render a horizontal wrapping legend, `left`/`right` a vertical one; legend shows for NAMED multi-series; a side legend shifts the pie center. Stack default `left` |
| `showlabels` | `outside`(default) / `inside` / `hide` | Pie/Donut slice name/value labels; `outside` adds connector label-lines |
| `tooltips` | boolean, default `true` | enable tooltips |
| `tooltip` | `card` / `compact` / `kpi` / `striped` / `none` | tooltip overlay preset; `card` is the default preset |
| `interpolation` | default `linear` | curve type: `natural` / `cardinal` / `catmullRom` / `basis` / `monotoneX` / `monotoneY` -> smooth (Bezier); `step*` -> step lines |
| `highlightpoints` | boolean, default `false` | |
| `showvalues` | boolean, default `false` | value labels on bars |
| `showxaxis` / `showyaxis` | boolean, default `true` | show the axis line and its labels |
| `showxaxislabels` / `showyaxislabels` | boolean, default `true` | |
| `showxaxisticks` / `showyaxisticks` | boolean, default `true` | tick marks when the axis is shown |
| `hidegridxaxis` / `hidegridyaxis` | boolean, default `false` | hides the axis SPLIT LINES (grid lines: vertical for X, horizontal for Y) — the library shows them by default, this attr inverts that |
| `boundarygap` | boolean | gap at start/end of the category axis; library defaults differ per type — `false` for line/area, `true` for bar/column |
| `xdomain` / `ydomain` | `Min` | Area ONLY — silent no-op on every other type |
| `ynumberformat` | string | `.Nf` (fixed decimals, e.g. `.2f`), `.Ng` (significant digits, e.g. `.1g`), `%`, `Billion`, `Million`, `Thousand`, `,r` |
| `bubblesize` | string | field name for the third numeric value driving bubble radius (Bubble) |
| `shape` | `circle` / `cross` / `diamond` / `plus` / `minus` / `square` / `star` / `triangle-down` / `triangle-up` | marker shape |
| `labeltype` | — | **NO-OP — do not emit** |
| `labelplacement` | — | **NO-OP — do not emit** |
| `xtickexpr` / `ytickexpr` | bind expr `(item,index,length)=>...` | axis tick LABEL formatter — returns the tick's display string |
| `labelangle` | number, default 0 | |
| `ticksymbol` | `none` / `circle` / `rect` / `roundRect` / `triangle` / `diamond` / `pin` / `arrow` | data-point markers on line/area (`none` is the line/area default) |
| `symbolsize` | number, default 5 | marker size in px |
| `areastep` | `start` / `middle` / `end` / `false` | step mode when the curve is a step type |
| `intervalx` / `intervaly` | number | axis tick interval; omitted = automatic. `intervaly` is IGNORED when `stacknormalize` forces the 0-100% axis |
| `stacknormalize` | boolean | with stacked series, shows values as percentages on a 0-100% axis |
| `showhighlighter` | boolean, default `true` | |
| `loadingicon` / `loadingdatamsg` / `nodatamessage` | string | loading / empty states |
| `accessible` / `accessibilitylabel` / `hint` / `accessibilityrole` | a11y | |

### Per-type extras

**Line**
| attr | default | notes |
|---|---|---|
| `linethickness` | 2 | line stroke width |
| `onSelect` | — | point-select event |

**Area**
| attr | default | notes |
|---|---|---|
| `linethickness` | 2 | |
| `areafill` | `gradient` | `gradient` / `transparent` / `solid` |
| `areaopacity` | 0.6 | fill opacity |
| `xdomain` / `ydomain` | — | `Min` supported (Area only) |
| `onSelect` | — | |

**Bar / Column**
| attr | default | notes |
|---|---|---|
| `viewtype` | `Grouped` | `Grouped` / `Stacked` |
| `barwidth` | — | bar thickness |
| `showzerothvalue` | `false` | |

**Pie / Donut**
| attr | default | notes |
|---|---|---|
| `donutratio` | 0 (Pie) / 0.5 (Donut) | >0 makes the ring — the inner radius is computed from it; never set `0` on a Donut |
| `centerlabel` | — | center overlay text (Donut) — absolutely-positioned, works well for "big number in the middle" |
| `showLabelLine` | `true` | leader line from slice to label |

**Bubble**
| attr | notes |
|---|---|
| `sizerange` | `[min,max]` pixel radius range the third data value scales into; library default `[8,50]`; data is `[x,y,size]` internally |

**Stack (legacy)**
| attr | default | notes |
|---|---|---|
| `viewtype` | — | `Bar` / `Arc` — DIFFERENT vocabulary from Bar/Column |
| `thickness` | 30 | |
| `minvalue` | — | |

---

## 8. Gotchas (both modes)

1. **`width`/`height` NEVER accept `fill`/`hug`** — they do not work on charts. `height` is FIXED px ONLY (`"250px"`); a percentage height breaks rendering. `width` is px or %, or omitted (the chart self-measures to its container — the default-safe choice).
2. **Never place a chart in a zero-width parent.** It renders nothing until its layout is measured; a zero-width container leaves it invisible.
3. **`xdomain` / `ydomain` are Area-only** — they silently do nothing on any other type.
4. **Never emit `donutratio="0"` on a Donut** — `type="Donut"` already applies the ring ratio; `0` collapses the hole.
5. **Do NOT emit `labeltype` or `labelplacement`** — both are no-ops on the current widget.
6. **Do NOT emit `renderitempartial`** unless a real partial exists to back it.
7. **`viewtype` vocabulary differs by type**: `Column`/`Bar` use `Grouped`/`Stacked`; the legacy `Stack` uses `Bar`/`Arc`. Stacked bars -> `Column`/`Bar` + `viewtype="Stacked"`, never `type="Stack"`.
8. **Bar vs Column orientation**: vertical bars -> `Column`; horizontal bars -> `Bar`.

---

## 9. Chart Verification Checklist (both modes)

- [ ] `type` is one of the eight capitalized values (`Line`/`Area`/`Column`/`Bar`/`Pie`/`Donut`/`Bubble`/`Stack`) — spelled exactly; never an invented value for an unsupported visual
- [ ] `type` re-verified against the visual/data (Section 2 re-check): filled-under-line -> `Area` not `Line`; visible hole -> `Donut` not `Pie`; bars UP -> `Column` / bars SIDEWAYS -> `Bar`; stacked segments -> `viewtype="Stacked"`; grouped side-by-side bars -> multi-series `viewtype="Grouped"`
- [ ] No `fill`/`hug` on `wm-chart` `width`/`height`; `height` is fixed px (never a percentage); `width` px/% or omitted
- [ ] `dataset` binds to an `entry` + `isList: true` variable (or the user's existing/service variable in Mode B)
- [ ] Axis mapping correct: `xaxisdatakey` = category/label field, `yaxisdatakey` = numeric value field(s) — NOT swapped for `type="Bar"` despite its sideways rendering
- [ ] `xaxisdatakey` / `yaxisdatakey` EXACTLY match the variable's field names (mis-keyed = silent demo data)
- [ ] Mode A: dataset row count and values mirror the visible data points (NOT the 15-entry list minimum); Mode B: rows are the user's data verbatim
- [ ] Mode B: every detail the user specified (type, colors, height, legend, titles) is honored over defaults
- [ ] Pie/Donut use `xaxisdatakey` + `yaxisdatakey` (never `labelkey`/`datakey`)
- [ ] Multi-series expressed as comma-separated `yaxisdatakey`
- [ ] Colors set via `customcolors` hexes or a named `theme` — NO chart token file authored
- [ ] Stacked bars use `viewtype="Stacked"`, not `type="Stack"`
- [ ] No `labeltype` / `labelplacement` / `donutratio="0"` emitted
