# Test Cases Report Template

Save as `/Users/raajr_500278/raaj-wm/plans/<JIRA-ID>-<short-slug>-testcases.md`, alongside the spec/plan doc for the same ticket.

ID scheme: `TC-<JIRA-ID>-<CATEGORY>-<NNN>`, category codes: `FUNC`, `EDGE`, `SEC`, `PERF`, `SCALE`, `PLAT`, `REGR`.

```markdown
# <JIRA-ID>: <Title> — Test Cases Report

**Source spec:** `<JIRA-ID>-<short-slug>-plan.md`
**Type:** Bug | Feature | Enhancement
**Grounded against:** local codegen repo `<path>`, local runtime repo `<path>` — read directly, `file:line` cited per claim
**Scope:** <one line stating the reported issue/enhancement/feature's actual boundary, pulled from spec Q1/Q2/Q11 — this is what "in scope" means for every case below>

<!-- Report size should match the change's actual size (Core Philosophy, rule 2) — a contained bug fix should produce a short report, not padded-out maximal coverage. Don't apologize for a short report if the change genuinely doesn't warrant more; a correctly-scoped short report is the goal, not a failure to be thorough. -->

## Summary

| Category | # Cases | Notes |
|---|---|---|
| Functional / Happy Path | | |
| Edge Cases | | |
| Security / Hacks / Bypass | | |
| Runtime Performance | | |
| Scale & Concurrency | | |
| Cross-Platform / Environment | | |
| Backward Compatibility / Regression | | |

<!-- If any row is 0, replace the Notes cell with a one-line reason ("N/A — pure text-label change, no realistic security surface"), never leave it silently empty. -->

## Investigation Log

<!-- The record of the Step 1.5 what-if interrogation — every thread chased, not just the ones that turned into test cases. A "what if" that got silently dropped is indistinguishable from one that was never asked; this table is what makes the thoroughness checkable by a reviewer instead of just asserted. Chain follow-ups by nesting/indenting under the parent question. -->

| # | What-if Question | Reasoning / Answer | Outcome |
|---|---|---|---|
| 1 | | | → TC-\<ID>-\<CAT>-001 |
| 1.1 | (follow-up to #1) | | → TC-\<ID>-\<CAT>-002 |
| 2 | | | Dismissed — \<reason, e.g. "not reachable given current architecture"> |

## 1. Functional / Happy Path

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-FUNC-001 | | P0-P3 | | | | | |

## 2. Edge Cases

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-EDGE-001 | | | | | | | |

## 3. Security / Hacks / Bypass Attempts

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-SEC-001 | | | | | | | |

## 4. Runtime Performance

<!-- "Steps" here must name the measurement method (RN Perf Monitor, render counter, DevTools Profiler, mount/unmount loop, etc.), not just describe the interaction. -->

| ID | Title | Priority | Platform(s) | Measurement Method | Steps | Expected Result / Threshold | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-PERF-001 | | | | | | | |

## 5. Scale & Concurrency

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-SCALE-001 | | | | | | | |

## 6. Cross-Platform / Environment Matrix

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-PLAT-001 | | | | | | | |

## 7. Backward Compatibility / Regression

| ID | Title | Priority | Platform(s) | Preconditions | Steps | Expected Result | Spec Ref |
|---|---|---|---|---|---|---|---|
| TC-<ID>-REGR-001 | | | | | | | |

## Open Questions / Assumptions

<!-- Anything the spec didn't resolve that affects test scope (e.g. "spec left multi-language subtitle tracks unconfirmed as in/out of scope — test cases here assume single-track only until confirmed"). -->
```

## Column notes

- **Priority**: P0 (blocks release / core functionality broken) through P3 (nice-to-verify, low risk if skipped).
- **Platform(s)**: be explicit — "Web only," "Android + iOS native builds," "All (Web/Android/iOS, Expo Go + native build)." Don't write "Mobile" when the case actually needs both platforms tested independently, since behavior can diverge between them.
- **Spec Ref**: which spec-doc question this case traces back to (e.g. "Q9 edge case #3," "Q10 render-count concern") — this is what lets a reviewer confirm every spec concern actually got a test case, and catches anything from the taxonomy that the spec itself missed. Where a case came from the what-if investigation instead of directly from the spec, reference the Investigation Log row number (e.g. "Investigation #4.2") so the two documents stay traceable to each other.
