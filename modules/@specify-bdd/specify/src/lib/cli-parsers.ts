import { InvalidOptionArgumentError } from "commander";

/**
 * Parses the value of the `--parallel` CLI option.
 *
 * @param value - The value provided by the user.
 *
 * @returns The parsed value as a positive integer.
 *
 * @throws InvalidOptionArgumentError
 * If the value is not a positive integer.
 */
export function parseParallelOption(value: string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed < 1) {
        throw new InvalidOptionArgumentError("\n<number_of_workers> must be a positive integer.");
    }

    return parsed;
}
