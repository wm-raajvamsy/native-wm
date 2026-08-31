# App Design Template

Save as `/Users/raajr_500278/raaj-wm/plans/<ticket-id>-app-design.md`.

```markdown
# <Ticket-ID>: <Title> — App Design

**Source spec:** `<ticket-id>-plan.md`
**Source test-cases report:** `<ticket-id>-testcases.md`
**Type:** Bug | Feature | Enhancement
**Scope:** <one line — the reported issue/enhancement/feature's boundary, same as the test-cases report's Scope line>

> **Handoff note:** This document IS the Design Plan + Layout Plan for this ticket's repro/test app — authored directly, not reverse-engineered from a screenshot. To build it, invoke `screenshot-to-wavemaker-mobile` (or `figma-to-wavemaker-mobile`) starting at **STEP 2 (Generate Variables)**, treating this doc's widget hierarchy and states as the already-resolved Phase 1 analysis / STEP 0 / STEP 1 output. Do not re-run visual analysis — there is no screenshot; this document is the source of truth for what to build.

## Page Count Decision

<One or two sentences: how many pages, and why. Default is one page — justify anything more by pointing to the specific multi-page nature of the feature itself, not "for completeness.">

## Reproduction & Coverage Map

Every test case from the test-cases report gets a row. No row is dropped — a test case that can't be exercised via UI gets an explicit alternate-verification note instead.

| Test Case ID | Page / Section | Widget(s) + State | Sample Data Needed | Reproducible via UI? |
|---|---|---|---|---|
| TC-<ID>-FUNC-001 | | | | Yes |
| TC-<ID>-EDGE-001 | | | | Yes |
| TC-<ID>-PERF-002 | — | — | — | No — verified via <method, e.g. bundle-size diff / render-counter script>, not through the built page |

## Page 1: <Page Name>

**Purpose:** <one line, tied to the spec's issue/intent>

**Widget hierarchy:**
```
<Real WaveMaker widget names, nested to show structure —
e.g.:
wm-page
└── wm-container (direction=column)
    ├── wm-list (direction=row) — icon showcase
    │   └── wm-listtemplate
    │       └── wm-icon
    ├── wm-container — "invalid icon name" demo section
    │   └── wm-icon (bound to a deliberately-unknown name)
    └── wm-container — camera/scan action icon demo
        └── wm-button (iconclass=...)
>
```

**States / variants needed** (each tied to a Reproduction Map row):
- <State 1 — e.g. "icon list bound to every distinct icon name in current use, to exercise TC-<ID>-EDGE-001">
- <State 2 — e.g. "one icon bound to an unrecognized name, to exercise TC-<ID>-SEC-001">

**Sample data spec:**
- <Variable name, fields, how many entries, and WHICH entries are the deliberate edge cases and why>

**Cross-platform notes:**
- <Anything from the test-cases report's Cross-Platform Matrix that needs a specific note for this page>

<!-- Repeat "## Page N: <Name>" for additional pages, only if Page Count Decision above justified more than one. -->

## Out-of-Scope / Not Reproducible via UI

<List anything from the test-cases report intentionally not represented in this app design, with a one-line reason each — mirrors the test-cases report's own N/A-with-reason discipline.>
```
