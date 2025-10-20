**@specify-bdd/specify**

***

# Specify BDD

[![NPM Version](https://img.shields.io/npm/v/%40specify-bdd%2Fspecify)](https://www.npmjs.com/package/@specify-bdd/specify)
![Node LTS](https://img.shields.io/node/v-lts/%40specify-bdd%2Fspecify)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40specify-bdd%2Fspecify)
![GitHub License](https://img.shields.io/github/license/specify-bdd/specify-core)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/specify-bdd/specify-core/release.yml)

![CodeQL](https://github.com/specify-bdd/specify-core/actions/workflows/github-code-scanning/codeql/badge.svg)
![Dependabot](https://github.com/specify-bdd/specify-core/actions/workflows/dependabot/dependabot-updates/badge.svg)

Behavior-Driven Development (BDD) doesn't have to be a slog.  **Specify** makes it easy to turn requirements into
actionable tests, streamlining your development process with clear acceptance criteria, rapid iteration, and confident
deployments.

Built on [Cucumber.js](https://github.com/cucumber/cucumber-js) and enhanced with numerous convenience features and QOL
improvements informed by over a decade of experience in automated testing, Specify was built using the same BDD 
principles it exists to support.  We use Specify to test itself end-to-end (E2E) in addition to our unit and 
integration tests.  Whether you want to embrace BDD fully or just experiment with automated testing, Specify can help.

1. [Quick Start](#quick-start)
2. [Installation](#installation)
    * [Installing Plugins](#installing-plugins)
    * [Prerequisites](#prerequisites)
3. [Configuration](#configuration)
    * [Configuring Cucumber](#configuring-cucumber)
    * [Configuring Plugins](#configuring-plugins)
4. [Defining Behavior](#defining-behavior)
5. [Running Tests](#running-tests)
    * [Runtime Options](#runtime-options)
6. [Extending Specify](#extending-specify)
    * [Cucumber Support Code](#cucumber-support-code)
        * [Step Definitions](#step-definitions)
        * [Hooks](#hooks)
    * [Custom Plugins](#custom-plugins)
7. [Get Help](#get-help)

---

## Quick Start

Create a behavior spec file:

```gherkin
Feature: Gherkin feature file that should pass
    Scenario: Scenario that should pass
        When this step passes
```

Run the behavior spec as a test:

```bash
$ npx specify path/to/behavior.feature
.....

1 scenario (1 passed)
1 step (1 passed)
0m00.697s (executing steps: 0m00.009s)
```

## Installation

Specify can be downloaded with NPM.  It's recommended that you save it as a dev dependency for your project:

```bash
npm i -D @specify-bdd/specify
```

Alternatively, you can install the package globally:

```bash
npm i -g @specify-bdd/specify
```

### Installing Plugins

Specify ships with only a few demo step definitions, but many more are available for download as plugins.  Install these
additional packages in the same manner (dev dependency or global) as the main Specify package.

Official Specify plugin packages:
* [CLI](https://www.npmjs.com/package/@specify-bdd/plugin-cli) (`@specify-bdd/plugin-cli`): Command-line interface
  support

Plugins must be added to the Specify configuration before they can be used.  See
[Configuring Plugins](#configuring-plugins) for more info.

### Prerequisites

* Node.js v22.x (LTS Jod) or newer

## Configuration

Specify's default settings can be overridden by creating a file in the current working directory named 
`specify.config.json`.  (This should be the directory that the user will be executing `specify` commands from.)  This 
JSON object should conform to structure of a
[CoreConfig](https://github.com/specify-bdd/specify-core/blob/main/modules/%40specify-bdd/specify/types/index.d.ts).

### Configuring Cucumber

It is possible to change the default settings that Specify's instance of Cucumber.js uses by modifying the `cucumber`
property of `CoreConfig`.  In the following example, the output format of Cucumber is being set to JSON.

```json
{
  "cucumber": {
    "format": [ "json" ],
    "import": [ "path/to/cucumber/support/code" ]
  }
}
```

### Configuring Plugins

The `plugins` property of `CoreConfig` is an array of strings which identify Specify plugin packages by either their
scoped package name (the same one used to install the package) or a file system path for the directory which contains
the plugin's package.json file.  Only plugins included in this list are known to and usable by Specify.

```json
{
  "plugins": [ "@specify-bdd/plugin-cli" ]
}
```

## Defining Behavior

Behavior specifications are written in [Gherkin](https://cucumber.io/docs/gherkin/reference), a domain-specific language
which is easy for non-technical colleagues to read and understand, but structured enough to be machine-parsable.
Behavior is described in **feature** documents (text files with a .feature extension) covering one discrete unit of
user-facing functionality apiece.  Each feature is elaborated upon with **scenarios**, short narrative descriptions of 
how the feature ought to behave under various conditions.  These scenarios are made up of a series of **steps** which 
detail the exact sequence of user actions and system reactions that ought to take place.

Gherkin uses a small number of keywords (e.g. "Feature", "Scenario", "Given", "When", and "Then") to give the document 
structure and semantic meaning.  The rest of the language used to describe the desired behavior is freeform and up to
the feature's author.  However, using consistent and repeatable language to describe common actions can save a lot of
effort when it comes time to parse the Gherkin and take action.  See
[Step Definitions](#step-definitions) for more.

## Running Tests

With the behavior specs and any necessary supporting code in place, you can execute tests with the following command:

```bash
specify test [options] [paths...]
```

The `paths...` argument should be the path or paths of the behavior specs you want to execute.  If you put those specs
in the directory `./features` (relative to the location you are running the command from), they will be detected
automatically and no paths argument is required.

### Runtime Options

The following options governing the runtime behavior of Specify are available:

| Option                   | Description                                                                        |
| -------------------------| ---------------------------------------------------------------------------------- |
| -h, --help               | Display this help screen.                                                          |
| -p, --parallel <workers> | Run in parallel with the given number of workers.                                  |
| --rerun                  | Rerun the failed tests from the last test run.                                     |
| --rerun-file <path>      | The location of the rerun log file.                                                |
| -r, --retry <retries>    | Retry failed tests up to the given number of times before counting them as failed. |
| --retry-tag <tags>       | Only retry tests which satisfy this tag expression.                                |
| -t, --tags <tags>        | Run only the tests which satisfy this tag expression.                              |
| -w, --watch              | Watch for changes and re-run tests.                                                |

## Extending Specify

Specify's functionality is built to be modular and extensible by design because we knew there are too many corner cases
and unique requirements in BDD and automated testing for us to ever cover the spread ourselves.  While Specify aims to
provide for the most common use cases with our official plugins, we encourage others to build custom integrations to
meet their own needs and to publish compatible plugin packages when that need is shared by others.

### Cucumber Support Code

The simplest way to extend Specify functionality is with Cucumber support code additions.  New step definitions, hooks,
parameter types, etc. can be created within your project hierarchy and included by Cucumber using the `cucumber.import`
config setting.  See [Configuring Cucumber](#configuring-cucumber) for more details.

#### Step Definitions

A [step definition](https://cucumber.io/docs/cucumber/step-definitions?lang=javascript) is a piece of Cucumber support
code which matches a predefined pattern (represented as a 
[Cucumber expression](https://github.com/cucumber/cucumber-expressions#readme) or regexp) to a callback function.  The
pattern can include parameters (or capturing groups for regexp) which will extract matched values and pass them on to
the callback function.  Specify's plugins (see [Installing Plugins](#installing-plugins)) provide prebuilt step
definitions to help accelerate test automation, but you can also write your own step definitions to cover behaviors
unique to your use cases or combine multiple basic actions into one step.

#### Hooks

Cucumber [hooks](https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/hooks.md) allow you to execute 
custom code before and after steps, scenarios, and the entire test suite.  Setup/teardown, cleanup, and logging
operations commonly use this feature to ensure their own timely execution.

### Custom Plugins

While Cucumber support code can be stored in your project repo and imported via configuration, it may be useful to
package certain utilities for portability, so that they are easier to share between different projects or even publish
independently.  To this end, Specify is built on a plugin architecture which you can use to make your packages easy to
share and use.

To create a plugin, ensure that your utility's package.json file defines a `main` module which has, as its default
export, a `CoreConfig` object.  This object will be merged with those of other plugins as well as Specify's base config
and any user override JSON file which may exist.  If your package includes Cucumber support code which you want your
users to auto-import, simply configure the `cucumber` property of the `CoreConfig` object to include the paths of those
support files in its `import` sub-property as shown in the [Configuring Cucumber](#configuring-cucumber) section.

Additional plugin capabilities beyond adding Cucumber support code will be added in the future.

## Get Help

Having trouble with Specify?  We're here to help.

* [Ask a question](https://github.com/specify-bdd/specify-core/discussions/new?category=q-a)
* [Report an issue](https://github.com/specify-bdd/specify-core/issues/new?type=bug)
