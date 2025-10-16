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
        // so we list the src files that correspond to the specs we have converted so far
        "src/{api,util}.ts",
        "src/access/*.ts",
        "src/associations/**/*.ts",
        "src/core/_internal/sharedWith.ts",
        // TW working below this line
        "src/users/*.ts",
        "src/utils/date/**/*.ts",
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
