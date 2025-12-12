/**
 * SessionManager Module
 *
 * Provides an interface for executing interactive shell commands via
 * SystemIOSession. Commands are tracked with delimiters and expose
 * output and exit code results.
 */

import assert         from "node:assert/strict";
import { randomUUID } from "node:crypto";

import type { SystemIOSession } from "@/interfaces/SystemIOSession";

/**
 * A metadata object representing one executed command.
 */
export interface CommandMeta {
    command: string;
    delimiter?: Delimiter;
    exitCode?: number;
    output: OutputMeta[];
    promise?: Promise<CommandMeta>;
    reject?: ((err: Error) => void) | null;
    resolve?: ((cmdMeta: CommandMeta) => void) | null;
    timeEnd?: number;
    timeStart?: number;
}

/**
 * Internal structure used to identify and match command boundaries in the
 * session output.
 */
interface Delimiter {
    command: string;
    prefix: string;
    regexp: RegExp;
    suffix: string;
    uuid: string;
}

/**
 * Internal structure used to form the payload data encoded as JSON in a command
 *  delimiter string.
 */
interface DelimiterPayload {
    cwd: string;
    exitCode: string; // this is initially set with a util.format placeholder (%d) so it must be a string type
    uuid: string;
}

/**
 * A metadata object representing a single chunk of output from a command.
 */
export interface OutputMeta {
    output: string;
    stream: IOStream;
    timestamp: number;
}

/**
 * A metadata object representing a managed session.
 */
export interface SessionMeta {
    commands: CommandMeta[];
    cwd: string;
    name?: string;
    session: SystemIOSession;
}

/**
 * The basic option set common to all options-accepting SessionManager methods.
 */
export interface SessionManagerOptions {
    sessionMeta?: SessionMeta;
}

/**
 * The option set for SessionManager.waitForOutputOptions().
 */
export interface WaitForOutputOptions extends SessionManagerOptions {
    pattern?: RegExp | string;
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
    #activeSession: SessionMeta | null = null;

    /**
     * The sessions this class is managing
     */
    #sessions: SessionMeta[] = [];

    /**
     * The managed session which is currently active
     */
    get activeSession(): SessionMeta {
        return this.#activeSession;
    }

    /**
     * The elapsed time, in milliseconds, of the active session's last completed command.
     */
    get commandElapsedTime(): number {
        return this.commandEndTime - this.commandStartTime;
    }

    /**
     * The end time of the active session's last completed command.
     */
    get commandEndTime(): number {
        return this.#getLastCommand().timeEnd;
    }

    /**
     * The start time of the active session's last completed command.
     */
    get commandStartTime(): number {
        return this.#getLastCommand().timeStart;
    }

