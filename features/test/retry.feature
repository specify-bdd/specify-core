Feature: Retry Flaky Tests
    As a software developer
    I want to run automated tests that retry automatically on failure
    In order to ensure that flaky tests don't trigger alarms for transitory issues

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./assets/gherkin"

    Rule: Tests can be run without retrying

        @skip @todo
        Scenario: A test with the retry tag that fails if retries are disabled
            When a user runs the command "npx specify test --retry 0 ./retry/attempt2.feature"
            Then the last command's exit code should be a $failure

        @skip @todo
        Scenario: A test with no retry tag fails if retries are enabled
            When a user runs the command "npx specify test --retry 1 ./binary/failing.feature"
            Then the last command's exit code should be a $failure

    Rule: Tests run with any number of retries count as passing if any attempt succeeds

        @skip @todo
        Scenario: A test which passes on the 3rd attempt fails if given only 1 retry
            When a user runs the command "npx specify test --retry 1 ./retry/attempt3.feature"
            Then the last command's exit code should be a $failure

        @skip @todo
        Scenario: A test which passes on the 3rd attempt succeeds if given 2 retries
            When a user runs the command "npx specify test --retry 2 ./retry/attempt3.feature"
            Then the last command's exit code should be a $success

    Rule: By default, tests are run with just one retry

        @skip @todo
        Scenario: A test with the retry tag makes two attempts
            When a user runs the command "npx specify test ./retry/attempt3.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match "\\(attempt 2\\)"

    Rule: Tests with no retry tag fail after first attempt

        @skip @todo
        Scenario: A test with no retry tag makes just one attempt even if given 1 retry
            When a user runs the command "npx specify test --retry 1 ./retry/attempt2.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should not match "retried"

    Rule: Tests with retry tag fail only after retries

        @skip @todo
        Scenario: A test with the retry tag makes two attempts if given 1 retry
            When a user runs the command "npx specify test --retry 1 ./retry/attempt3.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match "\\(attempt 1, retried\\)"
            And the last command's terminal output should match "\\(attempt 2\\)"

    Rule: Retry tag can be overridden

        @skip @todo
        Scenario: A test with the standard retry tag won't retry if the tag has been overridden
            When a user runs the command "npx specify test --retry 1 --retry-tag '@custom-retry' ./retry/attempt2.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should not match "retried"

        @skip @todo
        Scenario: A test with a custom retry tag will retry if the tag has been overridden
            When a user runs the command "npx specify test --retry 1 --retry-tag '@custom-retry ./retry/custom.feature"
            Then the last command's exit code should be a $success
            And the last command's terminal output should match "\\(attempt 1, retried\\)"

    Rule: Retry option only accepts a single integer argument

        @skip @todo
        Scenario: Floats are rejected
            When a user runs the command "npx specify test --retry 0.5 ./binary/passing.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match $invalidRetryError

        @skip @todo
        Scenario: Non-numeric values are rejected
            When a user runs the command "npx specify test --retry 'bad-value' ./binary/passing.feature"
            Then the last command's exit code should be a $failure
            And the last command's terminal output should match $invalidRetryError

    # Rule: Retry tag option only accepts well-formed tag expressions
    # This one is going to be hard to implement because we would need to parse tag expressions and output special error
    # text for bad inputs, which Cucumber does not do
