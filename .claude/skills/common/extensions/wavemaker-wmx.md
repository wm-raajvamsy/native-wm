---
name: wavemaker-wmx
description: "Create, update, and manage WaveMaker Extension (WMX) Components for React Native projects. Execute directly in-session — do NOT delegate to a sub-agent. Trigger: user asks to create/update/manage WMX components."
---

# WaveMaker WMX Components

This skill is used for generating and managing WaveMaker Extension (WMX) Components for React Native–based WaveMaker applications.

It only works for ReactNative projects. Always read Platform Type from `.wmproject.properties` to confirm compatibility before proceeding.

Add the final generated component to `src/main/webapp/extensions/components/src` folder.

## File Management Guidelines
To propose code or file modifications:
- **Never print the full code in your response.**
- **Always Retrieve Current Content**:
    - Use ~{read_files} to get the original content of the target file.
    - Use ~{find_files_by_glob} to get files in a directory.
- **Change Content**: Use one of these methods to propose changes:
    - ~{write_file}: Use this tool to add a new file or update an existing file.
    - ~{delete_file}: To delete a file.

If the user provides an input URL, read the component properties from the URL and generate the respective WMX Component following the rules below.

## Adding a Component

- Use the component name (lowercase alphabets) as the folder name and create it under `components/src`.
- Inside the component folder, add `index.tsx`. The component must be exported as default.

  ***Example***
    ```
    import { Text } from 'react-native';

    const Label = () => {
        return <Text>Hello World</Text>
    };
    export default Label.
    ```
- Inside the component folder, add `wmx.json` describing the metadata (properties, styles, events) in JSON format.
- Inside the component folder, add `icon.svg` (optional). Used in Studio as the widget icon. Should have a transparent background and use `#737373` as the stroke color.

- If any package is needed, run `npm install`. The following packages are available in the WaveMaker runtime — add them as **development dependencies** to prevent version clashes:
    - color
    - lodash
    - moment
    - react-native-gesture-handler
    - react-native-reanimated
    - react-native-svg
    - victory-native

## WMX JSON Schema

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| **name** | Name of the component in lowercase alphabets. | Yes | |
| **displayName** | Regular name to display in Studio. If not specified, `name` is used. | No | |
| **description** | Additional information about the component. Used in Studio as help info. | No | |
| **iconUrl** | Relative path of icon SVG image. E.g. `icon.svg` | No | |
| **webSupport** | Indicates whether this component can render in web preview. | No | false |
| **props** | A map of properties. Property name is key, property config is value. | No | |
| **events** | A map of events. Event name is key, event config is value. | No | |
| **styles** | A map of styles. Style name is key, style config is value. | No | |

## Property Schema

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| **name** | Name of the property in alphanumeric. | Yes | |
| **displayName** | Regular name to display in Studio. If not specified, `name` is used. | No | |
| **description** | Additional information about the property. Used in Studio as help info. | No | |
| **type** | Type of property. Allowed values: `number`, `string`, `boolean`, `object`. | No | string |
| **isList** | Boolean indicating whether this is an array type. | No | false |
| **defaultValue** | Default value for this property. | No | |
| **isRequired** | Boolean indicating whether a value is required for this property. | No | false |

## Event Schema

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| **name** | Name of the event in alphanumeric. | Yes | |
| **displayName** | Regular name to display in Studio. If not specified, `name` is used. | No | |
| **description** | Additional information about the event. Used in Studio as help info. | No | |

## Style Schema

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| **name** | Name of the style property in alphanumeric. | Yes | |
| **style** | Default styles. | No | |