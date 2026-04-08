/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import { defineStep             } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";

import { SessionManager, IOStream } from "@/lib/SessionManager";
import { ShellSession             } from "@/lib/ShellSession";

import type { SpawnOptions } from "node:child_process";

defineStep(
    [
        "When [I kill/the user kills] CLI shell {int}",
        "When [I kill/the user kills] CLI shell {intstr}",
    ],
    killCLIShellByIndex,
);
defineStep("When [I kill/the user kills] the CLI shell", killCLIShell);
defineStep("When [I kill/the user kills] the CLI shell named {string}", killCLIShellByName);
defineStep("When [I send/the user sends] a {cliSignal} signal to the last command", sendKillSignal);
defineStep("When [I start/the user starts] a/an/the (async )command/process {refstr}", execCommand);
defineStep("When [I switch/the user switches] CLI shells", switchToNextShell);
defineStep(
    [
        "When [I switch/the user switches] to CLI shell {int}",
        "When [I switch/the user switches] to CLI shell {intstr}",
    ],
    switchShellByIndex,
);
defineStep("When [I switch/the user switches] to the CLI shell named {string}", switchShellByName);
defineStep("When [I wait/the user waits] for terminal output", waitForAnyOutput, {
    "timeout": 60000,
});
defineStep(
    [
        "Then there should be {int} active CLI shell(s)",
        "Then there should be {intstr} active CLI shell(s)",
    ],
    verifyShellCount,
);

defineStep(
    ["Given a/another CLI shell", "When [I start/the user starts] a/another CLI shell"],
    startDefaultShell,
);

defineStep("When [I run/the user runs] the command/process {refstr}", execCommandSync, {
    "timeout": 60000,
});

defineStep("When [I wait/the user waits] for the last command to return", waitForCommandReturn, {
    "timeout": 60000,
});

defineStep("When [I wait/the user waits] for terminal output on STDERR", waitForOutputOnSTDERR, {
    "timeout": 60000,
});

defineStep("When [I wait/the user waits] for terminal output on STDOUT", waitForOutputOnSTDOUT, {
    "timeout": 60000,
});

defineStep(
    [
        "Given a/another CLI shell named {string}",
        "When [I start/the user starts] a/another CLI shell named {string}",
    ],
    startDefaultNamedShell,
);

defineStep(
    ["Given a/an {string} CLI shell", "When [I start/the user starts] a/an {string} CLI shell"],
    startAltShell,
);

defineStep(
    [
        "Given a/an {string} CLI shell named {string}",
        "When [I start/the user starts] a/an {string} CLI shell named {string}",
    ],
    startAltNamedShell,
);

defineStep(
    [
        "Given (that )the working directory is {filePath}",
        "When [I change/the user changes] the working directory to {filePath}",
    ],
    changeDirectory,
);

defineStep(
    [
        "Then the last command's exit code/status should be {int}",
        "Then the last command's exit code/status should be {intstr}",
        "Then the last command's exit code/status should be {ref}",
        "Then the last command's exit code/status should be a/an {int}",
        "Then the last command's exit code/status should be a/an {intstr}",
        "Then the last command's exit code/status should be a/an {ref}",
    ],
    verifyExitCode,
);

defineStep(
    [
        "When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){ref}",
        "When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){regexp}",
    ],
    waitForMatchingOutputOnSTDERR,
    { "timeout": 60000 },
);

defineStep(
    [
        "When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){ref}",
        "When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){regexp}",
    ],
    waitForMatchingOutputOnSTDOUT,
    { "timeout": 60000 },
);

defineStep(
    [
        "When [I wait/the user waits] for terminal output matching (the regular expression ){ref}",
        "When [I wait/the user waits] for terminal output matching (the regular expression ){regexp}",
        "When [I wait/the user waits] for the prompt {regexp}",
    ],
    waitForMatchingOutput,
    { "timeout": 60000 },
);

defineStep(
    "Then the last command's execution time should be at least {float} seconds",
    verifyMinimumElapsedTime,
);

defineStep(
    "Then the last command's execution time should be at most {float} seconds",
    verifyMaximumElapsedTime,
);

defineStep(
    [
        "Then the last command's terminal output should match (the regular expression ){ref}",
        "Then the last command's terminal output should match (the regular expression ){regexp}",
    ],
    verifyMatchingOutput,
);

defineStep(
    [
        "Then the last command's terminal output should not match (the regular expression ){ref}",
        "Then the last command's terminal output should not match (the regular expression ){regexp}",
    ],
    verifyNoMatchingOutput,
);

defineStep("Then the last command's terminal output should be empty", verifyEmptyOutput);

defineStep(["When [I press/the user presses] the {string} key"], sendKeyPressToCLI);

defineStep(
    ["When [I respond/the user responds] to the prompt {regexp} by pressing the {string} key"],
    respondToPromptByPressingKey,
);

defineStep(
    ["When [I enter/the user enters] {string}", "When [I input/the user inputs] {string}"],
    sendLineToCLI,
);

defineStep(
    ["When [I respond/the user responds] to the prompt {string} by entering/inputting {string}"],
    respondToPromptByEnteringLine,
);

/**
 * Change the current working directory in the active shell.
 *
 * @param dirPath - The new working directory
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 *
 * @throws AssertionError
 * If the `cd` command returns a non-zero exit code.
 */
