---
title: Catalogs and Collections
navTitle: Catalogs & Collections
description: Searching within Sites and other items
order: 4
group: 2-concepts
---

## Catalogs and Collections

A Catalog defines a set of content, which can have futher subsets called Collections. Additional filters can be applied at the Catalog or Collection level.

While a Catalog can reference any platform resource (Items, Users, Groups, Events etc), any Collection can only reference a single platform resource.

Catalogs were designed to be associated with any item, but currently Hub Sites utilize a catalog to define what content is available on a site search. Hub Projects and Hub Initiatives will also have Catalogs.

All the Hub related items will define the catalog in the data.json, in the `.catalog` property. The exact structure of this configuration will change over time so it's important to either fetch the Site/Project/Initiative via hub.js functions, or use the `convertCatalog(..)` function to ensure you are working with the latest structure.

## Defining a Catalog

Catalogs and Collections are defined in a json structure.

The Catalog defines a set of "scopes" for each resource type to be included in the Catalog. Each scope is an [`IQuery`](../api/common/IQuery) object.

```json
// Example Catalog setting the scope for "item" searches to a specific group
{
  "title": "Seventh Street Project",
  "schemaVersion": 1,
  "scopes": {
    "item": {
      // IQuery
      "targetEntity": "item",
      "filters": [
        {
          "predicates": [
            {
              "group": ["c4059b70af8d4773910a812f7d712dc8"]
            }
          ]
        }
      ]
    }
  },
  "collections": []
}
```

## Adding Collections

A Collection is a subset of the Catalog. The `.scope` of a Collection is an [`IQuery`](../api/common/IQuery) object.

```json
// Example Catalog setting the scope for "item" searches to a specific group
{
  "title": "Seventh Street Project",
  "schemaVersion": 1,
  "scopes": {
    "item": {
      // IQuery
      "targetEntity": "item",
      "filters": [
        {
          "predicates": [
            {
              "group": ["c4059b70af8d4773910a812f7d712dc8"]
            }
          ]
        }
      ]
    }
  },
  "collections": [
    {
      "targetEntity": "item",
      "key": "webmaps",
      "label": "Web Maps",
      "scope": {
        "targetEntity": "item",
        "filters": [
          {
            "predicates": [
              {
                "type": {
                  "any": ["Web Map"],
                  "not": ["Web Mapping Application"]
                }
              }
            ]
          }
        ]
      }
    }
  ]
}
```

At this time, the developer must check for and merge the related catalog scope's filters with the filters defined in the Collection's `scope` to ensure that the search will execute as expected.
