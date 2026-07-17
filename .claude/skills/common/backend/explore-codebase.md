---
name: explore-codebase
description: Explore the WaveMaker project codebase to understand architecture, discover code, APIs, and services. Use as the first step when investigating existing code or understanding project structure. Do not use when a more specific skill exists for the task.
sub-skills:
  - explore-api
---

This skill is used for Exploring the codebase to understand project architecture and instructions for navigating the codebase effectively.

### Architecture overview

WaveMaker applications follow a layered project structure tailored for full-stack web development. The front end is based on Angular, and the backend is a traditional Spring MVC Web application based on Spring 6, Servlet 6 and Java 17. It doesn't use spring boot.  
Key components include:

- `src/main/java`: Contains Java application code such as custom logic, helper classes, and utility code.
- `services`: Contains all services used in the application. Service types include:  `JavaService`, `SoapService`, `RestService`, `OpenAPIService`, `WebSocketService`, `DataService`, `SecurityServiceType`, `authService`
    - `designtime/`: Contains metadata and design-time configuration files used by the WaveMaker Studio. These files are managed by Studio and should not be manually edited.
        - `service-info.json`: Contains the service information.
    - `src/`: Contains the actual Java implementation files for services.
- `src/main/resources`: Stores application resources.
- `src/main/resources/log4j2.xml`: Uses Log4j2 for logging configuration.
- `src/main/webapp`: Contains the front-end web application, including:
    - `app.css`, `app.js`, `index.html`: Global styles, scripts, and markup.
    - `pages/`: Each folder represents a UI page (e.g., `Main`) with individual CSS, HTML, JS, and variable JSON files.
- `src/main/webapp/WEB-INF/project-user-spring.xml`: Custom beans that are required by the application can be declared in this file.
- `src/main/webapp/WEB-INF/web.xml`: Web Application Deployment Descriptor of your application.
- `pom.xml`: Defines Maven dependencies and plugins.

## Instructions
1. When discovering APIs by table name, API name, or form name, do NOT ask open-ended questions like "which table to use?" or "which API should I call?"
2. Search and discover available options first. If multiple candidates match, present the list of matching or ambiguous options for the user to choose from.
3. Always attempt discovery first before asking the user for clarification.
4. Always use `grep_in_files` and `find_files_by_glob` for all codebase searches and value lookups. `read_files` is STRICTLY FORBIDDEN for searching specific fields, IDs, keys, or values. Only use `read_files` when the FULL file structure is needed.
5. When reading files for context, focus on understanding the current structure, imports, dependencies, and existing patterns before planning any changes.
6. Search the indexed WaveMaker documentation for relevant features, patterns, or guidance when the task involves WaveMaker-specific functionality.
