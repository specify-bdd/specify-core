Feature: Basic Test Execution
    As a software developer
    I want to run automated tests based on Gherkin behavior specs
    In order to ensure that my software functions as the specs say it should

    Background:
        Given that the "@specify/core" NPM package is installed
        And that the "@specify/plugin-cli" NPM package is installed
        And that a command line prompt is available

    Rule: The run should succeed if all tests pass

        Scenario: All tests pass
            Given that a "passing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with a "success" status code
            And the console output should be a "passing test result"

    Rule: The run should fail if any tests fail

        Scenario: All tests fail
            Given that a "failing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with a "failure" status code
            And the console output should be a "failing test result"

        Scenario: Mixed pass/fail tests
            Given that a "passing feature" file exists at "./features"
            And that a "failing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with a "failure" status code
    
        Scenario: Feature contains no scenarios
            Given that an "empty feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with an "failure" status code
    
    Rule: The run should error if there are invalid features
        
        @dependency
        Scenario: Feature has a Gherkin syntax error
            Given that an "invalid feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with an "error" status code
        
        @dependency
        Scenario: Feature contains undefined step definitions
            Given that an "undefined step feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with an "error" status code

    Rule: The run should error if there are no available tests

        Scenario: Default path is empty
            Given that the path "./features" is empty
            When a user runs the command "npx specify test"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"

        Scenario: Default path contains no features
            Given that the path "./features" has no files matching "*.feature"
            When a user runs the command "npx specify test"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"

        @dependency
        Scenario: Feature file is unreadable
            Given that an "unreadable passing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"

    Rule: Users can override the default features path

        Scenario: Feature in user-specified path
            Given that a "passing feature" file exists at "./custom"
            When a user runs the command "npx specify test ./custom"
            Then the command should exit with a "success" status code

        Scenario: User-specified path does not exist
            Given that the path "./custom" does not exist
            When a user runs the command "npx specify test ./custom"
            Then the command should exit with a "error" status code
            And the console output should be a "path not found error"

        Scenario: User-specified path is empty
            Given that the path "./custom" is empty
            When a user runs the command "npx specify test ./custom"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"
        
        Scenario: User-specified path contains no features
            Given that the path "./custom" has no files matching "*.feature"
            When a user runs the command "npx specify test ./custom"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"
    
    Rule: Execution without a subcommand should default to testing

        Scenario: Passing test without subcommand
            Given that a "passing feature" file exists at "./features"
            When a user runs the command "npx specify"
            Then the command should exit with a "success" status code

        Scenario: Passing test without subcommand with argument
            Given that a "passing feature" file exists at "./custom"
            When a user runs the command "npx specify ./custom"
            Then the command should exit with a "success" status code

    Rule: Users can run subsets of tests by path or tag

        Scenario: Only run tests in the specified path
            Given that a "passing feature" file exists at "./features/pass"
            And that a "failing feature" file exists at "./features/fail"
            When a user runs the command "npx specify test ./features/pass"
            Then the command should exit with a "success" status code

        Scenario: Only run tests with the specified tag
            Given that a "passing feature" file exists at "./features"
            And that a "failing feature" file exists at "./features"
            When a user runs the command "npx specify test --tags '@pass'"
            Then the command should exit with a "success" status code
        
        Scenario: Unmatched tags cause an error
            Given that a "passing feature" file exists at "./features"
            When a user runs the command "npx specify test --tags '@fail'"
            Then the command should exit with a "error" status code
            And the console output should be a "no features error"
    
    Rule: Invalid commands display usage help

        Scenario: Unsupported subcommand
            When a user runs the command "npx specify bad-subcommand"
            Then the command should exit with a "failure" status code
            And the console output should be a "help message"

        Scenario: Unsupported option
            When a user runs the command "npx specify --bad-option"
            Then the command should exit with a "failure" status code
            And the console output should be a "help message"

        Scenario: Mix of supported and unsupported options
            When a user runs the command "npx specify --parallel 2 --bad-option"
            Then the command should exit with a "failure" status code
            And the console output should be a "help message"
