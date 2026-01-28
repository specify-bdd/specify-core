/**
 * Demo Step Definitions Module
 *
 * Cucumber step definitions that demonstrate basic Specify functionality.
 */

import assert from "node:assert/strict";

import { defineStep } from "@/index";

defineStep(
    ["Given that this step passes", "When this step passes", "Then this step should pass"],
    pass,
);

defineStep(
    ["Given that this step fails", "When this step fails", "Then this step should fail"],
    fail,
);

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
