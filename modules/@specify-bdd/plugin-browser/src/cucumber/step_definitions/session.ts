/**
 * Browser Session Step Definitions Module
 *
 * Cucumber step definitions for managing browser sessions under test.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession.js";

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

    defineStep("When [I end/the user ends] the browser session", endBrowserSession);

    defineStep("Then there should be {int} active browser session(s)", verifySessionCount);
}

/**
 * Start a new browser session and make it the active session.
 *
 * Creates a new `WDIOBrowserSession`, starts it with the given browser name,
 * pushes it onto `this.browser.sessions`, and assigns it to
 * `this.browser.activeSession`.
 *
 * @param browser - The name of the browser to launch (e.g. `"chrome"`)
 */
async function startBrowserSession(browser: string): Promise<void> {
    const session = new WDIOBrowserSession();

    await session.start({ browser });

    this.browser.sessions.push(session);
    this.browser.activeSession = session;
}

/**
 * End the active browser session and update session tracking.
 *
 * Ends `this.browser.activeSession`, removes it from `this.browser.sessions`,
 * and sets `activeSession` to the last remaining session, or `null` if none
 * remain.
 *
 * @throws AssertionError
 * If there is no active browser session to end.
 */
async function endBrowserSession(): Promise<void> {
    const session = this.browser.activeSession;

    assert.ok(session, new AssertionError({ "message": "No active browser session." }));

    await session.end();

    const index = this.browser.sessions.indexOf(session);

    this.browser.sessions.splice(index, 1);
    this.browser.activeSession = this.browser.sessions[this.browser.sessions.length - 1] ?? null;
}

/**
 * Assert the number of currently active browser sessions.
 *
 * @param count - The expected number of active sessions
 */
function verifySessionCount(count: number): void {
    assert.equal(this.browser.sessions.length, count);
}
