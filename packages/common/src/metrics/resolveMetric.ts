import { IArcGISContext } from "../ArcGISContext";
import {
  IItemQueryMetricSource,
  IMetric,
  IMetricFeature,
  IResolvedMetric,
  IServiceQueryMetricSource,
  IStaticValueMetricSource,
  MetricSource,
} from "../core/types/Metrics";
import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { IItem, IStatisticDefinition } from "@esri/arcgis-rest-types";
import { getProp } from "../objects/get-prop";
import { IPredicate, IQuery } from "../search/types/IHubCatalog";
import { combineQueries } from "../search/_internal/combineQueries";
import { IHubSearchOptions } from "../search/types/IHubSearchOptions";
import { portalSearchItemsAsItems } from "../search/_internal/portalSearchItems";

/**
 * Resolve a Metric into an array of `IMetricFeature` objects.
 * This implementation is similar to DynamicValues, but is just different
 * enough to warrant a separate implementation.
 * @param metric
 * @param context
 * @returns
 */
export async function resolveMetric(
  metric: IMetric,
  context: IArcGISContext
): Promise<IResolvedMetric> {
  // At this point the source references should have been resolved
  // so we can force case to a MetricSource and switch on the type
  const source = metric.source as MetricSource;

  // call the appropriate resolver
  switch (source.type) {
    case "static-value":
      return resolveStaticValueMetric(metric, context);

    case "service-query":
      return resolveServiceQueryMetric(metric, context);

    case "item-query":
      return resolveItemQueryMetric(metric, context);

    default:
      throw new Error(`Unknown metric type passed in.`);
  }
}

/**
 * Resolve a static value metric
 * @param metric
 * @param context
 * @returns
 */
function resolveStaticValueMetric(
  metric: IMetric,
  context: IArcGISContext
): Promise<IResolvedMetric> {
  const source = metric.source as IStaticValueMetricSource;
  // cut off the parent identifier from the metric id and use that
  // as the output field name
  const fieldName = metric.id.split("_")[0];
  const result: IMetricFeature = {
    attributes: {
      id: metric.entityInfo.id,
      name: metric.entityInfo.name,
      type: metric.entityInfo.type,
      [fieldName]: source.value,
      valueType: source.valueType,
    },
  };
  return Promise.resolve({
    features: [result],
    generatedAt: new Date().getTime(),
  });
}

/**
 * Exequte a query against a service and return the aggregate value
 * in an `IMetricFeature`
 * @param metric
 * @param context
 * @returns
 */
async function resolveServiceQueryMetric(
  metric: IMetric,
  context: IArcGISContext
): Promise<IResolvedMetric> {
  const source = metric.source as IServiceQueryMetricSource;
  // cut off the parent identifier from the metric id and use that
  // as the output field name
  const fieldName = metric.id.split("_")[0];
  // If no where is provided, default to "1=1"
  source.where = source.where || "1=1";

  // Construct the stats definition
  const statsDef: IStatisticDefinition = {
    onStatisticField: source.field,
    statisticType: source.statistic,
    outStatisticFieldName: source.field,
  };
  // construct the url by appending the layer id if provided
  const serviceUrl = source.serviceUrl + `/${source.layerId}`;
  // Execute the query
  const response = await queryFeatures({
    url: serviceUrl,
    where: source.where as string,
    f: "json",
    outStatistics: [statsDef],
    authentication: context.requestOptions.authentication,
  });

  // TODO: If we enable more stats, we will need to update
  // how we fetch the values out of the response
  const aggregate = getProp(response, `features[0].attributes.${source.field}`);

  const result: IMetricFeature = {
    attributes: {
      id: metric.entityInfo.id,
      name: metric.entityInfo.name,
      type: metric.entityInfo.type,
      [fieldName]: aggregate,
    },
  };

  return {
    features: [result],
    generatedAt: new Date().getTime(),
  };
}

async function resolveItemQueryMetric(
  metric: IMetric,
  context: IArcGISContext
): Promise<IResolvedMetric> {
  const source = metric.source as IItemQueryMetricSource;
  // cut off the parent identifier from the metric id and use that
  // as the output field name
  const fieldName = metric.id.split("_")[0];
  // create the query from the source properties
  const predicate: IPredicate = {
    typekeywords: source.keywords,
  };
  if (source.itemTypes) {
    predicate.type = source.itemTypes;
  }

  const baseQuery: IQuery = {
    targetEntity: "item",
    filters: [
      {
        operation: "AND",
        predicates: [predicate],
      },
    ],
  };

  const scope = (source.scope as IQuery) || {
    targetEntity: "item",
    filters: [],
  };

  const combined = combineQueries([baseQuery, scope]);

  const opts: IHubSearchOptions = {
    requestOptions: context.hubRequestOptions,
    num: 100,
  };
  // Memoization is great but we have UI's where we want immediate
  // updates as we share more items into the groups, which means
  // we can't memoize the search response
  // create/get memoized version of portalSearchItemsAsItems
  // const memoizedPortalSearch = memoize(portalSearchItemsAsItems);
  // Execute the query
  // const response = await memoizedPortalSearch(combined, opts);

  const response = await portalSearchItemsAsItems(combined, opts);

  // This next section is all promise based so that a dynamic value
  // can itself be a dynamic value definition, which then needs to be
  // resolved.

  const promises = await response.results.reduce(
    async (valsPromise: any, item: IItem) => {
      const vals = await valsPromise;
      const valueFromItem = getProp(item, source.propertyPath);

      const result: IMetricFeature = {
        attributes: {
          id: item.id,
          name: item.title,
          type: item.type,
          [fieldName]: null,
        },
      };
      // Handle case where value is not found...
      // e.g. the project exists but the metric is not defined yet
      if (valueFromItem) {
        // This block is needed if we are just plucking a value from the item
        // e.g. item.views or item.access
        if (
          typeof valueFromItem === "string" ||
          typeof valueFromItem === "number"
        ) {
          result.attributes[fieldName] = valueFromItem;
          vals.push(Promise.resolve(result));
        } else {
          // valueFromItem is itself a metric so we call resolveDynamicValues again
          // attach in the entity info, so it's present for the next level of recursion
          valueFromItem.entityInfo = result.attributes;
          const vResult = await resolveMetric(valueFromItem, context);
          vals.push(...vResult.features);
        }
      }
      return vals;
    },
    Promise.resolve([] as any[])
  );

  // let everything resolve
  const outputs = (await Promise.all(promises)) as IMetricFeature[];

  // return the results
  return {
    features: outputs,
    generatedAt: new Date().getTime(),
  };
}
