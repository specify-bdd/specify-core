Feature: Browser Tab Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to open and manage browser tabs under test
    So that I can interact with multi-tab browser scenarios

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed

    Rule: The user can open new browser tabs

        Scenario: Opening an unnamed tab increases the tab count
            Given a chrome browser session
            When the user opens a new browser tab
            Then the active session should have 2 browser tabs

        Scenario: Opening a named tab increases the tab count
            Given a chrome browser session
            When the user opens a new browser tab named "second-tab"
            Then the active session should have 2 browser tabs

        Scenario: Opening multiple tabs accumulates correctly
            Given a chrome browser session
            When the user opens a new browser tab
            And opens a new browser tab named "third-tab"
            Then the active session should have 3 browser tabs
