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
            Then there should be 1 active browser session

        Scenario: Start multiple browser sessions
            When the user starts a chrome browser session
            And starts another chrome browser session
            Then there should be 2 active browser sessions

    Rule: The user can end browser sessions

        Scenario: End the active browser session
            Given a chrome browser session
            When the user ends the browser session
            Then there should be 0 active browser sessions

        Scenario: Ending a session with others open leaves the remaining sessions active
            Given a chrome browser session
            And another chrome browser session
            When the user ends the browser session
            Then there should be 1 active browser session
