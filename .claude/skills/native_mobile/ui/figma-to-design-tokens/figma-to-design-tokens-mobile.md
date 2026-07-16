---
name: figma-to-design-tokens
description: >
  Generate WaveMaker design tokens (JSON) from a Figma design URL. Use this skill when the user wants
  design tokens, component tokens, style tokens, or theme tokens from a Figma URL. Trigger phrases:
  "generate tokens from Figma", "extract design tokens", "Figma to tokens", "create component tokens",
  "generate design tokens". Also trigger when the user pastes a Figma URL and mentions "tokens" or
  "theme". This skill requires the Figma MCP to be connected.
sub-skills:
  - token-schema
  - global-token-schema
  - foundation-tokens
  - styling-system
  - form-tokens
  - wizard-tokens
---

# Figma to WaveMaker Design Tokens

Generate per-component design token JSON files from Figma designs using the Figma MCP.

## Workflow

### Step 1: Extract Design from Figma

Parse the Figma URL to extract `fileKey` and `nodeId`, then:

1. Call `get_design_context` via `CallMcpTool` with server `user-figma`, passing `fileKey` and `nodeId`.
2. Call `get_screenshot` via `CallMcpTool` with server `user-figma`, passing `fileKey` and `nodeId`.

### Step 2: Check Foundation Tokens First

Before creating any custom tokens, read the foundation tokens reference to understand what's already provided by the WaveMaker theme:
- Read the shared foundation tokens reference (path: `foundation-tokens`)
- Check if a built-in appearance already matches the design (e.g., `btn.filled` + `primary` status, `label.text` + `muted` status, `rating` default gold stars)
- Only generate custom tokens for what DIFFERS from the foundation

### Step 2.5: Check Existing Project Overrides (reuse before minting)

Foundation built-ins are not the only thing already available — prior pages have saved **project-level component overrides**. Reusing them is what keeps a multi-page app on one shared design vocabulary instead of accumulating near-duplicate appearances (a new `btn-main-action` alongside an existing `btn-cta`).

**Build the inventory.** If invoked **standalone** (token-only run), build it now by reading the override files at their EXACT deterministic paths — do NOT `~{find_files_by_glob}` for them (it is unreliable on the overrides tree: it can return unrelated repo files, or nothing, while the files exist on disk). Batch into a SINGLE `~{read_files}` call: `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` for each component you will touch, plus every global file you may write — `overrides/global/color/color.light.json`, `color.dark.json`, `font/font.json`, `radius/radius.json`, `space/space.json` (and any other `global/<category>/<category>.json` the plan resolves to); capture each returned file's FULL content into `component -> { rawJson, appearanceName -> mapping }`. A batched read returns an `Error … File not found` line for absent paths WITHOUT aborting — so a component is fresh ONLY when its own exact-path read reports not-found. If invoked as part of an in-app page build (**STEP 3 executor**), use the preflight inventory the caller passed down. Either way this is the ONE read of each override (it also captured the content-hash the write needs): at write time do NOT re-read — write `Base(rawJson) + new` as the full JSON in ONE `~{write_file}` per component. `~{write_file}` overwrites, so a write missing an existing appearance deletes it — see the write-time guard (Rule 9).

**Division of labor (in-app path).** The entry skill's **STEP 0 design plan** is the source of truth for *which* styles exist and *what* each looks like — do NOT re-derive that by scanning the markup. But "do not re-derive the plan" bars *markup scanning only*; it does not exempt you from the mechanical duplicate guard below.

**Write-time duplicate guard (BOTH paths — an equality check on the JSON, not a design decision).** For every appearance you are about to author, diff its final `mapping` **key-by-key** against the appearances already present in the override file you just read (and, standalone, the whole inventory). Same keys + same effective values — where a `{...}` reference and the literal it resolves to count as equal — means it is the same style:
1. **Existing project appearance matches** — author NO new token; reuse the existing name and record `plan's <new-name> resolves to existing <name>` so the markup renders the existing name.
2. **Built-in foundation appearance matches** (Step 2) — use it via class/variant; author nothing.
3. **Genuinely new** — nothing above matches. Author it, with a name that does not collide with an existing-but-different appearance (Rule 21).

