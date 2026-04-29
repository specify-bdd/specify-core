/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions or those of any Specify plugin.
 */

import { refNotation     } from "@specify-bdd/quick-ref";
import { defineParamType } from "@specify-bdd/specify";
import path                from "node:path";

import type { JsonValue } from "type-fest";

const ordinal      = /[0-9]*(?:1st|2nd|3rd|[4-90]th)/;
const quotedString = /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/;

defineParamType({
    "name":   "filePath",
    "regexp": quotedString,
    transformer(input: string): string {
        // resolve path input relative to the scenario's current working directory, which may differ from process.cwd()
        return path.resolve(this.fs.cwd, this.quickRef.parse(input.slice(1, -1)));
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "ordinal",
    "regexp": ordinal,
    transformer(input: string): number {
        return parseInt(input.slice(0, -2), 10);
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "ref",
    "regexp": refNotation,
    transformer(input: string): JsonValue {
        return this.quickRef.lookupByAddress(input.slice(2, -1));
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "refstr",
    "regexp": quotedString,
    transformer(input: string): string {
        return this.quickRef.parse(input.slice(1, -1));
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "regexp",
    "regexp": /\/(?:[^/\\]|\\.)*\/[dgimsuvy]*/,
    transformer(input: string): RegExp {
        const lastSlash = input.lastIndexOf("/");
        const pattern   = input.slice(1, lastSlash);
        const flags     = input.slice(lastSlash + 1);
        return new RegExp(pattern, flags);
    },
    "useForSnippets": false,
});

defineParamType({
    "name":   "regexpstr",
    "regexp": new RegExp(`${quotedString.source}|${refNotation.source}`),
    transformer(input: string): RegExp {
        const content = input.startsWith("$") ? input : input.slice(1, -1);
        return new RegExp(this.quickRef.parse(content));
    },
    "useForSnippets": false,
});
