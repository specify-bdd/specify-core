# Specify Core

A developer-friendly suite of BDD tools built on Gherkin, Cucumber, and Selenium, with batteries-included step definitions / param types and support for adding your own.

<!-- ![CI](https://img.shields.io/github/actions/workflow/status/your-org/specify/ci.yml?branch=main) -->
[![npm version](https://img.shields.io/npm/v/specify)](https://www.npmjs.com/package/specify)
[![License](https://img.shields.io/github/license/your-org/specify)](LICENSE)

## Features

- Gherkin/Cucumber-based test syntax
- CLI interface for CI/CD environments
- Browser local/grid testing via Selenium WebDriver
- Plugins for reusable step definitions / param types
- Support for custom step definitions / param types
- Retry and rerun support for flaky or failed tests

## Available Packages/Plugins
- [Runner](https://github.com/software-pirates/specify-core/tree/main/runner#readme)
  - Browser
  - CLI

## Development environment setup

Setup is as easy as running `npm ci` from your root project directory, no configuration required!

## Contributing

We welcome contributions! To get started:

1. Fork this repository
2. Create a new branch: `git switch -c dev/<issue-number>/short-descriptive-name`
3. Commit your changes
4. Push to your branch: `git push origin dev/<issue-number>/short-descriptive-name`
5. Open a pull request

_Note: Make sure to follow our [contributing guide](CONTRIBUTING.md)._

## License

This project is licensed under the [MIT License](LICENSE).

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
