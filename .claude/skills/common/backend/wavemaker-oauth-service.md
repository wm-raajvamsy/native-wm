---
name: wavemaker-oauth-service
description: Configure WaveMaker OAuth2 providers for REST and OpenAPI services. Use when setting up OAuth-based authentication for imported web services.
---

# WaveMaker OAuth Provider Management

Skill for managing OAuth providers used by both **REST** and **OpenAPI/Swagger** services in WaveMaker apps.

- **`platform_listOauthProvidersForSelection`** **(No args)** — Lists built-in provider IDs (e.g. Google, Facebook) plus `"custom"` that can be imported. Built-in providers have preset default values; `"custom"` has none.
- **`platform_getOauthProviderDefaults`** **(Required Args)** — Returns the default field values for a built-in provider. `"custom"` returns no defaults. The `providerId` value is fixed and **cannot be changed** from its default.
- **`platform_getConfiguredOAuthProviderNames`** **(No args)** — Lists `providerId`s of all OAuth providers already configured in the app.
- **`platform_getConfiguredOAuthProvider`** **(Required Args)** — Returns full configuration details of a specific configured provider.
- **`platform_createOAuthProvider`** **(Required Args)** — Creates a new OAuth provider. Pass merged defaults and user-supplied values; do **not** alter the `providerId`. Fails if a provider with the same `providerId` already exists.
- **`platform_updateOAuthProvider`** **(Required Args)** — Updates an existing provider. Always fetch current config first and pass the full merged configuration.
- **`platform_deleteOAuthProvider`** **(Required Args)** — Removes a configured provider. Warn the user that any service using this provider will break.
