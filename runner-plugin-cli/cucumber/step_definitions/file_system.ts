import { FileParam } from "@/types/params";
import { Given, When } from "@cucumber/cucumber";
import * as fs from "node:fs/promises";

import type { ObjectEncodingOptions } from "node:fs";

Given('that a(n) "{ref:file}" file exists at "{path}"', writeFile);

When('a/the user puts a(n) "{ref:file}" file in "{path}"', writeFile);

/**
 * Writes a defined file's contents to a specific file system location.
 */
async function writeFile(file: FileParam, dest_path: string): Promise<void> {
    const opts = {
        "encoding": file.encoding || "utf8",
        "mode": file.mode || 0o644,
    } as Partial<ObjectEncodingOptions>;

    await fs.writeFile(dest_path, file.content, opts);
}
