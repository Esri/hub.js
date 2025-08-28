# Copilot Instructions for hub.js

## Architecture Overview

- **hub.js** is a modular TypeScript monorepo for ArcGIS Hub, organized into packages under `packages/` (e.g., `common`, `sites`, `initiatives`, `search`).
- Each package is published independently and contains its own types, utilities, and API wrappers.
- Designed for both Node.js and browser environments.

## Data Flow & Major Components

- **Entities** (e.g., Catalog, Site, Initiative) are represented as TypeScript interfaces/classes, with runtime migration patterns for schema evolution (see `docs/src/guides/advanced/schema-versioning.md`).
- **Permissions** are asserted using policy objects and context-based checks (see `packages/common/src/permissions/README.md`).
- **Search** is unified via the `hubSearch` function, which delegates to entity- and API-specific logic (see `packages/common/src/search/docs/README.md`).
- **Service status** and user context are mocked for tests in `packages/common/test/mocks/mock-auth.ts`.

## Developer Workflows

- **Install dependencies:** `npm install` (use [volta](https://volta.sh/) for Node/npm version management).
- **Build all packages:** `npm run build` (runs ESM and CJS builds for all packages).
- **Run all tests:** `npm test` (Node and browser tests; see also `npm run test:chrome:debug`).
- **Debug Node tests:** Use the `Debug Node Tests` config in `.vscode/launch.json`.
- **Serve docs locally:** `npm run docs:serve` (http://localhost:3000).

## Project Conventions

- **Schema versioning:** Objects that may change over time include a `.schemaVersion` property and are migrated at runtime.
- **Type safety:** Avoid `any`; use index signatures or utility functions for migrations.
- **Permissions:** Use policy assertions and context lookups for permission checks.
- **Testing:** Mocks for authentication and context are in `packages/common/test/mocks/`.
- **Package boundaries:** Each package has its own README and is responsible for its own API surface.
- **Spies and Mocks:** Use spies and mocks to isolate tests and verify interactions. Unless otherwise specified, prefer using jasmine's built in `spyOn` .

## Integration Points

- **ArcGIS APIs:** Wrappers for Hub, Portal, and other ArcGIS services.
- **External dependencies:** Managed via npm; see each package's `package.json`.
- **Documentation:** Source in `docs/src/`, published at http://esri.github.io/hub.js/.

## Examples

- **Schema migration:** See `upgradeCatalogSchema` in `docs/src/guides/advanced/schema-versioning.md`.
- **Permission assertion:** See examples in `packages/common/src/permissions/README.md`.
- **Search flow:** See diagrams in `packages/common/src/search/docs/README.md`.

## Key Files & Directories

- `packages/common/` — shared types, utilities, permissions, and search logic
- `packages/sites/`, `packages/initiatives/`, etc. — entity-specific modules
- `packages/common/test/mocks/` — test mocks for context and authentication
- `docs/src/guides/advanced/schema-versioning.md` — schema migration guide

---

For questions about unclear patterns or missing details, please ask for clarification or examples from maintainers.
