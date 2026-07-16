---
name: screenshot-to-wavemaker
description: >
  Generate WaveMaker markup, design tokens, and variable JSON from a screenshot or image.
  This is the all-in-one skill for converting any UI screenshot into a complete WaveMaker page.
  No Figma MCP required — works directly from images pasted or attached in the conversation.
  Trigger when the user pastes/attaches a screenshot and says "generate WaveMaker", "convert to WM",
  "create WaveMaker page from this image", "generate markup and tokens from this screenshot",
  "screenshot to WaveMaker", "image to WM", or any variation involving a screenshot/image and
  WaveMaker/WM output. Also trigger when the user attaches an image and asks to "generate markup",
  "create tokens", "generate components". This skill does NOT require Figma MCP.
sub-skills:
  - widget-detection
  - layout-rules
  - container-system
  - components-list
  - widget-defaults
  - widget-templates
  - advanced-widgets
  - markup-examples
  - styling-system
  - foundation-tokens
  - token-schema
  - global-token-schema
  - design-system-mobile
  - interaction-patterns
  - login-widget
  - input-widgets
  - add-rn-feature
---

# Screenshot to WaveMaker — All-in-One Generator

Convert a screenshot or UI image into a complete WaveMaker page: **markup + design tokens + variables**, all in one pass.

## Workflow

### Phase 1: Analyze Screenshot

Visually parse the screenshot image. NO Figma MCP calls — the image IS the design source.

Identify:
- **Layout**: column/row structure, nesting, spacing between sections
- **Spacing intent**: For EVERY row with 2+ children — fixed gap (grouped) or edge-to-edge (space-between)? Use Container Layout Algorithm Step 2. **Edge-to-edge test**: if two children together visually span ≥80% of the container width, they are at opposite ends → `gap="auto"`. Do NOT measure the pixel space between them and use it as a numeric gap.
- **Typography**: font sizes, weights, colors for each text element
- **Colors (two passes)**:
  - *Per-element colors* — backgrounds, borders, text colors of each element, for layout fidelity and contrast. Extract exact hex values.
  - *Brand palette* — separately, read the design's **brand identity**: the dominant accent (→ `primary`), any clear second/third accent (→ `secondary`/`tertiary`), the semantic colors (success/warning/error/info), and the surface/neutral family (page background, card surface, text-on-surface, borders). This is raw perception — the decision of what (if anything) becomes a global brand token is made in **STEP 0**, not here.
  - **Brand-signal test (feeds STEP 0 — apply it literally):** a brand palette exists ONLY if the design has a *chromatic* accent — a saturated/branded color on a primary action, header, logo, or active state. If the design is **monochrome or grayscale** — only black / white / grays, with color (if any) appearing solely inside photos — then there is **NO brand palette**, regardless of whether it looks like a lo-fi wireframe OR a polished real UI. In that case do **NOT** treat black as `primary` or gray as a brand surface; mark the brand **UNRESOLVED** so STEP 0 asks the user. "It's a real monochrome screenshot" is NOT a reason to skip asking — monochrome = no brand color = ask.
