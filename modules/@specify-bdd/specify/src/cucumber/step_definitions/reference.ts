/**
 * Reference Step Definitions Module
 *
 * Cucumber step definitions that interact with Specify reference data.
 */
import { Given   } from "@cucumber/cucumber";
import { mkdtemp } from "node:fs/promises";
import { tmpdir  } from "node:os";
import { join    } from "node:path";

Given("a new temp file path referenced as {string}", createTempFileRef);

async function createTempFileRef(address: string): Promise<void> {
    const dirPath  = await mkdtemp(join(tmpdir(), "specify", "test-"));
    const filePath = join(dirPath, "rerun.txt");

    this.quickRef.setRefByAddress(address, filePath);
}
