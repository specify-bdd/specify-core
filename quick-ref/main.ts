/**
 * Quick Refs Module
 *
 * A utility for referencing test param data quickly and easily.  Stored values
 * are keyed with an arbitrary string and namespaced by data type.  Refs files
 * are expected to conform to JSON format.
 */

import { globbySync } from "globby";
import * as path from "node:path";
import { pathToFileURL } from "node:url";

const cwd = process.cwd();

export const entries = await Promise.all(
    globbySync(path.join(cwd, "*.refs.json"), {
        "absolute": true,
        "onlyFiles": true,
    }).map(async (modulePath) => {
        const module = await import(pathToFileURL(modulePath).href, {
            "with": { "type": "json" },
        });
        const [key] = Object.keys(module.default);

        return [key, module.default[key]];
    }),
);

export const refs = Object.fromEntries(entries);

/**
 * Look up a reference by its address.  Params drill down through the reference object hierarchy in the sequence
 * provided.
 *
 * @param segments - The address segments to look up.  For example, ("foo", "bar", "baz") will retrieve the value of
 *                   refs.foo.bar.baz.
 *
 * @returns The value found at given address
 *
 * @throws {@link Error}
 * If the provided address segments do not exist in the reference object hierarchy
 */
export function lookup(...segments: string[]): unknown {
    const usedSegments = [];

    let location = refs;

    while (segments.length) {
        const segment = segments.shift();

        if (!(segment in location)) {
            throw new Error(
                `Invalid address: couldn't find "${segment}" in ${usedSegments.join(".")}.`,
            );
        }

        location = location[segment];
        usedSegments.push(segment);
    }

    return location;
}

export type QuickRef = {
    "entries": Array<Array<unknown>>;
    "refs": Record<string, unknown>;
    "lookup": () => unknown;
};
