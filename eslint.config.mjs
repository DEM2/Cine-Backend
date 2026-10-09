import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["app/dist/**", "app/node_modules/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["app/src/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "warn",
    },
  },
);