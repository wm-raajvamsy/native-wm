# Test Case Taxonomy

Seven categories, every one of them expected to be *considered* on every report — not every one expected to come back full. Concrete examples below use real WM widget work (WmVideo, icon migration, camera) to show what "specific" looks like — don't just copy these, they're calibration, not a checklist to paste in.

Two things to hold in mind while working through these categories (see SKILL.md's Core Philosophy for the full reasoning):

- **Stay inside the ticket's boundary.** These categories are lenses for looking at the reported issue/enhancement/feature — not an invitation to go looking for problems in adjacent widgets or unrelated code you happen to notice along the way. If something outside scope catches your attention, note it as out-of-scope in the Investigation Log and move on.
- **Match depth to the actual change.** A one-line null-check fix and a new cross-platform feature are not the same size of problem, and their reports shouldn't be the same size either. The examples below (especially in Runtime Performance and Scale & Concurrency) are pulled from genuinely complex widget work — don't treat their depth as the minimum bar for every ticket.

## 1. Functional / Happy Path

The straightforward case: does the feature/fix do what the spec's Q1/Q2 (issue/intent) says it should, under normal conditions, on a normal device, with valid input.

**Example:** "Bind a valid `.vtt` subtitle URL to WmVideo, set `showcaptions=true`, play the video — captions render in sync with playback audio/video position."

## 2. Edge Cases

Boundary conditions and unusual-but-legitimate states — things a real user or a real app builder will eventually hit, without any adversarial intent.

- Empty / null / undefined values on a newly-added prop.
- Extremely long strings, extremely large numbers, zero, negative numbers where only positive is expected.
- First-run / first-mount state vs. steady-state.
- Last item in a list / only item in a list / zero items.
- A bound value changing *while* an async operation using the old value is still in flight (e.g. subtitle URL changes mid-fetch).
- Rapid legitimate interaction (double-tapping a toggle quickly, not as an attack, just as normal impatient use).

**Example:** "Change `subtitlesrc` to a new URL while the previous subtitle file is still being fetched — the old fetch's result must not overwrite state after the newer URL has already resolved (no stale-response race)."

## 3. Security / Hacks / Bypass Attempts

Adversarial input — someone (a malicious app builder, a compromised backend, a malformed upstream response) deliberately or accidentally feeding the widget something it shouldn't trust.

- **Malicious bound URLs**: `javascript:` URIs, `file://` paths reaching outside the sandbox, extremely long URLs, URLs with unexpected schemes.
- **Unsanitized bound text rendered on Web**: any prop that renders as HTML/text on web preview should be checked for script/HTML injection (XSS) if it isn't already escaped.
- **Malformed/fuzzed prop values**: wrong type entirely (object where a string is expected), deeply nested objects, circular references if the prop accepts an object.
- **Oversized payloads**: a huge subtitle file, a huge image, a video source that never resolves — does the widget hang, crash, or degrade gracefully?
- **Auth/token edge cases**: expired signed URLs, revoked tokens, a resource that returns 401/403 mid-playback rather than at load.
- **Path traversal**: any prop that's treated as a relative path/filename.
- **Race-condition exploitation**: deliberately firing overlapping state changes to see if an inconsistent state is reachable (not just the innocent edge-case version above — here the goal is specifically to find an exploitable gap).

**Example:** "Bind `subtitlesrc` to a URL returning a 10MB malformed (non-WebVTT) text file — the widget must fail gracefully (no captions, no crash) rather than attempting to parse and hanging or throwing an unhandled error visible to the end user."

## 4. Runtime Performance

Say *how* each case is actually measured — a performance test case without a measurement method isn't a test case.

- **FPS / frame drops**: measured via RN Perf Monitor (native) or Chrome DevTools Performance tab (web) during the specific interaction that's expected to be heaviest (e.g. scrolling a list of widgets, an animation, video playback start).
- **Visual lag/jank**: time from user interaction (tap/toggle) to visible UI response, measured or at minimum explicitly timed, not eyeballed.
- **Memory leaks**: mount/unmount the component N times (e.g. 20-50) and check that memory returns to baseline rather than climbing — specifically check that listeners/subscriptions/native player-or-session objects are actually released, not just assumed to be by the framework.
- **Render time**: time-to-first-render and cost of a single re-render, ideally with a before/after comparison against the pre-fix baseline if this is a bug fix.
- **Multi-render / max-render storms**: count actual renders (via a render counter, `console.count` in a dev build, or React DevTools Profiler) across a fixed sequence of prop/state updates and assert an explicit upper bound — e.g. "binding X should cause exactly 1 re-render per value change, not N" or "toggling `showcaptions` on/off 10 times should not exceed 20 renders total." This is the category most likely to be skipped by "eyeballing it feels fine" — don't let it be.
- **JS-thread / main-thread blocking**: does any part of this run synchronously long enough to visibly freeze input handling?

**Example:** "Toggle `showcaptions` on and off 10 times in a row while a render counter is attached to the WmVideo component — assert total render count stays under an explicit threshold (e.g. ≤ 22 for 20 toggles + mount), confirming no re-render storm from the toggle handler."

## 5. Scale & Concurrency

What happens when there's more than one of something, or more than one thing happening at once.

- **Many instances**: the same widget repeated N times on one page, or inside a repeating container/list — confirm no cross-instance state leakage, no shared-resource collision (e.g. multiple video players competing for one native decoder slot), and that per-instance memory/FPS cost scales roughly linearly, not exponentially.
- **Rapid-fire interaction**: spam-tapping a toggle/button faster than the underlying async operation can complete — confirm no queue pile-up, no duplicate side effects, no crash.
- **Concurrent state mutation**: two different triggers (a user tap and a programmatic/bound-variable change) hitting the same state at nearly the same time.

**Example:** "Place 8 WmVideo instances inside a scrollable repeating container, each with a different source — scroll through all of them and confirm no crash, no audio bleed between instances, and that off-screen instances release their native player resources."

## 6. Cross-Platform / Environment Matrix

State explicitly which platforms *actually* need to run each case — don't assume web coverage implies native coverage or vice versa, since this runtime has genuinely different code paths (and sometimes genuinely different feature support) per platform.

- **Web** (react-native-web / Web Preview)
- **Android** — both Expo Go (managed) and a real prebuild/native build
- **iOS** — both Expo Go (managed) and a real prebuild/native build
- **Stage / WMO** environment specifically, if this is a WaveMaker Online / Stage-hosted concern

**Example:** "Confirm subtitle rendering on Web uses the HTML5 `<track>` element correctly, and separately confirm the native fallback overlay renders identically on both a prebuilt Android build and a prebuilt iOS build, since native side-loaded text-track support is known to be inconsistent between the two."

## 7. Backward Compatibility / Regression

Existing apps and existing usages that must be unaffected.

- An app built before this change, using the widget with its old prop set only — confirm it still works identically after the runtime is upgraded, without the app builder touching anything.
- If a prop's default value, name, or type changed: confirm the specific migration/fallback behavior for apps still using the old shape.
- Any other widget that was flagged in spec Q11 (Impact/blast radius) as sharing code or a dependency with this one — confirm it wasn't silently broken by this change.

**Example:** "Load an existing app built pre-migration that references `WmVideo` with only the original prop set (no `subtitlesrc`/`showcaptions` bound) — confirm it renders and plays identically to before, with no new required props, no console errors, and no visible caption-toggle UI appearing unexpectedly."
