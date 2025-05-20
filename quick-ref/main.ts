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
 * @async
 * 
 * @param file_path - The path to the JSON file to read and store
 * @param namespace - The namespace under which the file's contents should be 
 *                    stored
 */
export async function addFile(
    file_path: string,
    namespace: string = "",
): Promise<void> {
    const json_raw = await fs.readFile(path.resolve(file_path), {
        "encoding": "utf8",
    });
    const json_parsed = JSON.parse(json_raw);

    addJSON(json_parsed, namespace);
}

/**
 * Add an arbitrary JSON structure to the quick ref store.  Optionally, you can
 * specify a namespace to store the object under; if omitted, object will
 * be merged with the root level.
 * 
 * @async
 * 
 * @param json      - The JSON object to store
 * @param namespace - The namespace under which JSON object should be stored
 */
export function addJSON(
    json: Record<string, any>,
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
 * @async
 * 
 * @param name      - The name of the reference to retrieve 
 * @param namespace - The namespace under which the reference was stored
 */
export function lookup(name: string, namespace: string = ""): any {
    return refs[namespace]?.[name];
}
