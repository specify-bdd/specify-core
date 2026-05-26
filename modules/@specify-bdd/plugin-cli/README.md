# Specify BDD - CLI Plugin

This plugin for [Specify BDD](https://www.npmjs.com/package/@specify-bdd/specify) provides a bundle of Cucumber support
code designed to make testing CLI commands in a shell simple.  Please refer to the core package's README file for 
instructions on installation and configuration.

## Cucumber Support Code

### Step Definitions

- [Commands](docs/markdown/cucumber/step_definitions/commands.md)
- [File System](docs/markdown/cucumber/step_definitions/file_system.md)
- [Input](docs/markdown/cucumber/step_definitions/input.md)
- [Output](docs/markdown/cucumber/step_definitions/output.md)
- [Packages](docs/markdown/cucumber/step_definitions/packages.md)
- [Shell Sessions](docs/markdown/cucumber/step_definitions/shells.md)

### Hooks

* Before scenario: initialize a CLI property on the World instance
* After scenario: terminate any remaining shell sessions
* After all: clean up temp files created by scenarios
