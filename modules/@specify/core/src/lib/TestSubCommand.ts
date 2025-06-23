/**
 *  TestSubCommand class module
 *
 *  Conduct tests by using Cucumber to translate Gherkin specifications into 
 *  actionable, automated tests.
 */

import { IRunResult, loadConfiguration, runCucumber } from "@cucumber/cucumber/api";
import { serializeError } from "serialize-error";
import { SubCommand, SubCommandOptions, SubCommandResultStatus } from "./SubCommand";

import merge from "deepmerge";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import type { IConfiguration } from "@cucumber/cucumber/api";
import type { ParsedArgs } from "minimist";
import type { SubCommandResult } from "./SubCommand";

const CUCUMBER_PLUGIN_EXTENSIONS = ["js", "cjs", "mjs"];

export const TEST_DEFAULT_OPTS: TestSubCommandOptions = {
    "cucumber": {
        "format": [],
        "import": [],
        "paths": [],
        "tags": "",
    },
    "debug": false,
    "gherkinPaths": [],
    "logPath": `./specify-test-log-${Date.now()}.json`,
    "plugins": [],
}

export interface TestSubCommandOptions extends SubCommandOptions {
    cucumber: Partial<IConfiguration>,
    gherkinPaths: string[],
    plugins: string[],
}

export class TestSubCommand extends SubCommand {

    /**
     *  User-supplied options, to be merged with the defaults above
     */
    opts: TestSubCommandOptions = TEST_DEFAULT_OPTS;

    /**
     *  Parse user arguments and options data to prepare operational parameters
     *
     *  @param userArgs - User-supplied arguments
     *  @param userOpts - User-supplied options
     */
    constructor(userArgs: ParsedArgs, userOpts: Partial<TestSubCommandOptions>) {
        super(userArgs, {});

        this.opts = merge(this.opts, userOpts);

        this.#parseArgs();
        this.#resolvePlugins();

        this.opts.cucumber.format.push([ "json", this.opts.logPath ]);
    }

    /**
     *  Execute tests with Cucumber.  Consider a no-op result from Cucumber to 
     *  be an error condition.
     */
    async execute(): Promise<SubCommandResult> {
        const testRes: SubCommandResult = { "ok": false, "status": SubCommandResultStatus.error };

        let cucumberRes: IRunResult;

        try {
            const cucumberOpts = await loadConfiguration({ "provided": this.opts.cucumber });
            const cucumberEnv  = {
                "cwd": process.cwd(),
                "debug": this.opts.debug,
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
                fs.readFileSync(this.opts.logPath, { "encoding": "utf8" })
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
            paths.push(...this.opts.gherkinPaths.map((gherkinPath) => path.resolve(gherkinPath)));
        }

        this.opts.cucumber.paths = paths;
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

        if (this.opts.cucumber.tags) {
            tags.push(this.opts.cucumber.tags);
        }

        tags = tags.filter((tag) => tag);

        this.opts.cucumber.tags = tags.join(" and ");

        delete this.args.tags; // remove arg now that it's been fully parsed
    }

    /**
     *  Resolve the paths of all Specify plugins, including those in Specify's 
     *  and Cucumber's config files, for use in Cucumber's support file import 
     *  array.
     */
    #resolvePlugins(): void {
        const pluginPaths = [ ...this.opts.cucumber.import ];

        for (const plugin of this.opts.plugins) {
            pluginPaths.push(
                path.join(
                    this.#getPluginPath(plugin),
                    `**/*.{${CUCUMBER_PLUGIN_EXTENSIONS.join(",")}}`,
                )
            );
        }

        this.opts.cucumber.import = pluginPaths;
    }

}
