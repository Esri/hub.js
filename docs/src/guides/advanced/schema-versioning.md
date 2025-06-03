---
title: Object Schema Versioning
navTitle: Schema Versioning
description: Managing changes over time
order: 11
group: 4-advanced
---

# Object Schema Versioning in Hub.js

Managing the evolution of object structures (schemas) is a core challenge in long-lived applications, especially when you cannot rely on database-level migrations. In Hub.js, we address this by employing a **run-time migration pattern** for all objects whose structure may change over time.

## The Problem

As the Hub.js library evolves, the shape of objects (such as entities, catalogs, or settings) may change. However, stored objects - whether in local storage, remote APIs, or other persistence layers - may still exist in older formats. We need a way to ensure that, whenever an object is loaded, it is automatically upgraded to the latest schema expected by the application.

## The Pattern: Run-Time Migrations

The general pattern is as follows:

- **Versioning:** Any object whose schema may change over time includes a `.schemaVersion: number` property. This version indicates the schema the object currently conforms to.
- **Migration Functions:** For each such object, we provide a migration function (e.g., `upgradeCatalogSchema`) that takes an object of any version and returns an object in the latest schema.
- **Migration Chain:** The migration function applies a chain of transformations, one for each version increment, so that even very old objects are brought up to date.
- **Automatic Upgrades:** When an entity is loaded (typically in its `fetch` process), its sub-objects are passed through the appropriate migration function. For example, an `IHubCatalog` is upgraded via `upgradeCatalogSchema` inside the entity's `computeProps` function.

## Example: IHubCatalog

Suppose you have an `IHubCatalog` object stored with `schemaVersion: 1`. The current application expects `schemaVersion: 3`. When a catalog is loaded as part of an Entity (e.g. a Hub Project), it is passed through `upgradeCatalogSchema`, which applies migrations for v2 and v3 in sequence, resulting in an object that matches the latest schema.

```typescript
function upgradeCatalogSchema(catalog: any): IHubCatalog {
  let upgraded = { ...catalog };
  if (!upgraded.schemaVersion || upgraded.schemaVersion < 2) {
    upgraded = migrateToV2(upgraded);
    upgraded.schemaVersion = 2;
  }
  if (upgraded.schemaVersion < 3) {
    upgraded = migrateToV3(upgraded);
    upgraded.schemaVersion = 3;
  }
  return upgraded as IHubCatalog;
}
```

## Where Migrations Are Applied

- **Entities:** Most entities call their migration functions in their `computeProps` method, which is part of the `fetch` process.
- **Sub-Graphs:** Any sub-object (e.g., catalog, settings) that may have its own schema versioning is migrated independently.
- **Special Cases:** Some entities (like `IHubSite`) may have a different release schedule and handle migrations slightly differently, but the principle remains the same.

## Benefits

- **Reliability:** The application can always expect to work with the latest schema, regardless of how old the stored object is.
- **Flexibility:** No need for database-level migrations; all upgrades happen at run-time.
- **Backward Compatibility:** Older objects are automatically upgraded, reducing the risk of runtime errors due to missing or outdated properties.

## Summary

By versioning schemas and applying run-time migrations, Hub.js ensures that all objects are always in the expected format, enabling safe evolution of your data structures over time.
