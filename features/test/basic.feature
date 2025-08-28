Feature: Basic Test Execution
    As a software developer
    I want to run automated tests based on Gherkin behavior specs
    In order to ensure that my software functions as the specs say it should

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./assets/gherkin"

    Rule: The run should succeed only if all tests pass

        Scenario: All tests pass
            When a user runs the command "npx specify test ./binary/passing.feature"
            Then the last command's exit code should be a $success
            And the last command's terminal output should match $passingTestResult

        Scenario: All tests fail
            When a user runs the command "npx specify test ./binary/failing.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match $failingTestResult

        Scenario: Mixed pass/fail tests
            When a user runs the command "npx specify test ./binary/"
            Then the last command's exit code should be a $failure

    Rule: The run should allow verification of string values in terminal output

        Scenario: Verify string in terminal output
            When a user runs the command "echo foobar"
            Then the last command's terminal output should match "foobar"

    Rule: The run should error if there are invalid features

        @dependency
        Scenario: Feature has a Gherkin syntax error
            When a user runs the command "npx specify test ./invalid.feature"
            Then the last command's exit code should be an $error

        @dependency
        Scenario: Feature contains undefined step definitions
            When a user runs the command "npx specify test ./undefined.feature"
            Then the last command's exit code should be an $error

    Rule: The run should error if there are no available tests

        Scenario: User-specified path does not exist
            When a user runs the command "npx specify test ./nonexistent/path/"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $pathNotFoundError

        Scenario: User-specified path is empty
            When a user runs the command "npx specify test ./empty/"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noTestCasesError

        Scenario: User-specified path contains no features
            When a user runs the command "npx specify test ./no-features/test.md"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noTestCasesError

        Scenario: User-specified path contains no scenarios
            When a user runs the command "npx specify test ./empty.feature"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noTestCasesError

    Rule: Execution without a subcommand should default to testing

        Scenario: Passing test without subcommand
            When a user runs the command "npx specify ./binary/passing.feature"
            Then the last command's exit code should be a $success

    Rule: Users can run subsets of tests by path or tag

        Scenario: Only run tests with the specified tag
            When a user runs the command "npx specify test --tags '@pass' ./binary/"
            Then the last command's exit code should be a $success

        Scenario: Do not run tests with the specified inverted tag
            When a user runs the command "npx specify test --tags 'not @fail' ./binary/"
            Then the last command's exit code should be a $success

        Scenario: Unmatched tags cause an error
            When a user runs the command "npx specify test --tags '@nevermatch'"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noTestCasesError

    Rule: Invalid commands display usage help

        Scenario: Unsupported option
            When a user runs the command "npx specify --bad-option"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match $invalidOptionMessage

        Scenario: Mix of supported and unsupported options
            When a user runs the command "npx specify --tags '@pass' --bad-option"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match $invalidOptionMessage
