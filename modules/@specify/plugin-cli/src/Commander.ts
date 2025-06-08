import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import type { SystemIOSession } from "./SystemIOSession";

interface Delimiter {
    command: string;
    regexp: RegExp;
    uuid: string;
}

export class Commander {
    #commandResolve: () => void;
    #curCommand = "";
    #delimiter: Delimiter;
    #output = "";
    #session: SystemIOSession;
    #statusCode: number; // the result of the last completed command
    #statusCodeKey = "STATUS_CODE=";

    constructor(session: SystemIOSession) {
        this.#session = session;

        this.#session.onOutput(this.#processOutput.bind(this));
    }

    get output(): string {
        return this.#output.trim();
    }

    get statusCode(): number {
        return this.#statusCode;
    }

    async kill(): Promise<void> {
        return new Promise((resolve) => {
            this.#session.onClose(resolve);
            this.#session.kill();
        });
    }

    async run(command: string): Promise<void> {
        assert.ok(
            !this.#commandResolve,
            `A command is already running: ${this.#curCommand}`,
        );

        this.#curCommand = command;
        this.#delimiter = this.#createDelimiter();
        this.#output = "";

        return new Promise((resolve) => {
            this.#commandResolve = resolve;

            this.#session.write(command + this.#delimiter.command);
        });
    }

    // example command output: SPECIFY STATUS_CODE=127 23db01af-068b-4a3b-9124-09d1f619df4b
    #createDelimiter(): Delimiter {
        const uuid = randomUUID(); // used to prevent false delimits
        const prefix = `SPECIFY ${this.#statusCodeKey}`;

        return {
            "command": `;echo "${prefix}$? UUID=${uuid}"`,
            "regexp": new RegExp(`${prefix}(\\d+) UUID=${uuid}`),
            // "regexp": new RegExp(`${prefix}(\\d+) UUID=${uuid}[\\n]*$`),
            uuid,
        };
    }

    #extractStatusCode(output: string): number {
        assert.match(
            output,
            this.#delimiter.regexp,
            "IO session output missing delimiter!",
        );

        return parseInt(output.match(this.#delimiter.regexp)[1], 10);
    }

    #processOutput(str: string): void {
        // no-op if str only contains delimiter
        this.#output += str.replace(this.#delimiter.regexp, "");

        if (str.includes(this.#delimiter.uuid)) {
            this.#statusCode = this.#extractStatusCode(str);
            this.#resolveRun();
        }
    }

    #resolveRun(): void {
        const resolve = this.#commandResolve;
        this.#commandResolve = null;

        resolve();
    }
}
