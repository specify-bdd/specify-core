import deepmerge from "deepmerge";
import fs from "node:fs";
import path from "node:path";
import { globbySync } from "globby";
import { pathToFileURL } from "node:url";

import type { RunnerConfig } from "@/types";

const __dirname = new URL(".", import.meta.url).pathname;

// the user's override file should be in the *current working directory*
const config_path = `${process.cwd()}/specify.config.json`;
const config_exists = fs.existsSync(config_path);

let user_config = {} as Partial<RunnerConfig>;

if (config_exists) {
    user_config = (await import(pathToFileURL(config_path).href))
        .default as Partial<RunnerConfig>;
}

const modules = globbySync(path.join(__dirname, "*.config.ts"), {
    "absolute": true,
});

export const entries = await Promise.all(
    modules.map(async (module_path) => {
        const module = await import(pathToFileURL(module_path).href);
        const [key] = Object.keys(module);

        return [key, module[key]];
    }),
);

export const config = deepmerge(
    Object.fromEntries(entries),
    user_config,
) as RunnerConfig;
