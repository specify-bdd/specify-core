import assert from "node:assert/strict";

const shellSession = jest.fn().mockImplementation(() => {
    const closeCallbacks: (() => void)[] = [];
    const errorCallbacks: ((data: string) => void)[] = [];
    const outputCallbacks: ((data: string) => void)[] = [];

    let curCommand = "";

    const emitClose = jest.fn(() => {
        closeCallbacks.forEach((cb) => cb());
    });

    const emitOutput = jest.fn((output: string) => {
        outputCallbacks.forEach((cb) => cb(output + "\n"));
    });

    const emitDelimiter = jest.fn((statusCode: number, malformed?: boolean) => {
        const match = curCommand.match(/;echo\s"(.+)"$/);

        assert.ok(match, "Delimiter not found in command!");

        const delimiter = match[1].replace(
            /\$\?/,
            malformed ? "badvalue" : statusCode.toString(),
        );

        emitOutput(delimiter);
    });

    return {
        emitClose,
        emitOutput,
        emitDelimiter,
        "kill": jest.fn(),
        "onClose": jest.fn((callback: () => void) =>
            closeCallbacks.push(callback),
        ),
        "onError": jest.fn((callback: () => void) =>
            errorCallbacks.push(callback),
        ),
        "onOutput": jest.fn((callback: () => void) =>
            outputCallbacks.push(callback),
        ),
        "write": jest.fn((command: string) => {
            curCommand = command;
        }),
    };
}) as jest.Mock;

export { shellSession as ShellSession };

export type MockShellSession = ReturnType<typeof shellSession>;
