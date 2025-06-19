import { serializeError } from "serialize-error";

import type { ParsedArgs } from "minimist";
import type { CoreConfig } from "~/types";
import type { JsonObject, JsonValue } from "type-fest";

export class SubCommand {
    args:   ParsedArgs;
    config: CoreConfig;

    constructor(args: ParsedArgs, config: CoreConfig) {
        this.args   = args;
        this.config = config;
    }

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
