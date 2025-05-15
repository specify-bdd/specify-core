import { FileParam } from "@/types/params";
import { defineParameterType } from "@cucumber/cucumber";
import { lookup } from "quick-ref";

import * as path from "node:path";

defineParameterType({
    "name": "ref:file",
    "regexp": /[^"]*/,
    transformer(name: string): FileParam {
        return lookup("file", name);
    },
});

defineParameterType({
    "name": "path",
    "regexp": /[^"]*/,
    transformer(name: string): string {
        return path.resolve(name);
    },
});
