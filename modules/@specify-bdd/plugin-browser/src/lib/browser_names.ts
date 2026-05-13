/**
 * Browser Names Module
 *
 * Defines the set of recognized browser names and the validator function used
 * by the `{browserName}` Cucumber parameter type.
 */

import assert, { AssertionError } from "node:assert/strict";

export const BROWSER_NAMES = new Set(["chrome", "edge", "firefox", "safari"]);

/**
 * Validate and return a browser name string.
 *
 * Throws an `AssertionError` if `input` is not a recognized browser name.
 *
 * @param input - The raw string from the step text
 */
export function parseBrowserName(input: string): string {
    assert.ok(
        BROWSER_NAMES.has(input),
        new AssertionError({ "message": `Unrecognized browser name: "${input}".` }),
    );

    return input;
}
