import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

import minimist from "minimist";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import resolve from "resolve";

import { config } from "@/config/all";

const argv = minimist(process.argv.slice(2));
const {
    "cucumber": cucumber_cfg,
    "paths": paths_cfg,
    "plugins": plugins_cfg,
} = config;

// add plugins to Cucumber config
const resolved_plugin_paths = await Promise.all(
    plugins_cfg.map(async (plugin) =>
        path.join(await getPluginPath(plugin), "**/*.js"),
    ),
);
cucumber_cfg.import.push(...resolved_plugin_paths);

let gherkin_paths = [path.resolve(paths_cfg.gherkin)];

// add Gherkin to Cucumber config
if (argv._.length) {
    gherkin_paths = argv._.map((gherkin_path) => path.resolve(gherkin_path));
}

cucumber_cfg.paths.push(...gherkin_paths);

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
async function getPluginPath(plugin_name: string): Promise<string> {
    const plugin_path = path.resolve(plugin_name);

    // first see if the plugin name works as a file system path
    try {
        await fs.access(plugin_path, fs.constants.R_OK);

        return plugin_path;
    } catch {
        // if it doesn't, we need to resolve the plugin name into a path (below)
    }

    // if not, resolve the package name into a path
    return resolve.sync(plugin_name);
}
