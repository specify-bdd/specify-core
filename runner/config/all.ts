import deepmerge from "deepmerge";
import fs from "node:fs";
import path from "node:path";
import { globbySync } from "globby";
import { pathToFileURL } from "node:url";

import type { RunnerConfig } from "@/types";

// the user's override file should be in the *current working directory*
const config_path = `${process.cwd()}/specify.config.json`;

let user_config = {} as Partial<RunnerConfig>;

if (fs.existsSync(config_path)) {
    user_config = (await import(pathToFileURL(config_path).href))
        .default as Partial<RunnerConfig>;
}

export const entries = await Promise.all(
    globbySync(path.join(import.meta.dirname, "*.config.ts"), {
        "absolute": true,
    }).map(async (module_path) => {
        const module = await import(pathToFileURL(module_path).href);
        const [key] = Object.keys(module);

        return [key, module[key]];
    }),
);

export const config = deepmerge(
    Object.fromEntries(entries),
    user_config,
) as RunnerConfig;
