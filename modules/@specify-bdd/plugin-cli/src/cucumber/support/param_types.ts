/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParamType        } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";
import { constants              } from "node:os";

// matches "1", "-2", '3', but not '4". Auto-strips quotes
const quotedInt = /'(-?\d+)'|"(-?\d+)"/;

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
    "name":   "intstr",
    "regexp": quotedInt,
    transformer(single: string, double: string): number {
        return parseInt(single ?? double, 10);
    },
    "useForSnippets": false,
});
