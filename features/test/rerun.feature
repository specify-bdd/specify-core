Feature: Rerun Failed Tests
    As a software developer
    I want to rerun previously failed tests
    In order to verify that changes I've made fixed the cause of the failure

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And a new temp file path referenced as "rerun.path"
        And that the working directory is "./test"

    Rule: Every test run creates a rerun file

        Scenario: Passing test run creates an empty rerun file
            When a user runs the command "npx specify test --rerun-file=${rerun.path} ./gherkin/binary/passing.feature"
            Then the ${rerun.path} file path should exist
            And the ${rerun.path} file content should be empty

        Scenario: Failing test run creates a rerun file
            When a user runs the command "npx specify test --rerun-file=${rerun.path} ./gherkin/binary/failing.feature"
            Then the ${rerun.path} file path should exist
            And the ${rerun.path} file content should match ${ref.file.rerun.content.failingScenarios}

    Rule: Only failing tests are included in the rerun file

        Scenario: Mixed test run creates rerun file with only failures
            When a user runs the command "npx specify test --rerun-file=${rerun.path} ./gherkin/binary/passing.feature ./gherkin/binary/failing.feature"
            Then the ${rerun.path} file content should match ${ref.file.rerun.content.failingScenarios}

    Rule: Rerun only executes the tests that failed in the last test run

        Scenario: Rerun only one scenario in failing.feature
            Given that the ${rerun.path} file content is "gherkin/binary/failing.feature:3"
            When a user runs the command "npx specify test --rerun --rerun-file=${rerun.path}"
            Then the last command's terminal output should match "1 scenario \(1 failed\)"
            And the last command's terminal output should match "Scenario: Scenario that should fail # gherkin/binary/failing.feature:3"

        Scenario: Rerun all three scenarios in failing.feature
            And that the ${rerun.path} file content is "gherkin/binary/failing.feature:3:7:11"
            When a user runs the command "npx specify test --rerun --rerun-file=${rerun.path}"
            Then the last command's terminal output should match "3 scenarios \(3 failed\)"

    Rule: Rerun does nothing if the last test run passed completely

        Scenario: Rerun after passing test run returns an error
            Given that the ${rerun.path} file content is empty
            When a user runs the command "npx specify test --rerun --rerun-file=${rerun.path}"
            Then the last command's exit code should be an ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.noRerunTestsError}

    Rule: Rerun file path defaults to os.tmpdir()/specify/rerun.txt

        Scenario: Failing test run creates a rerun file in the default location
            Given that the ${config.paths.rerun} file content is empty
            When a user runs the command "npx specify test ./gherkin/binary/failing.feature"
            Then the ${config.paths.rerun} file path should exist
            And the ${config.paths.rerun} file content should match ${ref.file.rerun.content.failingScenarios}

    Rule: Rerun can't be used without a rerun file

        Scenario: Rerun without a rerun file
            When a user runs the command "npx specify test --rerun --rerun-file=${rerun.path}"
            Then the last command's exit code should be an ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.noRerunFileError}

