import { spawn    } from "node:child_process";
import psList       from "ps-list";
import { Writable } from "stream";
import kill         from "tree-kill";
import { vi       } from "vitest";

import { ShellSession } from "../ShellSession";

import type { ChildProcessWithoutNullStreams } from "node:child_process";

vi.mock("node:child_process");
vi.mock("ps-list");
vi.mock("tree-kill");

describe("ShellSession", () => {
    let mockChildProcess: ChildProcessWithoutNullStreams;

    beforeEach(() => {
        mockChildProcess = {
            "kill":   vi.fn(),
            "on":     vi.fn(),
            "pid":    123,
            "stderr": new Writable(),
            "stdin":  { "write": vi.fn() } as unknown as NodeJS.WritableStream,
            "stdout": new Writable(),
        } as unknown as ChildProcessWithoutNullStreams;

        vi.mocked(spawn).mockReturnValue(mockChildProcess);
    });

    afterEach(() => {
        vi.clearAllMocks();
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
                "env":   expect.objectContaining({ "PATH": customPath }),
            }),
        );
    });

    it("writes a command to stdin with an appended newline", () => {
        const command = "echo test";

        new ShellSession().write(command);

        expect(mockChildProcess.stdin.write).toHaveBeenCalledWith(`${command}\n`);
    });

    describe("killCommand()", () => {
        it("calls tree-kill with the command pid and default signal when using killCommand()", async () => {
            vi.mocked(psList).mockResolvedValueOnce([
                { "pid": 123, "ppid": 1, "name": "session" },
                { "pid": 456, "ppid": 123, "name": "sh" },
                { "pid": 789, "ppid": 456, "name": "user command" },
                { "pid": 0, "ppid": 789, "name": "user sub-command" },
            ]);

            await new ShellSession().killCommand();

            expect(kill).toHaveBeenCalledWith(789, "SIGTERM");
        });
    });

    describe("killSession()", () => {
        it("calls tree-kill with the session pid and default signal when using killSession()", () => {
            new ShellSession().killSession();

            expect(kill).toHaveBeenCalledWith(mockChildProcess.pid, "SIGTERM");
        });
    });

    it("registers onClose listener", () => {
        const callback = vi.fn();

        new ShellSession().onClose(callback);

        expect(mockChildProcess.on).toHaveBeenCalledWith("close", callback);
    });

    it("registers onOutput listener to stdout", () => {
        const callback = vi.fn();
        const mockData = Buffer.from("test output");

        new ShellSession().onOutput(callback);
        mockChildProcess.stdout.emit("data", mockData);

        expect(callback).toHaveBeenCalledWith(mockData.toString());
    });

    it("registers onError listener to stderr", () => {
        const callback = vi.fn();
        const mockData = Buffer.from("error occurred");

        new ShellSession().onError(callback);
        mockChildProcess.stderr.emit("data", mockData);

        expect(callback).toHaveBeenCalledWith(mockData.toString());
    });
});
