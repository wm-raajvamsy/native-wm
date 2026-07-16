---
name: components-list
description: >
  Complete enumeration of all WaveMaker React Native components organized by category: basic (label,
  button, icon), container, input (text, select, checkbox, date, slider, etc.), data (list, table),
  navigation, chart, page, dialog, device, and advanced. Load when you need to confirm whether a
  component exists or look up its accepted attributes and valid values.
---

# WaveMaker React Native Components — Complete List

## Basic Components

### Wrapper Components (Accept Children)
- **AnimatedView** — Animated container
- **Tooltip** — Tooltip wrapper
- **Skeleton** — Loading skeleton
- **Button Group** — Group of buttons

### Content Prop Components (No Children)
- **Label** — `caption` prop for text
- **Message** — `title` and `caption` props
- **Picture** — `picturesource` prop (use Pexels images, fixed width/height)
- **Video** — `mp4format`, `oggformat`, `webmformat` props
- **Audio** — Audio format props
- **Lottie** — Animation source props

### Icon-Supporting Components
- **Button** — `iconclass`, `iconurl`, `iconposition`, `iconsize`, `iconheight`, `iconwidth`, `iconmargin`
- **Anchor** — `iconclass`
- **Icon** — `iconclass` (primary property)
- **Spinner** — `iconclass`
- **Search** — `iconclass`, `clearsearchiconclass`, `searchiconclass`

### Standalone Components
- **Progress Bar** — Progress indicator
- **Progress Circle** — Circular progress
- **Bottom Sheet** — Bottom sheet overlay
- **Modal** — Modal overlay

## Container Components

### Wrapper Components
- **Container** — Primary layout container (supports auto-layout with 7 attributes)
- **Panel** — Panel with `iconclass`
- **Tile** — Tile container

### Linear Layout (2 Components)
- **Linear Layout** — `direction`, `horizontalalign`, `verticalalign`, `spacing`
- **Linear Layout Item** — `flexgrow`, `flexshrink`, `horizontalalign`

### Layout Grid (3 Components)
- **Layout Grid** — Grid container
- **Grid Row** — Grid row
- **Grid Column** — `columnwidth`, `xscolumnwidth`

### Accordion (2 Components)
- **Accordion** — `defaultpaneindex`, `iconclass`
- **AccordionPane** — `name`, `title`, `iconclass`, `badgevalue`, `badgetype`

### Tabs (3 Components)
- **Tabs** — `activetabindex`
- **TabPane** — `title`, `iconclass`
- **TabHeader** — `title`, `iconclass`

### Wizard (2 Components)
- **Wizard** — `popovericonclass`, `activestepindex`
- **WizardStep** — `title`, `iconclass`, `description`

## Input Components

### With Icons
- **File Upload** — `iconclass`

### Standard Inputs (No Icons)
- **Text** — Text input
- **Textarea** — Multi-line text
- **Number** — Numeric input
- **Currency** — Currency input
- **Select** — Dropdown
- **Checkbox** — Single checkbox
- **Checkbox Set** — Multiple checkboxes
- **Radio Set** — Radio button group
- **Switch** — Toggle switch
- **Toggle** — Toggle component
- **Slider** — Range slider
- **Rating** — Star rating
- **Calendar** — Date picker
- **Epoch** — Date/time picker
- **Chips** — Tag/chip selection
- **Composite** — Composite input

## Data Components

### Wrapper Components
- **Card** — `iconclass`, accepts children
- **Form** — `iconclass`, accepts form fields

### List (3 Components)
- **List** — `datasource`, `itemtemplate`, `direction`
- **List Template** — Template for items
- **List Action Template** — Template for actions

### Live Form (2 Components)
- **Live Form** — Form container
- **Form Action** — `iconclass`

## Navigation Components

### Wrapper Components
- **App Navbar** — `leftnavpaneliconclass`, `backbuttoniconclass`, `searchbuttoniconclass`
- **Navbar** — Navigation bar
- **Nav Item** — Navigation item

### With Icons
- **Menu** — `iconclass`
- **Popover** — `iconclass`

## Chart Components
- Eight chart types: **Line**, **Area**, **Column** (vertical bars), **Bar** (horizontal bars), **Pie**, **Donut**, **Bubble**, **Stack**.
- All are authored as ONE generic tag `<wm-chart type="...">` (capitalized, case-sensitive) with `dataset` + `xaxisdatakey` + `yaxisdatakey` and a fixed px `height` — there are no per-type tags. See `wavemaker-mobile-charts`.

## Page Components
- **Page** — `<wm-page name="pageName">`
- **Content** — `<wm-content name="content1">`
- **Page Content** — `<wm-page-content name="page_content1" columnwidth="12">`
- **Left Panel** — Side drawer
- **Partial Container** — Partial host

## Dialog Components
- **Dialog** — `title`, `modal`, `oktext`, `canceltext`
- **Alert Dialog**, **Confirm Dialog**
- **Dialog Content**, **Dialog Actions**

## Device Components
- **Camera** — `capture-type`, `onSuccess`, `onError`
- **Barcode Scanner**

## Advanced Components
- **Carousel** — `dataset`, `autoplay`, `interval`
- **Login** — Login form
- **WebView** — Web view
- **Network Info Toaster** — Network status
