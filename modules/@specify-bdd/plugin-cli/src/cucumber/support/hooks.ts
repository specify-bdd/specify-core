/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling CLI testing.
 */

import { addAfterAllHook, addAfterScenarioHook, addBeforeScenarioHook } from "@specify-bdd/specify";
import * as fs                                                          from "node:fs/promises";

const cliFiles: Array<string> = [];

export function register(): void {
    addBeforeScenarioHook(
        async function (): Promise<void> {
            // initialize the CLI namespace
            this.cli = {
                "files": {
                    "created": cliFiles,
                },
            };
        },
        { "name": "CLI plugin before scenario hook" },
    );

    addAfterScenarioHook(
        async function (): Promise<void> {
            // terminate any remaining shell sessions
            await this.cli.manager?.killAllSessions();
        },
        { "name": "CLI plugin after scenario hook" },
    );

    addAfterAllHook(
        async function (): Promise<void> {
            const promises = [];

            if (this.parameters.cliCleanup) {
                for (const file of cliFiles) {
                    promises.push(fs.unlink(file));
                }
            }

            await Promise.all(promises);
        },
        { "name": "CLI plugin after all hook" },
    );
}
