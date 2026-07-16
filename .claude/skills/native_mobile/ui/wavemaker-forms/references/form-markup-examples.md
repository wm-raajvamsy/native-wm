---
name: form-markup-examples
description: >
  LOAD THIS BEFORE WRITING ANY wm-form MARKUP. Contains the mandatory structural rule: wm-form-field
  and wm-form-action must always be wrapped in wm-container — placing them as direct children of wm-form
  causes a validation error. Provides complete correct XML for: login form, multi-column profile edit,
  dynamic metadata-driven form, settings form, nested forms, and edit/view mode toggle. Also includes
  a full field-properties reference table (key, type, widget, required, defaultValue, validators).
  Skipping this reference is the most common cause of form markup validation failures.
---

# Form Markup Examples

Concrete, copy-ready examples for common form patterns.

## Token File: form-wrapper/form-wrapper.json — Correct Structure

> **IMPORTANT**: The top-level JSON key is `"form"`, NOT `"form-wrapper"`.
> The file is named `form-wrapper.json` but the root object key is always `"form"`.
> This matches the canonical WaveMaker Foundation CSS token source.

```json
{
  "form": {
    "appearances": {
      "login": {
        "mapping": {
          "background": { "value": "{color.transparent.@.value}", "type": "color" },
          "padding":    { "value": "{space.0.value}", "type": "space" },
          "border": {
            "width":  { "value": "{border.width.0.value}", "type": "space" },
            "style":  { "value": "{border.style.solid.value}", "type": "radius" },
            "color":  { "value": "{color.transparent.@.value}", "type": "color" },
            "radius": { "value": "{radius.none.value}", "type": "radius" }
          },
          "header": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.0.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          },
          "body": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.0.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          },
          "footer": {
            "background": { "value": "{color.transparent.@.value}", "type": "color" },
            "padding": {
              "vertical":   { "value": "{space.4.value}", "type": "space" },
              "horizontal": { "value": "{space.0.value}", "type": "space" }
            }
          }
        }
      }
    }
  }
}
```

**Wrong — never generate this:**
```json
{ "form-wrapper": { "appearances": { ... } } }
```

**Appearance class name:** Use `form-<appearance-name>` for the form wrapper in the markup when using custom styles.

---

## Example 1: Login Form

```xml
<wm-login name="loginForm" class="login-main" width="100%">
  <wm-form name="loginFormInner" title="Welcome Back" subheading="Sign in to continue"
    variant="login" class="form-login"
    captionposition="floating" itemsperrow="xs-1 sm-1 md-1 lg-1" messagelayout="Inline"
    on-beforesubmit="onLogin($event, widget, $data)">

    <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
      <wm-form-field name="j_username" key="j_username" displayname="Email" widget="text"
        variant="login" class="form-controls-login"
        required="true" placeholder="Enter your email"
        regexp="^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
        validationmessage="Please enter a valid email" width="100%"></wm-form-field>

      <wm-form-field name="j_password" key="j_password" displayname="Password" widget="password"
        variant="login" class="form-controls-login"
        required="true" placeholder="Enter your password"
        validationmessage="Password is required" width="100%"></wm-form-field>
    </wm-container>

    <wm-container name="actions_container" class="app-default-container" direction="column" width="fill">
      <wm-form-action name="login" display-name="Sign In" type="submit"
        update-mode="true" class="btn-primary" width="100%"></wm-form-action>
    </wm-container>
  </wm-form>
</wm-login>
```

## Example 2: Profile Edit Form (Multi-Column)

