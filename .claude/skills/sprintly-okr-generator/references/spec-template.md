# Spec Doc Template

Save the filled-in doc as `/Users/raajr_500278/raaj-wm/plans/<JIRA-ID>-<short-slug>-plan.md`.

Below each heading in the template is a one-line note on what makes that answer useful — not filler for filler's sake. Delete the notes when you fill in the real content; they're guidance for you, not for the reader.

```markdown
# <JIRA-ID>: <Title>

**Type:** Bug | Feature | Enhancement
**Assignee:** <team member>
**Priority:** Low | Medium | High

## 1. Issue / Request
What is the issue/enhancement/feature?
<!-- One or two sentences. If you can't state this crisply, you don't understand the ticket yet — go re-read it or ask. -->

## 2. Intent
What do they want exactly? What are they looking for?
<!-- The actual underlying need, which is sometimes different from the ticket's literal wording. -->

## 3. Current Codebase Status
What is the current status of the codebase, related to this?
<!-- Grounded against real code (rn-codegen-mars / rn-runtime-mars for WaveMaker work, or the actual repo otherwise) — not inferred or assumed. State what exists today and what's missing/broken. -->

## 4. Plan
What is the plan?
<!-- The chosen approach, in plain terms, before diving into file-level detail. Apply the low-code philosophy here: scope this to what's actually valuable to a low-code app builder, not to everything upstream makes technically possible. -->

## 5. Files Affected
Which files will change?
<!-- Internal research only — this list does NOT get pasted into Sprintly sub-task text. It's here so the reviewer (and you) can sanity-check scope. -->

## 6. Fix Approach
How to write the fix?
<!-- The technical approach — enough detail that another engineer could implement it, but this is still a plan doc, not a diff. -->

## 7. Considerations
What to consider while writing?
<!-- Constraints, gotchas, conventions/patterns already used elsewhere in the codebase that this should match. -->

## 8. Architecture-Level Changes
What kind of arch-level changes happen?
<!-- Anything beyond a local, contained fix — new data flow, new dependency, structural change to a widget/service/module. If none, say "None — contained fix" rather than leaving this blank. -->

## 9. Edge Cases
What are the edge cases?
<!-- Enumerate concretely. "Handle edge cases" is not an edge case. -->

## 10. Runtime Performance Impact
This is a widget runtime shipping to both web and native — a change cheap on one platform can be expensive on another, and these problems only show up once something is actually running. Answer each sub-question; write "N/A — reason" rather than leaving one blank.
- Will there be any performance issues (CPU / JS-thread / main-thread load)?
- Will there be any FPS / frame-drop issues (animations, scrolling, media playback)?
- Will there be any visible visual lag or jank?
- Will there be any memory leaks (listeners, subscriptions, native objects not disposed on unmount)?
- Will render times be impacted (first render and re-render cost)?
- Will JS bundle size or app binary size grow meaningfully?
- Will cold-start / initial load time be impacted?
- Any battery or network/bandwidth impact on mobile?
- How does this behave at scale — many instances of this widget on one page, or inside a repeating container/list?
- Is performance consistent across Web, Android, and iOS, or does one platform lag behind?

## 11. Impact
What will be the impact? (blast radius — other widgets/components/consumers affected)

## 12. Alternative Approaches
What are all the possible ways to fix this?
<!-- At least one alternative to the chosen plan, even if it's clearly worse — the comparison in section 13 is what earns trust in the choice. If a smaller-surface-area option exists that adopts less of the upstream feature for the same customer value, it belongs here (low-code philosophy). -->

## 13. Pros / Cons
| Approach | Pros | Cons |
|---|---|---|
| Option A | | |
| Option B | | |

## 14. Backward Compatibility
Is it backward compatible?
<!-- If not, what breaks and who needs to know (e.g. existing published apps need a rebuild). -->

## 15. Verification Approach
How to verify this fixes it?
<!-- The specific check(s) unique to this ticket — beyond the standard checklist in section 16. -->

## 16. Mandatory Verifications
- [ ] Stage / WMO
- [ ] Web Preview
- [ ] Mobile Preview (Expo Go Android & iOS → expo prebuild → native builds Android & iOS)
- [ ] Builds
- [ ] Performance spot-check on a representative device (not just simulator/emulator) if section 10 flagged any real risk
- [ ] Ticket-specific verification (from section 15)

## Flow Diagram
<!-- Mermaid — include only if the architecture/logic genuinely warrants it. A one-line config change doesn't need one. -->
```

## Lightweight alternative: bug/regression investigation report

Use this instead of the full 16-question template only when the work is a closed investigation that already found a root cause — not for planning new work where a fix approach still needs to be chosen (that still needs the full template, especially sections 12/13).

```markdown
# <JIRA-ID>: <Title> — Investigation Report

**What broke:**
**Root cause:**
**When/how it was introduced:**
**The fix:**
**How it was verified:**
```

No flow diagram required unless the bug is architecturally complex enough to need one.
