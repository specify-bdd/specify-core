# Specify BDD - Browser Plugin

This plugin for [Specify BDD](https://www.npmjs.com/package/@specify-bdd/specify) provides a bundle of Cucumber support
code designed to make browser testing simple.  Please refer to the core package's README file for instructions on
installation and configuration.

## Cucumber Support Code

### Step Definitions

- [Navigation](docs/markdown/cucumber/step_definitions/navigation.md)
- [Session](docs/markdown/cucumber/step_definitions/session.md)
- [Tabs](docs/markdown/cucumber/step_definitions/tabs.md)
- [Window](docs/markdown/cucumber/step_definitions/window.md)

### Hooks

* Before scenario: initialize a browser property on the World instance
* After scenario: terminate any remaining browser sessions
