import type { ParsedArgs } from "minimist";
import type { CoreConfig } from "~/types";

export class SubCommand {
    args:   ParsedArgs;
    config: CoreConfig;

    constructor(args: ParsedArgs, config: CoreConfig) {
        this.args   = args;
        this.config = config;
    }

    async execute(): Promise<boolean> {
        return false;
    }
}