- **Dimensions**: Use Visual Size Estimation below (375px viewport reference)
- **Icons**: icon type (heart, chevron, plus, star, etc.) → `fa fa-*` or confirmed `wi wi-*`
- **Widgets**: map to correct WM widget (see widget mapping table)
- **Data patterns**: lists, repeated items, selects, ratings → variables needed
- **Small details**: dots, badges, shadows, separators, indicator circles
- **Backgrounds**: non-white sections MUST get `background.color` tokens. Frequently missed on promo banners, colored cards.
- **Overlay text**: text ON TOP of images → relative/absolute container pattern (see `container-system.md` Pattern 13)
- **Full-bleed**: edge-to-edge hero → `wm-page-content padding="0px"` + per-section padding
- **Inset card/panel on a background**: a card, form, or panel floating on a colored full-screen background with the background showing on its **left & right** → side gutters come from horizontal `padding` on the **background (parent)** container — never a margin on the card, and never the card's own inner `padding` (inner padding pads the content, it does NOT pull the card off the edges). See `container-system.md` Pattern 14. A `width="fill"` card under a zero-padding parent renders full-bleed — wrong whenever the design shows the background around it. **Match the card's corners and placement to the design**: background visible on all sides → round **all four** corners and keep it in normal flow (don't stretch a sibling with `height="fill"` to pin it to the bottom); only-top-corners-rounded + flush-to-bottom is a different shape (bottom-anchored panel / sheet).
- **Dark pages**: dark background → custom container tab bar (NOT `wm-mobile-tabbar`)

#### ⚠️ Pattern Detection (MANDATORY — Run Before Widget Mapping)

Before mapping individual widgets, **invoke the `widget-detection` reference** (`widget-detection`) and run every pattern check in it against the screenshot. Patterns are independent — a screen may match several. Set a flag for each match (`form: true`, `wizard: true`, `accordion: true`, etc.).

`widget-detection` is the single source of truth for visual cues, common misses, the correct widget, and the wrong widget for every detectable pattern. Do NOT re-derive those rules here.

**Downstream skill loading triggered by flags** (load in **STEP 0** so the skill's required styles enter the design plan; apply through STEP 4 markup):
- `form: true` → load `wavemaker-mobile-forms` along with `form-tokens`.
- `login: true` (username/password/sign-in screen) → load `login-widget`. Use `wm-login` as the outer wrapper — do NOT use bare `wm-form` for login pages.
- `wizard: true` → load `wavemaker-mobile-wizard` (it contains variant authoring; the variant itself is selected during detection).
- `bottomsheet: true` → load `wavemaker-mobile-bottomsheet`.
- `chart: true` -> load `wavemaker-mobile-charts`.
- `accordion: true` → no extra skill; use `wm-accordion` + `wm-accordionpane` directly.

#### ⚠️ Native-Feature Intent Scan (set `nativeFeatureImplied` flag)

After widget detection, **reason about what the screen is for**, not just what it shows. Look at the whole composition — page title, section headings, button captions/intents, icons, copy, and the overall purpose the UI suggests — and judge whether the screen demonstrates, configures, or depends on a **native/device capability** that the UI alone cannot deliver.

Examples of the kind of inference to make (illustrative, not exhaustive — do not pattern-match on these strings):

- A page whose buttons trigger crashes, log errors, or send reports → implies a crash/error reporting integration.
- A screen asking the user to enable notifications, or showing notification preferences → implies a push-notification integration.
- A login/unlock screen with a fingerprint or face icon as the primary action → implies a biometric-auth integration.
- A "secure content" / "DRM" / blacked-out screenshot affordance → implies screen-capture protection.
- A device-security or compliance gate ("device not supported", "rooted device blocked") → implies root/jailbreak detection.
- An "Update available" prompt that promises in-place updates → implies in-app updates / OTA.

Set the flag as:

- `nativeFeatureImplied: <short-name>` — a concise, lowercase-kebab name for the inferred feature (e.g. `crashlytics`, `push-notifications`, `biometric-auth`, `screen-capture-protection`). Prefer well-known feature names; otherwise coin a clear one.
- `nativeFeatureRationale: <one sentence>` — why you inferred it, citing the visual evidence (e.g. "Three buttons labelled Crash App / Attribute Logs / Error Reports under a 'Firebase Crashlytics' heading").

Leave both unset if the screen is purely cosmetic / data-driven and does not imply a native capability. **When in doubt, leave it unset** — a false hand-off is more annoying than a missed one.

Do **not** load `add-rn-feature` now — UI generation continues normally. The flag is consumed after STEP 4, at the Native-Feature Hand-off.

#### Visual Size Estimation

Assume **375px viewport**, **343px content area** (16px padding each side). Estimate sizes as proportions of content width. When uncertain, **choose the smaller token**.

| Element | Typical Size | Token |
|---|---|---|
| Toolbar icon button | 32px | `{space.8.value}` |
| Icon inside button | 18-20px | `{icon.size.sm.value}` |
| Compact action button (+/-) | 28-32px | `{space.7-8.value}` |
| Card/tile padding | 12-16px | `{space.3-4.value}` |
| Section gap | 16-20px | `gap="16"` or `gap="20"` |
| Related items gap | 4-8px | `gap="4"` or `gap="8"` |
| Bottom bar height (tab/nav bar) | 48-52px | `{space.12.value}` |
| CTA / form-action button height | 40px | `{space.10.value}` |
| CTA / form-action button padding | 0px 24px | `{space.0.value} {space.6.value}` |
| Star rating icon (inline) | 12-16px | `{icon.size.xs.value}` |

### Preflight: Inventory Existing Project Tokens (input to STEP 0)

**Run this BEFORE STEP 0.** The design plan's reuse-vs-new decisions must know which appearances and globals the project already defines, so it reuses the established design vocabulary instead of minting near-duplicates (e.g. a fresh `btn-main-action` when the project already has `btn-cta`). Without this read-back, two screenshots produce overlapping-but-separate custom appearances that never converge.

1. **Read the existing override files by EXACT path — do NOT glob for them.** `~{find_files_by_glob}` is unreliable on the overrides tree (it can return unrelated repo files, or nothing, while the override files exist on disk) — never use it to decide whether a token file exists or to locate it. The paths are fixed. Batch into a SINGLE `~{read_files}` call: `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` for EVERY distinct component the screen uses — enumerate them ALL from your Phase 1 screenshot/widget analysis above (NOT from STEP 1; this preflight runs before STEP 0), no fixed subset (each at its own `<folder>/<folder>.json`, where `<folder>` is the component's full name — e.g. button's file is `button/button.json`, even though its root key is `btn`), plus every global file STEP 3 may write, by exact path — `src/main/webapp/design-tokens/overrides/global/color/color.light.json`, `color.dark.json`, `font/font.json`, `radius/radius.json`, `space/space.json` (and any other `global/<category>/<category>.json` the plan resolves to). A batched read returns each existing file's content and an `Error … File not found` line for each absent path — a missing file does NOT abort the batch.
2. **Parse what came back into the inventory.** For each file that returned content, capture per component (root key — `btn`, `label`, `container`, …) its FULL file content (`rawJson`), the appearance names under `appearances`, and each appearance's `mapping`; capture each returned global file's content (`rawJson`), parsed into `category → { tokenPath → value }`. This preflight read is the ONLY read of these files — it also stored the content-hash the STEP 3 write needs, so STEP 3 writes from the captured `rawJson` and never re-reads. This is the project's existing design vocabulary; feed it into STEP 0 so its reuse-vs-new and brand-posture decisions build on it — **establish** (both global color reads not-found), **reuse** (already themed, matches), **mutate-with-care** (already themed, differs). It also stops you hardcoding a literal a global token already owns — `{color.primary.@.value}`-style references pick these up at runtime.
3. **Empty-project case — conclude it ONLY from not-found reads.** A component is fresh ONLY when its exact-path read reports *File not found*; the project is unthemed ONLY when both global color reads report not-found. NEVER infer "empty project" from a glob result — that false conclusion makes STEP 3 overwrite the token files and delete the appearances prior pages saved.
4. **Updating an existing page? Also inventory that page.** When the request updates an existing page (not a fresh build), `~{read_files}` its `<Page>.html` and note the `class`/`variant` styles it already uses, so STEP 0 reuses them and STEP 4 edits the existing markup applying only resolved styles.

### STEP 0: Build the Design Plan (all design-system decisions)

**The design plan is where every design-system decision is made — and the ONLY place.** It is declarative: it names each required visual style and how that style **resolves** within the design system. It does NOT contain markup, `class` strings, file paths, or JSON — those are produced deterministically later (STEP 3 writes the token files; STEP 4 renders the `class`/`variant` strings). Build it from the Phase 1 analysis + the inventory above.

**Load the references first — `load_skill(["foundation-tokens", "global-token-schema"])`.** `foundation-tokens` is the built-in appearance catalog + its "built-in vs custom" decision table — you need it in front of you to match a style against a stock appearance instead of minting a custom one from memory (the #1 cause of ignored built-ins). `global-token-schema` owns the global override-file shape, the color discipline (one object per token, the `@` anchor on every shade, derived companions), the foundation defaults to diff against, AND the slot-selection + blast-radius guide (which slot a sampled value maps to and how far an override reaches — the establish-vs-mutate call) plus the component-layer dimensions no global override touches. It loads on-demand — skipping it means deciding from memory and reintroducing the silent duplicate-key / missing-`@` bugs the validator can't catch.

**Part A — Resolve every visual style as a resolution TABLE (do NOT walk the screen naming elements).** A style's identity is its **resolved property set** (its `mapping`: fill, radius, text color, padding, weight…), NOT the element that needs it. The failure this format prevents: looking at each element and minting an appearance named after it (`login-heading`, `signup-prompt`, `forgot-link`, `price-amount`), so one treatment scatters across many screen-scoped synonyms that never converge across pages. To make that impossible, record every visual style as a row and **fill the columns left-to-right — signature before name — so the name is forced to come from the style, never the element:**

| resolved signature | rung | appearance name (derived from signature) | reuse / justification | used by |
|---|---|---|---|---|

1. **resolved signature** — write this FIRST: the effective color (a palette slot when it matches one — see Part B), the type role (h1/body/label + weight), fill/radius/border, padding. This signature is what you compare and name on.
2. **rung** — descend the ladder, stop at the first hit:
   - `existing` — signature matches an inventoried appearance **key-by-key** (a `{color.x.@.value}` ref and the hex it resolves to count as equal; a foundation-token ref and its px value count as equal). Reuse its **exact name**; author NOTHING — even if this screen's element is named nothing like it.
   - `built-in` — matches a stock foundation appearance (`filled`, `filled`+`primary`, `outlined`, `text`, `icon`, `elevated`, chips `filled`/`elevated`, label groups — see `foundation-tokens` + its "built-in vs custom" table). The widget invokes it by name; author NOTHING. **Most-skipped rung — match the catalog in front of you, not from memory.**
   - `new` — ONLY when the signature matches nothing above AND no earlier row in this table. Author it, deltas only.
3. **appearance name — derived from the signature's visual role, never the element.** Naming guide:
   - default/dark text + large + bold -> `heading-display` / `heading-lg` / `heading-md`
   - default text at body size -> `body-default` / `body-strong` (bold)
   - muted/secondary text -> `caption-muted` / `subtle`
   - accent/link-colored text -> `link-accent`
   - surface/tinted fill -> `card-surface` / `card-tinted` / `banner-accent`
   - 1px rule/separator -> `rule-hairline`

   A name containing a **screen-element or position word** — `login`, `signin`, `signup`, `forgot`, `promo`, `phone`, `price`, `plan`, `hero`, `divider`, `header`, `footer` — is an **invalid row**: rename it after the role. The element goes ONLY in the *used by* column. Also never a `default`/`primary`/`secondary`/`outlined`/`elevated`/`flat`/status name (silently merges built-in chrome — see the reserved-name list in STEP 4), and never redefine an existing-but-different appearance.
4. **reuse / justification** — for `existing`/`built-in`, the reused name. For `new`, `nearest existing: <name>; differs in: <keys>`. A `new` row whose justification names no real delta is an `existing` row you mislabeled — fix it, do not mint.
5. **used by** — the screen element(s) this style serves. Different-role elements that resolve to the same signature (a price and a plan name, a promo line and a signup prompt) share ONE row — list them all here; do NOT split them into separate appearances.

**Dedup is post-resolution:** one row per distinct signature, across both the existing inventory and every row already in this table.

A style whose value is a brand/semantic/surface color or a whole-design scale (density, roundness, type) belongs in the **global** layer (Part B) — a widget using only globals needs no appearance; a `new`-row appearance MAY reference a global (`{color.primary.@.value}`).

**Part B — Resolve the brand posture (globals).** Using the global inventory:
- **Brand resolved from the design AND project has no global overrides → establish** (low bar): plan the brand + semantic + surface globals with `on-*`/`container` companions in BOTH light and dark (the foundation does NOT recompute them, so a base color without companions leaves stale, illegible text). Color-file shape (validator can't catch these): one object per color token — merge `@` + `container` + shades under a single key, never repeat a key; every color leaf ends in `@` except `color.outline.variant`. Add `global/font/font.json` / `global/radius/radius.json` only when the brand clearly dictates them.
- **Project already themed AND the design's brand matches → reuse:** plan NO global change; components reference the existing globals.
- **Project already themed but the design differs → do NOT mutate an established global from one screenshot.** A brand global is app-wide; changing it shifts every page. Plan a mutation ONLY with strong evidence (a deliberate whole-screen rebrand, not one off-palette element) OR explicit user confirmation; otherwise keep the globals and resolve the local difference as a component appearance.
- **Brand UNRESOLVED — monochrome/grayscale (per the Phase 1 brand-signal test), or no design given → STOP and ASK THE USER** before planning any global or coloring any component. A monochrome design is *not* a black brand — do NOT rationalize black→`primary` or gray→`surface`; "it's a real screenshot, not a wireframe" does not exempt it. Ask for the primary brand color (hex) at minimum; optionally secondary/accent, semantic colors, font, light/dark scope, corner personality. Proceed only after the user answers or says "use defaults" (then keep foundation defaults — never black-as-brand).

**Leverage existing foundation slots; add a new custom global token ONLY if the user explicitly asks** (see `global-token-schema`).

**Part C — Fold in sub-pattern styles.** If Phase 1 flagged `form`/`login`/`wizard`/`bottomsheet`, load that skill now and pull its REQUIRED styles into the plan as resolutions (e.g. forms always need a `form-controls` appearance and a `form-wrapper` appearance with its root `background` set). Those skills must NOT mint variants later during markup — every style they need is resolved here. A flagged `chart` is the ONE exception that contributes NO appearance rows: charts have no design-token surface, so instead of an appearance the plan records the chart's SERIES COLORS (hexes sampled from the design, aligned with the brand palette where they coincide) and/or a named theme as PROP decisions applied directly on `wm-chart` — never plan or author `overrides/components/chart/*`. The chart's surrounding card/section wrapper is a normal tokenized container and DOES get a resolution like any other.

**Notify the user (only when globals are established or mutated).** Summarize concisely: the brand palette, which globals were set (companions + dark theme), and that every component inherits them via references. When the brand came straight from the design, notify and proceed; only the "ask the user" branch pauses.

### STEP 1: Build the Layout Plan (+ completeness gate)

Plan the widget hierarchy and layout from the analysis: sections, nesting, the widget each element maps to, gap/alignment/padding intent, and variable needs. Use `widget-detection` (read in Phase 1) for widget choices and the Container Layout Algorithm + Page Structure templates in STEP 4 for structural decisions.

**Completeness gate (mandatory):** as you place each *visually styled* widget, confirm it maps to a STEP 0 style resolution. (Structural, layout-only containers — `class=""` wrappers with no visual style — are exempt.) If a styled widget has no resolution, **amend the design plan** — add its resolution (reuse or new, per Part A) before finishing. **STEP 1 must never complete with an uncovered styling requirement**, and the amendment is a design-plan decision, not a markup one.

### STEP 2: Generate Variables

**DELEGATE TO `variables` skill**: READ `variables` and generate variables for every data-bound widget in the layout plan — data-widget identification, type/`isList` rules, minimum 15 diverse entries, binding syntax.

**Chart datasets go through the same `variables` delegation**, layered with the chart-specific rules in `wavemaker-mobile-charts`: rows MIRROR the design's visible data points (the 15-entry list minimum does NOT apply to charts), field names must exactly match the chart's `xaxisdatakey`/`yaxisdatakey`, and multi-series values are extra numeric fields per row.

### STEP 3: Generate Design Tokens (execute the design plan)

**Prerequisite (blocking): before writing ANY component token file, `load_skill(["token-schema", "figma-to-design-tokens-mobile"])`.** These own the per-component property paths — e.g. the `btn` fill is the flat `background`, `container` is nested `background.color`, `label` is `background-color`. Authoring token JSON without them in context is the #1 cause of silently-dropped overrides; do NOT `write_file` under `overrides/components/**` until they are loaded.

**Pure execution of the finalized design plan — never a discovery step for *which styles exist*. "Do NOT re-derive the plan" bars scanning the markup for `class`/`variant` pairs; it does NOT exempt you from the write-time duplicate guard below.** Work only from STEP 0's resolutions:
- **reuse** resolutions -> author nothing; the built-in or existing appearance already covers them.
- **new custom appearance** resolutions -> **DELEGATE TO `figma-to-design-tokens-mobile`**: author each new appearance, deltas only, at its component override file. **Run the write-time duplicate guard first (no re-read):** the override was already read once in the preflight, so diff the `mapping` you are about to write key-by-key against the appearances in its captured `rawJson`. `~{write_file}` overwrites the whole file, so author by writing `Base(rawJson) + your new appearance(s)` as the full JSON in ONE `~{write_file}` per component (the preflight read authorized it) — never write only the new appearance. If one already matches (a `{...}` reference equals the literal it resolves to), author NOTHING, record `plan's <new-name> resolves to existing <name>`, and STEP 4 renders the existing name. This is an equality check on the JSON, not a design decision, so it cannot conflict with plan authority. Use a global reference (`{color.primary.@.value}`, `{color.surface.@.value}`, …) for any value STEP 0 resolved to a global — never a literal hex that duplicates a global.
- **global** resolutions -> write the global overrides per STEP 0's establish/mutate decision (`global/color/color.light.json` + `color.dark.json` with companions in both themes; `font`/`radius`/etc. only if the plan set them), following `global-token-schema`.

`figma-to-design-tokens-mobile` contains the token authoring rules (per-component property paths, format/type rules, reserved-name warnings, validation checklist, flat-list/inline-select templates).

### STEP 4: Generate Markup

Emit the markup by **consuming** the layout plan (STEP 1), the variables (STEP 2), and the styles STEP 3 resolved. **Never invent a new appearance, variant, or design-system decision here** — only apply resolutions already made, deterministically rendering each resolved appearance name into `class="<prefix>-<appearance>" variant="<appearance>"`. Map each visual element to the correct WaveMaker widget. Read ONLY the references relevant to the design:

> **⛔ MANDATORY PRE-CHECK — Do this BEFORE reading any other reference:**
> - **If wizard was flagged in Phase 1** → invoke the `wavemaker-mobile-wizard` skill (`wavemaker-mobile-wizard`) NOW. Do not write `wm-wizard` or `wm-wizardstep` markup until you have read it. This is not optional.
> - **If design contains input fields + submit button** → invoke the `wavemaker-mobile-forms` skill (`wavemaker-mobile-forms`) along with `form-tokens` NOW. Do not write `wm-form` markup until you have read both.
> - **If bottomsheet was flagged in Phase 1** → invoke the `wavemaker-mobile-bottomsheet` skill (`wavemaker-mobile-bottomsheet`) NOW. Do not write `wm-bottomsheet` markup until you have read it.
> - **If chart was flagged in Phase 1** -> invoke the `wavemaker-mobile-charts` skill (`wavemaker-mobile-charts`) NOW. Do not write `wm-chart` markup until you have read it.

- `foundation-tokens` — **Global tokens, built-in appearances** (READ THIS ALWAYS)
- `container-system` — Container auto-layout (6 mandatory + optional attributes, all 9 alignments, fill/hug behavior, scrollable/wrapping patterns)
- `widget-templates` — Widget property templates (all current props including toggle icons, chips selectionmode, search showclear, popover draghandle, picture aspectratio)
- `widget-defaults` — **Widget defaults, quirks, children** (READ THIS ALWAYS) — includes list direction=row/column with gap, carousel interval in seconds, bottomsheet ratio 0.3, toggle animation, label markdown
- `styling-system` — **NO inline styles, tokens only** (READ THIS ALWAYS)
- `components-list` — Full component list by category
- `layout-rules` — Layout rules, icon classes
- `markup-examples` — Real-world page examples
- `interaction-patterns` — Events, data binding, lists
- `advanced-widgets` — Dialogs, tabs, accordion, navbar, card, carousel

#### Widget Mapping

The visual-pattern → widget mapping is owned by `widget-detection`. Read it once at the start of Phase 1; the flags it produces drive widget selection here.

A few markup-only rules that are NOT in `widget-detection`:

| Pattern | Markup rule |
|---|---|
| Grid / multi-column layout | Use `wm-container direction="row"` with child widths — `wm-layoutgrid`, `wm-gridrow`, `wm-gridcolumn` are BANNED |
| Number input (standalone field) | Use `wm-number` for plain numeric input. For a custom +/- stepper UI, use Pattern E (containers + buttons + label) instead |
| Card with image/title/actions | `wm-card` + `wm-card-content` + `wm-card-footer` (not a styled container) |
| Horizontal text pills / filters / categories | `wm-chips` (not `wm-list` + `wm-button`) |
| Date picker | `wm-date` (not a text input) |
| Alert / notification banner | `wm-message` (not a styled label) |
| Dropdown menu / more actions | `wm-menu` or `wm-popover` (not a hidden container) |
| Chart / graph (bar, column, line, area, pie, donut) | `wm-chart type="..."` (load `wavemaker-mobile-charts`) — never faked from containers/images |

#### Class + Variant Convention

Every styled widget needs BOTH attributes:
- `class="<prefix>-<appearance>"` — CSS class for token overrides
- `variant="<appearance>"` — appearance name from token JSON

**Never emit empty `class=""` or `variant=""` attributes.** Only add `class` and `variant` when the widget has an actual appearance defined in a token file. Widgets without custom styling should omit both attributes entirely. **Exception: containers without a variant MUST still have `class="app-default-container"`.**

| Widget | Prefix | Example |
|---|---|---|
| `wm-button` | `btn` | `class="btn-circle-accent" variant="circle-accent"` |
| `wm-label` | `label` | `class="label-body-strong" variant="body-strong"` |
| `wm-container` | `container` | `class="container-pill-row" variant="pill-row"` |
| `wm-picture` | `picture` | `class="picture-avatar" variant="avatar"` |
| `wm-rating` | `rating` | `class="rating-inline-sm" variant="inline-sm"` |
| `wm-list` | `list` | `class="list-flat" variant="flat"` |
| `wm-listtemplate` | `list-template` | `class="list-template-item" variant="item"` |
| `wm-icon` | `icon` | `class="icon-chevron" variant="chevron"` |

#### Applying appearances — the resolution was already made in STEP 0

Do NOT decide reuse-vs-new here. Every widget's appearance was resolved in the STEP 0 design plan (Part A ladder: existing project appearance -> built-in foundation appearance -> new custom appearance). Here you only **apply** the resolution:
- resolved to a custom or existing appearance → render `class="<prefix>-<name>" variant="<name>"` with that exact name.
- resolved to a built-in foundation appearance → invoke it by its built-in name via `class="<prefix>-<builtin>" variant="<builtin>"` (e.g. `filled`, `elevated`, `flat` — see `foundation-tokens` / `token-schema` for the built-in names).
- resolved to globals-only / plain default → no `class`/`variant` (containers still get `class="app-default-container"`); the widget inherits the global tokens.

If you find a styled widget with **no** resolution, you skipped the STEP 1 completeness gate — stop, amend the design plan, and re-run STEP 3 for the addition. Never invent an appearance mid-markup.

#### ⚠️ RESERVED APPEARANCE NAMES — Never use these as custom appearance names

WaveMaker's foundation registers built-in styles with specific class names. If a custom appearance name collides with one of these, the built-in styles (background, padding, borderRadius, etc.) silently merge in, causing unwanted visual chrome on plain widgets.

| Widget prefix | Reserved names (NEVER use as `<appearance>` in `class="<prefix>-<name>"`) | What happens if used |
|---|---|---|
| `btn` | `default`, `primary`, `secondary`, `danger`, `success`, `warning`, `info`, `link`, `dark`, `light`, `only-label` | Built-in colored button styles override your token (bg, border, text color) |
| `label` | `default`, `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `muted` | **Badge styles applied**: background-color + padding 32/16px + borderRadius 6 + fontWeight 700 |
| `container` | `default`, `outlined`, `elevated` | Built-in container chrome (border or shadow) applied |
| `picture` | `default`, `thumbnail` | Built-in picture sizing/shape applied |
| `list` | `flat` | Foundation flat list styles (intentional — DO use `flat` for flat lists) |
| `list-template` | `flat` | Foundation flat template styles (intentional — DO use for flat lists) |

**Also avoid these standalone class names on labels** (they match built-in heading/text styles):
- Heading classes: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `media-heading`
- Text-status classes: `text-primary`, `text-secondary`, `text-success`, `text-warning`, `text-danger`, `text-info`, `text-muted`

**Use descriptive alternatives instead:**
- ❌ `muted` → ✅ `subtle`, `quiet`, `secondary-text`
- ❌ `primary` (label) → ✅ `accent`, `brand`, `highlight`
- ❌ `primary` (button) → ✅ `main-action`, `cta`, `accent`
- ❌ `default` → ✅ `standard`, `base`, `neutral`
- ❌ `info` → ✅ `detail`, `note`, `helper`
- ❌ `danger` → ✅ `error-text`, `alert`, `negative`
- ❌ `label-success` → ✅ `label-positive`, `label-confirmed`, `label-done`
- ❌ `btn-warning` → ✅ `btn-caution`, `btn-alert`, `btn-notice`

#### ⚠️ PAGE STRUCTURE — Copy this template FIRST, then fill in sections

**Before writing ANY containers, start from one of these two templates:**

Template A (`wm-mobile-tabbar` — standard bottom nav):
```xml
<wm-page name="PageName">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">
        <!-- ALL page sections go here -->
      </wm-container>
    </wm-page-content>
  </wm-content>
  <!-- ⚠️ OUTSIDE wm-content, INSIDE wm-page -->
  <wm-mobile-tabbar name="bottom_tabs" dataset="bind:Variables.tabItems.dataSet" itemlabel="label" itemicon="icon" itemlink="link"></wm-mobile-tabbar>
</wm-page>
```

Template B (custom container tab bar — dark pages or custom styling):
```xml
<wm-page name="PageName">
  <wm-content name="content1" borderwidth="0px" padding="0px">
    <wm-page-content columnwidth="12" name="page_content1" padding="16px">
      <wm-container name="main_content" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="fill">
        <!-- ALL page sections go here -->
      </wm-container>
    </wm-page-content>
  </wm-content>
</wm-page>
```
(Custom tab bar goes as last child of main_content with `position="fixed" positionvalue="auto auto 0px auto"`)

---

#### ⚠️ FORM AUTHORING (MANDATORY when `form: true` flag set)

Detection happens in Phase 1 via `widget-detection`. If the form flag is set, apply these authoring rules NOW — before writing any containers:

1. **READ the `wavemaker-mobile-forms` skill** (`wavemaker-mobile-forms`) along with `form-tokens` for the complete form system and token schema
2. **Wrap ALL related inputs in `wm-form`** — set `title` if the design shows a form heading
3. **`wm-form` has exactly two direct `wm-container` children**: a body container and an actions container. The body container wraps all `wm-form-field` elements plus any non-field inline elements (labels, links, dividers) in nested containers. The actions container wraps all `wm-form-action` elements. Nothing else is a direct child of `wm-form`.
4. **Each labeled input → `wm-form-field`** — set `name`, `displayname`, `widget` type, `required`, `placeholder`
5. **Submit/Save/Cancel/Continue buttons → `wm-form-action`** — NOT standalone `wm-button`. Set `type="submit"` for save/continue, `type="reset"` for clear, `type="cancel"` for cancel. Set `update-mode="true"` for edit-mode buttons.
6. **Match `widget` to the visual**: text box → `text`, dropdown → `select`, toggle → `toggle`, calendar → `date`, star rating → `rating`, checkbox → `checkbox`, slider → `slider`, phone input → `text`
7. **Floating labels** (label inside the input) → `captionposition="floating"` on the `wm-form`
8. **Horizontal labels** (label to the left of input) → `layoutposition="horizontal"`
9. **Multi-column form** → `itemsperrow="xs-1 sm-2 md-2 lg-2"`
10. **Required fields — `required` is design-driven, NOT a default.** Set `required="true"` ONLY when the design itself marks the field mandatory: a visible asterisk (`*`) on/after the label, the word "required", or a "* indicates required" legend. At runtime `required="true"` has TWO effects — it renders a required-marker asterisk next to the field label AND blocks form submit until the field is filled (showing a validation error). Putting it on a field the design left unmarked therefore invents both an asterisk and a submit-time error the design never showed. When in doubt, OMIT it. Never fake the marker by typing a literal `*` into `displayname` either — that belongs there only if the design shows it (and if `required="true"` is also set it would double the asterisk).
11. **Form tokens** live in TWO files: `form-wrapper/form-wrapper.json` (header, body, footer styling) AND `form-controls/form-controls.json` (the inputs — background, border, text, placeholder, label). In `form-controls`, typography is **nested** (`font.size`, `label.font.size` — NEVER flat `font-size`/`label.font-size`). See the `form-controls` block in `token-schema` / `form-tokens` for the exact shape.
12. Do NOT manually write `wm-form-body` or `wm-form-footer` — codegen auto-creates them

##### Hybrid Form Pattern (Form + Non-Form Siblings)

Many screens mix a form section with non-form elements (social login buttons, OAuth options, "or" dividers, promotional banners). Structure these as siblings at the same level:

```xml
<wm-container name="main_content" class="app-default-container" direction="column" gap="24" alignment="top-left" width="fill" height="fill">
  <!-- Non-form: header / close button / title -->
  <wm-container name="header_row" class="app-default-container" direction="row" gap="auto" alignment="center" width="fill" height="hug">
    <wm-button name="close_btn" iconclass="wi wi-close" class="btn-icon-close" variant="icon-close"></wm-button>
    <wm-label name="page_title" caption="Log in or sign up" class="label-heading-md" variant="heading-md"></wm-label>
    <wm-container name="spacer" class="app-default-container" direction="column" gap="0" alignment="top-left" width="32px" height="hug"></wm-container>
  </wm-container>

  <!-- FORM: wraps ONLY the input fields + submit button -->
  <!-- body container: fields + any inline non-field elements as nested containers -->
  <wm-form name="login_form" captionposition="top" itemsperrow="xs-1 sm-1 md-1 lg-1">
    <wm-container name="login_fields" class="app-default-container" direction="column" gap="12" alignment="top-left" width="fill" height="hug">
      <wm-form-field name="country" displayname="Country/Region" widget="select"
        dataset="bind:Variables.countryOptions.dataSet" datafield="dataValue" displayfield="dataValue"
        defaultvalue="United States (+1)"></wm-form-field>
      <wm-form-field name="phone" displayname="Phone number" widget="text"
        placeholder="Phone number" required="true"></wm-form-field>
    </wm-container>
    <!-- actions container: separate sibling, wraps all form-actions -->
    <wm-container name="login_actions" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
      <wm-form-action name="continue_action" display-name="Continue" type="submit"
        class="btn-cta" update-mode="true"></wm-form-action>
    </wm-container>
  </wm-form>

  <!-- Non-form: helper text -->
  <wm-label name="helper_text" caption="We'll call or text..." class="label-helper" variant="helper"></wm-label>

  <!-- Non-form: "or" divider -->
  <wm-container name="or_divider" class="app-default-container" direction="row" gap="16" alignment="middle-center" width="fill" height="hug">
    <wm-container name="line_l" class="container-rule-hairline" variant="rule-hairline" direction="row" gap="0" alignment="top-left" width="fill" height="1px"></wm-container>
    <wm-label name="or_label" caption="or" class="label-caption-muted" variant="caption-muted"></wm-label>
    <wm-container name="line_r" class="container-rule-hairline" variant="rule-hairline" direction="row" gap="0" alignment="top-left" width="fill" height="1px"></wm-container>
  </wm-container>

  <!-- Non-form: social login buttons -->
  <wm-list name="social_list" dataset="bind:Variables.socialLogins.dataSet" direction="column" gap="16" navigation="None" pagesize="4">
    <wm-listtemplate name="social_tmpl" class="list-template-social" variant="social" direction="row" gap="auto" alignment="center" width="fill" height="hug" padding="14">
      <wm-icon name="social_icon" iconclass="bind:Variables.socialLogins.dataSet[$i].icon"></wm-icon>
      <wm-label name="social_label" caption="bind:Variables.socialLogins.dataSet[$i].label"></wm-label>
      <wm-container name="spacer" class="app-default-container" direction="column" gap="0" alignment="top-left" width="24px" height="hug"></wm-container>
    </wm-listtemplate>
  </wm-list>
</wm-container>
```

The form boundary wraps ONLY the inputs + submit. Social logins, dividers, headers, and helper text are sibling containers — NOT inside the form.

---

#### ⚠️ CONTAINER LAYOUT ALGORITHM — Execute for EVERY container and listtemplate

**Run these 5 steps IN ORDER before writing each container/listtemplate. Do not skip any step.**

**Step 1 — DIRECTION**: Is this element's content arranged horizontally or vertically?
→ Horizontal = `direction="row"` | Vertical = `direction="column"`

**Step 2 — GAP**: For `direction="row"`, answer these questions IN ORDER:

  **Q1: Do the children span the full row width (left edge to right edge)?**
  → YES = `gap="auto"`. Examples: two action buttons filling the row ("Transfer Funds" + "Fund Account"), header title + icon, price label + CTA button, any 2 elements at opposite ends.
  → NO = continue to Q2.

  **Q2: Are ALL children clustered together on ONE side with empty space on the opposite side?**
  → YES = numeric gap (`8`, `12`, `16`). Examples: a chip/tag row, 3+ small icon buttons grouped in one corner of a toolbar, a label + small badge sitting together on the left.
  → NO = `gap="auto"` (default; safer choice when uncertain).

  ⚠️ Two buttons filling a row are NOT a "group" — they are edge-to-edge.
  ⚠️ NEVER estimate a pixel gap from the design and use it directly. The space between two edge-to-edge children is a RESULT of auto spacing, not a fixed value.

  Common mistake — two action buttons:
  ❌ `gap="16"` → buttons cluster left, dead space on right
  ✅ `gap="auto"` → buttons pushed to opposite edges (space-between)

  For `direction="column"`, always use a numeric gap matching the visual spacing between sections.

**Step 3 — ALIGNMENT**: Pick based on gap type:
- `gap="auto"` → choose from `start` | `center` | `end` (NEVER use 9-value names like `top-left` with auto)
- `gap="N"` (numeric) → choose from `top-left` | `top-center` | `top-right` | `middle-left` | `middle-center` | `middle-right` | `bottom-left` | `bottom-center` | `bottom-right` (NEVER use `center`/`start`/`end` with numeric)
- For row containers: if children have DIFFERENT heights → use `middle-*` (numeric) or `center` (auto) for vertical centering
- Default for most rows: `center` (auto gap) or `middle-left` (numeric gap)

**Step 4 — PADDING**: Check the design — does this element have visible space between its edge and its children? If YES → add `padding` using CSS shorthand: `padding="16"` (all sides), `padding="12 16"` (vertical horizontal), or `padding="12 16 12 16"` (top right bottom left). Cards, list items, section wrappers, nav bars almost ALWAYS need padding.

**Step 5 — WIDTH + HEIGHT**: Container → `fill` | `hug` | `Npx` | `N%`. Widgets (button, label, etc.) → `Npx` | `N%` only (NEVER `fill` or `hug` on widgets).

**⚠️ Logical Group Containment Rule** (applies BEFORE Step 1): Before assigning a container to a nesting level, ask: *"Does this element describe or belong to the same data entity as its visual parent group?"* Attributes of a single entity (price, quantity, status, rating, timestamp, action buttons) MUST remain nested inside that entity's container — even if the resulting row visually spans the full parent width. **A full-width row appearance does NOT mean top-level sibling placement.** The visual span of a row is determined by its parent's width, not by its semantic level in the hierarchy.

**⚠️ Left-Indent Nesting Test** — apply this whenever a column parent contains a row of the form `[fixed-width element | fill-column]` followed by additional rows:

For each subsequent row S below the `[fixed | fill]` row, ask:
- Does S's leftmost content start at the **same x-position as the fixed-width element** (i.e., the parent container's left edge)? → S is a **sibling** of the `[fixed | fill]` row.
- Does S's leftmost content start at the **same x-position as the fill-column's content** (i.e., offset inward by the fixed element's width)? → S is a **child of the fill-column**.

The visual test: draw a vertical line down from the leading edge of the fill-column's text. Any row whose first element touches or starts at that line belongs inside the fill-column, not at the outer level.

---

#### ⚠️ TRANSLATING OUTER SPACING & MARGINS — there is no `margin` primitive

WaveMaker mobile has **no `margin` attribute** (it is banned — see Markup Rule 1). So every margin, outer inset, or gap the design shows must be *translated* into one of the constructs that DO exist, or it silently disappears and the element renders flush / edge-to-edge. Run this whenever the design shows space *around* an element (not just padding inside it):

1. **Inset via the parent's `padding`** — a block that floats with side/top margins gets that space from `padding` on its parent container (or from `wm-page-content padding="16px"`). The margin lives on the parent, never on the child.
2. **Constrain the child's `width` (+ center it)** — a block narrower than the screen uses `width="N%"`/`Npx` with the parent aligned `center` / `top-center`, so the leftover space reads as side margins. **A floating element must NOT be `width="fill"` inside a zero-padding parent** — that erases its side margins and stretches it wall-to-wall.
3. **`gap` on the parent for space *between* siblings** — whitespace between stacked elements (logo above a card, heading above fields) is a non-zero `gap` on their column parent. `gap="0"` collapses that whitespace and the elements touch.
4. **Spacer sibling** — an empty `wm-container` with a fixed `width`/`height` when none of the above fit.

**The two most common layout regressions this prevents:**
- *Card loses its side margins* → caused by `width="fill"` on a card whose parent has no horizontal padding. Fix: give the parent horizontal `padding`, or set the card `width` < `fill` and center it.
- *Stacked elements collapse together* (e.g. logo sits flush on the card) → caused by `gap="0"` / no spacer between them. Fix: set the column parent's `gap` to the measured spacing.

**Floating card vs. bottom sheet — do not confuse them:**

| Design shows | It is a… | Author as |
|---|---|---|
| A panel that floats with insets on ALL sides, rounded on ALL corners, sitting over/within a background | **Floating card** | Inset/constrained container (parent `padding` OR `width<fill`+center); ALL corners rounded |
| A panel attached to the bottom edge, spanning the FULL width, rounded on the TOP corners only | **Bottom sheet** | `bottomsheet: true` pattern (see `wavemaker-mobile-bottomsheet`) — NOT a plain card |

A floating card must keep its all-around margins and full corner radius. Giving a floating card `width="fill"` + top-only corner radius turns it into a bottom-sheet look the design never showed.

---

#### Markup Rules (ALL mandatory)

1. **NO inline styles** — NEVER use `backgroundcolor`, `color`, `fontsize`, `fontweight`, `borderradius`, `margin`, `bordercolor`, `opacity` as markup attributes. **Exception 1: `padding` is a valid direct prop on containers/listtemplates.** There is no `margin` attribute at all — translate every outer margin into parent `padding`, a constrained child `width`, parent `gap`, or a spacer (see "Translating outer spacing & margins" above). **Exception 2 (charts): chart appearance props — `theme`, `customcolors`, `labelcolors`, `areafill`, `areaopacity`, `linethickness`, etc. — are valid attributes on `wm-chart` ONLY, because charts are styled via widget props, not design tokens (see `wavemaker-mobile-charts`).**
2. **Paired tags only** — NEVER self-closing `<wm-x />`. Always `<wm-x></wm-x>`.
3. **Every container and `wm-listtemplate` needs these attributes** — `name`, `class`, `direction`, `gap`, `alignment`, `width`, `height`, plus `padding` when the design shows inner spacing. Use the Container Layout Algorithm above for gap/alignment/padding decisions. **Container class discipline**: styled containers (custom background, border, radius, shadow) → `class="container-X" variant="X"` (BOTH required, always paired); structural/layout-only containers (pure spacing/flex wrappers with no visual style) → `class=""` (empty string, no variant). **NEVER use a generic placeholder class** like `container-wrapper`, `container-section`, or `container-card-section` — if a container has no tokens in the token file, it must have `class=""`.
4. **Static captions for visible text** — Use literal text, NOT `bind:`. Exception: inside `wm-listtemplate` where `bind:Variables.x.dataSet[$i].field` is required.
5. **Prefer Font Awesome icons** — Use `fa fa-*` by default, **Font Awesome 4.7 names ONLY** (WaveMaker bundles FA 4.7; FA 5/6 names render as a blank box). Only use `wi wi-*` for confirmed icons: `wi wi-back`, `wi wi-arrow-back`, `wi wi-chevron-down`, `wi wi-chevron-up`, `wi wi-chevron-left`, `wi wi-chevron-right`, `wi wi-close`, `wi wi-check`, `wi wi-user`, `wi wi-lock`, `wi wi-event`, `wi wi-star`, `wi wi-star-border`.
6. **Distinct Pexels images** — Different photo IDs for each `wm-picture`. `picturesource="https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg"`
7. **`wm-rating`** — Set `showcaptions="false"` when no captions shown. Set `readonly="true"` for display-only.
8. **`wm-list`** — Must have `wm-listtemplate` child, `direction="column"` (NOT "vertical"), `gap` (NOT "spacing"), `navigation="None"`, `pagesize` >= visible items. For horizontal lists use `direction="row"`.
8c. **Horizontal lists MUST hide scrollbar** — ALWAYS set `hidehorizontalscrollbar="true"` on any `wm-list` with `direction="row"`. Without this, a visible scrollbar/scroll indicator appears at the bottom of horizontal lists, which almost never matches the design.
8b. **MANDATORY: Use `wm-list` for ALL repeated patterns** — If 2 or more items share the same structural template, they MUST use `wm-list` + `wm-listtemplate` bound to a variable. NEVER manually repeat `wm-picture`, `wm-container`, or `wm-button` elements for similar items. Test: can you describe ONE layout template where data fills the slots? If yes → `wm-list`. Items do NOT need to look visually identical — different colors, images, badges, or button labels per item are DATA variation, not structural variation. Create a variable with the data and use `bind:` inside the list template. This applies to BOTH vertical lists AND horizontal scrollable rows.
8d. **`wm-listtemplate` IS an auto-layout container** — `wm-listtemplate` supports ALL container auto-layout props: `direction`, `gap`, `alignment`, `width`, `height`, `padding` (CSS shorthand: 1, 2, or 4 values). It acts as the direct layout container for list item content. **NEVER wrap the entire listtemplate content in a `wm-container` just for layout/alignment.** Place auto-layout props (`direction`, `gap`, `alignment`, `padding`, etc.) directly on the `wm-listtemplate` element and put child widgets directly inside it. Only use inner containers when you need NESTED sub-layouts (e.g., a column group inside a row template). The `class`/`variant` on `wm-listtemplate` maps to `list-template` component tokens, which handle both the background override AND visual styling (border, radius, padding via tokens). Example:
    ```xml
    <!-- CORRECT: listtemplate as direct layout container -->
    <wm-listtemplate name="tmpl" class="list-template-item" variant="item" direction="row" gap="12" alignment="middle-left" width="fill" height="hug" padding="12">
      <wm-picture name="avatar" ... width="40px" height="40px"></wm-picture>
      <wm-container name="details" class="app-default-container" direction="column" gap="4" alignment="top-left" width="fill" height="hug">
        <wm-label name="title" caption="bind:..." ...></wm-label>
        <wm-label name="subtitle" caption="bind:..." ...></wm-label>
      </wm-container>
    </wm-listtemplate>

    <!-- WRONG: unnecessary wrapper container -->
    <wm-listtemplate name="tmpl" class="list-template-flat" variant="flat">
      <wm-container name="wrapper" class="app-default-container" direction="row" gap="12" alignment="middle-left" width="fill" height="hug" padding="12">
        <wm-picture name="avatar" ...></wm-picture>
        ...
      </wm-container>
    </wm-listtemplate>
    ```
9. **Page structure + tab bar** — Use the Page Structure template above. `wm-mobile-tabbar` goes OUTSIDE `<wm-content>`. Custom tab bar goes inside with `position="fixed"`.
10. **Fixed-position elements** — FAB, floating buttons, sticky headers MUST be wrapped in `wm-container` with `position="fixed" positionvalue="top right bottom left"`. Only `wm-container` supports position props. Common: FAB `positionvalue="auto 16px 16px auto"`, bottom bar `positionvalue="auto auto 0px auto"`. **Exception: a submit/save/continue CTA that belongs to a `wm-form`/`wm-login` is NOT a standalone fixed element — it stays inside the form's actions container. Never move a `wm-form-action` into a fixed container outside the form, even when the design pins it to the bottom of the screen.**
11. **NEVER use grid components** — `wm-layoutgrid`, `wm-gridrow`, `wm-gridcolumn` are BANNED.
12. **Use semantic widgets** — Always use the proper semantic widget (`wm-select`, `wm-number`, etc.) and style via design tokens. Never decompose into primitives to match a design — functional correctness over pixel-perfect UI.
13. **Appearances come from the design plan** — every widget's appearance was resolved in STEP 0 (reuse existing / built-in / new). Apply the resolved name here; do not re-decide or author tokens (STEP 3 already authored any new appearances).
14. **`datavalue` on selects/inputs** — Pre-select the value shown in the design.
15. **`datafield` on ALL dataset-bound widgets (CRITICAL)** — For `wm-chips`, `wm-select`, `wm-checkboxset`, `wm-radioset`, `wm-switch`: ALWAYS set `datafield` to match the field name in the variable's dataSet objects (e.g., `datafield="dataValue"`). Also set `displayfield` to the field name for the visible text. Missing `datafield` causes **silent rendering failure** — the widget appears empty with no error. For `wm-list`, set `itemlabel`, `itemicon`, etc. to bind to fields. For `wm-mobile-tabbar`, set `itemlabel`, `itemicon`, `itemlink`.
16. **Visual detail scan** — After mapping widgets, scan for small details: dots, badges, shadows, separators.
17. **Background scan** — Every non-white section MUST get `background.color` tokens. Missing backgrounds = wireframe look.
18. **Full-bleed hero** — Edge-to-edge hero → `wm-page-content padding="0px"` + per-section `padding="0 16"` (vertical horizontal shorthand).
18b. **Inset card/panel on a full-bleed background** — When content (a card, form, panel) floats on a background that reaches the screen edges, the side gutters come from horizontal `padding` on the **parent** background container — NOT a margin on the child (`margin` is not a valid markup attribute and does not inset a `fill` child), and NOT the card's own inner `padding` (that pads content, leaving the card edge-to-edge). Pair the `width="fill"` card with parent horizontal padding; a zero-padding parent makes the card full-bleed. **If your layout plan said "inset card → parent padding," make sure the parent in the final markup actually carries that padding — don't substitute the card's own padding at write time.** See `container-system.md` Pattern 14.
19. **Dark pages** — NEVER `wm-mobile-tabbar` (unoverridable light theme vars). Use custom container tab bar with `position="fixed"`.
20. **Overlay text** — Text ON image → `position="relative"` wrapper + `position="absolute" positionvalue="0px 0px 0px 0px"` overlay. NEVER stack text below.
21. **Full-bleed carousel** — Override `slide.padding: "0px"` + `slide.transform: "none"`. Use `controls="indicators"` for dots only.

> **Tokens (STEP 3) and variables (STEP 2) were already produced before this markup step.** Do not regenerate them here, and do NOT derive tokens from the markup you just wrote — STEP 3 executed the design plan. If writing the markup surfaces a styled widget with no resolution, that is a STEP 1 completeness-gate miss: amend the design plan and re-run STEP 3 for the added resolution, never author tokens ad hoc from markup.

### Persist Output (do NOT write a `components/` tree)

**Nothing under `components/<PageName>/` is written to disk** — the tree below is a reasoning model for *which* components need appearances, not a write target. Persist component tokens by writing the override JSON directly with the file tools to `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` (global/theme tokens → `src/main/webapp/design-tokens/overrides/global/<property>/<file>.json`, e.g. `global/color/color.light.json`); write `Base(rawJson) + new` from the preflight-captured content in ONE `~{write_file}` per component — no re-read. **Never write page-scoped token files** under `pages/<PageName>/tokens/` or a `components/<PageName>/` tree — those are dead artifacts the design system never reads. Markup and variables are persisted by the page-update flow (the prompt's persistence rules); do not duplicate them as files here.

> **⚠️ Read before you write, and MERGE — never overwrite a token file (mandatory).** `~{write_file}` **replaces the entire file**; it does NOT merge or append. Two consequences. (1) *Concurrency guard:* writing a file that already exists is rejected with *"Read file before writing"* unless you read that exact path via `~{read_files}` this turn. (2) *Data safety — single read:* the preflight already read every existing override ONCE (capturing its `rawJson` AND the hash this write needs), so do NOT read it again. Write `Base(rawJson) + your new appearance(s)` as the FULL JSON in ONE `~{write_file}` per component. Writing only the new appearance deletes every other — the styling of pages already built. (A component the preflight didn't cover: read it once here, then write.) Page scaffolds (`<Page>.html`, `<Page>.variables.json`) follow the same read-first rule. Only a brand-new file may be written without a prior read.

```
components/<PageName>/   ← conceptual map only — DO NOT write any of these to disk
├── <PageName>.markup.xml
├── tokens/
│   ├── button/button.json
│   ├── label/label.json
│   ├── container/container.json
│   ├── icon/icon.json
│   ├── picture/picture.json
│   ├── rating/rating.json
│   ├── list/list.json
│   ├── listtemplate/listtemplate.json  ← REQUIRED when any list uses flat/clean styling (root key list-template)
│   ├── carousel/carousel.json  ← REQUIRED when carousel needs slide/dot overrides
│   ├── tabbar/tabbar.json  ← Only for light-themed pages with tabbar
│   ├── search/search.json
│   ├── toggle/toggle.json  ← REQUIRED when toggle has custom track/handle colors
│   └── wizard/wizard.json  ← REQUIRED when wm-wizard uses custom colors or overrides
├── variables.json
```

One appearance set per component — only for components that have custom appearances; persist each by writing its override file at `src/main/webapp/design-tokens/overrides/components/<component>/<component>.json` (write `Base(rawJson) + new` from the preflight capture; don't re-read), never as a page-scoped token file.
**IMPORTANT**: When any `wm-list` uses flat/clean styling (no card-like items), you MUST cover BOTH the `list` tokens (item wrapper overrides) AND the `list-template` tokens (template root background override) — write both as override files (`components/list/list.json` and `components/listtemplate/listtemplate.json`, the latter with root key `list-template`). See the Flat List Override Template in `token-schema`.

#### Native-Feature Hand-off (after files are written)

If Phase 1 set `nativeFeatureImplied`, after the page is fully written **and verified**, surface a brief hand-off to the user before ending the turn:

> "The screen is in place. Looking at it, it appears to be a **{nativeFeatureImplied}** screen ({nativeFeatureRationale}). The buttons and layout exist, but the underlying native capability won't work until it's actually integrated. Want me to wire it up using the `add-rn-feature` workflow?"

Rules:
- Ask **once**, after the UI is complete. Do not block file writes on the question.
- If the user says yes → load `add-rn-feature` and pass `{featureName: nativeFeatureImplied}` as input.
- If the user says no, or doesn't answer → finish the screenshot turn normally; note the deferred integration in the final summary.
- If `nativeFeatureImplied` is unset → no prompt; end normally.

## Verification Checklist

### Markup
- [ ] Page structure matches Template A or B from above
- [ ] Every container/listtemplate passes the 5-step Container Layout Algorithm (direction → gap → alignment → padding → size)
- [ ] Outer spacing translated, not dropped: every margin/inset → parent `padding` or constrained child `width`+center; space between stacked siblings → non-zero parent `gap` (no floating element left `width="fill"` in a zero-padding parent); a floating card (all-around margins, all corners rounded) is NOT authored as a full-bleed bottom sheet
- [ ] Every styled widget: both `class="<prefix>-<name>"` and `variant="<name>"`
- [ ] Static captions for visible text (NOT `bind:`) — except inside `wm-listtemplate`
- [ ] Icons: `fa fa-*` or confirmed `wi wi-*` only; paired tags; no inline styles
- [ ] `wm-list`: `wm-listtemplate` child + `navigation="None"` + `pagesize`; horizontal lists have `hidehorizontalscrollbar="true"`
- [ ] `wm-listtemplate` IS the layout container — no unnecessary wrapper `wm-container` inside
- [ ] 2+ items sharing structural template → `wm-list` + variable (NEVER manually repeated widgets); items with different colors/badges/actions are DATA variation, not structural variation
- [ ] Every dataset widget (`wm-chips`, `wm-select`, etc.) has `datafield` and `displayfield` set
- [ ] Distinct Pexels photo IDs; background scan for non-white sections; overlay text uses relative/absolute pattern
- [ ] Full-bleed hero → `wm-page-content padding="0px"` + per-section padding; dark page → custom tab bar (not `wm-mobile-tabbar`)
- [ ] Inset card/panel (design shows background on its left & right) → the card's **parent** container actually has horizontal `padding` and the card is NOT edge-to-edge; the card's own inner `padding` does NOT count as the inset (`container-system.md` Pattern 14)
- [ ] Forms: ≥1 input + submit button → `wm-form` + `wm-form-field` + `wm-form-action` (NOT loose widgets)
- [ ] Wizard: numbered steps / progress circle / stepper bars / dots → `wm-wizard` + `wm-wizardstep` (NOT manual containers); first step `showprev="false"`, last step `shownext="false" showdone="true"`
- [ ] Progress: horizontal rail with a partial fill (no thumb) → `wm-progress-bar`; circular ring/arc with center value → `wm-progress-circle` (NEVER a colored/nested container faking the fill)
- [ ] Chart: `type` re-verified against the visual and correctly capitalized (vertical bars = `Column`, NOT `Bar`); `xaxisdatakey` = category field / `yaxisdatakey` = value field(s), EXACTLY matching the variable's field names (mis-keyed charts silently render demo data); no `fill`/`hug` width/height — `height` fixed px; colors via `customcolors`/`theme` props; NO chart token file authored

### Tokens & design plan
- [ ] **Design plan built before layout/markup**: STEP 0 recorded a resolution (built-in / existing / new / global / combination) for every visual style, and the STEP 1 completeness gate left nothing uncovered.
- [ ] **Brand posture correct**: globals were established only when the project had none (or mutated only with strong evidence / explicit user confirmation); an already-themed project's globals were reused, not silently rewritten; a monochrome/unresolved brand paused to ask the user. Companions (`on-*`/`container`) + dark theme were written for any established/mutated global.
- [ ] **STEP 3 executed the plan (not the markup)**: exactly the plan's *new* appearances were authored; reused/built-in resolutions authored nothing; no token was derived by scanning markup.
- [ ] **No duplicate appearances**: no two appearances of the same component share an identical resolved `mapping` — not newly-authored vs newly-authored, nor newly-authored vs pre-existing (`{...}` refs and the literals they resolve to count as equal). Each STEP 0 rung-3 mint's justification (`nearest existing: <name>; differs in: <keys>`) names a real delta. On any hit, collapse to one name and update every `class`/`variant` reference in the markup.
- [ ] **Components reference globals**: no component appearance hardcodes a brand/semantic/surface hex that equals a global token — those use `{color.*.@.value}` references. Literal hex only for genuinely off-palette one-offs.
- [ ] **Plan ↔ markup reconcile**: every `variant="<name>"` in markup traces to a plan resolution and an authored/existing appearance (STEP 4 invented nothing); no authored appearance is left unused (orphan); reused appearances actually match the design.
- [ ] See `figma-to-design-tokens-mobile` skill for full token validation rules

### Variables
- [ ] Every data widget has a variable; `entry` + `isList: true` for arrays; minimum 15 diverse entries
- [ ] See `variables` skill for full variable validation rules

## Common Markup Mistakes (quick reference)

| Wrong | Right |
|-------|-------|
| `alignment="center"` with numeric gap | `alignment="middle-center"` — `"center"` only works with `gap="auto"` |
| `width="fill"` or `height="hug"` on `wm-label`, `wm-button`, or any leaf widget | `fill`/`hug` only on containers, lists, listtemplates — use `Npx` or `N%` on widgets |
| `type="button"` on `wm-button` | No `type` attribute — `type` is only for `wm-form-action` |
| 2–3 labeled options in a single pill/rounded container (one highlighted) → individual `wm-button` per option | `wm-switch` with `dataset` — renders as a native button group with built-in selection state; buttons have no selection state |
| Attribute row of an entity (price, qty, status…) placed at the parent section level because it visually spans full width | Logical group containment: entity attributes stay nested inside their entity container regardless of visual span width |
| Long wrapping label placed directly inside a row container that has sibling elements | Wrap label in `<wm-container width="fill">` — a direct label in a flex row has no flexGrow and will truncate instead of wrap |
| `wm-switch dataset="bind:..."` for options visible in the design | `dataset="Option A,Option B"` — static options known at design time must use a comma-separated string; `datafield` must be omitted for string datasets (setting it causes silent rendering failure) |
| `wm-icon caption="N"` to show a numeric badge on an icon | `wm-button iconclass="..." badgevalue="N"` — `caption` renders as text beside the icon, not an overlay badge; badge overlays always require `wm-button` with `badgevalue` |
| Treating a monochrome/grayscale screenshot's black as `color.primary.@` (or theming it without asking) | it is brand-LESS — STEP 0 STOPS and asks the user for the brand color first; if they decline, keep foundation defaults, never black-as-brand |
| Copying the screenshot's accent hex into every button/label/icon token as a literal, or deriving tokens from the finished markup | resolve it ONCE in the STEP 0 design plan (a global when it's brand-wide → reference `{color.primary.@.value}`; a component appearance otherwise), then STEP 3 executes the plan — never scan markup for `class`/`variant` pairs |
| Rewriting an already-themed project's global brand because one screen sampled a different accent | do NOT mutate an established global from a single screenshot — reuse the project's globals and resolve the local difference as a component appearance, unless it's a deliberate whole-app rebrand or the user confirms |
| Token/variable mistakes | See `figma-to-design-tokens-mobile` and `variables` skills |
