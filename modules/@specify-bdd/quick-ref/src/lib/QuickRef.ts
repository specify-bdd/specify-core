/**
 * Quick Ref class module
 *
 * A simple utility for translating hierarchical references into operational
 * values.
 */

import merge from "deepmerge";

import type { JsonObject, JsonValue } from "type-fest";

export const refNotation = /\$\{[\w.]+\}/;

export class QuickRef {
    /**
     * All the references stored in this QuickRef instance.
     */
    #all: JsonObject = {};

    /**
     * Initialize the reference object hierarchy with one or more JSON objects.
     *
     * @param refs - One or more reference objects to combine and cache
     */
    constructor(...refs: JsonObject[]) {
        this.add(...refs);
    }

    /**
     * A read-only accessor for all the references stored in this QuickRef
     * instance.
     */
    get all(): JsonObject {
        return this.#all;
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

        this.#all = merge.all([this.#all, ...refs], opts) as JsonObject;

        return this;
    }

    /**
     * Look up a reference by its dot notation address.  If no address is
     * provided, the entire reference store will be returned.
     *
     * @param address - The address to look up. For example, ("foo.bar.baz")
     *                  will retrieve the value of this.#all.foo.bar.baz.
     *
     * @returns The value found at the given address
     */
    lookupByAddress(address?: string): JsonValue {
        const keys = address?.split(".") ?? [];

        return this.lookupByKeys(...keys);
    }

    /**
     * Look up a reference by its keys.  Params drill down through the
     * reference object hierarchy in the key sequence provided.  If no keys are
     * provided, the entire reference store will be returned.
     *
     * @param segments - The keys to look up. For example, ("foo", "bar", "baz")
     *                   will retrieve the value of this.#all.foo.bar.baz.
     *
     * @returns The value found at given key(s)
     *
     * @throws Error
     * If the provided keys do not exist in the reference object hierarchy.
     */
    lookupByKeys(...segments: string[]): JsonValue {
        const usedSegments = ["<refs>"];

        let location: JsonValue = this.#all;

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

    /**
     * Parse a string which may contain reference notation and replace all ref
     * addresses found with their corresponding values.
     *
     * @param input - The input string to parse
     *
     * @returns The parsed input string
     */
    parse(input: string): string {
        const matches = input.match(new RegExp(refNotation, "g"));

        if (!matches) {
            return input;
        }

        let parsed = input;

        for (const ref of matches) {
            const val = this.lookupByAddress(ref.slice(2, -1));

            parsed = parsed.replace(ref, `${val}`);
        }

        return parsed;
    }

    /**
     * Set a reference value by its dot notation address. If the address
     * already exists, it will be overwritten.
     *
     * @param address - The address to look up. For example, ("foo.bar.baz")
     *                  will retrieve the value of this.#all.foo.bar.baz.
     * @param value   - The value to set at the given address.
     */
    setRefByAddress(address: string, value: JsonObject | JsonValue): void {
        const keys    = address.split(".");
        const lastKey = keys.pop();
        const refObj  = {};

        let curObj = refObj;

        keys.forEach((key) => {
            curObj[key] = {};
            curObj = curObj[key];
        });

        curObj[lastKey] = value;

        this.add(refObj);
    }
}
