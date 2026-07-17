---
name: ui_to_api_binding_workflow
description: "Complete multi-agent workflow for connecting a UI component (form, table, list) to a backend target (database, service, API). Trigger when any combination of: a UI component + a backend target + an action (bind, connect, submit, integrate, create service). Trigger phrases: 'bind/connect [form/table/list] to [database/service/API]', 'create orchestrated/java service for [form/page] submission', 'submit [form] to [database]', 'wire up [component] to [service]'. Examples: 'bind the form to UserDB', 'create orchestrated javaservice so form can be submitted in one request', 'connect the form on UserPage to UsersDB'. Fill in {pageName} and {componentDescription} from the user request."
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
│  Agent: Explore Agent                                ││
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
         │         ┌────────────┐   ┌────────────────────────────┐
         │         │ ASK USER   │   │ TASK 2: CREATE / IMPORT API │
         │         │ to pick    │   │ Agent: Backend Expert       │
         │         │ the API    │   │                             │
         │         └─────┬──────┘   │ • Import REST/OpenAPI svc  │
         │               │          │   from provided URL, OR    │
         │               │          │ • Create orchestrated Java  │
         │               │          │   Service + model classes   │
         │               │          └───────────┬────────────────┘
         └───────┬────────┘                     │
                 │◄────────────────────────────┘
                 ▼
┌──────────────────────────────────────────────────────────────────┐
│  TASK 3: UI INTEGRATION & BINDING                                │
│  Agent: UI Expert                                                │
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

Fill in `{pageName}` and `{componentDescription}` from the user's request.

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

** DECISION POINT (WM Agent evaluates Task 1 output): **
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
  2.1: Create the Java Service first (generates the service folder structure)
  2.2: Create model/DTO classes inside the service (request/response classes)
  2.3: Implement orchestration logic in the service (across required services/tables)
  2.4: Compile and verify the service
  2.5: Extract and return exact API metadata (see Required API Metadata below)

** REQUIRED API METADATA (from Task 1 match OR Task 2 creation): **
Before proceeding to Task 3, the orchestrator MUST have ALL of the following:
  - serviceId: The exact service name (e.g., "ClaimSubmissionService")
  - operationId: The FULL auto-generated controller operation ID, which in WaveMaker follows the pattern {ControllerName}_{methodName} (e.g., "ClaimSubmissionController_submitClaim", NOT just "submitClaim")
  - Fully qualified request type: The complete Java class path (e.g., "com.wavemaker.myapp.model.ClaimSubmissionRequest")
  - Fully qualified response type: The complete Java class path (e.g., "com.wavemaker.myapp.model.ClaimSubmissionResponse")
  - Input parameter names and types: Every field name with its Java type
  - REST endpoint path: The generated endpoint (e.g., "POST /claimSubmission/claim")
If any of these are missing, the orchestrator MUST query the Backend Expert (reusing its session) to retrieve them BEFORE starting Task 3.

Task 3: Integrate UI component with backend API
  3.1: Read current page structure and component markup
  3.2: Create API-aware service variable bound to the FULL operationId (controller-prefixed)
  3.3: Bind component fields to variable inputs using dataBinding
  3.4: Update page markup with action triggers and event bindings
  3.5: Add event handlers (submit/invoke, onSuccess, onError)
```

## Execution Rules

### Agent Assignment
| Task | Agent                                      | Session | Condition |
|------|--------------------------------------------|---------|-----------|
| Task 1 (Explore) | Backend Expert Agent (`wm_backend_expert`) | New session | Only if user intent is vague — skip when backend is already specified |
| Decision | WM Agent (orchestrator)                    | — | Evaluates Task 1 output (skipped on fast path) |
| Task 2 (Backend) | Backend Expert Agent (`wm_backend_expert`) | New session | Only if a new service must be created or imported |
| Task 3 (UI Bind) | UI Expert Agent (`wm_ui_expert`)  | New session | Always |

### Delegation Prompts

**Task 1 — Explore UI Component + Discover APIs:**
```
Explore and discover compatible APIs for UI-to-backend binding:

1.1: Scan the {componentDescription} on page "{pageName}":
     - Identify all widget/field names, data types, and component structure
     - Use codebase_search to find the page markup and component hierarchy

1.2: Search the project for compatible backend APIs:
     - Search by entity names that match the component's data fields
     - Search by operationId patterns (CRUD operations, form handlers)
     - Check existing services: DataService, JavaService, RestService, OpenAPIService
     - For each candidate API, note: serviceId, operationId, input parameters, output type

