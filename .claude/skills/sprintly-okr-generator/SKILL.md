---
name: sprintly-okr-generator
description: Turns a JIRA ticket into a fully-planned OKR (Objective + sub-tasks) for Sprintly, the user's internal Dev-Lead sprint-planning tool. Classifies the ticket as Bug, Feature, or Enhancement; produces a detailed 15-question spec/plan document BEFORE any OKR is drafted; then writes Sprintly-ready sub-tasks in the required format (plain junior-dev language, discovery-phrased — never spoon-fed file/line answers — plus the mandatory "Check unit tests are updated" and "Run and verify it works" sub-tasks). Use this whenever the user gives a JIRA ID/ticket number and wants it planned, spec'd, or turned into an OKR/task for a teammate — even if they don't say "OKR" or "Sprintly" explicitly, e.g. "can you spec out WMS-1234 for Izhan", "I need to hand PROJ-88 to Prem this sprint", "plan this bug ticket out", "draft the OKR for the video widget crash". Always produce the spec doc first and only create the OKR/sub-tasks after it's been reviewed — never jump straight to writing sub-tasks from the ticket title alone.
---

# Sprintly OKR Generator

## Why this workflow exists

Sprintly OKRs get handed to developers — often junior ones — to execute mostly unsupervised. An OKR written straight from a JIRA ticket title skips the thinking that actually makes the work doable: what's really being asked, what the codebase currently does, what could go wrong, and how "done" gets verified. Skipping that thinking produces vague sub-tasks that get contested at standup or, worse, sub-tasks that miss real edge cases and cause rework.

So OKR creation is deliberately the **last** step, not the first. Everything before it is planning.

## Core philosophy — mandatory lens, not background reading

WM is a low-code platform. The team does **not** adopt every feature an upstream Expo/React Native (or any other dependency) release ships — they selectively pick whatever is actually easy and valuable for customers to use in a low-code context. This isn't a one-time SDK-upgrade footnote; it's a lens you apply to *every* ticket this skill touches, Bug/Feature/Enhancement alike:

- **Feature tickets** — don't spec out the upstream capability's full surface area by default. Ask what slice of it a low-code app builder can actually bind/configure meaningfully through a property panel, and scope the plan to that. "Expo/the library supports X" is not the same question as "should WmVideo expose X."
- **Bug tickets** — the fix should restore correct behavior, not become a vehicle for smuggling in unrelated upstream features "while we're in there." Scope creep away from this principle is itself a risk worth flagging in the spec.
- **Enhancement tickets** — the same selectivity applies: an enhancement request is not an automatic yes just because it's technically possible.

Apply this explicitly while answering question 4 (Plan) and question 12 (Alternative Approaches) below — if an alternative exists that adopts less upstream surface area for the same customer value, it should be on the table, not just the most "complete" implementation. If you're scoping something down because of this principle, say so in the spec (e.g. "not exposing X because it's native-only/narrow/not property-panel-friendly") so the reviewer sees the decision was made, not missed.

## The three-step flow

```
JIRA ticket ID
      │
      ▼
Step 1: Classify (Bug / Feature / Enhancement)
      │
      ▼
Step 2: Write the spec doc (15 questions, same set for all three types)
      │   → saved as a real file, reviewed by the team at standup
      │   → OKR waits until the FINAL reviewed version exists
      ▼
Step 3: Create the OKR + sub-tasks in Sprintly, assign to a teammate
```

Do not collapse these steps. If the user asks you to "just create the OKR for WMS-1234," still do Step 2 first — produce the spec, show it, and only then move to Step 3. If they explicitly say to skip planning and go straight to sub-tasks, that's their call to make, but flag that you're skipping the normal process.

## Step 1 — Classify

Read the JIRA ticket (title, description, comments if available). Decide: **Bug**, **Feature**, or **Enhancement**. This isn't cosmetic — it sets the `Type` field in Sprintly's Assign OKR modal and colors how you'll answer some of the 15 questions (e.g. "current codebase status" reads very differently for a bug — where something is broken — versus a feature, where something doesn't exist yet).

If the ticket is ambiguous (e.g., a bug report that's really scope creep for a feature, or an enhancement that's actually patching broken behavior), say so and pick the classification that best matches what the fix will actually require.

**Exception — lightweight bug reports:** if this is purely a bug/regression investigation that already concluded with a root cause found (not a fresh planning exercise), you can use the lighter format instead of the full spec: what broke, root cause, when/how introduced, the fix, how it was verified. No diagrams needed unless the bug is architecturally complex. This shortcut is for closed investigations, not for planning new work — if there's still a decision to make about the fix approach, use the full spec.

## Step 2 — Write the spec doc

This is the core of the skill. Before anything gets written into Sprintly, produce a Markdown spec doc that answers all 16 questions below — **the same 16 questions regardless of whether this is a Bug, Feature, or Enhancement.** The depth of each answer will vary by type (a one-line bug fix won't have much to say about "architecture-level changes"; a big feature will), but never skip a question because it "doesn't apply" — write "N/A — reason" instead, so the reviewer at standup can see it was considered, not missed.

Read `references/spec-template.md` for the fill-in-the-blank Markdown template and a description of what makes a strong answer to each question — this is the file to open before you start writing the doc. The 16 questions, briefly:

1. What is the issue/enhancement/feature?
2. What do they want exactly? What are they looking for?
3. What is the current status of the codebase related to this?
4. What is the plan?
5. Which files will change?
6. How to write the fix?
7. What to consider while writing?
8. What kind of architecture-level changes happen?
9. What are the edge cases?
10. What is the runtime performance impact?
11. What will be the (blast-radius) impact?
12. What are all the possible ways to fix this?
13. What are the pros and cons of each?
14. Is it backward compatible?
15. How to verify this fixes it?
16. What are all the mandatory verifications we have to do?

**Save the file** to `/Users/raajr_500278/raaj-wm/plans/<JIRA-ID>-<short-slug>-plan.md`. It must exist as a real, shareable file — not just chat output — because it gets reviewed by the team at standup and edited based on their feedback. Only the final, reviewed version is the one you build the OKR from. Include a Mermaid flow diagram in the doc if the feature's logic or architecture genuinely warrants one (a one-line config change doesn't need one; a new data flow or multi-service interaction does).

