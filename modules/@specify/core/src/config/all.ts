import deepmerge from "deepmerge";
import fs from "node:fs";
import path from "node:path";
import { globbySync } from "globby";
import { pathToFileURL } from "node:url";

import type { CoreConfig } from "~/types";

// the user's override file should be in the *current working directory*
const configPath = `${process.cwd()}/specify.config.json`;

let userConfig = {} as Partial<CoreConfig>;

if (fs.existsSync(configPath)) {
    userConfig = (
        await import(pathToFileURL(configPath).href, {
            "with": { "type": "json" },
        })
    ).default as Partial<CoreConfig>;
}

const modulePaths = globbySync(path.join(import.meta.dirname, "*.config.*"), {
    "absolute": true,
    "ignore": ["**/*.d.ts"],
    "onlyFiles": true,
});

const modules = await Promise.all(
    modulePaths.map((modulePath) => import(pathToFileURL(modulePath).href)),
);

export const entries = [];

for (const module of modules) {
    for (const key of Object.keys(module)) {
        entries.push([key, module[key]]);
    }
}

export const config = deepmerge(
    Object.fromEntries(entries),
    userConfig,
) as CoreConfig;
