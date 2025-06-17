Feature: Gherking feature file that should fail
    @fail
    Scenario: Scenario that should fail
        Given that this step definition fails

    @fail
    Scenario: Another scenario that should fail
        When this step definition fails

    @fail
    Scenario: Yet another scenario that should fail
        Then this step definition should fail
