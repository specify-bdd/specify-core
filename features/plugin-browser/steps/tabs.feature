Feature: Browser Tab Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to open and manage browser tabs under test
    So that I can interact with multi-tab browser scenarios

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed
        And a chrome browser session

    Rule: The user can open new browser tabs

        Scenario: Opening an unnamed tab increases the tab count
            When the user opens a new browser tab
            Then the active session should have 2 browser tabs

        Scenario: Opening a named tab increases the tab count
            When the user opens a new browser tab named "second-tab"
            Then the active session should have 2 browser tabs

        Scenario: Opening multiple tabs accumulates correctly
            When the user opens a new browser tab
            And opens a new browser tab named "third-tab"
            Then the active session should have 3 browser tabs

    Rule: The user can close browser tabs

        Scenario: Closing the active tab reduces the tab count by one
            When the user opens a new browser tab
            And closes the active browser tab
            Then the active session should have 1 browser tab

        Scenario: Closing a tab by ordinal index reduces the tab count by one
            When the user opens a new browser tab
            And opens a new browser tab
            And closes the 1st browser tab
            Then the active session should have 2 browser tabs

        Scenario: Closing the last tab using the last pattern reduces the tab count to zero
            When the user opens a new browser tab
            And closes the last browser tab
            Then the active session should have 1 browser tab

        Scenario: Closing a tab by name reduces the tab count by one
            When the user opens a new browser tab named "to-close"
            And opens a new browser tab
            And closes the browser tab named "to-close"
            Then the active session should have 2 browser tabs

        Scenario: Closing the last remaining tab removes the session
            When the user closes the browser tab
            Then there should be 0 open browser sessions
