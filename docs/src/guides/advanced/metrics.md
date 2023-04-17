---
title: Working with Metrics
navTitle: Metrics
description: Creating and Resolving Metrics
order: 45
group: 4-advanced
---

# Metrics

- What is a metric?
- Why is it useful?
- Common workflows?

## Defining Metrics

Metrics are defined on the Hub Entity objects in the `.metrics` property. When stored into items, they are placed into `item.properties.metrics`, as this allows then to be retrieved via item queries without incurring N+1 queries.

A Metric has this structure:

```typescript
const myBudgetMetric: IMetric = {
  // a string that can be used as a property name in javascript
  // this should not be changed once it's defined.
  id: "budget",
  // name of the metric - this will be shown in UIs, and can change
  // over the lifetime of the Metric
  name: "Project Budget",
  // Description - optional but suggested when working with Item Query
  // metrics, as the Items which are providing the metric will see this
  // in the metric definition UI
  description: "Budget for the project",
  // Units can also be defined, when it makes sense
  // currenty it's a string, but will be extended to be a list of
  // well known units
  units: "USD",
  // Source is where we define the details of the metric.
  // Three types are supported:
  // IStaticValueMetricSource - static value
  // IServiceQueryMetricSource - value from feature service query
  // IItemQueryMetricSource - value from item query
  // Depending on the type, different properties are required
  // More details below
  source: {...}

}

```

### Static Value Metrics

As the name implies this is a static value defined for the entity.

```typescript
const exampleStaticValue: IMetric = {
  id: "budget",
  name: "Budget",
  source: {
    metricType: "static-value",
    value: 100000,
  },
};
```

### Service Query Metrics

These metrics issue an "out statistics" query to a feature service and return the aggregate in the response.

```typescript
const serviceMetric: IMetric = {
  id: "spentBudget",
  name: "Spent Budget",
  source: {
    metricType: "service-query",
    serviceUrl:
      "https://services.arcgis.com/orgid/arcgis/rest/services/serviceName/FeatureServer",
    layerId: 3,
    field: "budget",
    statistic: "sum",
    where: "status = 'complete'",
  },
};
```

### Item Query Metrics

These metrics issue an item query and then pluck values out of the returned items. This is also the type of metric used to "cascade" metric look ups, from an Initiative, down to a set of Projects.

```typescript
const itemMetric: IMetric = {
  id: "usdotBudget",
  name: "USDOT Budget",
  description: "USDOT Funding for the project",
  units: "USD",
  source: {
    metricType: "item-query",
    keywords: ["initiative|00f"], // typekeywords to query for
    itemTypes: ["Hub Project"], // list of item types to return
    // propertyPath is a description of where on the item to find
    // the property. If we are targeting a metric defined by the
    // item, we use a "findBy" statement.
    propertyPath: "properties.metrics[findBy(id,'usdotBudget_00c')].source",
  },
};
```

- when a child defines a metric for consuption by a parent, it must append the parent's item id to the metric id.

For example, aProject `00c` defined a `budget` metric being requested by Initiative `3a1`. The project defines that metric in it's metrics array, with `id: "budget_3a1"`, and the Initiative defined the property path for that metric as `"properties.metrics[findBy(id,'budget_3a1')].source"`. This ensures that there are no collisions if a project is associated to multiple metrics, all requesting a metric with the same id. Additionally, that `.source` property could be either a static value metric or a service query metric, and that will be resolved correctly.

## Resolved Metrics

When resolved, the return object will look like this...

```typescript
const example: IMetricFeature[] = [
  {
    id: "00c",
    type: "Hub Project",
    label: "Oak St Project",
    budget: 100000,
  },
];
```

Now - it's clear that there are properies in the result that are not in the `IMetric` itself. This is where `IMetric.sourceInfo` and a pre-processing step come in.

- service query metrics - these metrics issue a query to a feature service and apply some aggregation to the response.
- item query metrics - these metrics issue an item query, and pluck a value from the return `IItem` objects.

## Resolving Metrics

The process of getting the values that correspond to a metric definition is called "resovling the metric". If working with the Hub Entity classes, the Project and Initiative classes implement `IWithMetricBehavior` and thus have a `resolveMetric(idOfMetric)` method. For functional developers there is `resolveMetric(metric: IMetric, context:IArcGISContext):Promise<IMetricFeature[]>`

## Resolved Metric Structure

In order to work smoothly with other parts of the ArcGIS ecosystem, a resolved metric returns and array of "Feature-like" structures, typed as `IMetricFeature`.
Static Value and Service Query metrics will contain a single entry in the array. However, Item Query metrics will have an entry for every item returned from the query. This is how an Initiative can get metrics from a set of associated Projects. We return the array of `IMetricFeature`s so that the display system can decide what aggregation to apply, vs having to define the aggregation as part of the metric itself.

```typescript
const example: IMetricFeature = {
  attributes: {
    id: "00c", // id of the entity the value is derived from
    label: "Oak St Project", // title of the entity
    type: "Hub Project", // type of the entity
    funding: 102900, // the key is the metric id, value is the static value of service query aggregate
    // typed as [key: string]: number | string
  },
  // geometry is not used at this point, but here in prep for additional work
  geometry: {},
};
```
