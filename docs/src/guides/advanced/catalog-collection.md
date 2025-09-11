---
title: Catalogs and Collections
navTitle: Catalogs & Collections
description: Searching within Sites and other items
order: 60
group: 4-advanced
---

## Catalogs and Collections

A Catalog is a JSON structure that defines which ArcGIS platform entities (such as items, users, groups, events, etc.) can be searched and displayed. Catalogs can be further divided into Collections, which are subsets focused on a single entity type (for example, only items or only groups).

Hub Sites use Catalogs to control what content appears in site searches and displays. Hub Premium entities—Events, Projects, and Initiatives—can also have their own Catalogs to specify associated content.

Content hierarchy (such as linking Projects to Initiatives and Sites) is not managed automatically; it must be organized manually, typically by grouping related content and referencing those groups in parent Catalogs.

For Hub Entities, the Catalog is stored in the `.catalog` property of the item's `data.json`. Other applications should follow this convention for consistency.

Because the Catalog structure may evolve, always fetch the latest version using the [`fetchHubEntity(type, id, context)`](../api/common/fetchHubEntity) function or upgrade it with [`upgradeCatalogSchema(..)`](../api/common/upgradeCatalogSchema) before performing searches.

## Interfaces

![Catalog Model](/hub.js/img/catalog-collection.png)

## Defining a Catalog

Catalogs and Collections are defined using json, specified in typescript via the [`IHubCatalog`](../api/common/IHubCatalog) and [`IHubCollection`](../api/commonIHubCollection) interfaces.

The Catalog defines a set of "scopes" for each target entity in the Catalog. While each scope is defined as an [`IQuery`](../api/common/IQuery) object, in practice, the Hub UI limits the predicates in scopes to `groups`. In the future this may expand.

```js
// Example Catalog setting the scope for "item" searches to content
// in a specific group OR owned by a specific user
const seventhStreetProjectCatalog: IHubCatalog = {
  title: "Seventh Street Project",
  schemaVersion: 1,
  scopes: {
    item: {
      // IQuery applied when searching for `items`
      targetEntity: "item",
      operation: "OR",
      filters: [
        {
          predicates: [
            {
              group: ["c4059b70af8d4773910a812f7d712dc8"],
            },
          ],
        },
      ],
    },
  },
  collections: [],
};
```

## Collections in Catalogs

A Collection is a subset of the Catalog, constrained to a target entity, specified by the `targetEntity` property. The `.scope` of a Collection is an [`IQuery`](../api/common/IQuery) object which adds additional critera, creating the "subset".

```js
// This example adds a collection, which adds additional constraints on top of
// the catalog itself.
//
// Searching the Web Maps collection will limit the search to items in the
// "c4059b70af8d4773910a812f7d712dc8" group AND
// which have type:"Web Map" AND NOT type: "Web Mapping Application"
const seventhStreetProjectCatalog: IHubCatalog = {
  title: "Seventh Street Project",
  schemaVersion: 1,
  scopes: {
    item: {
      // IQuery
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: ["c4059b70af8d4773910a812f7d712dc8"],
            },
          ],
        },
      ],
    },
  },
  collections: [
    {
      targetEntity: "item",
      key: "webmaps",
      label: "Web Maps",
      scope: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: {
                  any: ["Web Map"],
                  not: ["Web Mapping Application"],
                },
              },
            ],
          },
        ],
      },
    },
  ],
};
```

## Working with Catalogs

The `Catalog` and `Collection` classes are designed to simplify working with these structures, in particular, loading Catalogs from items, executing Catalog searches, getting a Collection from a Catalog, and executing Collection searches.

### Searching a Site Catalog

```js
import { Catalog } from "@esri/hub-common";

// Load the catalog for a specific site
const siteCatalog = await Catalog.init("https://opendata.dc.gov");

// alternatively an item id can be passed in
const projectCatalog = await Catalog.init("648149685cfd47f7b265d37d009a87dd");

// search for schools.
const itemResults = await siteCatalog.searchItems("schools");
const groupResults = await siteCatalog.searchGroups("schools");
const userResults = await siteCatalog.searchUsers("schools");
```

In the example above, no authentication information or server information has been provided, so the system assumes the backing server is ArcGIS Online. It will look up the Site item based on the url, and from that, load the Catalog. If an item id is passed in, it will simply fetch the item, and load the Catalog. In either case, schema upgrades are automatically applied, ensuring that the system is always operating with the latest version of the catalog structure.

