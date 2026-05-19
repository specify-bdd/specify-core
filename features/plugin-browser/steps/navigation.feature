Feature: Browser Navigation Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to navigate the browser during a test session
    So that I can interact with web applications at known URLs

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed
        And a chrome browser session

    Rule: The user can navigate to a URL

        Scenario: Navigating to a URL loads the expected page
            When the user goes to the URL https://example.com
            Then the browser URL should be https://example.com

    Rule: The user can refresh the current page

        Scenario: Refreshing the page reloads the current URL
            Given that the user is at the URL https://example.com
            When the user refreshes the page
            Then the browser URL should be https://example.com
