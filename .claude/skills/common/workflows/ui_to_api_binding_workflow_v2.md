---
name: ui_to_api_binding_workflow_v2
description: "Complete workflow for connecting a UI component (form, table, list) to a backend target (database, service, API). Trigger when any combination of: a UI component + a backend target + an action (bind, connect, submit, integrate, create service). Trigger phrases: 'bind/connect [form/table/list] to [database/service/API]', 'create orchestrated/java service for [form/page] submission', 'submit [form] to [database]', 'wire up [component] to [service]'. Examples: 'bind the form to UserDB', 'create orchestrated javaservice so form can be submitted in one request', 'connect the form on UserPage to UsersDB'. Fill in {pageName} and {componentDescription} from the user request."
---

# UI Component to Backend API Binding Workflow

## When to Use

Load this workflow when the user's request involves connecting a **UI component** (form, table, list, any widget) to a **backend target** (database, service, API) via any action (bind, submit, connect, integrate, create service). This covers:

- "Bind this form to an API"
- "Connect this table to backend data"
- "Submit this form to the database"
- "Wire up this list to the service"
- "Create a backend for this page and integrate it"
- "Create orchestrated java service so that form can be submitted in one request"
- "In page X, there is a form bind to [database]. Create service for it"
- Any request combining: [page/form/component] + [database/service name] + [submit/bind/create/connect]

## Pre-flight: Skip Explore When User Intent Is Clear

**Rule:** If the user already specifies what backend to use — a URL, a service name, a database/entity, or asks to create/import a service — skip Task 1 (Explore) and go straight to Task 2 or Task 3 as appropriate.

Only run Task 1 when the request is vague and you genuinely need to discover what APIs exist in the project.

---

## High-Level Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      USER REQUEST                                │
│    "Bind {componentType} on {pageName} to backend"               │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  Is the user's target backend already clear?                     │
│         YES ──────────────────────────────────────────┐         │
│         NO                                            │         │
└──────────┼────────────────────────────────────────────┼─────────┘
           │                                            │
           ▼                                            │ (fast path)
┌──────────────────────────────────────────────────────┐│
│  TASK 1: EXPLORE & DISCOVER                          ││
│  Skill: explore_code                                 ││
│                                                      ││
│  ┌─────────────────────┐  ┌───────────────────────┐  ││
│  │ 1A: Scan UI widget  │  │ 1B: Search project    │  ││
│  │ (fields, types,     │  │ APIs for compatible   │  ││
│  │  structure)         │  │ match (by entity,     │  ││
│  └──────────┬──────────┘  │ fields, types)        │  ││
│             │             └───────────┬───────────┘  ││
│             └──────────┬─────────────┘               ││
│                        ▼                             ││
│               ┌─────────────────┐                    ││
│               │  MATCH RESULT?  │                    ││
│               └────┬────┬────┬──┘                    ││
│                    │    │    │                        ││
└────────────────────┼────┼────┼────────────────────────┘│
                     │    │    │                          │
         ┌───────────┘    │    └───────────┐              │
         ▼                ▼                ▼              │
   ┌───────────┐   ┌────────────┐   ┌────────────────┐   │
   │ COMPLETE  │   │ AMBIGUOUS  │   │ NO MATCH /     │   │
   │ MATCH     │   │ (multiple  │   │ ORCHESTRATION  │   │
   │           │   │ candidates │   │ NEEDED         │   │
   └─────┬─────┘   │  found)    │   └───────┬────────┘   │
         │         └─────┬──────┘           │             │
         │               ▼                  ▼             ▼
         │         ┌────────────┐   ┌────────────────────────────────┐
         │         │ ASK USER   │   │ TASK 2: CREATE / IMPORT API    │
         │         │ to pick    │   │ Skill: wavemaker-backend│
         │         │ the API    │   │                                │
         │         └─────┬──────┘   │ • Import REST/OpenAPI svc      │
         │               │          │   from provided URL, OR        │
         │               │          │ • Create orchestrated Java     │
         │               │          │   Service + model classes      │
         │               │          └───────────┬────────────────────┘
         └───────┬────────┘                     │
                 │◄────────────────────────────┘
                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  TASK 3: UI INTEGRATION & BINDING                                │
│  Skill: wavemaker-ui                                       │
│                                                                  │
│  ┌─────────────────────┐     ┌────────────────────────┐          │
│  │ Create API-aware    │     │ Bind component fields   │         │
│  │ service variable    │────▶│ to variable inputs      │         │
│  └─────────────────────┘     └────────────┬───────────┘          │
│                                           │                      │
│  ┌─────────────────────┐     ┌────────────▼───────────┐          │
│  │ Update page markup  │◀────│ Add event handlers     │          │
│  │ (actions, events)   │     │ (submit/load/error)    │          │
│  └─────────────────────┘     └────────────────────────┘          │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
                       ✅ COMPLETE
```

## Predefined Execution Plan

```
📋 EXECUTION PLAN

** PRE-FLIGHT: Skip Task 1 if user already specified the backend (URL, service name, entity, or create/import intent). **

