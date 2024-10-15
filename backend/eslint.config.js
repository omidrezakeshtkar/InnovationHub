const globals = require("globals");
const pluginJs = require("@eslint/js");
const tseslint = require("typescript-eslint");

const config = tseslint.config(
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ["**/*.js"],
		languageOptions: { sourceType: "script" },
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		rules: {
			"@typescript-eslint/no-misused-promises": "warn",
			"@typescript-eslint/promise-function-async": "error",
		},
	},
	{
		languageOptions: {
			parserOptions: {
				project: true,
				tsconfigRootDir: __dirname,
			},
		},
	}
);

module.exports = config;
