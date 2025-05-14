Feature: Parallel Execution
    As a software developer
    I want to run tests in parallel
    So that testing is faster and more efficient

    Background:
        Given that the "specify core test runner" NPM package is installed
        And that the "specify cli testing library" NPM package is installed
        And that a command line prompt is available
        And that "2" "5 second passing feature" files exist at "./features"

    Rule: Tests run serially by default

        Scenario: Serial execution takes more than 10 seconds
            When a user runs the command "npx specify test"
            Then the command should exit with a "success" status code
            And the elapsed time should be greater than "10" seconds

    Rule: Tests can be run in parallel

        @todo
        Scenario: Parallel option defaults to a value of ???

        Scenario: Parallel execution takes less than 6 seconds
            When a user runs the command "npx specify test --parallel 2"
            Then the command should exit with a "success" status code
            And the elapsed time should be less than "6" seconds
    
    Rule: Parallel option only accepts a single integer argument
        
        Scenario: Multiple integers are rejected
            When a user runs the command "npx specify test --parallel 1 2"
            Then the command should exit with an "error" status code
            And the console output should be "help message"
        
        Scenario: Floats are rejected
            When a user runs the command "npx specify test --parallel 0.5"
            Then the command should exit with an "error" status code
            And the console output should be "help message"
        
        Scenario: Text is rejected
            When a user runs the command "npx specify test --parallel 'bad-value'"
            Then the command should exit with an "error" status code
            And the console output should be "help message"

        @todo
        Scenario: A value of 0 is rejected (or handled gracefully)

        @todo
        Scenario: An excessively high value is rejected (or handled gracefully) 
