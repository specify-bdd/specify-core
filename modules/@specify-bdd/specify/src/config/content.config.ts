export type ContentConfig = {
    help: HelpContent;
};

type HelpContent = {
    specify: SpecifyHelpContent;
};

type SpecifyCommandsHelpContent = {
    help: string;
    test: SpecifyTestCommandHelpContent;
};

type SpecifyHelpContent = {
    commands: SpecifyCommandsHelpContent;
    options:  SpecifyOptionsHelpContent;
};

type SpecifyOptionsHelpContent = {
    help: string;
    version: string;
};

type SpecifyTestCommandArgumentsHelpContent = {
    paths: string;
};

type SpecifyTestCommandHelpContent = {
    arguments: SpecifyTestCommandArgumentsHelpContent;
    description: string;
    options: SpecifyTestCommandOptionsHelpContent;
    summary: string;
};

type SpecifyTestCommandOptionsHelpContent = {
    help: string;
    tags: string;
    watch: string;
};

export const content: ContentConfig = {
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
                        "help":  "Display this help screen.",
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
