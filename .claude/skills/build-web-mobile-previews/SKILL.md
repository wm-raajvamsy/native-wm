---
name: build-web-mobile-previews
description: Generates the web preview and the mobile preview from ONE shared WaveMaker workspace project by calling the codegen `transpile` command directly — twice, once per profile, writing straight into `generated-web` and `generated-mobile`. No maven, no `ui-build.js` edits, no `generated-rn-app` rename: the output path is an argument, so each profile writes to its own folder. Covers the mandatory prerequisite people skip (running the `generate-rn-app` skill to produce a LOCAL `@wavemaker-ai/rn-app`, and regenerating it after any codegen change), the single-shared-project rule (the same BlankApp and the same generated folders are reused by every task and sub-task for the whole flow), and the staleness checks on the generated folders that catch a "my fix isn't showing up" run. Use this whenever the user wants a web preview, a mobile/expo preview, or both from a workspace app, says "generate the web and mobile apps", "build the preview", "transpile the app", or reports that a change is not appearing in a preview. Do NOT use `mvn clean package` for this — the direct transpile command replaces it. Do NOT create a second BlankApp per task, and do NOT trust a generated folder you have not just regenerated or timestamp-checked.
---

# Generate web + mobile previews (direct codegen transpile)

One shared project produces **two** previews. They are the **same codegen transpile run twice** with a different `--profile`, each writing into its own output folder.

## The command

```bash
node <LOCAL_CODEGEN>/build/index.js transpile --profile="<PROFILE>" --page="" --rnAppPath="<LOCAL_RN_APP>" <PROJECT>/src/main/webapp <GENERATED_PATH>
```

| Placeholder | Value |
| --- | --- |
| `<LOCAL_CODEGEN>/build/` | the local codegen **build** output |
| `<PROFILE>` | `expo-web-preview` (web) or `expo-preview` (mobile) |
| `<LOCAL_RN_APP>` | `<LOCAL_CODEGEN>/dist/npm-packages/rn-app/` — from the `generate-rn-app` skill, never a registry download |
| `<PROJECT>` | the **one shared** workspace BlankApp project, same for every task and sub-task |
| `<GENERATED_PATH>` | `<PROJECT>/generated-web` or `<PROJECT>/generated-mobile` |

| Target | `--profile` | `<GENERATED_PATH>` |
| --- | --- | --- |
| Web preview | `expo-web-preview` | `<PROJECT>/generated-web` |
| Mobile preview | `expo-preview` | `<PROJECT>/generated-mobile` |

Because the output folder is an **argument**, each profile writes to its own destination. Nothing collides, so there is **no rename step** and no `target/` to clean up.

## Why this replaces `mvn clean package`

The maven build's only job here was to run `ui-build.js`, whose `init()` ends in exactly this command (`BlankApp/ui-build.js:316-323`) with `appTarget` as the last argument. Calling transpile directly skips the wrapper and lets you set the output path per profile. Nothing is lost for these two profiles:

- `applyPatchIfAvailable()` (`:249-252`) returns immediately unless `targetPlatform === 'default'` — a **no-op** for `expo-web-preview` and `expo-preview`.
- `generateDesignTokens()` (`:308-312`) only runs under the separate `--generateOverrideCSS` opt-in path.

Two consequences of the bypass, worth knowing:

- `ui-build.js`'s `checkNodeVersion()` (`:125`) no longer fires. **Node 22.11.x is still the supported version** — check `node -v` yourself.
- The `baseDir` / `codegenPath` / `rnApp` overrides inside `ui-build.js` are no longer needed at all. You pass those paths on the command line instead. Don't edit `ui-build.js` for this.

Optional: `ui-build.js` invokes node with `--max-old-space-size=256`. Add it if you hit memory pressure on a large app:

```bash
node --max-old-space-size=256 <LOCAL_CODEGEN>/build/index.js transpile …
```

## Step 0 — One shared project, for the whole flow

There is **one** workspace BlankApp project and **one** pair of generated folders, reused by every task and sub-task from start to finish:

```
<PROJECT>/
  src/main/webapp/     # the app — all tasks' pages live here
  generated-web/       # profile expo-web-preview
  generated-mobile/    # profile expo-preview
```

Never create a second BlankApp for a later task. A task adds or edits pages inside the same `src/main/webapp`, then regenerates.

## Step 1 — Prerequisite: local rn-app (MANDATORY)

Run `.claude/skills/generate-rn-app/` against **LOCAL_CODEGEN** and use its output:

