---
name: create-java-service
description: Create a new WaveMaker Java Service. Provides the correct file structure, package conventions, and workflow for creating a new Spring-based REST service endpoint.
---

1. Search the codebase for existing Java services that may already provide similar functionality to avoid duplication.
2. Java service naming should follow camelCase naming convention.
3. Use the **platform_createNewJavaService** tool to create the service. This will generate a default template Java service file and register the service in the application.
4. The created default template can then be edited according to the user's use case — use the `update-java-service` skill for that.
