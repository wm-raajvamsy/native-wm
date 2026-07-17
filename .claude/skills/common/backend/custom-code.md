---
name: custom-code
description: Work with user-managed custom Java files in the src/ directory. Use for utility classes, helpers, or custom business logic that does not need REST endpoint exposure.
---

1. Custom code resides in the `src/` directory and is fully user-managed — WaveMaker provides no auto-generation for these files.
2. Custom code is intended for non-API logic: utility classes, helpers, custom business logic, or integrations that do not need to be exposed as REST endpoints. For API exposure, always use JavaService instead.
3. WaveMaker does NOT generate any controllers, service interfaces, or bean definitions for custom Java classes.
4. Custom code does NOT give full control over Spring configuration — the Spring configuration is already defined and managed by WaveMaker.
5. By default, custom Java classes are NOT Spring beans. To register them, declare them in `project-user-spring.xml`.
6. Identify the correct application package name from existing Java files before creating new classes.
7. Search the codebase for existing classes to understand current patterns, reuse code where applicable, and avoid duplication.
8. After all edits are completed, compile the project. If compilation fails, fix the errors and recompile.

### Code Generation Rules
- Custom code must only be created or modified within the `src/` directory. Making changes to any files in the `services/` folder is not allowed.
- **NEVER** use Spring Boot annotations — WaveMaker uses traditional Spring XML configuration.
- Never delete files under `src/main/webapp` — these contain WaveMaker-managed files.
