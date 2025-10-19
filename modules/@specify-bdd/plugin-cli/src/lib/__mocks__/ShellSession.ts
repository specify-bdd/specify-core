import { vi } from "vitest";
import assert from "node:assert/strict";
import util   from "node:util";

export class ShellSession {
    #curCommand: string;
    #closeCallbacks: (() => void)[] = [];
    #errorCallbacks: ((data: string) => void)[] = [];
    #outputCallbacks: ((data: string) => void)[] = [];

    emitClose = vi.fn(() => {
        this.#closeCallbacks.forEach((cb) => cb());
    });

    emitDelimiter = vi.fn((statusCode: number, cwd?: string, malformed?: boolean) => {
        const match = this.#curCommand.match(/;printf '([^']+)' "[^"]+" "[^"]+"$/);

        let delimiter: string;

        assert.ok(match, "Delimiter not found in command!");

        if (malformed) {
            delimiter = match[1].replace(/"%d"/, "%d"); // unquote the number format specifier to break the JSON
        } else {
            delimiter = util.format(match[1], statusCode.toString(), cwd);
        }

        this.emitOutput(delimiter);
    });

    emitError = vi.fn((err: string) => {
        this.#errorCallbacks.forEach((cb) => cb(err + "\n"));
    });

    emitOutput = vi.fn((output: string) => {
        this.#outputCallbacks.forEach((cb) => cb(output + "\n"));
    });

    killCommand = vi.fn();
    killSession = vi.fn();

    onClose = vi.fn((callback: () => void) => this.#closeCallbacks.push(callback));

    onError = vi.fn((callback: () => void) => this.#errorCallbacks.push(callback));

    onOutput = vi.fn((callback: () => void) => this.#outputCallbacks.push(callback));

    write = vi.fn((command: string) => {
        this.#curCommand = command;
    });
}
