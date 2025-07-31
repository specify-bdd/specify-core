/**
 * SessionManager Module
 *
 * Provides an interface for executing interactive shell commands via
 * ISystemIOSession. Commands are tracked with delimiters and expose
 * output and exit code results.
 */

import assert         from "node:assert/strict";
import { randomUUID } from "node:crypto";

import type { ISystemIOSession } from "@/interfaces/ISystemIOSession";

/**
 * A metadata object representing one executed command.
 */
export interface ICommandMeta {
    command: string;
    delimiter?: IDelimiter;
    exitCode?: number;
    output: IOutputMeta[];
    promise?: Promise<ICommandMeta>;
    reject?: ((err: Error) => void) | null;
    resolve?: ((cmdMeta: ICommandMeta) => void) | null;
    // timestamp: number;
}

/**
 * Internal structure used to identify and match command boundaries in the
 * session output.
 */
interface IDelimiter {
    command: string;
    regexp: RegExp;
    uuid: string;
}

/**
 * A metadata object representing a single chunk of output from a command.
 */
export interface IOutputMeta {
    output: string;
    stream: IOStream;
    // timestamp: number;
}

/**
 * A metadata object representing a managed session.
 */
export interface ISessionMeta {
    commands: ICommandMeta[];
    name?: string;
    session: ISystemIOSession;
}

/**
 * The basic option set common to all options-accepting SessionMqnager methods.
 */
export interface ISessionManagerOptions {
    sessionMeta?: ISessionMeta;
}

/**
 * The option set for SessionManager.waitForOutputOptions().
 */
export interface IWaitForOutputOptions extends ISessionManagerOptions {
    pattern?: string;
    stream?: IOStream;
}

/**
 * A standard IO stream.
 */
export enum IOStream {
    STDIN, // we aren't likely to use this, but keeping it at index 0 helps us stay consistent with Node.js conventions
    STDOUT,
    STDERR,
    ANY, // in practice, this represents STDOUT+STDERR
}

/**
 * Session Manager
 *
 * Manages the lifecycle of a system process session. Ensures only one command
 * runs at a time, and tracks command output and exit code.
 */
export class SessionManager {
    /**
     * The currently active session
     */
    #activeSession: ISessionMeta | null = null;

    /**
     * The sessions this class is managing
     */
    #sessions: ISessionMeta[] = [];

    /**
     * The exit code marker used in delimiter strings
     */
    static #exitCodeKey = "EXIT_CODE";

    /**
     * The managed session which is currently active
     */
    get activeSession(): ISessionMeta {
        return this.#activeSession;
    }

    /**
     * The numeric exit code of the active session's last completed command.
     */
    get exitCode(): number {
        return this.#getLastCommand()?.exitCode;
    }

    /**
     * The output from the active session's last executed command. Whitespace is
     * trimmed from both ends.
     */
    get output(): string {
        const cmd = this.#getLastCommand();

        if (!cmd) {
            return;
        }

        return cmd.output
            .map((outMeta) => outMeta.output)
            .join("")
            .trim();
    }

    /**
     * The list of managed sessions
     */
    get sessions(): ISessionMeta[] {
        return this.#sessions.slice();
    }

