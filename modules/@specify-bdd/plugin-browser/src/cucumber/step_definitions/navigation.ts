/**
 * Browser Navigation Step Definitions Module
 *
 * Cucumber step definitions for navigating the active browser tab to a URL.
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
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.navigateTo(url);
}
