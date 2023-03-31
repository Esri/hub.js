import { IItem } from "@esri/arcgis-rest-types";
import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValues,
  IDynamicItemQueryDefinition,
} from "../../core/types/DynamicValues";
import { setProp } from "../../objects";
import { getProp } from "../../objects/get-prop";
import { IQuery } from "../../search/types/IHubCatalog";
import { IHubSearchOptions } from "../../search/types/IHubSearchOptions";

import { combineQueries } from "../../search/_internal/combineQueries";
import { portalSearchItemsAsItems } from "../../search/_internal/portalSearchItems";
import { aggregateValues } from "./aggregateValues";
import { memoize } from "../memoize";
import { resolveDynamicValue } from "./resolveDynamicValue";

/**
 * Memoized version of portalSearchItemsAsItems
 */

/**
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
  // const start = Date.now();
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
          // v is itself a valueDefinition so we call resolveDynamicValues again
          const vResult = await resolveDynamicValue(valueFromItem, context);
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

  // timings.staticValues = timings.staticValues + (Date.now() - start);
  return result;
}
