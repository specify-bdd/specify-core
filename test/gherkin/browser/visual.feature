@browser
Feature: Visual Browser Testing

    Background:
        Given that I have a "chrome" browser open

    @todo
    Scenario: Browser is visible
        Then the browser window should be visible # but how can we know?
        And the browser session should be local # but how can we know?
