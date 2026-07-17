---
name: wavemaker-vcs
description: "Use this skill ONLY when the user's primary request is a VCS/git operation or reviewing LLM-applied draft changes. Covers: (1) Studio project operations — repo status, diff, commit history, pull, push; (2) Draft worktree — listing checkpoints, viewing file diffs and patches. Do NOT load for UI, backend, i18n, database, security, or any development task where VCS is incidental. Load only when the request is unambiguously a VCS action."
---

# WaveMaker VCS Concepts

## Studio Project Branch & Drafts (Git Worktrees)

### Studio Project Branch (Main)

The **Studio project branch** is the canonical `master` branch of the WaveMaker project repository. It represents the stable, accepted state of the project as visible to the user inside WaveMaker Studio.

### Drafts (Git Worktrees)

A **draft** is a Git worktree branched off from the Studio project's main branch. Drafts are the mechanism through which LLM-driven (AI agent) code changes are isolated before the user reviews and accepts them.

**Lifecycle of a Draft:**

1. **Creation** — Whenever the AI agent makes code changes (e.g., editing a file, scaffolding a component), a new Git worktree is created from the current Studio project `master` branch. This worktree is the draft.
2. **Changes applied in isolation** — All AI-generated modifications are written into the draft worktree, keeping the main Studio project branch completely untouched.
3. **User review** — The user sees the list of pending changes in the Studio UI (the "changes list" / diff view), which reflects the diff between the draft and the main branch.
4. **Accept → Merge** — Only when the user explicitly clicks **Accept** in the UI are the draft's changes merged back into the Studio project's main branch. This is the moment the changes become visible and effective inside WaveMaker Studio. If a merge conflict arises during this step, a conflict-resolution popover appears in the bottom-right of the Studio UI, from which the user can resolve conflicts and continue.
5. **Reject / Discard** — The draft is reset back to the Studio project's main branch ref, effectively discarding the LLM-applied changes while keeping the worktree intact.

---

# Platform Tools

## Draft Checkpoints (Pending Changes Review)

> **Draft only.** These tools operate on the current draft worktree and have no visibility into the Studio project's main branch.

Each user message carries a `<wm-system>` tag with the VCS state produced by the previous trace when that trace generated code changes:

- `code_checkpoint:code_23452` — the previous trace made code changes; `code_23452` is the checkpoint tag for those changes.

The tag is **not sent** when the previous trace made no code changes.

The first `code_checkpoint` tag seen in a session marks the trace where the draft worktree was created. Use `code_0` as `start_checkpoint` to diff all changes since the draft was created — `code_0` resolves to the initial main branch commit from which the draft was branched.

- **get_diff_for_checkpoints** (Required Args) — Get the list of modified files between two checkpoint IDs.
- **get_file_patch_for_checkpoints** (Required Args) — Get the unified patch/diff for a specific file between two checkpoint IDs.

## Repository Status & Information

> **Studio project only.** These tools operate on the Studio project's main branch and have no awareness of any draft worktree.

- **platform_getRepoStatus** (No args) — Get current repository status: staged/unstaged changes, current branch, and remote tracking info.
- **platform_getProjectVCSChanges** (No args) — Get detailed information about all modified files in the project (added, modified, deleted).
- **platform_getRemoteCommitLog** (No args) — Get the commit history from the remote repository.

## Remote Operations

> **Studio project only.** These tools operate on the Studio project's main branch and have no awareness of any draft worktree.

- **platform_pull** (No args) — Pull latest changes from the remote repository.
  - When merge conflicts occur, guide the user to resolve them via: **Studio → VCS icon (top-right) → Pull Changes**.
- **platform_push** (Required Args) — Push local commits to the remote repository.

# Commit & Push Workflow

When the user requests to commit and push changes:

1. **Analyze Changes**: Use **platform_getProjectVCSChanges** (No args) to understand what files were modified.
2. **Request Commit Message**: Ask the user for a descriptive commit message.
3. **Confirm with User**: Show the list of changes and ask for explicit approval before pushing.
4. **Push**: Use **platform_push** (Required Args) with the provided commit message.

# Rules

- For any tool labeled **(Required Args)**: call ~{get_tool_schema} first to retrieve the input schema, then call ~{execute_tool} with the correct args. Never call ~{execute_tool} for a Required Args tool without fetching the schema first.
- For tools labeled **(No args)**: call ~{execute_tool} directly with no args.
- Always confirm user intent before committing or pushing — never push without explicit user approval.
- Encourage descriptive commit messages that convey context and purpose.
- For merge conflicts, always recommend resolving through WaveMaker Studio rather than command-line tools.
- Prefer clean, incremental commits to maintain repository integrity and traceability.
