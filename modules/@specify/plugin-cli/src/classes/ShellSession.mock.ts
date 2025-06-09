import assert from "node:assert/strict";

import type { ISystemIOSession } from "@/interfaces/ISystemIOSession";

export class ShellSession implements ISystemIOSession {
    #curCommand = "";
    #closeCallbacks: (() => void)[] = [];
    #errorCallbacks: ((str: string) => void)[] = [];
    #outputCallbacks: ((str: string) => void)[] = [];

    emitClose(): void {
        this.#closeCallbacks.forEach((callback) => callback());
    }

    emitDelimiter(statusCode: number, malformed?: boolean): void {
        const match = this.#curCommand.match(/;echo\s"(.+)"$/);

        assert.ok(match, "Delimiter not found in command!");

        const processedDelimiter = match[1].replace(
            /\$\?/,
            malformed ? "badvalue" : statusCode.toString(),
        );

        this.emitOutput(processedDelimiter);
    }

    emitOutput(str: string): void {
        this.#outputCallbacks.forEach((callback) => callback(str + "\n"));
    }

    kill = jest.fn();

    onClose(callback: () => void): void {
        this.#closeCallbacks.push(callback);
    }

    onError(callback: (data: string) => void): void {
        this.#errorCallbacks.push(callback);
    }

    onOutput(callback: (data: string) => void): void {
        this.#outputCallbacks.push(callback);
    }

    write = jest.fn((command: string) => {
        this.#curCommand = command;
    });
}
