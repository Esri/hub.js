import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // allow tests to use globals like describe/it/expect without importing them
    // to make it easier to convert jasmine/karma tests which also use globals
    globals: true,
    include: [
      // we use .spec.ts for vitest and .test.ts for karma/jasmine
      "test/**/*.spec.ts"
    ],
    coverage: {
      enabled: true,
      include: [
        // ultimately we want all the src files to be covered
        // "src/**/*.ts"
        // but for now we are just getting started converting to vitest
        // so we list the src files that correspond to the specs we have converted so far
        "src/{api,util}.ts",
        "src/access/*.ts",
        "src/associations/**/*.ts",
        "src/channels/**/*.ts",
        "src/content/**/*.ts",
        "src/core/_internal/sharedWith.ts",
        // TW working below this line
        "src/sites/domains/**/*.ts",
        "src/surveys/**/*.ts",
        "src/templates/**/*.ts",
        "src/urls/*.ts",
        "src/users/*.ts",
        "src/utils/**/*.ts",
        "src/versioning/**/*.ts",
      ],
      // we have so many pre-existing istanbul ignore comments
      provider: "istanbul",
      // reporter: ["json", "html", "cobertura"],
      reportsDirectory: "./coverage",
      thresholds: {
        100: true
      }
    }
  }
});
