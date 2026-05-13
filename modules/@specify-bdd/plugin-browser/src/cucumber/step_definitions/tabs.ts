/**
 * Browser Tab Step Definitions Module
 *
 * Cucumber step definitions for managing browser tabs within the active session.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import type { BrowserSession } from "@/lib/BrowserSession.js";

interface WorldWithBrowser {
    browser: {
        sessions: BrowserSession[];
        activeSession: BrowserSession | null;
    };
}

export function register(): void {
    defineStep("When [I open/the user opens] a new browser tab", openUnnamedTab);

    defineStep("When [I open/the user opens] a new browser tab named {string}", openNamedTab);

    defineStep("Then the active session should have {int} browser tab(s)", verifyTabCount);

    defineStep("When [I close/the user closes] the (active )browser tab", closeActiveTab);

    defineStep("When [I close/the user closes] the {ordinal} browser tab", closeTabByIndex);

    defineStep("When [I close/the user closes] the last browser tab", closeLastTab);

    defineStep("When [I close/the user closes] the browser tab named {string}", closeTabByName);

    defineStep(
        [
            "When [I switch/the user switches] browser tabs",
            "When [I switch/the user switches] to the next browser tab",
        ],
        switchToNextTab,
    );

    defineStep(
        "When [I switch/the user switches] to the previous browser tab",
        switchToPreviousTab,
    );

    defineStep(
        "When [I switch/the user switches] to the {ordinal} browser tab",
        switchToTabByIndex,
    );

    defineStep("When [I switch/the user switches] to the last browser tab", switchToLastTab);

    defineStep(
        "When [I switch/the user switches] to the browser tab named {string}",
        switchToTabByName,
    );
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
function cleanupSessionIfEmpty(world: WorldWithBrowser, session: BrowserSession): void {
    if (session.tabs.length === 0) {
        const idx = world.browser.sessions.indexOf(session);

        world.browser.sessions.splice(idx, 1);
        world.browser.activeSession =
            world.browser.sessions[world.browser.sessions.length - 1] ?? null;
    }
}

/**
 * Close the active browser tab.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function closeActiveTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.closeTab();
    cleanupSessionIfEmpty(this, session);
}

/**
 * Close a browser tab by ordinal position (1-based).
 *
 * @param index - The 1-based position of the tab to close
 *
 * @throws AssertionError If there is no active browser session.
 */
async function closeTabByIndex(index: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.closeTab(index);
    cleanupSessionIfEmpty(this, session);
}

/**
 * Close the last browser tab in the active session.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function closeLastTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.closeTab(session.tabs.length);
    cleanupSessionIfEmpty(this, session);
}

/**
 * Close the browser tab with the given name.
 *
 * @param name - The name of the tab to close
 *
 * @throws AssertionError If there is no active browser session.
 */
async function closeTabByName(name: string): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.closeTab(name);
    cleanupSessionIfEmpty(this, session);
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

// ─── Switch-tab handlers ──────────────────────────────────────────────────────

/**
 * Switch to the next browser tab, wrapping around to the first if on the last.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function switchToNextTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.switchToNextTab();
}

/**
 * Switch to the previous browser tab, wrapping around to the last if on the first.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function switchToPreviousTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.switchToPreviousTab();
}

/**
 * Switch to a browser tab by 1-based ordinal position.
 *
 * @param index - The 1-based position of the tab to switch to
 *
 * @throws AssertionError If there is no active browser session.
 */
async function switchToTabByIndex(index: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.switchToTab(index);
}

/**
 * Switch to the last browser tab in the active session.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function switchToLastTab(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const session = this.browser.activeSession;

    await session.switchToTab(session.tabs.length);
}

/**
 * Switch to the browser tab with the given name.
 *
 * @param name - The name of the tab to switch to
 *
 * @throws AssertionError If there is no active browser session.
 */
async function switchToTabByName(name: string): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.switchToTab(name);
}
