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

export function register(): void {
    defineStep("When [I wait/the user waits] for terminal output", waitForAnyOutput, {
        "timeout": 60000,
    });

    defineStep(
        "When [I wait/the user waits] for terminal output on STDERR",
        waitForOutputOnSTDERR,
        {
            "timeout": 60000,
        },
    );

    defineStep(
        "When [I wait/the user waits] for terminal output on STDOUT",
        waitForOutputOnSTDOUT,
        {
            "timeout": 60000,
        },
    );

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
    defineStep(
        "Then the last command's terminal output should include {string}",
        verifyIncludesOutput,
    );

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
}

/**
 * Assert output is empty
 *
 * Verifies that the last command produced no terminal output.
 *
 * @throws AssertionError
 * If the last command produced any output
 */
export function verifyEmptyOutput(): void {
    assert.ok(
        !this.cli.manager.output,
        new AssertionError({
            "message": `Expected no command output.  Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Assert output includes string
 *
 * Verifies that the last command's terminal output contains the given literal string.
 *
 * @param text - The substring to look for in the output
 *
 * @throws Error
 * If the output does not contain the given string
 */
export async function verifyIncludesOutput(text: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.includes(text), {
        "error": Error(
            `Command output did not include the expected string.\nExpected: ${text}\nOutput:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Assert output matches pattern
 *
 * Verifies that the last command's terminal output matches the given regular expression.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws Error
 * If no matches for the regexp pattern were found
 */
export async function verifyMatchingOutput(pattern: RegExp): Promise<void> {
    await this.waitFor(() => pattern.test(this.cli.manager.output), {
        "error": Error(
            `Command output did not match the specified pattern. Output:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Assert output excludes string
 *
 * Verifies that the last command's terminal output does not contain the given
 * literal string.
 *
 * @param text - The substring that should not appear in the output
 *
 * @throws Error
 * If the output contains the given string
 */
export async function verifyNoIncludingOutput(text: string): Promise<void> {
    await this.waitFor(() => !this.cli.manager.output.includes(text), {
        "error": Error(
            `Command output included the unexpected string.\nUnexpected: ${text}\nOutput:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Assert output not matching
 *
 * Verifies that the last command's terminal output does not match the given
 * regular expression.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws Error
 * If the output matches the pattern
 */
export async function verifyNoMatchingOutput(pattern: RegExp): Promise<void> {
    await this.waitFor(() => !pattern.test(this.cli.manager.output), {
        "error": Error(
            `Command output matched the specified pattern. Output:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Assert exact output
 *
 * Verifies that the last command's terminal output is exactly the given string,
 * after trimming whitespace.
 *
 * @param expected - The expected output
 *
 * @throws Error
 * If the output does not exactly equal the expected string
 */
export async function verifyOutputIs(expected: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.trim() === expected, {
        "error": Error(
            `Expected output to be exactly: ${expected}\nActual:\n${this.cli.manager.output}`,
        ),
    });
}

/**
 * Assert output differs
 *
 * Verifies that the last command's terminal output is not exactly the given
 * string, after trimming whitespace.
 *
 * @param expected - The string the output should not equal
 *
 * @throws Error
 * If the output exactly equals the given string
 */
export async function verifyOutputIsNot(expected: string): Promise<void> {
    await this.waitFor(() => this.cli.manager.output.trim() !== expected, {
        "error": Error(`Command output was exactly: ${expected}`),
    });
}

/**
 * Wait for any output
 *
 * Waits until the active shell produces any terminal output.
 */
export async function waitForAnyOutput(): Promise<void> {
    await waitForOutput.call(this);
}

/**
 * Wait for string in output
 *
 * Waits until the active shell's output includes the given literal string.
 *
 * @param text - The literal string to wait for in the output
 */
export async function waitForIncludingOutput(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.ANY, new RegExp(escapeRegExp(text)));
}

/**
 * Wait for string on STDERR
 *
 * Waits until STDERR includes the given literal string.
 *
 * @param text - The literal string to wait for in the output
 */
export async function waitForIncludingOutputOnSTDERR(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR, new RegExp(escapeRegExp(text)));
}

/**
 * Wait for string on STDOUT
 *
 * Waits until STDOUT includes the given literal string.
 *
 * @param text - The literal string to wait for in the output
 */
export async function waitForIncludingOutputOnSTDOUT(text: string): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT, new RegExp(escapeRegExp(text)));
}

/**
 * Wait for matching output
 *
 * Waits until the active shell's output matches the given regular expression.
 *
 * @param pattern - The pattern to match output against
 */
export async function waitForMatchingOutput(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.ANY, pattern);
}

/**
 * Wait for STDERR match
 *
 * Waits until STDERR output matches the given regular expression.
 *
 * @param pattern - The pattern to match output against
 */
export async function waitForMatchingOutputOnSTDERR(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR, pattern);
}

/**
 * Wait for STDOUT match
 *
 * Waits until STDOUT output matches the given regular expression.
 *
 * @param pattern - The pattern to match output against
 */
export async function waitForMatchingOutputOnSTDOUT(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT, pattern);
}

/**
 * Wait for shell output
 *
 * Waits for the active shell to produce output, optionally filtered by stream
 * and pattern. Updates the world's tracked working directory when output arrives.
 *
 * @param stream  - The stream to watch for output
 * @param pattern - The pattern to match output against
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
export async function waitForOutput(stream?: IOStream, pattern?: RegExp): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    await this.cli.manager.waitForOutput({ pattern, stream });

    this.fs.cwd = this.cli.manager.cwd;
}

/**
 * Wait for STDERR output
 *
 * Waits until the active shell produces any output on STDERR.
 */
export async function waitForOutputOnSTDERR(): Promise<void> {
    await waitForOutput.call(this, IOStream.STDERR);
}

/**
 * Wait for STDOUT output
 *
 * Waits until the active shell produces any output on STDOUT.
 */
export async function waitForOutputOnSTDOUT(): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT);
}

/**
 * Escape regexp characters
 *
 * Returns the input string with all special regular expression characters
 * escaped so it can be used as a literal match pattern.
 *
 * @param text - The string to escape
 */
function escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
