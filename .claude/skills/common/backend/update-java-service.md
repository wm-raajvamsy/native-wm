---
name: update-java-service
description: Update an existing WaveMaker Java Service. Provides the safe workflow for modifying service files, adding or updating methods, and managing return types and dependencies.
---

All Java service related files reside in the respective Java service folder at `services/<java_service_id>/`. All paths below are relative to this folder.

1. Get the package name for the service from `designtime/service-info.json`.
2. Gather all required information — identify required parameters, return types, response structure, and dependencies before making changes.
3. The Java service file is located at `src/<package_name>/<java_service_id>.java` — this class acts as the service layer from where APIs are generated.
4. If model/DTO classes are required by the Java service, create them in `src/<package_name>/model/` before updating the service.
5. Only the Java service file and model classes in `src/<package_name>/model/` are allowed to be edited. Editing any other files within this service folder is not allowed — WaveMaker will revert any changes made outside these files when the Java service is resaved.
6. Plan all changes upfront before making any edits.
7. Follow JavaService conventions when adding or modifying methods:
   - Public methods are automatically exposed as REST API endpoints — only create public methods when they need REST endpoints.
   - HTTP method mapping follows naming heuristics: methods prefixed with `create`, `update`, `delete`, or `patch` map to POST, PUT, DELETE, or PATCH respectively.
   - If the method name is ambiguous, methods with only primitive parameters become GET endpoints; methods with complex objects (DTO/POJO) become POST endpoints.
   - Use private methods for internal business logic that doesn't need an API.
   - Other WaveMaker services can be autowired using the `@Autowired` annotation.
8. After ALL edits are completed, compile the project.
9. If compilation fails, fix the errors and recompile.

### Code Generation Rules
- DO NOT make ANY changes to existing auto-generated service code that aren't directly related to the requested changes by the user — no modifications to generated REST/SOAP/OpenAPI service files, no changes to auto-generated controllers or interfaces, no editing of service configuration files unless explicitly required, and no refactoring of existing working code.
- **NEVER** use Spring Boot annotations — WaveMaker uses traditional Spring XML configuration.
- Always prefer creating new Java Services over modifying existing auto-generated services.

### Operation Tracking Rule (STRICT - MANDATORY)

The `write_file` and `edit_file_content` tools may return `operationIds` in their response. These represent the operations that were generated from the JavaService and are used for binding the created operations to the UI.

If either tool's response contains operationIds, you MUST extract the exact value(s) and include them in the final response to the user.

You MUST:
  - Preserve the full exact string returned.
  - Not shorten it.
  - Not simplify it.
  - Not convert it to method name only.
  - Not derive a new value.

If the tool returns:
    "operationIds": ["SubmissionController_submit"]

  The final response to the user MUST include:

  ### Operation Summary
  - SubmissionController_submit

If multiple operationIds are returned, list all of them exactly as returned in the final response.
If no operationIds are returned, do NOT create the section in the response.
