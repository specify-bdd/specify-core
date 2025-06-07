import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";

import type {
    ChildProcessWithoutNullStreams,
    SpawnOptions,
} from "node:child_process";

export class Commander {
    #childProcess: ChildProcessWithoutNullStreams;
    #commandResolve: (value: void | PromiseLike<void>) => void;
    #delimiter: string;
    #output: string;
    // status code for the result of the last completed command
    #statusCode: number;
    #statusCodeKey = "STATUS_CODE=";

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

        this.#childProcess = spawn("sh", options);

        this.#childProcess.stdout.on("data", this.#processOutput.bind(this));
    }

    get output(): string {
        return this.#output;
    }

    get statusCode(): number {
        return this.#statusCode;
    }

    async run(command: string): Promise<void> {
        return new Promise((resolve) => {
            this.#commandResolve = resolve;
            this.#output = "";

            this.#childProcess.stdin.write(this.#delimitCommand(command));
        });
    }

    #delimitCommand(command: string): string {
        // random hash to prevent false delimits
        this.#delimiter = randomUUID();

        // example output: SPECIFY STATUS_CODE=127 23db01af-068b-4a3b-9124-09d1f619df4b
        return command + `; echo "SPECIFY STATUS_CODE=$? ${this.#delimiter}"\n`;
    }

    #processOutput(output: Buffer) {
        const str: string = output.toString("utf8");

        if (str.includes(this.#delimiter)) {
            const matcher = new RegExp(`${this.#statusCodeKey}(\\d+)`);

            this.#statusCode = parseInt(str.match(matcher)[1], 10);

            this.#commandResolve();
        } else {
            this.#output += str;
        }
    }
}
