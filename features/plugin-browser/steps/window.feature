Feature: Browser Window Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to read and set the browser window dimensions
    So that I can reproduce specific viewport conditions during testing

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed
        And a chrome browser session

    Rule: The user can set the browser window size

        Scenario: Setting the browser height changes the height without affecting the width
            Given that the browser is 1280 px wide by 800 px tall
            When the user resizes the browser to 600 px tall
            Then the browser should be 1280 px wide by 600 px tall

        Scenario: Setting the browser width changes the width without affecting the height
            Given that the browser is 1280 px wide by 800 px tall
            When the user resizes the browser to 960 px wide
            Then the browser should be 960 px wide by 800 px tall

        Scenario: Setting both dimensions changes width and height together
            When the user resizes the browser to 1024 px wide by 768 px tall
            Then the browser should be 1024 px wide by 768 px tall

    Rule: The user can assert the browser window size

        Scenario: Asserting the browser height passes when the height matches
            Given that the browser is 1280 px wide by 720 px tall
            Then the browser should be 720 px tall

        Scenario: Asserting the browser width passes when the width matches
            Given that the browser is 1280 px wide by 720 px tall
            Then the browser should be 1280 px wide

        Scenario: Asserting both dimensions passes when both match
            Given that the browser is 1280 px wide by 720 px tall
            Then the browser should be 1280 px wide by 720 px tall
