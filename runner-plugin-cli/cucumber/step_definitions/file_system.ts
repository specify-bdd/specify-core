/**
 * File System Step Defintions Module
 *
 * Cucumber step definitions covering interactions with a file system.
 */

import { Given, When } from "@cucumber/cucumber";
import * as fs from "node:fs/promises";

import type { FileParam } from "@/types/params";
import type { ObjectEncodingOptions } from "node:fs";

Given('that a(n) "{ref:file}" file exists at "{path}"', writeFile);

When('a/the user puts a(n) "{ref:file}" file in "{path}"', writeFile);

/**
 * Writes a defined file's contents to a specific file system location.
 *
 * @param file      - The referenced file object to write
 * @param destPath - The location to write the file to
 */
async function writeFile(file: FileParam, destPath: string): Promise<void> {
    const opts = {
        "encoding": file.encoding || "utf8",
        "mode": file.mode || 0o644,
    } as Partial<ObjectEncodingOptions>;

    await fs.writeFile(destPath, file.content, opts);
}
