---
name: issue-repro-pipeline
description: Runs the no-MemoryLayer-or-graphify fix-or-build pipeline from workflow.md end to end, generating its own artifacts rather than requiring attachments — Phase 0 ask fix-or-build, Phase 1 local codegen + runtime paths and a brief, Phase 2 workspace folder named for the JIRA id with git init and a commit at every step, Phase 3 codebase study then grill-with-docs, Phase 4 confirmation loop, Phase 5 generate spec + tasks/OKR + skill context + test cases, Phase 6 user verify gate, Phase 7 route to per-task sub-workflows or a direct flow, then the A-H cycle (app design first, implement, shared app + prereqs, transpile web and mobile, review + tests, run and verify step by step, root-cause and close). Use when the user wants a runnable WaveMaker RN repro or feature built from a ticket or a one-line intent, or references workflow.md. Always use skills under this repo's .claude/skills/ — never ~/.agents/skills or any home-dir skill path. Do not use MemoryLayer/graphify — always use or reference local codebase files. Use the direct codegen transpile command, NOT mvn package. Use ONE shared BlankApp for every task. Do not skip, merge, or silently decide steps that require user input (fix-or-build, workspace location, JIRA id, BlankApp path, web/mobile timing, ambiguous task direction).
---

# Issue Repro Pipeline (no MemoryLayer or graphify)

Master orchestrator for `workflow.md` — read that file and follow it; this skill is the short form. Context comes from the **local codebase files** plus what the user tells you. Do not use MemoryLayer or graphify.

**Nothing is pre-generated.** The pipeline starts from *"fix X"* / *"build Y"* and produces its own spec, tasks/OKR, skill context and test cases.

**Local skills only.** Resolve every skill from this repo's `.claude/skills/…`. Never `~/`, `~/.agents/skills/`, `~/.agent/skills/`, or `~/.claude/skills/`.

| Need | Local skill |
| --- | --- |
| This orchestrator | `.claude/skills/issue-repro-pipeline/` |
| Requirement grilling + docs | `.claude/skills/grill-with-docs/` |
| Spec + Tasks / OKR | `.claude/skills/sprintly-okr-generator/` |
| Test cases | `.claude/skills/spec-to-testcases/` |
| App design | `.claude/skills/spec-to-app-design/` |
| Local rn-app package (**mandatory** before generating) | `.claude/skills/generate-rn-app/` |
| Generate web + mobile previews | `.claude/skills/build-web-mobile-previews/` |

`native_mobile/` and `common/` are **reference trees with no `SKILL.md`** — read the file you need, don't invoke them:

- Screenshot → markup: `.claude/skills/native_mobile/ui/screenshot-to-wavemaker/screenshot-to-wavemaker-mobile.md`
- Figma → markup: `.claude/skills/native_mobile/ui/figma-to-wavemaker/figma-to-wavemaker-mobile.md`
- Widget vocabulary: `.claude/skills/native_mobile/ui/shared/references/widget-detection.md`, `…/components-list.md`
- WM UI helpers: `.claude/skills/common/ui/`

**Strict order.** Don't jump ahead. If blocked, ask.

---

## Part 1 — Discovery

1. **Phase 0 — Ask first: fix something or build something?** Then classify Bug / Feature / Enhancement.
2. **Phase 1 — Repo context.** Local codegen path, local runtime path, and a brief. Verify the paths exist.
3. **Phase 2 — Workspace + git.** Ask for the workspace location and the **JIRA id** (never guess either). Create `<workspacePath>/<REQUIREMENT-ID>/` with `00-context/ 01-artifacts/ 02-design/ 03-subworkflows/ 04-app/ 05-logs/ README.md`, `git init`, first commit. **Commit at every step from here on**, message `<REQUIREMENT-ID>: <phase> — <what changed>`.
4. **Phase 3 — Codebase study, then grill.** Read the local codebase against the requirement → `00-context/codebase-notes.md` with `file:line` refs and reuse candidates. Then run `grill-with-docs`; save to `00-context/grill.md` with ADRs + glossary.
5. **Phase 4 — Confirmation loop.** Digest back: understood scope, non-goals, open questions, risks, suggestions, proposed cuts. Ask *"anything missed, any improvements or suggestions?"* and fold answers into the grill doc in place. Repeat until the user says it's complete.
6. **Phase 5 — Generate the four artifacts** into `01-artifacts/` — `spec.md`, `okr.md` (with the mandatory *check unit tests* and *run and verify* sub-tasks), `skill-context.md`, `test-cases.md`. Quick overall plans, not essays.
7. **Phase 6 — User check & verify gate.** Stop. The user reads and confirms the four files. No execution without an explicit go-ahead.

## Part 2 — Execution

**Phase 7 — Route.** Recommend one, with a reason; the user can override.

- **Sub-task workflow** — the A–H cycle once per task, closing each before the next. Write `03-subworkflows/<task>/`.
- **Direct flow** — the same A–H cycle once for the whole task list. Nothing is skipped for being the direct route.

### The A–H cycle

