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

switch (args._[0]) {
    case "test":
    case "TEST":
        args._.shift();
    default:
        cmd = new TestSubCommand(args, config);
}

const res = await cmd.execute();
console.dir(res, {"depth": 10});

process.exit(res.status);
