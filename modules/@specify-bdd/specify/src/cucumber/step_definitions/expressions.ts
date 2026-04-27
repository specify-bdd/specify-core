/**
 * Expression Testing Step Definitions Module
 *
 * Step definitions that facilitate testing of Specify's enhanced expression
 * syntax, specifically multi-type parameter expansion.
 */

import assert from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

defineStep(
    "When [I store/the user stores] the value {int|string}",
    function (param: number | string): void {
        this.storedValue = param;
    },
);

defineStep("Then the stored value's type should be {string}", function (expected: string): void {
    assert.equal(typeof this.storedValue, expected);
});
