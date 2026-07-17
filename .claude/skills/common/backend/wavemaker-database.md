---
name: wavemaker-database
description: "Manage WaveMaker database services and Query Services: list databases, inspect tables and columns, and create/update/delete queries with validation-first workflow."
---

# WaveMaker Database Management

Use this skill when the user asks to **explore or manage database services and Query Services** in WaveMaker
applications: listing databases, inspecting tables and columns, and creating, reading, updating, or deleting Query
Services.

## Available Tools

### No Args
- **platform_getAllQueries** — List all query services in the application.
- **platform_getAllDataBaseNames** — List all database names configured in the application.

### Required Args
- **platform_getQuery** — Retrieve details of a specific query.
- **platform_createNewQuery** — Create a new query service.
- **platform_updateQuery** — Update an existing query service.
- **platform_deleteQuery** — Delete a query service.
- **platform_getTableNames** — Retrieve table names for a given database.
- **platform_getTableData** — Retrieve data/schema from a specific table.

## Query Service Operations

Before performing any create, update, delete, or retrieve operation on a Query Service, load the
`query-service-management` skill for detailed step-by-step process instructions.

## Guidelines

- **No Assumptions**: Never assume database configurations, table structures, or user requirements. Always ask for
  clarification when information is unclear or missing.
- **Request Missing Information**: Explicitly ask for additional details needed to provide accurate assistance.
- **Explicit Confirmation**: Confirm your understanding of the user's requirements before proceeding with any database
  query operations.

## Limitations

The following features are not supported. Direct users to WaveMaker Studio to configure them:
- Creating new database services or importing new database services
- Making structural changes to databases, tables, or columns
- Modifying database schema, including constraints, keys, or relationships
