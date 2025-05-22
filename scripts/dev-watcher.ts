/**
 * This script watches for file changes in our submodules (packages) and
 * rebuilds them when changes are detected. It is intended to be used during
 * development to ensure that changes are immediately reflected in the built
 * packages.
 *
 * @example
 * pnpm run dev:watch
 */

import { watch } from "chokidar";
import { spawn } from "child_process";
import { clear, log } from "console";
import { globbySync } from "globby";
import { dirname } from "path";

import _ from "lodash";
import chalk from "chalk";

const PACKAGE_PREFIX = "specify-"; // todo: remove this when we reorganize the packages
const REBUILD_DEBOUNCE_MS = 500;

const prefix = chalk.cyan("[dev-watcher]");

const logMessage = (message: string) => {
    const statusLine = `${prefix} ${message}`;

    log(statusLine);
};

const clearAndLogMessage = (message: string) => {
    clear();
    logMessage(message);
};

const wrapLabel = (label: string) => {
    return chalk.cyan("[") + chalk.greenBright(label) + chalk.cyan("]");
};

const packageFiles = globbySync("**/package.json", {
    "absolute": true,
    "onlyFiles": true,
    "cwd": process.cwd(),
    "ignore": ["./package.json", "**/node_modules/**", "**/dist/**"],
});

clearAndLogMessage("Watching for file changes...");
packageFiles.forEach((packageFile) => watchPackage(packageFile));

/*******************************************************************************
 * Supporting Functions
 ******************************************************************************/

type EventName =
    | "add"
    | "addDir"
    | "all"
    | "change"
    | "error"
    | "raw"
    | "ready"
    | "unlink"
    | "unlinkDir";

/**
 * Rebuilds the package at the specified path.
 *
 * @param PackageOpts - Options for the package rebuild.
 */
function rebuildPackage<
    PackageOpts extends {
        event: EventName;
        path: string;
        packageDir: string;
    },
>({ event, path, packageDir }: PackageOpts): void {
    const buildStartTime = new Date();
    const packageName = `${PACKAGE_PREFIX}${packageDir.split("/").slice(-1)[0]}`;
    const label = wrapLabel(packageName);

    logMessage(`${label} ${event}: ${path}`);

    logMessage(`${label} Rebuilding...`);
    const child = spawn("pnpm", ["run", "build"], {
        "cwd": packageDir,
        "shell": false,
    });

    child.on("error", (error) => {
        logMessage(label + chalk.red(` ${error.message}`));
    });

    child.on("exit", (code) => {
        const buildEndTime = new Date();
        const buildDuration =
            (buildEndTime.getTime() - buildStartTime.getTime()) / 1000;

        if (code === 0) {
            logMessage(`${label} Build completed in ${buildDuration}s`);
        } else {
            logMessage(label + chalk.red(` Build failed with code ${code}`));
        }
    });
}

/**
 * Watches a package directory for changes and triggers a rebuild when files
 * are modified.
 *
 * @param packageFile - The path to the package.json file of the package to
 *                      watch.
 */
function watchPackage(packageFile: string): void {
    const packageDir = dirname(packageFile);
    const debouncedRebuild = _.debounce((event: EventName, path: string) => {
        rebuildPackage({ event, path, packageDir });
    }, REBUILD_DEBOUNCE_MS);

    watch(packageDir, {
        "ignored": [
            /[/\\]node_modules[/\\]/,
            /[/\\]dist[/\\]/,
            /package\.json$/,
        ],
        "ignoreInitial": true, // don't trigger on watcher start
        "persistent": true, // keep the watcher running
        "followSymlinks": false, // don't follow symlinks (prevent recursion)
    }).on("all", (event, path) => debouncedRebuild(event, path));
}
