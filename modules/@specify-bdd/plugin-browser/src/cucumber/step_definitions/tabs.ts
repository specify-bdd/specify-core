/**
 * Browser Tab Step Definitions Module
 *
 * Cucumber step definitions for managing browser tabs within the active session.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

export function register(): void {
    defineStep("When [I open/the user opens] a new browser tab", function () {
        return openTab.call(this);
    });

    defineStep("When [I open/the user opens] a new browser tab named {string}", function (name: string) {
        return openTab.call(this, name);
    });

    defineStep("Then the active session should have {int} browser tab(s)", verifyTabCount);
}

/**
 * Assert the number of tabs open in the active session.
 *
 * @param count - The expected tab count
 *
 * @throws AssertionError If there is no active browser session.
 */
export function verifyTabCount(count: number): void {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    assert.equal(this.browser.activeSession.tabs.length, count);
}

/**
 * Open a new browser tab in the active session.
 *
 * @param name - Optional name to assign to the new tab
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function openTab(name?: string): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.openTab(name);
}
