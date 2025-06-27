/**
 * SubCommand class module
 *
 * The abstract base class for all Specify subcommands.
 */

import { serializeError } from "serialize-error";

import merge from "deepmerge";

import type { ParsedArgs } from "minimist";
import type { JsonObject, JsonValue } from "type-fest";

export const SUBCOMMAND_DEFAULT_OPTS: ISubCommandOptions = {
    "debug": false,
    "logPath": `./specify-log-${Date.now()}.json`,
};

export interface ISubCommandOptions {
    debug: boolean,
    logPath: string,
}

export interface ISubCommandResult {
    ok: boolean,
    status: SubCommandResultStatus,
    error?: JsonObject,
    result?: JsonValue,
    debug?: ISubCommandResultDebugInfo,
}

export interface ISubCommandResultDebugInfo {
    args: ParsedArgs,
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
    constructor(userOpts: Partial<ISubCommandOptions>) {
        const mergedOpts = merge.all([ {}, SUBCOMMAND_DEFAULT_OPTS, userOpts ]) as ISubCommandOptions;

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
    async execute(userArgs: ParsedArgs): Promise<ISubCommandResult> {
        const res: ISubCommandResult = {
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
