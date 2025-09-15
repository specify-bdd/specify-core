/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling core testing.
 */

import { After, Before, BeforeAll } from "@cucumber/cucumber";
import { globby                   } from "globby";
import path                         from "node:path";
import { pathToFileURL            } from "node:url";

import { config } from "@/config/all";

import type { JsonObject } from "type-fest";

const cwd = process.cwd(),
    pickleJar = {}; // keep a store of pickles in the module scope so we can track test case attempts

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
            }).then((mod) => ({ "ref": mod.default }) as JsonObject),
        ),
    );
});

Before({ "name": "Core before hook" }, async function (data) {
    this.quickRef.add(...refsMods, { config });

    // attaching this pickle (test case) to the scenario World allows us to reference its data later
    // we'll use the existing pickle data if it exists in the store, but if not, we'll initialize a new entry
    this.pickle = pickleJar[data.pickle.id] ?? { ...data.pickle, "attempts": {} };

    // add the pickle to the store, if necessary
    pickleJar[this.pickle.id] ??= this.pickle;

    // initialize an empty attempt object with a unique ID
    this.pickle.attempts[data.testCaseStartedId] = {};
});

After({ "name": "Core after hook" }, async function (data) {
    // update the attempt data with results
    this.pickle.attempts[data.testCaseStartedId] = data.result;
});
