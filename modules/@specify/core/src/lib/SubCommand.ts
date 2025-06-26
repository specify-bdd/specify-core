/**
 * SubCommand class module
 *
 * The abstract base class for all Specify subcommands.
 */

import { serializeError } from "serialize-error";

import merge from "deepmerge";

import type { ParsedArgs } from "minimist";
import type { JsonObject, JsonValue } from "type-fest";

export const DEFAULT_OPTS: SubCommandOptions = {
    "debug": false,
    "logPath": `./specify-log-${Date.now()}.json`,
}

export interface SubCommandOptions {
    debug: boolean,
    logPath: string,
}

export interface SubCommandResult {
    ok: boolean,
    status: SubCommandResultStatus,
    error?: JsonObject,
    result?: JsonValue,
    debug?: JsonObject,
}

export enum SubCommandResultStatus {
    success,
    failure,
    error
}

export class SubCommand {

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
    constructor(userOpts: Partial<SubCommandOptions>) {
        const mergedOpts = merge.all([ {}, DEFAULT_OPTS, userOpts ]) as SubCommandOptions;

        this.debug   = mergedOpts.debug;
        this.logPath = mergedOpts.logPath;
    }

    /**
     * Execute the subcommand.  This method should be overridden by child 
     * classes, or it will just return an error result.
     *
     * @param userArgs - User-supplied arguments
     * 
     * @returns The subcommand result
     */
    async execute(userArgs: ParsedArgs): Promise<SubCommandResult> {
        const res: SubCommandResult = {
            "ok": false,
            "status": SubCommandResultStatus.error,
            "error": serializeError(new Error("Base class SubCommand should not be executed.")),
        };

        if (this.debug) {
            res.debug = { "args": userArgs };
        }

        return res;
    }

}
