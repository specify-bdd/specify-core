/**
 *  SubCommand class module
 *
 *  The abstract base class for all Specify subcommands.
 */

import { serializeError } from "serialize-error";

import type { ParsedArgs } from "minimist";
import type { CoreConfig } from "~/types";
import type { JsonObject, JsonValue } from "type-fest";

export class SubCommand {
    /**
     *  User-supplied command arguments, as parsed by Minimist
     */
    args:   ParsedArgs;

    /**
     *  Specify Core config data
     */
    config: CoreConfig;

    /**
     *  Store args and config data.
     *
     *  @param args   - User-supplied arguments
     *  @param config - Specify config data
     */
    constructor(args: ParsedArgs, config: CoreConfig) {
        this.args   = args;
        this.config = config;
    }

    /**
     *  Execute the subcommand.  This method should be overridden by child 
     *  classes, or it will just return an error result.
     */
    async execute(): Promise<Partial<SubCommandResult>> {
        return {
            "ok": false,
            "status": SubCommandResultStatus.error,
            "error": serializeError(new Error("Base class SubCommand should not be executed.")),
        };
    }
}

export interface SubCommandResult {
    ok: boolean,
    status: SubCommandResultStatus,
    error: JsonObject,
    result: JsonValue,
}

export enum SubCommandResultStatus {
    success,
    failure,
    error
}
