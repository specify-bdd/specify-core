/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParamType        } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";
import { constants              } from "node:os";

const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;                                                                                                              
const flexInt      = new RegExp(`-?\\d+|${quotedString.source}`); 

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
        
        const num = Number(input);

        assert.ok(
            Number.isInteger(num),
            new AssertionError({ "message": `Expected a valid integer but received "${input}"` }),
        );

        return num;
    },
    "useForSnippets": false,
});
