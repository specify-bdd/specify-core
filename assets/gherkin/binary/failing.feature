Feature: Gherkin feature file that should fail
    @fail
    Scenario: Scenario that should fail
        Given that this step fails

    @fail
    Scenario: Another scenario that should fail
        When this step fails

    @fail
    Scenario: Yet another scenario that should fail
        Then this step should fail
