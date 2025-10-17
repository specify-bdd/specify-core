/**
 * Testing Step Definitions Module
 *
 * Cucumber step definitions that facilitate Specify testing itself.
 */
import { Given, When, Then } from "@cucumber/cucumber";
import assert                from "node:assert/strict";

Given("that this step passes after {float} seconds", passAfterDelay);
Given("that this step passes on the {ordinal} attempt", passOnNthAttempt);

When("this step passes if there are/is {int} parallel worker(s)", passIfNWorkers);
When("this step passes on the {ordinal} attempt", passOnNthAttempt);
When("a/the user waits for {float} second(s)", { "timeout": 60000 }, waitForTime);

Then("this step should pass on the {ordinal} attempt", passOnNthAttempt);

/**
 * Always passes after delay.
 *
 * @param delay - The number of seconds to wait before passing
 */
async function passAfterDelay(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}

/**
 * Only passes if the expected number of parallel workers are currently active.
 *
 * @remarks
 * The env var CUCUMBER_TOTAL_WORKERS is set within the worker child processes
 * Cucumber spins up when operating in parallel mode.  When operating in the
 * default serial mode, this env var is not set.  Therefore, this step def
 * treats the absence of this env var as equivalent to 1 worker.
 *
 * @param workers - The expected number of parallel workers
 */
async function passIfNWorkers(workers: number): Promise<void> {
    assert.equal(
        parseInt(process.env.CUCUMBER_TOTAL_WORKERS, 10) || 1,
        workers,
        "Number of parallel workers did not match expectations.",
    );
}

/**
 * Only passes on the Nth attempt for any given test case.  Multiple attempts
 * are managed via the "retry" feature.
 *
 * @param attempt - The attempt number to pass
 */
async function passOnNthAttempt(attempt: number): Promise<void> {
    assert.equal(
        Object.keys(this.pickle.attempts).length,
        attempt,
        "This is not the correct attempt.",
    );
}

/**
 * Wait for the specified number of seconds.
 *
 * @param seconds - The number of seconds to wait
 */
async function waitForTime(seconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
