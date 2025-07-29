import { loadConfiguration, loadSupport, runCucumber } from "@cucumber/cucumber/api";

import fs   from "node:fs";
import os   from "node:os";
import path from "node:path";

import type {
    IConfiguration,
    IRunConfiguration,
    IRunEnvironment,
    IRunOptions,
    IRunResult,
    ISupportCodeLibrary,
} from "@cucumber/cucumber/api";

import type { JsonObject } from "type-fest";

export class CucumberTool {
    /**
     * The file system temporary path to write result output to.
     */
    static #logPath: string;

    /**
     * Cucumber support code, which must be reused across executions
     *
     * @remarks
     * Cucumber's support code import logic doesn't work properly across
     * multiple executions due to Node.js's caching of module exports.  To work
     * around this, we need to pre-load support code and reuse it for all
     * executions or test runs after the first will fail with unsupported steps.
     *
     * @see {@link https://github.com/cucumber/cucumber-js/blob/main/docs/javascript_api.md#preloading-and-reusing-support-code|Cucumber.js Javascript API documentation}
     */
    static #supportCode: ISupportCodeLibrary;

    static async loadConfiguration(config: Partial<IConfiguration>): Promise<IRunConfiguration> {
        CucumberTool.#logPath = CucumberTool.#generateLogPath();

        config.format.push(["json", CucumberTool.#logPath]);

        const runConfig = (await loadConfiguration({ "provided": config })).runConfiguration;

        await CucumberTool.loadSupport(runConfig);

        return runConfig;
    }

    static async loadSupport(runConfig: IRunConfiguration): Promise<void> {
        CucumberTool.#supportCode ??= await loadSupport(runConfig);
    }

    /**
     * Run the tests. Consider a no-op result to be an error condition.
     *
     * @param options - User-supplied options
     * @param environment - User-supplied environment
     *
     * @returns The run result
     */
    static async runCucumber(
        options: IRunOptions,
        environment?: IRunEnvironment,
    ): Promise<IRunResult> {
        const finalConfig = {
            ...options,
            "support": CucumberTool.#supportCode,
        };

        const runResult       = await runCucumber(finalConfig, environment);
        const scenarioResults = CucumberTool.#consumeLogFile();

        if (!Array.isArray(scenarioResults) || !scenarioResults.length) {
            throw new Error("No tests were executed.");
        }

        return runResult;
    }

    static #generateLogPath(): string {
        return path.join(
            fs.mkdtempSync(path.join(os.tmpdir(), "specify-test-")),
            `${Date.now()}.json`,
        );
    }

    static #consumeLogFile(): JsonObject {
        try {
            return JSON.parse(fs.readFileSync(CucumberTool.#logPath, { "encoding": "utf8" }));
        } finally {
            fs.unlinkSync(CucumberTool.#logPath);
        }
    }
}
