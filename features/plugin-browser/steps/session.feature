Feature: Browser Session Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to start and stop browser sessions under test
    So that I can drive browser-based scenarios

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed

    Rule: The user can start browser sessions

        Scenario: Start a browser session
            When the user starts a chrome browser session
            Then there should be 1 open browser session

        Scenario: Start multiple browser sessions
            When the user starts a chrome browser session
            And starts another chrome browser session
            Then there should be 2 open browser sessions

    Rule: The user can end browser sessions

        Background:
            Given a chrome browser session

        Scenario: End the active browser session
            When the user ends the browser session
            Then there should be 0 open browser sessions

        Scenario: Ending a session leaves remaining sessions open
            Given another chrome browser session
            When the user ends the browser session
            Then there should be 1 open browser session

    Rule: The user can switch between browser sessions

        Background:
            Given a chrome browser session
            And another chrome browser session
            And another chrome browser session

        Scenario: Switching to the next session makes it the active session
            When the user switches to the 1st browser session
            And switches to the next browser session
            Then the 2nd browser session should be active

        Scenario: Switching to the next session from the last session wraps to the first
            When the user switches to the next browser session
            Then the 1st browser session should be active

        Scenario: Switching to the previous session makes it the active session
            When the user switches to the previous browser session
            Then the 2nd browser session should be active

        Scenario: Switching to the previous session from the first session wraps to the last
            When the user switches to the 1st browser session
            And switches to the previous browser session
            Then the 3rd browser session should be active

        Scenario: Switching to a session by ordinal index makes it the active session
            When the user switches to the 2nd browser session
            Then the 2nd browser session should be active