This guard cannot conflict with plan authority: it never invents or drops a *style*, it only refuses to write a second copy of a `mapping` the project already stores under another name.

### Step 3: Detect Components

From the Figma data, identify every visible UI component. Use `token-schema` for the full component name list, allowed token types, and authoring rules.

For each component, determine:
- **Appearances**: Each visually distinct style (e.g., filled, outlined, ghost)
- **Variant groups**: size (sm/md/lg), status (primary/secondary/destructive), etc.
- **States**: disabled, hover, focus, pressed, selected, error — only if visually present
- **Widget parts**: Each widget has sub-parts (root, text, icon, header, content, etc.) — see `token-schema` for part mapping per widget. Generate part-prefixed tokens when Figma shows different styling on sub-parts.
- **Tokens**: background, color, border.*, font-*, gap, height, box-shadow, icon.size, opacity, etc.

### Step 4: Generate Token JSON

For each detected component, generate a JSON file following the exact schema in `token-schema`.

### Step 5: Output Tokens

**When invoked as part of an in-app page build (STEP 3 executor)** (e.g. delegated from `screenshot-to-wavemaker-mobile` / `figma-to-wavemaker-mobile`): you are executing the caller's finalized design plan — author ONLY the appearances/globals it marked *new*, and do NOT scan the markup to discover appearances (the plan is the source of truth). Write each authored token object **directly to the project-global overrides path with the file tools** — component tokens → `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json`; global/theme tokens → `src/main/webapp/design-tokens/overrides/global/<property>/<file>.json` (e.g. `global/color/color.light.json` and `color.dark.json`, `global/font/font.json`, `global/radius/radius.json`, `global/space/space.json`). Global/theme token files use a DIFFERENT shape from component tokens (value-only sparse leaves, the `@`-anchor on colors, top-level typography ramp keys) — see `global-token-schema` for the exact structure before writing any `global/...` file — the global brand/theme setup (light + dark, derived-color companions) is decided by the caller's STEP 0 design plan, so author exactly the globals it resolved. each override was already read ONCE in the preflight/inventory (never re-read, and never `~{find_files_by_glob}` to locate it — the glob is unreliable on this tree): write `Base(rawJson) + new` as the FULL file in ONE `~{write_file}` per component (see Rule 9 — `~{write_file}` overwrites the whole file, so a write missing an existing appearance deletes it; a brand-new component file is just written fresh). **Never write token JSON under `pages/<Page>/tokens/...` or any page-scoped `tokens/` folder** — page-scoped token files are dead artifacts the design system never reads.

**Standalone token-only deliverable** (user only wants the token JSON, no in-app page build): write each component's JSON to `<output_folder>/components/<component>/<component>.json`. Default output folder: current workspace `output/` directory.

> **⚠️ Read before you write, and MERGE — never overwrite (state-aware file tools).** A brand-new JSON file can go straight to `~{write_file}`. But `~{write_file}` **replaces the entire file** — it never merges or appends. A file that already exists was read ONCE in the preflight (capturing its `rawJson` and the content-hash the write needs), so do NOT re-read it: write `Base(rawJson) + your new appearance(s)` as the FULL JSON in ONE `~{write_file}`. Writing only your new appearance deletes every other appearance in the file — the styling of pages already built. (Content-hash guard: a blind write with no prior read this turn is rejected with *"Read file before writing"* — the preflight read satisfies it.)

**Folder/file naming uses the foundation folder name** (e.g., `button/button.json`, `label/label.json`, `container/container.json` — NOT the widget tag: `wm-listtemplate` → folder `listtemplate`, `wm-mobile-tabbar` → folder `tabbar`). The JSON root key inside the file is the **foundation component prefix** — the folder name for MOST components, but it DIFFERS for several. ⚠️ Using the wrong folder makes the override a dead file the loader never path-matches; using the wrong root key makes the validator silently skip it (no base mapping found). Either way the tokens never apply. Verified exceptions (folder → root key): `button`→`btn`, `cards`→`card`, `modal-dialog`→`modal`, `dropdown-menu`→`dropdown`, `radioset`→`radiobutton`, `form-wrapper`→`form`, `listtemplate`→`list-template`, `page-content`→`page`, `page-left-nav`→`left-panel`, `scrollbar`→`scroll`.

