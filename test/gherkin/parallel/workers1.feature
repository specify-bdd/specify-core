Feature: One Worker

    Scenario: Pass if there is just one worker running (A)
        # When this scenario runs in serial mode
        Then there should be only 1 parallel worker

    Scenario: Pass if there is just one worker running (B)
        # When this scenario runs in serial mode
        Then there should be only 1 parallel worker
