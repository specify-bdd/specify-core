import {
    loadConfiguration,
    runCucumber
} from '@cucumber/cucumber/api';

import fs       from "node:fs/promises";
import path     from "node:path";
import minimist from "minimist";
import resolve  from "resolve/sync";

import {
    cucumber as cucumber_cfg,
    paths    as paths_cfg,
    plugins  as plugins_cfg
} from "./config/all.ts";

const argv:any = minimist(process.argv.slice(2));

let gherkin_paths:array  = [ path.resolve(paths_cfg.gherkin) ];
let cucumber_opts:object = {};
let cucumber_res:any     = null;

// add plugins to Cucumber config
cucumber_cfg.import.push(...plugins_cfg.map((plugin) => path.join(getPluginPath(plugin), "**/*.js")));

// add Gherkin to Cucumber config
if (argv._.length) {
    gherkin_paths = argv._.map((gherkin_path) => path.resolve(gherkin_path));
}
cucumber_cfg.paths.push(...gherkin_paths);

cucumber_opts = await loadConfiguration(cucumber_cfg);
cucumber_res  = await runCucumber(cucumber_opts.runConfiguration);

console.debug(cucumber_res);

process.exit(cucumber_res.success ? 0 : 1);



/**
 * Resolve a plugin name into a path for that plugin, unless the name is a file
 * system location that already exists.
 */
async function getPluginPath(plugin_name):string {
    let plugin_path = path.resolve(plugin_name);

    // first see if the plugin name works as a file system path
    if (await fs.access(plugin_path, fs.constants.R_OK)) {
        return plugin_path;
    }

    // if not, resolve the package name into a path
    return resolve(plugin_name);
}
