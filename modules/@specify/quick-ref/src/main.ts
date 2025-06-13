/**
 * Quick Refs Module
 *
 * A utility for referencing test param data quickly and easily.  Stored values
 * are keyed with an arbitrary string and namespaced by data type.  Refs files
 * are expected to conform to JSON format.
 */

import { globbySync } from "globby";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { QuickRef } from "./lib/QuickRef";

import type { JsonObject } from "type-fest";

const cwd = process.cwd();

const modulePaths = globbySync(path.join(cwd, "*.refs.json"), {
    "absolute": true,
    "onlyFiles": true,
});

const modules = await Promise.all(
    modulePaths.map(
        (modulePath) =>
            import(pathToFileURL(modulePath).href, {
                "with": { "type": "json" },
            }),
    ),
);

export default new QuickRef(...modules.map((mod) => mod.default as JsonObject));

export { QuickRef };
