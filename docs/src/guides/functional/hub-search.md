---
title: Searching for Content
navTitle: Hub Search
description: Leveraging the Hub Search system
group: 3-functional-api
order: 20
---

## Hub Search

Within Hub.js the main search function is [`hubSearch`](../api/common/hubSearch), which uses an [`IQuery`](../api/common/IQuery) to defined the critera to be applied, and an [`IHubSearchOptions`](../api/common/IHubSearchOptions) for additional information.

# TODO: Add Search Example

Please read the [Queries and Filters](./queries-and-filters) guide for details on constructing the query.

### Search Options

For the most part, `IHubSeachOptions` is self-explanatory, as it's used to pass authentication (as `IHubRequestOptions`), as well as sort and paging information. However there are some additional properties that are worth exploring on their own.

### Fetching Additional Fields via `Include`

By default, `hubSearch` will return a `IHubSearchResponse` containing `IHubSearchResult` objects. These are simplified objects optimized for display in a list or grid of cards. In some advanced scenarios, additional information is required, and can be requested via `include`.

The include array takes a list of the "enrichments" to return. e.g `include: ['metadata','server']` In this simple case, before returning the results, the item metadata will be fetched, converted to json, and attached to the `IHubSearchResult` as `.metadata`. For appropriate item types (Feature Service) the `server` information will be fetched and attached as `.server`. Fetching these additional resources takes time, so it's best to do some testing to determine if the information you want is worth the performance hit.

It is also possible to pluck a specific piece of information out of an enrichment and specifying the property name to use on the `IHubSearchResult`. Specifying `include: ["server.layerCount AS numLayers"]` will fetch the server info, then grab just the `layerCount` property and attach that value to the result using the `numLayers` property.

####

| Enrichment  | Entities                           | Description                                               |
| ----------- | ---------------------------------- | --------------------------------------------------------- |
| `data`      | `item`                             | Returns the data json for the item.                       |
| `metadata`  | `item`                             | Returns the item's metadata, in json                      |
| `groupIds`  | `item`                             | Array of id's of the groups the item is shared to         |
| `ownerUser` | `item`, `group`                    | returns a full `IUser` for the owner of the group or item |
| `org`       | `item`                             | returns the `IPortal` of the owning user's org            |
| `server`    | Feature Service, Map Service items | Returns the feature service definition                    |
| `layers`    | Feature Service, Map Service item  | Returns the layers array                                  |

### Aggregations

The search can also return aggregation information for the entire result set.

For the most part, the aggregations supported by `hubSearch` are limited to those supported by the ArcGIS Portal Search API. A maximum of three aggregations can be specified.

| Entity  | Aggregation Fields                                      |
| ------- | ------------------------------------------------------- |
| `item`  | `tags`, `type`, `access`, `contentstatus`, `categories` |
| `user`  | none                                                    |
| `group` | none                                                    |

Once the search is executed, the aggregations are available on the `IHubSearchResponse.aggregations` property as an array of `IHubAggregation` objects.

Applications can use aggregations to construct dynamic facets and filters.

### Specifying the API & Authentication

By default, `hubSearch` will use the ArcGIS Online Portal Search API.

To specify an ArcGIS Enterprise server, `IHubSearchOptions.requestOptions.portal` should be set.

```js
const opts: IHubSearchOptions = {
  requestOptions: {
    portal: "https://myserver.org/gis/sharing/rest",
  },
};
```

To pass authentication information, send `IHubSearchOptions.requestOptions.authentucation`

```js
const opts: IHubSearchOptions = {
  requestOptions: {
    authentication: myUserSession, // IUserSession
  },
};
```

- Specifying the API to call
  - In ArcGIS Online, ArcGIS Hub has it's own search engine, which is optimized for searching public items.
  - In all other cases, we recommend specifying `arcgis` as that will use the Portal search API, and can return non-public content.

