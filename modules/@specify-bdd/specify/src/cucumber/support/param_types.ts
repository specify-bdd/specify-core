/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { defineParameterType } from "@cucumber/cucumber";
import path                    from "node:path";

import type { FileParam } from "~/types/params";

const ordinal      = /[0-9]*(?:1st|2nd|3rd|[4-90]th)/;
const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;
const refName      = /\$\w+/;

defineParameterType({
    "name":   "filePath",
    "regexp": quotedString,
    transformer(input: string): string {
        return path.resolve(input.slice(1, -1));
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
    "name":   "ref:filePath",
    "regexp": refName,
    transformer(input: string): string {
        return this.quickRef.lookup("filePath", input.slice(1)) as string;
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "regexp",
    "regexp": quotedString,
    transformer(input: string): RegExp {
        return RegExp(input.slice(1, -1));
    },
    "useForSnippets": false,
});
