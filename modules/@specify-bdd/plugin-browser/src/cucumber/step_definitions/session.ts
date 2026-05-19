/**
 * Browser Session Step Definitions Module
 *
 * Cucumber step definitions for managing browser sessions under test.
 */

import assert from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession";

export function register(): void {
    defineStep(
        [
            "Given a/another {browserName} browser( session)",
            "When [I open/the user opens] a/another {browserName} browser( session)",
            "When [I start/the user starts] a/another {browserName} browser( session)",
        ],
        startBrowserSession,
        { "timeout": 30000 },
    );

    defineStep(
        [
            "When [I end/the user ends] the (active )browser( session)",
            "When [I close/the user closes] the (active )browser( session)",
        ],
        endBrowserSession,
    );

    defineStep("Then there should be {int} (open )browser session(s)", verifySessionCount);
}

/**
 * Start a new browser session and make it the active session.
 *
 * Creates a new `WDIOBrowserSession`, starts it with the given browser name,
 * and registers it with the session manager.
 *
 * @param browser - The name of the browser to launch (e.g. `"chrome"`)
 */
export async function startBrowserSession(browser: string): Promise<void> {
    const session = new WDIOBrowserSession();

    await session.start({ browser });

    this.browser.manager.addSession(session);
}

/**
 * End the active browser session and update session tracking.
 *
 * Ends the active session and removes it from the session manager. The manager
 * updates `activeSession` to the preceding session (`index - 1`), wrapping to
 * the last session when the closed session was at index 0, or `null` if no
 * sessions remain.
 *
 * @throws AssertionError
 * If there is no active browser session to end.
 */
export async function endBrowserSession(): Promise<void> {
    await this.browser.manager.activeSession?.end();

    this.browser.manager.removeSession();
}

/**
 * Assert the number of currently open browser sessions.
 *
 * @param count - The expected number of open sessions
 */
export function verifySessionCount(count: number): void {
    assert.equal(this.browser.manager.sessions.length, count);
}
