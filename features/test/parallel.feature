Feature: Parallel Execution
    As a software developer
    I want to run tests in parallel
    So that testing is faster and more efficient

    Background:
        Given that the "@specify/core" NPM package is installed
        And that the "@specify/plugin-cli" NPM package is installed
        And that a command line prompt is available
        And that a "5 second passing feature" file exists at "./features"
        And that a "5 second failing feature" file exists at "./features"

    Rule: Tests run serially by default

        Scenario: Serial execution takes more than 10 seconds
            When a user runs the command "npx specify test"
            Then the command should exit with a "failure" status code
            And the elapsed time should be greater than "10" seconds

    Rule: Tests can be run in parallel

        Scenario: Parallel execution takes less than 6 seconds
            When a user runs the command "npx specify test --parallel 2"
            Then the command should exit with a "failure" status code
            And the elapsed time should be less than "6" seconds
        
        Scenario: Parallel option defaults to a value of one less than total CPU cores
            Given that the path "./features" is empty
            And that cpu-cores minus 1 "5 second passing feature" files exist at "./features"
            When a user runs the command "npx specify test --parallel"
            Then the command should exit with a "success" status code
            And the elapsed time should be less than "6" seconds
    
    Rule: Parallel option only accepts a single integer argument
        
        Scenario: Multiple integers are rejected
            When a user runs the command "npx specify test --parallel 1 2"
            Then the command should exit with an "error" status code
            And the console output should be a "help message"
        
        Scenario: Floats are rejected
            When a user runs the command "npx specify test --parallel 0.5"
            Then the command should exit with an "error" status code
            And the console output should be a "help message"
        
        Scenario: Non-numeric values are rejected
            When a user runs the command "npx specify test --parallel 'bad-value'"
            Then the command should exit with an "error" status code
            And the console output should be a "help message"

        @todo
        Scenario: A value of 0 is rejected (or handled gracefully)

        @todo
        Scenario: An excessively high value is rejected (or handled gracefully) 
