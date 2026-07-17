---
name: wavemaker-openapi-service
description: Import and manage WaveMaker OpenAPI/Swagger service integrations. Use when working with OpenAPI spec-based service definitions.
---

# WaveMaker OpenAPI (Swagger) service

Load **`wavemaker-web-service`** first for limitations (e.g. security definition / oauth providerId restrictions), multi-service handling, and URL routing.

## Important guidelines

Follow this guidelines before performing any action on Web Service

- **Web Service discovery and selection**:
  1. First search the app for all Web Services using skill `explore-codebase` (names, endpoints, and relevant configuration).
  2. When adding a new service, if another service has similar or overlapping configuration (possible duplicate), ask the user whether to **create a new** service or **update** the existing one—do not assume.
  3. You must know exactly which Web Service to target. If the service is unclear for an **update** or **delete**, stop and present the candidate services (names, endpoints, relevant configuration), then obtain **explicit user confirmation** of the target before calling update or delete. Once the target is confirmed, act only on that service.
- **Data formats**: Support OpenAPI/Swagger, Postman collections, and other common API spec formats where applicable.

## OPENAPI service:

- OPENAPI services in WaveMaker are located under the `services/` folder.
- When an OPENAPI/swagger file or URL is provided, the specification is imported into the application and used for runtime service api opertaions
- The swagger settings (host, base path, security configurations(authentications methods defined in the swagger, i.e., security definitions) and proxy settings) are retrieved from given swagger and used in the runtime service opertaions.
- If changes to these settings are required, use:
  `platform_getOpenapiServiceConfig` **(Required Args)**: to retrieve the current settings,
  `platform_setOpenAPIServiceConfig` **(Required Args)**: to update the settings
- For other parts of swagger specification (such as paths, models, or opertaions), updated cannot be made with configuration tools. To apply such changes, the service must be reimported using: `platform_reImportOpenAPIService` **(Required Args)**
- To create a new service from a Swagger specification: `platform_createOpenAPIService` **(Required Args)**