    /**
     * The current working directory of the active session.
     */
    get cwd(): string {
        return this.#activeSession?.cwd;
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
    get sessions(): SessionMeta[] {
        return this.#sessions.slice();
    }

    /**
     * Adds a new managed session.
     *
     * @param session  - The session to manage
     * @param name     - The name of the session, for easy reference
     * @param cwd      - The session's current working directory; defaults to
     *                   the manager's CWD
     * @param activate - Activate the new session
     */
    addSession(
        session: SystemIOSession,
        name?: string,
        cwd?: string,
        activate: boolean = true,
    ): SessionMeta {
        cwd ??= this.cwd ?? process.cwd();

        const sessionMeta: SessionMeta = { "commands": [], name, cwd, session };

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
     * Gracefully terminates the command in a managed session. Resolves once the command is killed.
     *
     * @param opts - Options to modify the behavior of killSession()
     */
    async killCommand(opts: SessionManagerOptions = {}, signal: string = "SIGTERM"): Promise<void> {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;

        await sessionMeta.session.killCommand(signal);
    }

    /**
     * Gracefully terminates a managed session. Resolves once the session is
     * fully closed.
     *
     * @param opts - Options to modify the behavior of killSession()
     */
    async killSession(opts: SessionManagerOptions = {}, signal: string = "SIGTERM"): Promise<void> {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;

        return new Promise((resolve) => {
            this.removeSession({ sessionMeta });

            sessionMeta.session.onClose(resolve);
            sessionMeta.session.killSession(signal);
        });
    }

    /**
     * Gracefully terminate all managed sessions.  Resolves once all sessions
     * are fully closed.
     */
    async killAllSessions(): Promise<void> {
        await Promise.all(
            this.#sessions.slice().map((sessionMeta) => this.killSession({ sessionMeta })),
        );

        // ensure race conditions don't leave session records in a weird state
        this.#activeSession = null;
        this.#sessions = [];
    }

    /**
     * Remove a managed session.
     *
     * @param opts - Options to modify the behavior of removeSession()
     */
    removeSession(opts: SessionManagerOptions = {}): void {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;

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
     * @throws AssertionError
     * If another command is already in progress
     */
    run(command: string, opts: SessionManagerOptions = {}): CommandMeta {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;
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
            "timeStart": Date.now(),
        } as CommandMeta;

        newCmdMeta.promise = new Promise((resolve, reject) => {
            newCmdMeta.resolve = resolve;
            newCmdMeta.reject = reject;
            sessionMeta.session.write(`${command}${newCmdMeta.delimiter.command}`);
        });

        sessionMeta.commands.push(newCmdMeta);

        return newCmdMeta;
    }

    /**
     * Switch to the next session in the list.
     *
     * @remarks
     * If there is no next session, the first session in the list is activated.
     */
    switchToNextSession(): void {
        const currentIndex = this.#sessions.indexOf(this.#activeSession);
        const nextIndex    = (currentIndex + 1) % this.#sessions.length;

        this.#activeSession = this.#sessions[nextIndex];
    }

    /**
     * Switch to the session that matches the given selector.
     * 
     * @param selector - The index or name of the session to switch to
     *
     * @throws AssertionError
     * If there is no matching session
     */
    switchToSession(selector: number | string): void {
        const session = typeof selector === "string"
            ? this.#sessions.find((session) => session.name === selector)
            : this.#sessions[selector];
        
        if (!session) {
            const selectorType = typeof selector === "string" ? "name" : "index";
            
            throw new Error(`No session found with ${selectorType}: ${selector}`);
        }

        this.#activeSession = session;
    }

    /**
     * Validate the shell type of the active session.
     * 
     * @param shellType - The expected shell type
     * 
     * @returns Whether its the correct type or not
     */
    async validateShell(shellType: string): Promise<boolean> {
        const phrase = "Current shell is: ";

        this.run(`echo ${phrase}$0`);

        await this.waitForReturn();

        return this.output === phrase + shellType;
    }

    /**
     * Wait for the last command in a managed session to produce output.
     *
     * @param opts - Options to modify the behavior of waitForOutput()
     */
    async waitForOutput(opts: WaitForOutputOptions = {}): Promise<OutputMeta> {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;
        const stream      = opts.stream ?? IOStream.ANY;

        return new Promise((resolve) => {
            this.#callbackOnlyIfOutputMatches(resolve, opts);

            if ([IOStream.STDOUT, IOStream.ANY].includes(stream)) {
                sessionMeta.session.onOutput(() =>
                    this.#callbackOnlyIfOutputMatches(resolve, opts),
                );
            }

            if ([IOStream.STDERR, IOStream.ANY].includes(stream)) {
                sessionMeta.session.onError(() => this.#callbackOnlyIfOutputMatches(resolve, opts));
            }
        });
    }

    /**
     * Wait for the last command in a managed session to return.
     *
     * @param opts - Options to modify the behavior of waitForOutput()
     */
    async waitForReturn(opts: SessionManagerOptions = {}): Promise<CommandMeta> {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;

        return this.#getLastCommand({ sessionMeta }).promise;
    }

    /**
     * Verify whether the last command in a managed session has output matching
     * certain criteria, and then invoke the callback function if so.
     *
     * @param cb   - The callback
     * @param opts - The options specifying matching requirements
     */
    #callbackOnlyIfOutputMatches(
        cb: (value: OutputMeta) => void,
        opts: WaitForOutputOptions = {},
    ): void {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;
        const lastCmdMeta = this.#getLastCommand({ sessionMeta });

        if (lastCmdMeta && this.#hasMatchingOutput(lastCmdMeta, opts)) {
            cb(lastCmdMeta.output.at(-1));
        }
    }

    /**
     * Generates a unique delimiter command and matching regular expression.
     *
     * @returns the new delimiter
     */
    #createDelimiter(): Delimiter {
        const prefix = "SPECIFY DELIM START";
        const suffix = "SPECIFY DELIM END";
        const uuid   = randomUUID(); // used to prevent false delimits

        const payload    = { "exitCode": "%d", "cwd": "%s", uuid } as DelimiterPayload;
        const payloadStr = JSON.stringify(payload);

        return {
            "command": `;printf '${prefix} ${payloadStr} ${suffix}' "$?" "$(pwd)"`, // Windows friendly?
            "regexp":  new RegExp(`${prefix} (.+) ${suffix}`),
            prefix,
            suffix,
            uuid,
        };
    }

    /**
     * Extracts the payload data from output with a command delimiter.
     *
     * @param output    - The output to parse
     * @param delimiter - The delimiter to search for
     *
     * @returns The extracted payload data
     *
     * @throws AssertionError
     * If the output doesn't contain a delimiter.
     *
     * @throws
     * If the output has a delimiter which doesn't include the correct UUID.
     */
    #extractDelimiterPayload(output: string, delimiter: Delimiter): DelimiterPayload {
        const match = output.match(delimiter.regexp);

        assert.ok(match, "Output does not contain a matching delimiter.");

        const payload: DelimiterPayload = JSON.parse(match[1]);

        assert.equal(payload.uuid, delimiter.uuid, "Output delimiter is malformed.");

        return payload;
    }