async function changeDirectory(dirPath: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    this.cli.manager.run(`cd ${dirPath}`);

    await this.cli.manager.waitForReturn();

    assert.equal(this.cli.manager.exitCode, 0, `Could not change directory to ${dirPath}.`);

    this.fs.cwd = this.cli.manager.cwd;
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
 * Kill the active CLI shell.
 */
async function killCLIShell(): Promise<void> {
    killCLIShellBySelector.call(this);
}

/**
 * Kill a CLI shell by its index.
 *
 * @param index - The index of the CLI shell to kill
 */
async function killCLIShellByIndex(index: number): Promise<void> {
    killCLIShellBySelector.call(this, index);
}

/**
 * Kill a CLI shell by its name.
 *
 * @param name - The name of the CLI shell to kill
 */
async function killCLIShellByName(name: string): Promise<void> {
    killCLIShellBySelector.call(this, name);
}

/**
 * Kill the given CLI shell by its selector, or the active shell if no selector.
 *
 * @param selector - The selector of the CLI shell to kill
 */
async function killCLIShellBySelector(selector?: number | string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    if (!selector) {
        await this.cli.manager.killSession();
    } else {
        await this.cli.manager.killSession({
            "sessionMeta": this.cli.manager.findSession(selector),
        });
    }
}

/**
 * Wait for a prompt matching the given pattern, then respond by entering the given line.
 *
 * @param prompt - the prompt to wait for before responding
 * @param line   - the line to enter in response to the prompt
 */
async function respondToPromptByEnteringLine(prompt: RegExp, line: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

    sendLineToCLI.call(this, line);
}

/**
 * Wait for a prompt matching the given pattern, then respond by sending the given key
 *
 * @param prompt - the prompt to wait for before responding
 * @param key    - the key to send in response to the prompt
 */
async function respondToPromptByPressingKey(prompt: RegExp, key: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    await waitForMatchingOutput.call(this, prompt);

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
 * Start a user-specified shell.
 *
 * @param shellType - The type of shell to spawn (`sh`, `bash`, etc.)
 */
async function startAltShell(shellType: string): Promise<void> {
    return startShell.call(this, shellType);
}

/**
 * Start a user-specified shell with a name.
 *
 * @param shellType - The type of shell to spawn (`sh`, `bash`, etc.)
 * @param name      - The name of the shell
 */
async function startAltNamedShell(shellType: string, name: string): Promise<void> {
    return startShell.call(this, shellType, name);
}

/**
 * Start a default shell without a name.
 */
async function startDefaultShell(): Promise<void> {
    return startShell.call(this);
}

/**
 * Start a default shell with a name.
 *
 * @param name - The name of the shell
 */
async function startDefaultNamedShell(name: string): Promise<void> {
    return startShell.call(this, "sh", name);
}

/**
 * Start a shell. Defaults to "sh" and no name.
 *
 * @param shellType - The type of shell to spawn (`sh`, `bash`, etc.)
 * @param name      - The name of the shell
 */
async function startShell(shellType: string = "sh", name?: string): Promise<void> {
    const options: SpawnOptions = { "cwd": this.fs.cwd, "env": { ...process.env } };

    // strip Cucumber env vars from the options object that will be passed to the child process
    // helps to ensure a Specify process run by Specify doesn't get confused by its parent's operating parameters
    for (const key in options.env) {
        if (key.slice(0, 9) === "CUCUMBER_") {
            delete options.env[key];
        }
    }

    // preserve the user-defined PATH world param within the child process
    if (this.parameters.userPath) {
        options.env.PATH = this.parameters.userPath;
    }

    const shell = new ShellSession(shellType, options);

    this.cli.manager ??= new SessionManager();
    this.cli.manager.addSession(shell, name, this.fs.cwd);

    assert.ok(
        await this.cli.manager.validateShell(shellType),
        new AssertionError({ "message": `Failed to start ${shellType} CLI shell.` }),
    );
}

/**
 * Switch to the next shell in the list.
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function switchToNextShell(): void {
    switchShell.call(this);
}

/**
 * Switch to the shell matching the index.
 *
 * @param index - The index of the shell to switch to
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function switchShellByIndex(index: number): void {
    switchShell.call(this, index);
}

/**
 * Switch to a named shell.
 *
 * @param name - The name of the shell to switch to
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function switchShellByName(name): void {
    switchShell.call(this, name);
}

/**
 * Switch to the shell matching the selector, or to the next shell
 * in the managed shell list if there is no selector.
 *
 * @param selector - The index or name of the shell to switch to
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 */
function switchShell(selector?: number | string): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    if (!selector) {
        this.cli.manager.switchToNextSession();
    } else {
        const session = this.cli.manager.findSession(selector);
        this.cli.manager.switchToSession({ "sessionMeta": session });
    }

    this.fs.cwd = this.cli.manager.cwd;
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
 * Verify that the CLI output for the last command matches the given regexp.
 *
 * @param pattern - The pattern to match output against
 *
 * @throws Error
 * If no matches for the regexp pattern were found
 */
async function verifyMatchingOutput(pattern: RegExp | string): Promise<void> {
    const regexp = new RegExp(pattern);

    await this.waitFor(() => regexp.test(this.cli.manager.output), {
        "error": Error(
            `Command output did not match the specified pattern. Output:\n${this.cli.manager.output}`,
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
 * If no matches for the regexp pattern were found
 */
async function verifyNoMatchingOutput(pattern: RegExp | string): Promise<void> {
    const regexp = new RegExp(pattern);

    await this.waitFor(() => !regexp.test(this.cli.manager.output), {
        "error": Error(
            `Command output matched the specified pattern. Output:\n${this.cli.manager.output}`,
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
 * Verify the number of shell sessions.
 *
 * @param count - The expected number of shell sessions
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 *
 * @throws AssertionError
 * If the actual number of shell sessions is not equal to the expected count
 */
function verifyShellCount(count: number): void {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));
    assert.equal(this.cli.manager.sessions.length, count);
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

    this.fs.cwd = this.cli.manager.cwd;
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
