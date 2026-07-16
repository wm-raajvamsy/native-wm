---
name: login-widget
description: >
  LOAD THIS WHEN THE SCREEN IS A LOGIN / SIGN-IN PAGE. Complete wm-login reference: the mandatory outer
  wrapper for login pages. Covers the critical naming rule (the wm-login widget MUST be named `loginForm`),
  codegen auto-wiring (isLogin, onLogin, submit-action — never hand-write these), the full markup structure
  (wm-login > wm-form, fields in a body container, form-action in an actions container), valid props
  (mobile vs web — showerror is internal, errormessage is web-only, width/height/margin come from
  wm.layouts.login), the WIDTH DECISION RULE for every layout (full-width vs card vs split-field), and
  login token styling via a `login` variant (under `appearances`, applied with `class="login-<variant>"`):
  error banner + form-container padding, where form.padding defaults to a large 36px and MUST be
  re-measured from the design every time.
---

# wm-login Widget Reference

## What It Does

`wm-login` is the mandatory outer wrapper for login / sign-in pages. It:
- Renders an inline error banner automatically when authentication fails (always on; no markup needed)
- Wraps the inner `wm-form` in a padded form container (see Styling — the 36px default inset)
- Auto-wires the submit `wm-form-action` to the login flow at codegen time

Use `wm-login` for any username/password / sign-in screen. Do **not** use a bare `wm-form` for a login page.

---

## ⚠️ Critical Naming Rule

**The `wm-login` widget MUST be named exactly `loginForm`.** Codegen rewrites the submit action to the literal `Widgets.loginForm.doLogin(...)` (the widget name is hardcoded, not derived). If the `wm-login` has any other name, the auto-wired login call resolves to nothing and login silently does not work.

- `wm-login` → `name="loginForm"` (required, exact)
- the inner `wm-form` → any **different** name (e.g. `name="loginFormInner"`)

---

## Codegen Auto-Wiring (never hand-write these)

At codegen the login transformer automatically:
1. Sets `isLogin="true"` on the inner `wm-form` — this disables the normal form-model write-back; login manages its own `formData`.
2. Rewrites every `type="submit"` `wm-form-action`'s `action` to `Widgets.loginForm.doLogin(fragment.Widgets.<innerFormName>.dataoutput)`.
3. Injects `onLogin={(formData, success, error) => fragment.Actions.loginAction.invoke({formData}, success, error)}`.

Therefore, in markup you must **never** write: `action=` on the submit button, `isLogin`, or `onLogin`. They are generated for you. `showerror` is also internal — do not write it.

---

## Props

| Prop | Default | Notes |
|---|---|---|
| `name` | — | **Required. Must be `loginForm`** (see Critical Naming Rule). |
| `width` | hug | Inherited from `wm.layouts.login`. `wm-login` does NOT auto-stretch — set this per the design (see Sizing). |
| `height` | hug | Inherited from `wm.layouts.login`. |
| `margin` | — | Inherited from `wm.layouts.login`. |
| `show` | `true` | Inherited (`wm.base`). Bindable. |
| `class` | — | Inherited (`wm.base`). |
| `accessroles` | `EVERYONE` | Inherited (`wm.base`). |
| `showindevice` | `all` | Inherited (`wm.base`). |

**Not valid / not used in markup:**
- `onLogin`, `isLogin`, the submit `action` — all codegen-injected (see above).
- `showerror` — internal; error display is always on.
- `variant` attribute — not needed; the login appearance is applied via `class="login-<variant>"` (see Styling).
- `errormessage` — **web-only**; it does not exist on native mobile.

**Allowed children:** `wm-form` (the login form), and optionally `wm-composite` / `wm-button`.

---

## Sizing & Width (decision rule — covers every layout)

`wm-login` and the leaf widgets inside it (`wm-form-field`, the submit `wm-form-action`, any full-width `wm-button`) are **leaf widgets: they do NOT auto-stretch**. Only containers stretch via `width="fill"`. So you must set an explicit width on each leaf to match the design. Choose by what the design shows:

| What the design shows | Width to set |
|---|---|
| Element spans the full available width | `width="100%"` |
| Fixed pixel size | `width="Npx"` |
| Side-by-side / proportional (e.g. first + last name) | `width="N%"` |
| Natural content size (short text link, icon-only button) | omit (hugs content) |

Apply the same rule to `wm-login` itself:

