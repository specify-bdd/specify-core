export type PathsConfig = Record<string, string>;

export const paths: PathsConfig = {
    "gherkin": "./features/**/*.feature",
    "logs": ".",
    "refs": "./specify.refs.json",
};
