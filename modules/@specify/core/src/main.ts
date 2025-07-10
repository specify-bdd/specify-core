#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import minimist             from "minimist";
import path                 from "node:path";
import { deserializeError } from "serialize-error";

import { config  } from "@/config/all";
import { Command } from "./lib/Command";

import {
    TestCommand,
    TEST_COMMAND_DEFAULT_OPTS
} from "./lib/TestCommand";

const minOpts = {};
const args    = minimist(process.argv.slice(2), minOpts);

let cmd: Command;

switch (args._[0]?.toLowerCase()) {
    case "test":
        args._.shift();
        // fall through to default
    default:
        cmd = new TestCommand({
            "cucumber":     config.cucumber,
            "debug":        config.debug,
            "gherkinPaths": [ path.resolve(config.paths.gherkin) ],
            "logPath":      path.resolve(config.paths.logs, TEST_COMMAND_DEFAULT_OPTS.logPath),
            "plugins":      [ ...config.plugins, path.resolve(import.meta.dirname, "../dist/cucumber") ],
        });
}

const res = await cmd.execute(args);

if (res.error) {
    throw deserializeError(res.error);
}

process.exit(res.status);
