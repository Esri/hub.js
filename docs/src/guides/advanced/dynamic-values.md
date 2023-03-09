---
title: Dynamic Values
navTitle: Dynamic Values
description: Defining and Resolving run-time aggregations
order: 55
group: 4-advanced
---

** DRAFT / WIP / DRAFT / WIP / DRAFT / WIP / DRAFT / WIP / DRAFT / WIP / DRAFT / WIP / DRAFT **

# DynamicData Guide

DynamicData structures and functions are a generic means for an entity to describe the type of values it requires at run-time, and how to fetch those values. It provides a single entry point that can “resolve” a set of different values, which can be derived from properties on items, stats functions applied to feature service queries, or properties plucked out of the current user’s Organization properties (aka portal/self). This system is also extensible so it can address future needs.

**Example Supported Scenarios**

- Parent / Child metric aggregation
  - Supports deep nesting: Site → Initiative(s) → Project(s)
- Template requires values to interpolate
  - run-time or during entity creation (solution.js / templates.js)

## Definitions

**Dynamic Values**

Values (strings, numbers, objects) which are derived, at runtime, from a source outside the current entity.

**Dynamic Value Definition**

The machine readable definition of the information required for a specific Dynamic Value. Has a “type” which defines the required properties, and the specific processing that is required to fetch the value.

**Dynamic Value Resolution**

The process of fetching and computing dynamic value. Depending on the type of the definition, this may be as simple as returning a static string like “Jurassic Park”, it could be the aggregation of a specific value plucked from objects returned from a web request.

**Entity Association**

Generically, the means by which “child” entities are associated with one or more “parent” entities, in a way that enables the children to be retrieved via a web request (typically an Item Search, but not limited to that).

---

**Note:** This guide does not cover how the Definitions or Values are set - it just discusses the structures, and how those are used to generate an Value Editing UX via the Configuration Editor, and how the resolver takes a set of definitions, and returns the set of values. Future functions may be added to take these generic functions / structures and customize them for specific use cases.

---

## Scenario

The following code will be discussing how to use the Dynamic Values structures and functions to implement the “Initiative Metrics” feature.

Initiative items are used to track progress on strategic goals - reducing air pollution, increasing green space, adding bike lanes etc. Project items are used to track specific, tactical actions, in service of an Initiative.

We will be examining how to have the Initiative be able to display aggregated metrics derived from all of it’s associated Projects.

## Defining Dynamic Values

The Initiative author will define what sorts of metrics the associated projects need to report - things such as total budget, budget spent to date, current status, trees planted, miles of bike lane added etc.

These definitions (typed as `DynamicValueDefinition`) need to include the following information:

- how will this value be derived? item query? service query? portal property value?
  - depending on the type additional parameters may be needed
- what type of value is this? string, number, counts-by-value?
- what sort of aggregation should be applied across all the projects? total, minimum, count etc
- what is the property name to return this on?
- is this value required?
- what label, and validation rules should be applied to the value?

In practice, for the Initiative metrics scenario, we will pre-define many of these - we know that the values will be aggregated from a set of Project items, so these will be `item-query` type of definitions. We know that we will manage the association via a type keyword, so the query parameters will be preset to `type: "Hub Project" AND typekeyword: "initiative:<id>"`, and based on the label, we can compute a property name to return the value on.

This is an example of an `item-query` Dynamic Value definition that we could expect to see on an Initiative

```jsx
{
  source: "item-query",
  sourcePath: `properties.values.00c.status`,
  outPath: "statusCounts",
  options: {
    q: `type: "Hub Project" AND typekeywords: initiative|00c`,
  },
  aggregation: "countByValue",
  required: true,
} as IDynamicItemQueryDefinition;
```

This definition is saying…

- execute an item query for `Hub Project` items, that have keyword `initiative:00c` . The query will respect the current user’s access permissions, only returning items they have access to.
- Iterate over the results, plucking out the value from `item.properties.values.00c.status`
- aggregate the values into a countByValue hash that looks something like this:
  ```jsx
  { notStarted: 12, started: 36, complete: 9 }
  ```
- return that hash on the `.statusCounts` property on the result object.

### Resolving Dynamic Values

Given an array of DynamicValueDefinitions, The `resolveDynamicValues` function takes an array of `DynamicValueDefinitions`, along with the current `ArcGISContext` and returns an object, with the aggregated values in the properties specified in the definition’s `outPath.`

### Recursive Resolution

For `item-query` definitions, the value plucked from the `.sourcePath` on the item could be another definition instead of a static value. If the value is a definition, the process recurses. This can be arbitrarily deep, but there will be performance implications. This allows for some projects to derive a value from a feature service query (e.g. count of rows, sum of feature lengths etc) while others may prefer to enter a manual value because data was collected outside of ArcGIS.
