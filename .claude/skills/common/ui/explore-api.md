---
name: explore-api
description: Discover available APIs and service operations (operationId, serviceId, endpoints, parameters, schemas) from WaveMaker service spec files. Use when exploring what APIs or service operations exist, finding suitable endpoints, or retrieving service details.
---

# Service Discovery

## Service Endpoint and Operation Info

Each service has a raw API spec file under `services/<serviceId>/designtime/`. The filename depends on the service:

- These files contain the full API contract (paths, parameters, schemas).
- **`<serviceId>_API.json`** — JavaService, SoapService, DataService, SecurityService
- **`<serviceId>_API_REST_SERVICE.json`** — RestService, OpenAPIService
- **`<serviceId>_API_WEBSOCKET_SERVICE.json`** — WebSocketService

Use glob to find these files without knowing the service type in advance:

```
services/*/designtime/*_API.json
services/*/designtime/*_API_REST_SERVICE.json
services/*/designtime/*_API_WEBSOCKET_SERVICE.json
```

Use glob and grep (with context lines for extra context around a pattern match) on API SPEC file, do not use {read_files} tool to read the entire SPEC file(this action is forbidden only grep is allowed on SPEC file).
