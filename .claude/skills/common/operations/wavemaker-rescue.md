---
name: wavemaker-rescue
description: "Retrieve WaveMaker application logs to diagnose errors: server errors, crashes, startup failures, API errors, or runtime exceptions."
---

# WaveMaker Rescue — Log Analysis

Use this skill when the user asks to **retrieve logs, diagnose errors, or analyze issues** in a WaveMaker application:
server errors, application crashes, startup failures, API errors, runtime exceptions, or any request to "check logs", "what went wrong", or "why is X failing".

## Log Folders

```
logs/server/        — Studio server: API requests, startup, authentication, project operations
logs/apps/          — Deployed apps: app runtime, Tomcat, JVM GC, HTTP access (.txt)
logs/workspace-git/ — Workspace git sync: commit, push, pull, lock/unlock
logs/react-native/  — React Native: codegen and build output
```

## Discovery & Search

Prefer `grep_in_files` on the folder — it searches across all files at once without needing to list or read individually.

- Discover files: `find_files_by_glob` pattern `*.log` folder `logs/` (add `*.txt` for HTTP access logs in `logs/apps`)
- Read a specific file: use the path from glob results

## Choosing the right log source

- Studio server error, API failure, startup failure → `grep_in_files` `ERROR` in `logs/server`
- Deployed app runtime error, application exception → `grep_in_files` `ERROR` in `logs/apps`
- Tomcat container or webapp deployment failure → `grep_in_files` `SEVERE|Exception` in `logs/apps`
- JVM crash or out-of-memory → `grep_in_files` `OutOfMemory` in `logs/apps`
- HTTP 5xx errors by endpoint → `grep_in_files` `" 5` in `logs/apps` (include `*.txt` files)
- Workspace git push/pull failure, sync error → `grep_in_files` `ERROR|push failed` in `logs/workspace-git`
- React Native build failure → `grep_in_files` `error` with `-i` in `logs/react-native`
- Unknown / unclear → `grep_in_files` `ERROR` in `logs/`, then narrow down

## Log Parsing

- Start with `ERROR` and `WARN`; use surrounding `INFO` lines for context.
- Find the **first occurrence** — root cause, not cascading failures.
- Compare timestamps across folders when multiple sources are involved.
- In stack traces, focus on the originating class and line, not framework frames.

## Structured Diagnosis Output

- **Issue Summary**: One-line description of what went wrong
- **Root Cause**: Underlying reason with the relevant log snippet
- **Affected Components**: Services, modules, or endpoints involved
- **Severity Level**: Critical / High / Medium / Low
- **Recommended Fix Area**: Type of change needed (e.g. code, configuration, database, dependency, infrastructure)

## Guidelines

- Do not speculate beyond what the logs show — if unclear, state that and list what was observed.
- If logs are empty or unavailable, report it and suggest what additional information is needed.
- Do not attempt to apply any fix.
