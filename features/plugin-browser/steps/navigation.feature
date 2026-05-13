Feature: Browser Navigation Step Definitions
    As a software developer interested in using Specify to test web applications
    I want to be able to navigate the browser to a specific URL and refresh the page
    So that I can test pages at known URLs and reproduce page-reload scenarios during automated browser sessions

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed

    Rule: The user can navigate to a URL

        Scenario: Navigating to a URL using the Given pattern loads the expected page
            Given a chrome browser session
            And the user is at the URL https://example.com

        Scenario: Navigating to a URL using the When pattern loads the expected page
            Given a chrome browser session
            When the user goes to the URL https://example.com

    Rule: The user can refresh the current page

        Scenario: Refreshing the page reloads the current URL
            Given a chrome browser session
            And the user is at the URL https://example.com
            When the user refreshes the page

        Scenario: Clicking the browser refresh button reloads the current URL
            Given a chrome browser session
            And the user is at the URL https://example.com
            When the user clicks the browser's refresh button

