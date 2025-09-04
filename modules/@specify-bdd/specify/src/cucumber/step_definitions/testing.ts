/**
 * Testing Step Definitions Module
 *
 * Cucumber step definitions that facilitate Specify testing itself.
 */
import { Given, When, Then } from "@cucumber/cucumber";
import assert                from "node:assert/strict";

Given("that this step fails", fail);
Given("that this step passes", pass);
Given("that this step passes after {float} seconds", passAfterDelay);
Given("that this step passes on the {ordinal} attempt", passOnNthAttempt);

When("this step fails", fail);
When("this step passes", pass);
When("this step passes on the {ordinal} attempt", passOnNthAttempt);

Then("this step should fail", fail);
Then("this step should pass", pass);
Then("this step should pass on the {ordinal} attempt", passOnNthAttempt);

/**
 * Always throws, causing a scenario failure.
 */
function fail(): void {
    assert.fail("This is an expected failure");
}

/**
 * Always passes.
 */
function pass(): void {
    // no return or throw is a passing step result
}

/**
 * Always passes after delay.
 *
 * @param delay - The number of seconds to wait before passing.
 */
async function passAfterDelay(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}

/**
 * Only passes on the Nth attempt for any given test case.  Multiple attempts
 * are managed via the "retry" feature.
 *
 * @param attempt - The attempt number to pass
 */
async function passOnNthAttempt(attempt: number): Promise<void> {
    assert.equal(
        Object.keys(this.pickles[this.pickle.id].attempts).length,
        attempt,
        "This is not the correct attempt.",
    );
}
