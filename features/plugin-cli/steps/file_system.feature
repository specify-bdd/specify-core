Feature: File System Step Definitions
    As a software developer interested in using Specify to test CLI programs
    I want to be able to manage and interact with the local file system
    So that I can execute common operations without putting a lot of implementation details in the behavior spec

    Rule: I can change my working directory

        Background:
            Given that the "@specify-bdd/specify" NPM package is installed
            And that the "@specify-bdd/plugin-cli" NPM package is installed
            And a CLI shell

        Scenario:
            When the user changes the working directory to "./test"
            # Then the working directory will include "assets" 
