const cucumber: object = {
        "format": [
            "progress-bar",
            // [ "html", "./reports/cucumber.html" ] // do we want this?
        ],
        "import": [],
        "language": "en",
        "loader": [
            "ts-node/esm"
        ],
        "name": [],
        "order": "defined",
        "paths": [
            "features/**/*.feature"
        ],
        "parallel": 1,
        "retry": 0,
        "retryTagFilter": "@retry",
        "strict": true,
        "worldParameters": {}
    };

export { cucumber };