Examples:
- `output/components/button/button.json` → root key: `"btn"`
- `output/components/label/label.json` → root key: `"label"`
- `output/components/container/container.json` → root key: `"container"`
- `output/components/select/select.json` → root key: `"select"`
- `output/components/picture/picture.json` → root key: `"picture"`
- `output/components/rating/rating.json` → root key: `"rating"`
- `output/components/list/list.json` → root key: `"list"`
- `output/components/listtemplate/listtemplate.json` → root key: `"list-template"`
- `output/components/wizard/wizard.json` → root key: `"wizard"`
- `output/components/cards/cards.json` → root key: `"card"` (NOT `"cards"`)
- `output/components/modal-dialog/modal-dialog.json` → root key: `"modal"` (NOT `"modal-dialog"`)
- `output/components/dropdown-menu/dropdown-menu.json` → root key: `"dropdown"` (NOT `"dropdown-menu"`)
- `output/components/radioset/radioset.json` → root key: `"radiobutton"` (NOT `"radioset"`)

Create directories as needed. One file per component. For lists, generate **two** files: `list/list.json` (container-level tokens) and `listtemplate/listtemplate.json` (root key `list-template`; row-level tokens like background, padding, border-radius, min-height).

#### ⚠️ Wizard — Special Token Structure

Wizard has a unique hierarchical token structure (NOT flat like `btn`). When the design contains a multi-step wizard/stepper UI, generate `wizard/wizard.json` with root key `wizard`.

Read `wizard-tokens` for the full property structure, CSS variable mapping, and default override checklist.

#### ⚠️ Form — Special Token Structure

Load `form-tokens` before writing any form token — it is the source for the form's structure, types, and default-override checklist. The form schema is nested by region (`header` / `body` / `footer`) and does NOT match the flat `btn`/container shape, so authoring from memory yields override paths the validator rejects (the classic miss: nesting `background.color` where the form wants a flat `background`). A rejected save falls back silently to foundation defaults.

