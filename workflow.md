# WaveMaker RN — fix or build, end to end (no MemoryLayer or graphify)

Portable workflow for anyone. **Do not use MemoryLayer or graphify — always use or reference local codebase files.**

Nothing is pre-generated. This workflow starts from a one-line intent (*"fix X"* / *"build Y"*) plus local repo paths, and produces its own **Spec**, **Tasks/OKR**, **Skill context** and **Test cases** before any code is written.

- **Part 1 — Discovery (Phase 0 → 6):** intent → repo context → workspace + git → codebase study + grill → confirmation → generate the 4 artifacts → user verify gate.
- **Part 2 — Execution (Phase 7 + cycle A → H):** pick sub-task workflow or direct flow, then run the same A–H cycle.

## Shareable prompt template

Copy, fill blanks, paste into the agent chat. **No attachments required.**

```
Prompt
--------
I want to <fix | build> <one-line description>.

codegenPath:   <absolute path to local rn-codegen repo>
runtimePath:   <absolute path to local rn-runtime / app-rn-runtime repo>
workspacePath: <where to create the issue workspace — or ask me>
requirementId: <JIRA id, e.g. WMS-1234 — becomes the workspace folder name>

Follow workflow.md in this repo, starting at Phase 0.
Do not use MemoryLayer or graphify — use or reference the local codebase files only.
Use skills only from .claude/skills/ — never ~/ or ~/.agents/skills/.
Commit at every step. Ask before assuming anything.

note:
--------
<extra constraints, branch names, out-of-scope notes>
```

## Local skills only

Always resolve skills from **this repo**, never from a home-dir path (`~/`, `~/.agents/skills/`, `~/.agent/skills/`, `~/.claude/skills/`).

| Need | Local skill |
| --- | --- |
| Orchestrator | `.claude/skills/issue-repro-pipeline/` |
| Requirement grilling + docs (ADRs, glossary) | `.claude/skills/grill-with-docs/` (wraps `grilling` + `domain-modeling`) |
| Requirement grilling only | `.claude/skills/grill-me/` (wraps `grilling`) |
| Spec + Tasks / OKR | `.claude/skills/sprintly-okr-generator/` |
| Spec → test cases | `.claude/skills/spec-to-testcases/` |
| Spec → app design | `.claude/skills/spec-to-app-design/` |
| Generate local rn-app (**mandatory** before any preview build) | `.claude/skills/generate-rn-app/` |
| Generate web + mobile previews (direct codegen transpile) | `.claude/skills/build-web-mobile-previews/` |
| Perf / debug tracker (**mandatory** — inject, verify, capture, analyse) | `.claude/skills/perf-debug-tracker/` |

Each row above is a real invocable skill (has a `SKILL.md`).

`grill-with-docs` / `grill-me` are directly invocable (`disable-model-invocation: false`) — invoke `grill-with-docs` yourself at Phase 3; the user can also trigger it as `/grill-with-docs`. It wraps `grilling` + `domain-modeling`.

### Reference trees — read these, don't invoke them

`native_mobile/` and `common/` have **no `SKILL.md`**. They are markdown reference libraries: open the specific file you need, don't try to invoke them as skills.

| Need | Path (read the file) |
| --- | --- |
| Screenshot → WM markup | `.claude/skills/native_mobile/ui/screenshot-to-wavemaker/screenshot-to-wavemaker-mobile.md` |
| Figma → WM markup | `.claude/skills/native_mobile/ui/figma-to-wavemaker/figma-to-wavemaker-mobile.md` |
| Widget vocabulary / detection | `.claude/skills/native_mobile/ui/shared/references/widget-detection.md`, `…/components-list.md` |
| Widget families (forms, charts, wizard, bottomsheet, design-system) | `.claude/skills/native_mobile/ui/<family>/` |
| Feature add-ons (sentry, biometric, secure-store, …) | `.claude/skills/native_mobile/feature/` |
| Common WM UI helpers (binding, actions, i18n, markup fixer, …) | `.claude/skills/common/ui/` |

