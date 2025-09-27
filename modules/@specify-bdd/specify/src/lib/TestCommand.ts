/**
 * TestCommand class module
 *
 * Conduct tests by using Cucumber to translate Gherkin specifications into
 * actionable, automated tests.
 */

import merge              from "deepmerge";
import assert             from "node:assert/strict";
import fs                 from "node:fs";
import path               from "node:path";
import { serializeError } from "serialize-error";

import { Command, CommandResultStatus } from "./Command";
import { CucumberTool                 } from "./CucumberTool";
import { RerunFile                    } from "./RerunFile";

import type {
    IConfiguration,
    IRunConfiguration,
    IRunEnvironment,
    IRunResult,
} from "@cucumber/cucumber/api";

import type { CommandOptions, CommandResult, CommandResultDebugInfo } from "./Command";

export const TEST_COMMAND_DEFAULT_OPTS: TestCommandOptions = {
    "cucumber": {
        "format": [],
        "import": [],
        "paths":  [],
        "tags":   "",
    },
    "debug":        false,
    "gherkinPaths": [],
    "logPath":      `./specify-test-log-${Date.now()}.json`,
};

export interface TestCommandArguments {
    parallel?: number;
    paths?: string[];
    rerun?: string;
    rerunFile?: string;
    retry?: number;
    retryTag?: string;
    tags?: string[];
    watch?: boolean;
}

export interface TestCommandOptions extends CommandOptions {
    cucumber?: Partial<IConfiguration>;
    gherkinPaths?: string[];
    plugins?: string[];
}

export interface TestCommandResult extends CommandResult {
    debug?: TestCommandResultDebugInfo;
}

export interface TestCommandResultDebugInfo extends CommandResultDebugInfo {
    args?: TestCommandArguments;
    cucumber?: {
        runConfiguration?: IRunConfiguration;
        runEnvironment?: IRunEnvironment;
        runResult?: IRunResult;
    };
}

export class TestCommand extends Command {
    /**
     * A raw Cucumber configuration.
     */
    cucumber: Partial<IConfiguration>;

    /**
     * A list of paths to Gherkin feature files this Command should execute.
     */
    gherkinPaths: string[];

    /**
     * Parse user arguments and options data to prepare operational parameters
     *
     * @param userOpts - User-supplied options
     */
    constructor(userOpts: TestCommandOptions = {}) {
        const mergedOpts = merge.all([
            {},
            TEST_COMMAND_DEFAULT_OPTS,
            userOpts,
        ]) as TestCommandOptions;

        super({
            "debug":   mergedOpts.debug,
            "logPath": mergedOpts.logPath,
        });

        this.cucumber = mergedOpts.cucumber;
        this.gherkinPaths = mergedOpts.gherkinPaths;

        // Cucumber formatters ensure that user's test result details are logged
        // in some permanent form
        this.cucumber.format.push(["json", this.logPath]);
    }

