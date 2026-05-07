/**
 * Commands Step Definitions Module
 *
 * Cucumber step definitions covering execution of commands within an active
 * shell session: starting them (sync or async), sending signals, waiting for
 * return, and asserting on exit code or elapsed time.
 */

import { defineStep             } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";

export function register(): void {
    defineStep(
        "When [I send/the user sends] a {cliSignal} signal to the last command",
        sendKillSignal,
    );
    defineStep(
        "When [I start/the user starts] a/an/the (async )command/process {refstr}",
        execCommand,
    );

    defineStep("When [I run/the user runs] the command/process {refstr}", execCommandSync, {
        "timeout": 60000,
    });

    defineStep(
        "When [I wait/the user waits] for the last command to return",
        waitForCommandReturn,
        {
            "timeout": 60000,
        },
    );

    defineStep(
        [
            "Then the last command's exit code/status should be {int|intstr|ref}",
            "Then the last command's exit code/status should be a/an {int|intstr|ref}",
        ],
        verifyExitCode,
    );

    defineStep(
        "Then the last command's execution time should be at least {float} seconds",
        verifyMinimumElapsedTime,
    );

    defineStep(
        "Then the last command's execution time should be at most {float} seconds",
        verifyMaximumElapsedTime,
    );
}

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

    this.fs.cwd = this.cli.manager.cwd;
}

/**
 * Send a system kill signal to the command in the last used CLI.
 *
 * @param signal - The system signal to pass to killCommand()
 */
async function sendKillSignal(signal: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    await this.cli.manager.killCommand({}, signal);
}

/**
 * Verify that the CLI exit code for the last command is as expected.
 *
 * @param exitCode - The exit code expected from the last command
 *
 * @throws Error
 * If the actual exit code is different
 */
async function verifyExitCode(exitCode: number): Promise<void> {
    await this.waitFor(() => exitCode === this.cli.manager.exitCode, {
        "error": Error(
            `The command's exit code was not the expected value.\nExpected: ${exitCode}\nActual: ${this.cli.manager.exitCode}`,
        ),
    });
}

/**
 * Verify that the last command's execution time is the specified number of
 * seconds or less.
 *
 * @remarks
 * Will wait for the last command to return before asserting.
 *
 * @param maxTime - The maximum amount of time, in seconds, that should have
 *                  elapsed
 *
 * @throws Error
 * If the last command's execution time is more than the specified number of
 * seconds.
 */
async function verifyMaximumElapsedTime(maxTime: number): Promise<void> {
    await this.cli.manager.waitForReturn();

    const elapsed = this.cli.manager.commandElapsedTime / 1000;

    assert.ok(
        elapsed <= maxTime,
        new AssertionError({
            "message": `The last command's total execution time ${elapsed}s was more than ${maxTime}s.`,
        }),
    );
}

/**
 * Verify that the last command's execution time is the specified number of
 * seconds or more.
 *
 * @remarks
 * Will wait for the last command to return before asserting.
 *
 * @param minTime - The minimum amount of time, in seconds, that should have
 *                  elapsed
 *
 * @throws Error
 * If the last command's execution time is less than the specified number of
 * seconds.
 */
async function verifyMinimumElapsedTime(minTime: number): Promise<void> {
    await this.cli.manager.waitForReturn();

    const elapsed = this.cli.manager.commandElapsedTime / 1000;

    assert.ok(
        elapsed >= minTime,
        new AssertionError({
            "message": `The last command's total execution time ${elapsed}s was less than ${minTime}s.`,
        }),
    );
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

    this.fs.cwd = this.cli.manager.cwd;
}