Task 1: Explore UI component and discover compatible APIs [SKIP if user intent is already clear]
  1.1: Scan {componentDescription} on page "{pageName}" — identify widget names, field names, types, and data structure
  1.2: Search project APIs for compatible matches — search by entity name, field names, input/output types
  1.3: Evaluate match result:
       → Complete match: Report the matching API (serviceId, operationId, inputs, outputs)
       → Ambiguous (multiple candidates): List all candidates with compatibility details
       → No match: Report what's missing and whether orchestration is needed

** DECISION POINT: **
  → Complete match    → Skip Task 2, proceed to Task 3
  → Ambiguous match   → Present candidates to user, wait for selection, then proceed to Task 3
  → No match          → Proceed to Task 2 (create orchestrated API)

Task 2: Create / Import backend API [CONDITIONAL — skip if a complete match was found in Task 1]
  IF user provided an API URL (fast path):
  2.1: Import the service from the provided URL:
       → Use platform_createRestAPIService (for a plain REST endpoint URL), OR
       → Use platform_createOpenAPIService (for a Swagger/OpenAPI spec URL)
  2.2: Verify the import succeeded and the service is available
  2.3: Extract and return exact API metadata (see Required API Metadata below)

  IF no URL provided (no compatible API found by Task 1):
  2.1: Create the JavaService first (generates the service folder structure)
  2.2: Create model/DTO classes inside the service (request/response classes)
  2.3: Implement orchestration logic in the service (across required services/tables)
  2.4: Compile and verify the service
  2.5: Extract and return exact API metadata (see Required API Metadata below)

** REQUIRED API METADATA (from Task 1 match OR Task 2 creation): **
Before proceeding to Task 3, you MUST have ALL of the following:
  - serviceId: The exact service name (e.g., "ClaimSubmissionService")
  - operationId: The FULL auto-generated controller operation ID, which in WaveMaker follows the pattern {ControllerName}_{methodName} (e.g., "ClaimSubmissionController_submitClaim", NOT just "submitClaim")
  - Fully qualified request type: The complete Java class path (e.g., "com.wavemaker.myapp.model.ClaimSubmissionRequest")
  - Fully qualified response type: The complete Java class path (e.g., "com.wavemaker.myapp.model.ClaimSubmissionResponse")
  - Input parameter names and types: Every field name with its Java type
  - REST endpoint path: The generated endpoint (e.g., "POST /claimSubmission/claim")
If any of these are missing, you MUST find these details BEFORE starting Task 3.

Task 3: Integrate UI component with backend API (needed wavemaker-ui skill)
  3.1: Read current page structure and component markup
  3.2: Create API-aware service variable bound to the FULL operationId (controller-prefixed)
  3.3: Bind component fields to variable inputs using dataBinding
  3.4: Update page markup with action triggers and event bindings
  3.5: Add event handlers (submit/invoke, onSuccess, onError)
```

## Execution Rules

**Key: The operationId passed to Task 3 must be the FULL controller-prefixed format (e.g., `ClaimSubmissionController_submitClaim`), never just the method name (e.g., `submitClaim`). WaveMaker auto-generates controller wrappers that prefix the operation ID.**

### Error Recovery for Task 3

If Task 3 (UI Integration) fails or you cannot find the operation/service:

```
STEP 1: Identify the failure reason and take action:
  - "Operation not found" → operationId is likely wrong (missing controller prefix) -> search for the correct operationId
  - "Type not found" → fully qualified class name is incorrect or incomplete -> search in codebase to identify the correct input/output types
  - "Service not found" → serviceId is wrong or service didn't compile -> does service exists/ compiled successfully

STEP 2: If Task 3 fails a second time:
  → Report the error to the user with full details
  → Ask the user to verify the service compiled correctly
```

### Constraints

- Tasks are **sequential** — each depends on the previous
- **Task 1 is skipped** when the user already specifies the backend (URL, service name, entity, or create/import intent)
- **Task 2 is skipped** when the target service already exists (found by Task 1 or named by the user)
- If user clarification is needed (AMBIGUOUS), **pause and wait** before proceeding
- You must **compile** after creating any backend service
- You maintain **exact API metadata** (see Required API Metadata in Execution Plan) — do not proceed to Task 3 without it
- You must use **dataBinding** (declarative) over JavaScript for variable input wiring in api inputs Binding case
- You must use the **exact operationId** (controller-prefixed format) — never guess or shorten
- Event handlers must follow WaveMaker conventions (Page scope, metadata-driven events)

### Component Type Adaptations

The binding pattern adapts based on the UI component type:

| Component          | Typical Trigger          | Variable Type                  | Binding Pattern                                       |
| ------------------ | ------------------------ | ------------------------------ | ----------------------------------------------------- |
| Form (wm-form)     | on-submit                | ServiceVariable                | Bind form fields → variable inputs, invoke on submit  |
| Table (wm-table)   | on-load / on-page-change | CrudVariable / ServiceVariable | Bind variable output → table dataset                  |
| List (wm-list)     | on-load                  | ServiceVariable                | Bind variable output → list dataset                   |
| Search (wm-search) | on-submit / on-search    | ServiceVariable                | Bind search value → variable input, results → dataset |
| Any widget         | on-click / on-change     | ServiceVariable                | Bind widget value → variable input                    |
