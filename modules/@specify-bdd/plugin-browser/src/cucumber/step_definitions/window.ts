/**
 * Browser Window Step Definitions Module
 *
 * Cucumber step definitions for reading and setting browser window dimensions.
 */

import assert             from "node:assert/strict";
import { AssertionError } from "node:assert/strict";

import { defineStep } from "@specify-bdd/specify";

export function register(): void {
    defineStep(
        [
            "Given (that )the browser is {int} px tall",
            "When [I resize/the user resizes] the browser to {int} px tall",
        ],
        setWindowHeight,
    );

    defineStep(
        [
            "Given (that )the browser is {int} px wide",
            "When [I resize/the user resizes] the browser to {int} px wide",
        ],
        setWindowWidth,
    );

    defineStep(
        [
            "Given (that )the browser is {int} px wide by {int} px tall",
            "When [I resize/the user resizes] the browser to {int} px wide by {int} px tall",
        ],
        setWindowDimensions,
    );

    defineStep("Then the browser should be {int} px tall", verifyWindowHeight);

    defineStep("Then the browser should be {int} px wide", verifyWindowWidth);

    defineStep("Then the browser should be {int} px wide by {int} px tall", verifyWindowDimensions);
}

/**
 * Set the browser window height, preserving the current width.
 *
 * @param height - The desired height in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function setWindowHeight(height: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { width } = await this.browser.activeSession.getWindowSize();

    await this.browser.activeSession.setWindowSize(width, height);
}

/**
 * Set the browser window width, preserving the current height.
 *
 * @param width - The desired width in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function setWindowWidth(width: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { height } = await this.browser.activeSession.getWindowSize();

    await this.browser.activeSession.setWindowSize(width, height);
}

/**
 * Set the browser window width and height.
 *
 * @param width  - The desired width in pixels
 * @param height - The desired height in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function setWindowDimensions(width: number, height: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    await this.browser.activeSession.setWindowSize(width, height);
}

/**
 * Assert the browser window height.
 *
 * @param expected - The expected height in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function verifyWindowHeight(expected: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { height } = await this.browser.activeSession.getWindowSize();

    assert.equal(height, expected);
}

/**
 * Assert the browser window width.
 *
 * @param expected - The expected width in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function verifyWindowWidth(expected: number): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { width } = await this.browser.activeSession.getWindowSize();

    assert.equal(width, expected);
}

/**
 * Assert both the browser window width and height.
 *
 * @param expectedWidth  - The expected width in pixels
 * @param expectedHeight - The expected height in pixels
 *
 * @throws AssertionError If there is no active browser session.
 */
async function verifyWindowDimensions(
    expectedWidth: number,
    expectedHeight: number,
): Promise<void> {
    assert.ok(
        this.browser.activeSession,
        new AssertionError({ "message": "No active browser session." }),
    );

    const { width, height } = await this.browser.activeSession.getWindowSize();

    assert.equal(width, expectedWidth);
    assert.equal(height, expectedHeight);
}
