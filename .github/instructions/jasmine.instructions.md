---
applyTo: "packages/common/test/**/*.ts"
---

# Copilot Instructions for Jasmine Tests

## Purpose
- This instruction file applies to all work in `packages/common/test`.
- This is the folder containing legacy Jasmine tests for `packages/common/src`.
- We are migrating these tests to Vitest in `packages/common/vitest`.
- All new and migrated tests should be written using Vitest, replacing legacy Jasmine tests in `packages/common/test`.
- **Requirement:** Maintain 100% code coverage of the `packages/common/src` folder as Jasmine tests are replaced.
  - Jasmine coverage is tracked via `karma.config.js`.
  - Vitest coverage is tracked via `vitest.config.mjs`.

## Coverage & Configuration
- The Jasmine tests are run both in Node.js via ts-jasmine in browsers via Karma
- We have had to exclude several files from running via ts-jasmine due to being unable to `spyOn` the `@esri/arcgis-rest-*` modules, see `jasmine.node.json` for details.
- All tests, even those excluded from ts-jasmine, are run in Karma.
- Coverage is enforced via `karma.config.js` (see `coverageOptions`)
- To run tests with coverage, from the root of the repository run `npm run test:chrome`.

## Post Migration Workflow
Once a test file has been migrated to Vitest and we've confirmed equivalent coverage:
1. Delete the corresponding Jasmine test file from this folder.
2. After deleting the Jasmine test file, we'll need to add the corresponding source file to the `coverageOptions.exclude` array in `karma.config.js` so that the Karma coverage check passes.

## Test File Conventions
- Name test files as `<module>.test.ts` (e.g., `util.test.ts`).
- We should not add any new Jasmine tests.
- Use Jasmine's global `describe`, `it`, and `expect` for all assertions.
- Use `beforeEach` and `afterEach` for setup/teardown as needed.
- Use Jasmine's built-in mocking and spying utilities only as needed.
  - Most modules in `packages/common/src` are pure functions so there's no need to mock simple synchronous utility functions that are imported from another module.
  - For modules that interact with browser APIs or external dependencies:
    - Mock browser globals (e.g., `Blob`) as needed for Node.js coverage.
    - Mock implementations of `async` functions using `spyOn()` and resolving/rejecting values.

## Type Safety
- Avoid `any` in test code; use explicit types and type assertions.
- Resolve all TypeScript lint errors before considering migration complete.

## Additional Notes
- refer to vitest.instructions.md for more details on the migration workflow.
- If you encounter unclear patterns, refer to the main repo Copilot instructions or ask for clarification.
- Update this file as new migration patterns or requirements emerge.

---
For questions or migration blockers, contact maintainers or refer to the main repo instructions in `.github/copilot-instructions.md`.
