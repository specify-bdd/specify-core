Feature: Browser Testing Mode
    As a software developer
    I want to control how browser tests are executed
    So that I can prioritize system resource usage and test observability according to my needs and preferences

    Background:
        Given that the `[appname] core test runner` NPM package is installed
        And that the `[appname] browser testing library` NPM package is installed
        And that the `[appname] command line testing library` NPM package is installed
        And that I have a `Gherkin browser test feature` file located at `./features`

    Rule: Tests executed in grid mode run remotely

        @manual
        Scenario: Run a test in grid mode
            And that I have a Selenium Grid available at http://localhost:4444
            When I input the command npx [appname] test --grid http://localhost:4444
            Then the tests should execute on the Selenium Grid
            And the command should return a status of 0

    Rule: Tests executed in visual mode run locally and are observable

        @manual
        Scenario: Run a test in visual mode
            When I input the command npx [appname] test --visual
            Then the tests should open browser windows
            And the command should return a status of 0

    Rule: Tests executed in headless mode run locally but are not observable

        @manual
        Scenario: Run a test in headless mode
            When I input the command npx [appname] test --headless
            Then the tests should not open browser windows
            And the command should return a status of 0

    Rule: Tests execute in headless mode by default

        @manual
        Scenario: Headless mode is the default
            When I input the command npx [appname] test
            Then the tests should not open browser windows
            And the command should return a status of 0
