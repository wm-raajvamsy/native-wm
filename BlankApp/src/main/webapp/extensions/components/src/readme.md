# To add a component, follow the below procedure.
- With component name as folder name, create a folder under components/src folder. Component name should be in lowercase alphabets.
- Inside that component folder, add index.tsx. In index.tsx, component has exported as default.

    ***Example***
    ```
    import { Text } from 'react-native';

    const Label = () => {
        return <Text>Hello World</Text>
    };
    export default Label.
    ```
- Inside that component folder, add wmx.json. In wmx.json, metadata (properties, styles, events) of components should be described in JSON format. Following is the information expected.

- Inside that component folder, add icon.svg. This is optional. This svg is used in Studio as widget icon. Preferably, this icon should have transparent background and should use #737373 as stroke color. 

- If any package is needed, then do npm install that package. Following packages are also available in WaveMaker runtime. If these packages are needed, then add them as developmemnt dependencies to compile the code for your development. This will help in preventing version clashes.

    - color
    - lodash
    - moment
    - react-native-gesture-handler
    - react-native-reanimated
    - react-native-svg
    - victory-native

### WMX JSON schema
Name | Description | Required | Default |
---- |-------------|----------| --------------|
**name** | name of the component in lowercase alphabets. | Yes||
**displayName**| Regular Name to display in Studio. If not specified, name is used displayName.  | No | |
**description**| Additional information about the component. This will be used in Studio as help info to developers. | No | |
**iconUrl** | relative path of icon svg image. Ex: icon.svg | No |  |
**webSupport** | Indicates whether this component can render in web preview | No | false |
**props** | A map of properties. property name is key and property as value. For more information about property see below | No | |
**events** | A map of events. event name is key and event as value. For more information about event see below | No | |
**styles** | A map of styles. style name is key and style as value. For more information about style see below  | No | |

### Property Schema

Name | Description | Required | Default |
---- |-------------|----------| --------------|
**name** | name of the property in aplhanumeric. | Yes||
**displayName**| Regular Name to display in Studio. If not specified, name is used displayName.  | No | |
**description**| Additional information about the property. This will be used in Studio as help info to developers. | No | |
**type** | Indicates the type of property. Allowed values are number, string, boolean, object.| No | string |
**isList** | A boolean value that indicates whether this is of array type| No | false |
**defaultValue** | Value for this property by default | No | |
**isRequired** | A boolean value that indicates whether value to this property is required | No | false


### Event Schema

Name | Description | Required | Default |
---- |-------------|----------| --------------|
**name** | name of the event in aplhanumeric. | Yes||
**displayName**| Regular Name to display in Studio. If not specified, name is used displayName.  | No | |
**description**| Additional information about the event. This will be used in Studio as help info to developers. | No | |


### Style Schema

Name | Description | Required | Default |
---- |-------------|----------| --------------|
**name** | name of the style property in aplhanumeric. | Yes||
**style**| default styles | No| |
