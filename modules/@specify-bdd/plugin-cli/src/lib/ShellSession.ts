/**
 * ShellSession Module
 *
 * Wrapper for a Node child process, spawned using the system's `sh` binary.
 * Handles communication with the system via the child process' main IO methods.
 */

import { spawn } from "node:child_process";
import psList    from "ps-list";
import kill      from "tree-kill";

import type { ChildProcessWithoutNullStreams, SpawnOptions } from "node:child_process";

import type { SystemIOSession } from "@/interfaces/SystemIOSession";

export class ShellSession implements SystemIOSession {
    #childProcess: ChildProcessWithoutNullStreams;

    /**
     * Creates a new interactive shell session.
     *
     * @remarks
     * If `userPath` is provided, it will override the default PATH
     * environment variable for this session.
     *
     * @param shellType - The type of shell to spawn (`sh`, `bash`, etc.)
     * @param options   - The options to use with ChildProcess.spawn
     */
    constructor(shellType: string = "sh", options: SpawnOptions = {}) {
        options.shell ??= true;

        this.#childProcess = spawn(shellType, options);
    }

    /**
     * Gracefully terminates the current command process.
     *
     * @param signal - The system signal to pass to kill()
     */
    async killCommand(signal: string = "SIGTERM"): Promise<void> {
        const processes      = await psList();
        const subProcess     = processes.find((proc) => proc.ppid === this.#childProcess.pid);
        const commandProcess = processes.find((proc) => proc.ppid === subProcess.pid);

        kill(commandProcess.pid, signal);
    }

    /**
     * Gracefully terminates the shell session.
     *
     * @param signal - The system signal to pass to kill()
     */
    killSession(signal: string = "SIGTERM"): void {
        kill(this.#childProcess.pid, signal);
    }

    /**
     * Registers a callback to be invoked when the shell session closes.
     *
     * @param callback - function to call when the shell session ends
     */
    onClose(callback: () => void): void {
        this.#childProcess.on("close", callback);
    }

    /**
     * Registers a callback to handle error output from the shell session.
     *
     * @param callback - function that receives error data as a string
     */
    onError(callback: (data: string) => void): void {
        this.#childProcess.stderr.on("data", (data: Buffer) => callback(data.toString("utf8")));
    }

    /**
     * Registers a callback to handle standard output from the shell session.
     *
     * @param callback - function that receives output data as a string.
     */
    onOutput(callback: (data: string) => void): void {
        this.#childProcess.stdout.on("data", (data: Buffer) => callback(data.toString("utf8")));
    }

    /**
     * Writes input to the shell session's stdin. Also appends a newline
     * to immediately run the input as a command by default.
     *
     * @param input         - the input to write.
     * @param appendNewline - simulate a user pressing the "enter" key on their keyboard
     */
    write(input: string, appendNewline: boolean = true): void {
        const endOfLine = appendNewline ? "\n" : "";

        this.#childProcess.stdin.write(`${input}${endOfLine}`);
    }
}
