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
    defineStep("When [I press/the user presses] the {string} key", sendKeyPressToCLI);

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
 * Respond to string prompt
 *
 * Waits for the terminal output to include the given literal string, then
 * sends the specified line as input.
 *
 * @param prompt - The string to wait for in the prompt
 * @param line   - The string to enter in response
 */
export async function respondToIncludingPromptByEnteringLine(
    prompt: string,
    line: string,
): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForIncludingOutput.call(this, prompt);

    sendLineToCLI.call(this, line);
}

/**
 * Respond to pattern prompt
 *
 * Waits for the terminal output to match the given pattern, then sends the
 * specified line as input.
 *
 * @param prompt - The pattern to match the prompt against before responding
 * @param line   - The line to enter in response to the prompt
 */
export async function respondToMatchingPromptByEnteringLine(
    prompt: RegExp,
    line: string,
): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

    sendLineToCLI.call(this, line);
}

/**
 * Press key at matching prompt
 *
 * Waits for the terminal output to match the given pattern, then sends the
 * specified key press.
 *
 * @param prompt - The pattern to match the prompt against before responding
 * @param key    - The key to send in response to the prompt
 */
export async function respondToMatchingPromptByPressingKey(
    prompt: RegExp,
    key: string,
): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

    sendKeyPressToCLI.call(this, key);
}

/**
 * Press key at string prompt
 *
 * Waits for the terminal output to include the given literal string, then
 * sends the specified key press.
 *
 * @param prompt - The literal string to wait for in the prompt before responding
 * @param key    - The key to send in response to the prompt
 */
export async function respondToIncludingPromptByPressingKey(
    prompt: string,
    key: string,
): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForIncludingOutput.call(this, prompt);

    sendKeyPressToCLI.call(this, key);
}

/**
 * Send key press
 *
 * Sends a single key press to the active shell. Supports single-character
 * keys and the named special keys `enter`, `tab`, and `space`.
 *
 * @param key - The character or name of the key to send to the CLI
 *
 * @throws AssertionError
 * If the key is not a single character or a recognized special key name.
 */
export function sendKeyPressToCLI(key: string): void {
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
 * Send input line
 *
 * Sends the given string to the active shell one character at a time,
 * followed by a newline to execute it.
 *
 * @param line - The line of input to enter
 */
export function sendLineToCLI(line: string): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    line.split("").forEach((char) => sendKeyPressToCLI.call(this, char));

    sendKeyPressToCLI.call(this, "\n");
}