Every `wm-form` produces `form-wrapper/form-wrapper.json` (root key `"form"`, never `"form-wrapper"`) for the shell and `form-controls/form-controls.json` (root key `"form-controls"`) for the inputs. Always write the wrapper — even for a plain form — because of its one non-negotiable token: the root `background`. It defaults to `{color.outline.variant.value}` (= #E4E4E4 grey), not transparent or white, so styling only `header`/`body`/`footer` (or omitting the file) leaves a grey shell behind the fields. Set it to the sampled fill, or `{color.transparent.@.value}` when the form is see-through.

On `wm-login` pages, `login.json` owns the form padding and error banner while `form-wrapper.json` still owns the shell `background` — the grey rule applies to login forms too (see `login-widget`).

#### ⚠️ Toggle — Token Structure

When the design contains a toggle (pill-shaped track + circular thumb), generate `toggle/toggle.json` with root key `"toggle"`. Analyse the toggle's track and handle colors from the design and generate tokens for both OFF and ON states.

Property paths (see `token-schema` → `toggle` row):
- **OFF state (root mapping)**: `background.color` (track), `border.color`, `border.width`, `handle.color`, `handle.width`, `handle.height`, `handle.radius`
- **ON state**: `states.on.background.color` (track when ON), `states.on.handle.color`
- **Disabled**: `states.disabled.background.color`, `states.disabled.handle.color`

Example:
```json
{
  "toggle": {
    "appearances": {
      "setting": {
        "mapping": {
          "background": { "color": { "value": "#E0E0E0ff", "type": "color" } },
          "handle": {
            "color": { "value": "#FFFFFFff", "type": "color" },
            "radius": { "value": "{radius.circle.value}", "type": "radius" }
          },
          "states": {
            "on": {
              "background": { "color": { "value": "#4CAF50ff", "type": "color" } },
              "handle": { "color": { "value": "#FFFFFFff", "type": "color" } }
            }
          }
        }
      }
    }
  }
}
```

Skip `toggle/toggle.json` if the toggle uses default platform colors (no custom styling visible).

#### ⚠️ Login — Token Structure

When the design is a login / sign-in page (`wm-login`), generate `login/login.json` with root key `"login"`. Create a variant (e.g. `main`) and apply it in markup with `class="login-<variant>"` on the `wm-login` widget.

The login form has a built-in **36px** (`{space.9.value}`) inner padding. **Always** set `form.padding` to the inset measured from the design — `{space.0.value}` for a full-width / edge-to-edge form. This inset is controllable ONLY through this token (no markup/container padding removes it).

Property paths (under the variant's `mapping`):
- **Form padding (mandatory — always set)**: `form.padding`
- **Error banner (optional — only if the design shows a custom error style)**: `error.text.color`, `error.background.color`, `error.border.color`, `error.border.radius`

Read `login-widget` for the full widget reference (markup, naming rule, sizing).

Example:
```json
{
  "login": {
    "appearances": {
      "main": {
        "mapping": {
          "form": { "padding": { "value": "{space.0.value}", "type": "space" } }
        }
      }
    }
  }
}
```

## Critical Rules

### Rule 1: GLOBAL TOKENS FIRST — static values only as last resort

**EVERY value MUST use a global foundation token reference if one exists.** Static/literal values are ONLY allowed when no matching global token exists. This ensures app-wide consistency.

Before writing any value, check the lookup table in `token-schema` → "Foundation Token References". If the design value matches (or is close to) a global token, use the reference:

**Spacing** (`padding`, `gap`, `margin`, `height`, `min-width`):
`0px`→`{space.0.value}`, `4px`→`{space.1.value}`, `8px`→`{space.2.value}`, `12px`→`{space.3.value}`, `16px`→`{space.4.value}`, `20px`→`{space.5.value}`, `24px`→`{space.6.value}`, `28px`→`{space.7.value}`, `32px`→`{space.8.value}`, `36px`→`{space.9.value}`, `40px`→`{space.10.value}`, `44px`→`{space.11.value}`, `48px`→`{space.12.value}`

**Radius** (for `radius` or `border.radius` depending on component):
`0px`→`{radius.none.value}`, `2px`→`{radius.xxs.value}`, `4px`→`{radius.xs.value}`, `8px`→`{radius.sm.value}`, `12px`→`{radius.md.value}`, `16px`→`{radius.lg.value}`, `28px`→`{radius.xl.value}`, `32px`→`{radius.xxl.value}`, `1000px`/pill→`{radius.pill.value}`, circle→`{radius.circle.value}`

**⚠️ Radius tokens are NAMED, never numeric.** The ONLY valid radius refs are `{radius.none.value}`, `{radius.xxs.value}`, `{radius.xs.value}`, `{radius.sm.value}`, `{radius.md.value}`, `{radius.lg.value}`, `{radius.xl.value}`, `{radius.xxl.value}`, `{radius.pill.value}`, `{radius.circle.value}`. There is **NO** `{radius.0.value}`/`{radius.1.value}`/`{radius.2.value}`/`{radius.3.value}` — unlike `space.*` (0–12) and `border.width.*` (0–3), the radius scale has no numeric indices. Emitting a numeric radius (e.g. writing 8px as `{radius.2.value}`) fails validation with "Reference does not exist". Map px to the NAMED token: 8px → `{radius.sm.value}`, 2px → `{radius.xxs.value}`, 12px → `{radius.md.value}`.

**IMPORTANT for radius**: If the design shows a **circular/fully-rounded element** (buttons, dots, avatars), ALWAYS use `{radius.circle.value}` — NEVER calculate `height/2` as a static px value. The circle token (1000px) guarantees a perfect circle at any size.

**Border width**: `0px`→`{border.width.0.value}`, `1px`→`{border.width.1.value}`, `2px`→`{border.width.2.value}`, `3px`→`{border.width.3.value}`

**Border style**: `solid`->`{border.style.solid.value}`, `dotted`->`{border.style.dotted.value}`, `dashed`->`{border.style.dashed.value}`. These are the ONLY valid border styles on mobile. **`border.style` NEVER accepts `"none"`** - there is no mobile `none` token and React Native rejects it. To remove a border, set `border.width` to `{border.width.0.value}` and keep `border.style` as `{border.style.solid.value}` (or `{border.style.base.value}`); never write `"none"`.

**Shadow**: `none`→`{elevation.shadow.none.value}`, levels 1-5→`{elevation.shadow.N.value}` or `{box-shadow.N.value}`

**Icon size**: `12px`→`{icon.size.xs.value}`, `18px`→`{icon.size.sm.value}`, `24px`→`{icon.size.md.value}`, `30px`→`{icon.size.lg.value}`, `36px`→`{icon.size.2x.value}`

**Font weight**: `400`→`{font.weight.400.value}`, `500`→`{font.weight.500.value}`, `600`→`{font.weight.600.value}`, `700`→`{font.weight.700.value}` (all weights 100-900 available)

**Font size** (via typography scale): `11px`→`{label.small.font-size.value}`, `12px`→`{body.small.font-size.value}`, `14px`→`{body.medium.font-size.value}`, `16px`→`{body.large.font-size.value}`, `22px`→`{h4.font-size.value}`, `24px`→`{h3.font-size.value}`, `28px`→`{h2.font-size.value}`, `32px`→`{h1.font-size.value}`

**Color** (same lookup discipline as everything above): check the sampled hex against the project's palette FIRST — the `overrides/global/color.*.json` read in preflight, else the foundation defaults in `token-schema` -> "Foundation Token References" (`{color.primary.@.value}`, `{color.on-surface.@.value}` = default text, `{color.surface.@.value}`, `{color.outline.@.value}`, semantics `{color.error/success/warning.@.value}`, …). If the sampled color equals (or rounds to) a palette entry, write its `{color.<slot>.@.value}` reference — NOT the literal hex. A hardcoded `#1A1A1Aff` that equals the palette's default text, or `#00CFFFff` that equals `primary`, is the duplicate-of-a-global bug: use the reference so a later theme change reaches it.

**When to use static values**: Only when the design value has NO matching global token — a **genuinely off-palette** color that equals no global (e.g. a one-off brand-illustration tint), or a non-standard size like `"14px"` padding / `"30px"` radius. A literal hex that equals a palette entry is NOT a valid static value — reference the global instead.

### Rule 2: Per-component property structure

Property paths are NOT universal — each component has its own structure. Using the wrong path produces CSS variables the component doesn't read. See `token-schema` → "Per-Component Property Structure" for the definitive reference. Key differences:

| Property | `btn`, `picture` | `container`, `list`, `list-template` | `label` | `icon` | `rating` |
|----------|-----------------|------------------------------------|---------| -------|----------|
| background | `background` (flat) | `background.color` (nested) | `background-color` | — | — |
| radius | `radius` (sibling) | `border.radius` (nested) | `border.radius` | — | — |
| shadow | `shadow` | `box-shadow` | — | — | — |
| icon size | `icon.size` | — | — | `font-size` | `icon.size` |

### Rule 3: `type` key required on every leaf token

Every leaf token MUST have both `value` and `type` keys. Allowed types (from the actual foundation source):
- `color` — all color properties (background, color, border.color, icon.color)
- `space` — spacing/dimension (padding, gap, height, min-width, icon.size, border.width)
- `font` — typography (font-size, font-weight, font-family, line-height, letter-spacing)
- `radius` — radius AND catch-all (radius, border.radius, opacity, shadow, box-shadow, cursor, text-transform, text-decoration)
- `border` — border structure (border.width, border.style)

There is NO `shadow` or `misc` type. Shadow/box-shadow use `"type": "radius"`. Border-style uses `"type": "border"`.

### Rule 4: Remaining format rules

4. **8-digit hex colors** — `"#7C4DFFff"` (with `ff` alpha suffix).
5. **Padding ALWAYS shorthand** — Use CSS shorthand: 1 value (all sides), 2 values (vertical horizontal), or 4 values (top right bottom left). NEVER use longhand sub-properties (`padding.top`, `padding.left`, etc.). Can mix refs: `"{space.1.value} {space.6.value}"`. Same applies to `border.width` and `border.radius` — use shorthand like `"{border.width.0.value} {border.width.0.value} {border.width.1.value} {border.width.0.value}"` for single-side borders.
6. **No meta or selectors** — Output only the `appearances` subtree.
7. **No linear gradients** — Never use gradient values.
8. **Component naming** — Button root key is `btn`. All others use full name. Folder always uses full name: `button/button.json`.
9. **Deduplication / reuse (write-time guard, both paths)** — Immediately before authoring each appearance, diff its final `mapping` key-by-key against the appearances in this component's preflight `rawJson` (no re-read). If an existing appearance's `mapping` already matches — a `{...}` reference and the literal it resolves to count as equal — reuse that name, author NO new token, and record `plan's <new-name> resolves to existing <name>` so the markup uses the existing name. Author tokens ONLY for mappings that match nothing (true deltas). This holds whether invoked in-app (STEP 3 executor) or standalone — the plan decides which styles exist, but running this equality check is always yours. Persist true deltas by writing `Base(rawJson) + all new appearances for the component` as the FULL file in ONE `~{write_file}` (batch all of a component's new appearances into that single write, so each file is read and written exactly once): `~{write_file}` OVERWRITES, it does not merge, so a write missing any existing appearance silently deletes it. This guard is about converging on the shared design vocabulary AND never dropping an appearance a prior page saved.
10. **Every appearance must be referenced** — Must match a `class` in the markup.
11. **Borderless elements (no `"none"` border style)** - `border.style` accepts ONLY `solid`/`dotted`/`dashed`; `"none"` is invalid on mobile and `{border.style.none.value}` does not exist. To remove a border, set `border.width` to `{border.width.0.value}` and keep `border.style` as `{border.style.solid.value}`.
12. **Complete default overrides for icon-only buttons** — Button appearances MUST include: `padding`, `min-height`, `min-width`, `radius`, `border.width`, `border.style`, `border.color`, `background`, `color`, `icon.size`. ⚠️ For `btn` the corner radius is the **top-level `radius`** key — NOT `border.radius` (the `btn` `border` object holds only `width`/`style`/`color`). The size key is **`min-height`**, never `height`.
13. **Complete default overrides for inline/embedded selects** — See template in `token-schema`.
14. **Bottom bar separator tokens** — When the design has a fixed bottom action bar, ALWAYS include `box-shadow` or `border` on the bar container token for visual separation.
15. **List item separator tokens** — ⚠️ **CRITICAL React Native limitation**: `item.*` (and other sub-part paths like `heading.*`, `title.*`) inside `mapping` have **NO EFFECT** in React Native. The `componentVariantsFormatter` generates CSS custom properties (e.g., `--wm-list-item-background-color`) that are silently ignored by `css-to-react-native-transform`, producing an EMPTY `variants` object. **Only ROOT-level token properties work** (background, border, padding on the component root). To override list-template background, use a SEPARATE `listtemplate/listtemplate.json` token file (root key `list-template`; it targets the component root, so it works). For flat/borderless list rows, generate `box-shadow: "{elevation.shadow.none.value}"` and `border.*` tokens in `list-template`.
16. **Extract exact colors per widget part** — Sample the ACTUAL color each widget part shows in the design; never *substitute* the theme accent for a color that is genuinely widget-specific (star ratings are almost always gold/yellow, not the theme color — keep them gold). "Sample the exact color" governs *which* color, not *how* to write it: once sampled, if that color equals a value in the project's palette (the global overrides read in preflight, else the foundation defaults), write it as the `{color.<slot>.@.value}` reference (Rule 1); use a literal 8-digit hex ONLY for a color that matches no palette slot.
17. **Button width proportions in action bars** — Use `min-width` tokens to approximate button width proportions.
18. **Foundation-first token generation** — Only generate custom tokens for the delta from foundation defaults.
19. **No custom token for standard gold rating stars** — The foundation already provides gold stars. Only override if the design shows non-gold stars.
20. **Background colors on every colored section (CRITICAL)** — Every container/card/banner with a non-white/non-transparent background MUST get a `background.color` token set to the **EXACT fill color sampled from the design** — written as a global reference (`{color.surface.@.value}`, `{color.primary.container.@.value}`, …) when that sampled fill equals a palette entry, and a literal 8-digit hex (e.g. `"#F5F5F5ff"`) ONLY when it is genuinely off-palette (Rules 1 and 16). Promo banners, hero sections, colored cards, tinted action cards — these are the most commonly missed tokens and make the output look like a wireframe. Only write `transparent` when the section is genuinely see-through; never substitute it for a section that has a visible fill.
21. **⚠️ RESERVED APPEARANCE NAMES — NEVER use these as custom appearance names.** The WaveMaker foundation registers built-in styles with specific class-name selectors. If a custom appearance name collides with a reserved name, the built-in styles (background, padding, borderRadius, etc.) silently merge in, corrupting your custom styling.

    | Component prefix | Reserved names (NEVER use) | Effect if collided |
    |---|---|---|
    | `btn` | `default`, `primary`, `secondary`, `danger`, `success`, `warning`, `info`, `link`, `dark`, `light`, `only-label` | Built-in colored bg/border/text overrides |
    | `label` | `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `muted` | **Badge styles**: bg-color + padding 32/16 + borderRadius 6 + fontWeight 700 |
    | `container` | `default`, `outlined`, `elevated` | Built-in container chrome |
    | `picture` | `default`, `thumbnail` | Built-in picture sizing/shape |

    Also avoid as standalone label classes: `h1`-`h6`, `p`, `media-heading`, `text-primary`, `text-secondary`, `text-success`, `text-warning`, `text-danger`, `text-info`, `text-muted`.
    **Use descriptive alternatives** (bare appearance names): `subtle` not `muted`, `accent`/`cta` not `primary`, `standard` not `default`.

22. **Default Override Analysis (CRITICAL)** — For EVERY widget, compare its built-in defaults against the design and generate explicit override tokens to neutralize any default that doesn't match. This is the #1 cause of visual mismatch. Key offenders:
    - **`list`**: `item.*` sub-part token overrides have **NO EFFECT** in React Native (see Rule 15). Only ROOT-level list tokens work. Use a SEPARATE `listtemplate/listtemplate.json` token (root key `list-template`) with `background.color: "transparent"`.
    - **`btn`**: borderRadius is **32px** (pill-shaped!), padding is **12/24**, textTransform is **capitalize**. Override when design differs.
    - **`search`**: input background is **#dddddd (grey)**, not white. Override for white/custom search bars.
    - **`label`**: text color is **#888888 (grey)**, not black. Override for dark text.
    - **`icon`**: has **8px right padding** on icon element. Override for tight layouts.
    - **`card`**: header background is **#dddddd (grey)**. Override for white/custom headers.
    - **`chips`**: has **elevation: 1** (Android shadow). Override for flat chips.
    - **`select`**: minWidth **160px**, padding 12, border 1px solid. Use **Inline Select Override Template** for embedded selects.
    - **`carousel`**: slide.paddingHorizontal **16px** (side gaps), slide.transform **scale(0.8)** (inactive slide shrink). For full-bleed hero carousels → override `slide.padding: "0px"` and `slide.transform: "none"`.
    - **`mobile-tabbar`**: menu.backgroundColor uses theme variable (default WHITE). CANNOT be overridden per-page — use custom container tab bar for dark pages.
    - See `token-schema` Widget Default Overrides Checklist and `widget-defaults` OVERRIDE WHEN sections for full details.

## Output Verification Checklist

Before outputting any token file, verify EVERY item:

- [ ] JSON structure: `{ "<component>": { "appearances": { "<name>": { "mapping": { ... } } } } }`
- [ ] Root key: `btn` for buttons, full name for everything else
- [ ] Every leaf token has BOTH `value` AND `type` keys
- [ ] `type` is one of: `color`, `space`, `font`, `radius`, `border` — NO `shadow`, NO `misc`
- [ ] Per-component property paths: `btn`/`picture` use flat `background`/`radius`/`shadow`; `container`/`list`/`list-template` use `background.color`/`border.radius`/`box-shadow`; `label` uses `background-color`/`border.radius`/`text.decoration` (nested under `text`); `icon` uses `font-size`; `rating` uses `icon.size` and `states.active.icon.color`
- [ ] List row styling in separate `list-template` token file (NOT `listItem.*` sub-parts in `list` — `item.*` has NO EFFECT in RN)
- [ ] Foundation references used EVERYWHERE a match exists — static values ONLY for custom colors and non-standard sizes
- [ ] **Existing-override reuse (Step 2.5) + no duplicate mappings**: inventory consulted (or overrides folder confirmed absent); the write-time guard ran — no two appearances of the same component share an identical resolved `mapping`, neither newly-authored vs pre-existing nor newly-authored vs newly-authored (`{...}` refs and the literals they resolve to count as equal); on any hit, collapsed to one name and the markup reference updated; new appearance names do not collide with existing-but-different ones
- [ ] No invalid references: `{border.style.none.value}` does NOT exist and `border.style` is NEVER `"none"` (for no border use `border.width` `{border.width.0.value}` + `border.style` `{border.style.solid.value}`); `{border.radius.*}` does NOT exist (use `{radius.*}`)
- [ ] Hex colors have `ff` alpha suffix (e.g., `#7C4DFFff`)
- [ ] **Markup → Tokens (no missing token files)**: For every `class="<prefix>-<name>" variant="<name>"` pair in the markup, a corresponding appearance entry exists under `appearances["<name>"].mapping` in the correct token file. A `class`/`variant` in markup with no token entry = the widget renders with zero custom styling — silently wrong.
- [ ] **Tokens → Markup (no orphan appearances)**: For every appearance defined in every token file, a widget in the markup actually uses it via `class` + `variant`. An appearance with no markup reference = dead token that will never apply. Delete it or it signals a missed widget in the markup.
- [ ] **No reserved name collisions**: appearance names do NOT match built-in selectors (see Rule 21). Verify: no `btn-primary/default/secondary/...`, no `label-muted/primary/danger/...`, no `container-default/outlined/elevated`
- [ ] Rating uses `icon.color` (inactive) and `states.active.icon.color` (filled) — NOT `activeStar`/`inactiveStar`
- [ ] **No reserved name collisions**: appearance names do NOT match built-in selectors (see Rule 21). Verify: no `btn-primary/default/secondary/...`, no `label-muted/primary/danger/...`, no `container-default/outlined/elevated`
- [ ] One file per component: `tokens/<component>/<component>.json`
- [ ] **Default overrides applied**: Every `list` appearance uses only ROOT-level tokens (no `item.*` sub-part tokens); list-template background overridden via separate `listtemplate/listtemplate.json`; button borderRadius/padding/textTransform overridden when design differs; search background overridden; label color overridden for dark text
- [ ] **Wizard tokens** (when wizard detected): file is `wizard/wizard.json` with root key `wizard`; uses hierarchical property paths (NOT flat like btn/container); `states.current` = active step (secondary), `states.active` = done steps (success); `box-shadow` overridden if design is flat — see `wizard-tokens` for full structure

## Common Token Mistakes

| Wrong | Right | Why |
|-------|-------|-----|
| `{ "value": "#FF0000" }` | `{ "value": "#FF0000ff", "type": "color" }` | Need `type`; add `ff` alpha |
| `"type": "shadow"` | `"type": "radius"` | No shadow type exists |
| `"type": "misc"` | `"type": "radius"` or `"border"` | No misc type exists |
| `"background": { "value": "#7C4DFF" }` (container) | `"background": { "color": { "value": "#7C4DFFff", "type": "color" } }` | Must nest under `.color` |
| `"radius": { "value": "30px" }` (container) | `"border": { "radius": { "value": "30px", "type": "radius" } }` | Must nest under `border` |
| `"shadow": { "value": "..." }` (container) | `"box-shadow": { "value": "...", "type": "radius" }` | Property is `box-shadow` |
| `"padding": { "value": "16px" }` (no type) | `"padding": { "value": "{space.4.value}", "type": "space" }` | Need `type`; prefer foundation ref |
| `"activeStar.color"` | `"states.active.icon.color"` | Rating uses states path |
| Root key `"button"` | Root key `"btn"` | Buttons use `btn` prefix |
| `{ "btn": { "x": { "mapping": ... } } }` | `{ "btn": { "appearances": { "x": { "mapping": ... } } } }` | Missing `appearances` level |
| `"border.color": { "value": "..." }` | `"border": { "color": { "value": "..." } }` | Must be nested object |
| `"#7C4DFF"` | `"#7C4DFFff"` | Always include `ff` alpha suffix |
| `"listItem.background.color"` (in list token) | `"background.color"` (in list-template token) | Row styling is a separate `list-template` component |
