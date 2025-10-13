import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: [
      "vitest/**/*.{test,spec}.?(c|m)[jt]s?(x)",
    ],
    coverage: {
      enabled: true,
      include: [
        // ultimately we want all the src files to be covered
        // "src/**/*.ts"
        // but for now we are just getting started converting to vitest
        "src/util.ts",
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
