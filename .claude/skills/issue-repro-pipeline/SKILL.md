---
name: issue-repro-pipeline
description: Runs the full JIRA-issue-to-runnable-repro-project pipeline, strictly step by step, from workflow.md — workspace creation, MemoryLayer reingest, spec/plan (sprintly-okr-generator), OKR, test-cases report (spec-to-testcases), app design (spec-to-app-design), BlankApp template setup, Node version check, codegen config, screenshot-to-code page build, and the final mvn build. Use this whenever the user wants to take a WaveMaker RN issue (bug/enhancement/feature) all the way from "just a ticket" to "a locally buildable project that reproduces it" — e.g. "run the full workflow for WMS-1234", "take this issue through the whole pipeline", "set up a repro project for this ticket", or references the sequence in workflow.md. Do NOT skip, merge, reorder, or silently auto-decide steps that require the user's input (workspace location, assignee, BlankApp/codegen paths) — ask when the step calls for it, then continue in order.
---

# Issue Repro Pipeline

This is the master orchestrator over three already-built skills (`sprintly-okr-generator`, `spec-to-testcases`, `spec-to-app-design`) plus the mechanical setup/build steps around them. It exists so a WaveMaker RN issue goes from "just a ticket" to "a locally built project that actually reproduces it, ready to verify a fix on both Web and Mobile" — in one strictly-ordered run, not an ad hoc sequence improvised per ticket.

**Strict order, no skipping.** Each step below depends on the one before it. Do not jump ahead, do not run two steps out of order, and do not silently decide something the step says to ask the user about. If a step is blocked (missing input, unconfirmed path), stop and ask rather than guessing and continuing.

The three chained skills already carry the mandatory Core Philosophy (scope discipline + proportional depth + WM low-code philosophy) — this pipeline doesn't restate it, it just makes sure each skill actually gets invoked in the right order with the right inputs.

## Step 1 — Get the issue, create the workspace

Get the JIRA ticket ID/details from the user. **Ask where the local workspace for this issue should live** — do not assume or reuse a path from a previous ticket. Create that folder if it doesn't exist. This is the "issue workspace" every later step saves into.

## Step 2 — Mandatory: refresh MemoryLayer grounding

