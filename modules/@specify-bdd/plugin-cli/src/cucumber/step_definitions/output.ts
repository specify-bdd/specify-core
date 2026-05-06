/**
 * Output Step Definitions Module
 *
 * Cucumber step definitions covering observation of shell output: asserting
 * what's been printed (or not), and waiting for new output to arrive on
 * STDOUT, STDERR, or any stream.
 */

import { defineStep             } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";

import { IOStream } from "@/lib/SessionManager";

defineStep("When [I wait/the user waits] for terminal output", waitForAnyOutput, {
    "timeout": 60000,
});

defineStep("When [I wait/the user waits] for terminal output on STDERR", waitForOutputOnSTDERR, {
    "timeout": 60000,
});

defineStep("When [I wait/the user waits] for terminal output on STDOUT", waitForOutputOnSTDOUT, {
    "timeout": 60000,
});

defineStep(
    "When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){regexp|regexpstr}",
    waitForMatchingOutputOnSTDERR,
    { "timeout": 60000 },
);

defineStep(
    "When [I wait/the user waits] for terminal output on STDERR including {string}",
    waitForIncludingOutputOnSTDERR,
    { "timeout": 60000 },
);

defineStep(
    "When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){regexp|regexpstr}",
    waitForMatchingOutputOnSTDOUT,
    { "timeout": 60000 },
);

defineStep(
    "When [I wait/the user waits] for terminal output on STDOUT including {string}",
    waitForIncludingOutputOnSTDOUT,
    { "timeout": 60000 },
);

defineStep(
    [
        "When [I wait/the user waits] for terminal output matching (the regular expression ){regexp|regexpstr}",
        "When [I wait/the user waits] for the prompt {regexp|regexpstr}",
    ],
    waitForMatchingOutput,
    { "timeout": 60000 },
);

defineStep(
    [
        "When [I wait/the user waits] for terminal output including {string}",
        "When [I wait/the user waits] for the prompt including {string}",
    ],
    waitForIncludingOutput,
    { "timeout": 60000 },
);

defineStep(
    "Then the last command's terminal output should match (the regular expression ){regexp|regexpstr}",
    verifyMatchingOutput,
);

defineStep("Then the last command's terminal output should be {string}", verifyOutputIs);
defineStep("Then the last command's terminal output should include {string}", verifyIncludesOutput);

defineStep(
    "Then the last command's terminal output should not match (the regular expression ){regexp|regexpstr}",
    verifyNoMatchingOutput,
);

defineStep("Then the last command's terminal output should not be {string}", verifyOutputIsNot);

defineStep(
    "Then the last command's terminal output should not include {string}",
    verifyNoIncludingOutput,
);

defineStep("Then the last command's terminal output should be empty", verifyEmptyOutput);

/**
 * Verify that the CLI output for the last command matches the given regexp.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws Error
 * If no matches for the regexp pattern were found
 */
async function verifyMatchingOutput(pattern: RegExp): Promise<void> {
    await this.waitFor(() => pattern.test(this.cli.manager.output), {
        "error": Error(
            `Command output did not match the specified pattern. Output:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Verify that the CLI output for the last command is exactly the given string.
 *
 * @param expected - The expected output
 *
 * @throws Error
 * If the output does not exactly equal the expected string
 */
async function verifyOutputIs(expected: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.trim() === expected, {
        "error": Error(
            `Expected output to be exactly: ${expected}\nActual:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Verify that the CLI output for the last command contains the given string.
 *
 * @param text - The substring to look for in the output
 *
 * @throws Error
 * If the output does not contain the given string
 */
async function verifyIncludesOutput(text: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.includes(text), {
        "error": Error(
            `Command output did not include the expected string.\nExpected: ${text}\nOutput:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Verify that the CLI output for the last command does NOT match the given
 * regexp.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws Error
 * If the output matches the pattern
 */
async function verifyNoMatchingOutput(pattern: RegExp): Promise<void> {
    await this.waitFor(() => !pattern.test(this.cli.manager.output), {
        "error": Error(
            `Command output matched the specified pattern. Output:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Verify that the CLI output for the last command is NOT exactly the given string.
 *
 * @param expected - The string the output should not equal
 *
 * @throws Error
 * If the output exactly equals the given string
 */
async function verifyOutputIsNot(expected: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.trim() !== expected, {
        "error": Error(`Command output was exactly: ${expected}`),
    });
}

/**
 * Verify that the CLI output for the last command does NOT contain the given string.
 *
 * @param text - The substring that should not appear in the output
 *
 * @throws Error
 * If the output contains the given string
 */
async function verifyNoIncludingOutput(text: string): Promise<void> {
    await this.waitFor(() => !this.cli.manager.output.includes(text), {
        "error": Error(
            `Command output included the unexpected string.\nUnexpected: ${text}\nOutput:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Verify that the CLI output for the last command is empty.
 *
 * @throws AssertionError
 * If the last command produced any output
 */
function verifyEmptyOutput(): void {
    assert.ok(
        !this.cli.manager.output,
        new AssertionError({
            "message": `Expected no command output.  Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Wait for literally any output.
 */
async function waitForAnyOutput(): Promise<void> {
    await waitForOutput.call(this);
}

/**
 * Wait for the last command to send some output.
 *
 * @param stream  - The stream to watch for output
 * @param pattern - The pattern to match output against
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
async function waitForOutput(stream?: IOStream, pattern?: RegExp): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    await this.cli.manager.waitForOutput({ pattern, stream });

    this.fs.cwd = this.cli.manager.cwd;
}

/**
 * Wait for output on the STDERR stream.
 */
async function waitForOutputOnSTDERR(): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR);
}

/**
 * Wait for output on the STDOUTstream.
 */
async function waitForOutputOnSTDOUT(): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT);
}

/**
 * Wait for output matching a specific phrase.
 *
 * @param pattern - The pattern to match output against
 */
export async function waitForMatchingOutput(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.ANY, pattern);
}

/**
 * Wait for output containing a specific literal string.
 *
 * @param text - The literal string to wait for in the output
 */
export async function waitForIncludingOutput(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.ANY, new RegExp(escapeRegExp(text)));
}

/**
 * Wait for output matching a specific phrase on the STDERR stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForMatchingOutputOnSTDERR(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR, pattern);
}

/**
 * Wait for output containing a specific literal string on the STDERR stream.
 *
 * @param text - The literal string to wait for in the output
 */
async function waitForIncludingOutputOnSTDERR(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR, new RegExp(escapeRegExp(text)));
}

/**
 * Wait for output matching a specific phrase on the STDOUT stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForMatchingOutputOnSTDOUT(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT, pattern);
}

/**
 * Wait for output containing a specific literal string on the STDOUT stream.
 *
 * @param text - The literal string to wait for in the output
 */
async function waitForIncludingOutputOnSTDOUT(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT, new RegExp(escapeRegExp(text)));
}

/**
 * Escape all special regexp characters in a string so it can be used as a
 * literal match pattern inside a RegExp.
 *
 * @param text - The string to escape
 */
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
