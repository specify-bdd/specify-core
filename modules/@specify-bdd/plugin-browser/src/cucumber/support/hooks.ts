/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling browser testing.
 */

import { addAfterScenarioHook, addBeforeScenarioHook } from "@specify-bdd/specify";

addBeforeScenarioHook(
    async function (): Promise<void> {
        // initialize the browser namespace
        this.browser = {
            "sessions": [],
        };
    },
    { "name": "Browser plugin before scenario hook" },
);

addAfterScenarioHook(
    async function (): Promise<void> {
        // terminate any remaining browser sessions
        for (const session of this.browser.sessions) {
            await session.end();
        }

        this.browser.sessions = [];
    },
    { "name": "Browser plugin after scenario hook" },
);
