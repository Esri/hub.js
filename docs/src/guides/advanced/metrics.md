---
title: Working with Metrics
navTitle: Metrics
description: Creating and Resolving Metrics
order: 45
group: 4-advanced
---

# Initiative and Project Metrics

Metrics are a means of declaring and reporting status information. Typically, an Initiative defines a set of metrics, for which it's associated Projects will provide values. However, it's also possible for a Project or Initiative to simply define it's own metrics.

The metric values can be numbers, categorical strings, dates, aggregated statistics, or tables of information for use in charts (future).

The source of a Metric can be [Static Values](#static-value-metrics), derived from [Service Queries](#service-query-metrics) or derived from [Item Queries](#item-query-metrics). In the future additional metric providers will be created to fetch metrics from the ArcGIS Telemetry system or the ArcGIS Hub API.

Metric values are returned as an array of objects, each of which contain the source entity id, it's title, and type, in addition to any metric properties that were requested.

In the case of static or service query metrics, a single entry will be present in the array. For Item Query metrics, there will be one entry for every item returned in the query. This model allows the client to compute various statistics on the set of metrics without making multiple requests.

## Example

```js
// Create anonymous context
const ctxMgr = await ArcGISContextManager.create();
// fetch initiative
const initiative = await HubInitiative.fetch(
  "93114ab97bd8524afa7df575065c08cc",
  ctxMgr.context
);
// resolveMetric(...)
const budgetMetric = await initiative.resolveMetric("budget");
```

This will return a structure like this:

```js
[
  {
    attributes: {
      id: "de08aa6ad2f647109afa7df575065c08",
      name: "Test Vision Zero Project 5",
      type: "Hub Project",
      budget: 22546,
    },
  },
  {
    attributes: {
      id: "422e1e548dc54009993114ab97bd8524",
      name: "Test Vision Zero Project 7",
      type: "Hub Project",
      budget: 132900,
    },
  },
];
```

The array can be used to show a table of values, or further processed to show aggregations or other computed metrics (e.g. percent of total).

The `aggregateMetrics(metrics, "budget", "sum")` exists to return aggregations from the output array.

In the future, each entry will contain a geometry property, containing the location defined for the entity, thus enabling a map display.

## Defining Metrics

Metrics are defined on the Hub Entity objects in the `.metrics` property. When stored into items, they are placed into `item.properties.metrics`, as this allows then to be retrieved via item queries without incurring N+1 queries.

That said, <strong>Metrics must be processed prior to resolution</strong> - more on this later.

## Metrics Object Model

![Metrics Object model](/hub.js/img/metrics-object-model.png)

A Metric has the following structure:

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
  units: "USD",
  // Source is where we define the details of the metric.
  source: {...}
}

```

<h3 id="static-value-metrics">Static Value Metrics</h3>

As the name implies this is a static value. Many times organizations will want to use a static value to ensure their numbers match "official" numbers.

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

<h3 id="service-query-metrics">Service Query Metrics</h3>

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

The query will be executed with the credentials of the current user, this the access level of the service should be kept in sync with the access level of the item defining this type of metric. If the service is unavailable, the metric resolution will fail, throwing an error.

<h3 id="item-query-metrics">Item Query Metrics</h3>

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
    // propertyPath is a description of where on the retrieved item to find
    // the property. If we are targeting a metric defined by the
    // item, we use a "findBy" statement.
    propertyPath: "properties.metrics[findBy(id,'usdotBudget_00c')].source",
  },
};
```

#### Metric Id's and Property Paths

When a Project (child) defines a metric for consuption by an Initiative (parent), it must append the parent's item id to the metric id.

For example, Project `00c` defined a `budget` metric being requested by Initiative `3a1`. The project defines that metric in it's metrics array, with `id: "budget_3a1"`, and the Initiative defined the property path for that [Item Query](#item-query-metrics) metric as `"properties.metrics[findBy(id,'budget_3a1')].source"`.

This ensures that there are no collisions if a project is associated to multiple Initiatives, all requesting a metric with the same id.

## Recursive Metrics

In order for an Initiative to fetch metrics from Projects, it must define those metrics as [Item Query](#item-query-metrics) metrics. The `propertyPath` in the `IItemQueryMetricSource` may point to a property on the retrived item (e.g. `owner` or `type`), or may reference a formal Metric, located in the item's `properties.metrics` array. The latter is specified as a `findBy` specifier, as described in the `getProp` documentation. The general pattern is shown below.

```js
const propPath = "properties.metrics[findBy(id,'usdotBudget_00c')].source";
```

This will use `getProp` to locate the metric with id `usdotBudget_00c` in the item's metrics array, and then grab the `.source` property from that. The `.source` must be one of the valid `MetricSource`s - [Static Value](#static-value-metrics), [Service Query](#service-query-metrics) or an [Item Query](#item-query-metrics) metric. In call cases, the resolution of the value recurses to resolve the value.

For the most part this should be transparent to the developer and end-user, but it's useful to understand this when debugging.

<h2 id="pre-processing-metrics"> Pre-Processing Metrics</h2>

The resolved metric requires information from the host entity (typically an Item). The `getEntityMetric(entity, metricId)` function merges this information into `IMetric.entityInfo` and returns the fully populated `IMetric` that is ready to be processed by the `resolveMetric(metric, context)` function.

<strong>Failing to pre-process the metric will result in mal-formed output.</strong>

Using the `.resolveMetric(metricId)` function on the Initiative and Project classes will automatically do this. If you are not working with a class instance, call the `getEntityMetric(..)` function directly, and then resolve the metric.

## Resolved Metrics

A resolved metric is an array of `IMetricFeature` objects. This object is structed like a `Feature` in order to inter-operate with the ArcGIS API for Javascript, and the ArcGIS Charts library.

<strong>Note: At this time, geometry is not returned. This will be a future addition once Projects have `IHubLocation` added.</strong>

```typescript
const example: IMetricFeature[] = [
  {
    attributes: {
      id: "00c",
      type: "Hub Project",
      label: "Oak St Project",
      budget: 100000,
    },
    // geometry: {...}, in the future this will be populated
  },
];
```

We can see that there are properies in the result that are not in the `IMetric` itself. This is where `IMetric.sourceInfo` and the [pre-processing step](#pre-processing-metrics) come in.

## Resolving Metrics

The process of getting the values that correspond to a metric definition is called "resovling the metric".

The following diagram represents the high-level logic.

![Metric Resolution Process](/hub.js/img/metric-resolution-flow.png)

If working with the Hub Entity classes, the Project and Initiative classes implement `IWithMetricBehavior` and thus have a `resolveMetric(idOfMetric):Promise<IMetricFeature[]>` method.

For functional developers there is `resolveMetric(metric: IMetric, context:IArcGISContext):Promise<IMetricFeature[]>`
