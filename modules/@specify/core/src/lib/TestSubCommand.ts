import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import { SubCommand } from "./SubCommand";

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import type { ParsedArgs } from "minimist";
import type { CoreConfig } from "~/types";

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

export class TestSubCommand extends SubCommand {
    paths:   string[];
    plugins: string[];
    tags:    string[];

    constructor(args: ParsedArgs, config: CoreConfig) {
        super(args, config);

        this.#parseArgs();
        this.#resolvePlugins();
    }

    async execute(): Promise<boolean> {
        const cucumberOpts = await loadConfiguration({ "provided": this.config.cucumber });
        const cucumberRes  = await runCucumber(cucumberOpts.runConfiguration, {}, (msg) => console.debug(msg));

        return cucumberRes.success;
    }

    #getPluginPath(pluginName: string): string {
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


    #parseArgs(): void {
        this.#parseTagArgs();
        this.paths = this.args._;
    }

    #parsePathArgs(): void {
        const paths = [];

        // parse path arguments and ensure all of them exist
        for (const pathArg of this.args.paths) {
            const [ userPath, userLine ] = pathArg.split(":");
            const absPath = path.resolve(userPath);

            assert.ok(fs.existsSync(absPath), `Invalid path: ${pathArg}`);

            paths.push(`${absPath}:${userLine}`);
        }

        // if no path arguments were supplied, fall back to the default gherkin path
        if (!paths.length) {
            paths.push(path.resolve(this.config.paths.gherkin));
        }

        this.paths = paths;

        this.config.cucumber.paths = paths;
    }

    #parseTagArgs(): void {
        let tags = this.args.tags;

        if (!Array.isArray(tags)) {
            tags = [ tags ];
        }

        if (this.config.cucumber.tags) {
            tags.push(this.config.cucumber.tags);
        }

        tags = tags.filter((tag) => tag);

        this.tags = tags;

        this.config.cucumber.tags = tags.join(" and ");
    }

    #resolvePlugins(): void {
        const cucumberPath = path.resolve(import.meta.dirname, "..", "cucumber"); // Core's Cucumber support code
        const pluginPaths  = [ cucumberPath, ...this.config.cucumber.import ];

        for (const plugin of this.config.plugins) {
            pluginPaths.push(
                path.join(
                    this.#getPluginPath(plugin),
                    `**/*.{${CUCUMBER_PLUGIN_EXTENSIONS.join(",")}}`,
                )
            );
        }

        this.plugins = pluginPaths;

        this.config.cucumber.import = pluginPaths;
    }
}
