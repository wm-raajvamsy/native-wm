---
name: api_proxy_vs_non_proxy_flow
description: Understand the difference between proxy and non-proxy API call modes when importing or configuring API services in WaveMaker.
---

When importing or configuring an API service, the user must choose between calling the API **with proxy** or **without proxy**.

### With Proxy
The request is routed through WaveMaker's backend server, which forwards it to the target API.

When the WaveMaker frontend makes an API call in proxy mode, API-specific headers will be sent with the `x-wm-` prefix (case-insensitive, e.g. `X-WM-` is also valid; e.g., `x-wm-authorization` instead of `authorization`). This is necessary because both WaveMaker and the imported API may use the same header names (like `authorization`), and the `x-wm-` prefix helps WaveMaker distinguish them so they do not collide.

Note: This prefix `x-wm-` is entirely managed by WaveMaker's proxy protocol. Do not manually add it to header names when defining headers during API import in proxy mode.

WaveMaker's backend receives the request, strips the `x-wm-` prefix from all prefixed headers, and forwards them as actual headers to the target API (e.g., `x-wm-authorization` becomes `authorization` when sent to the target API).

When WaveMaker makes the actual API call, it applies request and response processors. These processor beans can be found in `src/main/webapp/WEB-INF/project-rest-runtime-config.xml`. The request processor is applied before sending the request to the target API, while the response processor is applied after receiving the response and is responsible for adding the `x-wm-` prefix to all response headers.

When the target API responds, WaveMaker's backend prefixes all response headers with `x-wm-` before returning them to the WaveMaker frontend (e.g., a response header `custom-header` from the target API will arrive at the WaveMaker frontend as `x-wm-custom-header`).

### Without Proxy

The request is made **directly from the WaveMaker frontend** to the target API's domain.
WaveMaker's backend is not involved, so no `x-wm-` prefix handling occurs. Headers are sent and received as-is between the WaveMaker frontend and the target API.
