/**
 * Testing Step Definitions Module
 *
 * Cucumber step definitions that facilitate Specify testing itself.
 */
import { Given } from "@cucumber/cucumber";
import assert from "node:assert/strict";

Given("that this step definition fails", fail);
Given("that this step definition passes", pass);

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
    // no return or throw is a passing scenario result
}
