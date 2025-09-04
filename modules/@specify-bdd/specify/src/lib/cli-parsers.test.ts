import { InvalidOptionArgumentError } from "commander";
import { parseParallelOption        } from "./cli-parsers";

describe("parseParallelOption", () => {
    const error = new InvalidOptionArgumentError(
        "\n<number_of_workers> must be a positive integer.",
    );

    it("parses a valid positive integer string", () => {
        const number = 123;

        expect(parseParallelOption(number.toString())).toBe(number);
    });

    it("throws for zero", () => {
        expect(() => parseParallelOption("0")).toThrow(error);
    });

    it("throws for negative numbers", () => {
        const number = -123;

        expect(() => parseParallelOption(number.toString())).toThrow(error);
    });

    it("throws for non-integer numbers", () => {
        const number = 0.123;

        expect(() => parseParallelOption(number.toString())).toThrow(error);
    });

    it("throws for non-numeric strings", () => {
        expect(() => parseParallelOption("abc")).toThrow(error);
        expect(() => parseParallelOption("")).toThrow(error);
    });

    it("parses a string with leading/trailing whitespace", () => {
        expect(parseParallelOption(" 7 ")).toBe(7);
    });
});
