module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "./.eslintrc-baseline.js",
  ],
  rules: {
    // Add custom rules here
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/no-extra-semi": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["**/dist/**"],
            "message": "Importing from a 'dist' directory is not allowed."
          }
        ]
      }
    ],
    "@typescript-eslint/no-var-requires": "error",
  },
  overrides: [
    {
      files: ["**/*.test.ts"], // Files for tests
      rules: {
        // Rules specific for test files
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/require-await": "off", // Disable require-await for tests
        "no-unused-vars": "off", // Disable no-unused-vars
        "no-console": "off", // Disable no-console
        "@typescript-eslint/no-unsafe-member-access": "off", // Example rule for tests
        "@typescript-eslint/no-unsafe-assignment": "off", // Example rule for tests
        "no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["**/dist/**"],
                "message": "Importing from a 'dist' directory is not allowed."
              }
            ]
          }
        ],
        "@typescript-eslint/no-var-requires": "error",
        // ...
      },
    },
  ],
};
