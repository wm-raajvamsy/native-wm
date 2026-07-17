---
name: generate-rn-app
description: Runs `node scripts/build.js generate rn-app` in wavemaker-rn-codegen end-to-end, including the prerequisite fixes that make it fail silently or error out otherwise — correct unquoted yargs invocation, the mandatory `--production` build step, pointing npm at WaveMaker's internal registry so the `@wavemaker-ai/custom-widgets-m3` dependency resolves, and the local-iteration path (build custom-widgets-m3 → `yalc publish` → `yalc add`/`yalc push` into rn-codegen → rebuild → generate rn-app) for when you're actively developing custom-widgets-m3 changes rather than consuming a published version. Use this whenever the user wants to generate the local rn-app package from wavemaker-rn-codegen, hits "nothing is happening" with no output, an ENOENT on `dist/package.web.json`, an ETARGET npm error on `custom-widgets-m3`, or wants their local custom-widgets-m3 changes reflected in the generated rn-app without publishing to the registry. Do NOT skip the diagnostic checks below and jump straight to the final commands — confirm each precondition first so a stale registry config, missing production build, or stale yalc link doesn't silently break the run again.
---

# Generate rn-app

Produces the `@wavemaker-ai/rn-app` npm package (the one containing web + expo `package-lock.json`/`yarn.lock` for a WaveMaker-generated React Native app) from `wavemaker-rn-codegen`. This command has several failure modes that all look different but share one root cause pattern: the script has undocumented prerequisites that aren't obvious from `--help` or its own error output. Verified end-to-end 2026-07-17.

## Core Philosophy

Each of the checks below exists because it silently broke a real run. Don't treat any of them as optional boilerplate — run them in order before the final commands, even if the user says "it worked before" (registry config, local build state, and yalc links can all drift between sessions). Pick **Step 2** when consuming a real published `custom-widgets-m3` version, or **Step 2a** when the point is to verify local/unpublished `custom-widgets-m3` changes — don't default to Step 2 if the user is mid-iteration on that package, it'll silently build against stale published code.

## Step 1 — Confirm npm registry points at WaveMaker's internal repo

`@wavemaker-ai/custom-widgets-m3` is a **private package that does not exist on the public npm registry**. If npm is pointed at the default registry, `npm install --package-lock-only --ignore-scripts` (called internally by `createPackageLock`, `scripts/build.js:17-31`) fails with:

```
npm error code ETARGET
npm error notarget No matching version found for @wavemaker-ai/custom-widgets-m3@<version>.
```

Check first:

```bash
npm config get registry
```

If it isn't `https://repository.wavemaker.com/repository/wavemaker-npm-repo/`, set it:

```bash
npm config set registry=https://repository.wavemaker.com/repository/wavemaker-npm-repo/
```

(This is a global npm config change — mention to the user that it persists across projects on this machine, not just this repo.)

## Step 2 — Run a `--production` build first

`generateRnApp()` (`scripts/build.js:33-72`) copies `./dist/package.web.json` into the generated package (`scripts/build.js:43`). That file is created **only** by `createWebPackageJSON()` (`scripts/build.js:122-129`), which runs **only** inside `prepareNpmPackages()` (`scripts/build.js:131-144`), which is invoked **only** when `build` is run with `--production` (`scripts/build.js:170-172`). A plain `build` (no flag) never creates it, and `generate rn-app` then fails with:

```
Error: ENOENT: no such file or directory, copyfile './dist/package.web.json'
```

From the `wavemaker-rn-codegen` root, run:

```bash
node scripts/build.js build --production --codegenVersion=<codegenVersion> --runtimeVersion=<runtimeVersion>
```

- `--codegenVersion` defaults to `1.0.0-dev` if omitted.
- `--runtimeVersion` has no default in the `build` command — if provided, it's written as the literal dependency version for `custom-widgets-m3`, `app-rn-runtime`, `variables`, and `rn-codegen` in the generated `package.json`s (`scripts/build.js:106-111`). Only pass a version here that is actually published on the registry from Step 1 (e.g. a real `1.0.0-devNNN` build) — otherwise the same ETARGET error resurfaces even with the registry fixed correctly.
- If no such version is published yet and you just need a local dev build, omit `--runtimeVersion` so it falls back to `file:.yalc/@wavemaker-ai/<pkg>` — but that path only resolves if the package has actually been `yalc publish`'d locally and `yalc add`'d into this repo. Check with:
  ```bash
  ls .yalc/@wavemaker-ai/
  ```
  If `custom-widgets-m3` (or whichever package failed) isn't listed, either publish it locally first (see Step 2a below) or use a real registry version instead — don't assume the yalc link exists.

## Step 2a — Alternative: picking up local custom-widgets-m3 changes via yalc

