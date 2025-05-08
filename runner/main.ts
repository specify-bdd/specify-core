import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

import minimist from "minimist";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { sync as resolve } from "resolve";

import {
    cucumber as cucumber_cfg,
    paths as paths_cfg,
    plugins as plugins_cfg,
} from "@/config/all";

const argv = minimist(process.argv.slice(2));

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

const cucumber_opts = await loadConfiguration({ provided: cucumber_cfg });
const cucumber_res = await runCucumber(cucumber_opts.runConfiguration);

process.exit(cucumber_res.success ? 0 : 1);

/**
 * @todo test
 *
 * Resolve a plugin name into a path for that plugin, unless the name is a file
 * system location that already exists.
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
    return resolve(plugin_name);
}
