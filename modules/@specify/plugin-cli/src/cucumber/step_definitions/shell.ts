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

When("a/the user runs the command/process {string}", { "timeout": 60000 }, execCommandSync);

When("a/the user starts the (async )command/process {string}", execCommand);

When("a/the user waits for the last command to return", { "timeout": 60000 }, waitForCommandReturn);

When("a/the user waits for terminal output", { "timeout": 60000 }, waitForAnyCommandOutput);

When(
    "a/the user waits for terminal output on STDERR",
    { "timeout": 60000 },
    waitForCommandOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT",
    { "timeout": 60000 },
    waitForCommandOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output on STDERR to be {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForExactCommandOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT to be {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForExactCommandOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output on STDERR to be {string}",
    { "timeout": 60000 },
    waitForExactCommandOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT to be {string}",
    { "timeout": 60000 },
    waitForExactCommandOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output on STDERR to include {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForSimilarCommandOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT to include {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForSimilarCommandOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output on STDERR to include {string}",
    { "timeout": 60000 },
    waitForSimilarCommandOutputOnSTDERR,
);

When(
    "a/the user waits for terminal output on STDOUT to include {string}",
    { "timeout": 60000 },
    waitForSimilarCommandOutputOnSTDOUT,
);

When(
    "a/the user waits for terminal output to be {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForExactCommandOutput,
);

When(
    "a/the user waits for terminal output to be {string}",
    { "timeout": 60000 },
    waitForExactCommandOutput,
);

When(
    "a/the user waits for terminal output to include {ref:consoleOutput}",
    { "timeout": 60000 },
    waitForSimilarCommandOutput,
);

When(
    "a/the user waits for terminal output to include {string}",
    { "timeout": 60000 },
    waitForSimilarCommandOutput,
);

Then("the command should return a/an/the {ref:exitCode} exit code", verifyExitCode);

Then("the console output should be a/an/the {ref:consoleOutput}", verifyOutput);

/**
 * Execute the given command via the CLI asynchronously and move on without
 * waiting for it to return.
 *
 * @param command - The command to run
 *
 * @throws {@link AssertionError}
 * If there is no SessionManager initialized.
 */
function execCommand(command: string): void {
    assert.ok(this.cli.manager);
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
 * Verify that the CLI output for the last command matches the given regexp.
 *
 * @param consoleOutput - The matcher to use for the output
 *
 * @throws {@link AssertionError}
 * If the matcher regexp wasnt found
 */
function verifyOutput(consoleOutput: RegExp): void {
    assert.ok(
        consoleOutput.test(this.cli.manager.output),
        new AssertionError({
            "message": `Command output did not match expectations. Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Verify that the CLI exit code for the last command is as expected.
 *
 * @param exitCode - The exit code expected from the last command
 *
 * @throws {@link AssertionError}
 * If the actual exit code is different
 */
function verifyExitCode(exitCode: number): void {
    assert.equal(
        this.cli.manager.exitCode,
        exitCode,
        "The command's status code did not match expectations.",
    );
}

/**
 * Wait for the last command to return.
 *
 * @throws {@link AssertionError}
 * If there is no SessionManager initialized.
 */
async function waitForCommandReturn(): Promise<void> {
    assert.ok(this.cli.manager);
    await this.cli.manager.waitForReturn();
}

/**
 * Wait for the last command to send some output.
 *
 * @param stream  - The stream to watch for output
 * @param pattern - The pattern to match output against
 */
async function waitForCommandOutput(stream?: IOStream, pattern?: string): Promise<void> {
    assert.ok(this.cli.manager);
    await this.cli.manager.waitForOutput({ pattern, stream });
}

/**
 * Wait for literally any output.
 */
async function waitForAnyCommandOutput(): Promise<void> {
    await waitForCommandOutput.call(this);
}

/**
 * Wait for output on the STDERR stream.
 */
async function waitForCommandOutputOnSTDERR(): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDERR);
}

/**
 * Wait for output on the STDOUTstream.
 */
async function waitForCommandOutputOnSTDOUT(): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDOUT);
}

/**
 * Wait for output exactly matching a specific phrase.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForExactCommandOutput(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.ANY, `^${pattern}$`);
}

/**
 * Wait for output exactly matching a specific phrase on the STDERR stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForExactCommandOutputOnSTDERR(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDERR, `^${pattern}$`);
}

/**
 * Wait for output exactly matching a specific phrase on the STDOUT stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForExactCommandOutputOnSTDOUT(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDOUT, `^${pattern}$`);
}

/**
 * Wait for output partially matching a specific phrase.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForSimilarCommandOutput(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.ANY, pattern);
}

/**
 * Wait for output partially matching a specific phrase on the STDERR stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForSimilarCommandOutputOnSTDERR(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDERR, pattern);
}

/**
 * Wait for output partially matching a specific phrase on the STDOUT stream.
 *
 * @param pattern - The pattern to match output against
 */
async function waitForSimilarCommandOutputOnSTDOUT(pattern: string): Promise<void> {
    await waitForCommandOutput.call(this, IOStream.STDOUT, pattern);
}
