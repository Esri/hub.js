import { defineConfig } from "vite";
import * as coverage from "./vitest-coverage.js";

export default defineConfig({
  test: {
    include: [
      // we use .spec.ts for vitest and .test.ts for karma/jasmine
      "test/**/*.spec.ts"
    ],
    coverage
  }
});
