# WaveMaker RN issue → runnable repro (no MemoryLayer or graphify)

Portable workflow for anyone. **Do not use MemoryLayer or graphify — always use or reference local codebase files.** All context comes from attachments plus the local codegen/runtime paths the user provides.

## Shareable prompt template

Copy, fill blanks, attach the 4 files (spec, tasks, skill context, test cases), and paste into the agent chat:

```
Prompt
--------
codegenPath: <absolute path to local rn-codegen repo>
runtimePath: <absolute path to local rn-runtime / app-rn-runtime repo>
workspacePath: <where to create the issue workspace — or ask me>
feature: <short name, e.g. expo router>

I want to build <feature>.

Attachments (required — do not invent if missing):
1. Spec
2. Tasks / OKR
3. Skill context (complete issue context)
4. Test cases

Instructions:
1. Read all 4 attached files line by line. Use the local codegen + runtime codebases at the paths above as context until you have a complete understanding. Do not use MemoryLayer or graphify — always use or reference local codebase files.
2. Follow workflow.md in this repo (no MemoryLayer or graphify pipeline). Use skills only from .claude/skills/ — never ~/ or ~/.agents/skills/.
3. After understanding, create one sub-workflow per task under <workspace>/subworkflows/ with only the steps that task needs, then execute them in order and start building the feature.
4. Ask before assuming workspace location, BlankApp path, or ambiguous task direction.

note:
--------
<any extra constraints, branch names, or out-of-scope notes>
```

## Required inputs (attachments)

Confirm **all** of these before acting. If any are missing, stop and ask — do not invent them and do not fall back to MemoryLayer.

| Input | What it is |
| --- | --- |
| **Spec** | Finished spec/plan for the issue |
| **Tasks** | Task list / OKR (TODO + QA sub-tasks) |
| **Skill context** | Skill (or skill pack) with complete issue context |
| **Test cases** | Full test-cases report |
| **Local codegen** | Absolute path to local `rn-codegen` repo (build output under `<codegen>/build/`) |
| **Local runtime** | Absolute path to local `rn-runtime` / `app-rn-runtime` repo used for this work |

Optional but useful: app design doc, screenshots/Figma, BlankApp path (defaults to this repo’s `BlankApp/`).

## Local skills only

Always resolve skills from **this repo**, never from a home-dir path (`~/`, `~/.agents/skills/`, `~/.agent/skills/`, `~/.claude/skills/`).

| Skill | Local path |
| --- | --- |
| Orchestrator | `.claude/skills/issue-repro-pipeline/` |
| Spec → app design | `.claude/skills/spec-to-app-design/` |
| Spec → test cases | `.claude/skills/spec-to-testcases/` |
| Sprintly / OKR | `.claude/skills/sprintly-okr-generator/` |
| Generate rn-app | `.claude/skills/generate-rn-app/` |
| WM widgets / native mobile | `.claude/skills/native_mobile/` |
| Common WM UI helpers | `.claude/skills/common/` |
| Device / profiler helpers | `.claude/skills/argent-*` |

Screenshot / Figma → markup skills live under the agent’s project Cursor skills when available (`screenshot-to-wavemaker`, `figma-to-wavemaker`, etc.). Prefer those over any home-dir copy.

---

## Phase A — Understand attachments

1. Read the **spec**, **tasks**, **skill context**, and **test cases** end to end.
2. Read the attached **skill context** as the authority for issue-specific gotchas, file paths, and constraints (this replaces MemoryLayer grounding).
3. Summarize back to the user (briefly):
   - goal / blast radius
   - ordered task list (dev TODO + QA)
   - which local codegen + runtime paths will be used
4. Ask for the **issue workspace** location if not already given. Create it. Copy/save all attachments into the workspace (do not leave them only in chat).

Do not skip Phase A. Implementation sub-workflows depend on a correct reading of the task list.

---

## Phase B — Per-task sub-workflows

After Phase A, **do not run one giant generic pipeline for every task**.

For **each** task in the attached task list:

1. Decide which steps from Phase C are actually required for **that task only**.
2. Write a short **sub-workflow** into the issue workspace, e.g. `subworkflows/<task-id-or-slug>.md`, containing:
   - task title + one-line goal
   - inputs it needs (files, packages, pages)
   - **only** the necessary implementation steps (omit irrelevant Phase C steps)
   - acceptance checks drawn from the matching test cases / QA sub-tasks
   - local skill paths to invoke (from the table above)
