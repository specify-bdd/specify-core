/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineParamType } from "@specify-bdd/specify";

export function register(): void {
    defineParamType({
        "name":   "browserName",
        "regexp": /\w+/,
        transformer(input: string): string {
            const browserName = input.toLowerCase();

            assert.ok(
                this.config.browsers.includes(browserName),
                new AssertionError({ "message": `Unrecognized browser name: "${input}".` }),
            );

            return browserName;
        },
        "useForSnippets": false,
    });
}