Before any planning happens, make sure the grounding is current:
- Reingest `rn-codegen-mars` and `rn-runtime-mars` against their actual repo locations (check the ingest-registry memory first — skip if the git SHA hasn't changed, per the standing ingest rule; otherwise re-ingest).
- If this investigation surfaces any new architectural understanding (a pattern, a gotcha, a file relationship not already captured), update the `wm-rn` namespace with it before moving on — don't let it live only in this session's context.

This step is mandatory even if it feels redundant — the spec in Step 3 is only as good as the grounding behind it, and stale grounding is exactly what produces a confidently-wrong spec.

## Step 3 — Generate the spec/plan

Invoke `sprintly-okr-generator`. Produce the 16-question spec/plan doc, save it in the issue workspace (not the default `/Users/raajr_500278/raaj-wm/plans/` unless that IS the workspace the user chose in Step 1 — the workspace from Step 1 is now the canonical save location for every artifact in this pipeline).

## Step 4 — Ask assignment, generate the OKR

Ask the user who this should be assigned to (or, if the spec surfaced multiple viable directions/approaches in its Alternatives section, confirm which one to proceed with before drafting the OKR — don't silently pick the "recommended" option without a nod). Then generate the OKR via `sprintly-okr-generator`'s Step 3, saved in the issue workspace.

## Step 5 — Confirm spec/plan + OKR are saved in the workspace

Explicit checkpoint: verify both files actually exist in the issue workspace from Steps 3–4 before proceeding — this is the "plan before OKR, OKR before test cases" ordering the whole pipeline depends on.

## Step 6 — Generate the test-cases report

Invoke `spec-to-testcases` using the spec/plan from Step 3 (and the OKR from Step 4, if useful for cross-checking). This produces the full 7-category report — functional, edge cases, security/hacks/bypass, runtime performance (FPS, jank, memory leaks, render time, multi-render/max-render storms), scale & concurrency, cross-platform matrix, backward compatibility — scoped and proportioned per that skill's own Core Philosophy. Save in the issue workspace.

## Step 7 — Generate the app design

Invoke `spec-to-app-design` using the spec/plan (Step 3) and test-cases report (Step 6). This produces the WaveMaker widget-level Design Plan + Layout Plan — single- or multi-page, reproducing the issue/enhancement/feature and mapping every test case to a page/widget/state (or explicitly marking it not-reproducible-via-UI). Save in the issue workspace.

## Step 8 — Copy the BlankApp template into the workspace

Copy the BlankApp template project into the issue workspace as the base project the fix will be reproduced and verified in. **If the BlankApp template's location isn't already known/confirmed, ask the user for it** rather than guessing a path — this is a project-specific location, not something to hardcode into this skill.

## Step 9 — Check the Node version requirement

`ui-build.js`'s `checkNodeVersion()` hard-requires **Node 22.11.x** (`isSystemHasValidNodeVersion()` checks the range `[22.11.0, 22.12.0)`, re-verified directly from source 2026-07-17 across all copies in expo-preview-scripts-es) — it exits with an error if the running Node version doesn't match. Check the active Node version against this requirement; if it doesn't match, switch to Node 22.11.x (e.g. via `nvm use 22.11.0` or the equivalent version manager) before proceeding. Do not attempt the later build steps on the wrong Node version — `ui-build.js` will simply refuse to run.

## Step 10 — Point the project at local codegen

Update the copied project's `ui-build.js` (the file itself, not a separate config — editing it for local dev is expected and fine, despite its "Studio Managed File, DO NOT EDIT" header) so:
- `baseDir` is set to `/tmp/`.
- `codegenPath` points at the **local rn-codegen-mars build folder** (`<rn-codegen-mars repo>/build/`) instead of downloading a versioned `@wavemaker-ai/rn-codegen` npm package — this is what lets the pipeline test against the actual code under active local development rather than a published package.
- `rnApp` (used as `--rnAppPath` in the codegen transpile command) points at a **locally-generated `@wavemaker-ai/rn-app` package** instead of downloading a versioned npm package. Generate it with the **`generate-rn-app`** skill (`~/.agents/skills/generate-rn-app/SKILL.md`) run against rn-codegen-mars — follow its Step 1 (confirm npm registry), Step 2/2a (production build, picking 2a if iterating on local `custom-widgets-m3` changes), and Step 3 (`generate rn-app`) in order. Point `rnApp` at the resulting `dist/npm-packages/rn-app/` directory. Do this **instead of** relying on the project's pinned `wavemaker.app.runtime.ui.version` in `pom.xml` — that version can be (and has been found) stale/unpublished, in which case downloading `@wavemaker-ai/rn-app` at that pin fails with an npm `ETARGET` error.
- Known gotcha: if `rn-codegen-mars`'s own `package.json` depends on `file:.yalc/@wavemaker-ai/<pkg>` entries, `prepareNpmPackages()` in its `scripts/build.js` copies `./build` to `dist/npm-packages/rn-codegen` but does **not** carry `.yalc/` along — this leaves a dangling `file:` reference that crashes `npm install --package-lock-only` with `ERR_INVALID_ARG_TYPE: paths[1] ... undefined`. Work around it by copying `.yalc/` from the rn-codegen-mars repo root into `dist/npm-packages/rn-codegen/.yalc/` before running the production build (a local-only workaround; do not patch `build.js` itself unless the user explicitly asks for that).

If the exact config file/property names for this project aren't already confirmed, locate them (grep for `codegenPath`/`baseDir`/`rnApp` in the copied project, or ask the user) rather than assuming a path.

## Step 11 — Build the pages via screenshot-to-code

Using the app design from Step 7, invoke `screenshot-to-wavemaker-mobile` (or `figma-to-wavemaker-mobile`) **starting at STEP 2 (Generate Variables)** — per `spec-to-app-design`'s own handoff note, the app design document already IS that skill's Phase 1 analysis / STEP 0 / STEP 1 output, so do not re-run visual analysis on it. This builds the actual page(s) in the copied project inside the issue workspace.

## Step 12 — Run the build

From the issue workspace's copied project, run:

```bash
mvn clean package -Dprofile.props.file="development.properties" -Dmobile.serverUrl="http://NOSERVERREQUIRED.com"
```

This produces the generated project that actually reproduces the issue/enhancement/feature, ready to verify against once the real fix lands — re-run this same build after the fix to confirm it resolves what the spec, test cases, and app design set out to reproduce.

## Recap checklist

- [ ] Issue + workspace location confirmed with the user (Step 1) — not assumed or reused from a prior ticket
- [ ] `rn-codegen-mars`/`rn-runtime-mars` reingested (or confirmed unchanged via ingest-registry), `wm-rn` updated with any new findings (Step 2) — done before the spec, not after
- [ ] Spec/plan generated via `sprintly-okr-generator`, saved in the issue workspace (Step 3)
- [ ] Assignment/direction confirmed with the user before the OKR was drafted (Step 4)
- [ ] Spec/plan + OKR both actually present in the issue workspace (Step 5)
- [ ] Test-cases report generated via `spec-to-testcases` (Step 6)
- [ ] App design generated via `spec-to-app-design` (Step 7)
- [ ] BlankApp template copied into the workspace, with its path confirmed rather than guessed (Step 8)
- [ ] Node version checked against `ui-build.js`'s 22.11.x requirement and switched if needed (Step 9)
- [ ] `codegenPath` → local codegen build folder, `baseDir` → `/tmp/` (Step 10)
- [ ] Pages built via screenshot-to-code, resumed at STEP 2 per the app design's handoff note — not re-analyzed from scratch (Step 11)
- [ ] `mvn clean package` run with the exact flags above, from the issue workspace (Step 12)
