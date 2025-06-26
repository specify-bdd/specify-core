#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import { config } from "@/config/all";
import { deserializeError } from "serialize-error";
import { SubCommand, SubCommandResult } from "./lib/SubCommand";
import { TestSubCommand, TEST_DEFAULT_OPTS } from "./lib/TestSubCommand";

import minimist from "minimist";
import path from "node:path";

const minOpts = {
    "alias": {
        "parallel": [ "p" ],
        "tags": [ "t" ],
    },
    "string": [ "parallel", "tags" ]
};
const args = minimist(process.argv.slice(2), minOpts);

let cmd: SubCommand;

switch (args._[0]?.toLowerCase()) {
    case "test":
        args._.shift();
        // fall through to default
    default:
        cmd = new TestSubCommand({
            "cucumber": config.cucumber,
            "debug": config.debug,
            "gherkinPaths": [ path.resolve(config.paths.gherkin) ],
            "logPath": path.resolve(config.paths.logs, TEST_DEFAULT_OPTS.logPath),
            "plugins": [ ...config.plugins, path.resolve(import.meta.dirname, "../dist/cucumber") ],
        });
}

const res = await cmd.execute(args);
await cmd.execute(args);

if (res.error) {
    throw deserializeError(res.error);
}

process.exit(res.status);
