import path from "node:path";

import type { IConfiguration } from "@cucumber/cucumber/api";

export type CucumberConfig = Partial<IConfiguration>;

export const cucumber: CucumberConfig = {
    "retry":           1,
    "retryTagFilter":  "@flaky or @retry",
    "tags":            "not @skip",
    "worldParameters": {
        // The path of the refs file relative to the project root
        "refsPath": path.resolve("./*.refs.json"),
        // similar value as to what you'd see if you ran $PATH in your terminal,
        // but there is also some node-specific path info added to it.
        "userPath": process.env.PATH,
    },
};
