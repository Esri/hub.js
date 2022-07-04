---
title: Searching with Filters
navTitle: Search Filters
description: Searching with Filters
group: 2-concepts
order: 15
---

## Searching for Content vs Searching for Hub Entities

In Hub we deal with two broad categories of things - [Hub Entities](./hub-entities) (Site/Page/Project/Initiative etc) and Content (Maps/Apps/Data/Documents).

Although the Hub Entities can be thought of as “Content”, generally when working with specific entities, we will use the `.search` methods on the Entity Manager classes, or the `search[EntityType]` functions in the entity modules. The key thing is that these methods will return the expected Hub Entity (i.e. for projects you get back `IHubProject` objects), where as the more generic content search will return an `IHubContent`, even for Hub Entity types.

## Searching for Content

To search for content, we want to use:

```ts
_searchContent(filter: Filter<“content”>, options: IHubSearchOptions):Promise<ISearchResponse<IHubContent>>
```

_NOTE:_ the `_` is temporary. The currently exported `searchContent` function operates very differently. We will use an incremental process to convert client code over to using the new functions, and then deprecate the old implementation at a breaking change in Hub.js

The response contains an array of results, and a `next()` function which fetches the next page.

## Search Filters: Developers Guide

When searching for Content, Groups or Users, we use `Filters` to specify the search criteria.

The `Filter` is a tagged union type, and it's properties depend on the tag passed in when it's declared.

While `Filter<"content">` has different properties than `Filter<"user">`, using a tagged union type allows us to write generic functions that can work with all of the variations.

When working with `Filter<"content">` the filter interface is defined as:

```ts
// This is the actual interface for Filter<"content">
export interface IContentFilterDefinition {
  access?: string | string[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  tags?: string | string[] | IMatchOptions;
  created?: IDateRange<number> | IRelativeDate;
  description?: string | string[] | IMatchOptions;
  snippet?: string | string[] | IMatchOptions;
  group?: string | string[] | IMatchOptions;
  id?: string | string[] | IMatchOptions;
  modified?: IDateRange<number> | IRelativeDate;
  orgid?: string | string[] | IMatchOptions;
  term?: string;
  title?: string | string[] | IMatchOptions;
  type?:
    | string
    | NamedContentFilter
    | Array<string | NamedContentFilter>
    | IMatchOptions;
  typekeywords?: string | string[] | IMatchOptions;
  // this allows arbitrary keys, which Hub api supports
  [key: string]: any;
  /**
   * @internal
   * Support for complex OR queries; Used with various expansions
   */
  subFilters?: Array<IContentFilterDefinition | NamedContentFilter>;
}
```

The listed properties are those supported by the Portal API. It also supports additional properties, but those will ignored by the Portal API search, and may be respected by the Hub API.

## Building Filters

The core idea is that complex queries can be built up by combining many simple Filters. For example, to locate items owned by `jsmith` of type `Web Map`, we could create two filters and merge them as follows

```ts
const ownerFilter: Filter<"content"> = {
  filterType: "content",
  owner: "jsmith",
};

const typeFilter: Filter<"content"> = {
  filterType: "content",
  type: "Web Map",
};

const filter = mergeContentFilter([ownerFilter, typeFilter]);
//=> {filterType: "content", owner:"jsmith", type: "Web Map"}
```

While that example could have been written as a single filter without much issue, this approach of merging many filters into a single filter is core to how the `Filter` system works. It's also enables the UI layer to be composed of many small components, which define simple Filters, which are merged to create a single complex Filter, which is passed into the `_searchContent`, `_searchGroups` or `_searchUsers` functions. Serialization into API specific query syntax is handled internally.

### Complex Filters

Sometimes we need to express more complex logic. As shown in the `IContentFilterDefinition` interface above, properties on a `Filter` can be a string, but can also be an array of strings, or `IMatchOptions`.

Let's look at an array of strings first.

```ts
const typeFilter: Filter<"content"> = {
  filterType: "content",
  type: ["Web Map", "Dashboard"],
};
```

We can read this as `where type = "Web Map" or type = "Dashboard"`. If we need to be even more specific, we need to use the `IMatchOptions`

#### Using IMatchOptions

When you need very specific control over the boolean logic, use the `IMatchOptions` interface.

```ts
export interface IMatchOptions {
  /**
   * return results which have ANY of the listed values
   * for the specified field
   */
  any?: string | string[];
  /**
   * return resutls which have ALL of the listed values
   * for the specified field
   */
  all?: string | string[];
  /**
   * return results which do not have any of the listed
   * values for the specified field
   */
  not?: string | string[];
  /**
   * Depending on the API being searched, `exact` will
   * attempt to structure the query such that it is an
   * exact match. For Portal API, this may involve using
   * the `filter` parameter, if the specific field can
   * be used with that parameter
   */
  exact?: string | string[];
}
```

