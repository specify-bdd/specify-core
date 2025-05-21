import eslint from "@eslint/js";
import globals from "globals";
import eslintParserJSONC from "jsonc-eslint-parser";
import eslintPluginJSONC from "eslint-plugin-jsonc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTSDoc from "eslint-plugin-tsdoc";
import stylisticJs from "@stylistic/eslint-plugin-js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,

    // json/jsonc-eslint
    {
        "files": ["**/*.json"],
        "languageOptions": {
            "parser": eslintParserJSONC,
        },
        "plugins": {
            "jsonc": eslintPluginJSONC,
        },
        "rules": {
            "jsonc/array-bracket-newline": [
                "error",
                { "multiline": true, "minItems": 2 },
            ],
            "jsonc/array-bracket-spacing": ["error", "always"],
            "jsonc/indent": ["error", 4],
            "jsonc/object-curly-spacing": ["error", "always"],
            "jsonc/no-dupe-keys": "error",
            "jsonc/quote-props": ["error", "always"],
        },
    },

    // typescript-eslint
    {
        "files": ["**/*.ts"],
        "languageOptions": {
            "parser": tseslint.parser,
            "parserOptions": {
                "ecmaVersion": "latest",
                "sourceType": "module",
                "extraFileExtensions": [".json"],
                "project": "./tsconfig.eslint.json",
                "tsconfigRootDir": import.meta.dirname,
            },
            "globals": {
                ...globals.node,
            },
        },
        "plugins": {
            "@stylistic/js": stylisticJs,
            "prettier": eslintPluginPrettier,
            "tsdoc": eslintPluginTSDoc,
        },
        "rules": {
            "@stylistic/js/quote-props": ["error", "always"],
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "@typescript-eslint/no-floating-promises": "error",
            "no-console": "warn",
            "prefer-const": "error",
            "prettier/prettier": [
                "error",
                {
                    "endOfLine": "auto",
                    "quoteProps": "preserve", // hugely important; conflicts with @stylistic/js/quote-props if not set
                    "tabWidth": 4,
                },
            ],
            "tsdoc/syntax": ["warn"],
        },
    },
    {
        "ignores": [
            "**/*.d.ts",
            "**/.DS_Store/**",
            "**/.vscode/**",
            "**/node_modules/**",
            "**/dist/**",
            "**/package.json",
            "**/package-lock.json",
        ],
    },
);
