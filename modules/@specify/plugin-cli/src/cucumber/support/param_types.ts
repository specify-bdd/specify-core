/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import { defineParameterType } from "@cucumber/cucumber";
import path                    from "node:path";

import type { FileParam } from "~/types/params";

defineParameterType({
    "name":   "path",
    "regexp": /"[^"]+"/,
    transformer(input: string): string {
        return path.resolve(stripQuotes(input));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "ref:consoleOutput",
    "regexp": /"[^"\\]+"/,
    transformer(input: string): RegExp {
        return new RegExp(this.quickRef.lookup("consoleOutput", stripQuotes(input)));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "ref:file",
    "regexp": /"[^"]+"/,
    transformer(input: string): FileParam {
        return this.quickRef.lookup("file", stripQuotes(input)) as FileParam;
    },
    "useForSnippets": false,
});

defineParameterType({
    "name":   "ref:exitCode",
    "regexp": /"[^"\\]+"/,
    transformer(input: string): number {
        return parseInt(this.quickRef.lookup("exitCode", stripQuotes(input)), 10);
    },
    "useForSnippets": false,
});

/**
 * Strip the first and last characters (assumed to be quotes) from a string.
 *
 * @param input - The input string to strip
 */
function stripQuotes(input) {
    return input.substring(1, input.length - 1);
}
