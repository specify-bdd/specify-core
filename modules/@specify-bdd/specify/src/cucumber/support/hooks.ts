/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling core testing.
 */

import { After, Before, BeforeAll } from "@cucumber/cucumber";
import { globby                   } from "globby";
import path                         from "node:path";
import { pathToFileURL            } from "node:url";

import type { JsonObject } from "type-fest";

const cwd   = process.cwd(),
    pickles = {};

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

Before({ "name": "Core before hook" }, async function (data) {
    this.quickRef.add(...refsMods);

    this.pickle  = data.pickle;
    this.pickles = pickles;

    if (!pickles[data.pickle.id]) {
        pickles[data.pickle.id] = { ...data.pickle, "attempts": {} };
    }

    pickles[data.pickle.id].attempts[data.testCaseStartedId] = {};
});

After({ "name": "Core after hook" }, async function (data) {
    pickles[data.pickle.id].attempts[data.testCaseStartedId] = data.result;
});
