import { defineConfig } from "vite";

export default defineConfig({
  test: {
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
        "src/{api,util}.ts",
        "src/associations/internal/getIncludesAndReferencesQuery.ts",
        "src/core/_internal/sharedWith.ts",
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
