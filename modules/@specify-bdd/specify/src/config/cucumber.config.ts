import type { IConfiguration } from "@cucumber/cucumber/api";

export type CucumberConfig = Partial<IConfiguration>;

export const cucumber: CucumberConfig = {
    "retry":           1,
    "retryTagFilter":  "@retry",
    "tags":            "not @skip",
    "worldParameters": {
        // similar value as to what you'd see if you ran $PATH in your terminal,
        // but there is also some node-specific path info added to it.
        "userPath": process.env.PATH,
    },
};
