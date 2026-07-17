---
name: generate-rn-app
description: Runs `node scripts/build.js generate rn-app` in wavemaker-rn-codegen end-to-end, including the three prerequisite fixes that make it fail silently or error out otherwise — correct unquoted yargs invocation, the mandatory `--production` build step, and pointing npm at WaveMaker's internal registry so the `@wavemaker-ai/custom-widgets-m3` dependency actually resolves. Use this whenever the user wants to generate the local rn-app package from wavemaker-rn-codegen, hits "nothing is happening" with no output, an ENOENT on `dist/package.web.json`, or an ETARGET npm error on `custom-widgets-m3`. Do NOT skip the diagnostic checks below and jump straight to the final commands — confirm each precondition first so a stale registry config or missing production build doesn't silently break the run again.
---

# Generate rn-app

Produces the `@wavemaker-ai/rn-app` npm package (the one containing web + expo `package-lock.json`/`yarn.lock` for a WaveMaker-generated React Native app) from `wavemaker-rn-codegen`. This command has three independent failure modes that all look different but share one root cause pattern: the script has undocumented prerequisites that aren't obvious from `--help` or its own error output. Verified end-to-end 2026-07-17.

## Core Philosophy

Each of the three checks below exists because it silently broke a real run. Don't treat any of them as optional boilerplate — run all three, in order, before the final commands, even if the user says "it worked before" (registry config and local build state can both drift between sessions).

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
  If `custom-widgets-m3` (or whichever package failed) isn't listed, either publish it locally first or use a real registry version instead — don't assume the yalc link exists.

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
- [ ] `build --production` run successfully, with a `--runtimeVersion` that either matches a real published version or is omitted in favor of a confirmed local yalc link (Step 2)
- [ ] `dist/package.web.json` exists after Step 2 (sanity check before Step 3)
- [ ] `generate rn-app` invoked as two unquoted argv tokens, not one quoted string (Step 3)
- [ ] Success output (`Generating package-lock.json for expo.` / `... yarn.lock for expo.` / `... package-lock.json for web.`) actually seen — silence means the command didn't match, go back to Step 3
