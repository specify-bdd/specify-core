/**
 * Browser Session Step Definitions Module
 *
 * Cucumber step definitions for managing browser sessions under test.
 */

import assert, { AssertionError } from "node:assert/strict";

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

    defineStep("When [I end/the user ends] the (active )browser( session)", endBrowserSession);
    defineStep("When [I close/the user closes] the (active )browser( session)", endBrowserSession);

    defineStep("Then there should be {int} open browser session(s)", verifySessionCount);
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
export async function startBrowserSession(browser: string): Promise<void> {
    const session = new WDIOBrowserSession();

    await session.start({ browser });

    this.browser.sessions.push(session);
    this.browser.activeSession = session;
}

/**
 * End the active browser session and update session tracking.
 *
 * Ends `this.browser.activeSession`, removes it from `this.browser.sessions`,
 * and sets `activeSession` to the preceding session (`index - 1`), wrapping
 * to the last session when the closed session was at index 0, or `null` if
 * no sessions remain.
 *
 * @throws AssertionError
 * If there is no active browser session to end.
 */
export async function endBrowserSession(): Promise<void> {
    const session = this.browser.activeSession;

    assert.ok(session, new AssertionError({ "message": "No active browser session." }));

    await session.end();

    const index = this.browser.sessions.indexOf(session);

    this.browser.sessions.splice(index, 1);

    const prevIndex = index === 0 ? this.browser.sessions.length - 1 : index - 1;

    this.browser.activeSession = prevIndex < 0 ? null : (this.browser.sessions[prevIndex] ?? null);
}

/**
 * Assert the number of currently open browser sessions.
 *
 * @param count - The expected number of open sessions
 */
export function verifySessionCount(count: number): void {
    assert.equal(this.browser.sessions.length, count);
}