1.3: Evaluate compatibility:
     - COMPLETE MATCH: API inputs align with component fields (same names/types or trivially mappable)
     - PARTIAL/AMBIGUOUS: Multiple APIs could work, or some fields don't align
     - NO MATCH: No existing API covers the required functionality

Return a structured report:
- Component fields: [list of field names and types]
- API candidates: [list with serviceId, operationId, inputs, outputs, match quality]
- Recommendation: COMPLETE_MATCH / AMBIGUOUS / NO_MATCH
- If NO_MATCH: what data/tables are involved and what orchestration would be needed
```

**Decision Point — WM Agent Logic:**
```
Based on Task 1 output:

IF recommendation == COMPLETE_MATCH:
  → Extract serviceId and operationId from the matched API
  → Skip Task 2
  → Run API Metadata Verification Gate (see below)
  → Proceed to Task 3 with the matched API details

IF recommendation == AMBIGUOUS:
  → Present the candidate APIs to the user:
    "Multiple compatible APIs found for {componentDescription}:
     1. {serviceId1}/{operationId1} — {description1}
     2. {serviceId2}/{operationId2} — {description2}
     Which one should I use?"
  → Wait for user selection
  → Proceed to Task 3 with the selected API details

IF recommendation == NO_MATCH:
  → Inform user: "No existing API matches. I'll create an orchestrated service."
  → Proceed to Task 2 with the component fields and data structure
```

**Task 2 — Create / Import Backend API (conditional):**
```
Context:
- Page: "{pageName}", Component: {componentDescription}
- Component fields: [{componentFields}]

[FAST PATH — User provided an API URL]
If the user supplied an explicit API URL ({apiUrl}):
2.1: Import the service using the appropriate tool:
     - platform_createRestAPIService  → for a plain REST endpoint URL
     - platform_createOpenAPIService  → for a Swagger/OpenAPI spec URL
2.2: Verify the import succeeded and the service is listed in the project
2.3: Retrieve and return the EXACT API metadata (see CRITICAL section below)

[NORMAL PATH — No compatible API found by Task 1]
- Reason: No existing API matches the component's data structure
- Required data/tables: [{dataRequirements}]
2.1: Create the Java Service first (this generates the service folder structure)
2.2: Create model/DTO classes inside the service (request/response classes matching the required data structure)
2.3: Implement the orchestration logic in the service:
     - Accepts the component's fields as input parameters
     - Orchestrates across the required services/tables
     - Returns the appropriate response structure
2.4: Compile the project and verify the service
2.5: After successful compilation, retrieve and return the EXACT API metadata

CRITICAL — Return ALL of the following in your final response (UI binding depends on exact values):
  - serviceId: The exact service name (e.g., "ClaimSubmissionService")
  - operationId: The FULL controller-prefixed operation ID as auto-generated by WaveMaker.
    WaveMaker generates operationIds in the format: {ControllerName}_{methodName}
    (e.g., if your service is ClaimSubmissionService with method submitClaim,
     the operationId will be "ClaimSubmissionController_submitClaim", NOT just "submitClaim")
    Verify this from the generated Swagger spec or controller class.
  - requestTypeFQN: Fully qualified Java class name for the request DTO
    (e.g., "com.wavemaker.hdfc_life_autocode.model.ClaimSubmissionRequest")
  - responseTypeFQN: Fully qualified Java class name for the response DTO
    (e.g., "com.wavemaker.hdfc_life_autocode.model.ClaimSubmissionResponse")
  - inputParameters: Complete list of parameter names with their Java types
    (e.g., [{ name: "policyNumber", type: "String" }, { name: "dateOfDeath", type: "String" }])
  - REST endpoint: The generated REST path (e.g., "POST /claimSubmission/claim")
```

**Task 3 — UI Integration & Binding:**
```
Context from previous tasks:
- Page: "{pageName}", Component: {componentDescription}
- Component fields and their widget names: [{componentFields}]

API Metadata (verified — use these EXACT values):
- serviceId: "{serviceId}"
- operationId: "{operationId}"  ← This is the FULL controller-prefixed ID (e.g., "ClaimSubmissionController_submitClaim")
- Request type (fully qualified): "{requestTypeFQN}"
- Response type (fully qualified): "{responseTypeFQN}"
- Input parameters: [{inputParameters with name and type}]
- REST endpoint: "{restEndpoint}"

Field mapping (component widget name → API parameter name):
[{fieldMappings}]

Execute these sub-tasks:
3.1: Read current page structure and component markup for "{pageName}"
3.2: Create an API-aware ServiceVariable:
     - Bind to operationId: "{operationId}" (use this EXACT string, do NOT shorten it)
     - serviceId: "{serviceId}"
     - MANDATORY: Call getServiceDetails and enumerate ALL inputs
     - MANDATORY: Add dataBinding for every input found — headers, query params, path params, body fields — regardless of whether they appear hardcoded at service level
     - MANDATORY: If an input has no provided value, still add its dataBinding entry and keep `value` empty
     - Use the fully qualified type names for request/response
