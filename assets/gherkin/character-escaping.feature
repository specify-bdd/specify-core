Feature: Character Escaping
    # The only character that should be printed is a single double-quote (")
    @skip
    Scenario: User can escape string characters
        Given that a command line prompt is available
        When a user runs the command "echo \\\""
        Then the console output should be "\""