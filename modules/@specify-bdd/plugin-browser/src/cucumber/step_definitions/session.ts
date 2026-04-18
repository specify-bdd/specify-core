/**
 * Browser Session Step Definitions Module
 *
 * Cucumber step definitions for managing browser sessions under test.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession";

defineStep(
    [
        "Given a/another {string} browser session",
        "When [I start/the user starts] a/another {string} browser session",
    ],
    startBrowserSession,
    { "timeout": 30000 },
);

defineStep("When [I end/the user ends] the browser session", endBrowserSession);

defineStep("Then there should be {int} active browser session(s)", verifySessionCount);

/**
 * Start a new browser session and register it as active.
 *
 * @param browser - The name of the browser to launch (e.g. `"chrome"`)
 */
async function startBrowserSession(browser: string): Promise<void> {
    const session = new WDIOBrowserSession();

    await session.start({ browser });

    this.browser.sessions.push(session);
}

/**
 * End the most recently started browser session and remove it from the active list.
 *
 * @throws AssertionError
 * If there is no active browser session to end.
 */
async function endBrowserSession(): Promise<void> {
    const session = this.browser.sessions.pop();

    assert.ok(session, new AssertionError({ "message": "No active browser session." }));

    await session.end();
}

/**
 * Assert the number of currently active browser sessions.
 *
 * @param count - The expected number of active sessions
 */
function verifySessionCount(count: number): void {
    assert.equal(this.browser.sessions.length, count);
}
