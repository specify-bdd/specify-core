import os from "node:os";

export type PathsConfig = {
    [key: string]: string;
    "gherkin": string;
    "logs": string;
};

export const paths: PathsConfig = {
    "gherkin":              "./features/**/*.feature",
    "logs":                 "./logs/specify",
    "rerun":                `${os.tmpdir()}/specify/rerun.txt`,
    "testExecutionContext": ".",
};
