/**
 * SessionManager Module
 *
 * Provides an interface for executing interactive shell commands via
 * ISystemIOSession. Commands are tracked with delimiters and expose
 * output and status code results.
 */

import assert         from "node:assert/strict";
import { randomUUID } from "node:crypto";

import type { ISystemIOSession } from "@/interfaces/ISystemIOSession";

/**
 * Internal structure used to identify and match command boundaries in the
 * session output.
 */
interface Delimiter {
    command: string;
    regexp: RegExp;
    uuid: string;
}

/**
 * The metadata for a managed session
 */
interface SessionMeta {
    commandResolve?: () => void;
    curCommand?: string;
    delimiter?: Delimiter;
    exitCode?: number;
    name?: string;
    output?: string;
    session: ISystemIOSession;
}

/**
 * Session Manager
 *
 * Manages the lifecycle of a system process session. Ensures only one command
 * runs at a time, and tracks command output and exit status.
 */
export class SessionManager {
    /**
     * The currently active session
     */
    #activeSession: SessionMeta;

    /**
     * The sessions this class is managing
     */
    #sessions: SessionMeta[] = [];

    /**
     * The exit code marker used in delimiter strings
     */
    static #exitCodeKey = "EXIT_CODE";

    /**
     * The managed session which is currently active
     */
    get activeSession(): SessionMeta {
        return this.#activeSession;
    }

    /**
     * The numeric exit code of the active session's last completed command.
     */
    get exitCode(): number {
        return this.#activeSession.exitCode;
    }

    /**
     * The output from the active session's last executed command. Whitespace is
     * trimmed from both ends.
     */
    get output(): string {
        return this.#activeSession.output?.trim();
    }

    /**
     * The list of managed sessions
     */
    get sessions(): SessionMeta[] {
        return this.#sessions;
    }

    /**
     * Adds a new managed session.
     *
     * @param session  - The session to manage
     * @param name     - The name of the session, for easy reference (optional)
     * @param activate - Activate the new session
     */
    addSession(session: ISystemIOSession, name: string, activate: boolean = true): SessionMeta {
        const sessionMeta: SessionMeta = { name, session };

        this.#sessions.push(sessionMeta);

        // session.onOutput(this.#processOutput.bind(this));
        session.onOutput((output) => {
            this.#processOutput(output, sessionMeta);
        });

        // activate this session if instructed or if there is no current active session
        if (activate || !this.#activeSession) {
            this.#activeSession = sessionMeta;
        }

        return sessionMeta;
    }

    /**
     * Gracefully terminates a managed session. Resolves once the session is
     * fully closed.
     *
     * @param sessionMeta - The session to kill (optional); defaults to the
     *                      active session if omitted
     */
    async kill(sessionMeta: SessionMeta): Promise<void> {
        return new Promise((resolve) => {
            sessionMeta ??= this.#activeSession;

            this.removeSession(sessionMeta);

            sessionMeta.session.onClose(resolve);
            sessionMeta.session.kill();
        });
    }

    /**
     * Gracefully terminate all managed sessions.  Resolves once all sessions
     * are fully closed.
     * 
     * @remarks
     * It wouldn't be too hard to refactor this to make it kill all sessions in 
     * parallel, but doing so could produce unpredictable results in the array 
     * manipulation logic of removeSession, which each kill invokes.
     */
    async killAll(): Promise<void> {
        // return Promise.all(this.#sessions.map((sessionMeta) => this.kill(sessionMeta)));
        for (const sessionMeta of this.#sessions) {
            await this.kill(sessionMeta);
        }
    }

    /**
     * Remove a managed session.
     *
     * @param sessionMeta - The session to remove (optional)
     */
    removeSession(sessionMeta: SessionMeta): void {
        sessionMeta ??= this.#activeSession;

        const index = this.#sessions.indexOf(sessionMeta);

        this.#sessions.splice(index, 1);

        if (this.#activeSession === sessionMeta) {
            const prevIndex = index === 0 ? this.#sessions.length - 1 : index - 1;

            this.#activeSession = this.#sessions[prevIndex];
        }
    }

    /**
     * Executes a single command within a managed session.
     *
     * Only one command may be activeat a time in any given session. Output and 
     * status code are available via `output` and `exitCode` once resolved.
     *
     * @remarks
     * Multiple commands can be chained in a single command string
     * with "&" or ";". Ex: `echo first;echo second`
     *
     * @param command     - The command to execute
     * @param sessionMeta - The session in which to execute the command
     *
     * @throws {@link AssertionError}
     * If another command is already in progress
     */
    async run(command: string, sessionMeta: SessionMeta): Promise<void> {
        sessionMeta ??= this.#activeSession;

        assert.ok(
            !sessionMeta.commandResolve,
            `A command is already running: ${sessionMeta.curCommand}`,
        );

        sessionMeta.curCommand = command;
        sessionMeta.delimiter = this.#createDelimiter();
        sessionMeta.output = "";

        return new Promise((resolve) => {
            sessionMeta.commandResolve = resolve;
            sessionMeta.session.write(command + sessionMeta.delimiter.command);
        });
    }

    /**
     * Generates a unique delimiter command and matching regular expression.
     *
     * @returns the new delimiter
     */
    #createDelimiter(): Delimiter {
        const uuid   = randomUUID(); // used to prevent false delimits
        const prefix = "SPECIFY";

        return {
            "command": `;echo "${prefix} ${SessionManager.#exitCodeKey}=$? UUID=${uuid}"`,
            "regexp":  new RegExp(`${prefix} ${SessionManager.#exitCodeKey}=(\\d+) UUID=${uuid}`),
            uuid,
        };
    }

    /**
     * Extracts the value of the key from the output.
     *
     * @param output     - the session output to search
     * @param key        - the key to find the value of
     * @param parseAsInt - whether the found value should be parsed as an int
     *
     * @throws If the key/value pair is not found
     */
    #extractKeyedValue(output: string, key: string, parseAsInt?: boolean): string | number {
        const match = output.match(new RegExp(`${key}=${parseAsInt ? "(\\d+)" : "(\\w+)"}`));

        assert.ok(match, `Output does not contain a value for "${key}"`);

        return parseAsInt ? parseInt(match[1], 10) : match[1];
    }

    /**
     * Handles raw output received from the session.
     *
     * If the delimiter is found in the output, the command is considered
     * complete and its status code is recorded.
     *
     * @param output      - The unmodified session output
     * @param sessionMeta - The session to process output for (optional)
     */
    #processOutput(output: string, sessionMeta: SessionMeta): void {
        sessionMeta ??= this.#activeSession;

        sessionMeta.output += output.replace(sessionMeta.delimiter.regexp, "");

        if (output.includes(sessionMeta.delimiter.uuid)) {
            sessionMeta.exitCode = this.#extractKeyedValue(
                output,
                SessionManager.#exitCodeKey,
                true,
            ) as number;

            this.#resolveRun(sessionMeta);
        }
    }

    /**
     * Resolves the running command's promise.
     *
     * @param sessionMeta - The session for the running command (optional)
     */
    #resolveRun(sessionMeta: SessionMeta): void {
        sessionMeta ??= this.#activeSession;

        const resolve = sessionMeta.commandResolve;

        sessionMeta.commandResolve = null;

        resolve();
    }
}
