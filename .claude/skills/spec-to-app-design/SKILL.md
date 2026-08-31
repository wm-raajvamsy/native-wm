---
name: spec-to-app-design
description: Turns a finished spec/plan doc and its test-cases report into a WaveMaker App Design — a page-by-page, widget-by-widget design brief (single- or multi-page) that reproduces the reported issue/enhancement/feature and exercises every test case from the test-cases report. This is the WaveMaker Design-Plan/Layout-Plan equivalent, authored directly in widget terms rather than reverse-engineered from a screenshot — it's meant to be handed to the screenshot-to-wavemaker / figma-to-wavemaker skills afterward to actually build the page(s) in the template project, so the issue/feature can be reproduced, tested, and verified fixed on both Web and Mobile. Use this once a spec (from sprintly-okr-generator) and a test-cases report (from spec-to-testcases) both exist and the user wants an "app design", "demo app", "repro app", "test app", "sample app" for a ticket, or asks to "build something to reproduce this" / "create a page to test this" / "design an app for this issue". This is a downstream, chained skill — it expects both the spec and the test-cases report to already exist; if either is missing, offer to run sprintly-okr-generator / spec-to-testcases first rather than guessing at scope.
---

# Spec-to-App-Design

## Where this sits in the chain

```
JIRA ticket
   │  sprintly-okr-generator
   ▼
Spec/plan doc + OKR
   │  spec-to-testcases
   ▼
Test-cases report
   │  spec-to-app-design  (this skill)
   ▼
App Design  (WaveMaker widget-level Design Plan + Layout Plan)
   │  screenshot-to-wavemaker-mobile / figma-to-wavemaker-mobile
   │  (resumed from STEP 2 onward — variables → tokens → markup)
   ▼
Actual page(s) built in the template project
   │
   ▼
Reproduce the issue → apply the fix → re-verify against the same App Design + test cases
```

This skill's output is NOT a screenshot and NOT markup. It's the same kind of artifact `screenshot-to-wavemaker-mobile`'s STEP 0 (Design Plan) and STEP 1 (Layout Plan) produce — except authored directly from the spec and test cases instead of reverse-engineered by looking at an image, because there is no image yet. The whole point is to skip the "guess the design from a screenshot" step entirely: you already know exactly what needs to exist, because the spec and test cases already say so.

## Core philosophy — mandatory lens, not background reading

Same two rules as `sprintly-okr-generator` and `spec-to-testcases`, applied to app design specifically:

**1. Scope discipline — design only what's needed to reproduce and test THIS issue/enhancement/feature.** The boundary is the spec's Q1/Q2 (issue/intent) and Q11 (impact/blast radius), and every widget/state/page in the design must trace back to either the spec or a specific test case in the test-cases report. Do not add screens, flows, or widgets that would make a "nicer demo app" but aren't needed to exercise the reported issue or its test cases — that's the same scope-creep failure mode `sprintly-okr-generator` guards against in implementation and `spec-to-testcases` guards against in test coverage, now showing up as an over-built demo app.

**2. Proportional depth — page count matches the change's actual shape.** A contained bug fix (spec Q8 "None expected" architecture change) needs exactly enough UI to put the affected widget in every state its test cases require — usually **one page**. A genuinely multi-step feature (a wizard, a multi-page flow) needs multiple pages **only because the feature itself is multi-page**, not because more pages look more thorough. If you find yourself adding a second page "for completeness," stop and check whether every test case on it could instead be a second section/state on page one.

**3. WM low-code philosophy — use real WaveMaker widgets, don't invent custom UI.** Every widget choice in the design must be a genuine WaveMaker widget (per `widget-detection` and `components-list` from the `native_mobile` skill family), selected because it's the correct semantic widget for the pattern — not a generic container styled to look like something, and not a novel composition when a stock widget already does the job. This app design is meant to flow straight into `screenshot-to-wavemaker-mobile`/`figma-to-wavemaker-mobile` at STEP 2 onward, so its widget vocabulary must already match theirs exactly.

## Inputs (both required)

1. **The spec/plan doc** — for the issue/intent (Q1/Q2), current codebase status (Q3), files/widgets affected (Q5), architecture-level changes (Q8, your proportionality signal), edge cases (Q9), and backward compatibility (Q13).
2. **The test-cases report** — every test case across all 7 categories (Functional, Edge, Security, Performance, Scale, Cross-Platform, Regression) is a candidate requirement for the app design: something the built page(s) need to be able to exhibit or exercise once real.

If either is missing, say so and offer to generate it first (`sprintly-okr-generator` for the spec, `spec-to-testcases` for the report) rather than inventing scope from a bare ticket description.

## Workflow

