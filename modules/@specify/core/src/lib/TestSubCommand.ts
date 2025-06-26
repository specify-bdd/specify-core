/**
 * TestSubCommand class module
 *
 * Conduct tests by using Cucumber to translate Gherkin specifications into 
 * actionable, automated tests.
 */

import { loadConfiguration, loadSupport, runCucumber } from "@cucumber/cucumber/api";
import { createRequire } from "module";
// import { Writable } from "node:stream";
import { serializeError } from "serialize-error";
import { SubCommand, SubCommandOptions, SubCommandResultStatus } from "./SubCommand";

import merge from "deepmerge";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import type { IConfiguration, IRunConfiguration, ISupportCodeLibrary } from "@cucumber/cucumber/api";
import type { ParsedArgs } from "minimist";
import type { JsonArray, JsonValue } from "type-fest";
import type { SubCommandResult } from "./SubCommand";

const require = createRequire(import.meta.url);

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
    // "stderr": process.stderr,
    // "stdout": process.stdout,
}

export interface TestSubCommandOptions extends SubCommandOptions {
    cucumber: Partial<IConfiguration>,
    gherkinPaths: string[],
    plugins: string[],
    // stderr: Writable,
    // stdout: Writable,
}

export class TestSubCommand extends SubCommand {

    /**
     * User-supplied options, to be merged with the defaults above
     */
    // opts: TestSubCommandOptions = TEST_DEFAULT_OPTS;

    /**
     * A raw Cucumber configuration.
     */
    cucumber: Partial<IConfiguration>;

    /**
     * A list of paths to Gherkin feature files this subcommand should execute.
     */
    gherkinPaths: string[];

    /**
     * A list of Specify plugins this subcommand should import.
     */
    plugins: string[];

    /**
     * Cucumber support code, which must be reused across executions
     */
    support: ISupportCodeLibrary;

    /**
     * Parse user arguments and options data to prepare operational parameters
     *
     * @param userOpts - User-supplied options
     */
    constructor(userOpts: Partial<TestSubCommandOptions>) {
        const mergedOpts = merge.all([ {}, TEST_DEFAULT_OPTS, userOpts ]) as TestSubCommandOptions;

        super({ "debug": mergedOpts.debug, "logPath": mergedOpts.logPath});

        this.cucumber     = mergedOpts.cucumber;
        this.gherkinPaths = mergedOpts.gherkinPaths;
        this.plugins      = mergedOpts.plugins;

        this.#resolvePlugins();

        this.cucumber.format.push([ "json", this.logPath ]);
    }

    /**
     * Execute tests with Cucumber.  Consider a no-op result from Cucumber to 
     * be an error condition.
     *
     * @param userArgs - User-supplied arguments
     * 
     * @returns The subcommand result
     */
    async execute(userArgs: ParsedArgs): Promise<SubCommandResult> {
        const testRes: SubCommandResult = { "ok": false, "status": SubCommandResultStatus.error };

        try {
            const cucumberConfig = await this.#buildCucumberConfig(userArgs);
            const cucumberEnv    = {
                "debug": this.debug,
                // "stderr": this.stderr,
                // "stdout": this.stdout,
            };

            if (this.support) {
                cucumberConfig.support = this.support.originalCoordinates;
            }

            const cucumberRes = await runCucumber(cucumberConfig, cucumberEnv);
            
            this.support = cucumberRes.support;

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
        }

        return testRes;
    }

    /**
     * Build a ready-to-use Cucumber configuration based on command line args 
     * and initialized subcommand options.
     *
     * @param args - Command line arguments, as parsed by Minimist
     * 
     * @returns The Cucumber configuration
     * 
     * @throws {@link Error}
     * If any command line args are invalid for this subcommand.
     */
    async #buildCucumberConfig(args: ParsedArgs): Promise<IRunConfiguration> {
        const config = merge({}, this.cucumber);

        for (let optKey in args) {
            let optVal = args[optKey];

            switch (optKey) {
                case "tags":
                    optVal = Array.isArray(optVal) ? optVal : [ optVal ];
                    optVal.push(config.tags);
                    config.tags = this.#parseTagArgs(optVal);
                    break;
                case "_": // gherkin paths
                    config.paths = this.#parsePathArgs(optVal);
                    break;
                default:
                    throw new Error(`Invalid option: --${optKey}`);
            }
        }

        return loadConfiguration({ "provided": config })
            .then((loaded) => loaded.runConfiguration);
    }

    /**
     * Resolve a plugin package name (or path) into an absolute path.
     *
     * @param pluginName - The name or path of a plugin package to resolve
     * 
     * @returns The absolute path of the package
     */
    #getPluginPath(pluginName: string): string {
        let pluginPath = path.resolve(pluginName);

        // first see if the plugin name works as a file system path
        if (fs.existsSync(pluginPath)) {
            return pluginPath;
        }

        // if not, resolve the package name into a path
        pluginPath = require.resolve(pluginName);

        return path.dirname(pluginPath);
    }

    /**
     * Parse loose arguments as paths.  Any loose args that are not valid file 
     * system paths will throw an error.
     * 
     * @param pathArgs - The path arguments to parse
     * 
     * @returns The list of parsed paths
     * 
     * @throws {@link Error}
     * If any path argument does cannot be confirmed by node:fs to exist on the 
     * file system.
     */
    #parsePathArgs(pathArgs: string[]): string[] {
        let paths = [];

        // parse path arguments and ensure all of them are valid
        for (const pathArg of pathArgs) {
            const [ filePath, fileLine ] = pathArg.split(":");
            const absFilePath            = path.resolve(filePath);
            const absFilePathLine        = fileLine ? `${absFilePath}:${fileLine}` : absFilePath;

            assert.ok(fs.existsSync(absFilePath), new Error(`Invalid path: ${pathArg}`));

            paths.push(absFilePathLine);
        }

        // if no path arguments were supplied, fall back to the default gherkin path
        if (!paths.length) {
            paths = this.gherkinPaths.map((gherkinPath) => path.resolve(gherkinPath));
        }

        return paths;
    }

    /**
     * Filter and join Cucumber tag expressions into a single conjunction.
     * 
     * @param tags - The list of tags to parse
     * 
     * @returns The unified tag expression
     */
    #parseTagArgs(tags: string[]): string {
        return tags
            .filter((tag) => tag.trim().length)
            .map((tag) => `(${tag})`)
            .join(" and ");
    }

    /**
     * Resolve the paths of all Specify plugins, including those in Specify's 
     * and Cucumber's config files, for use in Cucumber's support file import 
     * array.
     */
    #resolvePlugins(): void {
        for (const plugin of this.plugins) {
            this.cucumber.import.push(this.#getPluginPath(plugin));
        }
    }

}
