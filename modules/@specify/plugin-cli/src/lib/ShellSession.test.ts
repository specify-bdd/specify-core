import { spawn } from "node:child_process";
import { Writable } from "stream";
import { ShellSession } from "./ShellSession";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

jest.mock("node:child_process");

describe("ShellSession", () => {
    let mockChildProcess: ChildProcessWithoutNullStreams;

    beforeEach(() => {
        mockChildProcess = {
            "kill": jest.fn(),
            "on": jest.fn(),
            "stderr": new Writable(),
            "stdin": { "write": jest.fn() } as unknown as NodeJS.WritableStream,
            "stdout": new Writable(),
        } as unknown as ChildProcessWithoutNullStreams;

        jest.mocked(spawn).mockReturnValue(mockChildProcess);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("spawns a shell process on creation", () => {
        new ShellSession();

        expect(spawn).toHaveBeenCalledWith("sh", { "shell": true });
    });

    it("overrides PATH if provided", () => {
        const customPath = "/test/path";

        new ShellSession(customPath);

        expect(spawn).toHaveBeenCalledWith(
            "sh",
            expect.objectContaining({
                "shell": true,
                "env": expect.objectContaining({ "PATH": customPath }),
            }),
        );
    });

    it("writes a command to stdin with an appended newline", () => {
        const command = "echo test";

        new ShellSession().write(command);

        expect(mockChildProcess.stdin.write).toHaveBeenCalledWith(
            `${command}\n`,
        );
    });

    it("calls kill() on the child process", () => {
        new ShellSession().kill();

        expect(mockChildProcess.kill).toHaveBeenCalled();
    });

    it("registers onClose listener", () => {
        const callback = jest.fn();

        new ShellSession().onClose(callback);

        expect(mockChildProcess.on).toHaveBeenCalledWith("close", callback);
    });

    it("registers onOutput listener to stdout", () => {
        const callback = jest.fn();
        const mockData = Buffer.from("test output");

        new ShellSession().onOutput(callback);
        mockChildProcess.stdout.emit("data", mockData);

        expect(callback).toHaveBeenCalledWith(mockData.toString());
    });

    it("registers onError listener to stderr", () => {
        const callback = jest.fn();
        const mockData = Buffer.from("error occurred");

        new ShellSession().onError(callback);
        mockChildProcess.stderr.emit("data", mockData);

        expect(callback).toHaveBeenCalledWith(mockData.toString());
    });
});
