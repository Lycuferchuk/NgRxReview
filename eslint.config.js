// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/prefer-inject': 'off',
      "prettier/prettier": "error",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "nxs",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "nxs",
          style: "kebab-case",
        },
      ],
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/interactive-supports-focus": "off",
      "@angular-eslint/template/click-events-have-key-events": "off",
    },
  }
);
