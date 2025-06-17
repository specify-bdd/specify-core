#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import { config } from "@/config/all";
import { TestSubCommand } from "./lib/TestSubCommand";

import minimist from "minimist";

const args = minimist(process.argv.slice(2));
const test = new TestSubCommand(args, config);
const res  = await test.execute();

process.exit(res ? 0 : 1);
