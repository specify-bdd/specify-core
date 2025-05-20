/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import { FileParam } from "@/types/params";
import { defineParameterType } from "@cucumber/cucumber";
import { lookup } from "specify-quick-ref";

import * as path from "node:path";

defineParameterType({
    "name": "ref:file",
    "regexp": /[^"]*/,
    transformer(name: string): FileParam {
        return lookup(name, "file");
    },
});

defineParameterType({
    "name": "path",
    "regexp": /[^"]*/,
    transformer(name: string): string {
        return path.resolve(name);
    },
});
