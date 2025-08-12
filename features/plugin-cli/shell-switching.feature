Feature: Shell Switching
    As a software developer
    I want to run automated tests in one or more shells
    So that command execution is flexible and efficient

    Background:
        Given that the "@specify/core" NPM package is installed
        And that the "@specify/plugin-cli" NPM package is installed
        And a CLI shell
        And another CLI shell

    Scenario: Shell switching works
        When a user runs the command "echo 'First shell!'"
        And a user switches shells
        And a user runs the command "echo 'Second shell!'"
        Then the last command's terminal output should match "Second shell!"
        When a user switches shells
        Then the last command's terminal output should match "First shell!"
