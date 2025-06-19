/**
 *  TestSubCommand class module
 *
 *  Conduct tests by using Cucumber to translate Gherkin specifications into 
 *  actionable, automated tests.
 */

import { IRunResult, loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import { serializeError } from "serialize-error";
import { SubCommand, SubCommandResultStatus } from "./SubCommand";

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import type { ParsedArgs } from "minimist";
import type { CoreConfig } from "~/types";
import type { SubCommandResult } from "./SubCommand";

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

export class TestSubCommand extends SubCommand {
    /**
     * The path of the Cucumber result log file
     */
    logPath: string;

    /**
     * The paths containing Gherkin specs to run as tests
     */
    paths: string[];

    /**
     * The paths for all plugins to import into Cucumber
     */
    plugins: string[];

    /**
     * The tag expressions to use in filtering which tests to run
     */
    tags: string[];

    /**
     *  Parse arguments and config data to prepare operational parameters
     *
     *  @param args   - User-supplied arguments
     *  @param config - Specify config data
     */
    constructor(args: ParsedArgs, config: CoreConfig) {
        super(args, config);

        this.#parseArgs();
        this.#resolvePlugins();

        this.logPath = path.resolve(this.config.paths.logs, `specify-log-${Date.now()}.json`);
        this.config.cucumber.format.push([ "json", this.logPath ]);
    }

    /**
     *  Execute tests with Cucumber.  Consider a no-op result from Cucumber to 
     *  be an error condition.
     */
    async execute(): Promise<Partial<SubCommandResult>> {
        const testRes: Partial<SubCommandResult> = { "ok": false, "status": SubCommandResultStatus.error };

        let cucumberRes: IRunResult;

        try {
            const cucumberOpts = await loadConfiguration({ "provided": this.config.cucumber });
            const cucumberEnv  = {
                "cwd": process.cwd(),
                "debug": this.config.debug,
                "env": process.env,
                "stderr": process.stderr,
                "stdout": process.stdout,
            };

            cucumberRes = await runCucumber(
                cucumberOpts.runConfiguration,
                cucumberEnv,
                // the third param handles message events, which we might need later to publish live results to outside
                // consumers
            );

            testRes.result = JSON.parse(
                fs.readFileSync(this.logPath, { "encoding": "utf8" })
            );

            if (!Array.isArray(testRes.result) || !testRes.result.length) {
                throw new Error("No tests were executed.");
            }

            testRes.ok = cucumberRes.success;
            testRes.status = (cucumberRes.success)
                ? SubCommandResultStatus.success
                : SubCommandResultStatus.failure;
        } catch (err) {
            testRes.error = serializeError(err);

            return testRes;
        }

        return testRes;
    }

    /**
     *  Resolve a plugin package name (or path) into an absolute path.
     *
     *  @param pluginName - The name or path of a plugin package to resolve
     */
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

    /**
     *  Parse all recognized arguments, then throw if any unparsed args remain.
     */
    #parseArgs(): void {
        this.#parsePathArgs();
        this.#parseTagArgs();

        const remainingArgs = Object.keys(this.args);

        // remove loose args from remaining list
        remainingArgs.splice(remainingArgs.indexOf("_"), 1);

        assert.equal(remainingArgs.length, 0, new Error(`Invalid options: ${remainingArgs.join(", ")}`));
    }

    /**
     *  Parse loose arguments as paths.  Any loose args that are not valid file 
     *  system paths will cause an error to be thrown.
     */
    #parsePathArgs(): void {
        const paths = [];

        // parse path arguments and ensure all of them are valid
        while (this.args._.length) {
            const pathArg                = this.args._.shift();
            const [ userPath, userLine ] = pathArg.split(":");
            const absPath                = path.resolve(userPath);
            const absLine                = userLine ? `${absPath}:${userLine}` : absPath;

            assert.ok(fs.existsSync(absPath), new Error(`Invalid path: ${pathArg}`));

            paths.push(absLine);
        }

        // if no path arguments were supplied, fall back to the default gherkin path
        if (!paths.length) {
            paths.push(path.resolve(this.config.paths.gherkin));
        }

        this.paths = paths;

        this.config.cucumber.paths = paths;
    }

    /**
     *  Parse Cucumber tag args.  If the --tags option is used multiple times, 
     *  all supplied tag expressions should be joined (along with any defined in
     *  the Cucumber config) with "and" conjucntions to preserve them all.
     */
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

        delete this.args.tags; // remove arg now that it's been fully parsed
    }

    /**
     *  Resolve the paths of all Specify plugins, including those in Specify's 
     *  and Cucumber's config files, for use in Cucumber's support file import 
     *  array.
     */
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
