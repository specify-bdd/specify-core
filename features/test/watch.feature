Feature: Watch Mode
    As a software developer
    I want to run tests in watch mode that automatically rerun when files change
    So that I can get immediate feedback during development without manually rerunning tests

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./test"

    Rule: Watch mode monitors file changes and reruns tests automatically

        Scenario: Watch mode starts and monitors for changes
            When a user starts the async command "npx specify test --watch ./gherkin/binary/passing.feature"
            And the user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "3 scenarios \(3 passed\)"

        Scenario: Tests rerun automatically when file changes are detected
            Given that the "./watch-test-file.txt" file content is empty
            When a user starts the async command "npx specify test --watch ./gherkin/binary/passing.feature"
            And the user waits for terminal output matching "Watching for changes"
            And the user waits for 0.1 seconds
            And the user changes the "./watch-test-file.txt" file content to "new change"
            And the user waits for terminal output matching "Watching[\s\S]+Watching"

    Rule: Watch mode can be combined with other options

        Scenario: Watch mode with retry option
            When a user starts the async command "npx specify test --watch --retry 2 ./gherkin/retry/attempt3.feature"
            And the user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "(attempt 2)"

        Scenario: Watch mode with parallel execution
            When a user starts the async command "npx specify test --watch --parallel 2 ./gherkin/parallel/workers2.feature"
            And the user waits for terminal output matching "Watching for changes"

        Scenario: Watch mode with tag filtering
            When a user starts the async command "npx specify test --watch --tags '@pass' ./gherkin/binary/"
            And the user waits for terminal output matching "Watching for changes"
            Then the last command's terminal output should match "3 scenarios \(3 passed\)"

    Rule: Watch mode handles file system events appropriately

        Scenario: Watch mode handles file deletion
            Given that the "./deleteme.txt" file content is empty
            When a user starts the async command "npx specify test --watch ./gherkin/binary/passing.feature"
            And the user waits for terminal output matching "Watching for changes"
            And the user waits for 0.1 seconds
            And the user deletes the "./deleteme.txt" file
            And the user waits for terminal output matching "Watching[\s\S]+Watching"

        Scenario: Watch mode handles file creation
            When a user starts the async command "npx specify test --watch ./gherkin/binary/passing.feature"
            And the user waits for terminal output matching "Watching for changes"
            And the user waits for 0.1 seconds
            And the user creates the "./createthendeleteme.txt" file
            And the user waits for terminal output matching "Watching[\s\S]+Watching"
            And the user deletes the "./createthendeleteme.txt" file

    Rule: Watch mode can be stopped gracefully

        Scenario: Watch mode stops on user interrupt
            When a user starts the async command "npx specify test --watch ./gherkin/binary/passing.feature"
            And the user waits for terminal output matching "Watching for changes"
            And the user sends a "SIGINT" signal to the last command
            And the user waits for the last command to return
            Then the last command's exit code should be 130

        Scenario: Watch mode exits with error status when interrupted during test run
            When a user starts the async command "npx specify test --watch ./gherkin/slow.feature"
            And the user waits for 1 second
            And the user sends a "SIGINT" signal to the last command
            And the user waits for the last command to return
            Then the last command's terminal output should not match "Watching"
            And the last command's exit code should be 130

    Rule: Watch mode option validation

        Scenario: Watch mode conflicts with rerun option
            When a user runs the command "npx specify test --watch --rerun"
            Then the last command's exit code should be a ${ref.exitCode.error}
            And the last command's terminal output should match "Conflicting options"

        Scenario: Watch mode requires valid file paths
            When a user runs the command "npx specify test --watch ./nonexistent/path"
            Then the last command's exit code should be a ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.pathNotFoundError}
