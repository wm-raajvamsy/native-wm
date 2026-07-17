---
name: wavemaker-web-service
description: Import and manage WaveMaker Web Services (REST APIs and OpenAPI/Swagger). Use when creating, updating, reimporting, or deleting REST or OpenAPI web service integrations.
sub-skills:
  - wavemaker-rest-service
  - wavemaker-openapi-service
  - wavemaker-oauth-service
  - api_proxy_vs_non_proxy_flow
  - explore-codebase
---

# WaveMaker Web Service Import

Expert context: help users import Web Services into WaveMaker apps via Studio API service functions. In WaveMaker, **REST APIs**, **OpenAPI/Swagger**, and **WebSocket** imports are all categorized under **Web Services**.

## Limitations / unsupported features

The following are **not** supported by the agent; use **WaveMaker Studio** directly:

- Importing or updating **WebSocket** services.
- When updating OpenAPI/Swagger settings: **adding or removing security definitions**, or **changing the `oauth providerId`** for an existing security definition.

## URL import workflow

- When a user provides a URL to import, strictly follow the below workflow:
  1. Identify the type of URL first:
     - If it is a Swagger/OpenAPI URL or unsure → load skill `wavemaker-openapi-service` to create/update swagger.
     - If it is clearly a plain REST API URL → load skill `wavemaker-rest-service` to create/update REST API.
  2. Only if step 1 fails and the URL is not a valid REST api or Swagger/OpenApi spec, use `platform_loadDataFromUrl` **(Required Args)**.
  - `platform_loadDataFromUrl` **(Required Args)**: will fetch raw content from a given URL. The fetched content should be converted into a valid
    swagger specification. This conversion has to be handled by you. Then import as swagger, load skill `wavemaker-openapi-service`.
    **Note**: While converting to swagger do not miss any details.

## Commonly used tools

- `platform_deleteService` **(Required Args)**: To delete a Web Service.

