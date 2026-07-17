---
name: wavemaker-rest-service
description: Configure WaveMaker REST web service connections. Use when setting up or modifying REST API integrations including URL, headers, and authentication.
---

# WaveMaker REST API service

Load **`wavemaker-web-service`** first if you have not applied limitations, multi-service selection, or URL-vs-OpenAPI routing.

## Important guidelines

Follow this guidelines before performing any action on Web Service

- **Proxy headers**: The `x-wm-` / `X-WM-` prefix (in any casing) is managed internally by WaveMaker's proxy protocol. Do not add it manually to headers when importing an API in proxy mode.

- **Web Service discovery and selection**:
  1. First search the app for all Web Services using skill `explore-codebase` (names, endpoints, and relevant configuration).
  2. When adding a new service, if another service has similar or overlapping configuration (possible duplicate), ask the user whether to **create a new** service or **update** the existing one—do not assume.
  3. You must know exactly which Web Service to target. If the service is unclear for an **update** or **delete**, stop and present the candidate services (names, endpoints, relevant configuration), then obtain **explicit user confirmation** of the target before calling update or delete. Once the target is confirmed, act only on that service.

## Testing and `sampleResponse`

- During **create** and **update**, the tools (platform_createRestAPIService and platform_updateRestAPIService) **test the API** before importing into WaveMaker unless a `sampleResponse` is provided.
- **Skipping tests** is allowed **only** when `sampleResponse` is provided.
- **`sampleResponse` must always come from the user** — never assume, invent, or generate it. By default keep `sampleResponse` **null** or blank so the API is tested and imported normally.

## Platform tools

- **Import / create REST API**: `platform_createRestAPIService` **(Required Args)**
- **Read existing REST service**: `platform_getRestAPIServiceDetails` **(Required Args)**
- **Update REST service**: `platform_updateRestAPIService` **(Required Args)** — always call `platform_getRestAPIServiceDetails` first, then pass merged **existing** and **new** options to the update tool.