Note the real filenames carry a **`-mobile` suffix** (`screenshot-to-wavemaker-mobile.md`), and `spec-to-app-design` hands off to them by that name. Their `STEP 0/1/2/3` headings are inside that file — Phase E's "start at STEP 2" means jumping to the **STEP 2: Generate Variables** heading there.

## Ground rules — every phase, no exceptions

1. **No MemoryLayer, no graphify.** Context comes from the local codebase files and the workspace docs.
2. **Commit at every step.** See [Git discipline](#git-discipline). Never batch a phase into one commit at the end.
3. **Ask, never assume:** workspace location, requirement id, BlankApp path, ambiguous task direction, whether to verify web+mobile now or at the end.
4. **Implementation rules** (Phase B, and any code you touch anywhere):
   - minimal code
   - no duplicate logic
   - reuse existing code
   - plan the change properly before editing
   - add comments only on important functions or variables — one-liners
5. **No assumptions on failures.** Root-cause it, validate the hypothesis with evidence, then fix (Phase H).
6. **Local skill paths only** — `.claude/skills/...`.
7. **The perf/debug tracker is mandatory, on web and mobile.** Every app this workflow builds is
   instrumented with `perf-tracker/` before generation, the patch is verified present after
   generation on **both** targets, and every runtime finding — bug or slowness — is **grounded in
   captured tracker data**, never in source reading alone. Diagnosing a runtime problem without a
   captured log is not acceptable; see `.claude/skills/perf-debug-tracker/`.

---

# Part 1 — Discovery

## Phase 0 — Intent: fix or build?

First question, before anything else:

> **Do you want to fix something or build something?**

Then classify the work as **Bug** / **Feature** / **Enhancement** and say which. Do not move on until answered — the classification drives spec shape, test-case emphasis, and how much design work Phase C needs.

## Phase 1 — Repo context + brief

Ask the user for repo context and a brief description of the goal. For WaveMaker that is normally the two repos below.

| Input | What it is |
| --- | --- |
| **Local codegen** | Absolute path to local `rn-codegen` repo (build output under `<codegen>/build/`) |
| **Local runtime** | Absolute path to local `rn-runtime` / `app-rn-runtime` repo |
| **Brief** | A few sentences: what to fix or build, and where it shows up |
| Optional | Screenshots / Figma, existing repro app, BlankApp path (defaults to this repo's `BlankApp/`), branch names, out-of-scope notes |

Then:

1. Confirm every path actually exists — do not proceed on a typo'd path.
2. Echo back, in three lines: goal, repos in play, first-guess blast radius.
3. If a repo the task clearly needs is missing, stop and ask for it.

## Phase 2 — Workspace + git (commit every step)

1. Ask for `workspacePath` if not given. **Never guess a machine-specific path.**
2. Ask for / confirm the **requirement id** (JIRA id, e.g. `WMS-1234`). That id *is* the requirement handle and the folder name. If there is genuinely no ticket, ask for a short slug (e.g. `expo-router`) and use it identically.
3. Create `<workspacePath>/<REQUIREMENT-ID>/` with this layout:

   ```
   <REQUIREMENT-ID>/
     00-context/        # brief, repo paths, codebase notes, grill doc, ADRs, glossary
     01-artifacts/      # spec.md, okr.md, skill-context.md, test-cases.md
     02-design/         # app design (Phase C output)
     03-subworkflows/   # one folder/md per task
     04-app/            # THE single shared BlankApp project for the whole flow,
                        #   plus its generated-web/ and generated-mobile/ outputs
     05-logs/           # run logs, screenshots, adb output, verification notes
     README.md          # running index: phase status, task status, decisions
   ```

4. `git init` inside `<REQUIREMENT-ID>/`, then make the first commit.
5. From here on, **every step ends in a commit** — no misses.

### Git discipline

- One commit per step, message: `<REQUIREMENT-ID>: <phase> — <what changed>`
  e.g. `WMS-1234: Phase 3 — grill doc + codebase notes`
- A step that produced no file change still gets recorded in `README.md` (status line / decision) and committed.
- `README.md` is updated in the same commit as the work it describes.
- Never rewrite history to tidy up. The commit trail is the audit trail of this workflow.

## Phase 3 — Codebase study, then grill

1. **Read the local codebase against the requirement** — the widget/module in question in runtime, its codegen counterpart, existing unit tests, and anything that already does something similar. Write findings to `00-context/codebase-notes.md` with `file:line` references. Reuse candidates go in a dedicated section (feeds implementation rule "reuse existing code").
2. **Grill the requirement.** Run `/grill-with-docs` (preferred — it also produces ADRs and a glossary) or `/grill-me`. Save the outcome to `00-context/grill.md`; ADRs and glossary alongside it in `00-context/`.
3. The grill must land, explicitly:
   - exact scope and **non-goals**
   - target platforms — web, android, ios
   - repro steps (fix) or acceptance criteria (build)
   - blast radius: codegen only / runtime only / both / app-level
   - backward-compatibility expectations
   - performance expectations, if any
   - remaining unknowns, named as unknowns
4. Commit.

## Phase 4 — Confirmation + grill doc update

Present a short digest to the user:

- what I understood (scope + non-goals)
- open questions
- risks
- **suggestions / improvements** I'd recommend
- what I propose to leave out

Then ask: **"Anything missed? Any improvements or suggestions?"**

Fold the answers back into `00-context/grill.md` **in place** (note the revision at the top), commit, and repeat until the user says the context is complete. Do not silently drop a suggestion — either fold it in or record why it's out of scope.

## Phase 5 — Generate the four artifacts

Only after Phase 4 sign-off. Each artifact is a **quick overall plan**, not an essay — enough to implement and verify against.

| Artifact | Skill / source | Output |
| --- | --- | --- |
| **Spec** | `.claude/skills/sprintly-okr-generator/` (spec stage) | `01-artifacts/spec.md` |
| **Tasks / OKR** | `.claude/skills/sprintly-okr-generator/` | `01-artifacts/okr.md` — includes the mandatory *"Check unit tests are updated"* and *"Run and verify it works"* sub-tasks |
| **Skill context** | `00-context/` (grill doc + codebase notes + ADRs) | `01-artifacts/skill-context.md` — the complete issue context, self-contained |
| **Test cases** | `.claude/skills/spec-to-testcases/` | `01-artifacts/test-cases.md` |

Commit each artifact as it lands. Keep the task list ordered and numbered — Part 2 iterates over it.

## Phase 6 — User check & verify gate

**Stop.** Ask the user to read the four files and confirm or correct them. Apply their edits, commit, and re-ask if the edits were substantial.

Do not start Part 2 without an explicit go-ahead.

---

# Part 2 — Execution

## Phase 7 — Route: sub-task workflow or direct flow

Judge complexity from the artifacts, **recommend one route with a one-line reason**, and let the user override.

| Signal | Route |
| --- | --- |
| Multiple tasks; touches both codegen and runtime; more than one page; unknowns still open; real regression risk | **Sub-task workflow** |
| Single small task; one file or widget; no new design; clear repro; low risk | **Direct flow** |

- **Sub-task workflow** — run the full **A → H** cycle once **per task**, in task-list order, closing each task before starting the next.
- **Direct flow** — run the same **A → H** cycle **exactly once**, treating the whole task list as one unit. Same phases, same order, same rules — nothing is skipped just because it's the direct route.

Write the chosen route into `README.md` and commit. For the sub-task route, create `03-subworkflows/<task-id-or-slug>/` per task as you reach it.

### Skipping rule for the cycle

A phase may be marked **N/A** only with a one-line reason written into the task's sub-workflow file (or `README.md` for direct flow).

- **B (app design)** is authored once for the requirement. A later task marks it *extend-only* (new pages/states added to the same design) or N/A (design already covers this task) — never a second design.
- **D (shared app + prereqs)** is set up once, then **re-verified** every task via the per-task re-check table — the re-checks themselves are never N/A.
- **C and E** may be N/A when the task changes nothing the app renders.
- **F, G and H are never N/A** if the task changes anything that ships to web or mobile.

---

## The cycle — Phase A → H

### Phase A — Task context + mini artifacts

For **this task only**:

1. Re-read the specific code this task touches (`code`/`grep` the exact symbols; don't re-read the world).
2. Generate a **simple, scoped** set of the same four artifacts — spec, task/OKR, skill context, test cases — into `03-subworkflows/<task>/` (direct flow: reuse `01-artifacts/`). Short and concrete; they are the implementation plan.
3. Commit.

### Phase B — App design (FIRST — common to web and mobile)

The app design comes **before implementation**: it is one design, shared by both platforms and by every task, and it defines what you're validating against.

- Run `.claude/skills/spec-to-app-design/` with the Phase A spec + test cases; save to `02-design/`.
- **One app design for the whole requirement.** The first task authors it; later tasks **extend** the same design only when they genuinely need new pages or states. Never start a second design or a second app.
- **Keep the screenshot-to-code skill in mind while authoring it:** it is consumed by `screenshot-to-wavemaker` / `figma-to-wavemaker` **starting at STEP 2**, so write it in widget terms (variables → tokens → markup mappable). The app design *is* STEP 0/1 — no visual re-analysis later.
- Map every test case to a page / widget / state, or mark it *not reproducible via UI*.
- Design once for both targets — no web-only or mobile-only variant unless the requirement itself is platform-specific, and then say so explicitly in the design.
- Commit.

### Phase C — Implement

Implement against the Phase A artifacts and the Phase B design as the plan. **Always follow these strict rules:**

- **minimal code**
- **no duplicate logic**
- **reuse existing code**
- **plan the change properly** — list the files and the exact change before editing
- **add comments only on important functions or variables — one-liners**

Also: no unrelated refactors, no drive-by reformatting, no speculative abstraction. Commit per coherent change.

### Phase D — Shared app + preview prerequisites

**One app for the entire flow.** A single workspace BlankApp project under `04-app/` serves every task and sub-task, with one `generated-web/` and one `generated-mobile/`. **Never create a second BlankApp for a later task** — a task adds or edits pages inside the same `src/main/webapp` and regenerates.

**Ask the user first:** *"Do you want to check both web and mobile now, or web now and mobile at the end?"*

Set up **once per flow**, then re-verify at each task:

**D1 — The shared project.** First task only: copy `BlankApp/` from this repo into `04-app/` (or the BlankApp path the user gives — ask, never guess a machine-specific path). Later tasks: confirm it's there and reuse it.

**D2 — Node version.** **Node 22.11.x.** Check `node -v` yourself — the direct transpile path bypasses `ui-build.js`, so its `checkNodeVersion()` never fires.

**D3 — Local rn-app — MANDATORY.** Run `.claude/skills/generate-rn-app/` against **LOCAL_CODEGEN**. Output: `<LOCAL_CODEGEN>/dist/npm-packages/rn-app/`. Never a registry download. If `generate rn-app` printed nothing, it did not run.

**D4 — Inject the perf/debug tracker — MANDATORY, before any generate.** Per `.claude/skills/perf-debug-tracker/`:

```bash
cp perf-tracker/wm-performance-tracker.js \
   <PROJECT>/src/main/webapp/resources/files/wm-performance-tracker.js
```

`src/main/webapp/resources/files/` already exists in `BlankApp/` and is **source**, so codegen copies it into the generated app — this edit is made once and survives every re-transpile.

The matching `require` + `WMPerf.enable()/trackApp/trackLib/trackAppVars` calls go into the **generated** `App.js`, so they are applied in Phase E (step 3) and re-applied after every generate — codegen rewrites that file each time. Exact snippet: `perf-tracker/inject-snippet.md`.

An app generated without this patch produces **zero** diagnostic data and makes every later finding guesswork. Do not skip it because the task "isn't a perf task" — it is the debug instrument too.

**Per-task re-checks before Phase E** — the shared state carries over, so confirm rather than assume:

| Re-check | Why |
| --- | --- |
| Codegen rebuilt after this task's codegen edits? | the transpile runs `<LOCAL_CODEGEN>/build/index.js` |
| **rn-app regenerated after that codegen rebuild?** | rn-app is built *from* codegen — a codegen edit leaves it stale, and transpile consumes the stale one silently |
| Local runtime still consumed by the codegen build? | otherwise a runtime change isn't in the build at all |
| `generated-web/` / `generated-mobile/` present and from when? | they persist across tasks — an old timestamp means stale output |
| Tracker patch still in `src/main/webapp/resources/files/`? | it is source, so it should persist — but confirm rather than assume |

Known gotcha: if codegen `package.json` has `file:.yalc/@wavemaker-ai/...` deps, copy `.yalc/` into `dist/npm-packages/rn-codegen/.yalc/` before the production install if `prepareNpmPackages()` didn't.

**No `ui-build.js` edits are needed on this path** — `baseDir`, `codegenPath` and `rnApp` are passed on the command line in Phase E instead.

Commit.

### Phase E — Build the pages, then transpile twice

1. **Implement the Phase B app design.** Read `.claude/skills/native_mobile/ui/screenshot-to-wavemaker/screenshot-to-wavemaker-mobile.md` (or the `figma-to-wavemaker` equivalent) and follow it **starting at its `STEP 2: Generate Variables` heading** (variables → tokens → markup), writing into the shared project's `src/main/webapp`. Do not redo visual analysis — the Phase B app design already *is* that file's STEP 0 + STEP 1 output.
2. **Check the generated folders first.** They persist across tasks — `rm -rf` the one you're about to write whenever pages, codegen, or runtime changed since it was last generated. A clean regenerate is the only way to know you're not reading a stale mix.
3. **Generate both previews** with `.claude/skills/build-web-mobile-previews/` — the **same codegen transpile run twice**, each profile writing straight into its own folder (the output path is an argument, so there is **no rename** and no `target/`):

   ```bash
   node <LOCAL_CODEGEN>/build/index.js transpile --profile="<PROFILE>" --page="" --rnAppPath="<LOCAL_CODEGEN>/dist/npm-packages/rn-app/" <PROJECT>/src/main/webapp <GENERATED_PATH>
   ```

   | Target | `--profile` | `<GENERATED_PATH>` |
   | --- | --- | --- |
   | Web | `expo-web-preview` | `<PROJECT>/generated-web` |
   | Mobile | `expo-preview` | `<PROJECT>/generated-mobile` |

   This **replaces `mvn clean package`** — maven's only job was to run `ui-build.js`, which ends in exactly this command (`BlankApp/ui-build.js:316-323`). Nothing is lost for these two profiles: `applyPatchIfAvailable()` is a no-op unless the profile is `default` (`:249-252`), and `generateDesignTokens()` only runs under the separate `--generateOverrideCSS` path.

   `--page=""` transpiles every page; pass a page name to narrow a re-generate during a tight fix loop.

4. **Check the generated folders after.** Both requested folders exist with **fresh timestamps**, and the change you just made is actually present in the generated source (grep for the widget/page/prop you touched).

   *"My fix isn't showing up", in order:* codegen rebuilt? → `generate-rn-app` re-run after that rebuild? → generated folder wiped before regenerating? → correct `--profile` and `<GENERATED_PATH>`?

5. **Verify the tracker patch — MANDATORY, both targets.** Codegen **rewrites `App.js` on every transpile**, so the require is wiped by each generate. Re-add it and check all three, for web *and* mobile:

   ```bash
   for d in generated-web generated-mobile; do
     echo "── $d"
     ls  "<PROJECT>/$d/assets/resources/files/wm-performance-tracker.js" >/dev/null 2>&1 \
         && echo "  patch file: OK" || echo "  patch file: MISSING"
     grep -q "wm-performance-tracker" "<PROJECT>/$d/App.js" \
         && echo "  require:    OK" || echo "  require:    MISSING — re-add"
     grep -q "WMPerf.enable"          "<PROJECT>/$d/App.js" \
         && echo "  enable():   OK" || echo "  enable():   MISSING — re-add"
   done
   ```

   The require goes at the **very top** of the generated `App.js`, with `enable()`/`trackApp`/`trackLib`/`trackAppVars` in its `componentDidMount` — snippet in `perf-tracker/inject-snippet.md`. **Three OKs on both targets, or stop and fix before Phase G.** Running an app with a failed check means the whole verification pass produces no diagnostic data.

6. Commit, and note both output paths plus the patch-check result in `README.md`.

### Phase F — Review + tests

1. Review the implementation against the Phase A spec and test cases — read your own diff.
2. Write or update **unit tests** for what changed; run them; get them green.
3. Update `01-artifacts/test-cases.md` (and the task's copy) if the implementation revealed **new runtime cases to test** — the runtime test plan is allowed to grow here, not shrink.
4. Commit.

### Phase G — Run & verify

**Web** — from `generated-web/`:

```bash
npm install
npx expo start --web
```

Start the local service proxy in a second terminal (from this repo):

```bash
node scripts/service-proxy.js --previewUrl http://your-preview-host --proxyPort 19009 --webPreviewPort 8081
```

**Mobile (Android)** — from `generated-mobile/`:

```bash
npm i
npx expo run:android
```

Then drive and inspect the app with `adb` (`adb shell input …`, `adb logcat`, `adb shell dumpsys`, screenshots). **iOS:** same shape — `npm i`, then `npx expo run:ios`, driven via the simulator tooling.

**Capture the tracker log while you drive — MANDATORY, both platforms.** This is the evidence every finding in Phases G and H rests on. Per `.claude/skills/perf-debug-tracker/`:

- **Mobile (Android):**
  ```bash
  adb logcat -c && adb logcat -s ReactNativeJS | grep --line-buffered '\[WM-PERF\]' > 05-logs/perf-mobile.log
  ```
- **Web:** DevTools → Console → filter `[WM-PERF]` → right-click → *Save as…* → `05-logs/perf-web.log`.

First thing to confirm in either log is `{"type":"META","event":"ENABLED",...}`. **No `META/ENABLED` means the patch never executed** — go back to Phase E step 5; do not proceed and do not treat an empty log as "nothing happened".

Then turn each capture into a report:

```bash
node perf-tracker/generate-perf-viewer.js 05-logs/perf-mobile.log 05-logs/perf-mobile.html
```

**Verification rule — step by step, never the whole flow at once:**

1. Split the flow into named sub-verifications (one interaction / one assertion each).
2. Run them one at a time, in order.
3. Capture evidence per step — screenshot, `adb` output, **tracker log excerpt / viewer reading** — into `05-logs/`.
4. Record pass/fail per sub-verification in the task's file before moving to the next.
5. Only after all sub-verifications pass does the task count as verified on that platform.

A sub-verification about anything the app *does at runtime* — timing, render counts, API calls, navigation — is evidenced by **tracker events with their `ms` values**, not by "looked fine". Screenshots prove appearance; the tracker proves behaviour.

Commit the logs, the generated viewer HTML, and the verification table.

### Phase H — Errors: root cause → fix → re-verify → close

When anything fails:

1. **Find out why it happened in the first place.** No assumptions — form a hypothesis, then **validate it with evidence**. For anything the app does at runtime, that evidence is the **tracker capture** first (`.claude/skills/perf-debug-tracker/`), before reading source and reasoning about what probably happens:

   | Symptom | What to read in the capture |
   | --- | --- |
   | Slow to become usable | `summary` TTFI + its `ttfiBasis`; the API / script / re-render split |
   | Unaccounted gap | per-widget `COMPONENT/RENDER`; a gap between `APP/REFRESH_END` and the next `MOUNT`/`UPDATE` is native-thread work, not JS |
   | Rendering when it shouldn't | `MEMO/WATCHER_DRIVEN_RENDER` vs `MEMO/SCU_BAIL`; `COMPONENT/SETSTATE_QUEUED` `trigger` |
   | Duplicate / unexpected API | `VAR`/`ACTION` `INVOKE_START`→`INVOKE_END` pairs, `DATASETWRITE` |
   | Binding cost | `WATCHER/CHECK_START`→`CHECK_END` `ms` with `count` |
   | Navigation cost | `NAV/PATH` `branch`, `NAV/TRANSITION_END` vs `MOUNT` |
   | Crash | `ERROR/CAUGHT` with `componentStack` |

   An unvalidated hypothesis is not a root cause, and neither is one argued purely from reading code when a capture could have shown it.
2. **Fix in the generated folder first.** Confirm the fix actually works there.
3. **Then port the real fix into the source codebase** (codegen / runtime), following the Phase B rules.
4. **Re-run the affected phases** — normally D's re-checks → E (wipe the generated folder, re-transpile) → F → G — and re-verify step by step. After a codegen fix, that means rebuild codegen **and** re-run `generate-rn-app` before transpiling, or you'll re-verify against the stale rn-app.
5. Repeat until clean. Record root cause + fix + evidence in the task's file, citing the concrete tracker events and `ms` values the conclusion rests on. **Re-verify from a fresh capture on both platforms** — a fix confirmed on mobile is not confirmed on web.
6. **Get the user's confirmation**, then mark the task **closed** in `README.md`.
7. Commit.

Sub-task workflow: only after a task is closed do you start the next task's Phase A. Direct flow: close out the whole task list here.

---

## Recap checklist

**Part 1 — Discovery**

- [ ] Phase 0: asked fix-or-build; classified Bug / Feature / Enhancement
- [ ] Phase 1: codegen path, runtime path, brief captured and paths verified
- [ ] Phase 2: workspace `<REQUIREMENT-ID>/` created, folder layout in place, `git init` done
- [ ] Phase 3: codebase notes written with `file:line` refs; grill doc (+ ADRs / glossary) saved
- [ ] Phase 4: digest shown; suggestions folded into the grill doc; user says context is complete
- [ ] Phase 5: spec, OKR, skill context, test cases generated into `01-artifacts/`
- [ ] Phase 6: user checked and verified the four artifacts; explicit go-ahead received

**Part 2 — Execution**

- [ ] Phase 7: route chosen (sub-task vs direct) with a reason, recorded in `README.md`
- [ ] A: per-task context + scoped mini artifacts
- [ ] B: **app design first** — one design for the whole requirement, common to web and mobile, authored for screenshot-to-code STEP 2, every test case mapped
- [ ] C: implemented under the strict rules (minimal, no duplicate logic, reuse, planned, one-line comments only)
- [ ] D: **one shared BlankApp** for the whole flow (no second app per task), Node 22.11.x checked manually, **`generate-rn-app` run (mandatory)**, **tracker patch copied into `src/main/webapp/resources/files/` (mandatory, before generating)**, per-task re-checks done — codegen rebuilt, **rn-app regenerated after it**, local runtime consumed, generated-folder timestamps noted
- [ ] E: pages built from the app design into the shared `src/main/webapp`; generated folders checked (and wiped if anything changed) then **transpiled twice** — `--profile="expo-web-preview"` → `generated-web`, `--profile="expo-preview"` → `generated-mobile`; no `mvn`, no `ui-build.js` edits, no rename; folders re-checked after for fresh timestamps and the change actually present
- [ ] E5: **tracker patch verified present on BOTH targets** — patch file + `require` + `WMPerf.enable` in `generated-web/App.js` *and* `generated-mobile/App.js` (codegen wipes the require on every transpile — re-add it); three OKs or stop
- [ ] F: implementation reviewed; unit tests written/updated and green; runtime test cases updated
- [ ] G: web run from `generated-web/` (`npx expo start --web` + service proxy) and mobile run from `generated-mobile/` (`npx expo run:android` + adb); **tracker log captured on both platforms with `META/ENABLED` confirmed**, viewer generated; step-by-step sub-verifications with evidence in `05-logs/`
- [ ] H: every failure root-caused with **validated tracker evidence** (events + `ms`, not impressions); fixed in generated folder then in the codebase; **re-verified from a fresh capture on both platforms**; user confirmed; task closed

**Always**

- [ ] No MemoryLayer / graphify / home-dir skill paths — local codebase files and `.claude/skills/...` only
- [ ] A commit at every step, none missed
- [ ] No user confirmation skipped where a phase says to ask
