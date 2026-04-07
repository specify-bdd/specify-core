/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParamType        } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";
import { constants              } from "node:os";

const flexInt      = /-?\d+|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/; // integer or quoted string
const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;

defineParamType({
    "name":   "cliSignal",
    "regexp": quotedString,
    transformer(input: string): string {
        const parsedInput = input.slice(1, -1);

        assert.ok(
            parsedInput in constants.signals,
            new AssertionError({ "message": `Invalid signal: ${input}` }),
        );

        return parsedInput;
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "flexInt",
    "regexp": flexInt,
    transformer(input: string): number {
        if (input.startsWith('"') || input.startsWith("'")) {
            input = input.slice(1, -1);
        }

        const result = parseInt(input, 10);

        assert.ok(
            !isNaN(result),
            new AssertionError({ "message": `Expected a valid integer but received "${input}"` }),
        );
        
        return result;
    },
    "useForSnippets": false,
});
