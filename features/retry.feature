Feature: Retry Flaky Tests
    As a software developer
    I want to run automated tests that retry automatically on failure
    In order to ensure that flaky tests don't trigger alarms for transitory issues

    Background:
        Given that I have a command line prompt
        And that the `[appname] core test runner` NPM package is installed
        And that the `[appname] command line testing library` NPM package is installed

    Rule: Flaky tests can be retried and any success among retries counts as passing

        Scenario: Run a test that should fail with 2 retries
            Given that I have a `Gherkin feature that should pass on the 3rd retry` file located at `./features`
            When I input the command `npx [appname] test --retry 2`
            Then the command should return a `failure` status code

        Scenario: Run a test that should pass with 3 retries
            Given that I have a `Gherkin feature that should pass on the 3rd retry` file located at `./features`
            When I input the command `npx [appname] test --retry 3`
            Then the command should return a `success` status code

    Rule: Tags can be used to retry only certain tests

        Scenario: Run a test that should pass with 3 retries, plus a slow test with no retries
            Given that I have a `Gherkin feature that should pass on the 3rd retry` file located at `./features`
            And that I have a `Gherkin feature that fails after 5 seconds` file located at `./features`
            When I input the command `npx [appname] test --retry 3 --retry-tag "@retry"`
            Then the command should return a `failure` status code
            And the elapsed time should be less than `10s`

