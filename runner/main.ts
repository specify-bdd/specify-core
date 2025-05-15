#!/usr/bin/env node
import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

import minimist from "minimist";
import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import * as refs from "quick-ref";

import {
    cucumber as cucumber_cfg,
    paths as paths_cfg,
    plugins as plugins_cfg,
} from "@/config/all";

const argv = minimist(process.argv.slice(2));

let gherkin_paths = [path.resolve(paths_cfg.gherkin)];

// process arguments
// TODO: this should handle options, subcommands, etc. in addition to path args
if (argv._.length) {
    gherkin_paths = argv._.map((gherkin_path) => path.resolve(gherkin_path));
}

// add Gherkin to Cucumber config
cucumber_cfg.paths.push(...gherkin_paths);

// add plugins to Cucumber config
// TODO: this glob pattern needs to match JS not TS
cucumber_cfg.import.push(
    ...plugins_cfg.map((plugin) => path.join(getPluginPath(plugin), "**/*.ts")),
);

// import quick ref data
await refs.addFile(path.resolve(paths_cfg.refs));

// execute cucumber tests
const cucumber_opts = await loadConfiguration({ "provided": cucumber_cfg });
const cucumber_res = await runCucumber(cucumber_opts.runConfiguration);

process.exit(cucumber_res.success ? 0 : 1);

/**
 * Resolve a plugin name into a path for that plugin, unless the name is a file
 * system location that already exists.
 *
 * @param plugin_name - The name of the plugin to resolve.
 *
 * @returns The path to the plugin.
 */
function getPluginPath(plugin_name: string): string {
    let plugin_path = path.resolve(plugin_name);

    // first see if the plugin name works as a file system path
    if (fs.existsSync(plugin_path)) {
        return plugin_path;
    }

    // if not, resolve the package name into a path
    // NOTE: Node.js import.meta.resolve is at stability index 1.2 ("Experimental release candidate") at time of
    // writing and may change without notice.  We need to verify this still works when upgrading Node versions.
    plugin_path = url.fileURLToPath(import.meta.resolve(plugin_name));

    return path.dirname(plugin_path);
}
