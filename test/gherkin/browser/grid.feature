@browser
Feature: Grid Browser Testing

    Background:
        # Given that a Selenium Grid is available at "http://localhost:4444" # this should be handled by the outer spec
        Given that I have a "chrome" browser open

    @todo
    Scenario: Browser is remote
        Then the browser window should not be visible # but how can we know?
        And the browser session should not be local # but how can we know?