    /**
     * Get the last command executed for a given managed session
     *
     * @param opts - Options to modify the behavior of #getLastCommand()
     */
    #getLastCommand(opts: SessionManagerOptions = {}): CommandMeta | null {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;

        return sessionMeta?.commands?.at(-1) ?? null;
    }

    /**
     * Test whether any command output satisfies the matching requirements in
     * the opts object.
     *
     * @param cmdMeta - The command to test
     * @param opts    - The options specifying matching requirements
     */
    #hasMatchingOutput(cmdMeta: CommandMeta, opts: WaitForOutputOptions = {}): boolean {
        const pattern = opts.pattern ?? ".+";
        const stream  = opts.stream ?? IOStream.ANY;
        const regexp  = new RegExp(pattern); // pattern may already be a regexp, but this guarantees consistent behavior

        return regexp.test(
            cmdMeta.output
                .filter((outMeta: OutputMeta) => [outMeta.stream, IOStream.ANY].includes(stream))
                .map((outMeta: OutputMeta) => outMeta.output)
                .join(""),
        );
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
    #processOutput(output: string, stream: IOStream, opts: SessionManagerOptions = {}): void {
        const sessionMeta = opts.sessionMeta ?? this.#activeSession;
        const lastCmdMeta = this.#getLastCommand({ sessionMeta });
        const cleanOutput = output.replace(lastCmdMeta.delimiter.regexp, "");
        const timestamp   = Date.now();

        lastCmdMeta.output.push({ "output": cleanOutput, stream, timestamp } as OutputMeta);

        if (output.includes(lastCmdMeta.delimiter.uuid)) {
            lastCmdMeta.timeEnd = timestamp;

            try {
                const payload = this.#extractDelimiterPayload(output, lastCmdMeta.delimiter);

                lastCmdMeta.exitCode = parseInt(payload.exitCode, 10);
                sessionMeta.cwd = payload.cwd;

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
    #rejectRun(cmdMeta: CommandMeta, err: Error): void {
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
    #resolveRun(cmdMeta: CommandMeta): void {
        const resolve = cmdMeta.resolve;

        cmdMeta.resolve = null;
        cmdMeta.reject = null;

        resolve(cmdMeta);
    }
}