**Full-width login (typical mobile) — all THREE are REQUIRED together:**
1. `wm-login` → `width="100%"`
2. every leaf item (fields, submit CTA, full-width buttons) → `width="100%"`
3. the `login` variant's `form.padding` → `{space.0.value}` — removes the default 36px inset so the form spans edge-to-edge

Missing any one leaves the form looking narrow or inset. Items 1–2 are markup; item 3 is **mandatory and only achievable through the `login` token variant** — no markup attribute (no container `padding`) removes the inset.

- **Centered card login** (constrained width, common on tablet/landscape) → give `wm-login` the measured `width` (e.g. `width="360px"` or a `%`) and center it via the parent container's `alignment`; fields stay `width="100%"` inside the card; set the `login` variant's `form.padding` to the card's measured inset.
- **Split fields** → wrap the pair in a `<wm-container direction="row">` and give each `wm-form-field` a `width="N%"` matching the design.

Never use `width="fill"` / `height="hug"` on these leaf widgets — those are container-only values.

---

## Field labels & `captionposition`

`captionposition` on the inner `wm-form` is **design-driven — do not apply it by default.** Set it only when the design shows visible field labels, choosing the value that matches:
- `floating` — label sits inside the field and animates up into the border on focus
- `top` — label rendered above the field
- `left` — label to the left of the field

If the fields are **placeholder-only** (no separate visible label, just greyed hint text), **omit `captionposition`** and rely on `placeholder`. Match what the screenshot actually shows.

---

## Correct Markup Structure

Full-width login (most common). Note `name="loginForm"` on `wm-login`, a different name on the inner form, and explicit widths:

```xml
<wm-login name="loginForm" class="login-main" width="100%">
  <wm-form name="loginFormInner" itemsperrow="xs-1 sm-1 md-1 lg-1" variant="plain" class="form-plain">
    <!-- Body container: fields + any inline elements (e.g. forgot password) -->
    <wm-container name="login_fields" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="hug">
      <wm-form-field name="j_username" key="j_username" displayname="Username" widget="text"
        required="true" placeholder="Username" variant="field-default" class="form-controls-field-default" width="100%"></wm-form-field>
      <wm-form-field name="j_password" key="j_password" displayname="Password" widget="password"
        required="true" placeholder="Password" variant="field-default" class="form-controls-field-default" width="100%"></wm-form-field>
      <wm-container name="forgot_row" class="app-default-container" direction="row" gap="0" alignment="top-right" width="fill" height="hug">
        <wm-label name="forgot_link" caption="Forgot Password?" class="label-link-accent" variant="link-accent"></wm-label>
      </wm-container>
    </wm-container>
    <!-- Actions container: separate sibling of the body container -->
    <wm-container name="login_actions" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
      <wm-form-action name="loginBtn" display-name="Log In" type="submit" update-mode="true"
        class="btn-cta" width="100%"></wm-form-action>
    </wm-container>
  </wm-form>
</wm-login>
```

**Rules:**
- `wm-login` is named `loginForm`; the inner `wm-form` has a different name.
- `wm-form` has exactly two direct `wm-container` children: a body container (all `wm-form-field`s) and an actions container (all `wm-form-action`s).
- `wm-form-field` goes **directly** inside the body container — never wrap a single field in its own container. Only use a nested container for non-field elements (the forgot-password link, etc.) between/after fields.
- The login fields are keyed `j_username` / `j_password` (the auth flow posts the field names as credentials).
- Right-align the forgot-password row with `gap="0" alignment="top-right"` (or `middle-right`). With a **numeric** `gap`, the alignment must be one of the nine fixed `{top|middle|bottom}-{left|center|right}` values; the space-between keywords `start`/`center`/`end` resolve only under `gap="auto"` and silently fall back to `top-left` with a numeric gap (the link would then render left-aligned).
- The submit button uses `class` only (a `btn-*` token class) — `wm-form-action` does not take `variant`.
- Apply the login appearance with `class="login-<variant>"` on `wm-login`.
- Set `captionposition` only if the design shows labels (see above).
- Set widths on `wm-login`, fields, and the CTA per the design (Sizing rule).

### Hybrid Login Page Pattern

Most login screens mix the form with non-form elements (logo, heading, SSO, dividers). Those go **outside** `wm-login` as siblings:

