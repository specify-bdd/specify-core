/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling core testing.
 */

import { globby        } from "globby";
import path              from "node:path";
import { pathToFileURL } from "node:url";
import { error         } from "node:console";

import { config          } from "@/config/all";
import { CucumberManager } from "@/lib/CucumberManager";

import {
    addAfterScenarioHook,
    addBeforeAllHook,
    addBeforeScenarioHook,
} from "@/index";

import type { JsonObject } from "type-fest";

const cwd = process.cwd(),
    pickleJar = {}; // keep a store of pickles in the module scope so we can track test case attempts

let refsModules = [];

addBeforeAllHook(async function () {
    const modulePaths = await globby(path.join(cwd, "*.refs.json"), {
        "absolute":  true,
        "onlyFiles": true,
    });

    refsModules = await Promise.all(
        modulePaths.map((modulePath) =>
            import(pathToFileURL(modulePath).href, {
                "with": { "type": "json" },
            }).then((mod) => ({ "ref": mod.default }) as JsonObject),
        ),
    );

    // warn if CucumberManager registered any duplicate step patterns
    // but only do it once per run (even if running multiple parallel workers)
    if (!process.env.CUCUMBER_WORKER_ID || process.env.CUCUMBER_WORKER_ID === "0") {
        Object.entries(CucumberManager.getInstance().patterns)
            .filter((entry) => entry[1] > 1)
            .forEach((entry) =>
                error("WARNING: pattern '%s' was registered %d times.", entry[0], entry[1]),
            );
    }
}, { "name": "Core before all hook" });

addBeforeScenarioHook(async function (data) {
    this.quickRef.add(...refsModules, { config });

    // attaching this pickle (test case) to the scenario World allows us to reference its data later
    // we'll use the existing pickle data if it exists in the store, but if not, we'll initialize a new entry
    this.pickle = pickleJar[data.pickle.id] ?? { ...data.pickle, "attempts": {} };

    // add the pickle to the store, if necessary
    pickleJar[this.pickle.id] ??= this.pickle;

    // initialize an empty attempt object with a unique ID
    this.pickle.attempts[data.testCaseStartedId] = {};

    // initialize the file system namespace
    this.fs = {
        "cwd": process.cwd(),
    };
}, { "name": "Core before scenario hook" });

addAfterScenarioHook(async function (data) {
    // update the attempt data with results
    this.pickle.attempts[data.testCaseStartedId] = data.result;
}, { "name": "Core after scenario hook" });
