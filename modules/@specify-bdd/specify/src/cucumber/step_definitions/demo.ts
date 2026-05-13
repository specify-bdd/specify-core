/**
 * Demo Step Definitions Module
 *
 * Cucumber step definitions that demonstrate basic Specify functionality.
 */

import { defineStep } from "@specify-bdd/specify";
import assert         from "node:assert/strict";

export function register(): void {
    defineStep(
        [
            "Given (that )this step has passed",
            "When this step passes",
            "Then this step should pass",
        ],
        pass,
    );

    defineStep(
        ["Given (that )this step has failed", "When this step fails", "Then this step should fail"],
        fail,
    );
}

/**
 * Fail the scenario
 *
 * Throws an assertion error unconditionally, causing the current scenario to fail.
 */
export function fail(): void {
    assert.fail("This is an expected failure");
}

/**
 * Pass the step
 *
 * Returns without throwing, making the current step pass.
 */
export function pass(): void {
    // no return or throw is a passing step result
}
