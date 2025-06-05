/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import { FileParam } from "~/types/params";
import { defineParameterType } from "@cucumber/cucumber";

import * as path from "node:path";

defineParameterType({
    "name": "ref:consoleOutput",
    "regexp": /[^"\\]+/,
    transformer(name: string): RegExp {
        return new RegExp(this.quickRef.lookup("consoleOutput", name));
    },
});

defineParameterType({
    "name": "ref:file",
    "regexp": /[^"]*/,
    transformer(name: string): FileParam {
        return this.quickRef.lookup("file", name) as FileParam;
    },
});

defineParameterType({
    "name": "ref:statusCode",
    "regexp": /[^"\\]+/,
    transformer(name: string): number {
        return this.quickRef.lookup("statusCode", name);
    },
});

defineParameterType({
    "name": "path",
    "regexp": /[^"]*/,
    transformer(name: string): string {
        return path.resolve(name);
    },
});
