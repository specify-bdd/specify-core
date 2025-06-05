import { spawn } from "node:child_process";

import type {
    ChildProcessWithoutNullStreams,
    SpawnOptions,
} from "node:child_process";

export class Commander {
    #cli: ChildProcessWithoutNullStreams;
    // #commandReject: (reason?: any) => void;
    #commandResolve: (value: void | PromiseLike<void>) => void;
    #output: string;
    // status code for the result of the last completed command
    #statusCode: number;

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

        this.#cli = spawn("sh", options);

        this.#cli.stdout.on("data", (data) => this.#processOutput(data));
        // this.#cli.stderr.on("data", (data) => this.#processError(data));
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
            // this.#commandReject = reject;
            this.#output = "";

            this.#cli.stdin.write(`${command};echo "status code: $?"\n`);
            // this.#cli.stdin.write(this.#delimitCommand(command));
        });
    }

    // #delimitCommand(command: string): string {
    //     // random hash to prevent false delimits
    //     this.delimiter =
    //         "__SPECIFY__" + "062185161098465106549846510619801065108";

    //     return command + `; echo "$?${this.delimiter}"\n`;
    // }

    // #processError(error: Buffer) {
    //     console.log(error.toString());
    //     this.#commandReject();
    //     throw error.toString();
    // }

    #processOutput(output: Buffer) {
        const str: string = output.toString();

        // console.log(str);

        if (str.includes("status code: ")) {
            this.#statusCode = parseInt(str.match(/\d+/)[0]);

            this.#commandResolve();
        } else {
            this.#output += str;
        }
    }
}