```xml
<wm-container name="page_wrap" class="app-default-container" direction="column" gap="32" alignment="top-center" width="fill" height="fill" padding="24">

  <!-- Non-form: logo / heading (outside wm-login) -->
  <wm-container name="header_section" class="app-default-container" direction="column" gap="8" alignment="top-center" width="fill" height="hug">
    <wm-picture name="app_logo" picturesource="..." width="120px" height="48px" variant="logo"></wm-picture>
    <wm-label name="heading" caption="Log in" class="label-heading-display" variant="heading-display"></wm-label>
  </wm-container>

  <!-- Login form -->
  <wm-login name="loginForm" class="login-main" width="100%">
    <wm-form name="loginFormInner" itemsperrow="xs-1 sm-1 md-1 lg-1" variant="plain" class="form-plain">
      <wm-container name="login_fields" class="app-default-container" direction="column" gap="16" alignment="top-left" width="fill" height="hug">
        <wm-form-field name="j_username" key="j_username" displayname="Username" widget="text" required="true" placeholder="Username" variant="field-default" class="form-controls-field-default" width="100%"></wm-form-field>
        <wm-form-field name="j_password" key="j_password" displayname="Password" widget="password" required="true" placeholder="Password" variant="field-default" class="form-controls-field-default" width="100%"></wm-form-field>
      </wm-container>
      <wm-container name="login_actions" class="app-default-container" direction="column" gap="0" alignment="top-left" width="fill" height="hug">
        <wm-form-action name="loginBtn" display-name="Log In" type="submit" update-mode="true" class="btn-cta" width="100%"></wm-form-action>
      </wm-container>
    </wm-form>
  </wm-login>

  <!-- Non-form: OR divider + SSO (outside wm-login) -->
  <wm-container name="footer_section" class="app-default-container" direction="column" gap="16" alignment="top-center" width="fill" height="hug">
    <wm-container name="or_row" class="app-default-container" direction="row" gap="12" alignment="middle-center" width="fill" height="hug">
      <wm-container name="divider_left" class="container-rule-hairline" variant="rule-hairline" direction="row" gap="0" alignment="top-left" width="fill" height="1px"></wm-container>
      <wm-label name="or_label" caption="OR" class="label-caption-muted" variant="caption-muted"></wm-label>
      <wm-container name="divider_right" class="container-rule-hairline" variant="rule-hairline" direction="row" gap="0" alignment="top-left" width="fill" height="1px"></wm-container>
    </wm-container>
    <wm-button name="google_btn" caption="Continue with Google" iconclass="fa fa-google" class="btn-social" variant="social" width="100%"></wm-button>
  </wm-container>

</wm-container>
```

---

## Styling — create a `login` variant

`wm-login` is styled by creating a **variant under `appearances`** in the `login` token and applying it with `class="login-<variant>"` on the `wm-login` widget. (The foundation defaults live in the base `mapping`; your overrides go in the variant — never edit the base `mapping`.)

A `login` variant controls two things: the **form-container padding** and the **error banner**. (The inner form, fields, and submit button are styled by their own token files — see Division of Labor.)

Apply it in markup:
```xml
<wm-login name="loginForm" class="login-main" width="100%"> … </wm-login>
```

The simplified payload passed to `saveComponentTokens` is `{ "<component>": { "<variant>": { …overrides… } } }`. Include only keys whose values differ from the foundation default. **Write each override key exactly as it appears in the component's base mapping: hyphenated names (`font-size`, `min-height`, `background-color`) are single keys — keep the hyphen. A `.` is a nesting separator, used ONLY where the base mapping truly nests (`border.color`, `border.width`, `icon.size`, `text.decoration`, `states.active.*`). Writing `font.size` or `min.height` instead builds a non-existent nested object and is rejected.**

### Form-container padding (ALWAYS set — measure from the screenshot)

The login form ships with a **36px** (`{space.9.value}`) all-sides inset by default. **36px is large and rarely matches a design**, so you must **always** set the variant's `form.padding` to the padding measured from the screenshot — never leave the default. The inset can ONLY be changed through this token (no markup/container `padding` removes it). For a full-width / edge-to-edge form the value is `{space.0.value}`. Map the measured pixels to the nearest space token (global-token-first):

| Measured inset | Token | | Measured inset | Token |
|---|---|---|---|---|
| 0 (edge-to-edge) | `{space.0.value}` | | 24 | `{space.6.value}` |
| ~8 | `{space.2.value}` | | ~32 | `{space.8.value}` |
| ~12 | `{space.3.value}` | | ~36 (default) | `{space.9.value}` |
| ~16 | `{space.4.value}` | | ~40 | `{space.10.value}` |