```xml
<wm-form name="profileForm" title="Edit Profile"
  variant="profile" class="form-profile"
  formdata="bind:Variables.userProfile.dataSet"
  dataset="bind:Variables.userProfile"
  itemsperrow="xs-1 sm-2 md-2 lg-2"
  messagelayout="Toaster" postmessage="Profile updated!"
  on-success="onProfileSaved($event, widget, $data)">

  <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
    <wm-form-field name="firstName" key="firstName" displayname="First Name" widget="text"
      variant="profile" class="form-controls-profile"
      required="true" placeholder="First name"></wm-form-field>

    <wm-form-field name="lastName" key="lastName" displayname="Last Name" widget="text"
      variant="profile" class="form-controls-profile"
      required="true" placeholder="Last name"></wm-form-field>

    <wm-form-field name="email" key="email" displayname="Email" widget="text"
      variant="profile" class="form-controls-profile"
      required="true" readonly="true"></wm-form-field>

    <wm-form-field name="phone" key="phone" displayname="Phone" widget="text"
      variant="profile" class="form-controls-profile"
      placeholder="Phone number"></wm-form-field>

    <wm-form-field name="country" key="country" displayname="Country" widget="select"
      variant="profile" class="form-controls-profile"
      dataset="bind:Variables.countries.dataSet"
      datafield="code" displayfield="name"
      required="true"></wm-form-field>

    <wm-form-field name="birthDate" key="birthDate" displayname="Date of Birth" widget="date"
      variant="profile" class="form-controls-profile"
      datepattern="MM/dd/yyyy"></wm-form-field>

    <wm-form-field name="bio" key="bio" displayname="Bio" widget="textarea"
      variant="profile" class="form-controls-profile"
      placeholder="Tell us about yourself" maxchars="500"></wm-form-field>
  </wm-container>

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="save" display-name="Save Changes" type="submit"
      update-mode="true" iconclass="wi wi-check"></wm-form-action>
    <wm-form-action name="cancel" display-name="Cancel" type="cancel"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Example 3: Dynamic Form from Metadata

### Metadata Variable

```json
{
  "name": "formMetadata",
  "_id": "wm-formMeta-wm.Variable-1234567890123",
  "type": "wm.Variable",
  "isList": true,
  "dataBinding": {},
  "dataSet": [
    {
      "name": "fullName",
      "displayname": "Full Name",
      "widget": "text",
      "required": "true",
      "placeholder": "Enter full name",
      "validationmessage": "Name is required"
    },
    {
      "name": "email",
      "displayname": "Email Address",
      "widget": "text",
      "required": "true",
      "placeholder": "you@example.com",
      "regexp": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
      "validationmessage": "Invalid email"
    },
    {
      "name": "department",
      "displayname": "Department",
      "widget": "select",
      "dataset": "Engineering,Design,Marketing,Sales,HR",
      "datafield": "dataValue",
      "displayfield": "dataValue",
      "required": "true"
    },
    {
      "name": "startDate",
      "displayname": "Start Date",
      "widget": "date",
      "datepattern": "yyyy-MM-dd",
      "required": "true"
    },
    {
      "name": "experienceLevel",
      "displayname": "Experience Level",
      "widget": "rating",
      "maxvalue": "5",
      "required": "false"
    },
    {
      "name": "receiveUpdates",
      "displayname": "Receive Email Updates",
      "widget": "toggle",
      "checkedvalue": "true",
      "uncheckedvalue": "false",
      "defaultvalue": "true"
    },
    {
      "name": "notes",
      "displayname": "Additional Notes",
      "widget": "textarea",
      "placeholder": "Any additional information...",
      "maxchars": "1000"
    }
  ]
}
```

### Dynamic Form Markup

```xml
<wm-form name="employeeForm" title="New Employee"
  metadata="bind:Variables.formMetadata.dataSet"
  itemsperrow="xs-1 sm-1 md-1 lg-1" messagelayout="Inline"
  on-beforerender="filterFieldsByRole($metadata, widget)"
  on-beforesubmit="validateEmployee($event, widget, $data)"
  on-success="onEmployeeCreated($event, widget, $data)">

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="submit" display-name="Create Employee" type="submit"
      update-mode="true" iconclass="fa fa-plus"></wm-form-action>
    <wm-form-action name="reset" display-name="Clear" type="reset"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Example 4: Settings Form

```xml
<wm-form name="settingsForm" title="Settings"
  variant="settings" class="form-settings"
  itemsperrow="xs-1 sm-1 md-1 lg-1" layoutposition="horizontal"
  on-beforesubmit="saveSettings($event, widget, $data)">

  <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
    <wm-form-field name="language" key="language" displayname="Language" widget="select"
      variant="settings" class="form-controls-settings"
      dataset="English,Spanish,French,German,Japanese"
      datafield="dataValue" displayfield="dataValue"
      defaultvalue="English"></wm-form-field>

    <wm-form-field name="timezone" key="timezone" displayname="Timezone" widget="select"
      variant="settings" class="form-controls-settings"
      dataset="UTC,EST,PST,IST,JST"
      datafield="dataValue" displayfield="dataValue"></wm-form-field>

    <wm-form-field name="notifications" key="notifications" displayname="Email Notifications"
      variant="settings" class="form-controls-settings"
      widget="toggle" defaultvalue="true"></wm-form-field>

    <wm-form-field name="theme" key="theme" displayname="Theme" widget="radioset"
      variant="settings" class="form-controls-settings"
      dataset="Light,Dark,System"
      datafield="dataValue" displayfield="dataValue"
      defaultvalue="System"></wm-form-field>
  </wm-container>

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="save" display-name="Save Settings" type="submit"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Example 5: Nested Form (Address inside User Form)

```xml
<wm-form name="userForm" title="User Registration"
  variant="registration" class="form-registration"
  itemsperrow="xs-1 sm-1 md-1 lg-1"
  dataset="bind:Variables.createUser"
  on-success="onUserCreated($event, widget, $data)">

  <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
    <wm-form-field name="name" key="name" displayname="Full Name" widget="text"
      variant="registration" class="form-controls-registration"
      required="true"></wm-form-field>

    <wm-form-field name="email" key="email" displayname="Email" widget="text"
      variant="registration" class="form-controls-registration"
      required="true"></wm-form-field>

    <!-- Nested address form — its dataoutput merges into parent. No variant/class: nested forms inherit parent styling. -->
    <wm-form name="addressForm" parentForm="userForm" title="Address"
      dataset="bind:Variables.createAddress">

      <wm-container name="address_fields_container" class="app-default-container" direction="column" width="fill">
        <wm-form-field name="street" key="street" displayname="Street" widget="text"
          variant="registration" class="form-controls-registration"
          required="true"></wm-form-field>

        <wm-form-field name="city" key="city" displayname="City" widget="text"
          variant="registration" class="form-controls-registration"
          required="true"></wm-form-field>

        <wm-form-field name="zipCode" key="zipCode" displayname="Zip Code" widget="text"
          variant="registration" class="form-controls-registration"
          required="true"></wm-form-field>
      </wm-container>
    </wm-form>
  </wm-container>

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <wm-form-action name="register" display-name="Register" type="submit"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Example 6: Form with Edit/View Mode Toggle

