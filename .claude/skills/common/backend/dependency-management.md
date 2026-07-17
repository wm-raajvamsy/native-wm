---
name: dependency-management
description: Manage and inspect WaveMaker application Maven dependencies. Use when adding, updating, removing, reading, or searching for dependencies in pom.xml or the M2 cache. Also use for finding versions of any dependencies used by the application.
---

**Inspect / Search**
- Read declared dependencies: `read_files` on `pom.xml`.
- Check if managed by the WaveMaker parent pom: `grep_in_files` in `m2/ai/wavemaker` for the `<artifactId>`.
- List cached versions: `find_files_by_glob` → `m2/repository/<groupId-path>/<artifactId>/**/*.pom`.
- Inspect a specific version's POM: `read_files` → `m2/repository/<groupId-path>/<artifactId>/<version>/<artifactId>-<version>.pom`.

**Add / Update / Remove**
1. Always check the WaveMaker parent pom first (see above).
   - Found → skip adding to `pom.xml`; it's already inherited.
   - Not found → add with an explicit version.
2. Edit `pom.xml` with the correct `groupId`, `artifactId`, and `version`.
3. Verify compatibility with the project's Spring 6 / Servlet 6 (Jakarta) stack.
4. **Compile** the project after any change to confirm no conflicts.
