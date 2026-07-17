---
name: query-service-management
description: "Full lifecycle management of WaveMaker Query Services: read existing queries, inspect SQL and parameters, create/update/delete queries with a validation-first workflow."
---

# Skill: Query Service Management
1. Find existing query services that may be reusable and view details of specific queries if needed.
2. For create or update operations:
   - Identify available databases, table structures, columns, and relationships.
   - Identify the data requirements including joins, filter conditions before designing the query.
   - Design the SQL query with proper joins, filters, and indexing considerations. Use parameterized queries (e.g., `:userId`) to prevent SQL injection if required. Avoid SELECT *; explicitly specify the required columns.
   - Optimize and refine the query until it executes successfully.

### Operation Tracking Rule (STRICT - MANDATORY)

The `createNewQuery` and `updateQuery` tools may return an `operationId` in their response. This represents the query endpoint generated and is used for binding the query to the UI.

If the tool's response contains an `operationId`, you MUST extract the exact value and include it in the final response to the user.

You MUST:
- Preserve the full exact string returned.
- Not shorten it.
- Not simplify it.
- Not convert it to query name only.
- Not derive a new value.

### Example :-
**Tool response:**
```json
{
  "operationId": "QueryExecutionController_executeGetAllDepartments"
}
```

**Final response to the user MUST include:-**
```
Operation Summary
- QueryExecutionController_executeGetAllDepartments
```

**If no operationId is returned, do NOT create the Operation Summary section in the response.**

---