For example, to find items with the tags `water` and `colorado`, optionally with tags `lake` and `stream`, but without the tags `epa`, `nepa` and matching exactly the type `"Feature Service"` we could use this filter:

```ts
const typeFilter: Filter<"content"> = {
  filterType: "content",
  type: {
    exact: "Feature Service" // must be exactly this type
  },
  tags: {
    all: ["water", "colorado"], // must have all these
    any: ["lake","river"] // may have any of these
    not: ["epa", "nepa"] // may not have these
  }
};
```

### A Note About Exact Matching

As the [Portal Search API documentation notes (Query vs Filter section)](https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm), by default the api does a "fuzzy search" - this means that searching for `type:"Web Map"` will also return things with `type: "Web Mapping Application"`. To do an exact match, the query is structured differently (for the Portal API, this criteria is serialized into the `filter` property vs the `q`).

`Filter` design accomodates this via the `IMatchOptions.exact` property. It should be noted that the portal API accepts a subset of properties on the `filter` parameter. From the docs:

#### Exact Match Fields by Filter Type

| Type    | Field          |
| ------- | -------------- |
| Content | `title`        |
| Content | `tags`         |
| Content | `typeKeywords` |
| Content | `type`         |
| Content | `name`         |
| Content | `owner`        |
| User    | `username`     |
| User    | `firstname`    |
| User    | `lastname`     |
| User    | `fullname`     |
| User    | `email`        |
| Group   | `title`        |
| Group   | `typeKeywords` |
| Group   | `owner`        |

### SubFilters

While rare, some scenarios require an "OR" between two complex queries that do not intersect. For example, to find all "StoryMaps" the query logic is as follows:

```
- type: "StoryMap"
or
- type: "Web Mapping Application" AND typeKeyword: "StoryMap"
```

As a Filter this would be done as follows:

```ts
const typeFilter: Filter<"content"> = {
  filterType: "content",
  subFilters: [
    {
      type: "StoryMap",
    },
    {
      type: "Web Mapping Application",
      typeKeywords: "StoryMap",
    },
  ],
};
```

### Well-Known Filters

The Filter system has some built in short-cuts for some commonly used filters.

| Description  | Short-cut     |
| ------------ | ------------- |
| Applications | `$apps`       |
| StoryMaps    | `$storymap`   |
| Dashboard    | `$dashboard`  |
| Site         | `$site`       |
| Initiative   | `$initiative` |
| Document     | `$document`   |
| Experience   | `$experience` |

These are the commonly used "Collections" within the Hub UI. Utilizing short-cuts ensures that these complex queries are consistent across the application, and that changes can be made in a single location.

## Search Options

Once we have constructed the filter, the next thing needed are the search options. The inteface is shown below, and for the most part it's information like authentication, sorting and paging.

```ts
export interface IHubSearchOptions {
  site?: IModel; // This may change
  authentication?: UserSession;
  sortField?: string;
  sortOrder?: "desc" | "asc";
  page?: string;
  num?: number;
  aggregations?: string[];
  bbox?: string;
  fields?: string;
  api?: NamedApis | IApiDefinition;
}
```

### Specifying the API

**NOTE** This is likely to change!

Searches can be run against the Portal API or against the Hub API. This is specified by the `.api` property of the `IHubSearchOptions`

The `.api` property can take either a well-known name (`NamedApis` type) or an `IApiDefinition`

| NamedApis   | Description              |
| ----------- | ------------------------ |
| `arcgis`    | ArcGIS Online Production |
| `arcgisQA`  | ArcGIS Online QA         |
| `arcgisDEV` | ArcGIS Online Dev        |
| `hub`       | ArcGIS Hub Production    |
| `hubQA`     | ArcGIS Hub QA            |
| `hubDEV`    | ArcGIS Hub Dev           |

To work with ArcGIS Enterprise, a full `IApiDefinition` must be provided:

```ts
export interface IApiDefinition {
  label?: string;
  // url of the api
  // - for "arcgis", /sharing/rest will be appended
  // - for "arcgis-hub", the /v3/search will be added
  url: string;
  // We can add types as we add support for more
  type: "arcgis" | "arcgis-hub";
}

const myPortalApi: IApiDefinition = {
  label: "My Portal",
  url: "https://my.portal.com/gis",
  type: "arcgis",
};
```
