import assert from "node:assert/strict";

export class ShellSession {
    #curCommand: string;
    #closeCallbacks: (() => void)[] = [];
    #errorCallbacks: ((data: string) => void)[] = [];
    #outputCallbacks: ((data: string) => void)[] = [];

    emitClose = jest.fn(() => {
        this.#closeCallbacks.forEach((cb) => cb());
    });

    emitDelimiter = jest.fn((statusCode: number, malformed?: boolean) => {
        const match = this.#curCommand.match(/;echo\s"(.+)"$/);

        assert.ok(match, "Delimiter not found in command!");

        const delimiter = match[1].replace(
            /\$\?/,
            malformed ? "badvalue" : statusCode.toString(),
        );

        this.emitOutput(delimiter);
    });

    emitOutput = jest.fn((output: string) => {
        this.#outputCallbacks.forEach((cb) => cb(output + "\n"));
    });

    kill = jest.fn();

    onClose = jest.fn((callback: () => void) =>
        this.#closeCallbacks.push(callback),
    );

    onError = jest.fn((callback: () => void) =>
        this.#errorCallbacks.push(callback),
    );

    onOutput = jest.fn((callback: () => void) =>
        this.#outputCallbacks.push(callback),
    );

    write = jest.fn((command: string) => {
        this.#curCommand = command;
    });
}
