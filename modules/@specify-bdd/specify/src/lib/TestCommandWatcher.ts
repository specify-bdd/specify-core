/**
 * TestCommandWatcher class module
 *
 * A decorator for TestCommand that provides file watching functionality with
 * debounced execution to run tests when files change.
 */

import chalk                from "chalk";
import { watch            } from "chokidar";
import { clear, log       } from "node:console";
import path                 from "node:path";
import { deserializeError } from "serialize-error";
import { config           } from "@/config/all";

import type { TestCommand, TestCommandArguments } from "./TestCommand";

export interface TestCommandWatcherOptions {
    debounceMs?: number;
    packageName?: string;
}

const PACKAGE_NAME = "@specify-bdd/specify";

export class TestCommandWatcher {
    /**
     * The TestCommand instance to execute when files change.
     */
    #command: TestCommand;

    /**
     * Configuration object for accessing debug settings.
     */
    #config = config;

    /**
     * Whether or not debug mode is enabled.
     *
     * @remarks
     * The global debug setting takes precedence over the watch config setting.
     */
    #debug = this.#config.debug || this.#config.watch.debug;

    /**
     * Flag to track if an execution is currently queued.
     */
    #executionQueued = false;

    /**
     * Patterns to ignore when watching files.
     */
    #ignoredPatterns = this.#config.watch.ignore.map((ignorePattern) => new RegExp(ignorePattern));

    /**
     * Flag to track if a command execution is currently in progress.
     *
     * @remarks
     * This is used to prevent overlapping executions.
     */
    #isExecuting = false;

    /**
     * Prompt prefix for console output.
     */
    #promptPrefix: string;

    /**
     * Flag to indicate if a restart is required due to configuration changes.
     */
    #restartRequired = false;

    /**
     * Events to watch for file system changes.
     */
    #watchEvents: string[] = this.#config.watch.events ?? ["add", "change", "unlink"];

    /**
     * Initialize the TestCommandWatcher.
     *
     * @param command - The TestCommand instance to watch and execute
     */
    constructor(command: TestCommand) {
        this.#command = command;
        this.#promptPrefix = chalk.cyan("[") + chalk.greenBright(PACKAGE_NAME) + chalk.cyan("]");
    }

    /**
     * Log debug messages when debug mode is enabled or force logging is requested.
     *
     * @param message - The debug message to log
     * @param data    - Optional additional data to log
     * @param force   - Whether to force logging even if debug is disabled
     */
    #debugLog(message: string, data?: unknown, force?: boolean): void {
        if (!this.#debug && !force) {
            return;
        }

        const debugMessage = `${this.#promptPrefix}${chalk.gray("[DEBUG]")} ${message}`;

        log(debugMessage);

        if (data !== undefined) {
            log(chalk.gray(JSON.stringify(data, null, 2)));
        }
    }

    /**
     * Execute the TestCommand.
     *
     * @param args - Command line arguments to pass to the TestCommand
     */
    async #executeCommand(args: TestCommandArguments): Promise<void> {
        try {
            this.#isExecuting = true;

            this.#debugLog("Executing test command...");

            const res = await this.#command.execute(args);

            if (res.error) {
                const resError     = deserializeError(res.error);
                const errorMessage =
                    resError instanceof Error ? resError.message : String(resError);

                this.#debugLog(`Command execution failed: ${errorMessage}`, resError, true);
            }
        } catch (error) {
            this.#debugLog(
                `Error executing command: ${error instanceof Error ? error.message : String(error)}`,
                error,
                true,
            );
        } finally {
            this.#isExecuting = false;

            if (this.#executionQueued) {
                this.#executionQueued = false;
                await this.#executeCommand(args);
            } else {
                log(`\n${this.#promptPrefix} Watching for changes...\n`);
            }
        }
    }

    /**
     * Check if the configuration file has changed.
     */
    #hasConfigChanged(filePath: string): boolean {
        const projectRoot = path.resolve(process.cwd());
        const configPath  = path.join(projectRoot, "specify.config.json");

        return path.resolve(filePath) === configPath;
    }

    /**
     * Notify the user that the configuration file has changed and the watcher needs to be restarted.
     */
    #notifyConfigChange(): void {
        const warningMessage = `${this.#promptPrefix}${chalk.yellow("[Notice]")} specify.config.json has been modified.`;
        const restartMessage = `${this.#promptPrefix}${chalk.yellow("[Notice]")} Please restart the watcher to pick up the configuration changes.`;

        log(`${warningMessage}\n${restartMessage}`);
    }

    /**
     * Start watching for file changes and execute the command when changes occur.
     *
     * @param args - Command line arguments to pass to the TestCommand
     */
    async start(args: TestCommandArguments): Promise<void> {
        clear();

        const watchPaths = config.watch.paths.map((watchPath) => path.resolve(watchPath));

        if (watchPaths.length === 0) {
            this.#debugLog("No watch paths specified, defaulting to current working directory.");

            watchPaths.push(process.cwd());
        }

        // initial execution prior to watching for changes
        await this.#executeCommand(args);

        watch(watchPaths, {
            "awaitWriteFinish": {
                "pollInterval":       25,
                "stabilityThreshold": 100,
            },
            "ignored":       this.#ignoredPatterns,
            "ignoreInitial": true,
            "persistent":    true,
        }).on("all", async (event, filePath) => {
            this.#debugLog(`Detected ${event} event for ${filePath}`);

            if (this.#restartRequired || this.#hasConfigChanged(filePath)) {
                this.#restartRequired = true;

                this.#notifyConfigChange();

                return;
            }

            if (this.#watchEvents.includes(event)) {
                if (this.#isExecuting) {
                    this.#executionQueued = true;
                } else {
                    void this.#executeCommand(args);
                }
            }
        });
    }
}
