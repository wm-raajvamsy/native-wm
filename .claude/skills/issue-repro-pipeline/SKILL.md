---
name: issue-repro-pipeline
description: Runs the no-MemoryLayer-or-graphify issue→repro pipeline from workflow.md — confirm attached spec/tasks/skill-context/test-cases plus local codegen and local runtime, create an issue workspace, derive a per-task sub-workflow with only the steps that task needs, then execute (app design, BlankApp, Node 22.11.x, local codegen/runtime wire via generate-rn-app, screenshot-to-code from STEP 2, mvn package, QA). Use when the user has those attachments and wants a runnable WaveMaker RN repro, or references workflow.md. Always use skills under this repo's .claude/skills/ — never ~/.agents/skills or any home-dir skill path. Do not use MemoryLayer/graphify — always use or reference local codebase files. Do not skip, merge, or silently decide steps that require user input (workspace location, BlankApp path, ambiguous task direction).
---

# Issue Repro Pipeline (no MemoryLayer or graphify)

Master orchestrator for `workflow.md`. Context comes from **attachments** + **local codegen/runtime paths**. Do not use MemoryLayer or graphify — always use or reference local codebase files.

**Local skills only.** Resolve every skill from this repo’s `.claude/skills/…`. Never `~/`, `~/.agents/skills/`, `~/.agent/skills/`, or `~/.claude/skills/`.

| Need | Local skill |
| --- | --- |
| This orchestrator | `.claude/skills/issue-repro-pipeline/` |
| App design | `.claude/skills/spec-to-app-design/` |
| Test cases (only if user asks to regenerate) | `.claude/skills/spec-to-testcases/` |
| Spec/OKR (only if user asks to regenerate) | `.claude/skills/sprintly-okr-generator/` |
| Local rn-app package | `.claude/skills/generate-rn-app/` |
| Widget vocabulary | `.claude/skills/native_mobile/` |
| WM UI helpers | `.claude/skills/common/` |

Screenshot/Figma → markup: use project Cursor skills (`screenshot-to-wavemaker`, `figma-to-wavemaker`, …), not home-dir copies.

**Strict order within a chosen path.** Do not jump ahead or invent missing attachments. If blocked, ask.

---

## Step 1 — Confirm attachments + workspace

Require all of:

1. Spec
2. Tasks / OKR (TODO + QA)
3. Skill context (complete issue context)
4. Test cases
5. Local codegen path
6. Local runtime path

Ask for the **issue workspace** location. Create it. Copy/save every attachment into the workspace.

## Step 2 — Understand before implementing

Read spec, tasks, skill context, and test cases fully. Treat the attached skill context as the authority for paths/gotchas (replaces MemoryLayer). Brief the user: goal, ordered tasks, codegen/runtime paths. Do not proceed until this reading is done.

## Step 3 — Create one sub-workflow per task

For **each** task in the attached task list, write `subworkflows/<task-id-or-slug>.md` in the workspace with:

- task title + one-line goal
- inputs needed
- **only** the Phase C steps from `workflow.md` that this task needs
- acceptance checks from matching test cases / QA sub-tasks
- local skill paths to invoke

Slim aggressively (see `workflow.md` Phase B table). Do not run the full menu for every task. Confirm with the user when cutting steps is ambiguous; otherwise execute in task order.

## Step 4 — Execute each sub-workflow (menu)

Only run the steps listed in that task’s sub-workflow.

### App design (if needed and not attached)

Invoke `.claude/skills/spec-to-app-design/` with the attached spec + test cases. Save in the workspace. Do **not** regenerate spec/tasks/test cases unless the user asks.

### BlankApp

Copy this repo’s `BlankApp/` (or the path the user gives) into the workspace. Ask if unsure.

### Node version

`ui-build.js` hard-requires **Node 22.11.x**. Switch before any build if needed.

### Local codegen + local runtime

Edit the copied project’s `ui-build.js`:

- `baseDir` → `/tmp/`
- `codegenPath` → `<LOCAL_CODEGEN>/build/`
- `rnApp` → local package from `.claude/skills/generate-rn-app/` run against **LOCAL_CODEGEN** (follow that skill’s Step 1 → 2/2a → 3). Point at `dist/npm-packages/rn-app/`. Do not trust a stale `wavemaker.app.runtime.ui.version` npm pin.
- Ensure codegen consumes **LOCAL_RUNTIME** when the task needs runtime changes (yalc / local dep path per `generate-rn-app`).

Gotcha: if codegen depends on `file:.yalc/@wavemaker-ai/...`, copy `.yalc/` into `dist/npm-packages/rn-codegen/.yalc/` when `prepareNpmPackages()` did not.

### Pages

From the App Design, run screenshot/figma → wavemaker **starting at STEP 2**. Do not re-run visual analysis.

### Maven

```bash
mvn clean package -Dprofile.props.file="development.properties" -Dmobile.serverUrl="http://NOSERVERREQUIRED.com"
```

### Verify

Run that task’s QA sub-tasks / relevant test cases. Re-package after the real fix.

---

## Recap checklist

- [ ] All six inputs present; workspace created; artifacts saved
- [ ] Spec/tasks/skill context/test cases understood; no MemoryLayer or graphify used — local codebase files referenced
- [ ] One sub-workflow per task with only necessary steps
- [ ] Every skill path is `.claude/skills/...` (local), never `~/...`
- [ ] Selected steps executed per sub-workflow (Node, local codegen/runtime, pages, mvn, QA)