3.3: Bind component fields to variable inputs using dataBinding (declarative, not JS):
     - Use the field mapping above to wire each widget to the correct API parameter
3.4: Update page markup — add action triggers (on-submit, on-click, on-load as appropriate for the component type)
3.5: Add event handlers:
     - Invoke trigger (submit/load depending on component type)
     - onSuccess (notification, refresh data, reset form as appropriate)
     - onError (error notification)

IMPORTANT: Use the operationId exactly as provided above. Do NOT attempt to guess or shorten it.
If you cannot find the operation, report the exact error rather than trying alternative names.
```

### Context Passing Between Tasks

| From → To | What to Pass |
|-----------|-------------|
| Task 1 → Decision | Component fields (widget names + types), API candidates, match recommendation |
| Task 1 → Task 2 | Component fields, data requirements, entity/table names (if NO_MATCH) |
| Task 2 → Verification Gate | serviceId, operationId (controller-prefixed), requestTypeFQN, responseTypeFQN, inputParameters, REST endpoint |
| Verification Gate → Task 3 | ALL verified metadata: serviceId, operationId (FULL controller-prefixed), requestTypeFQN, responseTypeFQN, inputParameters [{name, type}], componentFieldMap [{widgetName → paramName}], REST endpoint |

**Key: The operationId passed to Task 3 must be the FULL controller-prefixed format (e.g., `ClaimSubmissionController_submitClaim`), never just the method name (e.g., `submitClaim`). WaveMaker auto-generates controller wrappers that prefix the operation ID.**

### Error Recovery for Task 3

If Task 3 (UI Integration) fails or the UI Expert reports it cannot find the operation/service:

```
STEP 1: Identify the failure reason from the UI Expert's response:
  - "Operation not found" → operationId is likely wrong (missing controller prefix)
  - "Type not found" → fully qualified class name is incorrect or incomplete
  - "Service not found" → serviceId is wrong or service didn't compile

STEP 2: Retrieve correct metadata:
  → Reuse the Backend Expert's session (from Task 2)
  → Ask: "The UI binding failed because [{failure reason}]. Please provide:
          1. The exact operationId from the generated Swagger/OpenAPI spec (full controller-prefixed format)
          2. The fully qualified Java class names for request and response types
          3. Confirm the serviceId and REST endpoint"
  → Store the corrected metadata

STEP 3: Resume Task 3:
  → Reuse the UI Expert's session (from the failed Task 3 attempt)
  → Pass the CORRECTED metadata explicitly:
     "Previous attempt failed because [{failure reason}].
      Here are the correct API details:
      - operationId: {corrected operationId}
      - requestTypeFQN: {corrected type}
      - responseTypeFQN: {corrected type}
      Please continue with creating the ServiceVariable and bindings."

STEP 4: If Task 3 fails a second time:
  → Report the error to the user with full details
  → Ask the user to verify the service compiled correctly
```

### Constraints
- Tasks are **sequential** — each depends on the previous
- Each task uses a **new session** (sessionId: undefined)
- **Task 1 is skipped** when the user already specifies the backend (URL, service name, entity, or create/import intent)
- **Task 2 is skipped** when the target service already exists (found by Task 1 or named by the user)
- If user clarification is needed (AMBIGUOUS), **pause and wait** before proceeding
- Backend Expert must **compile** after creating any service
- Backend Expert must **return exact API metadata** (see Required API Metadata in Execution Plan) — do not proceed to Task 3 without it
- UI Expert must use **dataBinding** (declarative) over JavaScript for variable input wiring
- UI Expert must use the **exact operationId** as provided (controller-prefixed format) — never guess or shorten
- Event handlers must follow WaveMaker conventions (Page scope, metadata-driven events)

### Component Type Adaptations
The binding pattern adapts based on the UI component type:

| Component | Typical Trigger | Variable Type | Binding Pattern |
|-----------|----------------|---------------|-----------------|
| Form (wm-form) | on-submit | ServiceVariable | Bind form fields → variable inputs, invoke on submit |
| Table (wm-table) | on-load / on-page-change | CrudVariable / ServiceVariable | Bind variable output → table dataset |
| List (wm-list) | on-load | ServiceVariable | Bind variable output → list dataset |
| Search (wm-search) | on-submit / on-search | ServiceVariable | Bind search value → variable input, results → dataset |
| Any widget | on-click / on-change | ServiceVariable | Bind widget value → variable input |
