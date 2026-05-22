/**
 * Browser Tab Step Definitions Module
 *
 * Cucumber step definitions for managing browser tabs within the active session.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

import type { SessionManager } from "@/lib/SessionManager";

interface WorldWithBrowser {
    "browser": {
        "manager": SessionManager;
    };
}

export function register(): void {
    defineStep("When [I open/the user opens] a/another new browser tab", function () {
        return openTab.call(this);
    });

    defineStep(
        "When [I open/the user opens] a/another new browser tab named {string}",
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
            return closeTab.call(this, index - 1);
        },
    );

    defineStep("When [I close/the user closes] the last browser tab", function () {
        const session = this.browser.manager.activeSession;

        return closeTab.call(this, session ? session.tabs.length - 1 : undefined);
    });

    defineStep(
        "When [I close/the user closes] the browser tab named {string}",
        function (name: string) {
            return closeTab.call(this, name);
        },
    );

    defineStep(
        [
            "When [I switch/the user switches] browser tabs",
            "When [I switch/the user switches] to the next browser tab",
        ],
        function () {
            return switchToNextTab.call(this);
        },
    );

    defineStep("When [I switch/the user switches] to the previous browser tab", function () {
        return switchToPreviousTab.call(this);
    });

    defineStep(
        "When [I switch/the user switches] to the {ordinal} browser tab",
        function (index: number) {
            return switchToTab.call(this, index - 1);
        },
    );

    defineStep("When [I switch/the user switches] to the last browser tab", function () {
        assert.ok(
            this.browser.manager.activeSession,
            new AssertionError({ "message": "No active browser session." }),
        );

        return switchToTab.call(this, this.browser.manager.activeSession.tabs.length - 1);
    });

    defineStep(
        "When [I switch/the user switches] to the browser tab named {string}",
        function (name: string) {
            return switchToTab.call(this, name);
        },
    );

    defineStep("Then the {ordinal} browser tab should be active", function (index: number) {
        return verifyActiveTab.call(this, index - 1);
    });

    defineStep("Then the browser tab named {string} should be active", function (name: string) {
        return verifyActiveTab.call(this, name);
    });
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
 * Assert that a specific tab is currently active in the active session.
 *
 * @param selector - A 0-based tab index or tab name
 *
 * @throws AssertionError If there is no active browser session.
 * @throws AssertionError If the active tab does not match the selector.
 */
export function verifyActiveTab(this: WorldWithBrowser, selector: number | string): void {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { activeTab, tabs } = this.browser.manager.activeSession;

    assert.ok(activeTab, new AssertionError({ "message": "No active tab." }));

    if (typeof selector === "number") {
        const expected = tabs[selector];

        assert.ok(expected, new AssertionError({ "message": `No tab at index ${selector}.` }));
        assert.strictEqual(activeTab, expected);
    } else {
        assert.strictEqual(activeTab.name, selector);
    }
}

/**
 * Close a browser tab.
 *
 * When `selector` is omitted, the active tab is closed. Accepts a 0-based
 * index or a tab name.
 *
 * @param selector - A 0-based tab index or tab name; omit to close the active tab
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

/**
 * Switch to the next browser tab, wrapping around to the first if on the last.
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function switchToNextTab(this: WorldWithBrowser): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.switchToNextTab();
}

/**
 * Switch to the previous browser tab, wrapping around to the last if on the first.
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function switchToPreviousTab(this: WorldWithBrowser): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.switchToPreviousTab();
}

/**
 * Switch to a browser tab by 0-based index or by name.
 *
 * @param selector - A 0-based tab index or tab name
 *
 * @throws AssertionError If there is no active browser session.
 */
export async function switchToTab(
    this: WorldWithBrowser,
    selector: number | string,
): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.switchToTab(selector);
}
