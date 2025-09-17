import { QuickRef } from "../QuickRef";

describe("QuickRef", () => {
    describe("constructor", () => {
        describe("initializes refs from...", () => {
            it("a single reference object param", () => {
                const input    = { "a": 1 };
                const quickRef = new QuickRef(input);

                expect(quickRef.all).toEqual(input);
            });

            it("multiple, non-overlapping reference object params", () => {
                const inputs   = [{ "a": 1 }, { "b": 2 }];
                const quickRef = new QuickRef(...inputs);

                expect(quickRef.all).toEqual({ "a": 1, "b": 2 });
            });

            it("multiple, overlapping reference object params", () => {
                const inputs   = [{ "a": { "b": 1 } }, { "a": { "c": 2 } }];
                const quickRef = new QuickRef(...inputs);

                expect(quickRef.all).toEqual({ "a": { "b": 1, "c": 2 } });
            });

            it("multiple, conflicting reference object params", () => {
                const inputs   = [{ "a": 1 }, { "a": 2 }];
                const quickRef = new QuickRef(...inputs);

                expect(quickRef.all).toEqual({ "a": 2 });
            });

            it("no params", () => {
                const quickRef = new QuickRef();

                expect(quickRef.all).toEqual({});
            });
        });
    });

    describe("refs", () => {
        it("allows read-only access to refs", () => {
            const quickRef = new QuickRef();

            expect(quickRef.all).toEqual({});

            // @ts-expect-error - Testing read-only access
            expect(() => (quickRef.all = {})).toThrow();
        });
    });

    describe("add()", () => {
        it("adds reference objects after initialization", () => {
            const quickRef = new QuickRef({ "a": 1 });

            quickRef.add({ "b": 2 });

            expect(quickRef.all).toEqual({ "a": 1, "b": 2 });
        });

        it("does nothing when adding nothing", () => {
            const input    = { "a": 1 };
            const quickRef = new QuickRef(input);

            quickRef.add();

            expect(quickRef.all).toEqual(input);
        });

        it("overwrites arrays at the same address", () => {
            const quickRef = new QuickRef({ "a": [1] });

            quickRef.add({ "a": [2] });

            expect(quickRef.all).toEqual({ "a": [2] });
        });
    });

    describe("lookupByAddress()", () => {
        describe("looks up refs with...", () => {
            it("a valid single key", () => {
                const quickRef = new QuickRef({ "a": 1 });

                expect(quickRef.lookupByAddress("a")).toBe(1);
            });

            it("a valid key chain", () => {
                const quickRef = new QuickRef({ "a": { "b": { "c": 1 } } });

                expect(quickRef.lookupByAddress("a.b.c")).toBe(1);
            });

            it("no key", () => {
                const input    = { "a": 1 };
                const quickRef = new QuickRef(input);

                expect(quickRef.lookupByAddress()).toEqual(input);
            });
        });

        describe("throws for ref lookups with...", () => {
            it("an invalid key chain", () => {
                const quickRef = new QuickRef({ "a": { "b": 1 } });

                expect(() => quickRef.lookupByAddress("a.b.c")).toThrow(/Invalid address/);
            });
        });
    });

    describe("lookupByKeys()", () => {
        describe("looks up refs with...", () => {
            it("a valid single key", () => {
                const quickRef = new QuickRef({ "a": 1 });

                expect(quickRef.lookupByKeys("a")).toBe(1);
            });

            it("a valid key chain", () => {
                const quickRef = new QuickRef({ "a": { "b": { "c": 1 } } });

                expect(quickRef.lookupByKeys("a", "b", "c")).toBe(1);
            });

            it("no key", () => {
                const input    = { "a": 1 };
                const quickRef = new QuickRef(input);

                expect(quickRef.lookupByKeys()).toEqual(input);
            });
        });

        describe("throws for ref lookups with...", () => {
            it("an invalid key chain", () => {
                const quickRef = new QuickRef({ "a": { "b": 1 } });

                expect(() => quickRef.lookupByKeys("a", "b", "c")).toThrow(/Invalid address/);
            });
        });
    });

    describe("parse()", () => {
        describe("returns a parsed string for...", () => {
            it("input with nothing to look up", () => {
                const quickRef = new QuickRef();
                const expected = "We're all out of Apples.";
                const actual   = quickRef.parse(expected);

                expect(actual).toBe(expected);
            });

            it("input with ref look ups", () => {
                const quickRef = new QuickRef({ "things": { "fruits": { "banana": "Banana" } } });
                const input    = "We're all out of ${things.fruits.banana}s.";
                const expected = "We're all out of Bananas.";
                const actual   = quickRef.parse(input);

                expect(actual).toBe(expected);
            });
        });
    });
});
