import deepmerge from "deepmerge";
import fs from "node:fs";
import path from "node:path";
import { globbySync } from "globby";
import { pathToFileURL } from "node:url";

import type { RunnerConfig } from "@/types";

// the user's override file should be in the *current working directory*
const configPath = `${process.cwd()}/specify.config.json`;

let userConfig = {} as Partial<RunnerConfig>;

if (fs.existsSync(configPath)) {
    userConfig = (await import(pathToFileURL(configPath).href))
        .default as Partial<RunnerConfig>;
}

export const entries = await Promise.all(
    globbySync(path.join(import.meta.dirname, "*.config.ts"), {
        "absolute": true,
    }).map(async (modulePath) => {
        const module = await import(pathToFileURL(modulePath).href);
        const [key] = Object.keys(module);

        return [key, module[key]];
    }),
);

export const config = deepmerge(
    Object.fromEntries(entries),
    userConfig,
) as RunnerConfig;
