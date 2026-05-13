/**
 * Param Types Module
 *
 * Cucumber parameter type definitions for all custom params used by this
 * package's step definitions.
 */

import { defineParamType } from "@specify-bdd/specify";

import { parseBrowserName } from "@/lib/browser_names.js";

export function register(): void {
    defineParamType({
        "name":           "browserName",
        "regexp":         /[a-z]+/,
        "transformer":    parseBrowserName,
        "useForSnippets": false,
    });

    defineParamType({
        "name":        "url",
        "regexp":      /[^\s]+/,
        "transformer": (value: string) => new URL(value),
    });
}
