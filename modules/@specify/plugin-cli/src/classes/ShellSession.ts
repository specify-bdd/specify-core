/**
 * ShellSession Module
 *
 * Provides a basic interactive shell session over a spawned `sh` process.
 */

import { spawn } from "node:child_process";

import type {
    ChildProcessWithoutNullStreams,
    SpawnOptions,
} from "node:child_process";
import type { ISystemIOSession } from "@/interfaces/ISystemIOSession";

/**
 * Wraps an interactive `sh` process for use with the Commander interface.
 *
 * Supports writing commands to stdin, reading stdout, and handling process
 * closure or errors.
 */
export class ShellSession implements ISystemIOSession {
    private childProcess: ChildProcessWithoutNullStreams;

    /**
     * Creates a new shell session using the system `sh` binary.
     *
     * If `userPath` is provided, it will override the default PATH
     * environment variable for this session.
     *
     * @param userPath - PATH to use for the session
     */
    constructor(userPath?: string) {
        const options: SpawnOptions = { "shell": true };

        if (userPath) {
            options.env = {
                ...process.env,
                "PATH": userPath,
            };
        }

        this.childProcess = spawn("sh", options);
    }

    /**
     * Gracefully terminates the shell session.
     */
    kill(): void {
        this.childProcess.kill();
    }

    onClose(callback: () => void): void {
        this.childProcess.on("close", callback);
    }

    onError(callback: (data: string) => void): void {
        this.childProcess.stdout.on("data", (data: Buffer) =>
            callback(data.toString("utf8")),
        );
    }

    onOutput(callback: (data: string) => void): void {
        this.childProcess.stdout.on("data", (data: Buffer) =>
            callback(data.toString("utf8")),
        );
    }

    /**
     * Writes (runs) a command to the shell session's stdin.
     *
     * @param command - the command to execute. `\n` is appended to simulate a
     *                  user pressing the "enter" key on their keyboard
     */
    write(command: string): void {
        this.childProcess.stdin.write(`${command}\n`);
    }
}
