/**
 * File System Step Definitions Module
 *
 * Cucumber step definitions covering interactions with a file system.
 */

import { defineStep                           } from "@specify-bdd/specify";
import assert, { AssertionError               } from "node:assert/strict";
import { existsSync                           } from "node:fs";
import { mkdtemp, readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir                               } from "node:os";
import { join                                 } from "node:path";

defineStep("Given a new temp file path referenced as {string}", createTempFileRef);

defineStep("When [I delete/the user deletes] the {filePath} file", deleteFile);

defineStep(
    [
        "Given (that )the {filePath} file content is {string}",
        "Given (that )the {ref} file content is {string}",
        "When [I change/the user changes] the {filePath} file content to {string}",
    ],
    writeFileContent,
);

defineStep(
    [
        "Given (that )the {filePath} file content is empty",
        "Given (that )the {ref} file content is empty",
        "When [I create/the user creates] the {filePath} file",
    ],
    writeEmptyFileContent,
);

defineStep(
    [
        "Then the {filePath} file content should be empty",
        "Then the {ref} file content should be empty",
    ],
    verifyFileIsEmpty,
);

defineStep(
    [
        "Then the {filePath} file content should match {ref}",
        "Then the {ref} file content should match {ref}",
    ],
    verifyFileContent,
);

defineStep(
    ["Then the {filePath} file path should exist", "Then the {ref} file path should exist"],
    verifyFilePathExists,
);

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
 * Delete the file at the given path.
 *
 * @param filePath - The path to the file
 */
async function deleteFile(filePath: string): Promise<void> {
    await verifyFilePathExists.call(this, filePath);

    await unlink(filePath);
}

/**
 * Verify that the file at the given path has content matching the given pattern.
 *
 * @param filePath - The file path to check the content of
 * @param pattern  - The regex pattern (as string) the file content should match
 *
 * @throws AssertionError
 * If the file does not exist.
 *
 * @throws AssertionError
 * If the file content doesn't match the pattern.
 */
async function verifyFileContent(filePath: string, pattern: string): Promise<void> {
    await verifyFilePathExists.call(this, filePath);

    const content = await readFile(filePath, "utf8");

    assert.match(content, RegExp(pattern), "File content does not match the expected pattern.");
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

/**
 * Create an empty file at the given path.
 * If the file already exists, it will be overwritten as empty.
 *
 * @param filePath - The path to the file
 */
async function writeEmptyFileContent(filePath: string): Promise<void> {
    await writeFileContent.call(this, filePath, "");
}

/**
 * Set the content of the file at the given path. Creates the file if it does
 * not exist, overwrites if it does.
 *
 * @param filePath - The path to the file to set content for
 * @param content  - The content to write to the file
 */
async function writeFileContent(filePath: string, content: string): Promise<void> {
    await writeFile(filePath, content);
}
