/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import { defineParameterType } from "@cucumber/cucumber";
import * as path               from "node:path";

import type { FileParam } from "~/types/params";

defineParameterType({
    "name": "path",
    "regexp": /[^"]*/,
    transformer(input: string): string {
        return path.resolve(input);
    },
    "useForSnippets": false,
});

defineParameterType({
    "name": "ref:consoleOutput",
    "regexp": /[^"\\]+/,
    transformer(input: string): RegExp {
        return new RegExp(this.quickRef.lookup("consoleOutput", input));
    },
    "useForSnippets": false,
});

defineParameterType({
    "name": "ref:file",
    "regexp": /[^"]*/,
    transformer(input: string): FileParam {
        return this.quickRef.lookup("file", input) as FileParam;
    },
    "useForSnippets": false,
});

defineParameterType({
    "name": "ref:statusCode",
    "regexp": /[^"\\]+/,
    transformer(input: string): number {
        return parseInt(this.quickRef.lookup("statusCode", input), 10);
    },
    "useForSnippets": false,
});
