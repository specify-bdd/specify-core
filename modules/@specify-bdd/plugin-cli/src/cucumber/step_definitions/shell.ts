/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import { Given, Then, When      } from "@cucumber/cucumber";
import assert, { AssertionError } from "node:assert/strict";

import { SessionManager, IOStream } from "@/lib/SessionManager";
import { ShellSession             } from "@/lib/ShellSession";

Given("a/another CLI shell", startDefaultShell);

When("a/the user starts a/another CLI shell", startDefaultShell);

When("a/the user switches shells", switchShell);

When("a/the user runs the command/process {refstr}", { "timeout": 60000 }, execCommandSync);

When("a/the user starts the (async )command/process {refstr}", execCommand);

When("a/the user waits for the last command to return", { "timeout": 60000 }, waitForCommandReturn);

When("a/the user waits for terminal output", { "timeout": 60000 }, waitForAnyOutput);

When("a/the user waits for terminal output on STDERR", { "timeout": 60000 }, waitForOutputOnSTDERR);

When("a/the user waits for terminal output on STDOUT", { "timeout": 60000 }, waitForOutputOnSTDOUT);

When(
    "a/the user waits for terminal output on STDERR matching (the regular expression ){ref}",
    { "timeout": 60000 },
    waitForMatchingOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDERR matching (the regular expression ){regexp}",
    { "timeout": 60000 },
    waitForMatchingOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT matching (the regular expression ){ref}",
    { "timeout": 60000 },
    waitForMatchingOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output on STDOUT matching (the regular expression ){regexp}",
    { "timeout": 60000 },
    waitForMatchingOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output matching (the regular expression ){ref}",
    { "timeout": 60000 },
    waitForMatchingOutput,
);

When(
    "a/the user waits for terminal output matching (the regular expression ){regexp}",
    { "timeout": 60000 },
    waitForMatchingOutput,
);

Then(
    "the last command's execution time should be at least {float} seconds",
    verifyMinimumElapsedTime,
);

Then(
    "the last command's execution time should be at most {float} seconds",
    verifyMaximumElapsedTime,
);

Then("the last command's exit code/status should be {int}", verifyExitCode);
Then("the last command's exit code/status should be a/an {int}", verifyExitCode);

Then("the last command's exit code/status should be {ref}", verifyExitCode);
Then("the last command's exit code/status should be a/an {ref}", verifyExitCode);

Then(
    "the last command's terminal output should match (the regular expression ){ref}",
    verifyMatchingOutput,
);

Then(
    "the last command's terminal output should match (the regular expression ){regexp}",
    verifyMatchingOutput,
);

Then(
    "the last command's terminal output should not match (the regular expression ){ref}",
    verifyNoMatchingOutput,
);

Then(
    "the last command's terminal output should not match (the regular expression ){regexp}",
    verifyNoMatchingOutput,
);

/**
 * Execute the given command via the CLI asynchronously and move on without
 * waiting for it to return.
 *
 * @param command - The command to run
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function execCommand(command: string): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    this.cli.manager.run(command);
}

/**
 * Execute the given command and wait for it to return.
 *
 * @param command - The command to run
 */
async function execCommandSync(command: string): Promise<void> {
    execCommand.call(this, command);
    await waitForCommandReturn.call(this);
}

/**
 * Start a default shell.
 *
 * @param name - The name of the shell
 */
function startNamedDefaultShell(name?: string): void {
    const shell = new ShellSession(this.parameters.userPath);

    this.cli.manager ??= new SessionManager();
    this.cli.manager.addSession(shell, name);
}

/**
 * Start a default shell without a name.
 */
function startDefaultShell(): void {
    startNamedDefaultShell.call(this);
}

/**
 * Switch to the next shell in the list.
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function switchShell(): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    this.cli.manager.switchToNextSession();
}

/**
 * Verify that the CLI exit code for the last command is as expected.
 *
 * @param exitCode - The exit code expected from the last command
 *
 * @throws AssertionError
 * If the actual exit code is different
 */
function verifyExitCode(exitCode: number): void {
    assert.equal(
        this.cli.manager.exitCode,
        exitCode,
        "The command's exit code did not match expectations.",
    );
}

/**
 * Verify that the CLI output for the last command matches the given regexp.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws AssertionError
 * If no matches for the regexp pattern were found
 */
function verifyMatchingOutput(pattern: RegExp | string): void {
    const regexp = new RegExp(pattern);

    assert.ok(
        regexp.test(this.cli.manager.output),
        new AssertionError({
            "message": `Command output did not match the specified pattern. Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Verify that the CLI output for the last command does NOT match the given
 * regexp.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws AssertionError
 * If no matches for the regexp pattern were found
 */
function verifyNoMatchingOutput(pattern: RegExp | string): void {
    const regexp = new RegExp(pattern);

    assert.ok(
        !regexp.test(this.cli.manager.output),
        new AssertionError({
            "message": `Command output matched the specified pattern. Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Verify that the last command's execution time is the specified number of
 * seconds or less.
 *
 * @param maxTime - The maximum amount of time, in seconds, that should have
 *                  elapsed
 *
 * @throws AssertionError
 * If the last command's execution time is more than the specified number of
 * seconds.
 */
function verifyMaximumElapsedTime(maxTime: number): void {
    const elapsed = this.cli.manager.commandElapsedTime / 1000;

    assert.ok(
        elapsed < maxTime,
        new AssertionError({
            "message": `The last command's total execution time ${elapsed}s was more than ${maxTime}s.`,
        }),
    );
}

/**
 * Verify that the last command's execution time is the specified number of
 * seconds or more.
 *
 * @param minTime - The minimum amount of time, in seconds, that should have
 *                  elapsed
 *
 * @throws AssertionError
 * If the last command's execution time is less than the specified number of
 * seconds.
 */
function verifyMinimumElapsedTime(minTime: number): void {
    const elapsed = this.cli.manager.commandElapsedTime / 1000;

    assert.ok(
        elapsed > minTime,
        new AssertionError({
            "message": `The last command's total execution time ${elapsed}s was less than ${minTime}s.`,
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
 * Wait for the last command to return.
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
async function waitForCommandReturn(): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    await this.cli.manager.waitForReturn();
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
async function waitForMatchingOutput(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.ANY, pattern);
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
 * Wait for output matching a specific phrase on the STDOUT stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForMatchingOutputOnSTDOUT(pattern: RegExp): Promise<void> {
    await waitForOutput.call(this, IOStream.STDOUT, pattern);
}
