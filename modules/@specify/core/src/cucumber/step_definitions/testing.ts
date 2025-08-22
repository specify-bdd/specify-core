/**
 * Testing Step Definitions Module
 *
 * Cucumber step definitions that facilitate Specify testing itself.
 */
import { Given, When, Then } from "@cucumber/cucumber";
import assert                from "node:assert/strict";

Given("that this step definition fails", fail);
Given("that this step definition passes", pass);
Given("this step passes in {float} seconds", pass);

When("this step definition fails", fail);
When("this step definition passes", pass);

Then("this step definition should fail", fail);
Then("this step definition should pass", pass);

/**
 * Always throws, causing a scenario failure.
 */
function fail(): void {
    assert.fail("This is an expected failure");
}

/**
 * Always passes.
 */
async function pass(delay: number): Promise<void> {
    // no return or throw is a passing step result
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
}
