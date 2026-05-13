/**
 * Testing Step Definitions Module
 *
 * Cucumber step definitions that facilitate Specify testing itself.
 */

import { defineStep } from "@specify-bdd/specify";
import assert         from "node:assert/strict";

export function register(): void {
    defineStep("Then there should be (only ){int} parallel worker(s)", passIfNWorkers);

    defineStep(
        [
            "Given (that )this step has passed after {float} seconds",
            "When [I wait/the user waits] for {float} second(s)",
        ],
        waitForTime,
        { "timeout": 60000 },
    );

    defineStep(
        [
            "Given (that )this step has passed on the {ordinal} attempt",
            "When this step passes on the {ordinal} attempt",
            "Then this step should pass on the {ordinal} attempt",
        ],
        passOnNthAttempt,
    );
}

/**
 * Assert parallel worker count
 *
 * Passes only when the number of active Cucumber parallel workers equals the expected value.
 *
 * @remarks
 * The env var CUCUMBER_TOTAL_WORKERS is set within the worker child processes
 * Cucumber spins up when operating in parallel mode.  When operating in the
 * default serial mode, this env var is not set.  Therefore, this step def
 * treats the absence of this env var as equivalent to 1 worker.
 *
 * @param workers - The expected number of parallel workers
 */
export function passIfNWorkers(workers: number): void {
    assert.equal(
        parseInt(process.env.CUCUMBER_TOTAL_WORKERS, 10) || 1,
        workers,
        "Number of parallel workers did not match expectations.",
    );
}

/**
 * Pass on nth attempt
 *
 * Passes only when the current scenario attempt number matches the expected value.
 * Multiple attempts are managed via the retry feature.
 *
 * @param attempt - The attempt number to pass
 */
export function passOnNthAttempt(attempt: number): void {
    assert.equal(
        Object.keys(this.pickle.attempts).length,
        attempt,
        "This is not the correct attempt.",
    );
}

/**
 * Wait for duration
 *
 * Pauses execution for the specified number of seconds.
 *
 * @param seconds - The number of seconds to wait
 */
export async function waitForTime(seconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
