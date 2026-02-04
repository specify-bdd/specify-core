/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling CLI testing.
 */

import * as fs from "node:fs/promises";

import {
    addAfterAllHook,
    addAfterScenarioHook,
    addBeforeScenarioHook,
} from "@specify-bdd/specify";

const cliFiles: Array<string> = [];

addBeforeScenarioHook(async function () {
    // initialize the CLI namespace
    this.cli = {
        "files": {
            "created": cliFiles,
        },
    };
}, { "name": "CLI plugin before hook" });

addAfterScenarioHook(async function () {
    // terminate any remaining shell sessions
    await this.cli.manager?.killAllSessions();
}, { "name": "CLI plugin after hook" });

addAfterAllHook(async function () {
    const promises = [];

    if (this.parameters.cliCleanup) {
        for (const file of cliFiles) {
            promises.push(fs.unlink(file));
        }
    }

    return Promise.all(promises);
});