3. Show the sub-workflow to the user when a choice or risky cut is involved; otherwise proceed in task order.

### How to slim steps per task

| If the task is mainly… | Include… | Skip… |
| --- | --- | --- |
| Spec / design clarification | reading artifacts, maybe app-design refresh | BlankApp copy, mvn, codegen wire-up |
| Repro UI / demo page | app design → screenshot-to-code → Node check → local codegen wire → mvn | regenerating spec/tasks/test cases |
| Codegen change | local codegen build, `generate-rn-app`, point `codegenPath`/`rnApp`, targeted pages, mvn | unrelated pages / full redesign |
| Runtime change | local runtime path + codegen rebuild that consumes it, repro app, mvn, runtime-focused tests | unrelated UI churn |
| QA / verification only | run existing build, execute QA sub-tasks / test cases | regenerating artifacts or rebuilding pages |

Never regenerate spec, tasks, or test cases when they were already attached — only refine if the user asks.

---

## Phase C — Shared implementation steps (pick per sub-workflow)

Use these as a menu. Each sub-workflow selects a subset.

### C1 — App design (if not already attached)

Using attached **spec** + **test cases**, run `.claude/skills/spec-to-app-design/`. Save the App Design in the issue workspace. Map every test case to a page/widget/state (or mark not-reproducible-via-UI).

### C2 — BlankApp template

Copy `BlankApp/` from this repo into the issue workspace (or the BlankApp path the user gives). Ask if unsure — do not guess a machine-specific path.

### C3 — Node version

`ui-build.js` requires **Node 22.11.x**. Check `node -v`; switch (e.g. `nvm use 22.11.0`) if needed before any build.

### C4 — Wire local codegen + local runtime

Edit the copied project’s `ui-build.js` (local override is expected):

- `baseDir` → `/tmp/`
- `codegenPath` → `<LOCAL_CODEGEN>/build/` (the attached local codegen build folder)
- `rnApp` → locally generated `@wavemaker-ai/rn-app` via `.claude/skills/generate-rn-app/` run against **LOCAL_CODEGEN** (not a downloaded npm pin). Point at the resulting `dist/npm-packages/rn-app/`.
- Ensure the codegen build consumes **LOCAL_RUNTIME** when the task needs runtime changes (yalc / local dependency path as documented in `generate-rn-app`).

Known gotcha: if codegen `package.json` has `file:.yalc/@wavemaker-ai/...` deps, copy `.yalc/` into `dist/npm-packages/rn-codegen/.yalc/` before production install if `prepareNpmPackages()` did not.

### C5 — Build pages from the app design

Using the App Design, run screenshot-to-wavemaker / figma-to-wavemaker **starting at STEP 2** (variables → tokens → markup). Do not re-do visual analysis; the App Design already is STEP 0/1.

### C6 — Maven package

From the issue workspace project:

```bash
mvn clean package -Dprofile.props.file="development.properties" -Dmobile.serverUrl="http://NOSERVERREQUIRED.com"
```

### C7 — Verify

Execute the QA sub-tasks / test cases that belong to the current task (functional, edge, security, performance/FPS/jank/memory/render storms, cross-platform as applicable). Re-run C6 after the real fix lands.

---

## Phase D — Order of work

1. Phase A (understand + workspace + save attachments)
2. Phase B (write one sub-workflow per task)
3. Execute sub-workflows in task-list order (or the order the user prioritizes)
4. After each sub-workflow: note results in the workspace; carry forward only what the next task needs

Strict rules:

- No MemoryLayer / graphify / home-dir skill paths — always use or ref local codebase files
- No skipping user confirmation when a step says to ask (workspace location, BlankApp path, ambiguous task direction)
- No running every Phase C step for every task — only what that task’s sub-workflow lists

---

## Recap checklist

- [ ] Spec, tasks, skill context, test cases, local codegen path, local runtime path all present
- [ ] Artifacts saved in the issue workspace
- [ ] Skill context read; no MemoryLayer or graphify used — local codebase files referenced
- [ ] One sub-workflow per task with only necessary steps
- [ ] All skill references use `.claude/skills/...` (local), never `~/...`
- [ ] Selected C-steps done (Node, local codegen/runtime wire, pages, mvn) as listed per sub-workflow
- [ ] Task QA / test cases exercised for what was implemented
