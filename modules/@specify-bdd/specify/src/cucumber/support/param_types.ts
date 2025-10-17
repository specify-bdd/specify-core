/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParameterType } from "@cucumber/cucumber";
import path                    from "node:path";

import { refNotation } from "@specify-bdd/quick-ref";

import type { JsonValue } from "type-fest";

const ordinal      = /[0-9]*(?:1st|2nd|3rd|[4-90]th)/;
const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;

defineParameterType({
    "name":   "filePath",
    "regexp": quotedString,
    transformer(input: string): string {
        return path.normalize(this.quickRef.parse(input.slice(1, -1)));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "ordinal",
    "regexp": ordinal,
    transformer(input: string): number {
        return parseInt(input.slice(0, -2), 10);
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "ref",
    "regexp": refNotation,
    transformer(input: string): JsonValue {
        return this.quickRef.lookupByAddress(input.slice(2, -1));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "refstr",
    "regexp": quotedString,
    transformer(input: string): string {
        return this.quickRef.parse(input.slice(1, -1));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "regexp",
    "regexp": quotedString,
    transformer(input: string): RegExp {
        return RegExp(this.quickRef.parse(input.slice(1, -1)));
    },
    "useForSnippets": false,
});
