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

        Scenario: End the active browser session
            Given a chrome browser session
            When the user ends the browser session
            Then there should be 0 open browser sessions

        Scenario: Close the active browser session
            Given a chrome browser session
            When the user closes the browser
            Then there should be 0 open browser sessions

        Scenario: Ending a session with others open leaves the remaining sessions active
            Given a chrome browser session
            And another chrome browser session
            When the user ends the browser session
            Then there should be 1 open browser session

    Rule: The user can switch between browser sessions

        Scenario: Switching to the next session makes it the active session
            Given a chrome browser session
            And the user is at the URL https://example.com
            And another chrome browser session
            And the user is at the URL https://example.org
            When the user switches to the 1st browser session
            And switches to the next browser session
            Then the browser URL should be https://example.org

        Scenario: Switching to the next session from the last session wraps to the first
            Given a chrome browser session
            And the user is at the URL https://example.com
            And another chrome browser session
            And the user is at the URL https://example.org
            When the user switches to the next browser session
            Then the browser URL should be https://example.com

        Scenario: Switching to the previous session makes it the active session
            Given a chrome browser session
            And the user is at the URL https://example.com
            And another chrome browser session
            And the user is at the URL https://example.org
            When the user switches to the previous browser session
            Then the browser URL should be https://example.com

        Scenario: Switching to the previous session from the first session wraps to the last
            Given a chrome browser session
            And the user is at the URL https://example.com
            And another chrome browser session
            And the user is at the URL https://example.org
            When the user switches to the 1st browser session
            And switches to the previous browser session
            Then the browser URL should be https://example.org

        Scenario: Switching to a session by ordinal index makes it the active session
            Given a chrome browser session
            And the user is at the URL https://example.com
            And another chrome browser session
            And the user is at the URL https://example.org
            When the user switches to the 1st browser session
            Then the browser URL should be https://example.com
