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
- All new tests should be written using Vitest. We should **not** add any new Jasmine tests.
- **Requirement:** Maintain 100% code coverage of the `packages/common/src` folder once the Jasmine tests have been replaced.
  - Jasmine coverage is configured via `karma.config.js`.
  - Vitest coverage is configured via `vitest.config.mjs`.

## Vitest Coverage & Configuration
- Coverage is configured via `vitest.config.mjs` (see `coverage.include` and `thresholds`).
- Run `npm run test -w @esri/hub-common` from the root of the repository or `npm test` from `packages/common` to check coverage.
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
- To make it easy to convert from Jasmine/Karma, we have enabled Vitest's `globals` option so that you can use `describe`, `it`, and `expect` without importing them. However new tests should import them explicitly if possible.
- Mocking and Spying:
  - For modules that interact with browser APIs or external dependencies:
    - Mock browser globals (e.g., `Blob`) as needed for Node.js coverage.
    - Mock external dependencies using Vitest's `vi.mock()`

    - Special note for `@esri/arcgis-rest-*` packages:
      - These packages export ESM namespace objects which are not safely spyable after import. To make individual exported functions spyable, register an async mock at the top of your spec that merges the original module via the `importOriginal` factory and overrides only the functions you need to spy on. Example:

        ```ts
        // at the very top of the spec, before importing the module-under-test
        vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
          ...(await importOriginal()),
          getItem: vi.fn(),
          getItemData: vi.fn(),
        }));
        ```

      - Important: register this `vi.mock()` before importing the code that will call or spy on those exports. Otherwise the exports cannot be replaced and `vi.spyOn` won't work.
      - After tests, restore mocks to avoid cross-test leakage: `afterEach(() => vi.restoreAllMocks())`.

## Type Safety
- Avoid `any` in test code; use explicit types and type assertions.
- Resolve all TypeScript lint errors before considering migration complete.

## Migration Workflow
We will do the migration incrementally, folder by folder, for all the tests under `packages/common/test/`.

First, add the corresponding folder under `packages/common/src/` to Vitest's coverage in `vitest.config.mjs`. 

Then For each test file in the current folder:
1. Rename the file from `.test.ts` to `.spec.ts`.
2. Convert the test code from Jasmine to Vitest syntax, ensuring equivalent functionality.Take special care with files that:
  - spy on functions from `@esri/arcgis-rest-*` packages. These will require you to add `vi.mock()` calls to mock the relevant modules at the top of the file.
  - call `ArcGISContextManager.create()`. This is an invalid pattern and should be replaced with a mock context object.
3. Resolve TypeScript lint errors - it's ok to use `any` when converting files, but we prefer to use explicit types when practical.
4. Run the Vitest tests and ensure they pass and that coverage remains at 100%.
  - if tests are passing but coverage is not yet at 100%, pause to allow for checking in the converted tests before attempting to increase coverage.

Once all tests in the folder have been converted and Vitest coverage is at 100% for the current folder, we should commit and push the changes to ensure they work in CI.

Then we can move on to the next folder.

## Additional Notes
- If you encounter unclear patterns, refer to the main repo Copilot instructions or ask for clarification.
- Update this file as new migration patterns or requirements emerge.

---
For questions or migration blockers, contact maintainers or refer to the main repo instructions in `.github/copilot-instructions.md`.
