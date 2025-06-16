#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import {
    IConfiguration,
    loadConfiguration,
    runCucumber,
} from "@cucumber/cucumber/api";
import { config } from "@/config/all";

import minimist from "minimist";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

import type { ParsedArgs } from "minimist";

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

processCucumberArgs(
    process.argv.slice(2),
    [path.resolve(config.paths.gherkin)],
    config.cucumber,
);

// add plugins to Cucumber config
config.cucumber.import.push(
    path.resolve(import.meta.dirname, "cucumber"), // Core's Cucumber support code
    ...config.plugins.map((plugin) =>
        path.join(
            getPluginPath(plugin),
            `**/*.{${CUCUMBER_PLUGIN_EXTENSIONS.join(",")}}`,
        ),
    ),
);

// execute cucumber tests
const cucumberOpts = await loadConfiguration({ "provided": config.cucumber });
const cucumberRes = await runCucumber(cucumberOpts.runConfiguration);

process.exit(cucumberRes.success ? 0 : 1);

/**
 * Resolve a plugin name into a path for that plugin, unless the name is a file
 * system location that already exists.
 *
 * @param pluginName - The name of the plugin to resolve.
 *
 * @returns The path to the plugin.
 */
function getPluginPath(pluginName: string): string {
    let pluginPath = path.resolve(pluginName);

    // first see if the plugin name works as a file system path
    if (fs.existsSync(pluginPath)) {
        return pluginPath;
    }

    // if not, resolve the package name into a path
    // NOTE: Node.js import.meta.resolve is at stability index 1.2 ("Experimental release candidate") at time of
    // writing and may change without notice.  We need to verify this still works when upgrading Node versions.
    pluginPath = url.fileURLToPath(import.meta.resolve(pluginName));

    return path.dirname(pluginPath);
}

/**
 * Parse the arguments and options passed to Specify from the CLI and set their
 * keys/values in the Cucumber configuration object.
 *
 * @param cucumberConfig - the object to be used for Cucumber config. It will be mutated!
 * @param argv           - the CLI arguments to parse, usually obtained via `process.argv.slice(2)`
 * @param gerkinPaths    - the paths to use to find Cucumber scenarios
 */
function processCucumberArgs(
    argv: string[],
    gerkinPaths: string[],
    cucumberConfig: Partial<IConfiguration>,
): void {
    const minimistArgv = minimist(argv);

    processGherkinPaths(minimistArgv, gerkinPaths, cucumberConfig);
    processTagsOption(minimistArgv, cucumberConfig);
}

/**
 * Process the Gherkin filepaths
 *
 * @param minimistArgv   - the parsed CLI arguments object
 * @param gherkinPaths   - the gherkin filepaths
 * @param cucumberConfig - the cucumber configuration object
 */
function processGherkinPaths(
    minimistArgv: ParsedArgs,
    gherkinPaths: string[],
    cucumberConfig: Partial<IConfiguration>,
): void {
    let paths = gherkinPaths;

    if (minimistArgv._.length) {
        paths = minimistArgv._.map((argPaths) => path.resolve(argPaths));
    }

    cucumberConfig.paths.push(...paths);
}

/**
 * Process the CLI "--tags" option
 *
 * @param minimistArgv   - the parsed CLI arguments object
 * @param cucumberConfig - the cucumber configuration object
 */
function processTagsOption(
    minimistArgv: ParsedArgs,
    cucumberConfig: Partial<IConfiguration>,
): void {
    if (!minimistArgv.tags) {
        return;
    }

    cucumberConfig.tags = cucumberConfig.tags
        ? `${cucumberConfig.tags} and ${minimistArgv.tags}`
        : minimistArgv.tags;
}
