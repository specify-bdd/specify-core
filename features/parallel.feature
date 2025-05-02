Feature: Parallel Execution
    As a software developer
    I want to run tests in parallel
    So that testing is faster and more efficient

    Background:
        Given that I have a command line prompt
        And that the `[appname] core test runner` NPM package is installed
        And that the `[appname] command line testing library` NPM package is installed
        And that I have a `Gherkin feature that passes after 5 seconds` file located at `./features`
        And that I have a `Gherkin feature that fails after 5 seconds` file located at `./features`

    Rule: Tests can be executed in parallel

        Scenario: Run slow tests in parallel
            When I input the command `npx [appname] test --parallel 2`
            Then the command should return a `failure` status code
            And the elapsed time should be less than `6s`

        Scenario: Run slow tests serially
            When I input the command `npx [appname] test`
            Then the command should return a `failure` status code
            And the elapsed time should be greater than `10s`
