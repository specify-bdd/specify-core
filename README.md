# Specify Core

A developer-friendly suite of BDD tools built on Gherkin, Cucumber, and Selenium, with batteries-included step definitions / param types and support for adding your own.

[![NPM](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fspecify-bdd%2Fspecify-core%2Frefs%2Fheads%2Fmain%2Fpackage.json&query=%24.version&label=NPM)](https://www.npmjs.com/package/@specify-bdd/specify)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://raw.githubusercontent.com/specify-bdd/specify-core/refs/heads/main/LICENSE)
[![CI](https://github.com/specify-bdd/specify-core/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/specify-bdd/specify-core/actions/workflows/release.yml)
[![CodeQL](https://github.com/specify-bdd/specify-core/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/specify-bdd/specify-core/actions/workflows/github-code-scanning/codeql)
[![Dependabot](https://github.com/specify-bdd/specify-core/actions/workflows/dependabot/dependabot-updates/badge.svg?branch=main)](https://github.com/specify-bdd/specify-core/actions/workflows/dependabot/dependabot-updates)

## Features

- Gherkin/Cucumber-based test syntax
- CLI interface for CI/CD environments
- Browser local/grid testing via Selenium WebDriver
- Plugins for reusable step definitions / param types
- Support for custom step definitions / param types
- Retry and rerun support for flaky or failed tests

## Available Packages/Plugins
- [Core](https://github.com/software-pirates/specify-core/tree/main/modules/@specify/core#readme)
  - [CLI](https://github.com/software-pirates/specify-core/tree/main/modules/@specify/plugin-cli#readme)

## Development Environment Setup

Setup is as easy as running `npm ci` from your root project directory, no configuration required!

## Contributing

We welcome contributions! To get started:

1. Fork this repository
2. Create a new branch: `git switch -c dev/<issue-number>/short-descriptive-name`
3. Commit your changes
4. Push to your branch: `git push origin dev/<issue-number>/short-descriptive-name`
5. Open a pull request

_Note: Make sure to follow our [contributing guide](CONTRIBUTING.md)._

## Related Projects

- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Cucumber](https://github.com/cucumber/cucumber-js)
- [Selenium WebDriver](https://www.selenium.dev/documentation/)

## FAQ

**Can I use my own step definitions?**  
Yes, place them in `your-project/features/steps/` and they will be automatically imported for use in Specify.

**Is this only for browser testing?**  
No, you can use Specify for CLI or API testing as well.

## Contact

For questions, bugs, or feature requests, please [open an issue](https://github.com/software-pirates/specify-core/issues).
