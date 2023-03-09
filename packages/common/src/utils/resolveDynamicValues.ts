import { queryFeatures } from "@esri/arcgis-rest-feature-layer";
import { getSelf, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { IStatisticDefinition } from "@esri/arcgis-rest-types";
import { IArcGISContext } from "../ArcGISContext";
import {
  DynamicValueDefinition,
  DynamicValues,
  IDynamicItemQueryDefinition,
  IDynamicPortalQueryDefinition,
  IDynamicServiceQueryDefinition,
} from "../core/types/DynamicValues";
import { getProp } from "../objects/get-prop";
import { setProp } from "../objects/set-prop";
import { aggregateValues } from "./aggregateValues";
import { memoize } from "./memoize";

/**
 * Create memoized versions of the searchItems and getSelf functions
 */
const memoizedItemSearch = memoize(searchItems);
const memoizedPortalSelf = memoize(getSelf);

/**
 * Resolve a set of dynamic values. If the result is a DynamicValueDefinition, it will be resolved recursively.
 * The individual definitions can be of many types (item-query, portal etc), each of which has their own logic for resolving the value.
 * @param dynamicValues Array of dynamic value definitions to resolve
 * @param context ArcGIS context of the current user.
 * @returns
 */
export async function resolveDynamicValues(
  dynamicValues: DynamicValueDefinition[],
  context: IArcGISContext
): Promise<Record<string, any>> {
  let result: Record<string, any> = {};

  for (const valueDef of dynamicValues) {
    switch (valueDef.source) {
      case "item-query":
        // TODO: We may want to abstract the sourcePath so the properties.values.<parentid> is added here and not in the definition
        const itemQueryValues = await resolveItemQueryValues(
          valueDef as IDynamicItemQueryDefinition,
          context
        );
        result = { ...result, ...itemQueryValues };
        break;
      case "portal":
        const portalValues = await resolvePortalValues(
          valueDef as IDynamicPortalQueryDefinition,
          context
        );
        result = { ...result, ...portalValues };
        break;
      case "service-query":
        const serviceQueryValues = await resolveServiceQueryValues(
          valueDef as IDynamicServiceQueryDefinition,
          context
        );
        result = { ...result, ...serviceQueryValues };

        break;
      default:
        return assertNever(valueDef, getProp(valueDef, "source"));
    }
  }

  return result;
}

function assertNever(x: never, source: string): never {
  throw new Error(`Unexpected source ${source}.`);
}

/**
 * Resolve a set of dynamic values by extracting properties
 * from the current user's portal/self
 * @param valueDef Portal Query Definition that wil be resolved using properties from the current user's portal/self
 * @param context ArcGIS context of the current user.
 * @returns
 */
async function resolvePortalValues(
  valueDef: IDynamicPortalQueryDefinition,
  context: IArcGISContext
): Promise<DynamicValues> {
  const result = {};
  // TODO: This could use the context.portal values to skip even a single request
  // get the portalSelf via memoized function
  const portal = await memoizedPortalSelf(
    context.requestOptions.authentication
  );

  // get the value from the portal and attach into the result
  const value = getProp(portal, valueDef.sourcePath);
  setProp(valueDef.outPath, value, result);

  return result;
}

/**
 * Resolve a set of dynamic values based on an item query.
 * This is used to query for a set of items, extract a specific value from each
 * then run an aggregation on the set of values.
 * @param valueDef Item Query Definition that will be resolved by querying for items and extracting a specific value from each
 * @param context ArcGIS context of the current user.
 * @returns
 */
async function resolveItemQueryValues(
  valueDef: IDynamicItemQueryDefinition,
  context: IArcGISContext
): Promise<DynamicValues> {
  const result = {};
  // const start = Date.now();
  // execute the query
  if (valueDef.options) {
    const opts: ISearchOptions = {
      ...(valueDef.options as ISearchOptions),
      authentication: context.requestOptions.authentication,
    };
    const response = await memoizedItemSearch(opts);
    const promises = await response.results.reduce(
      async (valsPromise: any, r) => {
        const vals = await valsPromise;
        const v = getProp(r, valueDef.sourcePath);
        if (typeof v === "string" || typeof v === "number") {
          vals.push(Promise.resolve(v));
        } else {
          // v is itself a valueDefinition so we call resolveDynamicValues again
          const vResult = await resolveDynamicValues([v], context);

          // vals needs just the value - the number or string but vResult is an object
          // so we need to get it out of the object
          vals.push(getProp(vResult, v.outPath));
        }

        return vals;
      },
      Promise.resolve([] as any[])
    );
    const values = await Promise.all(promises);
    const aggretate = aggregateValues(values, valueDef.aggregation);
    setProp(valueDef.outPath, aggretate, result);
  }
  // timings.staticValues = timings.staticValues + (Date.now() - start);
  return result;
}

/**
 * Resolve a dynamic value that is derived from a service query
 * @param valueDef Service Query Definition that will be resolved by executing an aggregation querying on service and returning that value
 * @param context ArcGIS context of the current user.
 * @returns
 */
async function resolveServiceQueryValues(
  valueDef: IDynamicServiceQueryDefinition,
  context: IArcGISContext
): Promise<DynamicValues> {
  // If no where is provided, default to "1=1"
  valueDef.options.where = valueDef.options.where || "1=1";
  // construct the result object
  const result: DynamicValues = {};

  // Construct the stats definition
  const statsDef: IStatisticDefinition = {
    onStatisticField: valueDef.options.field,
    statisticType: valueDef.options.statisticType,
    outStatisticFieldName: valueDef.options.field,
  };
  // Execute the query
  const response = await queryFeatures({
    url: valueDef.options.url as string,
    where: valueDef.options.where as string,
    f: "json",
    outStatistics: [statsDef],
    authentication: context.requestOptions.authentication,
  });

  // Pull the aggreate value out of the response
  const aggretate = getProp(
    response,
    `features.0.attributes.${valueDef.outPath}`
  );
  // set that on the result
  setProp(valueDef.outPath, aggretate, result);

  return result;
}
