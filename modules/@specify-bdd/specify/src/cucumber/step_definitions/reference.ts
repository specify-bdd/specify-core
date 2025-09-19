/**
 * Reference Step Definitions Module
 *
 * Cucumber step definitions that interact with Specify reference data.
 */
import { Given, Then       } from "@cucumber/cucumber";
import { AssertionError    } from "node:assert";
import assert                from "node:assert/strict";
import { existsSync        } from "node:fs";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir            } from "node:os";
import { join              } from "node:path";

Given("a new temp file path referenced as {string}", createTempFileRef);

Then("the {ref} file path should exist", verifyFilePathExists);
Then("the {ref} file content should be empty", verifyFileIsEmpty);

async function createTempFileRef(address: string): Promise<void> {
    const dirPath  = await mkdtemp(join(tmpdir(), "specify", "test-"));
    const filePath = join(dirPath, "rerun.txt");

    this.quickRef.setRefByAddress(address, filePath);
}

async function verifyFileIsEmpty(filePath: string): Promise<void> {
    await verifyFilePathExists(filePath);

    const content = await readFile(filePath, "utf8");

    assert.ok(
        !content,
        new AssertionError({ "message": "Expected file to be empty but it is not." }),
    );
}

async function verifyFilePathExists(filePath: string): Promise<void> {
    assert.ok(
        existsSync(filePath),
        new AssertionError({ "message": `The file path "${filePath}" does not exist` }),
    );
}
