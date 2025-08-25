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

When("this step fails", fail);
When("this step passes", pass);

Then("this step should fail", fail);
Then("this step should pass", pass);

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
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
}
