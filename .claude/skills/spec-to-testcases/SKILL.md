---
name: spec-to-testcases
description: Turns a finished spec/plan doc (and its OKR, if one exists) into a comprehensive test-cases report for the WaveMaker React Native runtime — a widget library that ships to both Web and native (Android/iOS). Grounds every test case in the actual current implementation by reading the LOCAL codegen and runtime repo files directly (never MemoryLayer, never graphify), and covers functional/happy-path, edge cases, security/hack/bypass attempts, runtime performance (FPS, jank, memory leaks, render time, multi-render/max-render storms), scale & concurrency, cross-platform/environment matrix, and backward-compatibility regression cases. Use this once a JIRA ticket has been spec'd out (e.g. via the sprintly-okr-generator skill) and the user wants "test cases," "a test plan," "QA cases," or asks "what should we test for this" / "write up test cases for WMS-1234" / "what could break this feature" — even if they don't use the word "testcases" explicitly. This is a downstream, chained skill: it expects a spec/plan doc to already exist (or the raw ticket + enough context to write one) — if no spec exists yet, offer to run sprintly-okr-generator first rather than guessing at scope.
---

# Spec-to-Testcases

## Why this exists, and how it's different from writing the OKR sub-tasks

The `sprintly-okr-generator` skill produces a spec/plan doc and Sprintly sub-tasks that are deliberately vague about implementation — sub-tasks are phrased as *discovery* steps because a junior developer is meant to find the answer themselves, not be handed it.

This skill is the opposite. A test case that says "check that it works" is useless to whoever executes it — a real tester needs exact preconditions, exact steps, and an exact expected result. **Do not carry over the discovery-phrasing rule here.** Be as specific and prescriptive as the actual implementation allows; if you know the exact prop name, exact API, or exact URL pattern that needs testing, put it in the test case.

## Core philosophy — mandatory lens, not background reading

Two rules apply to every report this skill produces, the same way `sprintly-okr-generator`'s low-code philosophy applies to every ticket it plans. Don't treat these as background color — they gate what you write in Step 2, the same way that skill's philosophy gates its Plan and Alternatives questions.

**1. Scope discipline — test the reported issue/enhancement/feature, and nothing else.** The boundary is whatever the spec's Q1/Q2 (issue/intent) and Q11 (impact/blast radius) actually say. The what-if investigation in Step 1.5 exists to find everything *within* that boundary that a mechanical pass would miss — it is not a license to test adjacent code paths, other widgets, or pre-existing issues the investigation happens to notice along the way. If a "what if" thread leads somewhere genuinely outside the ticket's scope (a different widget's unrelated bug, a speculative future feature), log it in the Investigation Log as **out of scope**, with a one-line reason, and stop there — don't write test cases for it. This mirrors the same discipline `sprintly-okr-generator` applies to bug tickets ("the fix should restore correct behavior, not become a vehicle for smuggling in unrelated upstream features") — here it's scope creep in test coverage instead of scope creep in implementation, but it's the same failure mode.

**2. Proportional depth — the size of the report should match the size of the change.** A simple, contained bug fix (a null-check, a one-line style change, a single corrected prop default) should produce a simple, short report — a handful of test cases, several categories legitimately marked N/A, and a short investigation log, not maximum-depth coverage across all 7 categories because the taxonomy technically has 7 categories. Read the spec's Q8 (architecture-level changes) and Q11 (impact/blast radius) as your signal for how much depth is warranted: "None — contained fix" in Q8 is a strong hint that this report should be short. Forcing exhaustive coverage onto a trivial change doesn't make the testing more rigorous — it just buries the handful of cases that actually matter under padding, and makes every future report harder to trust at a glance. This is the same underlying principle as WM's low-code philosophy (`sprintly-okr-generator`'s Core Philosophy): effort should be proportional to real value, not to how much *could* theoretically be produced.

In short: go deep within the ticket's actual boundary, and go only as deep as that specific change warrants — not deep everywhere, and not wide beyond the ticket.

## Inputs

1. **The spec/plan doc** (required) — the JIRA-ID-named plan file this ticket already has, or if one doesn't exist yet, enough ticket context to reconstruct the same information. If there's truly nothing to work from, say so and offer to run `sprintly-okr-generator` first rather than inventing scope.
2. **The OKR / sub-tasks** (if they exist) — useful for cross-checking that every planned code change has at least one test case pointed at it, but the spec doc is the primary source of truth for *what* to test, since it has the edge cases, alternatives, and performance considerations already thought through.
3. **Real code**, read from the **local codegen and runtime repos** — ground test cases in what the component/widget actually does today (current props, current event names, current platform branching), not what the spec assumed or what seems plausible.

   **Always use or reference local codebase files. Do not use MemoryLayer or graphify.** Ask the user for the local codegen and runtime paths if you don't have them; then read the widget/component source, its codegen counterpart, and its existing tests with the normal file tools (Read / Grep / Glob). Cite `file:line` for every claim about current behavior. If a path you need wasn't provided, ask for it — never substitute a remembered or inferred answer.

