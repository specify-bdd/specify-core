import type { IConfiguration } from "@cucumber/cucumber/api";

export type CucumberConfig = Partial<IConfiguration>;

export const cucumber: CucumberConfig = {
    "format": [
        "progress-bar",
        // [ "html", "./reports/cucumber.html" ] // do we want this?
    ],
    "import": [
        // step definitions and support file paths go here
        // but everything we add here will be a default inclusion for everyone
    ],
    "language": "en",
    "loader": [
        // "ts-node/esm"
        // "tsx"
    ],
    "name": [],
    "order": "defined",
    "paths": [
        // gherkin feature file paths go here
        // so we should leave this blank so there are no features forcibly included
    ],
    "parallel": 1,
    "retry": 1,
    "retryTagFilter": "@retry",
    "strict": true,
    "worldParameters": {
        // similar value as to what you'd see if you ran $PATH in your terminal,
        // but there is also some node-specific path info added to it.
        "userPath": process.env.PATH,
    },
};
