import { QuickRef } from "./quick-ref";

describe("QuickRef", () => {
    it("initializes refs from a single reference object param", () => {
        const quickRef = new QuickRef({ "a": 1 });

        expect("a" in quickRef.refs).toBe(true);
        expect(quickRef.refs.a).toBe(1);
    });

    it("initializes refs from multiple, non-overlapping reference object params", () => {
        const inputs = [{ "a": 1 }, { "b": 2 }],
            quickRef = new QuickRef(...inputs);

        expect("a" in quickRef.refs).toBe(true);
        expect(quickRef.refs.a).toBe(1);
        expect("b" in quickRef.refs).toBe(true);
        expect(quickRef.refs.b).toBe(2);
    });

    it("initializes refs from multiple, overlapping reference object params", () => {
        const inputs = [{ "a": { "b": 1 } }, { "a": { "c": 2 } }],
            quickRef = new QuickRef(...inputs);

        expect("a" in quickRef.refs).toBe(true);
        expect("b" in quickRef.refs.a).toBe(true);
        expect(quickRef.refs.a.b).toBe(1);
        expect("c" in quickRef.refs.a).toBe(true);
        expect(quickRef.refs.a.c).toBe(2);
    });

    it("initializes refs from multiple, conflicting reference object params", () => {
        const inputs = [{ "a": 1 }, { "a": 2 }],
            quickRef = new QuickRef(...inputs);

        expect("a" in quickRef.refs).toBe(true);
        expect(quickRef.refs.a).toBe(2);
    });

    it("allows read-only access to refs", () => {
        const quickRef = new QuickRef();

        expect(quickRef.refs).toBeTruthy();
        expect(() => (quickRef.refs = {})).toThrow();
    });

    it("adds reference objects after initialization", () => {
        const inputs = [{ "a": 1 }, { "b": 2 }],
            quickRef = new QuickRef(inputs[0]);

        expect("a" in quickRef.refs).toBe(true);
        expect(quickRef.refs.a).toBe(1);

        quickRef.add(inputs[1]);

        expect("a" in quickRef.refs).toBe(true);
        expect(quickRef.refs.a).toBe(1);
        expect("b" in quickRef.refs).toBe(true);
        expect(quickRef.refs.b).toBe(2);
    });

    it("looks up refs with valid addresses", () => {
        const quickRef = new QuickRef({ "a": { "b": { "c": 1 } } });

        expect(quickRef.lookup("a", "b", "c")).toBe(1);
    });

    it("throws for refs with invalid addresses", () => {
        const quickRef = new QuickRef({ "a": { "b": 1 } });

        expect(() => quickRef.lookup("a", "b", "c")).toThrow();
    });
});
