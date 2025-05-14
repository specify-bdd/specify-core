# Specify Core

A developer-friendly BDD tool built on Gherkin, Cucumber, and Selenium — with built-in step definitions / param types and support for adding your own as well.

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

## Quick Start

### Prerequisites

- Node.js v18 or newer
- If browser testing locally:
  - Chrome, Firefox, or Safari browser install

### Install

```bash
npm install --save-dev specify
```

### Write a Feature File

```gherkin
@todo
```

### Run Tests

```bash
npx specify test
```

or 

```bash
npx specify
```

## CLI Usage

```bash
npx specify [subcommand] [options] [argument]
```

### Common Options

| Option                | Description                          |
|-----------------------|--------------------------------------|
| `--parallel <n>`      | Run the tests using `n` cpu cores    |
| `--rerun`             | Rerun only previously failed tests   |
| `--retry <n>`         | Retry failed tests up to `n` times   |
| `--retry-tag <tag>`   | Retry only tests with a specific tag |

### Browser Testing Options
| Option                | Description                                 |
|-----------------------|---------------------------------------------|
| `--headless`          | Execute in headless mode (default)          |
| `--visual`            | Execute in non-headless mode                |
| `--grid <url>`        | Execute in a selenium grid located at `url` |

## Project Structure

```
your-project/
├── features/
│   ├── *.feature           # Gherkin feature files
│   └── steps/              # Custom step definitions (optional)
├── specify.config.js       # Specify config (optional)
└── ...
```



## Extending Specify

Specify is designed to be extensible:

- Plug in custom step definitions
- Configure runtime behavior via `specify.config.js`
- Integrate with any WebDriver-compatible browser

### Custom Step Definitions

You can write and register your own step definitions:

```js
// features/steps/custom.js
const { Given } = require("specify");

Given("the app is running", async () => {
    // your logic here
});
```

## Contributing

We welcome contributions! To get started:

1. Fork this repository
2. Create a new branch: `git switch -c work/<issue-number>/my-feature`
3. Commit your changes
4. Push to your branch: `git push origin work/<issue-number>/my-feature`
5. Open a pull request

_Note: Make sure to follow our [contributing guide](CONTRIBUTING.md)._

## License

This project is licensed under the [MIT License](LICENSE).

## Related Projects

- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Cucumber](https://github.com/cucumber/cucumber-js)
- [Selenium WebDriver](https://www.selenium.dev/documentation/)

## FAQ

**Q: Can I use my own step definitions?**  
Yes. Place them in a `features/steps/` directory and they will be automatically imported for use in Specify.

**Q: Is this only for browser testing?**  
No. You can use Specify for CLI or API testing as well.

## Contact

For questions, bugs, or feature requests, please [open an issue](https://github.com/software-pirates/specify-core/issues).
