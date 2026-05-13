/**
 * Browser Navigation Step Definitions Module
 *
 * Cucumber step definitions for navigating the active browser tab to a URL
 * and refreshing the current page.
 */

import assert, { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

export function register(): void {
    defineStep(
        [
            "Given that [I am/the user is] at the URL {url}",
            "When [I go/the user goes] to the URL {url}",
        ],
        navigateToURL,
    );

    defineStep(
        [
            "When [I click/the user clicks] the browser's refresh button",
            "When [I refresh/the user refreshes] the page",
        ],
        refreshPage,
    );
}

/**
 * Navigate the active browser tab to the given URL.
 *
 * @param url - The URL to navigate to
 *
 * @throws AssertionError If there is no active browser session.
 */
async function navigateToURL(url: URL): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.navigateTo(url);
}

/**
 * Reload the current page in the active browser tab.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function refreshPage(): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.refresh();
}