## Workflow

```
Spec/plan doc (+ OKR if it exists)
      │
      ▼
Ground by reading the LOCAL codegen + runtime repo files
      │
      ▼
Generate test cases across all 7 categories (below)
      │   → every category gets at least one case, or an explicit "N/A — reason"
      ▼
Write the report, save as a file
```

### Step 1 — Read the spec and ground it in real code

Pull the issue/intent (spec Q1/Q2), the fix approach and files affected (Q5/Q6), the edge cases already identified (Q9), the runtime performance answers already given (Q10), the alternatives considered (Q12), and the backward-compatibility answer (Q14) if the spec follows the `sprintly-okr-generator` template. Then verify against the actual code by **reading the local codegen and runtime repo files** — props, event names, and platform-specific branches change, and a test case built on a stale assumption from the spec is worse than no test case, because it gives false confidence. Record the `file:line` you verified each claim against.

### Step 1.5 — Run a what-if investigation before drafting any cases

This is the step that separates real coverage from a mechanically filled-in template. Don't go straight from "read the spec" to "write test cases" — a taxonomy tells you *where* to look, but it won't surface the specific scenario nobody thought of. That comes from interrogating the feature the way an investigator interrogates a scene: ask "what if X happens," take the answer, and ask "what if" again on *that* answer, chasing each thread until it stops producing anything new — not stopping at the first plausible-sounding question.

For each of the 7 categories below, run a chain like this (these are illustrative, not a checklist to copy):

- What if the network drops mid-request? → What if it drops after headers arrive but before the body finishes? → What if it reconnects and the app retries with now-stale cached data?
- What if this widget is bound to a variable that doesn't exist, or that resolves to the wrong type?
- What if two instances of this widget end up sharing the same underlying native resource (decoder slot, camera session, file handle)?
- What if the app is backgrounded mid-operation and resumed later — does state survive, or does it silently break?
- What if the device rotates orientation mid-render, or the OS reclaims memory and remounts the component?
- What if this runs twice in the same render pass (React 18 strict-mode double-invoke, or a parent that re-renders unnecessarily)?
- What if the user's locale is RTL, or uses a script/character set the original implementation wasn't tested with?
- What if this is invoked on a low-end/throttled device rather than a dev machine or simulator?
- What if the same interaction happens from two input sources at once (a user tap and a programmatic/bound trigger)?

Keep chasing a thread as long as each "what if" produces something the previous answer didn't already cover, **and it's still inside the reported issue/enhancement/feature's actual boundary** (Core Philosophy, rule 1). Stop a given thread once two consecutive follow-ups produce nothing new, or once a follow-up steps outside that boundary — both are signs you've reached the bottom of that thread, not a sign to stop the whole investigation (move to the next thread or category instead).

For a small, contained change, this whole investigation may legitimately be short — a handful of chains, most closing after one or two follow-ups — because there's genuinely less surface area to interrogate (Core Philosophy, rule 2). Don't manufacture additional chains to make the log look thorough; a short investigation that's actually exhaustive for a small change is worth more than a long one padded with speculative threads.

Every question this investigation raises gets logged in the report's **Investigation Log** (see `references/report-template.md`), whether or not it turned into a test case — if a scenario was considered and dismissed, say why (e.g. "out of scope for this ticket," "out of scope for this platform," "already covered by TC-EDGE-003," "not reachable given current architecture"). A "what if" that got silently dropped is indistinguishable from one that was never asked, and the whole point of doing this is to make the thoroughness — and the scoping decisions — visible and checkable, not just something that happened in your head.

### Step 2 — Generate test cases across all 7 categories

Read `references/testcase-taxonomy.md` for the full breakdown of each category with concrete example test cases from real WM widget work (video, icons, camera) — read it before drafting, since "edge case" and "hack" mean specific, checkable things here, not vague gestures. Every test case in this step should trace back to something the Step 1.5 investigation surfaced — if you find yourself writing a case that didn't come from a "what if" thread, go back and ask the "what if" that would have led you there, and log it. The 7 categories, briefly:

