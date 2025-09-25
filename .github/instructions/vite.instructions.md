---
applyTo: "packages/common/vitest/**/*.ts"
---

# Copilot Instructions for Vitest Migration

## Purpose
- This instruction file applies to all work in `packages/common/vitest`.
- All new and migrated tests should be written using Vitest, replacing legacy Jasmine tests in `packages/common/test`.
- **Requirement:** Maintain 100% code coverage of the `packages/common/src` folder as Jasmine tests are replaced.
  - Jasmine coverage is tracked via `karma.config.js`.
  - Vitest coverage is tracked via `vitest.config.mjs`.

## Coverage & Configuration
- Coverage is enforced via `vitest.config.mjs` (see `coverage.include` and `thresholds`).
- Run `npm test:common` from the root of the repository or `npm test` from `packages/common` to check coverage.
- There is no need to attempt to cover existing Istanbul ignore comments (e.g., `/* istanbul ignore else */`), but we should avoid adding new ones.

## Migration Workflow
We will do the migration incrementally, by batching up the files in `packages/common/src/`. For each file in the current batch:
1. ensure that it is covered by by the vitest coverage config
2. write a Vitest spec in this folder that will cover all the lines, statements, branches, and functions in the file.
3. if needed, you can refer to its corresponding Jasmine tests from `packages/common/test/`.
4. Ensure all branches, edge cases, and environment-specific logic are covered (including browser globals, deep cloning, etc.).
5. Use explicit types in all test code to maintain type safety and resolve TypeScript lint errors.
6. Don't remove the existing Jasmine tests, instead list out the Jasmine test files that correspond to the Vitest specs you have written, so that they can be removed later.

## Test File Conventions
- Name test files as `<module>.spec.ts` (e.g., `util.spec.ts`).
- Place all new specs in this folder; do not mix Jasmine and Vitest in the same folder or file.
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

## Example Migration Checklist
- [ ] Ensure the source file is covered by a glob in `coverage.include` in `vitest.config.mjs`
- [ ] Identify Jasmine test file in `test/` for a given `src/` module.
- [ ] Scaffold new Vitest spec in `vitest/` with matching coverage.
- [ ] Add tests for all branches, including environment-specific logic.
- [ ] Confirm 100% coverage in report.
- [ ] List corresponding Jasmine test file after migration.

## Additional Notes
- see `jasmine.instructions.md` for more details on the post-migration workflow for deleting Jasmine tests.
- If you encounter unclear patterns, refer to the main repo Copilot instructions or ask for clarification.
- Update this file as new migration patterns or requirements emerge.

---
For questions or migration blockers, contact maintainers or refer to the main repo instructions in `.github/copilot-instructions.md`.
