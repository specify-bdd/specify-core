import { describe, expect, it } from "vitest";

import { parseBrowserName } from "@/lib/browser_names.js";

describe("{browserName} param type", () => {
    describe("transformer", () => {
        it.each(["chrome", "edge", "firefox", "safari"])(
            "accepts '%s' as a valid browser name",
            (name) => {
                expect(parseBrowserName(name)).toBe(name);
            },
        );

        it("throws for an unrecognized browser name", () => {
            expect(() => parseBrowserName("ie")).toThrow(`Unrecognized browser name: "ie".`);
        });
    });
});
