---
name: wizard
description: Configure and use the WaveMaker Wizard container widget for multi-step flows such as registration, configuration, checkout, or any ordered step-based process.
---

# Skill: Wizard Widget

## Objective

Configure and use the WaveMaker **Wizard** container widget for multi-step flows (registration, configuration, checkout, etc.).

## When to Use This Skill

- User asks to add or configure a wizard, multi-step form, or stepper.
- Flows with ordered steps: project/config setup, account registration, software install, document review, product order, payment.
- Need step navigation (Previous/Next), Done/Cancel, or conditional steps.

---

## Wizard Overview

- **Widget**: Container widget for multi-step tasks; guides users in a pre-defined order.
- **Wizard Steps**: Each step has a **Title** and **Content** (inline or partial can be used).
- **Navigation/Wizard Actions**: Previous (all except first), Next (all except last), Done (last step), Cancel (all steps), Skip (skip step). Each Wizrad action is configurable.

---

## DOM and Scope Rules

- **Wizard steps**: Components inside a wizard step are not in the DOM until that step is shown. Do not rely on them at page ready.
- **Access after load**: Use step’s **On Load** handler to access widgets inside that step.

---

## Wizard Hard Rules

Follow these rules when creating or editing wizard markup. Violating them can break navigation or runtime behavior.

### 1. Structure Requirements

- **Minimum steps:** A wizard must have at least one step (`wm-wizardstep`).
- **Action bar position:** The action bar must be a single `wm-wizardaction` element and it must be the **last child** of the wizard, i.e. placed **after all** `wm-wizardstep` elements. Never put `wm-wizardaction` before or between steps.

### 2. Default Action Bar (Required)

Every wizard must include a default action panel with Skip, Cancel, Previous, Next, and Done. Use the markup below.

The `wm-wizardaction` wraps:

- A **Skip** link (`wm-anchor`)
- A container with four buttons (`wm-button`): **Cancel**, **Previous**, **Next**, **Done**

```html
<wm-wizardaction name="wizardaction1">
   <wm-anchor class="app-wizard-skip" caption="Skip »" show="bind:skippable()" on-click="skip()"
              name="anchor1" variant="standard"></wm-anchor>
   <wm-container class="app-wizard-actions-right app-container-default" name="container1"
                 variant="default">
      <wm-button class="btn-filled btn-default" type="button" caption="bind:cancelbtnlabel()"
                 show="bind:cancelable()" on-click="cancel()" name="button1" variant="filled:default">
      </wm-button>
      <wm-button class="btn-filled btn-default" type="button" iconclass="wi wi-chevron-left"
                 caption="bind:previousbtnlabel()" show="bind:hasPreviousStep()" on-click="previous()"
                 disabled="bind:disablePrevious()" name="button2" variant="filled:default"></wm-button>
      <wm-button class="btn-filled btn-default" type="button" iconclass="wi wi-chevron-right"
                 iconposition="right" caption="bind:nextbtnlabel()" show="bind:hasNextStep()"
                 on-click="next()" disabled="bind:disableNext()" name="button3" variant="filled:default">
      </wm-button>
      <wm-button class="btn-filled btn-default" type="button" iconclass="wi wi-check"
                 caption="bind:donebtnlabel()" show="bind:hasNoNextStep()" on-click="done()"
                 disabled="bind:disableDone()" name="button4" variant="filled:default"></wm-button>
   </wm-container>
</wm-wizardaction>
```

### 3. Do Not Modify on Default Actions

**Do not change** the following on the default Skip, Cancel, Previous, Next, or Done elements inside `wm-wizardaction`:

- `caption`
- `show`
- `disabled`
- `on-click`

Changing these can break step navigation and wizard state.

### 4. Adding Custom Actions

To add **custom** actions (e.g. extra buttons or links), add **additional** WaveMaker components **inside** the same `wm-wizardaction` element. e.g. extra `wm-anchor` or `wm-button`— without altering the default Skip/Cancel/Previous/Next/Done markup above.

### 5. Other Rules

- **Content of steps:** Any WaveMaker widgets may be placed inside a `wm-wizardstep`.
- **Forms in steps:** If a form is inside a step, the Next button stays disabled until required form fields are valid.
- Wizard methods are only available in JavaScript; Call them via Page.Widgets.<wizardName>.<method>(...) in event handlers or script, not in markup or bindings.

e.g.

```javascript

// Add Step
Page.button1Click = function ($event, widget) {
   Page.Widgets.wizard1.addStep(
        { 
            'name': 'wizardstep4', 
            'title': 'Personal Info', 
            'subtitle': 'All details are mandatory', 
            'content': 'personalPartial', 
            'enableskip': true 
        }
    );
};

// Remove Step by name
Page.button2Click = function ($event, widget) {
   Page.Widgets.wizard1.removeStep('wizardstep3');
};

// Remove Step by index
Page.button3Click = function ($event, widget) {
   Page.Widgets.wizard1.removeStep(2);
};

// Go to step by Index
Page.button1Click = function ($event, widget) {
   Page.Widgets.wizard1.gotoStep(1);
};
// Go to step by Name
Page.button2Click = function ($event, widget) {
   Page.Widgets.wizard1.gotoStep('wizardstep3');
};

// Navigate to previous step 
Page.button5Click = function ($event, widget) {
    Page.Widgets.wizard1.prev();
};

// Navigate to next step
Page.button5Click = function ($event, widget) {
    Page.Widgets.wizard1.next();
};

// Skip the current step
Page.button5Click = function ($event, widget) {
    Page.Widgets.wizard1.skip();
};

// Invoke on-Done event
Page.button5Click = function ($event, widget) {
    Page.Widgets.wizard1.done();
};

// Invoke on-Cancel event
Page.button5Click = function ($event, widget) {
    Page.Widgets.wizard1.cancel();
};

```

- **gotoStep:** Use the `gotoStep` method only to navigate to a step that the user has **already visited or completed**. Do not use it to jump to a not-yet-visited step.

---
