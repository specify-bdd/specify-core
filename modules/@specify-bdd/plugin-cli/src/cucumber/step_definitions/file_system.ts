/**
 * File System Step Definitions Module
 *
 * Cucumber step definitions covering interactions with a file system.
 */

import { Given, Then, When      } from "@cucumber/cucumber";
import assert, { AssertionError } from "node:assert/strict";
import { existsSync             } from "node:fs";
import { mkdtemp, readFile      } from "node:fs/promises";
import { tmpdir                 } from "node:os";
import { join                   } from "node:path";

Given("a new temp file path referenced as {string}", createTempFileRef);
Given("(that )the working directory is {filePath}", changeDirectory);

When("a/the user changes the working directory to {filePath}", changeDirectory);

// TODO: add {filePath} variant
Then("the {ref} file content should be empty", verifyFileIsEmpty);

// TODO: add {filePath} variant
Then("the {ref} file path should exist", verifyFilePathExists);

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
}

/**
 * Create a new /tmp filepath and store it in QuickRef at the given address.
 *
 * @param address - The dot notation address at which to store the temp file path
 */
async function createTempFileRef(address: string): Promise<void> {
    const dirPath  = await mkdtemp(join(tmpdir(), "specify", "test-"));
    const filePath = join(dirPath, "rerun.txt");

    this.quickRef.setRefByAddress(address, filePath);
}

/**
 * Verify that the file at the given path is empty.
 *
 * @param filePath - The file path to check for emptiness
 *
 * @throws AssertionError
 * If the file does not exist.
 *
 * @throws AssertionError
 * If the file is not empty.
 */
async function verifyFileIsEmpty(filePath: string): Promise<void> {
    await verifyFilePathExists.call(this, filePath);

    const content = await readFile(filePath, "utf8");

    assert.ok(
        !content,
        new AssertionError({ "message": "Expected file to be empty but it is not." }),
    );
}

/**
 * Verify that a file exists at the given path.
 *
 * @param filePath - The file path to check for existence
 *
 * @throws AssertionError
 * If the file does not exist.
 */
async function verifyFilePathExists(filePath: string): Promise<void> {
    assert.ok(
        existsSync(filePath),
        new AssertionError({ "message": `The file path "${filePath}" does not exist` }),
    );
}
