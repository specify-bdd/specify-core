import { spawn } from "node:child_process";

import type {
    ChildProcessWithoutNullStreams,
    SpawnOptions,
} from "node:child_process";
import type { SystemIOSession } from "./SystemIOSession";

export class ShellSession implements SystemIOSession {
    private childProcess: ChildProcessWithoutNullStreams;

    constructor(userPath?: string) {
        const options: SpawnOptions = {
            "shell": true,
        };

        if (userPath) {
            options.env = {
                ...process.env,
                "PATH": userPath,
            };
        }

        this.childProcess = spawn("sh", options);
    }

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

    write(command: string): void {
        this.childProcess.stdin.write(`${command}\n`);
    }
}
