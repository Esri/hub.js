---
applyTo: "packages/common/test/**/*.ts"
---

# Copilot Instructions for Tests

## Purpose
- This instruction file applies to all work in `packages/common/test`.
- This is the folder containing tests for `packages/common/src`.
- We are in the process of migrating these tests from Jasmine to Vitest.
- Jasmine tests use the `.test.ts` suffix and Vitest tests use the `.spec.ts` suffix.
- The Jasmine tests are run both in Node.js via ts-jasmine in browsers via Karma
- All new tests should be written using Vitest. We should not add any new Jasmine tests.
- **Requirement:** Maintain 100% code coverage of the `packages/common/src` folder as Jasmine tests are replaced.
  - Jasmine coverage is tracked via `karma.config.js`.
  - Vitest coverage is tracked via `vitest.config.mjs`.

## Vitest Coverage & Configuration
- Coverage is enforced via `vitest.config.mjs` (see `coverage.include` and `thresholds`).
- Run `npm run test:vitest` from the root of the repository or `npm test` from `packages/common` to check coverage.
- There is no need to attempt to cover existing Istanbul ignore comments (e.g., `/* istanbul ignore else */`), but we should avoid adding new ones.

## Jasmine Coverage & Configuration
- Coverage is enforced via `karma.config.js` (see `coverageOptions`)
- To run tests with coverage, from the root of the repository run `npm run test:chrome`.
- After upgrading the `@esri/arcgis-rest-*` packages, we had to exclude any test that called `spyOn` those packages
  - see `jasmine.json` for the list of excluded tests

## Test File Conventions
- Name new test files as `<module>.spec.ts` (e.g., `util.spec.ts`).
- Use Vitest's `describe`, `it`, and `expect` for all assertions.
- Use `beforeEach` and `afterEach` for setup/teardown as needed.
- Use Vitest's built-in mocking and spying utilities only as needed.
  - Most modules in `packages/common/src` are pure functions so there's no need to mock simple synchronous utility functions that are imported from another module.
  - For modules that interact with browser APIs or external dependencies:
    - Mock browser globals (e.g., `Blob`) as needed for Node.js coverage.
    - Mock external dependencies using Vitest's `vi.mock()`
    - Mock implementations of `async` functions using `vi.fn().mockResolvedValue()`

## Type Safety
- Avoid `any` in test code; use explicit types and type assertions.
- Resolve all TypeScript lint errors before considering migration complete.

## Migration Workflow
We will do the migration incrementally, by batching up the files in `packages/common/src/`. For each file in the current batch:
1. ensure that it is covered by by the vitest coverage config
2. write a Vitest spec in this folder that will cover all the lines, statements, branches, and functions in the file.
3. if needed, you can refer to its corresponding Jasmine tests from `packages/common/test/`.
4. Ensure all branches, edge cases, and environment-specific logic are covered (including browser globals, deep cloning, etc.).
5. Use explicit types in all test code to maintain type safety and resolve TypeScript lint errors.
6. Once a test file has been migrated to Vitest and we've confirmed equivalent coverage, delete the corresponding Jasmine test file from this folder.
7. After deleting the Jasmine test file, we'll need to add the corresponding source file to `coverage.include` in `vitest.config.mjs` and to the `coverageOptions.exclude` array in `karma.config.js` so that the Karma coverage check passes.

## Additional Notes
- If you encounter unclear patterns, refer to the main repo Copilot instructions or ask for clarification.
- Update this file as new migration patterns or requirements emerge.

---
For questions or migration blockers, contact maintainers or refer to the main repo instructions in `.github/copilot-instructions.md`.
