import { FileParam   } from "@/types/params";
import { Given, When } from "@cucumber/cucumber";
import * as fs         from "node:fs/promises";



Given('that a(n) "{ref:file}" file exists at "{path}"', writeFile);

When('a/the user puts a(n) "{ref:file}" file in "{path}"', writeFile);



/**
 * Writes a defined file's contents to a specific file system location.
 */
async function writeFile(file: FileParam, dest_path: string): void {
    console.log("writing file");
    const opts = {
        "encoding": file.encoding || "utf8",
        "mode":     file.mode     || 0o666,
    };

    await fs.writeFile(dest_path, file.content, opts);
}
