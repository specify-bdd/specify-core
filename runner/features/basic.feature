Feature: Basic Test Execution
    As a software developer
    I want to run automated tests based on Gherkin behavior specs
    In order to ensure that my software functions as the specs say it should

    Background:
        Given that the `[appname] core test runner` NPM package is installed
        And that the `[appname] command line testing library` NPM package is installed
        And that I have a command line prompt

    Rule: The run should succeed if all tests pass

        Scenario: Run a test that should pass
            Given that I have a `Gherkin feature that should pass` file located at `./features`
            When I input the command `npx [appname] test`
            Then the command should return a `success` status code
            And I should see `passing test result` console output

    Rule: The run should fail if any tests fail

        Scenario: Run a test that should fail
            Given that I have a `Gherkin feature that should fail` file located at `./features`
            When I input the command `npx [appname] test`
            Then the command should return a `failure` status code
            And I should see `failing test result` console output

        Scenario: Run multiple tests that should fail
            Given that I have a `Gherkin feature that should pass` file located at `./features`
            And that I have a `Gherkin feature that should fail` file located at `./features`
            When I input the command `npx [appname] test`
            Then the command should return a `failure` status code

    Rule: Execution without a subcommand should default to testing

        Scenario: Run a test with no subcommand
            Given that I have a `Gherkin feature that should pass` file located at `./features`
            When I input the command `npx [appname]`
            Then the command should return a `success` status code

        Scenario: Run a test with no subcommand and additional arguments
            Given that I have a `Gherkin feature that should pass` file located at `./features`
            When I input the command `npx [appname] additional arguments`
            Then the command should return a `success` status code

    Rule: The run should fail if there are no test specs

        Scenario: Run a test with no gherkin files in the default location
            Given that the file location ./features is empty
            When I input the command `npx [appname] test`
            Then the command should return a `failure` status code
            And I should see `no features error` console output

    Rule: Users can override the feature file path

        Scenario: Run a test with a gherkin file in a custom location
            Given that I have a `Gherkin feature that should pass` file located at `./custom`
            When I input the command `npx [appname] test ./custom`
            Then the command should return a `success` status code

        Scenario: Run a test with no gherkin files in a custom location
            Given that the file location ./custom is empty
            When I input the command `npx [appname] test ./custom`
            Then the command should return a `failure` status code
            And I should see `no features error` console output

    Rule: Users can run subsets of tests using file path and tags

        Scenario: Run a subset of tests based on file path
            Given that I have a `Gherkin feature that should pass` file located at `./features/pass`
            And that I have a `Gherkin feature that should fail` file located at `./features/fail`
            When I input the command `npx [appname] test ./features/pass`
            Then the command should return a `success` status code

        Scenario: Run a subset of tests based tags
            Given that I have a `Gherkin feature with tags` file located at `./features`
            When I input the command `npx [appname] test --tags "@pass"`
            Then the command should return a `success` status code

