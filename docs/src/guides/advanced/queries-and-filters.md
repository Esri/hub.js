---
title: Queries and Filters
navTitle: Queries & Filters
description: Constructing Search Queries
order: 50
group: 4-advanced
---

## Queries, Filters and Predicates

### Building a Query

The IQuery interface is used to express both simple and complex queries.

The first step in creating a Query is to declare the target entity type. This is needed so the query can be routed to the correct api.

| Entity Type      | Description and backing API end-point                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| `item`           | ArcGIS Portal Item <br> `/sharing/rest/search`                                |
| `group`          | ArcGIS Portal Group <br> `/sharing/rest/community/groups/search`              |
| `portalUser`     | ArcGIS Portal User <br> `/sharing/rest/portal/self/users`                     |
| `communityUser`  | ArcGIS Portal User <br> `/sharing/rest/portal/self/users`                     |
| `groupMember`    | ArcGIS Portal Group Users <br> `/sharing/rest/community/groups/{id}/userlist` |
| `organization`   | ArcGIS Portal <br> `/sharing/rest/portals/{id}`                               |
| `event`          | ArcGIS Hub Event <br> Events API                                              |
| `eventAttendee`  | ArcGIS Hub Event <br> Events API                                              |
| `discussionPost` | ArcGIS Hub Discussion Posts <br> Discussions API                              |
| `channel`        | ArcGIS Hub Discussion Channel <br> Discussions API                            |

![Query Model](/hub.js/img/query-filter.png)

## Query, Filters, Predicates

A Query contains 1 or more Filters, which contain 1 or more Predicates.

When the query structure is serialized into an API request the following logic is applied:

Within a Query...

- all predicates are expanded into `IMatchOptions` objects
- all Filters are `AND`ed together
- all Predicates within a Filter use the `filer.operation` to control how they are connected
- all filters and predicates are converted into the native query syntax of the backing API

```json
{
  "targetEntity": "item",
  "filters": [
    {
      "operation": "AND",
      "predicates": [
        {
          "group": "3ef"
        }
      ]
    }
    {
      "operation": "OR",
      "predicates": [
        {
          "type": "Web Map"
        },
        {
          "type": "Hub Site"
        }
      ]
    }
  ]
}
```

Reads as:

- Search for items,
  - in `group` "3ef" AND
  - `type` = "Web Map" OR `type` = "Hub Site"

We can also express this more concisely as:

```json
{
  "targetEntity": "item",
  "filters": [
    {
      "operation": "AND",
      "predicates": [
        {
          // Properties within a predicate are AND'ed unless
          // an `IMatchOptions` structure is used, which allows
          // more precise control
          "group": "3ef",
          "type": {
            "any": ["Web Map", "Hub Site"]
          }
        }
      ]
    }
  ]
}
```

In this example we see that a property on an `IPredicate` can be a string, or an `IMatchOptions`

### Query Expansion and MatchOptions

As noted above, most predicate properties will work with a `IMatchOptions` structure, which allows more specificity with how the query is serialized for the backing API. Prior to serialization, predicates are "expanded" into their match options form, which enables deterministic combining of the filters and predicates. Note: not all predicates support Match Options. See the Predicate Properties table below for details.

```json
{
  "targetEntity": "item",
  "filters": [
    {
      "operation": "AND",
      "predicates": [
        {
          "type": "Feature Service",
          "tag": {
            "all": ["authoritative"],
            "any": ["water", "lake"],
            "not": ["rivers"]
          }
        }
      ]
    }
  ]
}
```

This reads as:

- search for items
  - of type `Feature Service`
  - WITH tag `authoritative`
  - AND tag `water` OR tag `lake`
  - WITHOUT tag `rivers`

...and is serialized into the `q` parameter of the Item search api as:

```
type="Feature Service" AND ((tag="authoritative") AND (tag="water" OR tag="lake") AND (-tag="rivers"))
```

We can combine predicates via the `.operation` to construct more complex queries

