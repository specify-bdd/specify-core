**@specify-bdd/plugin-cli**

***

# Specify BDD - CLI Plugin

This plugin for [Specify BDD](https://www.npmjs.com/package/@specify-bdd/specify) provides a bundle of Cucumber support
code designed to make testing CLI commands in a shell simple.  Please refer to the core package's README file for 
instructions on installation and configuration.

## Cucumber Support Code

### Step Definitions

- [Commands](_media/commands.md)
- [File System](_media/file_system.md)
- [Input](_media/input.md)
- [Output](_media/output.md)
- [Packages](_media/packages.md)
- [Shell Sessions](_media/shells.md)

### Hooks

* Before scenario: initialize a CLI property on the World instance
* After scenario: terminate any remaining shell sessions
* After all: clean up temp files created by scenarios
