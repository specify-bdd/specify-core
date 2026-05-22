Feature: Browser Testing Mode
    As a software developer
    I want to control how browser tests are executed
    So that I can prioritize system resource usage and test observability according to my needs and preferences

    Background:
        Given that the "@specify-bdd/specify" NPM package is installed
        And that the "@specify-bdd/plugin-browser" NPM package is installed
        And that the "@specify-bdd/plugin-cli" NPM package is installed
        And a CLI shell

    Rule: Headless mode is the default browser testing mode

        @skip @manual @todo
        Scenario: Headless testing is the default
            When the user runs the command "npx specify test ./gherkin/browser/headless.feature"
            # Then a browser window should not open # redundant with headless testing rule below
            Then the last command's exit code should be a ${ref.exitCode.success}

    Rule: Headless mode testing is local and invisible

        @skip @manual @todo
        Scenario: Headless testing is both local and invisible
            When the user runs the command "npx specify test --headless ./gherkin/browser/headless.feature" # feature stipulates local, non-visible
            Then the last command's exit code should be a ${ref.exitCode.success}

        @skip @manual
        Scenario: Headless testing fails if tests must run remotely
            When the user runs the command "npx specify test --headless ./gherkin/browser/grid.feature" # feature stipulates remote, non-visible
            Then the last command's exit code should be a ${ref.exitCode.failure}

        @skip @manual
        Scenario: Headless testing fails if tests must run visibly
            When the user runs the command "npx specify test --headless ./gherkin/browser/visual.feature" # feature stipulates local, visible
            Then the last command's exit code should be a ${ref.exitCode.failure}
    
    Rule: Visual mode testing is local and visible

        @skip @manual
        Scenario: Visual testing is both local and visible
            When the user runs the command "npx specify test --visual ./gherkin/browser/visual.feature"
            Then the last command's exit code should be a ${ref.exitCode.success}

        @skip @manual
        Scenario: Visual testing fails if tests must run remotely
            When the user runs the command "npx specify test --visual ./gherkin/browser/grid.feature"
            Then the last command's exit code should be a ${ref.exitCode.failure}

        @skip @manual
        Scenario: Visual testing fails if tests must run invisibly
            When the user runs the command "npx specify test --visual ./gherkin/browser/headless.feature"
            Then the last command's exit code should be a ${ref.exitCode.failure}

    Rule: Grid mode testing is remote

        Background:
            Given that a Selenium Grid is available at "http://localhost:4444"

        @skip @manual
        Scenario: Grid testing is both remote and invisible
            When the user runs the command "npx specify test --grid http://localhost:4444 ./gherkin/browser/grid.feature"
            # Then the Selenium Grid should execute the tests
            Then the last command's exit code should be a ${ref.exitCode.success}

        @skip @manual
        Scenario: Grid testing fails without a grid
            When the user runs the command "npx specify test --grid http://localhost:4567 ./gherkin/browser/grid.feature"
            Then the last command's exit code should be an ${ref.exitCode.error}
            And the last command's terminal output should match "Unable to connect to Selenium Grid"

        @skip @manual
        Scenario: Grid testing fails if tests must run locally
            When the user runs the command "npx specify test --grid http://localhost:4444 ./gherkin/browser/headless.feature"
            Then the last command's exit code should be a ${ref.exitCode.failure}

        @skip @manual
        Scenario: Grid testing fails if tests must run visibly
            When the user runs the command "npx specify test --grid http://localhost:4444 ./gherkin/browser/visual.feature"
            Then the last command's exit code should be a ${ref.exitCode.failure}

        @skip @manual
        Scenario: Grid option defaults to localhost:4444
            When the user runs the command "npx specify test --grid -- ./gherkin/browser/grid.feature"
            Then the last command's exit code should be an ${ref.exitCode.success}

    Rule: Conflicting browser mode options are not valid

        @skip @manual
        Scenario: Using both --visual and --headless
            When the user runs the command "npx specify test --visual --headless"
            Then the last command's exit code should be an ${ref.exitCode.error}
            And the last command's terminal output should match "Conflicting browser mode options"

        @skip @manual
        Scenario: Using both --visual and --grid
            When the user runs the command "npx specify test --visual --grid"
            Then the last command's exit code should be an ${ref.exitCode.error}
            And the last command's terminal output should match "Conflicting browser mode options"
