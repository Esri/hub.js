---
title: Versioning Entities
navTitle: Versioning
description: Learn how to work with entity versions.
order: 100
group: 3-functional-api
---

## Hub Entity Versioning

The versioning feature allows developers to create multiple versions of any `Item`-backed entity that can have resources. See [here](https://developers.arcgis.com/rest/users-groups-and-items/add-resources.htm) for supported item types. Versions are stored as item resources.

There are two ways of interacting with the versioning API.

1. Longer term, the preferred approach is the `IHubItemEntity<Entity>` instance methods.
1. In the near term (Q1-2 2023), developers can use the importable functions with `IModels`.

---

### IHubItemEntity Instance Methods

Any [`IHubItemEntity`](/hub.js/api/common/IHubItemEntity) that implements [`IWithVersioningBehavior`](/hub.js/api/common/IWithVersioningBehavior) will have versioning. As of 02/2023 only [`HubSite`](/hub.js/api/common/HubSite) implements [`IWithVersioningBehavior`](/hub.js/api/common/IWithVersioningBehavior).

#### Searching for versions of an entity

The [`searchVersions`](/hub.js/api/common/HubSite#searchVersions) method can be used to get all the versions of an entity. It returns an array of [`IVersionMetadata`](/hub.js/api/common/IVersionMetadata).

#### Getting and working with a particular version of an entity

The [`getVersion`](/hub.js/api/common/HubSite#getVersion) method can be used to get a particular version of an entity. It takes a version id and returns an [`IVersion`](/hub.js/api/common/IVersion).

#### Creating a new version of an entity

The [`createVersion`](/hub.js/api/common/HubSite#createVersion) method can be used to create a new version of an entity based on the current state of the entity. It takes an optional [`ICreateVersionOptions`](/hub.js/api/common/ICreateVersionOptions) and returns an [`IVersion`](/hub.js/api/common/IVersion).

#### Updating a version of an entity

The [`updateVersion`](/hub.js/api/common/HubSite#updateVersion) method can be used to update a version of an entity based on the current state of the entity. It takes an [`IVersion`](/hub.js/api/common/IVersion) and returns an [`IVersion`](/hub.js/api/common/IVersion).

#### Deleting a version of an entity

The [`deleteVersion`](/hub.js/api/common/HubSite#deleteVersion) method can be used to delete a version of an entity. It takes a version id.

---

### Functional / IModel Approach

#### Searching for versions of an entity

The [`searchVersions`](/hub.js/api/common/searchVersions) function can be used to get all the versions of an entity. It takes an item id and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions) and returns an array of [`IVersionMetadata`](/hub.js/api/common/IVersionMetadata).

#### Getting and working with a particular version of an entity

The [`getVersion`](/hub.js/api/common/getVersion) function can be used to get a particular version of an entity. It takes an item id, a version id, and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions) and returns an [`IVersion`](/hub.js/api/common/IVersion).

Once you have an entity and a version, you can apply the version to the entity using the [`applyVersion`](/hub.js/api/common/applyVersion) function. It takes an [`IModel`](/hub.js/api/common/IModel), an [`IVersion`](/hub.js/api/common/IVersion), and an optional `includeList` and returns an IModel with the versioned data applied.

#### Creating a new version of an entity

The [`createVersion`](/hub.js/api/common/createVersion) function can be used to create a new version of an entity based on the current state of the entity. It takes an [`IModel`](/hub.js/api/common/IModel), an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions), and an optional [`ICreateVersionOptions`](/hub.js/api/common/ICreateVersionOptions) and returns an [`IVersion`](/hub.js/api/common/IVersion).

#### Updating a version of an entity

The [`updateVersion`](/hub.js/api/common/updateVersion) function can be used to update a version of an entity based on the current state of the entity. It takes an [`IModel`](/hub.js/api/common/IModel), an [`IVersion`](/hub.js/api/common/IVersion), and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions) and returns an [`IVersion`](/hub.js/api/common/IVersion).

#### Deleting a version of an entity

The [`deleteVersion`](/hub.js/api/common/deleteVersion) function can be used to delete a version of an entity. It takes an item id, a version id, and an [`IHubUserRequestOptions`](/hub.js/api/common/IHubUserRequestOptions).
