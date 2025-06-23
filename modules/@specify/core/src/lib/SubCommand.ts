/**
 *  SubCommand class module
 *
 *  The abstract base class for all Specify subcommands.
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
}

export enum SubCommandResultStatus {
    success,
    failure,
    error
}

export class SubCommand {

    /**
     *  User-supplied command arguments, as parsed by Minimist
     */
    args: ParsedArgs;

    /**
     *  User-supplied options, to be merged with the defaults above
     */
    opts: SubCommandOptions = DEFAULT_OPTS;

    /**
     *  Store user args and options data.
     *
     *  @param userArgs - User-supplied arguments
     *  @param userOpts - User-supplied options
     */
    constructor(userArgs: ParsedArgs, userOpts: Partial<SubCommandOptions>) {
        this.args = userArgs;
        
        this.opts = merge(this.opts, userOpts);
    }

    /**
     *  Execute the subcommand.  This method should be overridden by child 
     *  classes, or it will just return an error result.
     */
    async execute(): Promise<SubCommandResult> {
        return {
            "ok": false,
            "status": SubCommandResultStatus.error,
            "error": serializeError(new Error("Base class SubCommand should not be executed.")),
        };
    }

}
