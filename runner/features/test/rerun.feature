Feature: Rerun Failed Tests
    As a software developer
    I want to re-run previously failed tests
    In order to verify that changes I've made fixed the cause of the failure

    Background:
        Given that the "specify core test runner" NPM package is installed
        And that the "specify cli testing library" NPM package is installed
        And that a command line prompt is available

    Rule: Failed tests can be targeted for reruns

        Scenario: Rerun a subset of tests that failed
            Given that a "passing feature" file exists at "./features"
            And that a "failing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            And a user runs the command "npx specify test --rerun"
            Then the command should exit with a "failure" status code
            And the console output should include "failing test result"
            And the console output should not include "passing test result"

    Rule: No rerun happens if there was no failure in the previous run

        Scenario: A passing test suite doesn't rerun
            Given that a "passing feature" file exists at "./features"
            When a user runs the command "npx specify test"
            And a user runs the command "npx specify test --rerun"
            Then the console output should be "no tests to rerun"