**A — Task context + mini artifacts.** Re-read only the code this task touches; produce a scoped spec/OKR/skill-context/test-cases as the implementation plan.

**B — App design FIRST.** It's common to web and mobile, so it precedes implementation. `.claude/skills/spec-to-app-design/` → `02-design/`. **One design for the whole requirement** — later tasks extend it, never start a second one. Author it in widget terms for `screenshot-to-wavemaker` **STEP 2**. Map every test case to a page/widget/state.

**C — Implement.** Strict rules, always: **minimal code · no duplicate logic · reuse existing code · plan the change properly · comments only on important functions or variables, one-liners.** No unrelated refactors.

**D — Shared app + prerequisites.**
- **ONE workspace BlankApp for the entire flow**, under `04-app/`, with one `generated-web/` and one `generated-mobile/`. **Never a second BlankApp per task** — later tasks add pages to the same `src/main/webapp`.
- Ask: *"check both web and mobile now, or web now and mobile at the end?"*
- **Node 22.11.x** — check manually; the direct transpile path bypasses `ui-build.js`, so its `checkNodeVersion()` never runs.
- **`generate-rn-app` is mandatory** → `<LOCAL_CODEGEN>/dist/npm-packages/rn-app/`. Never a registry download. Silence from `generate rn-app` means it didn't run.
- **Per-task re-checks:** codegen rebuilt after this task's edits? **rn-app regenerated after that rebuild** (it's built *from* codegen — otherwise transpile eats a stale package)? local runtime still consumed? generated folders present, and from when?
- **No `ui-build.js` edits** — those paths are command-line arguments now.

**E — Pages, then transpile twice.**
1. Build pages from the B design by following `native_mobile/ui/screenshot-to-wavemaker/screenshot-to-wavemaker-mobile.md` (or the figma equivalent) **from its `STEP 2: Generate Variables` heading onward**, into the shared `src/main/webapp`.
2. **Check the generated folders**, and `rm -rf` the one you're about to write if pages/codegen/runtime changed since it was last generated.
3. Generate each target — **this replaces `mvn clean package`**:

   ```bash
   node <LOCAL_CODEGEN>/build/index.js transpile --profile="<PROFILE>" --page="" --rnAppPath="<LOCAL_CODEGEN>/dist/npm-packages/rn-app/" <PROJECT>/src/main/webapp <GENERATED_PATH>
   ```

   | Target | `--profile` | `<GENERATED_PATH>` |
   | --- | --- | --- |
   | Web | `expo-web-preview` | `<PROJECT>/generated-web` |
   | Mobile | `expo-preview` | `<PROJECT>/generated-mobile` |

   The output path is an argument, so each profile writes to its own folder — **no rename, no `target/`**. Maven's only job was running `ui-build.js`, which ends in exactly this command (`BlankApp/ui-build.js:316-323`); `applyPatchIfAvailable()` is a no-op unless the profile is `default` (`:249-252`).
4. **Check the generated folders after** — fresh timestamps, and the change actually present in the generated source.

**F — Review + tests.** Review the diff against the A artifacts; write/update unit tests and get them green; grow `test-cases.md` if new runtime cases surfaced.

**G — Run & verify, step by step.**
- Web: `cd <PROJECT>/generated-web && npm install && npx expo start --web`, plus `node scripts/service-proxy.js --previewUrl <host> --proxyPort 19009 --webPreviewPort 8081`
- Mobile: `cd <PROJECT>/generated-mobile && npm i && npx expo run:android` (or `run:ios`), driven and inspected via `adb`
- Split the flow into named sub-verifications, one at a time, evidence per step into `05-logs/`. **Never verify a whole flow in one shot.**

**H — Errors → root cause → close.** Validate the hypothesis with evidence (no assumptions) → fix in the generated folder first and confirm it works → port the real fix to codegen/runtime → re-run D's re-checks (rebuild codegen **and** re-run `generate-rn-app`), wipe and re-transpile, re-verify → user confirms → mark the task closed in `README.md`.

---

## Recap checklist

- [ ] Phase 0 asked (fix or build) and classified; Phase 1 paths verified
- [ ] Workspace `<REQUIREMENT-ID>/` created, `git init`, **a commit at every step**
- [ ] Codebase notes + grill doc written; confirmation loop closed with the user
- [ ] Four artifacts generated into `01-artifacts/`; user verified them before execution
- [ ] Route chosen with a reason and recorded
- [ ] **App design done first**, one design shared by web + mobile and by all tasks
- [ ] Implementation followed the strict rules
- [ ] **One shared BlankApp** for the whole flow; `generate-rn-app` run and re-run after codegen changes
- [ ] Generated via **direct transpile** — `expo-web-preview` → `generated-web`, `expo-preview` → `generated-mobile`; no `mvn`, no rename, no `ui-build.js` edits
- [ ] Generated folders checked before **and** after each generate
- [ ] Unit tests green; step-by-step verification with evidence in `05-logs/`
- [ ] Every failure root-caused with validated evidence; task closed with user confirmation
- [ ] No MemoryLayer or graphify; every skill path `.claude/skills/...`