Minimal variant — only padding differs from defaults (the common case):
```json
{ "login": { "main": { "form": { "padding": "{space.0.value}" } } } }
```

### Error banner (add only if the design shows a custom error style)

Defaults: text color `{color.on-error.@.value}`, background `{color.error.@.value}`, border color `{color.error.@.value}`, border radius `{radius.sm.value}` (8px). Add only the leaves that differ from the design:
```json
{ "login": { "main": { "error": { "background": { "color": "#FFF0F0ff" } } } } }
```

### Resulting saved token file

The variant is saved under the `login` root key's `appearances`, with a `meta.appearances` entry:
```json
{
  "login": {
    "appearances": {
      "main": {
        "mapping": {
          "error": {
            "text":       { "color": { "value": "{color.on-error.@.value}" } },
            "background":  { "color": { "value": "{color.error.@.value}" } },
            "border": {
              "color":  { "value": "{color.error.@.value}" },
              "radius": { "value": "{radius.sm.value}" }
            }
          },
          "form": { "padding": { "value": "{space.0.value}" } }
        }
      }
    },
    "meta": { "appearances": { "main": { "source": "user" } } }
  }
}
```

---

## Division of Labor (which token file styles what)

| Element | Token file (root key) | Styling mechanism |
|---|---|---|
| `wm-login` chrome (error banner + form padding) | `login.json` (`login`) | variant under `appearances` + `class="login-<variant>"` |
| Inner `wm-form` shell (background, header, body, footer) | `form-wrapper.json` (`form`) | variant + `class="form-<variant>"` |
| `wm-form-field` inputs | `form-controls.json` (`form-controls`) | variant + `class` (mandatory; all field styling lives in a variant) |
| Submit `wm-form-action` (CTA) | `button.json` (`btn`) | `class="btn-<variant>"` only — no `variant` attr |
| Labels / links (forgot, footer) | `label.json` (`label`) | variant + `class` |

**Token paths for login elements** (using web-CSS names instead of these is the #1 cause of rejected login tokens — each path must exist in the component's base mapping). Emit only keys that differ from the foundation default; full per-component shapes live in `token-schema`:
- **Buttons** (sign-in / SSO CTAs — root key `btn`): the fill is the **flat top-level `background`** key — NOT `background-color` (that is the `label`/chip key) and NOT `background.color` (that is the `container` key); either wrong key is silently dropped and the button keeps its default fill. Corner radius is the **top-level `radius`** (NOT `border.radius`); size is **`min-width`** (NOT `width` — for a full-width button set the markup `width="100%"`); typography is **FLAT** `font-size` / `font-weight` (NO `font` object).
- **Labels** (titles, subtitles, links, "or" text): typography is **FLAT** `font-size` / `font-weight` / `font-family` (NO `font` object); background is `background-color`.
- **Icons / logos**: size via **`font-size`** (NOT `size`, `icon-size`, or `icon.size`).
- **Input fields** (root key `form-controls`): typography is **NESTED** — `font.size`, and the field label as `label.font.size` (NEVER flat `font-size` / `label.font-size`); the input itself is the root (`background`, `color`, `border.*`, `padding`); `border.radius` is nested. Full shape: `form-tokens`.

---

## Events

| Event | Notes |
|---|---|
| `on-success` | Authorable — fires on successful authentication. |
| `on-error` | Authorable — fires on failed authentication. |
| `on-submit` | Authorable — fires on form submit. |
| `on-login` | **Internal** — wired by codegen; do not author. |

No authorable methods. (`doLogin` is invoked by the auto-wired submit action.)

---

## Checklist

- [ ] `wm-login` named exactly `loginForm`; inner `wm-form` has a different name
- [ ] No manual `action=` / `onLogin` / `isLogin` / `showerror` in markup
- [ ] Widths set per the design on `wm-login`, fields, and the CTA (100% / Npx / N% / hug)
- [ ] `captionposition` set only when the design shows labels (else omitted)
- [ ] A `login` variant is created and applied via `class="login-<variant>"` on `wm-login`
- [ ] The variant's `form.padding` set to the **measured** inset (not left at the 36px default; `{space.0.value}` for full-width/edge-to-edge)
- [ ] Full-width login uses the required bundle: `wm-login` 100% + items 100% + `form.padding` `{space.0.value}`
- [ ] Error banner overridden only if the design differs from the defaults
- [ ] Fields keyed `j_username` / `j_password`
- [ ] Submit `wm-form-action` styled via `class` only (no `variant`)
