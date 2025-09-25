import type { IArcGISContext } from "../../types/IArcGISContext";
import {
  DynamicValues,
  DynamicValueDefinition,
  DynamicValueResult,
  IDynamicItemQueryDefinition,
} from "../../core/types/DynamicValues";
import { getProp } from "../../objects/get-prop";
import { resolvePortalValues } from "./resolvePortalValues";
import { resolveServiceQueryValues } from "./resolveServiceQueryValues";
import { setProp } from "../../objects/set-prop";
import { IQuery } from "../../search/types/IHubCatalog";
import { IHubSearchOptions } from "../../search/types/IHubSearchOptions";
import { combineQueries } from "../../search/combineQueries";
import { portalSearchItemsAsItems } from "../../search/_internal/portalSearchItems";
import { aggregateValues } from "./aggregateValues";
import { memoize } from "../memoize";

export const _INTERNAL_FNS = {
  resolveDynamicValue,
  resolveDynamicValues,
  resolveItemQueryValues,
};

/**
 * @internal
 * Resolve a single dynamic value. The definition can be of many types (item-query, portal etc), each of which has their own logic for resolving the value.
 * @param valueDef
 * @param context
 * @returns
 */
export async function resolveDynamicValue(
  valueDef: DynamicValueDefinition,
  context: IArcGISContext
): Promise<Record<string, DynamicValueResult>> {
  let result: Record<string, any> = {};
  switch (valueDef.type) {
    case "static-value": {
      const val = getProp(valueDef, "value");
      const outPath = getProp(valueDef, "outPath");
      result[outPath] = val;
      break;
    }
    case "item-query": {
      result = await _INTERNAL_FNS.resolveItemQueryValues(valueDef, context);
      break;
    }
    case "portal": {
      result = await resolvePortalValues(valueDef, context);
      break;
    }
    case "service-query": {
      result = await resolveServiceQueryValues(valueDef, context);
      break;
    }
    default: {
      throw new Error(`Cannot resolve value - unexpected source.`);
    }
  }
  return result;
}

/**
 * @internal
 * Resolve a set of dynamic values.
 * The individual definitions can be of many types (item-query, portal etc), each of which has their own logic for resolving the value.
 * @param dynamicValues Array of dynamic value definitions to resolve
 * @param context ArcGIS context of the current user.
 * @returns
 */
export async function resolveDynamicValues(
  dynamicValues: DynamicValueDefinition[],
  context: IArcGISContext
): Promise<Record<string, DynamicValueResult>> {
  let result: Record<string, any> = {};

  // iterate over the dynamic values and resolve each one via Promise.all
  // this will allow us to resolve all the values in parallel
  const resolvedValues = await Promise.all(
    dynamicValues.map((valueDef) =>
      _INTERNAL_FNS.resolveDynamicValue(valueDef, context)
    )
  );
  // merge the resolved values into a single object
  result = resolvedValues.reduce((acc, val) => ({ ...acc, ...val }), {});

  return result;
}

/**
 * @internal
 * Resolve a set of dynamic values based on an item query.
 * This is used to query for a set of items, extract a specific value from each
 * then run an aggregation on the set of values.
 * @param valueDef Item Query Definition that will be resolved by querying for items and extracting a specific value from each
 * @param context ArcGIS context of the current user.
 * @returns
 */
export async function resolveItemQueryValues(
  valueDef: IDynamicItemQueryDefinition,
  context: IArcGISContext
): Promise<DynamicValues> {
  const result = {};
  // execute the query
  // TODO: Error if neither query or scope are defined
  // Combine the query and scope into a single query;
  // The query and scope have already been dereferenced
  // but since the typing allows for `Reference` we need
  // to use `as IQuery` to TS to chill out.
  const query = (valueDef.query as IQuery) || {
    targetEntity: "item",
    filters: [],
  };
  const scope = (valueDef.scope as IQuery) || {
    targetEntity: "item",
    filters: [],
  };

  const combined = combineQueries([query, scope]);
  const opts: IHubSearchOptions = {
    requestOptions: context.hubRequestOptions,
  };
  // create/get memoized version of portalSearchItemsAsItems
  const memoizedPortalSearch = memoize(portalSearchItemsAsItems);
  // Execute the query
  const response = await memoizedPortalSearch(combined, opts);

  // TODO: dereference metrics so we can delegate one to another

  // This next section is all promise based so that a dynamic value
  // can itself be a dynamic value definition, which then needs to be
  // resolved.

  const promises = await response.results.reduce(
    async (valsPromise: any, r: any) => {
      const vals = await valsPromise;
      const valueFromItem = getProp(r, valueDef.sourcePath);
      // Handle case where value is not found...
      // e.g. the project exists but the metric is not defined yet
      if (valueFromItem) {
        if (
          typeof valueFromItem === "string" ||
          typeof valueFromItem === "number"
        ) {
          vals.push(Promise.resolve(valueFromItem));
        } else if (valueFromItem.type === "static-value") {
          vals.push(Promise.resolve(valueFromItem.value));
        } else {
          // valueFromItem is itself a valueDefinition so we call resolveDynamicValues again
          const vResult = await _INTERNAL_FNS.resolveDynamicValue(
            valueFromItem,
            context
          );
          // vals needs just the value - the number or string but vResult is an object
          // so we need to get it out of the object
          vals.push(getProp(vResult, valueFromItem.outPath));
        }
      }
      return vals;
    },
    Promise.resolve([] as any[])
  );
  const values = await Promise.all(promises);
  const aggretate = aggregateValues(values, valueDef.aggregation);
  setProp(valueDef.outPath, aggretate, result);

  return result;
}
