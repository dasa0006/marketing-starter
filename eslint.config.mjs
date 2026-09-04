// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
    "coverage/**",
    "storybook-static/**",
]), ...nextVitals, ...nextTs, {
    plugins: {
        import: importPlugin,
    },
    rules: {
        // Core custom rules
        "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "no-shadow": "error",
    },
}, eslintConfigPrettier, ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