```
<LOCAL_CODEGEN>/dist/npm-packages/rn-app/
```

Confirm the directory exists. If `generate rn-app` printed nothing, it did not run — go back to that skill's Step 3.

**Regenerate it after any codegen change.** The rn-app package is built *from* codegen, so a codegen edit leaves the previously generated rn-app stale — and the transpile will happily consume the stale one.

Also confirm the codegen build itself exists at `<LOCAL_CODEGEN>/build/`, and that it consumes **LOCAL_RUNTIME** when the task has runtime changes (yalc / local dependency path, per `generate-rn-app`) — otherwise the runtime change is not in the build at all.

Known gotcha: if codegen `package.json` has `file:.yalc/@wavemaker-ai/...` deps, copy `.yalc/` into `dist/npm-packages/rn-codegen/.yalc/` before the production install if `prepareNpmPackages()` didn't.

## Step 2 — Check the generated folders before you generate

Because both folders persist across tasks, **inspect them first** — do not assume they reflect the current source:

```bash
ls -d <PROJECT>/generated-web <PROJECT>/generated-mobile 2>/dev/null
```

- **Neither exists** → first run; generate both.
- **They exist** → they are from an earlier task or an earlier attempt. Decide deliberately:
  - `rm -rf <GENERATED_PATH>` first whenever pages, codegen, or runtime changed since the last generate. A clean regenerate is the only way to be sure you are not reading a stale mix.
  - Regenerate in place only for a repeat run with nothing changed underneath.

## Step 3 — Generate the web preview

```bash
node <LOCAL_CODEGEN>/build/index.js transpile --profile="expo-web-preview" --page="" --rnAppPath="<LOCAL_CODEGEN>/dist/npm-packages/rn-app/" <PROJECT>/src/main/webapp <PROJECT>/generated-web
```

## Step 4 — Generate the mobile preview

```bash
node <LOCAL_CODEGEN>/build/index.js transpile --profile="expo-preview" --page="" --rnAppPath="<LOCAL_CODEGEN>/dist/npm-packages/rn-app/" <PROJECT>/src/main/webapp <PROJECT>/generated-mobile
```

Order does not matter and neither pass affects the other — but if the user only wants one target now, generate that one and leave the other; there is no shared mutable state between them.

`--page=""` transpiles every page. Pass a page name to narrow a re-generate to one page during a tight fix loop.

## Step 5 — Check the generated folders after you generate

- Both requested folders exist and were **modified just now** — a folder with an old timestamp means the command didn't write where you thought:
  ```bash
  ls -ld <PROJECT>/generated-web <PROJECT>/generated-mobile
  ```
- The change you just made is actually present in the output (grep the generated source for the widget/page/prop you touched). This is the check that catches a stale rn-app or a codegen build that was never rebuilt.
- The output matches the profile you asked for before you run it.

**"My fix isn't showing up" checklist, in order:** codegen rebuilt? → `generate-rn-app` re-run after that rebuild? → generated folder wiped before regenerating? → correct `--profile` and `<GENERATED_PATH>`?

## Downstream

- **Web:** `cd <PROJECT>/generated-web && npm install && npx expo start --web`, plus the service proxy:
  ```bash
  node scripts/service-proxy.js --previewUrl http://your-preview-host --proxyPort 19009 --webPreviewPort 8081
  ```
- **Mobile:** `cd <PROJECT>/generated-mobile && npm i && npx expo run:android` (or `npx expo run:ios`).

## Recap checklist

- [ ] One shared workspace project reused for every task — no second BlankApp
- [ ] `generate-rn-app` run; `<LOCAL_CODEGEN>/dist/npm-packages/rn-app/` exists (never a registry download)
- [ ] rn-app **regenerated** if codegen changed since it was last built
- [ ] `<LOCAL_CODEGEN>/build/` exists; local runtime consumed if the task has runtime changes
- [ ] `node -v` is 22.11.x (checked manually — `ui-build.js`'s check does not run on this path)
- [ ] Generated folders inspected **before** generating; wiped if anything underneath changed
- [ ] Web: transpile with `--profile="expo-web-preview"` → `<PROJECT>/generated-web`
- [ ] Mobile: transpile with `--profile="expo-preview"` → `<PROJECT>/generated-mobile`
- [ ] Generated folders re-checked **after**: fresh timestamps, and the actual change present in the output
- [ ] No `mvn`, no `ui-build.js` edits, no rename, no `target/` in this flow
