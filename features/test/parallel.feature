Feature: Parallel Execution
    As a software developer
    I want to run tests in parallel
    So that testing is faster and more efficient

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell
        And that the working directory is "./test"

    Rule: Tests run serially by default

        Scenario: Serial execution starts only one worker
            When a user runs the command "npx specify test ./gherkin/parallel/workers1.feature"
            Then the last command's exit code should be a ${ref.exitCode.success}

    Rule: Tests can be run in parallel

        Scenario: Parallel execution runs multiple workers
            When a user runs the command "npx specify test --parallel 2 ./gherkin/parallel/workers2.feature"
            Then the last command's exit code should be a ${ref.exitCode.success}

    Rule: Parallel option only accepts a single integer argument

        Scenario: Floats are rejected
            When a user runs the command "npx specify test --parallel 0.5"
            Then the last command's exit code should be a ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.invalidParallelError}

        Scenario: Non-numeric values are rejected
            When a user runs the command "npx specify test --parallel 'bad-value'"
            Then the last command's exit code should be a ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.invalidParallelError}

        Scenario: A value of 0 is rejected
            When a user runs the command "npx specify test --parallel 0"
            Then the last command's exit code should be a ${ref.exitCode.error}
            And the last command's terminal output should match ${ref.terminalOutput.invalidParallelError}
