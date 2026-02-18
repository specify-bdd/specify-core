Feature: Two Workers

    Scenario: Pass if there are two workers running in parallel (A)
        # When this scenario runs in parallel-2 mode
        Then there should be 2 parallel workers

    Scenario: Pass if there are two workers running in parallel (B)
        # When this scenario runs in parallel-2 mode
        Then there should be 2 parallel workers
