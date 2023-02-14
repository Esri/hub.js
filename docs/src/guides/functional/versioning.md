---
title: Versioning Entities
navTitle: Versioning
description: Learn how to work with entity versions.
order: 100
group: 3-functional-api
---

## Hub Entity Versioning

The versioning feature allows developers to create multiple versions of any `Item`-backed entity. Versions are stored as item resources.

### Searching for versions of an entity

The [`searchVersions`](/hub.js/api/common/searchVersions) function can be used to get all the versions of an entity. It takes an item id and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions) and returns an array of ['IVersonMetadata](/hub.js/api/common/IVersionMetadata).

### Getting and working with a particular version of an entity

The [`getVersion`](/hub.js/api/common/getVersion) function can be used to get a particular version of an entity. It takes an item id, a version id, and and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions) and returns an ['IVerson](/hub.js/api/common/IVersion).

Once you have an entity and a version, you can apply the version to the entity using the [`applyVersion`](/hub.js/api/common/applyVersion) function. It takes an ['IModel'](/hub.js/api/common/IHubUserRequestOptions), an ['IVerson](/hub.js/api/common/IVersion), and an optional `includeList` and returns an IModel with the versioned data applied.

### Creating a new version of an entity


### Updating a version of an entity


### Deleting a version of an entity

