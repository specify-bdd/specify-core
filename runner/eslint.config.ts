import eslint from "@eslint/js";
import globals from "globals";
import eslintPluginPrettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,

    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                extraFileExtensions: [".json"],
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
            },
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "no-console": "warn",
            "prefer-const": "error",
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                    tabWidth: 4,
                },
            ],
        },
    },
    {
        ignores: ["**/node_modules/**", "dist/**"],
    },
);
