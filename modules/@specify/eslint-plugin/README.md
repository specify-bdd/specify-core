# @specify/eslint-plugin

Custom ESLint rules for the Specify Core BDD testing framework that enforce consistent code alignment and styling across TypeScript files.

## Overview

This ESLint plugin provides three custom rules focused on code alignment:

- **`align-assignments`** - Aligns assignment operators (`=`) in adjacent variable declarations
- **`align-imports`** - Aligns import statements and their components for consistent formatting
- **`align-properties`** - Aligns object property values in multi-line object expressions

These rules help maintain a consistent, readable codebase by automatically formatting code to follow strict alignment patterns.

## Rules

### `align-assignments`

Enforces alignment of assignment operators in adjacent variable declarations and assignment expressions.

**✅ Correct:**

```typescript
const shortVar      = "value";
const muchLongerVar = "another value";
const medium        = "third value";
```

**❌ Incorrect:**

```typescript
const shortVar = "value";
const muchLongerVar = "another value";
const medium = "third value";
```

**Features:**

- Groups adjacent assignment statements automatically
- Handles `const`/`let`/`var` declarations and standalone assignments
- Automatically fixable with ESLint's `--fix` option
- Skips multi-line declarations and complex patterns

### `align-imports`

Enforces consistent alignment of import statements, including proper spacing around multi-line imports.

**✅ Correct:**

```typescript
import shortName                    from "./module1";
import { veryLongDestructuredName } from "./module2";

import {
    multiLineImport,
    anotherImport,
} from "./multi-line-module";

import { singleAfterMulti } from "./module3";
```

**❌ Incorrect:**

```typescript
import { shortName } from "./module1";
import { veryLongDestructuredName } from "./module2";
import { multiLineImport, anotherImport } from "./multi-line-module";
import { singleAfterMulti } from "./module3";
```

**Features:**

- Aligns `from` keywords and closing braces in import groups
- Enforces blank lines around multi-line imports
- Handles both destructured and default imports

### `align-properties`

Enforces alignment of object property values in multi-line object expressions.

**✅ Correct:**

```typescript
const config = {
    short:         "value",
    muchLongerKey: "another value",
    medium:        "third value",
};
```

**❌ Incorrect:**

```typescript
const config = {
    short: "value",
    muchLongerKey: "another value",
    medium: "third value",
};
```

**Features:**

- Only applies to multi-line objects (single-line objects are left unchanged)
- Skips method definitions and shorthand properties
- Handles complex nested structures

## Installation

### Standalone Installation

```bash
npm install --save-dev @specify/eslint-plugin
# or
yarn add --dev @specify/eslint-plugin
# or
pnpm add --save-dev @specify/eslint-plugin
```

### Monorepo Usage

If you're working within the Specify Core workspace, the plugin is automatically available upon install:

```bash
pnpm install
```

## Usage

Add the plugin to your ESLint configuration:

```typescript
// eslint.config.ts
export default [
    {
        plugins: {
            "@specify-eslint": specifyEslintPlugin,
        },
        rules: {
            "@specify-eslint/align-assignments": "error",
            "@specify-eslint/align-imports": "error",
            "@specify-eslint/align-properties": "error",
        },
    },
];
```

### Running the Linter

These instructions are applicable to the monorepo, and may differ slightly based on your setup:

```bash
# Check all files
pnpm lint

# Auto-fix alignment issues
pnpm lint:fix

# Check specific files
npx eslint src/**/*.ts --fix
```

## Development

### Project Structure

```
modules/@specify/eslint-plugin/
├── README.md    # This file
├── package.json # Package configuration
├── main.ts      # Plugin entry point
├── lib/
│   └── utils.ts # Shared utility functions
└── rules/
    ├── align-assignments.ts # Assignment alignment rule
    ├── align-imports.ts     # Import alignment rule
    └── align-properties.ts  # Property alignment rule
```

### Utility Functions

The `lib/utils.ts` file provides shared helper functions:

- `isSingleLineNode(node)` - Checks if a node spans a single line
- `isMultiLineNode(node)` - Checks if a node spans multiple lines
- `hasEmptyLineBetween(node1, node2)` - Checks for blank lines between nodes

### Contributing

When modifying rules:

1. Update the rule implementation in `rules/`
2. Test with the existing codebase: `pnpm lint`
3. Run the full test suite: `pnpm test`
4. Update this README if adding new functionality

### Rule Development Guidelines

- All rules should be auto-fixable when possible
- Handle edge cases gracefully (complex destructuring, comments, etc.)
- Group related nodes intelligently (respect blank line separators)
- Preserve existing code structure where alignment doesn't apply

## Dependencies

- **@typescript-eslint/utils**: TypeScript ESLint utilities for AST manipulation
- **eslint**: Core ESLint engine (peer dependency)
- **typescript**: TypeScript compiler (peer dependency)

## License

Part of the Specify Core project. See the main project README for license information.
