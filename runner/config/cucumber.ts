const cucumber: object = {
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
        "worldParameters": {}
    };

export { cucumber };
