#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import { config } from "@/config/all";
import { SubCommand } from "./lib/SubCommand";
import { TestSubCommand } from "./lib/TestSubCommand";

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
let cmd: SubCommand;

switch (args._[0]?.toLowerCase()) {
    case "test":
        args._.shift();
        // fall through to default
    default:
        cmd = new TestSubCommand(args, config);
}

const res = await cmd.execute();

process.exit(res.status);
