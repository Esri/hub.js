---
title: Entity Lifecycle
navTitle: Entity Lifecycle
description: Enity Loading and Property Mapping
order: 11
group: 4-advanced
---

## Entity Lifecycle: Fetching and Hydration

This guide explains the process of fetching and hydrating an entity in hub.js, using the **Project** entity as an example. The same series of steps applies to any entity, regardless of its backing store (e.g., Portal, Events, Discussion APIs).

## Overview

When you request an entity (such as a Project), hub.js performs a series of steps to transform raw data from the backing store into a fully hydrated, type-safe entity object. This ensures that all properties are mapped, computed, and migrated as needed for runtime use.

## Step-by-Step Process

This process should be encapsulated within the `fetch{Entity}` function. This guide is intended for developers who are creating and maintaining the entity functions themselves. Consumers of Hub.js should never need to know any of these details.

### 1. Fetch from Backing Store

Fetching can be done by either the entity's unique `id` or its human-friendly `slug`. Supporting both lookup methods is important for flexibility in APIs and user-facing URLs.

Once the raw model object is retrived, we then start the process of converting it into the Entity.

### 2. Property Mapping

The raw model is transformed into an entity object using the `PropertyMapper` and a property map (see [`getBasePropertyMap`](../api/common/getBasePropertyMap). This step copies properties from the raw model structure (e.g., `item.title`, `data.view`) to the entity (`name`, `view`, etc.), handling deep mappings and read-only properties.

```typescript
const mapper = new PropertyMapper(getBasePropertyMap());
const entity = mapper.storeToEntity(model, {});
```

Each entity should define it's own property map. Item backed entities can leverage [`getBasePropertyMap`](../api/common/getBasePropertyMap) to ensure consistentcy, but they will also need to add additional properties unique to the entity.

It's important to note that the `PropertyMapper` is bi-directional, and is also used when converting the Entity back into the raw model, prior to being sent to the backing store.

### 3. Computed Properties

After the simple property mapping, additional properties are set using the `computeProps` function. This includes:

- Generating URLs (e.g., `thumbnailUrl`)
- Migrating schemas (e.g., `catalog` via `upgradeCatalogSchema`)
- Setting up features and computing links
- Applying any additional logic

Both the raw model, and the entity are passed into this function, allowing the function to have acces to all the relevant information.

```typescript
const hydratedProject = computeProps(model, entity, requestOptions);
```

Each entity should implement it's own `computeProps` function, stored in the `/_internal` folder, and it should not be exported from Hub.js.

### 4. Result: Fully Hydrated Entity

The result is a fully hydrated entity object, ready for use in the application:
hydratedProject as IHubProject

## Updating an Entity

Entities are generally handled as simple objects (vs class instances) and thus can be manipulated as needed. Once the application decides to persist the entity, it should call the related `update{Entity}` function, which should follow a specific process to ensure data integrity and business rules are enforced:

1. **Ensure Unique Slug:** Before persisting, the function checks that the entity's `slug` is unique to prevent conflicts in URLs and lookups.
2. **Apply Business Logic:** Any required business rules or validations are applied to the entity. This may include permission checks, field validations, or custom logic specific to the Entity.
3. **Fetch Latest Model:** The current version of the entity is fetched from the backing store to ensure updates are applied to the most recent data.
4. **Apply Local Changes:** The local changes are merged into the fetched model using the `PropertyMapper`'s `entityToStore` method. This ensures only the intended properties are updated and the model remains consistent.

```typescript
const updatedModel = mapper.entityToStore(localEntity, fetchedModel);
```

5. **Persist to Backing Store:** The updated model is sent to the backing store (e.g., Portal API) to save the changes.
6. **Hydrate and Return Entity:** Once the backing store confirms the update, the returned model is converted back into a fully hydrated entity using the same mapping and compute steps as initial loading.

This flow ensures that updates are atomic, business rules are enforced, and the returned entity reflects the latest persisted state.

## Applicability to Other Entities

This lifecycle applies to all hub.js entities (Sites, Initiatives, Teams, etc.), regardless of their backing store. The property map and compute phase are tailored for each entity type, but the overall flow remains consistent:

1. Fetch raw model from store
2. Map properties to entity via PropertyMapper
3. Implement a `computeProps` function to set additional properties and apply migration
4. Return hydrated entity

## References

- [`PropertyMapper`](../../../common/src/core/_internal/PropertyMapper.ts)
- [`getBasePropertyMap`](../../../common/src/core/_internal/getBasePropertyMap.ts)
- [`computeProps`](../../../common/src/projects/_internal/computeProps.ts)

## For more on schema migration, see [Schema Versioning](./schema-versioning.md).