```xml
<wm-form name="contactForm" title="Contact Details"
  variant="contact" class="form-contact"
  itemsperrow="xs-1 sm-1 md-1 lg-1"
  dataset="bind:Variables.updateContact"
  defaultmode="View" messagelayout="Toaster">

  <wm-container name="fields_container" class="app-default-container" direction="column" width="fill">
    <wm-form-field name="name" key="name" displayname="Name" widget="text"
      variant="contact" class="form-controls-contact"
      required="true"></wm-form-field>

    <wm-form-field name="email" key="email" displayname="Email" widget="text"
      variant="contact" class="form-controls-contact"
      required="true"></wm-form-field>

    <wm-form-field name="phone" key="phone" displayname="Phone" widget="text"
      variant="contact" class="form-controls-contact"></wm-form-field>
  </wm-container>

  <wm-container name="actions_container" class="app-default-container" direction="row" width="fill">
    <!-- View mode actions -->
    <wm-form-action name="edit" display-name="Edit" type="button"
      update-mode="false" action="edit()" iconclass="fa fa-pencil"></wm-form-action>

    <!-- Edit mode actions -->
    <wm-form-action name="save" display-name="Save" type="submit"
      update-mode="true" iconclass="wi wi-check"></wm-form-action>
    <wm-form-action name="cancel" display-name="Cancel" type="cancel"
      update-mode="true"></wm-form-action>
  </wm-container>
</wm-form>
```

## Metadata Field Properties — Complete Reference

Every key in a metadata object maps directly to a `wm-form-field` attribute:

| Key | Required | Example | Purpose |
|---|---|---|---|
| `name` | Yes | `"firstName"` | Field identifier, dataoutput key |
| `displayname` | Yes | `"First Name"` | Label text |
| `key` | Yes | `"firstName"` | Alternative field identifier |
| `widget` | Yes | `"text"` | Widget type (see "Supported Widget Types" in SKILL.md) |
| `required` | No | `"true"` | Validation |
| `defaultvalue` | No | `"John"` | Pre-filled value |
| `placeholder` | No | `"Enter name"` | Input placeholder |
| `validationmessage` | No | `"Name required"` | Custom error |
| `regexp` | No | `"^[A-Z].*"` | Regex validation |
| `readonly` | No | `"true"` | Disables editing |
| `disabled` | No | `"true"` | Disables field |
| `dataset` | No | `"A,B,C"` | Options for select/radio/chips |
| `datafield` | No | `"dataValue"` | Value field in dataset |
| `displayfield` | No | `"dataValue"` | Display field in dataset |
| `minvalue` | No | `"0"` | For number/currency/slider |
| `maxvalue` | No | `"100"` | For number/currency/slider/rating |
| `maxchars` | No | `"255"` | Max characters for text/textarea |
| `datepattern` | No | `"yyyy-MM-dd"` | For date/datetime fields |
| `timepattern` | No | `"HH:mm"` | For time/datetime fields |
| `outputformat` | No | `"yyyy-MM-dd"` | Output format for date/time |
| `step` | No | `"0.5"` | For slider |
| `checkedvalue` | No | `"yes"` | For checkbox/toggle |
| `uncheckedvalue` | No | `"no"` | For checkbox/toggle |
| `caption` | No | `"I agree"` | For checkbox label |
| `showcaptions` | No | `"false"` | For rating |
| `updateon` | No | `"blur"` | When to trigger change (text/textarea) |
