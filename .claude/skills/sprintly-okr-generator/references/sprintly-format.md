# Sprintly Format Reference

Sprintly is the user's internally built sprint-planning app for Dev Leads. Pages: Dashboard, Sprints, My OKRs, My Team, Reviews, Backlog, Releases.

## Assign OKR modal

From the "My OKRs" page, a Dev Lead clicks "Assign OKR" (or "Assign to Self") to create an objective for a team member. Fields:

| Field | Notes |
|---|---|
| Priority | Low / Medium / High |
| Type | Enhancement / Feature / Bug (from Step 1's classification) |
| QA Lead | Optional |
| Assign to | Locked to the chosen member once selected |
| Objective | Free text — the main task title/description |
| Planned Release Version | Optional, links to the Releases workspace |
| Due date | Must fall within the current sprint's date range |
| TODO sub-tasks | Each has a title + description/notes field, added via "Add TODO" |

Once created, the OKR appears under the assignee's card (My Team / My OKRs) with title, type tag, due date, status, and an expandable "Show Tasks" section listing sub-tasks as checkboxes, rolling up progress as "X done · Y open" + completion %.

**Current known reportees:** Izhan Ali, Premkumar Katta, RanjithKumar Seekolu (all Developers) — check with the user if the assignee isn't one of these or isn't specified.

## Sub-task writing rules (strict — these come from repeated corrections, follow them exactly)

1. **Plain language.** Write as if the reader is a junior developer. No jargon, no dense terminology — spell out what to do and why.

2. **Flat list, developer-framed.** Sub-tasks are a flat list of checkboxes under one main task — no nested Objective/Key-Result structure. Each sub-task is a developer work item ("find and fix the code," "update the config"), not a QA-style test-and-confirm checklist item. End-to-end environment coverage (Stage/WMO, Web Preview, Mobile Preview, Builds) belongs folded into the developer's own final steps, not as separate QA sign-off items.

3. **Discovery-phrased, never spoon-fed.** This is the rule most likely to get violated by default, because you (the assistant) will have already done the research from spec sections 3/5/6 — but that research is for validating scope and feasibility, not for handing the developer a pre-solved answer. Sub-task text must never include exact file names, line numbers, or the specific code change. Instead, phrase it as an investigation the developer carries out themselves, optionally anchored with a count to confirm scope.

   - **Bad:** "In `icon.component.tsx` line 3, change `import { FontAwesome } from '@expo/vector-icons'` to `import FontAwesome from 'react-native-vector-icons/FontAwesome'`."
   - **Good:** "Find every place the old `@expo/vector-icons` package is imported — there are at least 5 spots, including the Icon widget and the Camera/Scan widgets. Search the project yourself to confirm there aren't more, then swap each import to use `react-native-vector-icons` directly."

4. **Always include, standalone:** "Check unit tests are updated" — its own sub-task, not folded into another sub-task's description.

5. **Always include, as the final sub-task:** "Run and verify it works" — covering the full verification checklist below.

Both 4 and 5 are mandatory on every OKR, regardless of Bug/Feature/Enhancement type.

## Standard verification checklist (goes in the final "Run and verify it works" sub-task)

1. **Web preview** — `web-preview` command.
2. **Mobile preview** — `sync` command → open in Expo Go → check Android & iOS → `expo prebuild` → native builds → check Android & iOS again.
3. **Mobile builds** — `build` command → check Android & iOS builds.

(For full CLI command details, read the CLI's own docs/source in the local repo.)

## Grounding rule (WaveMaker work)

Ground any technical claim or sub-task involving WaveMaker widgets, codegen, or runtime by **reading the local codegen and runtime repo files** — always use or reference local codebase files, never MemoryLayer or graphify. Never invent file/line details; cite the `file:line` you actually read, and if you couldn't verify something, say so instead of asserting it.

## Example OKR (real, as created in Sprintly)

**Main task:** "Video Widget is not working" (Bug, due 16 Jul)

**Sub-tasks:**
- Verify in Stage and WMO environments
- BUG: Video Component is not rendering - need to Fix
- Verify - Props and Callback/Events
- Verify Web Preview
- Verify Mobile Preview
- Verify Builds

## Core philosophy (mandatory — see SKILL.md)

This isn't optional background reading — SKILL.md's "Core philosophy" section makes it a mandatory lens applied to every ticket, not just SDK-upgrade planning. Short version: WM is a low-code platform — the team does not adopt every upstream feature (Expo/React Native release, or otherwise) just because it shipped. They selectively pick what's easy/valuable for customers in a low-code context, and that scoping decision belongs explicitly in the spec doc's Plan (Q4) and Alternative Approaches (Q12) sections — not left implicit.
