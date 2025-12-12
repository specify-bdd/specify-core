**@specify-bdd/plugin-cli**

***

# Specify BDD - CLI Plugin

This plugin for [Specify BDD](https://www.npmjs.com/package/@specify-bdd/specify) provides a bundle of Cucumber support
code designed to make testing CLI commands in a shell simple.  Please refer to the core package's README file for 
instructions on installation and configuration.

## Cucumber Support Code

### Step Definitions

#### File System

* Given a new temp file path referenced as {string}
* Given (that )the {filePath} file content is {string}
* Given (that )the {filePath} file content is empty
* Given (that )the {ref} file content is {string}
* Given (that )the {ref} file content is empty
* Then the {filePath} file content should be empty
* Then the {filePath} file content should match {ref}
* Then the {filePath} file path should exist
* Then the {ref} file content should be empty
* Then the {ref} file content should match {ref}
* Then the {ref} file path should exist
* When a/the user changes the {filePath} file content to {string}
* When a/the user creates the {filePath} file
* When a/the user deletes the {filePath} file

#### Packages

* Given (that )the {refstr} NPM package is installed

#### Shell

* Given a/another CLI shell
* Given (that )the working directory is {filePath}
* Then the last command's execution time should be at least {float} seconds
* Then the last command's execution time should be at most {float} seconds
* Then the last command's exit code/status should be {int}
* Then the last command's exit code/status should be {ref}
* Then the last command's exit code/status should be a/an {int}
* Then the last command's exit code/status should be a/an {ref}
* Then the last command's terminal output should match (the regular expression ){ref}
* Then the last command's terminal output should match (the regular expression ){regexp}
* Then the last command's terminal output should not match (the regular expression ){ref}
* Then the last command's terminal output should not match (the regular expression ){regexp}
* When a/the user changes the working directory to {filePath}
* When a/the user runs the command/process {refstr}
* When a/the user sends a {cliSignal} signal to the last command
* When a/the user starts a/another CLI shell
* When a/the user starts the (async )command/process {refstr}
* When a/the user switches CLI shells
* When a/the user waits for the last command to return
* When a/the user waits for terminal output
* When a/the user waits for terminal output matching (the regular expression ){ref}
* When a/the user waits for terminal output matching (the regular expression ){regexp}
* When a/the user waits for terminal output on STDERR
* When a/the user waits for terminal output on STDOUT
* When a/the user waits for terminal output on STDERR matching (the regular expression ){ref}
* When a/the user waits for terminal output on STDERR matching (the regular expression ){regexp}
* When a/the user waits for terminal output on STDOUT matching (the regular expression ){ref}
* When a/the user waits for terminal output on STDOUT matching (the regular expression ){regexp}

### Hooks

* Before scenario: initialize a CLI property on the World instance
* After scenario: terminate any remaining shell sessions
* After all: clean up temp files created by scenarios
