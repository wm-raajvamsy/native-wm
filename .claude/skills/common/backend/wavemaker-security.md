---
name: wavemaker-security
description: "Configure WaveMaker application security: enable or disable security, set up authentication providers (database, LDAP, Active Directory, OAuth, OpenID, token-based, and custom), manage roles and endpoint access, configure network security options such as CORS, CSRF, XSS, CSP, SSL/TLS, mTLS, frame options, trust store, login settings, session persistence, create and register custom security filters and manage custom security filter chains and their execution order."
--- 

# WaveMaker application security

Use this skill when the user asks to configure or customize **WaveMaker application security**: authentication
providers, RBAC, SSL/TLS, XSS, CORS, frame options, custom filters, CSP, trust store, mTLS, login/cookies, CSRF, session
persistence, and endpoint access (intercept URLs).

## Documentation and runtime classes

**~{mcp_wmwiki_ask_question}**: Semantic search across indexed WaveMaker sources; pass the appropriate **repo** for what you need:

- **`wavemaker/docs`**: Use this repo to query about security configuration and customizations.
- **`wavemaker-ai/wavemaker-app-runtime-services`**: WaveMaker **built-in** runtime source—classes **the documentation names as WaveMaker runtime types** are indexed here. Use this for implementation detail (methods, constructors, inheritance, annotations, extension points, and behavior). **Application-specific** backend code is not covered by this index; read the application project for that.

Prefer **`wavemaker/docs`** for configuration and customizations. When docs refer a **WaveMaker runtime class**, or the app imports or extends a WaveMaker runtime type you must understand, query **`wavemaker-ai/wavemaker-app-runtime-services`** for implementation-level detail (API surface, wiring, and behavior).

## Architecture (reference)

- **`services/securityService/`**: Complete security configurations of application are present in this package.
    - `designtime/general-options.json`: SSL, XSS, CORS, X-Frame-Options, custom filters, CSP, etc.
    - `designtime/auth-info.json`: login, cookies, CSRF, session persistence, security providers.
    - `designtime/roles.json`: roles and landing pages per role.
    - `designtime/intercept-urls.json`: endpoint access rules.

## Limitations/ Unsupported features: The following features are not supported by this agent. Please use WaveMaker Studio directly to configure them
    - Adding or updating SAML based authentication.

## Platform rules

- For general options (SSL, XSS, CORS, frame options, custom filters, CSP, trust store, mTLS): always run each **get**
  tool first, then its matching **set** tool—see **General security options (get / set pairs)** for names. Merge
  existing config into **set** calls. For a bulk update to general options JSON, **platform_setGeneralOptions** (Required Args) may apply—confirm schema.

## Security providers

- **platform_isAuthenticationEnabled** (No args) — check if authentication is enabled.
- **platform_enableSecurity** (Required Args) — enable or disable security.
- **platform_getConfiguredSecurityProviders** (No args) — Retrieve configured security providers in the current
  application.
- **platform_getSecurityProviderInfo** (Required Args) — Retrieve configuration settings of a security provider based
  on one of the types that are configured in the application..
- **platform_updateSecurityProvider** (Required Args) — update an existing provider. If role config is disabled, *
  *roleMappingConfig** may be **null** per schema.
- If enabling security fails because no provider exists, add one using the correct tool below (**Required Args** each)
  —inspect the schema first.
- **Add provider** (pick one by type):
    - **platform_addDatabaseSecurityProvider** (Required Args)
    - **platform_addDemoSecurityProvider** (Required Args)
    - **platform_addLdapSecurityProvider** (Required Args)
    - **platform_addOpenIdSecurityProvider** (Required Args)
    - **platform_addCasSecurityProvider** (Required Args)
    - **platform_addCustomSecurityProvider** (Required Args)
    - **platform_addActiveDirectorySecurityProvider** (Required Args)
    - **platform_addJwsSecurityProvider** (Required Args)
    - **platform_addOpaqueTokenSecurityProvider** (Required Args)
- For database-backed providers or DB role providers: **platform_getAllDataBaseNames** (No args), *
  *platform_getTableNames** (Required Args), **platform_getTableData** (Required Args) — confirm with the user
  before applying.

## Access configuration (intercept URLs)

- First, confirm endpoint **type** with the user: **`service`**, **`page`**, or **`prefab`**.
- Then retrieve the available list based on type:
    - `service` → **platform_getAllServiceIds** (No args), then **platform_getEndpointsOfService** (Required Args)
      with the selected service name.
    - `page` → **platform_getAllPages** (No args).
    - `prefab` → **platform_getAllPrefabs** (No args).
- Inspect existing rules with **platform_getInterceptUrls** (Required Args) before writing.
- Apply with **platform_addInterceptUrl** (Required Args) or **platform_updateInterceptUrl** (Required Args).
  Confirm with the user before writes.

## Roles

- **platform_getRole** (Required Args), **platform_getAllRoles** (No args), **platform_getAllPageNames** (No args),
- **platform_addRole** (Required Args), **platform_updateRole** (Required Args).
- Workflow:
    1. Read current state via **platform_getRole** / **platform_getAllRoles**.
    2. Present findings to the user.
    3. Validate landing pages via **platform_getAllPageNames** (No args) — default to "Main" if none specified.
    4. Explain the plan (e.g., "Creating role 'admin' with landing page 'Dashboard'").
    5. Get user approval before making any changes.
    6. Implement: **platform_addRole** for new roles, **platform_updateRole** for existing.
    7. Confirm final state after implementation.

## Other security settings

- **platform_getLoginConfig** (No args) / **platform_setLoginConfig** (Required Args): Get and Update the login
  configurations of the current application like cookie config, login type etc.
- **platform_getCSRFConfig** (No args) / **platform_setCSRFConfig** (Required Args): Get and Update the CSRF
  configurations of the current application.
- **platform_getSessionPersistenceConfig** (No args) / **platform_updateSessionPersistenceConfig** (Required Args) (
  REDIS, JDBC, MONGODB per schema)

## General security options (get / set pairs)

Always get before set:

- **platform_getSSLConfig** (No args) / **platform_setSSLConfig** (Required Args)
- **platform_getXSSConfig** (No args) / **platform_setXSSConfig** (Required Args) — use **platform_setXSSPolicy** (Required Args) when the task is XSS policy content, per schema.
- **platform_getCorsConfig** (No args) / **platform_setCorsConfig** (Required Args)
- **platform_getFrameOptions** (No args) / **platform_setFrameOptions** (Required Args)
- **platform_getCustomFilters** (No args) / **platform_setCustomFilters** (Required Args)
- **platform_getCSPConfig** (No args) / **platform_setCSPConfig** (Required Args)
- **platform_getTrustStoreConfig** (No args) / **platform_setTrustStoreConfig** (Required Args)
- **platform_getMtlsConfig** (No args) / **platform_setMtlsConfig** (Required Args)

## Rules

- Use **~{find_files_by_glob}** to locate files and **~{grep_in_files}** only when information is missing — prefer examples already provided; never search for files whose path you already know.
- When proposing file changes, use **~{read_files}** to get the original content first, then **~{write_file}** to apply changes — never paste raw file content as output. Summarize what changed.
- **CRITICAL**: After any Java file change, compile the project using **~{platform_compile}** once ALL Java changes are complete.
- Changes are presented as a diff for the user to accept or reject individually. **Wait for user approval before running any task that depends on those changes.**
