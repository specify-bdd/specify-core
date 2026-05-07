/**
 * Shell Sessions Step Definitions Module
 *
 * Cucumber step definitions covering the lifecycle of OS shell sessions:
 * starting, switching, killing, and counting them, plus changing the working
 * directory of the active session.
 */

import { defineStep             } from "@specify-bdd/specify";
import assert, { AssertionError } from "node:assert/strict";

import { SessionManager } from "@/lib/SessionManager";
import { ShellSession   } from "@/lib/ShellSession";

import type { SpawnOptions } from "node:child_process";

export function register(): void {
    defineStep("When [I kill/the user kills] CLI shell {int|intstr}", killCLIShellByIndex);
    defineStep("When [I kill/the user kills] the CLI shell", killCLIShell);
    defineStep("When [I kill/the user kills] the CLI shell named {string}", killCLIShellByName);
    defineStep("When [I switch/the user switches] CLI shells", switchToNextShell);
    defineStep("When [I switch/the user switches] to CLI shell {int|intstr}", switchShellByIndex);
    defineStep(
        "When [I switch/the user switches] to the CLI shell named {string}",
        switchShellByName,
    );
    defineStep("Then there should be {int|intstr} active CLI shell(s)", verifyShellCount);

    defineStep(
        ["Given a/another CLI shell", "When [I start/the user starts] a/another CLI shell"],
        startDefaultShell,
    );

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
}

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

    if (selector === undefined) {
        await this.cli.manager.killSession();
    } else {
        await this.cli.manager.killSession({
            "sessionMeta": this.cli.manager.findSession(selector),
        });
    }
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

    if (selector === undefined) {
        this.cli.manager.switchToNextSession();
    } else {
        const session = this.cli.manager.findSession(selector);
        this.cli.manager.switchToSession({ "sessionMeta": session });
    }

    this.fs.cwd = this.cli.manager.cwd;
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
