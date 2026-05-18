/**
 * Hooks Module
 *
 * Custom Cucumber hooks enabling browser testing.
 */

import { addAfterScenarioHook, addBeforeScenarioHook } from "@specify-bdd/specify";

import { SessionManager } from "@/lib/SessionManager";

export function register(): void {
    addBeforeScenarioHook(
        async function (): Promise<void> {
            this.browser = {
                "manager": new SessionManager(),
            };
        },
        { "name": "Browser plugin before scenario hook" },
    );

    addAfterScenarioHook(
        async function (): Promise<void> {
            await this.browser.manager.killAllSessions();
        },
        { "name": "Browser plugin after scenario hook" },
    );
}
