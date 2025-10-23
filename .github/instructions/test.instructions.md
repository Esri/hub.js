---
applyTo: "packages/common/test/**/*.ts"
---

# Copilot Instructions for Tests

## Purpose
- This instruction file applies to all work in `packages/common/test`.
- This is the folder containing tests for `packages/common/src`.
- These tests are currently executed using Vitest, but most were migrated from Jasmine.
- **Requirement:** Maintain 100% code coverage of the `packages/common/src` folder at all times.

## Running Tests
- Run `npm test` to run all tests and verify that they pass
- Run `npm run test:coverage` to run all tests and verify that they pass and that code coverage is 100%.
- Run `npm run test:watch` to start Vitest in watch mode for iterative development.
- Append `-- path/to/folder` to any of the above commands to limit the run to a specific folder.

## Configuration & Coverage
- Vitest is configured via `vitest.config.mjs`.
- Use Istanbul ignore comments (e.g., `/* istanbul ignore else */`), but only for scenarios that are truly untestable.

## Test File Conventions
When creating new test files, or updating existing tests, please follow these conventions:
- Name new test files as `<module>.spec.ts` (e.g., `util.spec.ts`).
- Use Vitest's `describe`, `it`, and `expect` for all assertions.
- Use Vitest's `beforeEach` and `afterEach` for setup/teardown as needed.
- Use Vitest's built-in mocking and spying utilities only as needed.
- NOTE: you should `import` all of the above from `vitest` even though we enabled Vitest's `globals` option to make the migration from Jasmine easier. We will eventually want to phase out the `globals` option.
- Mocking and Spying:
  - For modules that interact with browser APIs or external dependencies:
    - Mock browser globals (e.g., `Blob`) as needed for Node.js coverage.
    - Mock external dependencies using Vitest's `vi.mock()`
    - Special note for `@esri/arcgis-rest-*` packages:
      - These packages export ESM namespace objects which are not safely spyable after import. Register an async `vi.mock()` at the top of your spec (before importing the module-under-test) to merge the original module via `importOriginal()` and override only the functions you need to spy on. For the canonical example and extra tips, see the repository agent chatmode: `.github/chatmodes/test-migration.chatmode.md`.
      - After tests, restore mocks to avoid cross-test leakage: `afterEach(() => vi.restoreAllMocks())`.
- Resolve all TypeScript lint errors before committing changes.
  - prefer using explicit types over `any` in test code

## Additional Notes
- Update this file as new test file patterns or requirements emerge.