    /**
     * Adds a new managed session.
     *
     * @param session  - The session to manage
     * @param name     - The name of the session, for easy reference
     * @param activate - Activate the new session
     */
    addSession(session: ISystemIOSession, name?: string, activate: boolean = true): ISessionMeta {
        const sessionMeta: ISessionMeta = { "commands": [], name, session };

        this.#sessions.push(sessionMeta);

        session.onOutput((output) => this.#processOutput(output, IOStream.STDOUT, { sessionMeta }));
        session.onError((err) => this.#processOutput(err, IOStream.STDERR, { sessionMeta }));

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
     * @param opts - Options to modify the behavior of kill()
     */
    async kill(opts: ISessionManagerOptions = {}): Promise<void> {
        const sessionMeta = opts.sessionMeta || this.#activeSession;

        return new Promise((resolve) => {
            this.removeSession({ sessionMeta });

            sessionMeta.session.onClose(resolve);
            sessionMeta.session.kill();
        });
    }

    /**
     * Gracefully terminate all managed sessions.  Resolves once all sessions
     * are fully closed.
     */
    async killAll(): Promise<void> {
        await Promise.all(this.#sessions.slice().map((sessionMeta) => this.kill({ sessionMeta })));

        // ensure race conditions don't leave session records in a weird state
        this.#activeSession = null;
        this.#sessions = [];
    }

    /**
     * Remove a managed session.
     *
     * @param opts - Options to modify the behavior of removeSession()
     */
    removeSession(opts: ISessionManagerOptions = {}): void {
        const sessionMeta = opts.sessionMeta || this.#activeSession;

        const index = this.#sessions.indexOf(sessionMeta);

        this.#sessions.splice(index, 1);

        if (this.#activeSession === sessionMeta) {
            const prevIndex = index === 0 ? this.#sessions.length - 1 : index - 1;

            // is the sessions list empty now?
            // if so, unset active session
            // if not, set active session to the previous index
            this.#activeSession = prevIndex < 0 ? null : this.#sessions[prevIndex];
        }
    }

    /**
     * Executes a single command within a managed session.
     *
     * Only one command may be active at a time in any given session. Output and
     * exit code are available via `output` and `exitCode` once resolved.
     *
     * @remarks
     * Multiple commands can be chained in a single command string
     * with "&" or ";". Ex: `echo first;echo second`
     *
     * @param command - The command to execute
     * @param opts    - Options to modify the behavior of run()
     *
     * @throws {@link AssertionError}
     * If another command is already in progress
     */
    run(command: string, opts: ISessionManagerOptions = {}): ICommandMeta {
        const sessionMeta = opts.sessionMeta || this.#activeSession;
        const lastCmdMeta = this.#getLastCommand({ sessionMeta });

        if (lastCmdMeta) {
            assert.ok(
                Object.hasOwn(lastCmdMeta, "exitCode"),
                `A command is already running: ${lastCmdMeta.command}`,
            );
        }

        const newCmdMeta = {
            command,
            "delimiter": this.#createDelimiter(),
            "output":    [],
        } as ICommandMeta;

        newCmdMeta.promise = new Promise((resolve, reject) => {
            newCmdMeta.resolve = resolve;
            newCmdMeta.reject = reject;
            sessionMeta.session.write(`${command}${newCmdMeta.delimiter.command}`);
        });

        sessionMeta.commands.push(newCmdMeta);

        return newCmdMeta;
    }

    /**
     * Wait for the last command in a managed session to produce output.
     *
     * @param opts - Options to modify the behavior of waitForOutput()
     */
    async waitForOutput(opts: IWaitForOutputOptions = {}): Promise<IOutputMeta> {
        const sessionMeta = opts.sessionMeta || this.#activeSession;
        const lastCmdMeta = this.#getLastCommand({ sessionMeta });
        const stream      = opts.stream || IOStream.ANY;

        return new Promise((resolve) => {
            if (this.#hasMatchingOutput(lastCmdMeta, opts)) {
                resolve(lastCmdMeta.output.at(-1));
            }

            if ([IOStream.STDOUT, IOStream.ANY].includes(stream)) {
                sessionMeta.session.onOutput(() => {
                    if (this.#hasMatchingOutput(lastCmdMeta, opts)) {
                        resolve(lastCmdMeta.output.at(-1));
                    }
                });
            }

            if ([IOStream.STDERR, IOStream.ANY].includes(stream)) {
                sessionMeta.session.onError(() => {
                    if (this.#hasMatchingOutput(lastCmdMeta, opts)) {
                        resolve(lastCmdMeta.output.at(-1));
                    }
                });
            }
        });
    }

    /**
     * Wait for the last command in a managed session to return.
     *
     * @param opts - Options to modify the behavior of waitForOutput()
     */
    async waitForReturn(opts: ISessionManagerOptions = {}): Promise<ICommandMeta> {
        const sessionMeta = opts.sessionMeta || this.#activeSession;

        return this.#getLastCommand({ sessionMeta }).promise;
    }

    /**
     * Generates a unique delimiter command and matching regular expression.
     *
     * @returns the new delimiter
     */
    #createDelimiter(): IDelimiter {
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
     * @param output     - The session output to search
     * @param key        - The key to find the value of
     * @param parseAsInt - Whether the found value should be parsed as an int
     *
     * @throws If the key/value pair is not found
     */
    #extractKeyedValue(output: string, key: string, parseAsInt?: boolean): string | number {
        const match = output.match(new RegExp(`${key}=${parseAsInt ? "(\\d+)" : "(\\w+)"}`));

        assert.ok(match, `Output does not contain a value for "${key}"`);

        return parseAsInt ? parseInt(match[1], 10) : match[1];
    }

    /**
     * Get the last command executed for a given managed session
     *
     * @param opts - Options to modify the behavior of #getLastCommand()
     */
    #getLastCommand(opts: ISessionManagerOptions = {}): ICommandMeta {
        const sessionMeta = opts.sessionMeta || this.#activeSession;

        return sessionMeta?.commands?.at(-1);
    }

    /**
     * Test whether any command output satisfies the matching requirements in
     * the opts object.
     *
     * @param cmdMeta - The command to test
     * @param opts    - The options specifying matching requirements
     */
    #hasMatchingOutput(cmdMeta: ICommandMeta, opts: IWaitForOutputOptions = {}) {
        const pattern = opts.pattern || ".*";
        const stream  = opts.stream || IOStream.ANY;
        const regex   = new RegExp(pattern);

        return cmdMeta.output.some((outMeta: IOutputMeta) => {
            if ([outMeta.stream, IOStream.ANY].includes(stream)) {
                return regex.test(outMeta.output);
            }

            return false;
        });
    }

    /**
     * Handles raw output received from the session.
     *
     * If the delimiter is found in the output, the command is considered
     * complete and its exit code is recorded.
     *
     * @param output - The unmodified session output
     * @param stream - The stream this output arrived on
     * @param opts   - Options to modify the behavior of #processOutput()
     */
    #processOutput(output: string, stream: IOStream, opts: ISessionManagerOptions = {}): void {
        const sessionMeta = opts.sessionMeta || this.#activeSession;
        const lastCmdMeta = this.#getLastCommand({ sessionMeta });
        const cleanOutput = output.replace(lastCmdMeta.delimiter.regexp, "");
        // const timestamp   = Date.now();

        lastCmdMeta.output.push({ "output": cleanOutput, stream /*timestamp*/ } as IOutputMeta);

        if (output.includes(lastCmdMeta.delimiter.uuid)) {
            try {
                lastCmdMeta.exitCode = this.#extractKeyedValue(
                    output,
                    SessionManager.#exitCodeKey,
                    true,
                ) as number;

                this.#resolveRun(lastCmdMeta);
            } catch (err) {
                this.#rejectRun(lastCmdMeta, err);
            }
        }
    }

    /**
     * Rejects a running command's promise.
     *
     * @param cmdMeta - The running command
     * @param err     - The reason for the rejection
     */
    #rejectRun(cmdMeta: ICommandMeta, err: Error): void {
        const reject = cmdMeta.reject;

        cmdMeta.resolve = null;
        cmdMeta.reject = null;

        reject(err);
    }

    /**
     * Resolves a running command's promise.
     *
     * @param commandMeta - The running command
     */
    #resolveRun(cmdMeta: ICommandMeta): void {
        const resolve = cmdMeta.resolve;

        cmdMeta.resolve = null;
        cmdMeta.reject = null;

        resolve(cmdMeta);
    }
}
