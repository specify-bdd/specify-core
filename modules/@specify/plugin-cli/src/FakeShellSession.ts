import assert from "node:assert/strict";

import type { SystemIOSession } from "./SystemIOSession";

export class FakeShellSession implements SystemIOSession {
    #curCommand = "";
    #closeCallbacks: (() => void)[] = [];
    #errorCallbacks: ((str: string) => void)[] = [];
    #outputCallbacks: ((str: string) => void)[] = [];

    emitClose() {
        this.#closeCallbacks.forEach((callback) => callback());
    }

    emitDelimiter(statusCode: number): void {
        const match = this.#curCommand.match(/;echo\s"(.+)"$/);

        assert.ok(match, "Delimiter not found in command!");

        const processedDelimiter = match[1].replace(
            /\$\?/,
            statusCode.toString(),
        );

        this.emitOutput(processedDelimiter);
    }

    emitOutput(str: string) {
        this.#outputCallbacks.forEach((callback) => callback(str + "\n"));
    }

    kill = jest.fn();

    onClose(callback: () => void) {
        this.#closeCallbacks.push(callback);
    }

    onError(callback: (data: string) => void) {
        this.#errorCallbacks.push(callback);
    }

    onOutput(callback: (data: string) => void) {
        this.#outputCallbacks.push(callback);
    }

    write = jest.fn((command: string) => {
        this.#curCommand = command;
    });
}
