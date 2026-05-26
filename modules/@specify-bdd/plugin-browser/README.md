# Specify BDD - Browser Plugin

This plugin for [Specify BDD](https://www.npmjs.com/package/@specify-bdd/specify) provides a bundle of Cucumber support
code designed to make browser testing simple.  Please refer to the core package's README file for instructions on
installation and configuration.

## Cucumber Support Code

### Step Definitions

#### Session

* Given a/another {browserName} browser( session)
* When [I open/the user opens] a/another {browserName} browser( session)
* When [I start/the user starts] a/another {browserName} browser( session)
* When [I end/the user ends] the (active )browser( session)
* When [I close/the user closes] the (active )browser( session)
* Then there should be {int} (open )browser session(s)
* Then the {ordinal} browser session should be active
* When [I switch/the user switches] to the next browser( session)
* When [I switch/the user switches] to the previous browser( session)
* When [I switch/the user switches] to the {ordinal} browser( session)

#### Navigation

* Given (that )[I am/the user is] at the URL {url}
* When [I go/the user goes] to the URL {url}
* Then the browser URL should be {url}
* When [I click/the user clicks] the browser's refresh/reload button
* When [I refresh/the user refreshes] the page
* When [I reload/the user reloads] the page
* When [I click/the user clicks] the browser's back button
* When [I navigate/the user navigates] back
* When [I click/the user clicks] the browser's forward button
* When [I navigate/the user navigates] forward

#### Tabs

* When [I open/the user opens] a/another new browser tab
* When [I open/the user opens] a/another new browser tab named {string}
* Then the active session should have {int} browser tab(s)
* When [I close/the user closes] the (active )browser tab
* When [I close/the user closes] the {ordinal} browser tab
* When [I close/the user closes] the last browser tab
* When [I close/the user closes] the browser tab named {string}
* When [I switch/the user switches] browser tabs
* When [I switch/the user switches] to the next browser tab
* When [I switch/the user switches] to the previous browser tab
* When [I switch/the user switches] to the {ordinal} browser tab
* When [I switch/the user switches] to the last browser tab
* When [I switch/the user switches] to the browser tab named {string}
* Then the {ordinal} browser tab should be active
* Then the browser tab named {string} should be active

#### Window

* Given (that )the browser is {int} px tall
* Given (that )the browser height is {int} px
* When [I resize/the user resizes] the browser to {int} px tall
* When [I resize/the user resizes] the browser height to {int} px
* Given (that )the browser is {int} px wide
* Given (that )the browser width is {int} px
* When [I resize/the user resizes] the browser to {int} px wide
* When [I resize/the user resizes] the browser width to {int} px
* Given (that )the browser is {int} px wide by {int} px tall
* Given (that )the browser width is {int} px and the height is {int} px
* When [I resize/the user resizes] the browser to {int} px wide by {int} px tall
* When [I resize/the user resizes] the browser width to {int} px and the height to {int} px
* Then the browser should be {int} px tall
* Then the browser height should be {int} px
* Then the browser should be {int} px wide
* Then the browser width should be {int} px
* Then the browser should be {int} px wide by {int} px tall
* Then the browser width should be {int} px and the height should be {int} px

### Hooks

* Before scenario: initialize a browser property on the World instance
* After scenario: terminate any remaining browser sessions
