import { InvalidOptionArgumentError } from "commander";

import { parseParallelOption, parseRerunFileOption, parseRetryOption } from "../cli-parsers";

describe("parseParallelOption", () => {
    const error = new InvalidOptionArgumentError(
        "\n<number_of_workers> must be a positive integer.",
    );

    it("parses a valid positive integer string", () => {
        const number = 123;

        expect(parseParallelOption(number.toString())).toBe(number);
    });

    it("throws for invalid input", () => {
        expect(() => parseParallelOption("0")).toThrow(error);
        expect(() => parseParallelOption("-123")).toThrow(error);
        expect(() => parseParallelOption("0.123")).toThrow(error);
        expect(() => parseParallelOption("abc")).toThrow(error);
        expect(() => parseParallelOption("")).toThrow(error);
    });

    it("parses a string with leading/trailing whitespace", () => {
        expect(parseParallelOption(" 7 ")).toBe(7);
    });
});

describe("parseRerunFileOption", () => {
    it("resolves a string into a full path", () => {
        const cwd = process.cwd();

        expect(parseRerunFileOption("test")).toBe(cwd + "/test");
        expect(parseRerunFileOption("/test")).toBe("/test");
        expect(parseRerunFileOption("")).toBe(cwd);
        expect(parseRerunFileOption(".")).toBe(cwd);
        expect(parseRerunFileOption("./test")).toBe(cwd + "/test");
        expect(parseRerunFileOption("test/")).toBe(cwd + "/test");
        expect(parseRerunFileOption("foo/../bar")).toBe(cwd + "/bar");
    });
});

describe("parseRetryOption", () => {
    const error = new InvalidOptionArgumentError(
        "\n<number_of_retries> must be a non-negative integer.",
    );

    it("parses a valid integer string", () => {
        expect(parseRetryOption("123")).toBe(123);
        expect(parseRetryOption("0")).toBe(0);
    });

    it("throws for invalid input", () => {
        expect(() => parseRetryOption("-123")).toThrow(error);
        expect(() => parseRetryOption("0.123")).toThrow(error);
        expect(() => parseRetryOption("abc")).toThrow(error);
        expect(() => parseRetryOption("")).toThrow(error);
    });
});
