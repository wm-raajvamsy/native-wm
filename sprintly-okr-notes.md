# Sprintly & OKR Generation — Rules, Preferences, Context

_Compiled from MemoryLayer namespace `RAAJ-WM`, 2026-07-16._

## Sprintly (internal sprint-planning app)

- Dev Lead tool with pages: Dashboard, Sprints, My OKRs, My Team, Reviews, Backlog, Releases.
- **My Team** tracks direct reportees' sprint delivery (This Sprint completion %, backlog count, trend) and lets the lead assign OKRs per teammate.
  - Current reportees on record: Izhan Ali (Developer), Premkumar Katta (Developer), RanjithKumar Seekolu (Developer).
- **Assign OKR** modal (from My OKRs page — "Assign OKR" or "Assign to Self"):
  - Priority: Low / Medium / High
  - Type: Enhancement / Feature / Bug (etc.)
  - QA Lead (optional)
  - Assign to (locked to chosen member)
  - Objective (free text)
  - Planned Release Version (optional, links to Releases workspace)
  - Due date (must fall within the current sprint's date range)
  - TODO sub-tasks (each with title + description/notes, added via "Add TODO")
- Once created, the OKR appears under the member's card as a task with title, tag (Bug/Enhancement/Feature), due date, status, and an expandable "Show Tasks" section listing sub-tasks as checkboxes, rolling up progress as "X done · Y open" + completion %.

## OKR Generation Workflow (triggered by a JIRA task)

**Trigger:** A task comes in with a JIRA ID → OKR generation starts → the OKR is assigned to a person on the team.

**Step 1 — Classify.** Decide whether the JIRA task is a **Bug**, **Feature**, or **Enhancement**. This classification drives the `Type` field in Sprintly's Assign OKR modal.

**Step 2 — Produce a detailed plan/spec.** Before the OKR/sub-tasks are written, produce a full spec that answers every question below. This is the same question set for Bug, Feature, and Enhancement — the depth of the answer varies by type, but no question is skipped for any type.

1. **What is the issue / enhancement / feature?** — plain statement of the problem or request.
2. **What do they want exactly? What are they looking for?** — the actual ask/intent behind the JIRA ticket, not just the ticket title.
3. **What is the current status of the codebase, related to this?** — grounded against `rn-codegen-mars` / `rn-runtime-mars` (per the namespace-routing rule below) — actual current behavior/files/state, not assumed.
4. **What is the plan?** — the overall approach.
5. **Which files will change?** — concrete file list (internal research only — see rule 4 below on how this surfaces in sub-task text).
6. **How to write the fix?** — the technical approach/implementation detail.
7. **What to consider while writing?** — constraints, gotchas, style/pattern conventions to follow.
8. **What kind of architecture-level changes happen?** — any structural/design impact beyond a local fix.
9. **What are the edge cases?**
10. **What is the runtime performance impact?** — this ships to both web and native, so cover: performance/CPU issues, FPS/frame-drop issues, visual lag/jank, memory leaks (listeners/subscriptions/native objects not disposed), render-time impact (first render + re-renders), JS bundle/app binary size growth, cold-start/load-time impact, battery/network impact on mobile, behavior at scale (many instances or inside a repeating container/list), and cross-platform performance parity (Web vs Android vs iOS).
11. **What will be the impact?** — blast radius: other widgets/components/consumers affected.
12. **What are all the possible ways to fix this?** — enumerate alternative approaches.
13. **What are the pros and cons of each?** — trade-off comparison across the alternatives from Q12.
14. **Is it backward compatible?**
15. **How to verify this fixes it?** — the specific verification approach for this ticket.
16. **What are all the mandatory verifications we have to do?** — the standard checklist (Stage/WMO, Web Preview, Mobile Preview, Builds — see [Standard Verification Checklist](#standard-verification-checklist-used-in-run-and-verify-it-works-sub-tasks)), a performance spot-check on a real device if Q10 flagged risk, plus anything ticket-specific.

This spec is the deliverable of the "plan before OKR" rule (below) for JIRA-triggered work — same mandatory doc-first, team-reviewed-at-standup process applies before the OKR itself gets created in Sprintly.

**Step 3 — Create the OKR.** Once the spec is finalized (reviewed/edited per standup feedback), generate the OKR and sub-tasks in Sprintly per the rules below, and assign to the relevant team member.

### Spec Doc Template

Save as `/Users/raajr_500278/raaj-wm/plans/<JIRA-ID>-<short-slug>-plan.md`.

```markdown
# <JIRA-ID>: <Title>

**Type:** Bug | Feature | Enhancement
**Assignee:** <team member>
**Priority:** Low | Medium | High

## 1. Issue / Request
What is the issue/enhancement/feature?

## 2. Intent
What do they want exactly? What are they looking for?

## 3. Current Codebase Status
What is the current status of the codebase, related to this?
(grounded against `rn-codegen-mars` / `rn-runtime-mars`)

## 4. Plan
What is the plan?

## 5. Files Affected
Which files will change?
(internal research only — do not paste this list into sub-task text, see rule 7 below)

## 6. Fix Approach
How to write the fix?

## 7. Considerations
What to consider while writing?

## 8. Architecture-Level Changes
What kind of arch-level changes happen?

## 9. Edge Cases
What are the edge cases?

## 10. Runtime Performance Impact
This is a widget runtime shipping to both web and native — a change cheap on one platform can be expensive on another.
- Will there be any performance issues (CPU/JS-thread/main-thread load)?
- Will there be any FPS/frame-drop issues (animations, scrolling, media playback)?
- Will there be any visible visual lag or jank?
- Will there be any memory leaks (listeners/subscriptions/native objects not disposed on unmount)?
- Will render times be impacted (first render + re-render cost)?
- Will JS bundle size or app binary size grow meaningfully?
- Will cold-start/initial load time be impacted?
- Any battery or network/bandwidth impact on mobile?
- How does this behave at scale — many instances on one page, or inside a repeating container/list?
- Is performance consistent across Web, Android, and iOS, or does one platform lag behind?

## 11. Impact
What will be the impact? (blast radius — other widgets/components/consumers)

## 12. Alternative Approaches
What are all the possible ways to fix this?

## 13. Pros / Cons
| Approach | Pros | Cons |
|---|---|---|
| Option A | | |
| Option B | | |

## 14. Backward Compatibility
Is it backward compatible?

## 15. Verification Approach
How to verify this fixes it?

## 16. Mandatory Verifications
- [ ] Stage / WMO
- [ ] Web Preview
- [ ] Mobile Preview (Expo Go Android & iOS → expo prebuild → native builds Android & iOS)
- [ ] Builds
- [ ] Performance spot-check on a representative device if Q10 flagged real risk
- [ ] Ticket-specific verification (from Q15)

## Flow Diagram
(Mermaid — include if architecture/logic warrants it, per the feature-report rule)
```

## OKR / Sub-task Creation Rules (hard rules — all corrections merged, confirmed 2026-07-13)

1. **Plan before OKR** (strong rule, applies to ANY feature, not just one-offs):
   - Produce a proper, presentable Markdown report/doc first — with Mermaid flow diagrams if the feature's logic/architecture warrants it.
   - Save under `/Users/raajr_500278/raaj-wm/plans/<feature-name>-plan.md` (convention: `plans/expo-video-feature-plan.md`).
   - This doc is reviewed by the team at standup; Raaj edits based on feedback. Only the **final reviewed plan** is used to create the OKR.
   - The plan must exist as a shareable file/doc — not just chat text or memory content.
   - OKR creation is the *last* step in feature adoption, never the first. Check edge cases / "what if" scenarios during planning before drafting the OKR.
   - **For JIRA-triggered work specifically**, this rule's concrete deliverable is the [Spec Doc Template](#spec-doc-template) above — the same doc-first, team-reviewed-at-standup process, applied via the standardized 15-question set uniformly across Bug/Feature/Enhancement.

2. **Investigation/bug/regression reports** (distinct, lighter-weight — confirmed 2026-07-14):
   - When an investigation into a bug/regression concludes with a root cause found, produce a simple report: what broke, root cause, when/how introduced, the fix, and how it was verified.
   - No flow diagrams required unless the bug is architecturally complex.

3. **Sub-task writing style** (all corrections merged, 2026-07-13):
   - Plain, jargon-free words — assume the OKR will be assigned to a junior developer. Spell out what to do and why.
   - Sub-tasks must be **developer work items** ("find and fix the code", "update the config") — NOT QA/verification checklist items phrased as pure test-and-confirm steps.
   - Flat list of simple sub-tasks (checkboxes) under one main task — no nested Objective/Key-Result jargon.
   - End-to-end environment coverage (Stage/WMO, Web Preview, Mobile Preview, Builds) folded into the developer's own final steps, not separate QA sign-offs.
   - **Always** include a standalone **"Check unit tests are updated"** sub-task.
   - **Always** include a separate, final **"Run and verify it works"** sub-task.
   - (4) and (5) above are mandatory in every OKR, regardless of type.
   - **Strong rule**: even though the agent should research and confirm exact files/lines internally before writing the OKR (to validate scope/feasibility), sub-task **text must NOT hand the developer exact file names, line numbers, or pre-found answers**. Phrase sub-tasks as discovery/investigation steps the developer does themselves.
     - Bad: "In icon.component.tsx line 3, change X to Y."
     - Good: "Find every place the old package is used — search the project for X, there are at least N spots including the Icon widget and Camera/Scan widgets — confirm there aren't more by checking the actual import lines yourself."
   - Raaj explicitly reverted a spoon-fed version back to this discovery-style phrasing and asked this be made a strong rule.

4. **Namespace routing for technical grounding**:
   - Always ground technical sub-tasks against the **`rn-codegen-mars`** and **`rn-runtime-mars`** namespaces when the task involves WaveMaker widgets/codebases.
   - Never invent details — check the actual code.
   - Never create new/alternate namespaces for WaveMaker code work; this is a hard routing preference.

## Standard Verification Checklist (used in "Run and verify it works" sub-tasks)

1. Web preview (`web-preview` command)
2. Mobile preview: `sync` command → Expo Go → check Android & iOS → `expo prebuild` → native builds → check Android & iOS again
3. Mobile builds: `build` command → check Android & iOS builds

(Full command details live in the `wm-rn-cli` namespace.)

## Core Philosophy (mandatory — applied to every ticket, not background reading)

- WM is a low-code platform — the team does **not** adopt every upstream Expo/React Native (or other dependency) feature. They selectively pick whatever is easy/valuable for customers in a low-code context.
- **This is mandatory, not a footnote:** it applies to any ticket under consideration — Bug, Feature, or Enhancement alike, not just SDK releases — and must be applied explicitly while answering spec Q4 (Plan) and Q12 (Alternative Approaches). "Upstream/the library supports X" is not the same question as "should this be exposed in a low-code property panel." If scope is being narrowed for this reason, say so in the spec rather than leaving it implicit.
- For bugs specifically: the fix should restore correct behavior, not become a vehicle for adding unrelated upstream features "while we're in there" — that's scope creep against this same principle.
- Plan first (incl. edge cases), then OKR — never the reverse.
- Namespaces are used as a working notebook for architecture decisions, specs, and open questions — not just an index of ingested code. They're expected to be reloaded and built on across sessions, not treated as one-off scratch space.

## Draft OKR: Video Widget Crashes on Preview (in-flight, not yet entered into Sprintly)

Drafted 2026-07-13, in Sprintly's Assign-OKR field format. Priority: High. Type: Bug.

Key results:
1. Confirm root cause (videoService/VideoView undefined-guard gap in WmVideo.renderWidget vs expo-video native module registration under Expo Go).
2. Add fallback guard instead of crashing.
3. Verify expo-video registration across Expo Go vs dev-client/prebuild.
4. Null-check videoSource in initializePlayer.
5. Verify per standard checklist (web preview → Expo Go Android/iOS → expo prebuild → native builds Android/iOS).
6. Add regression test coverage (currently zero).

Status: drafted only — not yet entered into Sprintly (no URL/browser access at time of drafting).

## expo-video Feature Plan v2 (2026-07-13, per "plan before OKR" rule)

Confirmed 7-feature scope: PiP, Dynamic Thumbnails, Playback Button Options, Subtitles, ContentType (HLS/DASH), Background Play, Caching Videos. Audio/Camera expo-av migration explicitly excluded — tracked as a separate future OKR.

**Changelog context (SDK 52-56):** SDK52 introduced expo-video replacing expo-av Video. SDK53/54 no expo-video changes. SDK55 confirmed expo-av removal with migration path to expo-audio + expo-video, and added seekTolerance/scrubbingModeOptions, Android PiP refactor for multiple VideoView instances, averageBitrate/peakBitrate replacing bitrate, audio/subtitle tracks gaining name/isDefault/autoSelect, new Android PlayerBuilderOptions/buttonOptions, iOS async loading perf, allowsFullscreen removed in favor of fullscreenOptions.enable. SDK56 no expo-video changes.

**Current codebase status:** WmVideo (`rn-runtime-mars` video.component.tsx) exposes only mp4format/webmformat, videoposter, showdefaultvideoposter, controls, autoplay, allowsPictureInPicture, requiresLinearPlayback, onFullscreenEnter/onFullscreenExit — a thin slice predating SDK55 additions. Known open bug: renderWidget doesn't guard undefined videoService/VideoView, crashes on preview (tracked as its own OKR, above). **Critical related risk:** WmAudio (audio.component.tsx) is built on the old expo-av Sound API, and Camera.getPreviewTemplate (camera-service.tsx) uses expo-av's Video component for captured-clip playback — both depend on expo-av, which SDK55 removes. This is a forcing migration, not optional scope, and should be planned alongside/before new expo-video feature adoption.

**Codegen-side findings (`rn-codegen-mars`):** AppGenerator.updateAppJsonWithExpoVideoPlugin (app.generator.ts:1447) already auto-injects `{"supportsBackgroundPlayback":true,"supportsPictureInPicture":true}` into app.json's expo-video config plugin whenever expo-video is present — native plumbing for PiP and Background Play already exists, only runtime properties are missing. EsBuilder.patchExpoVideo (esbuild.script.js:365) already patches expo-video's compiled build output, rewriting `{ VideoThumbnail }` to `{ default as VideoThumbnail }` because expo-video ships a broken export for its thumbnail feature — this patch is regex-based and version-fragile, must be version-pinned with a fail-loud check.

**Per-feature plan:**
1. **PiP** — allowsPictureInPicture already exposed; add startsPictureInPictureAutomatically + wire onPictureInPictureStart/Stop events; test multi-instance-on-one-page (SDK55 Android PiP refactor targeted this) and PiP-during-page-navigation teardown.
2. **Thumbnails** — expose generateThumbnailsAsync as an action; guard against calling on unready/live sources; pin+monitor the patchExpoVideo build patch.
3. **Playback Button Options** — buttonOptions is Android-only upstream; needs a new multi-select-style WM property, must decide iOS/Web no-op vs hide, force at least play/pause visible.
4. **Subtitles** — zero runtime code today; expose subtitleTrack/availableSubtitleTracks + subtitleTrackChange; sequence AFTER ContentType since most real subtitle tracks come from HLS/DASH manifests, not plain MP4.
5. **ContentType (HLS/DASH)** — structural change: WmVideo currently only takes flat mp4format/webmformat URLs, no source-object/contentType-hint concept; must decide URL-extension vs explicit-hint precedence; CONFLICTS with Caching — Expo docs confirm cache cannot be used with HLS sources on iOS, must block or clearly no-op that combination.
6. **Background Play** — native config already injected unconditionally for any app with expo-video; expose staysActiveInBackground + showNowPlayingNotification with title/artwork metadata; flag that existing published apps need a rebuild to get this; check for unintended side effects (e.g. iOS review prompts) on apps that never wanted background audio.
7. **Caching** — app-level/global concern (setVideoCacheSizeAsync/getCurrentVideoCacheSize/clearVideoCacheAsync), not a per-widget property; must handle the HLS-on-iOS no-op/rejection path from ContentType.

**Edge cases identified:** dual mp4/webm source unsupported-format fallback; loop+autoplay+poster interaction; playbackRate on live streams; staysActiveInBackground without matching native config; multiple WmVideo instances in a repeating container (players leaking/colliding); switching source mid-playback (replace() vs remount); thumbnail generation while source still loading; web vs native no-ops for background/PiP/thumbnails needing property-panel hiding or docs.

**Unit tests planned:** initializePlayer edge cases (missing service/source/normal), playbackRate set + clamp/invalid handling, loop toggle mid-playback, volume/mute two-way binding, thumbnail generation success/error mocks, background playback native-config-presence check.

**Cross-cutting:** every feature needs matching studio property panel + codegen template updates (two-repo pattern); need an explicit per-feature Web-parity matrix (several of these 7 are native-only or platform-limited); the WmVideo crash bug should be fixed first since new properties multiply that bug's surface area.

## Example OKR (as Raaj created it in Sprintly)

Main task: **"Video Widget is not working"** (Bug, due 16 Jul)
Sub-tasks:
- Verify in Stage and WMO environments
- BUG: Video Component is not rendering - need to Fix
- Verify - Props and Callback/Events
- Verify Web Preview
- Verify Mobile Preview
- Verify Builds
