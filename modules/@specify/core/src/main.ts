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

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

processCucumberArgs(config.cucumber, process.argv.slice(2), [
    path.resolve(config.paths.gherkin),
]);

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
const cucumberRes  = await runCucumber(cucumberOpts.runConfiguration);

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
 * @param cucumberConfig the object to be used for Cucumber config. It will be mutated!
 * @param argv           the CLI arguments to parse, usually obtained via `process.argv.slice(2)`
 * @param gerkinPaths    the paths to use to find Cucumber scenarios
 */
function processCucumberArgs(
    cucumberConfig: Partial<IConfiguration>,
    argv: string[],
    gerkinPaths: string[],
): void {
    const minimistArgv = minimist(argv);

    let paths = gerkinPaths;

    if (minimistArgv._.length) {
        paths = minimistArgv._.map((gerkinPaths) => path.resolve(gerkinPaths));
    }

    cucumberConfig.paths.push(...paths);

    delete minimistArgv._;

    // add all options to cucumber config
    Object.entries(minimistArgv).forEach(
        (entry) => (cucumberConfig[entry[0]] = entry[1]),
    );
}