Use this path instead of Step 2's registry version whenever the goal is to see **uncommitted/unpublished local changes to `custom-widgets-m3`** reflected in the generated rn-app — e.g. after editing a widget and wanting to verify it before publishing. Skipping straight to a registry `--runtimeVersion` here would build against the last *published* version and silently ignore local edits.

1. **Build `custom-widgets-m3` locally.** From its repo root (e.g. `/Users/raajr_500278/wavemaker-studio-frontend/custom-widgets-m3`):
   ```bash
   npm run build
   ```
   This runs `generate:page-min` → `tsc` → `build:cjs` → `build:esm` → `post-build.js`, producing the compiled CJS/ESM bundles yalc will publish.

2. **Publish it into the local yalc store:**
   ```bash
   yalc publish
   ```
   This stages the built package into yalc's global store (`~/.yalc`), not yet linked into any consuming project.

3. **Link it into `wavemaker-rn-codegen`.** From the `wavemaker-rn-codegen` root:
   ```bash
   yalc add @wavemaker-ai/custom-widgets-m3
   ```
   This populates/updates `.yalc/@wavemaker-ai/custom-widgets-m3` and adds/updates the `file:.yalc/@wavemaker-ai/custom-widgets-m3` entry in `package.json` (matching what `build.js:107` falls back to when `--runtimeVersion` is omitted). Confirm it landed:
   ```bash
   ls .yalc/@wavemaker-ai/
   ```
   **If you already ran `yalc add` once before and are iterating on further local changes**, re-running Step 1 (`npm run build` in custom-widgets-m3) + `yalc push` (from custom-widgets-m3, instead of `publish`) will push the rebuilt package straight into every project that already `yalc add`'d it — faster than repeating `publish` + `add` each time.

4. **Rebuild rn-codegen without `--runtimeVersion`** so it uses the yalc link instead of trying to resolve a registry version:
   ```bash
   node scripts/build.js build --production --codegenVersion=<codegenVersion>
   ```

5. **Generate rn-app** (Step 3 below, unaffected by which path you took in Step 2/2a):
   ```bash
   node scripts/build.js generate rn-app
   ```

Note: this does not require the registry fix in Step 1 for `custom-widgets-m3` itself (the yalc `file:` link bypasses npm resolution for that one package) — but Step 1 is still needed if any *other* dependency in the build resolves from the registry.

## Step 3 — Run `generate rn-app` with correct (unquoted) argument syntax

`yargs.command('generate rn-app', ...)` (`scripts/build.js:176-186`) registers command name **`generate`** with **`rn-app`** as a positional argument — it is NOT a single two-word command name. If invoked as one quoted shell token, e.g. `node scripts/build.js "generate rn-app"`, yargs sees a single argv string `"generate rn-app"` that matches no registered command. Since `.strict()` is never called, yargs exits silently with **no output and no error** — this is the "nothing is happening" symptom.

Correct invocation — two separate, unquoted arguments:

```bash
node scripts/build.js generate rn-app --runtimeVersion=<runtimeVersion>
```

`--runtimeVersion` here defaults to `1.0.0-dev` if omitted (`scripts/build.js:179-183`) and only affects the generated `dist/npm-packages/rn-app/package.json` version string (`scripts/build.js:61-66`) — it does not need to match a real published version for this step alone (only Step 2's `build` does).

## Expected success output

```
Generating package-lock.json for expo.
Generating yarn.lock for expo.
Generating package-lock.json for web.
```

Output package: `dist/npm-packages/rn-app/` plus a `.tgz` at `dist/npm-packages/<scope-slug>-rn-app-<version>.tgz`.

## Recap checklist

- [ ] `npm config get registry` confirmed as WaveMaker's internal repo (Step 1) — fixed if not, before touching anything else
- [ ] Decided Step 2 (registry version) vs Step 2a (local yalc iteration) based on whether local custom-widgets-m3 changes need to be picked up
- [ ] If Step 2: `build --production` run with a `--runtimeVersion` that matches a real published version
- [ ] If Step 2a: `custom-widgets-m3` rebuilt (`npm run build`), `yalc publish`'d (or `yalc push`'d on subsequent iterations), `yalc add`'d into rn-codegen and confirmed present in `.yalc/@wavemaker-ai/`, then `build --production` run **without** `--runtimeVersion`
- [ ] `dist/package.web.json` exists after Step 2/2a (sanity check before Step 3)
- [ ] `generate rn-app` invoked as two unquoted argv tokens, not one quoted string (Step 3)
- [ ] Success output (`Generating package-lock.json for expo.` / `... yarn.lock for expo.` / `... package-lock.json for web.`) actually seen — silence means the command didn't match, go back to Step 3