1. **Functional / Happy Path** — does the feature/fix do what it's supposed to, under normal conditions?
2. **Edge Cases** — boundary and unusual-but-legitimate inputs/states (empty, null, huge, rapid, concurrent, first-run, last-item).
3. **Security / Hacks / Bypass Attempts** — adversarial or malicious input: malformed/malicious bound URLs, XSS via unsanitized bound text, oversized/fuzzed props, unauthorized/expired-token access, path traversal, prop-tampering, race conditions exploited on purpose.
4. **Runtime Performance** — FPS/frame drops, visual lag/jank, memory leaks, render-time impact, **multi-render and max-render storms** (a prop or state update triggering far more re-renders than it should, or an unbounded render loop), JS-thread/main-thread blocking.
5. **Scale & Concurrency** — many instances of the widget on one page or inside a repeating container/list; rapid-fire user interaction (spam-clicking a toggle); concurrent state mutation while an async operation is in flight.
6. **Cross-Platform / Environment Matrix** — Web, Android, iOS; Expo Go vs. `expo prebuild` + native build; Stage/WMO — the same test case can pass on one and fail on another, so state which platforms each case actually needs to run on rather than assuming "tested on web" covers native too.
7. **Backward Compatibility / Regression** — existing apps/usages that must keep working unchanged after this ships.

Do not skip a category because "nothing comes to mind" — if a category genuinely doesn't apply (e.g. a pure text-label change has no realistic security angle), write one line explaining why, the same way the spec doc marks non-applicable questions N/A rather than leaving them blank. For a simple, contained bug fix, expect several categories to legitimately end up N/A with one case each in the rest — that's a correctly proportioned report, not an incomplete one (Core Philosophy, rule 2). Reserve a report with real depth in every category for changes whose spec actually shows that depth of surface area (real architecture changes, wide blast radius, multiple alternatives seriously weighed).

### Step 3 — Category 4 deserves real thought, not boilerplate

This is a runtime that renders on both a browser and two native mobile platforms, and performance regressions are exactly the kind of thing that slip through review because they don't show up in a code diff. For every test case in this category, be concrete about *how* it's actually checked — "monitor FPS via the RN Perf Monitor / Chrome DevTools Performance tab while X happens," "count renders with a render-counter/React DevTools Profiler across N prop updates and assert it stays at 1," "mount/unmount the widget N times and check memory doesn't grow unbounded" — not just "check performance is OK."

Pay particular attention to **multi-render / max-render cases**: a widget whose prop is rebound on every parent re-render, or whose internal state updates trigger a fresh subscription/listener each time, can silently degrade a page over minutes of use. A useful test case here explicitly counts renders across a fixed sequence of interactions and asserts an upper bound, rather than eyeballing "did it feel slow."

### Step 4 — Write the report

Read `references/report-template.md` for the exact Markdown structure (summary table, per-category test case tables, columns: ID, Title, Priority, Platform(s), Preconditions, Steps, Expected Result, Linked Spec Section).

Save the report as `/Users/raajr_500278/raaj-wm/plans/<JIRA-ID>-<short-slug>-testcases.md` — same directory and naming convention as the spec/plan doc, so the two live side by side and are easy for the team to find together at standup review.

## Quick recap checklist

- [ ] Spec/plan doc read (or explicitly noted as missing, with an offer to generate one first)
- [ ] OKR/sub-tasks cross-checked, if they exist
- [ ] Claims about current behavior grounded in **local codegen / runtime repo files with `file:line` citations**, not assumed from the spec alone and not from MemoryLayer or graphify
- [ ] Scope stayed inside the reported issue/enhancement/feature — any thread that drifted outside it was logged as out-of-scope, not turned into a test case (Core Philosophy, rule 1)
- [ ] Report depth matches the change's actual size — simple/contained changes got a simple/short report, not padded-out maximal coverage (Core Philosophy, rule 2)
- [ ] What-if investigation run per category, chasing each thread until two consecutive follow-ups produce nothing new (or the thread leaves scope) — logged in the report's Investigation Log, including dismissed scenarios and why
- [ ] All 7 categories covered, or explicitly marked N/A with a reason
- [ ] Category 4 (Runtime Performance) test cases specify *how* each is measured, not just "check performance"
- [ ] At least one multi-render/max-render test case included, with a concrete render-count assertion
- [ ] Test case steps are specific and executable (no discovery-phrasing here — that rule belongs to Sprintly sub-tasks, not this report)
- [ ] Report saved alongside the spec doc under `/Users/raajr_500278/raaj-wm/plans/`
