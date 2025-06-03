Feature: Browser Testing Mode
    As a software developer
    I want to control how browser tests are executed
    So that I can prioritize system resource usage and test observability according to my needs and preferences

    Background:
        Given that the "@specify/core" NPM package is installed
        And that the "@specify/plugin-browser" NPM package is installed
        And that the "@specify/plugin-cli" NPM package is installed
        And that a command line prompt is available
        And that a "passing browser feature" file exists at "./features"

    Rule: Headless mode is the default browser testing mode

        @manual
        Scenario: Headless testing is the default
            When a user runs the command "npx specify test"
            Then a browser window should not open
            And the command should exit with a "success" status code

    Rule: Headless mode testing is local and non-visible

        @manual
        Scenario: Headless testing is local
            When a user runs the command "npx specify test --headless"
            Then the command should exit with a "success" status code
            And the test ran locally

        @manual
        Scenario: Headless testing is not visible
            When a user runs the command "npx specify test --headless"
            Then a browser window should not open
    
    Rule: Visual mode testing is local and visible

        @manual
        Scenario: Visual testing is local
            When a user runs the command "npx specify test --visual"
            Then the command should exit with a "success" status code
            And the test ran locally
        
        @manual
        Scenario: Visual testing is visible
            When a user runs the command "npx specify test --visual"
            Then a browser window should open

    Rule: Grid mode testing is remote

        @manual
        Scenario: Grid testing is remote
            Given that a Selenium Grid is available at "http://localhost:4444"
            When a user runs the command "npx specify test --grid http://localhost:4444"
            Then the Selenium Grid should execute the tests
            And the command should exit with a "success" status code

        @manual
        Scenario: Grid testing fails without a grid
            Given that a Selenium Grid is not available at "http://localhost:4444"
            When the user runs the command "npx specify test --grid http://localhost:4444"
            Then the command should exit with an "error" status code
            And the console output should include "unable to connect to Selenium Grid"
        
        @todo @manual
        Scenario: Grid option defaults to ???

    Rule: Conflicting browser mode options are not valid

        Scenario: Using both --visual and --headless
            When a user runs the command "npx specify test --visual --headless"
            Then the command should exit with a "error" status code
            And the console output should include "conflicting browser mode options"
        
        Scenario: Using both --visual and --grid
            When a user runs the command "npx specify test --visual --grid"
            Then the command should exit with a "error" status code
            And the console output should include "conflicting browser mode options"
