/**
 * Browser Tab Step Definitions Module
 *
 * Cucumber step definitions for managing browser tabs within the active session.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import type { BrowserSession } from "@/lib/BrowserSession";

interface WorldWithBrowser {
    browser: {
        sessions:      BrowserSession[];
        activeSession: BrowserSession | null;
    };
}

export function register(): void {
    defineStep("When [I open/the user opens] a new browser tab", openUnnamedTab);

    defineStep("When [I open/the user opens] a new browser tab named {string}", openNamedTab);

    defineStep("Then the active session should have {int} browser tab(s)", verifyTabCount);

    defineStep("When [I close/the user closes] the (active )browser tab", function () {
        return closeTab.call(this);
    });

    defineStep("When [I close/the user closes] the {ordinal} browser tab", function (index: number) {
        return closeTab.call(this, index);
    });

    defineStep("When [I close/the user closes] the last browser tab", function () {
        return closeTab.call(this, this.browser.activeSession?.tabs.length);
    });

    defineStep("When [I close/the user closes] the browser tab named {string}", function (name: string) {
        return closeTab.call(this, name);
    });
}

/**
 * Assert the number of tabs open in the active session.
 *
 * @param count - The expected tab count
 *
 * @throws AssertionError If there is no active browser session.
 */
function verifyTabCount(count: number): void {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    assert.equal(this.browser.activeSession.tabs.length, count);
}

// ─── Close-tab helpers ────────────────────────────────────────────────────────

/**
 * After closing a tab, check whether the session lost all its tabs. If so,
 * remove it from the world's session list and update `activeSession`.
 */
function cleanupSessionIfEmpty(this: WorldWithBrowser, session: BrowserSession): void {
    if (session.tabs.length === 0) {
        const idx = this.browser.sessions.indexOf(session);

        this.browser.sessions.splice(idx, 1);
        this.browser.activeSession =
            this.browser.sessions[this.browser.sessions.length - 1] ?? null;
    }
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
async function closeTab(this: WorldWithBrowser, selector?: number | string): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.closeTab(selector);
    cleanupSessionIfEmpty.call(this, session);
}

// ─── Open-tab handlers ────────────────────────────────────────────────────────

/**
 * Open a new unnamed browser tab in the active session.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function openUnnamedTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.openTab();
}

/**
 * Open a new named browser tab in the active session.
 *
 * @param name - The name to assign to the new tab
 *
 * @throws AssertionError If there is no active browser session.
 */
async function openNamedTab(name: string): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.openTab(name);
}
