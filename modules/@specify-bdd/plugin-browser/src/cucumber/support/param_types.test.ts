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

describe("{url} param type", () => {
    describe("transformer", () => {
        it("returns a URL object with the correct href for a valid URL string", () => {
            const result = new URL("https://example.com/path?q=1");

            expect(result).toBeInstanceOf(URL);
            expect(result.href).toBe("https://example.com/path?q=1");
        });

        it("throws a TypeError for a malformed URL string", () => {
            expect(() => new URL("not-a-url")).toThrow(TypeError);
        });
    });
});
