**@specify-bdd/specify**

***

# Specify Core

### Prerequisites

- Node.js v22 or newer
- If browser testing locally:
  - Chrome, Edge, Firefox, or Safari browser install

## Project Structure

```
your-project/
├── features/
│   ├── *.feature        # Your Gherkin feature files
│   └── steps/           # Custom step definitions (optional)
├── specify.config.json  # Specify config (optional)
└── ...
```

## Quick Start

1. Installation

    ```bash
    npm i -D @specify-bdd/specify
    ```

1. Execute the features

    ```bash
    npx specify
    ```

    or 

    ```bash
    npx specify test
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

## Extending Specify

Specify is designed to be extensible:

- Plug in custom step definitions
- Configure runtime behavior via `specify.config.json` in your project's `root` directory
- Integrate with any WebDriver-compatible browser

### Custom Step Definitions

**I AM A STUB, FIX ME @adamlacoste**
