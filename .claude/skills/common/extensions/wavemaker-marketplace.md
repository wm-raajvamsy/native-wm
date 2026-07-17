---
name: wavemaker-marketplace
description: "Search, browse, and install WaveMaker Marketplace artifacts (WMX Components, Prefabs, Connectors, Design Systems). Execute directly in-session — do NOT delegate to a sub-agent. Trigger: user asks to search/browse/install marketplace items."
---

# WaveMaker Marketplace

This Skill is used for discovering and installing WaveMaker marketplace artifacts including WMX Components, Prefabs, Connectors, and Design Systems for WaveMaker Applications.
It works with WaveMaker projects and provides marketplace integration capabilities with proper validation and user confirmation workflows.

## File Management Guidelines
To propose code or file modifications:
- **Never print the full code in your response.**
- **Always ask for user confirmation before making any file changes**
- **Always Retrieve Current Content**: 
  - Use ~{read_files} to get the original content of the target file.
  - Use ~{find_files_by_glob} to get files in a directory.
- **Change Content**: Use one of these methods to propose changes (only after user approval):
  - ~{write_file}: Use this tool to add a new file or update an existing file.
  - ~{delete_file}: To delete a file.

## Core Capabilities

### 1. Marketplace Discovery & Search
- Search and browse all marketplace artifacts
- Get detailed information about specific artifacts
- Filter by type, category, and other criteria
- Handle disambiguation when multiple similar artifacts exist

### 2. Artifact Installation (Server-Side via Studio API)
- Install WMX Components (ReactNative projects only) - **Via Studio API**
- Install Prefabs (all WaveMaker projects) - **Via Studio API**
- Install Connectors (all WaveMaker projects) - **Via Studio API**
- Install Design Systems (all WaveMaker projects) - **Via Studio API**

### 3. Project Management
- List installed artifacts
- Validate project compatibility

## Installation Restrictions

**SUPPORTED ARTIFACT TYPES:**
- ✅ **WMX Components** - ReactNative WaveMaker projects only
- ✅ **Prefabs** - All WaveMaker projects  
- ✅ **Connectors** - All WaveMaker projects
- ✅ **Design Systems** - All WaveMaker projects (Design Tokens)
- ❌ **Other artifact types** - Not supported

## Tool Usage Guidelines

### **MANDATORY: Always Check Project First**
Before ANY installation operation:
- Get project info using ~{getWorkspaceProjectInfo}
- If installing WMX component, verify it's a React Native project
- **STOP** if project validation fails

### **Marketplace Discovery Tools**

**Browse All Artifacts:**
~{marketplace_get_all_artifacts}
Returns complete marketplace catalog.

**Browse by Type:**
~{marketplace_get_artifacts_by_type} with artifact_type: "wmx"|"prefab"|"connector"|"Design System"
Returns all artifacts of specific type.

**Get Detailed Information:**
~{marketplace_get_artifact_details} with artifact_id: number
Get complete artifact details including installation URLs, metadata, and compatibility info.

### **Installation Workflow**

**Step 1: Project Validation (MANDATORY)**
- Ensure the project is a WaveMaker project
- For WMX components: Must be ReactNative Project (check Platform Type from .wmproject.properties)
- For unsupported artifact types: **STOP** and inform user

**Step 2: Artifact Disambiguation (When Needed)**
When user requests an artifact by name and multiple artifacts with similar/same names exist across different types:

1. **Search and Identify Conflicts:**
   - Search across all supported types (wmx, prefab, connector, Design System)
   - Look for artifacts with identical or very similar names
   - Consider case-insensitive matching and partial matches

2. **Present Options Clearly:**
   
   I found multiple artifacts with similar names:
   
   1. **DataTable** (WMX Component)
      - Type: WMX Component (React Native only)
      - Description: Advanced data table with sorting and filtering
      - Downloads: 1,250 | ID: 123
   
   2. **DataTable** (Prefab)
      - Type: Prefab (All WaveMaker projects)
      - Description: Simple data table widget for web apps
      - Downloads: 850 | ID: 456
   
   3. **Data-Table-Connector** (Connector)
      - Type: Connector (All WaveMaker projects) 
      - Description: Database connector for table operations
      - Downloads: 420 | ID: 789
   
   Which artifact would you like to install?
   

3. **Validate Compatibility:**
   - Check project type compatibility for each option
   - Highlight incompatible options
   - Example: "❌ WMX Component not compatible (requires React Native project)"

4. **Get User Confirmation:**
   - Wait for explicit user selection by artifact ID or clear indication
   - Don't proceed with installation until user confirms specific choice

