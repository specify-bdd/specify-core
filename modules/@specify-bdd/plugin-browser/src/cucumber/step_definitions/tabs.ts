/**
 * Browser Tab Step Definitions Module
 *
 * Cucumber step definitions for managing browser tabs within the active session.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import type { SessionManager } from "@/lib/SessionManager";

interface WorldWithBrowser {
    browser: {
        manager: SessionManager;
    };
}

export function register(): void {
    defineStep("When [I open/the user opens] a new browser tab", function () {
        return openTab.call(this);
    });

    defineStep(
        "When [I open/the user opens] a new browser tab named {string}",
        function (name: string) {
            return openTab.call(this, name);
        },
    );

    defineStep("Then the active session should have {int} browser tab(s)", verifyTabCount);

    defineStep("When [I close/the user closes] the (active )browser tab", function () {
        return closeTab.call(this);
    });

    defineStep(
        "When [I close/the user closes] the {ordinal} browser tab",
        function (index: number) {
            return closeTab.call(this, index);
        },
    );

    defineStep("When [I close/the user closes] the last browser tab", function () {
        return closeTab.call(this, this.browser.manager.activeSession?.tabs.length);
    });

    defineStep(
        "When [I close/the user closes] the browser tab named {string}",
        function (name: string) {
            return closeTab.call(this, name);
        },
    );
}

/**
 * Assert the number of tabs open in the active session.
 *
 * @param count - The expected tab count
 *
 * @throws AssertionError If there is no active browser session.
 */
export function verifyTabCount(this: WorldWithBrowser, count: number): void {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    assert.equal(this.browser.manager.activeSession.tabs.length, count);
}

/**
 * Close a browser tab.
 *
 * When `selector` is omitted, the active tab is closed. Accepts a 1-based
 * ordinal index or a tab name.
 *
 * @param selector - A 1-based tab index or tab name; omit to close the active tab
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function closeTab(this: WorldWithBrowser, selector?: number | string): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.manager.activeSession;

    await session.closeTab(selector);
    this.browser.manager.removeSessionIfEmpty(session);
}

/**
 * Open a new browser tab in the active session.
 *
 * @param name - Optional name to assign to the new tab
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function openTab(this: WorldWithBrowser, name?: string): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.openTab(name);
}