### Catalog Search "Scopes"

Although the Catalog specification supports many different target entities (item, group, user, event etc ), any individual Catalog instance may not support all the target entities. Attempting to search for an entity that does not have a scope defined, will result in an exception.

To determine what scopes are available, user the `.availableScopes` property to get an array of them.

### Search Options

All the search functions take an `IHubSearchOptions` as the second parameter, and this is used to specify paging, sorting, aggregations and includes. Please see the [`IHubSearchOptions` documentation]() for more information.

### Searching an ArcGIS Enterprise Site Catalog Example

```js
const mgr = await ArcGISContextManager.init({
  portalUrl: "https://myserver.com/gis",
});

const siteCatalog = Catalog.init(
  "https://myserver.com/gis/apps/sites/#mysite",
  mgr.context
);

const results = await siteCatalog.search("schools");
```

## Passing Authentication

When a Catalog or Collection instance is created, the second parameter is an `IArcGISContext` which holds authentication information. To create an `IArcGISContext`, we use the `ArcGISContextManager` class, and pass a `UserSession` into it's `.init` factory function.

A `UserSession` be created directly, via oAuth, or from a JSAPI Identity Manager via the `UserSession.fromCredential(...)` static method. Please see the [ArcGIS REST JS Documentation](https://esri.github.io/arcgis-rest-js/api/auth/UserSession/). (Note: At this time ArcGISContextManager is only compabitle with REST-JS 3.x)

**NOTE** passing `.authentication` or `.requestOptions` on the `IHubSearchOptions` will be ignored, and instead the context information help in the Catalog or Collection instance will be used.

```js
const session = new UserSession({
  username: "replacewithusername",
  password: "replacewithpassword",
});

const mgr = await ArcGISContextManager.init({
  portalUrl: "https://myserver.com/gis",
  authentication: session,
});

const siteCatalog = Catalog.init(
  "https://private-site-org.hub.arcgis.com",
  mgr.context
);

// This will return any items the user has access to, matching "water"
// within the catalog
const results = siteCatalog.search("water");
```

## Working with Collections

A `Collection` defines a set of searchable platform resources, of a single type - i.e. Items OR Groups OR Users.

Further, `Collections` within `Catalogs` are expected to be constrained to the scope of their `targetEntity` as defined at the Catalog level. Put another way, all collections in a Catalog should be subset's of the Catalog itself.

Operationally, this means that the `IQuery` defined in `Collection.scope`, must include the `IQuery` that's defined at `Catalog.scopes[collection.targetEntity]`. While this can be done manually, the Catalog class provides an abstraction to simplify this.

**NOTE** Unlike searching directly against the Catalog, a Collection can be defined for an entity that does not have a scope defined at the Catalog level. i.e. the Catalog may not have a `user` scope defined, but there can be a Collection defined that targets the `user` entity.

```js
// Working from the Seventh Street Project catalog defined above
// we can initialize a Catalog and then use that to get the Web Map collection
const catalog = Catalog.fromJson(seventhStreetProjectCatalog);

// we can get the collection from the catalog via it's key property
const collection = catalog.getCollection("webmaps");

// searching the collection, constrains the search to the intersection
// of the set of entities defined by the Catalog's item scope, and the
// set of entities defined by the Collection's scope
const results = collection.search("water");
```

### Using Catalog / Collection Json Directly

There are times when the application will have already fetched the Catalog or Collection json, or cases where a Collection needs to be created dynamically (i.e. for use in an Item Picker gallery)

In these scenarios use the `.fromJson(...)` static method to create an instance of either class.

```js
// Creating a Collection from Json

const myCollection = Collection.fromJson({
  label: "Example Json Collection",
  key: "example",
  targetEntity: "item",
  scope: {
    filters: [
      {
        predicates: [
          {
            group: "aba30fb9f66c4d1ebf8a37d6130c722b",
            typekeyword: "Solution Template",
          },
        ],
      },
    ],
  },
});

const results = myCollection.search("Vision Zero");
```

### Complex Queries

The examples so far have focused on passing a string into the `.search(..)` method, but that method can also take an [`IQuery`](https://esri.github.io/hub.js/api/common/IQuery/) which enables complex queries to be constructed. Please see the [Queries and Filters Guide](https://esri.github.io/hub.js/guides/concepts/queries-and-filters/) for more information.
