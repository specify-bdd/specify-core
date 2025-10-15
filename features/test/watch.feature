Feature: Watch Mode
    As a software developer
    I want to run tests in watch mode that automatically rerun when files change
    So that I can get immediate feedback during development without manually rerunning tests

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./assets/gherkin"

    Rule: Watch mode monitors file changes and reruns tests automatically

        Scenario: Watch mode starts and monitors for changes
            When a user starts the async command "npx specify test --watch ./binary/passing.feature"
            And a user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "3 scenarios \(3 passed\)"

        Scenario: Tests rerun automatically when file changes are detected
            Given the "./assets/gherkin/watch-test-file.txt" file content is empty
            When a user starts the async command "npx specify test --watch ./binary/passing.feature"
            And a user waits for terminal output matching "Watching for changes"
            And a user waits for 0.1 seconds
            And the "./assets/gherkin/watch-test-file.txt" file content is changed to "new change"
            And a user waits for terminal output matching "Watching[\s\S]+Watching"

    Rule: Watch mode can be combined with other options

        Scenario: Watch mode with retry option
            When a user starts the async command "npx specify test --watch --retry 2 ./retry/attempt3.feature"
            And a user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "(attempt 2)"

        @skip
        Scenario: Watch mode with parallel execution
            When a user starts the async command "npx specify test --watch --parallel 2 ./slow.feature"
            And a user waits for terminal output matching "Watching for changes"
            Then the last command's execution time should be at most 4 seconds

        Scenario: Watch mode with tag filtering
            When a user starts the async command "npx specify test --watch --tags '@pass' ./binary/"
            And a user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "3 scenarios \(3 passed\)"

    Rule: Watch mode handles file system events appropriately

        Scenario: Watch mode handles file deletion gracefully
            Given the "./assets/gherkin/deleteme.feature" file content is empty
            When a user starts the async command "npx specify test --watch ./binary/passing.feature"
            And a user waits for terminal output matching "Watching for changes"
            And a user waits for 0.1 seconds
            And the "./assets/gherkin/deleteme.feature" file is deleted
            And a user waits for terminal output matching "Watching[\s\S]+Watching"

        @skip
        Scenario: Watch mode handles new file creation
            Given that watch mode is running for "./features"
            When a new feature file is created at "./features/newtest.feature"
            Then the tests should automatically rerun
            And the new test should be included in the test run

    Rule: Watch mode can be stopped gracefully

        @skip
        Scenario: Watch mode stops on user interrupt
            Given that watch mode is running
            When the user sends a SIGINT signal (Ctrl+C)
            Then the watch mode should stop gracefully
            And the console output should include "Watch mode stopped"

        @skip
        Scenario: Watch mode exits with error status when interrupted during test run
            Given that a "long running feature" file exists at "./features"
            And that watch mode is running
            When the user sends a SIGINT signal during test execution
            Then the watch mode should stop gracefully
            And the command should exit with an appropriate status code

    Rule: Watch mode option validation

        @skip
        Scenario: Watch mode conflicts with rerun option
            When a user runs the command "npx specify test --watch --rerun"
            Then the command should exit with an "error" status code
            And the console output should include "conflicting options"

        @skip
        Scenario: Watch mode requires valid file paths
            When a user runs the command "npx specify test --watch ./nonexistent/path"
            Then the command should exit with an "error" status code
            And the console output should include "path not found error"
