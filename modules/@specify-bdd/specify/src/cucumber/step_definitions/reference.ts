/**
 * Reference Step Definitions Module
 *
 * Cucumber step definitions that interact with Specify reference data.
 */
import { Given, Then              } from "@cucumber/cucumber";
import { AssertionError           } from "node:assert";
import assert                       from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp                  } from "node:fs/promises";
import { tmpdir                   } from "node:os";
import { join                     } from "node:path";

Given("a new temp file path referenced as {string}", createTempFileRef);

Then("the {ref} file path should exist", verifyFilePathExists);
Then("the {ref} file content should be empty", verifyFileIsEmpty);

async function createTempFileRef(address: string): Promise<void> {
    const dirPath  = await mkdtemp(join(tmpdir(), "specify", "test-"));
    const filePath = join(dirPath, "rerun.txt");

    this.quickRef.setRefByAddress(address, filePath);
}

function verifyFileIsEmpty(filePath: string): void {
    verifyFilePathExists(filePath);

    const content = readFileSync(filePath, "utf8");

    assert.ok(
        !content,
        new AssertionError({ "message": "Expected file to be empty but it is not." }),
    );
}

function verifyFilePathExists(filePath: string): void {
    assert.ok(
        existsSync(filePath),
        new AssertionError({ "message": `The file path "${filePath}" does not exist` }),
    );
}
