/**
 * Quick Ref class module
 *
 * A simple utility for translating hierarchical references into operational
 * values.
 */

import merge from "deepmerge";

import type { JsonObject, JsonValue } from "type-fest";

export class QuickRef {
    #refs: JsonObject = {};

    /**
     * Initialize the reference object hierarchy with one or more JSON objects.
     *
     * @param refs - One or more reference objects to combine and cache
     */
    constructor(...refs: JsonObject[]) {
        this.add(...refs);
    }

    /**
     * The cached reference objects aggregated into one JSON hierarchy
     */
    get refs(): JsonObject {
        return this.#refs;
    }

    /**
     * Add one or more new JSON objects to the unified reference object
     * hierarchy.
     *
     * @remarks
     * When multiple arrays are assigned to the same address, the arrays are
     * not concatenated, but instead overwrite.  An alternative implementation
     * that concatenates is commented out and should remain here until we're
     * certain that we know how we want this to behave.
     *
     * @param refs - One or more reference objects to combine and cache
     *
     * @returns This instance
     */
    add(...refs: JsonObject[]): QuickRef {
        const opts = {
            arrayMerge(targ, src) {
                return src;
            },
            // arrayMerge(targ, src, opts) {
            //     const dest = [ ...targ ];
            //
            //     src.forEach((item, index) => {
            //         if (typeof dest[index] === 'undefined') {
            //             dest[index] = opts.cloneUnlessOtherwiseSpecified(item, opts)
            //         } else if (opts.isMergeableObject(item)) {
            //             dest[index] = merge(targ[index], item, opts)
            //         } else if (targ.indexOf(item) === -1) {
            //             dest.push(item)
            //         }
            //     });
            //
            //     return dest;
            // }
        };

        this.#refs = merge.all([this.#refs, ...refs], opts) as JsonObject;

        return this;
    }

    /**
     * Look up a reference by its address.  Params drill down through the
     * reference object hierarchy in the sequence provided.
     *
     * @param segments - The address segments to look up.  For example, ("foo",
     *                   "bar", "baz") will retrieve the value of
     *                   refs.foo.bar.baz.
     *
     * @returns The value found at given address
     *
     * @throws {@link Error}
     * If the provided address segments do not exist in the reference object
     * hierarchy
     */
    lookup(...segments: string[]): JsonValue {
        const usedSegments = ["<refs>"];

        let location: JsonValue = this.#refs;

        while (segments.length) {
            const segment = segments.shift();

            if (typeof location !== "object") {
                throw new Error(
                    `Invalid address: ${usedSegments.join(".")} is not an object and cannot be traversed.`,
                );
            } else if (!(segment in location)) {
                throw new Error(
                    `Invalid address: couldn't find "${segment}" in ${usedSegments.join(".")}.`,
                );
            }

            location = location[segment];
            usedSegments.push(segment);
        }

        return location;
    }
}
