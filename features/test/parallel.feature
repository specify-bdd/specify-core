Feature: Parallel Execution
    As a software developer
    I want to run tests in parallel
    So that testing is faster and more efficient

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./assets/gherkin"

    Rule: Tests run serially by default

        Scenario: Serial execution takes more than 4 seconds
            When a user runs the command "npx specify test ./slow.feature"
            Then the last command's exit code should be a $success
            And the last command's execution time should be at least 6 seconds

    Rule: Tests can be run in parallel

        Scenario: Parallel execution takes less than 4 seconds
            When a user runs the command "npx specify test --parallel 3 ./slow.feature"
            Then the last command's exit code should be a $success
            And the last command's execution time should be at most 5 seconds

    Rule: Parallel option only accepts a single integer argument

        @skip
        Scenario: Floats are rejected
            When a user runs the command "npx specify test --parallel 0.5"
            Then the last command's exit code should be an $error
            And the console output should match "help message"

        @skip
        Scenario: Non-numeric values are rejected
            When a user runs the command "npx specify test --parallel 'bad-value'"
            Then the last command's exit code should be an $error
            And the console output should match "help message"

        @skip @todo
        Scenario: A value of 0 is equivalent to no limit

        @skip @todo
        Scenario: An excessively high value is rejected (or handled gracefully) 
