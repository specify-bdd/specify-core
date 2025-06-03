#!/usr/bin/env node

/**
 * Core Module
 *
 * A Cucumber-based testing tool built to support behavior-driven development.
 */

import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import { config } from "@/config/all";

import minimist from "minimist";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

const argv = minimist(process.argv.slice(2));

let gherkinPaths = [path.resolve(config.paths.gherkin)];

// process arguments
// TODO: this should handle options, subcommands, etc. in addition to path args
if (argv._.length) {
    gherkinPaths = argv._.map((gherkinPath) => path.resolve(gherkinPath));
}

// add Gherkin to Cucumber config
config.cucumber.paths.push(...gherkinPaths);

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
