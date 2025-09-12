Feature: Rerun Failed Tests
    As a software developer
    I want to rerun previously failed tests
    In order to verify that changes I've made fixed the cause of the failure

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that a temp directory named "rerunScenario" exists
        And that the working directory is $rerunScenario

    Rule: Every test run creates a rerun file

        @skip @todo
        Scenario: Passing test run creates an empty rerun file
            Given that the $rerun file path does not exist
            When a user runs the command "npx specify test ./binary/passing.feature" # doesn't work now, we're in the temp
            Then the $rerun file path should exist
            And the $rerun file content should be empty

        @skip @todo
        Scenario: Failing test run creates a rerun file
            Given that the $rerun file path does not exist
            When a user runs the command "npx specify test ./binary/failing.feature"
            Then the $rerun file path should exist
            And the $rerun file content should match $rerunFailingScenarios

    Rule: Only failing tests are included in the rerun file

        @skip @todo
        Scenario: Mixed test run creates rerun file with only failures
            Given that the $rerun file path does not exist
            When a user runs the command "npx specify test ./binary/passing.feature ./binary/failing.feature"
            Then the $rerun file content should match $rerunFailingScenarios

    Rule: Rerun only executes the tests that failed in the last test run

        @skip @todo
        Scenario: Rerun only one scenario in failing.feature
            Given that the $rerun file path exists
            And that the $rerun file content is "binary/failing.feature:3"
            When a user runs the command "npx specify test --rerun"
            Then the last command's terminal output should match "1 scenario \\(1 failed)"
            And the last command's terminal output should match "Scenario: Scenario that should fail # binary/failing.feature:3"

        @skip @todo
        Scenario: Rerun all three scenarios in failing.feature
            Given that the $rerun file path exists
            And that the $rerun file content is "binary/failing.feature:3:7:11"
            When a user runs the command "npx specify test --rerun"
            Then the last command's terminal output should match "3 scenario \\(3 failed)"

    Rule: Rerun does nothing if the last test run passed completely

        @skip @todo
        Scenario: Rerun after the last test run passed returns an error
            Given that the $rerun file path exists
            And that the $rerun file content is empty
            When a user runs the command "npx specify test --rerun"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noTestCasesError

    Rule: Rerun can't be used with feature paths

        @skip @todo
        Scenario: Rerun with a feature path returns an error
            When a user runs the command "npx specify test --rerun ./binary/passing.feature"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noPathsWithRerunError

    Rule: Rerun can't be used without a rerun file

        @skip @todo
        Scenario: Rerun without a rerun file
            Given that the $rerun file path does not exist
            When a user runs the command "npx specify test --rerun"
            Then the last command's exit code should be an $error
            And the last command's terminal output should match $noRerunFileError

