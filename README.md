# Specify Core

A developer-friendly suite of BDD tools built on Gherkin, Cucumber, and Selenium, with batteries-included step definitions / param types and support for adding your own.

[![NPM Version](https://img.shields.io/npm/v/%40specify-bdd%2Fspecify)](https://www.npmjs.com/package/@specify-bdd/specify)
![Node LTS](https://img.shields.io/node/v-lts/%40specify-bdd%2Fspecify)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40specify-bdd%2Fspecify)
![GitHub License](https://img.shields.io/github/license/specify-bdd/specify-core)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/specify-bdd/specify-core/release.yml)

![CodeQL](https://github.com/specify-bdd/specify-core/actions/workflows/github-code-scanning/codeql/badge.svg)
![Dependabot](https://github.com/specify-bdd/specify-core/actions/workflows/dependabot/dependabot-updates/badge.svg)

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