**Step 3: Prepare Installation Plan**
~{marketplace_execute_artifact_installation} with:
- artifact_id: "string" (specific ID confirmed by user)
- is_wavemaker_project: boolean from step 1
- is_react_native_project: boolean from step 1

**IMPORTANT: This returns an installation plan executed via Studio API**

**Step 4: Installation Results**
The tool performs server-side installation via Studio API and returns:
- ✅ **Success**: Artifact installed automatically in WaveMaker Studio
- ❌ **Failure**: Error details and troubleshooting steps

**NO LOCAL FILE OPERATIONS REQUIRED** - All installations are handled by Studio API.

### **Project Management Tools**

**List Installed Artifacts:**
~{marketplace_list_installed_artifacts} with:
- artifact_type: "wmx"|"prefab"|"connector"|"Design System"

Returns instructions for local execution to list installed artifacts.

## Installation Rules & Validation

### **WMX Components** 
- **Project Requirement**: MUST be ReactNative WaveMaker project
- **Validation**: Check for `src/main/webapp/wm_rn_config.json`
- **Installation**: Via Studio API 
- **Source**: ZIP from `source_zip_url` or created from Git repository

### **Prefabs**
- **Project Requirement**: Any WaveMaker project  
- **Installation**: Via Studio API
- **Source**: ZIP from `source_zip_url`

### **Connectors** 
- **Project Requirement**: Any WaveMaker project
- **Installation**: Via Studio API 
- **Source**: ZIP from `source_zip_url`

### **Design Systems**
- **Project Requirement**: Any WaveMaker project
- **Installation**: Via Studio API 
- **Source**: ZIP from `source_zip_url`
- **Contains**: Design tokens (colors, typography, spacing, etc.)

## User Interaction Guidelines

### **Always Ask Before Acting**
- **Discovery**: Free to browse and search marketplace
- **Installation**: Always confirm with user before proceeding
- **File Operations**: Never execute without explicit user permission
- **Project Changes**: Always explain what will be modified
- **Disambiguation**: Always clarify which specific artifact user wants

### **Required User Confirmations**

1. **For Artifact Disambiguation**: 
   - When multiple artifacts have similar names across different types
   - Present all options with clear type indicators and compatibility info
   - Ask: "Which specific artifact would you like to install? Please specify by ID or type."

2. **Before Installation**: 
   - "Do you want to install [Specific Artifact Name] ([Type]) in your [Project Type] project?"
   - Show artifact details (name, description, version, compatibility, ID)

3. **Before File Operations** (if any local changes needed):
   - "This will modify the following files: [list]"
   - "Do you want to proceed?"

4. **For Unsupported Operations**:
   - Clearly explain what's not supported and why
   - Suggest alternatives if available

5. **For Compatibility Issues**:
   - "❌ This [Type] artifact requires a [Required Project Type] project, but you have a [Current Project Type] project."
   - "Would you like me to show you compatible alternatives?"

### **Information Gathering & Disambiguation**

**Standard Questions:**
- "What type of artifact are you looking for? (WMX Component, Prefab, Connector, or Design System)"
- "Are you looking for a specific functionality or category?"
- "Would you like me to show you the most popular artifacts of this type?"

**Disambiguation Questions:**
- "I found [number] artifacts with similar names. Would you like me to show you all options?"
- "Which specific [artifact name] did you mean? The WMX Component, Prefab, or Connector version?"
- "To help you choose, what's your main use case for this artifact?"

**Smart Search Strategies:**
1. **Exact Name Match**: Check for exact name matches across all types
2. **Similar Name Detection**: Look for names with minor variations (spaces, hyphens, case)
3. **Keyword Overlap**: Identify artifacts with overlapping keywords in names/descriptions
4. **Category Clustering**: Group similar artifacts by functionality

## Error Handling

### **Project Validation Errors**
- "Not a WaveMaker project" → Stop, inform user to run from WaveMaker project root
- "WMX requires ReactNative" → Stop, explain WMX components need RN projects
- "Artifact type not supported" → Explain supported types and limitations

### **Disambiguation Errors**
- "Multiple artifacts found" → Present options clearly and ask for clarification
- "Ambiguous request" → Ask follow-up questions to narrow down selection
- "No exact match" → Suggest closest alternatives with similarity explanations

### **Installation Errors**
- "Missing source URLs" → Artifact cannot be installed automatically
- "Studio API error" → Authentication or server connectivity issues  
- "Project ID missing" → Context information not available
- "Incompatible artifact type" → Explain compatibility requirements

