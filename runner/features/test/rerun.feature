Feature: Rerun Failed Tests
    As a software developer
    I want to re-run previously failed tests
    In order to verify that changes I've made fixed the cause of the failure

    Background:
        Given that the `specify core test runner` NPM package is installed
        And that the `specify command line testing library` NPM package is installed
        And that I have a command line prompt

    Rule: Failed tests can be easily re-run after making fixes

        Scenario: Re-run a subset of tests that failed
            Given that I have a `Gherkin feature that should pass` file located at `./features`
            And that I have a `Gherkin feature that should fail` file located at `./features`
            And that I ran a test that failed
            When I input the command `npx specify test --rerun`
            And I should see `failing test result` console output
