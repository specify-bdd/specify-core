# Specify BDD

Behavior-Driven Development (BDD) doesn't have to be a slog.  **Specify** makes it easy to turn requirements into
actionable tests, streamlining your development process with clear acceptance criteria, rapid iteration, and confident
deployments.

Built on [Cucumber.js](https://github.com/cucumber/cucumber-js) and enhanced with numerous convenience features and QOL
improvements informed by over a decade of experience in automated testing, Specify was built using the same BDD 
principles it exists to support.  We use Specify to test itself end-to-end (E2E) in addition to our unit and 
integration tests.  Whether you want to embrace BDD fully or just experiment with automated testing, Specify can help.

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

Specify ships with only a few demo step definitions, but many more are available for download as [plugins](#plugins).
Install these additional packages in the same manner (dev dependency or global) as the main Specify package.

### Prerequisites

- Node.js v22.x (LTS Jod) or newer

## Configuration

TODO

### Plugins

TODO

## Defining Behavior

TODO

## Running Tests

TODO

### Runtime Options

TODO

## Extending Specify

TODO

### Cucumber Support Code

TODO

#### Step Definitions

TODO

#### Hooks

TODO

### Custom Plugins

TODO

## Get Help

TODO
