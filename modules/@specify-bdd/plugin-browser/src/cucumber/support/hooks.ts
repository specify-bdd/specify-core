/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling browser testing.
 */

import { addAfterScenarioHook, addBeforeScenarioHook } from "@specify-bdd/specify";

export function register(): void {
    addBeforeScenarioHook(
        async function (): Promise<void> {
            // initialize the browser namespace
            this.browser = {
                "sessions":      [],
                "activeSession": null,
            };
        },
        { "name": "Browser plugin before scenario hook" },
    );

    addAfterScenarioHook(
        async function (): Promise<void> {
            // terminate all remaining browser sessions, even if some fail to end
            await Promise.allSettled(this.browser.sessions.map((s) => s.end()));

            this.browser.sessions = [];
            this.browser.activeSession = null;
        },
        { "name": "Browser plugin after scenario hook" },
    );
}