```json
{
  "targetEntity": "item",
  "filters": [
    {
      "operation": "OR",
      "predicates": [
        {
          "type": "Feature Service",
          "tag": {
            "all": ["authoritative"],
            "any": ["water", "lake"],
            "not": ["rivers"]
          }
        },
        {
          "type": "Web Map",
          "tag": {
            "all": ["authoritative"],
            "any": ["wildfire", "fire"]
          },
          "owner": "jsmith"
        }
      ]
    }
  ]
}
```

This reads as:

- search for items
  - of type `Feature Service`
  - WITH tag `authoritative`
  - AND tag `water` OR tag `lake`
  - WITHOUT tag `rivers`
  - OR
  - of type `Web Map`
  - WITH tag `authoritative`
  - AND tag `wildfire` OR tag `fire`
  - owned by `jsmith`

...and is serialized into the `q` parameter of the Item search api as:

```
(type="Feature Service" AND ((tag="authoritative") AND (tag="water" OR tag="lake") AND (-tag="rivers")))
OR
(type="Web Map" AND ((tag="authoritative") AND (tag="wildfire" OR tag="fire")) AND (owner="jsmith"))
```

## Query Execution and `hubSearch`

Within Hub, all searches are executed via [`hubSearch`](../api/common/HubSearch) which takes an [`IQuery`](../api/common/IQuery) and [`IHubSearchOptions`](../api/common/IHubSearchOptions) .

Hub Search uses a provider pattern to execute the search. Based on the target entity of the `IQuery`, the actual search is delegated to internal, entity specific search functions. These functions handle transforming the `IQuery` into the API specific request, as well as transforming the API response into an `IHubSearchResponse<IHubSearchResult>`. Providers will only use predicates they support and will ignore all others.

## Predicate Properties

Although the `IPredicate` structure allows for any key, value combinations, the following table lists the properties and their allowed types, for queries being serialized to the ArcGIS Portal API. The [Portal API search reference](https://developers.arcgis.com/rest/users-groups-and-items/search-reference/) describes the properties supportes for Items and Groups.

| Property           | Entity                  | Allowed Types                         |
| ------------------ | ----------------------- | ------------------------------------- |
| `access`           | `item`, `group`, `user` | `string`, `string[]`, `IMatchOptions` |
| `bbox`             | `item`                  | `string`                              |
| `categories`       | `item`                  | `string`, `string[]`, `IMatchOptions` |
| `created`          | `item`, `group`, `user` | `IDateRange<number>` `IRelativeDate`  |
| `description`      | `item`, `group`         | `string`, `string[]`, `IMatchOptions` |
| `disabled`         | `user`                  | boolean                               |
| `email`            | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `emailstatus`      | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `firstname`        | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `fullname`         | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `group`            | `item`, `user`          | `string`, `string[]`, `IMatchOptions` |
| `id`               | `item`, `group`         | `string`, `string[]`, `IMatchOptions` |
| `isInvitationOnly` | `group`                 | boolean                               |
| `isopendata`       | `group`                 | boolean                               |
| `joined`           | `group`                 | `IDateRange<number>` `IRelativeDate`  |
| `lastlogin`        | `user`                  | `IDateRange<number>` `IRelativeDate`  |
| `lastname`         | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `memberType`       | `group`                 | `string`, `string[]`, `IMatchOptions` |
| `modified`         | `item`, `group`         | `IDateRange<number>` `IRelativeDate`  |
| `orgid`            | `item`, `group`         | `string`, `string[]`, `IMatchOptions` |
| `owner`            | `item`, `group`         | `string`, `string[]`, `IMatchOptions` |
| `provider`         | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `role`             | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `searchUserAccess` | `groupMember`           | `"member"`                            |
| `searchUserName`   | `groupMember`           | `string`                              |
| `snippet`          | `item`                  | `string`, `string[]`, `IMatchOptions` |
| `tags`             | `item`,`group`          | `string`, `string[]`, `IMatchOptions` |
| `term`             | `item`, `group`, `user` | `string`, `string[]`, `IMatchOptions` |
| `type`             | `item`                  | `string`, `string[]`, `IMatchOptions` |
| `typekeywords`     | `item`, `group`         | `string`, `string[]`, `IMatchOptions` |
| `userlicensetype`  | `user`                  | `string`, `string[]`, `IMatchOptions` |
| `username`         | `user`                  | `string`, `string[]`, `IMatchOptions` |