    /**
     * Execute tests with Cucumber.  Consider a no-op result from Cucumber to
     * be an error condition.
     *
     * @param userArgs - User-supplied arguments
     *
     * @returns The Command result
     */
    async execute(userArgs: TestCommandArguments): Promise<TestCommandResult> {
        const testRes: TestCommandResult = {
            "ok":     false,
            "status": CommandResultStatus.error,
        };

        if (this.debug) {
            testRes.debug = { "args": userArgs };
        }

        try {
            const cucumberConfig    = await this.#buildCucumberConfig(userArgs);
            const cucumberRunConfig = await CucumberTool.loadConfiguration(cucumberConfig);
            const cucumberEnv       = { "debug": this.debug };

            if (this.debug) {
                testRes.debug.cucumber = {
                    "runConfiguration": cucumberRunConfig,
                    "runEnvironment":   cucumberEnv,
                };
            }

            const cucumberRes = await CucumberTool.runCucumber(cucumberRunConfig, cucumberEnv);

            await RerunFile.makeAbsolute(this.#getRerunFilepath(), process.cwd());

            if (this.debug) {
                testRes.debug.cucumber.runResult = cucumberRes;
            }

            testRes.ok = cucumberRes.success;
            testRes.status = cucumberRes.success
                ? CommandResultStatus.success
                : CommandResultStatus.failure;
        } catch (err) {
            testRes.error = serializeError(err);
        }

        return testRes;
    }

    /**
     * Build a ready-to-use Cucumber configuration based on command line args
     * and initialized Command options.
     *
     * @param args - Command line arguments
     *
     * @returns The Cucumber configuration
     *
     * @throws Error
     * If any command line args are invalid for this Command.
     */
    async #buildCucumberConfig(args: TestCommandArguments): Promise<IConfiguration> {
        const config = merge({}, this.cucumber);

        for (const optKey in args) {
            let optVal = args[optKey];

            switch (optKey) {
                case "parallel":
                    config.parallel = optVal;
                    break;
                case "paths":
                    config.paths = this.#parsePathArgs(optVal);
                    break;
                case "rerun":
                    // this is handled below, needs path and rerunFile options to complete first
                    break;
                case "rerunFile":
                    this.#configureRerunFormatter(config, optVal);
                    break;
                case "retry":
                    config.retry = optVal;
                    break;
                case "retryTag":
                    config.retryTagFilter = optVal;
                    break;
                case "tags":
                    optVal = Array.isArray(optVal) ? optVal : [optVal];
                    optVal.push(config.tags);
                    config.tags = this.#parseTagArgs(optVal);
                    break;
                case "watch":
                    break; // this is handled by TestCommandWatcher
                default:
                    throw new Error(`Option "--${optKey}" not being used to configure Cucumber`);
            }
        }

        // Cucumber errors if retry === 0 while retryTagFilter is truthy
        if (config.retry === 0) {
            delete config.retryTagFilter;
        }

        // TODO: remove the "args.rerunFile" check once the default value scenario is implemented
        if (args.rerun && args.rerunFile) {
            config.paths = await RerunFile.read(args.rerunFile);
        }

        return config;
    }

    /**
     * Parse loose arguments as paths.  Any loose args that are not valid file
     * system paths will throw an error.
     *
     * @param pathArgs - The path arguments to parse
     *
     * @returns The list of parsed paths
     *
     * @throws Error
     * If any path argument does cannot be confirmed by node:fs to exist on the
     * file system.
     */
    #parsePathArgs(pathArgs: string[]): string[] {
        let paths = [];

        // parse path arguments and ensure all of them are valid
        for (const pathArg of pathArgs) {
            const [filePath, fileLine] = pathArg.split(":");
            const absFilePath          = path.resolve(filePath);
            const absFilePathLine      = fileLine ? `${absFilePath}:${fileLine}` : absFilePath;

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
     * Configure the rerun formatter in the Cucumber configuration to use the given filepath.
     * Will override any existing rerun formatter configuration.
     *
     * @param config - The Cucumber configuration to modify
     * @param rerunFilePath - The path to the rerun file
     */
    #configureRerunFormatter(config: IConfiguration, rerunFilePath: string): void {
        const rerunFormatPrefix = "rerun:";
        const newRerunFormat    = `${rerunFormatPrefix}${rerunFilePath}`;

        const rerunFormatIndex = config.format.findIndex((formatter) => {
            return formatter.includes(rerunFormatPrefix);
        });

        if (rerunFormatIndex >= 0) {
            config.format[rerunFormatIndex] = newRerunFormat;
        } else {
            config.format.push(newRerunFormat);
        }
    }

    /**
     * Get the path that the rerun file will be read from and written to.
     *
     * @returns The path found in the formatter, otherwise the default path
     */
    #getRerunFilepath(): string {
        const defaultFilepath = "/tmp/specify/rerun.txt";

        const rerunFormat = this.cucumber.format.find((format) => {
            return format.includes("rerun:");
        }) as string;

        return rerunFormat ? rerunFormat.replace("rerun:", "") : defaultFilepath;
    }
}
