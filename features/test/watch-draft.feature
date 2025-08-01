Feature: Watch Mode
    As a software developer
    I want to run tests in watch mode that automatically rerun when files change
    So that I can get immediate feedback during development without manually rerunning tests

    Background:
        Given that the "@specify/core" NPM package is installed
        And that the "@specify/plugin-cli" NPM package is installed
        And that a command line prompt is available

    Rule: Watch mode monitors file changes and reruns tests automatically

        @skip
        Scenario: Watch mode starts and monitors for changes
            # Given that a "passing feature" file exists at "./features"              # we don't use these anymore
            When a user runs the command "npx specify test --watch"                 # this step will time out
            Then the command should start in watch mode                             # how would we verify this?
            # Then the "npx specify test --watch" process should be running
            And the console output should include "Watching for file changes"       # can we test this for a command that hasn't finished?
            And the initial test run should complete with a "success" status code   # can we intercept a persistent command's subprocess exit status?

        @skip
        Scenario: Test reruns automatically when feature file changes
            Given that a "passing feature" file exists at "./features"
            And that watch mode is running                              # can we generalize this?
            When the feature file is modified                           # this could be executing a command to append whitespace to a file maybe?
            Then the tests should automatically rerun                   # should strike "automatically"

        @skip
        Scenario: Test reruns automatically when step definition changes
            Given that a "passing feature" file exists at "./features"
            And that a custom step definition file exists at "./features/steps"
            And that watch mode is running
            When the step definition file is modified
            Then the tests should automatically rerun

        @skip
        Scenario: Watch mode reruns only affected tests when using specific file paths
            Given that a "passing feature" file exists at "./features/test1.feature"
            And that a "passing feature" file exists at "./features/test2.feature"
            And that watch mode is running with "npx specify test --watch ./features/test1.feature" # need to distinguish between paths we're watching and tests we're running
            When "./features/test2.feature" is modified
            Then the tests should not rerun
            When "./features/test1.feature" is modified
            Then the tests should automatically rerun

    Rule: Watch mode can be combined with other options # these tests won't work until other features are implemented...

        @skip
        Scenario: Watch mode with retry option
            Given that a "flaky feature" file exists at "./features"
            When a user runs the command "npx specify test --watch --retry 2"
            Then the command should start in watch mode
            And failed tests should be retried according to the retry setting

        @skip
        Scenario: Watch mode with parallel execution
            Given that multiple "passing feature" files exist at "./features"
            When a user runs the command "npx specify test --watch --parallel 2"
            Then the command should start in watch mode
            And tests should run in parallel according to the parallel setting

        @skip
        Scenario: Watch mode with tag filtering
            Given that a "tagged feature" file exists at "./features"
            When a user runs the command "npx specify test --watch --tags '@smoke'"
            Then the command should start in watch mode
            And only tests matching the tag filter should run

    Rule: Watch mode handles file system events appropriately

        @skip
        Scenario: Watch mode ignores temporary files
            Given that a "passing feature" file exists at "./features"
            And that watch mode is running
            When a temporary file is created in "./features" # dumb question: what distinguishes a temporary file?
            Then the tests should not rerun

        @skip
        Scenario: Watch mode handles file deletion gracefully
            Given that a "passing feature" file exists at "./features/deleteme.feature"
            And that watch mode is running
            When "./features/deleteme.feature" is deleted
            Then the tests should automatically rerun

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
            When the user sends a SIGINT signal (Ctrl+C)                # can we do this?
            Then the watch mode should stop gracefully                  # what does this mean mechanically?
            And the console output should include "Watch mode stopped"

        @skip
        Scenario: Watch mode exits with error status when interrupted during test run
            Given that a "long running feature" file exists at "./features"
            And that watch mode is running
            When the user sends a SIGINT signal during test execution   # how will we know when tests are executing?
            Then the watch mode should stop gracefully
            And the command should exit with an appropriate status code

    Rule: Watch mode provides clear status information

        @skip
        Scenario: Watch mode shows file change detection and test completion status
            Given that watch mode is running
            When a monitored file changes                                       # what file? what changes?
            Then the console output should include the name of the changed file
            And the console output should include a timestamp of the change     # might have a race condition here
            When tests complete after the file change
            Then the console output should include the test results summary
            And the console output should include "Waiting for file changes..."

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