### **Authentication Errors**
- JWT token renewal handled automatically by MCP server
- If authentication fails, suggest user to check Studio session

## Best Practices

### **General Guidelines**
1. **Always validate first** - Never skip project compatibility checks
2. **Ask before acting** - Get user confirmation for any operations
3. **Disambiguate clearly** - Present options when multiple artifacts exist
4. **Provide clear feedback** - Explain what's happening at each step  
5. **Handle errors gracefully** - Give actionable error messages
6. **Stay within bounds** - Only install supported artifact types
7. **Respect user control** - Never execute file operations without permission

### **Disambiguation Best Practices**
1. **Be thorough** - Search all relevant artifact types
2. **Present clearly** - Use consistent formatting for options
3. **Show compatibility** - Highlight which options work with user's project
4. **Include context** - Show download counts, descriptions, and IDs
5. **Wait for clarity** - Don't guess which artifact user wants
6. **Offer guidance** - Help users understand differences between options

### **Communication**
1. **Be helpful** - Guide users through the process step by step
2. **Be informative** - Explain limitations and requirements clearly
3. **Be cautious** - Always confirm before making changes
4. **Be specific** - Provide exact error messages and troubleshooting steps
5. **Be patient** - Take time to disambiguate rather than making assumptions

## Example Workflows

### **Installing with Disambiguation**
1. **User Request**: "Install DataTable component"

2. **Search & Discovery**: 
   - ~{marketplace_get_all_artifacts} or search across types
   - Find multiple "DataTable" artifacts

3. **Present Options**:

   I found 3 artifacts with "DataTable" in the name:
   
   1. **DataTable** (WMX Component) - ID: 123
      ✅ Compatible with React Native projects
      - Advanced data table with sorting, filtering, and pagination
      - Downloads: 1,250 | Rating: 4.8/5
   
   2. **DataTable** (Prefab) - ID: 456  
      ✅ Compatible with all WaveMaker projects
      - Simple data display table widget
      - Downloads: 850 | Rating: 4.6/5
   
   3. **DataTable-Connector** (Connector) - ID: 789
      ✅ Compatible with all WaveMaker projects  
      - Database connector for table operations
      - Downloads: 420 | Rating: 4.7/5
   
   Your project: React Native WaveMaker Project ✅
   
   Which artifact would you like to install? Please specify the ID (123, 456, or 789).


4. **User Selection**: User chooses ID 123

5. **Confirmation & Installation**: 
   - Confirm: "Installing DataTable (WMX Component) - ID: 123 in your React Native project. Proceed?"
   - Execute installation with specific artifact_id

### **Installing a WMX Component (No Conflicts)**
1. **Validation**: 
   - ~{getWorkspaceProjectInfo} → Check if ReactNative project
   - If not RN: "WMX components require React Native WaveMaker projects. This appears to be a [detected type] project."

2. **Discovery**: 
   - ~{marketplace_get_artifacts_by_type} with "wmx"
   - Present options to user

3. **Confirmation**: 
   - Show artifact details
   - Ask: "Do you want to install [Component Name] in your React Native project?"

4. **Installation**: 
   - If confirmed: ~{marketplace_execute_artifact_installation}
   - Report results: "✅ [Component Name] has been successfully installed via Studio API"

### **Installing a Prefab**
1. **Validation**: 
   - ~{getWorkspaceProjectInfo} → Check if WaveMaker project
   
2. **Discovery**: 
   - ~{marketplace_get_artifacts_by_type} with "prefab"
   
3. **Installation**: 
   - Get user confirmation
   - Execute via Studio API
   - Report success/failure

### **Handling Unsupported Requests**
1. **Unknown Artifact Type**:
   - "I can only install WMX Components, Prefabs, Connectors, and Design Systems."
   - "Would you like me to show you available options in any of these categories?"

2. **Ambiguous Artifact Name**:
   - "I found multiple artifacts that might match '[user input]'. Let me show you the options..."
   - Present disambiguation list
   - "Which specific artifact did you have in mind?"

## Security & Safety

### **File System Access**
- Read operations: Allowed for project analysis
- Write operations: Only with explicit user permission
- Delete operations: Only with explicit user permission

### **Network Operations**
- Marketplace API calls: Allowed for discovery
- Installation via Studio API: Only with user confirmation
- Unauthorized downloads: Not allowed

### **Project Integrity**
- Always backup important files before modifications
- Validate all changes before applying
- Provide rollback information when possible

### **User Choice Protection**
- Never assume which artifact user wants when multiple options exist
- Always present all relevant options
- Require explicit user selection for disambiguation
- Confirm specific artifact details before installation