### Step 1 — Read both inputs, extract what actually needs building

From the spec: the issue/intent, the widget(s)/component(s) involved, and the architecture scope (this is your proportionality signal — read it before deciding page count).

From the test-cases report: walk every category, every test case. For each one, ask **"what screen, widget, and state would let a human actually go and try this?"** Not every test case can be exercised through UI alone (e.g. a build-tooling regeneration check, or a bundle-size measurement) — those get marked **not reproducible via app UI** with a one-line note on how they're actually verified instead, rather than inventing a fake widget just to claim coverage. This mirrors `spec-to-testcases`'s own rule about marking things N/A with a reason instead of leaving them silently uncovered.

### Step 2 — Decide page count and scope (Core Philosophy rule 2)

Default to **one page** unless the spec's own nature requires more (a wizard, a multi-step checkout, a navigation flow that's the actual subject of the ticket). Write down the reasoning in one line — this is the same discipline as `spec-to-testcases`'s Scale & Concurrency category legitimately coming back N/A: a single-page answer is often the *correct*, well-scoped one, not an incomplete one.

### Step 3 — Build the Reproduction & Coverage Map

This is the core deliverable that keeps the design honest: a table mapping every test case to exactly where and how it's exercised. Read `references/app-design-template.md` for the full template. Columns: Test Case ID → Page/Section → Widget(s) + State → Sample Data Needed → Reproducible via UI? (yes / no + alternate verification note).

No test case gets silently dropped — if it's out of the UI's reach, it's marked so explicitly, the same way `spec-to-testcases`'s Investigation Log logs a dismissal instead of a silent omission.

### Step 4 — Per-page Widget Design (the actual Design Plan + Layout Plan)

For each page decided in Step 2, write:
- **Purpose** — one line, tied to the spec's issue/intent.
- **Widget hierarchy** — real WaveMaker widget names (`wm-icon`, `wm-list`, `wm-form`, `wm-video`, etc.), chosen per `widget-detection`'s visual-pattern rules — not prose descriptions of "a card-like thing," an actual widget. Nest them the way `container-system`'s layout algorithm would (direction, rough grouping) — you don't need exact `gap`/`padding` values (that's STEP 4 markup's job later), but the structure must already be unambiguous to whoever runs the markup step next.
- **States / variants needed** — every distinct state a test case requires (e.g. "one list row bound to a valid icon name, one row bound to an unknown icon name" to exercise a security test case; "list of 50 items" to exercise a scale test case). Tie each state back to its Reproduction Map row.
- **Sample data spec** — what the eventual `variables` step will need: field names, how many entries, and which entries specifically need to be the deliberately-broken/edge-case ones (don't just say "15 diverse entries" — say which ones are the ones that matter and why).
- **Cross-platform notes** — anything from the test-cases report's Cross-Platform/Environment Matrix that needs a specific note here (e.g. "this page must be checked on both Expo Go and a native build, since the font-linking difference is the actual risk").

### Step 5 — Explicit handoff note

State plainly, at the top of the saved doc, that this **is** the Design Plan + Layout Plan — whoever picks this up next should invoke `screenshot-to-wavemaker-mobile` or `figma-to-wavemaker-mobile` starting from **STEP 2 (Generate Variables)**, treating this document's widget hierarchy and states as the already-resolved output of that skill's Phase 1 analysis, STEP 0, and STEP 1. Do not re-run visual analysis on a screenshot — there isn't one; this document is the source of truth for what to build.

### Step 6 — Save

Save as `/Users/raajr_500278/raaj-wm/plans/<ticket-id>-app-design.md` — same "issue workspace" directory as the spec/OKR/test-cases report for this ticket, so all four documents live together.

## Quick recap checklist

- [ ] Both spec and test-cases report read (or explicitly noted missing, with an offer to generate first)
- [ ] Every test case accounted for in the Reproduction & Coverage Map — reproducible-via-UI ones mapped to a page/widget/state; non-reproducible ones marked with an alternate verification note, not silently dropped
- [ ] Page count is proportional to the change's actual shape (Core Philosophy rule 2) — one page by default, more only when the feature itself is multi-page
- [ ] Every widget named is a real WaveMaker widget chosen per `widget-detection`/`components-list`, not an invented composition (Core Philosophy rule 3)
- [ ] No screen, flow, or widget exists that doesn't trace back to the spec or a specific test case (Core Philosophy rule 1)
- [ ] Handoff note present, pointing the next step at `screenshot-to-wavemaker-mobile`/`figma-to-wavemaker-mobile` STEP 2 onward
- [ ] Saved alongside the spec/OKR/test-cases report under `/Users/raajr_500278/raaj-wm/plans/`
