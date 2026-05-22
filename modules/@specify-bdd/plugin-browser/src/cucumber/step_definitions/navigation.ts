/**
 * Browser Navigation Step Definitions Module
 *
 * Cucumber step definitions for browser navigation.
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

    defineStep(
        [
            "When [I click/the user clicks] the browser's refresh/reload button",
            "When [I refresh/the user refreshes] the page",
            "When [I reload/the user reloads] the page",
        ],
        refreshPage,
    );

    defineStep(
        [
            "When [I click/the user clicks] the browser's back button",
            "When [I navigate/the user navigates] back",
        ],
        navigateBack,
    );

    defineStep(
        [
            "When [I click/the user clicks] the browser's forward button",
            "When [I navigate/the user navigates] forward",
        ],
        navigateForward,
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

/**
 * Reload the current page in the active browser tab.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function refreshPage(): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.refresh();
}

/**
 * Navigate back to the previous page in the browser history.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function navigateBack(): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.back();
}

/**
 * Navigate forward to the next page in the browser history.
 *
 * @throws AssertionError If there is no active browser session.
 */
async function navigateForward(): Promise<void> {
    assert.ok(
        this.browser.manager.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.manager.activeSession.forward();
}
