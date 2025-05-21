/**
 * Quick Refs Module
 *
 * A utility for referencing test param data quickly and easily.  Stored values
 * are keyed with an arbitrary string and namespaced by data type.  Refs files
 * are expected to conform to JSON format.
 */

import extend from "deep-extend";
import * as fs from "node:fs/promises";
import * as path from "node:path";

export const refs = {};

/**
 * Add the contents of a JSON file to the quick ref store.  As with addJSON,
 * you can specify a namespace to store the JSON object under.
 *
 * @param filePath - The path to the JSON file to read and store
 * @param namespace - The namespace under which the file's contents should be
 *                    stored
 */
export async function addFile(
    filePath: string,
    namespace: string = "",
): Promise<void> {
    const jsonRaw = await fs.readFile(path.resolve(filePath), {
        "encoding": "utf8",
    });
    const jsonParsed = JSON.parse(jsonRaw);

    addJSON(jsonParsed, namespace);
}

/**
 * Add an arbitrary JSON structure to the quick ref store.  Optionally, you can
 * specify a namespace to store the object under; if omitted, object will
 * be merged with the root level.
 *
 * @param json      - The JSON object to store
 * @param namespace - The namespace under which JSON object should be stored
 */
export function addJSON(
    json: Record<string, unknown>,
    namespace: string = "",
): void {
    let target = refs;

    if (namespace) {
        if (!(namespace in refs)) {
            refs[namespace] = {};
        }

        target = refs[namespace];
    }

    extend(target, json);
}

/**
 * Look up a reference by namespace and name.
 *
 * @param name      - The name of the reference to retrieve
 * @param namespace - The namespace under which the reference was stored
 */
export function lookup(name: string, namespace: string = ""): unknown {
    return refs[namespace]?.[name];
}
