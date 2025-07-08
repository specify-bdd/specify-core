/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling core testing.
 */

import { Before, BeforeAll } from "@cucumber/cucumber";
import { globby            } from "globby";
import path                  from "node:path";
import { pathToFileURL     } from "node:url";

import type { JsonObject } from "type-fest";

const cwd = process.cwd();

let refsMods = [];

BeforeAll(async function () {
    const modPaths = await globby(path.join(cwd, "*.refs.json"), {
        "absolute":  true,
        "onlyFiles": true,
    });

    refsMods = await Promise.all(
        modPaths.map((modPath) =>
            import(pathToFileURL(modPath).href, {
                "with": { "type": "json" },
            }).then((mod) => mod.default as JsonObject),
        ),
    );
});

Before({ "name": "Core before hook" }, async function () {
    this.quickRef.add(...refsMods);
});
