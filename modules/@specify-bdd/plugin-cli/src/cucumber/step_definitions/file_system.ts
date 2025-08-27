/**
 * File System Step Definitions Module
 *
 * Cucumber step definitions covering interactions with a file system.
 */

import { Given, When            } from "@cucumber/cucumber";
import assert, { AssertionError } from "node:assert/strict";

Given("(that )the working directory is {path}", changeDirectory);

When("a/the user changes the working directory to {path}", changeDirectory);

/**
 * Change the current working directory in the active shell.
 *
 * @param dirPath - The new working directory
 *
 * @throws AssertionError
 * If there is no SessionManager initialized.
 *
 * @throws AssertionError
 * If the CD command returns a non-zero exit code.
 */
async function changeDirectory(dirPath: string): Promise<void> {
    assert.ok(this.cli.manager, new AssertionError({ "message": "No shell session initialized." }));

    this.cli.manager.run(`cd ${dirPath}`); // TODO: generalize this so it will work for any OS/shell

    await this.cli.manager.waitForReturn();

    assert.equal(
        this.cli.manager.exitCode,
        0,
        new AssertionError({ "message": `Could not change directory to ${dirPath}.` }),
    );
}
