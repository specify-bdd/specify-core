import { loadConfiguration, loadSupport, runCucumber } from "@cucumber/cucumber/api";

import type {
    IConfiguration,
    IRunConfiguration,
    IRunEnvironment,
    IRunOptions,
    IRunResult,
    ISupportCodeLibrary,
} from "@cucumber/cucumber/api";

import { Logger } from "./Logger";

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

    static #logger: Logger = new Logger();

    /**
     * Inject custom Logger instance (for alternative behavior or testing).
     */
    static set logger(logger: Logger) {
        this.#logger = logger;
    }

    static async loadConfiguration(config: Partial<IConfiguration>): Promise<IRunConfiguration> {
        CucumberTool.#logPath = await this.#logger.generateTmpLogPath("specify-test");

        config.format.push(["json", this.#logPath]);

        const runConfig = (await loadConfiguration({ "provided": config })).runConfiguration;

        await this.#loadSupport(runConfig);

        return runConfig;
    }

    static async #loadSupport(runConfig: IRunConfiguration): Promise<void> {
        this.#supportCode ??= await loadSupport(runConfig);
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
            "support": this.#supportCode,
        };

        const runResult = await runCucumber(finalConfig, environment);

        await this.#checkForRunErrors();

        return runResult;
    }

    static async #checkForRunErrors(): Promise<void> {
        const scenarioResults = await this.#logger.consumeTmpLog(this.#logPath);

        if (!Array.isArray(scenarioResults) || scenarioResults.length === 0) {
            throw new Error("No tests were executed.");
        }
    }
}
