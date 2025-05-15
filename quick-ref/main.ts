import extend    from "deep-extend";
import * as fs   from "node:fs/promises";
import * as path from "node:path";



export const refs = {};



/**
 * Add the contents of a JSON file to the quick ref store.  As with addJSON,
 * you can specify a namespace to store the JSON object under.
 */
export async function addFile(file_path: string, namespace: string = ""): Promise<void> {
    const json_raw    = await fs.readFile(path.resolve(file_path), { "encoding": "utf8" });
    const json_parsed = JSON.parse(json_raw);

    addJSON(json_parsed, namespace);
}

/**
 * Add an arbitrary JSON structure to the quick ref store.  Optionally, you can
 * specify a namespace to store the object under; if omitted, object will
 * be merged with the root level.
 */
export function addJSON(json: object, namespace:string = ""): void {
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
 */
export function lookup(namespace: string, name: string): any {
    return refs[namespace]?.[name];
}



// export { addFile, addJSON, lookup, refs }; // TODO: Why is this acting like a default export?