### Grounding questions 3, 5, and 6 in reality

Questions 3 (current codebase status), 5 (files that will change), and 6 (fix approach) are exactly the kind of claims that are easy to get plausibly wrong. Actually check the code — don't infer behavior from the ticket description or from what similar code "probably" does.

- For anything touching WaveMaker widgets, codegen, or runtime code, ground your research in the `rn-codegen-mars` and `rn-runtime-mars` namespaces (via MemoryLayer `recall`/`code` tools if available, or by reading the actual source otherwise). Don't invent file paths or line numbers, and don't create a new namespace for this — those two are the standing home for WaveMaker code knowledge.
- For non-WaveMaker projects, just read the actual repo — same principle, different location.

### Question 10 — runtime performance impact

This widget runtime ships to both web and native (Android/iOS), and a change that's cheap on one platform can be expensive on another — a JS-thread-heavy fix that's invisible on web can tank frame rate on a mid-range Android device, and a listener that's cleaned up correctly on unmount in one environment can leak in another. Because these problems only show up once something is actually running (not from reading the diff), this question needs a real pass of thought even when the change looks small. Cover, at minimum:

- **Performance / CPU load** — does this add meaningful work to the JS thread or main thread?
- **FPS / frame drops** — especially during animations, scrolling, or media playback.
- **Visual lag or jank** — does the UI feel like it's responding immediately to user input?
- **Memory leaks** — are listeners, subscriptions, or native objects (player instances, camera sessions, etc.) actually disposed on unmount, not just assumed to be?
- **Render time** — both first render and the cost of re-renders once state/props change.
- **Bundle/binary size** — does this add a dependency or asset heavy enough to matter for web load time or mobile app size?
- **Cold-start / load time** — does anything here run eagerly at startup rather than lazily when needed?
- **Battery / network impact** (mobile) — anything that polls, streams, or keeps a native resource alive in the background?
- **Behavior at scale** — what happens with many instances of this widget on one page, or inside a repeating container/list? (This is a real recurring failure mode here — multiple video players on one page have leaked/collided before.)
- **Cross-platform parity** — does performance hold up the same on Web, Android, and iOS, or does one platform lag noticeably behind the others?

If a question genuinely doesn't apply (e.g. a pure config-file change with no runtime code path), say so explicitly rather than leaving the section blank — "N/A, no runtime code touched" is a real answer; silence isn't.

### Questions 12 and 13 — don't skip the alternatives

It's tempting to write down the first fix approach that comes to mind and call it "the plan." Question 12 exists specifically to force at least one more option onto the table — even if the answer is "there are two ways to do this and one is clearly better," that comparison in question 13 is what lets a reviewer trust the choice instead of just take it on faith.

## Step 3 — Create the OKR in Sprintly

Once the spec doc is finalized (i.e., the user tells you it's been reviewed, or explicitly says to proceed), turn it into an OKR. Read `references/sprintly-format.md` for the full Assign-OKR modal field reference, the sub-task writing rules, an example real OKR, and the standard verification checklist — read this before writing a single sub-task, since the phrasing rules are strict and easy to violate by default.

The short version, because it's the rule most worth repeating: sub-tasks are written for a junior developer to *discover* the answer, not to be handed it. Even though you did the research for questions 3/5/6 above, that research is scoped/feasibility-checking for you — it does not get pasted into the sub-task text. Compare:

- **Wrong:** "In `icon.component.tsx` line 3, change the import from `@expo/vector-icons` to `react-native-vector-icons`."
- **Right:** "Find every place the old `@expo/vector-icons` package is imported — there are at least 5 spots including the Icon widget and Camera/Scan widgets. Search the project yourself to confirm there aren't more, then swap each import to the `react-native-vector-icons` equivalent."

Every OKR, regardless of type, must include:
- A standalone **"Check unit tests are updated"** sub-task.
- A separate, final **"Run and verify it works"** sub-task, covering the standard verification checklist (Stage/WMO, Web Preview, Mobile Preview, Builds — see the reference file for the exact sequence).

Assign the OKR to the person named by the user (or ask who it should go to if not specified).

## Quick recap checklist

Before you consider the OKR done, confirm:

- [ ] Classified as Bug / Feature / Enhancement
- [ ] Low-code philosophy applied — scope matches what's actually valuable to a low-code app builder, not just what upstream makes technically possible (see Core Philosophy above)
- [ ] Spec doc written, all 16 questions answered (or explicitly marked N/A with a reason), saved as a file under `/Users/raajr_500278/raaj-wm/plans/`
- [ ] Codebase claims (questions 3/5/6) grounded in actual code, not inferred
- [ ] Runtime performance impact considered — CPU/FPS/jank/memory/render-time/bundle-size/startup/battery-network/at-scale/cross-platform (question 10)
- [ ] At least one alternative approach considered (questions 12/13)
- [ ] Spec reviewed/approved before moving to Step 3 (or user explicitly skipped this)
- [ ] Sub-tasks are plain-language, discovery-phrased, no pre-solved answers
- [ ] "Check unit tests are updated" sub-task present
- [ ] "Run and verify it works" sub-task present, covering the full environment checklist
- [ ] OKR assigned to the right team member
