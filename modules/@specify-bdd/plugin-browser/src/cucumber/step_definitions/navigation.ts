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
            "Given (that )[I am/the user is] at the URL {url}",
            "When [I go/the user goes] to the URL {url}",
        ],
        navigateToURL,
    );

    defineStep("Then the browser URL should be {url}", verifyURL);
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

/**
 * Assert that the active browser tab is at the given URL.
 *
 * @param url - The expected URL
 *
 * @throws AssertionError If there is no active browser session.
 * @throws AssertionError If the current URL does not match the expected URL.
 */
async function verifyURL(url: URL): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const actual = await this.browser.manager.activeSession.getURL();

    assert.equal(actual, url.href);
}
