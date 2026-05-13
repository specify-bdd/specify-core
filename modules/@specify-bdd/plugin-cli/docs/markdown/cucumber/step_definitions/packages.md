# Package Step Definitions Module

Cucumber step definitions covering Node.js package management.

## Assert NPM package installed

- `Given (that )the {refstr} NPM package is installed`

Verifies that the given name is a valid NPM package identifier and that the package is resolvable in the current environment.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the package to verify |
