const contentObj = {
    "help": {
        "specify": {
            "commands": {
                "help": "Display help info for a command.",
                "test": {
                    "arguments": {
                        "paths": "The path(s) to the specification files to test.",
                    },
                    "description":
                        "Read behavior specifications written in Gherkin syntax and execute tests enacting the described behavior.  Utilizes Cucumber.js (https://github.com/cucumber/cucumber-js) under the hood.",
                    "options": {
                        "help":     "Display this help screen.",
                        "parallel": "Run in parallel with the given number of workers.",
                        "retry":
                            "Retry failed tests up to the given number of times before counting them as failed. (default: %d)",
                        "retryTag":
                            "Only retry tests which satisfy this tag expression. (default: %s)",
                        "tags":  "Run only the tests which satisfy this tag expression.",
                        "watch": "Watch for changes and re-run tests.",
                    },
                    "summary":
                        "Test behavior specifications.  Default if no other command is used.",
                },
            },
            "options": {
                "help":    "Display this help screen.",
                "version": "Display the version of this software.",
            },
        },
    },
};

export type ContentConfig = typeof contentObj;

export const content: ContentConfig = contentObj;