_Note_ If you are searching for specific [Hub Entities](./hub-entities), the entity "manager" modules also have simplified search functions return fully populated entity objects.


## Explaining Query Results

Sometimes we need a means to descibe why a particular item is included in a search result - in particular when users are managing the content catalog. 
To that end, the `explainQueryResult(result:GenericResult, query:IQuery, requestOptions)` function is built to help with this.

To use this function, we pass in the `IQuery` that was send into `hubSearch(...)`, and you'll get a response that looks like this:

```json
{
    // Copy of the Result object
    "result": {
        "id": "92ca9c12ee604b958303a52f3e0bbb6b",
        "group": [
            "9985c3ce1f0c4c39b065fc40a4548780",
            "9fef828e929d4f8e9fb5e5e3e174e9f6"
        ]
    },
    // Copy of the Query
    "query": {
        "targetEntity": "item",
        "filters": [
            {
                "predicates": [
                    {
                        "group": [
                            "9fef828e929d4f8e9fb5e5e3e174e9f6",
                            "9985c3ce1f0c4c39b065fc40a4548780"
                        ]
                    }
                ]
            }
        ]
    },
    // Did the Result match the Query's criteria?
    "matched": true,
    // Array of reasons the Query matched or did not
    "reasons": [
        {
            "filter": {
                "predicates": [
                    {
                        "group": {
                            "any": [
                                "9fef828e929d4f8e9fb5e5e3e174e9f6",
                                "9985c3ce1f0c4c39b065fc40a4548780"
                            ]
                        }
                    }
                ]
            },
            "matched": true,
            "reasons": [
                {
                    "predicate": {
                        "group": {
                            "any": [
                                "9fef828e929d4f8e9fb5e5e3e174e9f6",
                                "9985c3ce1f0c4c39b065fc40a4548780"
                            ]
                        }
                    },
                    "matched": true,
                    "reasons": [
                        {
                            "attribute": "group",
                            "values": "9985c3ce1f0c4c39b065fc40a4548780,9fef828e929d4f8e9fb5e5e3e174e9f6",
                            "condition": "IN",
                            "matched": true,
                            "requirement": "9fef828e929d4f8e9fb5e5e3e174e9f6,9985c3ce1f0c4c39b065fc40a4548780",
                            "message": "Value(s) 9985c3ce1f0c4c39b065fc40a4548780,9fef828e929d4f8e9fb5e5e3e174e9f6 contained at least one of value from [9fef828e929d4f8e9fb5e5e3e174e9f6,9985c3ce1f0c4c39b065fc40a4548780]",
                            "meta": {
                                "groups": [
                                    {
                                        "id": "9985c3ce1f0c4c39b065fc40a4548780",
                                        "title": "Explain Group 2"
                                    },
                                    {
                                        "id": "9fef828e929d4f8e9fb5e5e3e174e9f6",
                                        "title": "Explain Group 1"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        }
    ],
    "summary": [
        {
            "attribute": "group",
            "values": "9985c3ce1f0c4c39b065fc40a4548780,9fef828e929d4f8e9fb5e5e3e174e9f6",
            "condition": "IN",
            "matched": true,
            "requirement": "9fef828e929d4f8e9fb5e5e3e174e9f6,9985c3ce1f0c4c39b065fc40a4548780",
            "message": "Value(s) 9985c3ce1f0c4c39b065fc40a4548780,9fef828e929d4f8e9fb5e5e3e174e9f6 contained at least one of value from [9fef828e929d4f8e9fb5e5e3e174e9f6,9985c3ce1f0c4c39b065fc40a4548780]",
            // Meta information that could be used when constructing a translated string
            "meta": {
                "groups": [
                    {
                        "id": "9985c3ce1f0c4c39b065fc40a4548780",
                        "title": "Explain Group 2"
                    },
                    {
                        "id": "9fef828e929d4f8e9fb5e5e3e174e9f6",
                        "title": "Explain Group 1"
                    }
                ]
            }
        }
    ]
}

```