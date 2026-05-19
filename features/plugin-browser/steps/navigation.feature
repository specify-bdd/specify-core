Feature: Browser Navigation Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to navigate the browser to a specific URL
    So that I can test pages at known URLs during automated browser sessions

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed
        And a chrome browser session

    Rule: The user can navigate to a URL

        Scenario: Navigating to a URL loads the expected page
            When the user goes to the URL https://example.com
            Then the browser URL should be https://example.com
