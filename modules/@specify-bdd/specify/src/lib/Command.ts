/**
 * Command class module
 *
 * The abstract base class for all Specify Commands.
 */

import merge              from "deepmerge";
import { serializeError } from "serialize-error";

import type { JsonObject, JsonValue } from "type-fest";

export const COMMAND_DEFAULT_OPTS: CommandOptions = {
    "debug":   false,
    "logPath": `./specify-log-${Date.now()}.json`,
};

export interface CommandOptions {
    debug?: boolean;
    logPath?: string;
}

export interface CommandResult {
    ok: boolean;
    status: CommandResultStatus;
    error?: JsonObject;
    result?: JsonValue;
    debug?: CommandResultDebugInfo;
}

export interface CommandResultDebugInfo {
    args?: object;
}

export enum CommandResultStatus {
    success,
    failure,
    error,
}

export abstract class Command {
    /**
     * Output debug info for this command.
     */
    debug: boolean;

    /**
     * The file system path to write log output to.
     */
    logPath: string;

    /**
     * Store user args and options data.
     *
     * @param userOpts - User-supplied options
     */
    constructor(userOpts: CommandOptions) {
        const mergedOpts = merge.all([{}, COMMAND_DEFAULT_OPTS, userOpts]) as CommandOptions;

        this.debug = mergedOpts.debug;
        this.logPath = mergedOpts.logPath;
    }

    /**
     * Execute the Command.  This method should be overridden by child
     * classes, or it will just return an error result.
     *
     * @param userArgs - User-supplied arguments
     *
     * @returns The Command result
     */
    async execute(userArgs): Promise<CommandResult> {
        const res: CommandResult = {
            "ok":     false,
            "status": CommandResultStatus.error,
            "error":  serializeError(new Error("Base class Command should not be executed.")),
        };

        if (this.debug) {
            res.debug = { "args": userArgs };
        }

        return res;
    }
}
