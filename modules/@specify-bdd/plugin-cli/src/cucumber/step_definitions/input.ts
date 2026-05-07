/**
 * Input Step Definitions Module
 *
 * Cucumber step definitions covering interactive input to a shell session:
 * sending key presses, lines of input, and responses to prompts.
 */

import { defineStep             } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";

import { waitForIncludingOutput, waitForMatchingOutput } from "./output";

export function register(): void {
    defineStep(["When [I press/the user presses] the {string} key"], sendKeyPressToCLI);

    defineStep(
        "When [I respond/the user responds] to the prompt matching {regexp|regexpstr} by pressing the {string} key",
        respondToMatchingPromptByPressingKey,
    );

    defineStep(
        "When [I respond/the user responds] to the prompt including {string} by pressing the {string} key",
        respondToIncludingPromptByPressingKey,
    );

    defineStep(
        ["When [I enter/the user enters] {string}", "When [I input/the user inputs] {string}"],
        sendLineToCLI,
    );

    defineStep(
        "When [I respond/the user responds] to the prompt including {string} by entering/inputting {string}",
        respondToIncludingPromptByEnteringLine,
    );

    defineStep(
        "When [I respond/the user responds] to the prompt matching {regexp|regexpstr} by entering/inputting {string}",
        respondToMatchingPromptByEnteringLine,
    );
}

/**
 * Wait for a matching prompt, then respond by entering the given line.
 *
 * @param prompt - the string to wait for in the prompt
 * @param line   - the string to enter in response
 */
async function respondToIncludingPromptByEnteringLine(prompt: string, line: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForIncludingOutput.call(this, prompt);

    sendLineToCLI.call(this, line);
}

/**
 * Wait for a prompt matching the given regexp, then respond by entering the given line.
 *
 * @param prompt - the pattern to match the prompt against before responding
 * @param line   - the line to enter in response to the prompt
 */
async function respondToMatchingPromptByEnteringLine(prompt: RegExp, line: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

    sendLineToCLI.call(this, line);
}

/**
 * Wait for a prompt matching the given pattern, then respond by sending the given key
 *
 * @param prompt - the pattern to match the prompt against before responding
 * @param key    - the key to send in response to the prompt
 */
async function respondToMatchingPromptByPressingKey(prompt: RegExp, key: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

    sendKeyPressToCLI.call(this, key);
}

/**
 * Wait for a prompt containing the given literal string, then respond by sending the given key.
 *
 * @param prompt - the literal string to wait for in the prompt before responding
 * @param key    - the key to send in response to the prompt
 */
async function respondToIncludingPromptByPressingKey(prompt: string, key: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForIncludingOutput.call(this, prompt);

    sendKeyPressToCLI.call(this, key);
}

/**
 * Send the character value of a key press to the CLI
 *
 * @remarks
 * Special keys like "enter", "tab", and "space" are supported, in addition to
 * regular single-character keys. No other special keys are currently supported.
 *
 * @param key - The character or name of the key to send to the CLI
 *
 * @throws AssertionError
 * If the key is not a single character or a recognized special key name.
 */
function sendKeyPressToCLI(key: string): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    const specialKeyMap = {
        "enter": "\n",
        "tab":   "\t",
        "space": " ",
    };

    let keyToSend: string;

    if (key.length === 1) {
        keyToSend = key;
    } else if (key.toLowerCase() in specialKeyMap) {
        keyToSend = specialKeyMap[key.toLowerCase()];
    } else {
        assert.fail(`Unrecognized key: ${key}`);
    }

    this.cli.manager.sendInput(keyToSend);
}

/**
 * Send a line of input to the CLI, followed by a newline character to execute it.
 *
 * @remarks
 * One character at a time is sent to simulate real user input
 *
 * @param line - the line of input to enter
 */
function sendLineToCLI(line: string): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    line.split("").forEach((char) => sendKeyPressToCLI.call(this, char));

    sendKeyPressToCLI.call(this, "\n");
}
