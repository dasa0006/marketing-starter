import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"node_modules/**",
		"next-env.d.ts",
		"coverage/**",
	]),
	...nextVitals,
	...nextTs,
	{
		plugins: {
			import: importPlugin,
		},
		rules: {
			// Core custom rules
			"no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
			"no-shadow": "error",
		},
	},
	eslintConfigPrettier,
]);

export default eslintConfig;
