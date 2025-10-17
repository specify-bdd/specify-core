/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParameterType    } from "@cucumber/cucumber";
import assert, { AssertionError } from "node:assert/strict";
import { constants              } from "node:os";

const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;

defineParameterType({
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
