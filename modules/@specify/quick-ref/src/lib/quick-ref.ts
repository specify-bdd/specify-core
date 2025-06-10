/**
 * Quick Ref class module
 *
 * A simple utility for translating hierarchical references into operational
 * values.
 */

import merge from "deepmerge";

export class QuickRef {
    #refs = {};

    /**
     * Initialize the reference object hierarchy with one or more JSON objects.
     *
     * @param refs - One or more reference objects to combine and cache
     */
    constructor(...refs: object[]) {
        this.add(...refs);
    }

    /**
     * The cached reference objects aggregated into one JSON hierarchy
     */
    get refs(): object {
        return this.#refs;
    }

    /**
     * Add one or more new JSON objects to the unified reference object
     * hierarchy.
     *
     * @param refs - One or more reference objects to combine and cache
     *
     * @returns This instance
     */
    add(...refs: object[]): QuickRef {
        const opts = {
            // NOTE: the following function will cause deepmerge to combine arrays instead of overwriting them,
            // but it's not clear at this time whether that should be the intended behavior.
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

        this.#refs = merge.all([this.#refs, ...refs], opts);

        return this;
    }

    /**
     * Look up a reference by its address.  Params drill down through the
     * reference object hierarchy in the sequenceprovided.
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
    lookup(...segments: string[]): unknown {
        const usedSegments = ["<refs>"];

        let location = this.#refs;

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
}

export type QuickRef = QuickRef;
