import { IArcGISContext } from "../../ArcGISContext";
import {
  DynamicValues,
  IDynamicItemQueryDefinition,
  IDynamicValueOutput,
  IValueSource,
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
import { IItem } from "@esri/arcgis-rest-portal";

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
): Promise<Record<string, IDynamicValueOutput>> {
  const result: Record<string, IDynamicValueOutput> = {};
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

  // Preprocess the items in the response so they source information is present
  // and can be carried forward

  // This next section is all promise based so that a dynamic value
  // can itself be a dynamic value definition, which then needs to be
  // resolved.

  const promises = await response.results.reduce(
    async (valsPromise: any, item: IItem) => {
      const vals = await valsPromise;
      const valueFromItem = getProp(item, valueDef.sourcePath);

      const valueSource: IValueSource = {
        id: item.id,
        label: item.title,
        type: item.type,
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
          valueSource.value = valueFromItem;
          vals.push(
            Promise.resolve({
              value: valueFromItem,
              sources: [valueSource],
            })
          );
        } else if (valueFromItem.type === "static-value") {
          valueSource.value = valueFromItem.value;
          vals.push(
            Promise.resolve({
              value: valueFromItem.value,
              sources: [valueSource],
            })
          );
        } else {
          // valueFromItem is itself a valueDefinition so we call resolveDynamicValues again
          // attach in the value source, so it's present for the next level of recursion
          valueFromItem.source = valueSource;
          const vResult = await resolveDynamicValue(valueFromItem, context);
          vals.push(getProp(vResult, valueFromItem.outPath));
        }
      }
      return vals;
    },
    Promise.resolve([] as any[])
  );
  const outputs = (await Promise.all(promises)) as IDynamicValueOutput[];
  // aggregate the values
  const values = outputs.map((o) => o.value);
  const aggretate = aggregateValues(values, valueDef.aggregation);
  // construct the output
  const output: IDynamicValueOutput = {
    value: aggretate,
    sources: outputs.reduce((acc, o) => acc.concat(o.sources), []),
  };
  // assign into the result
  setProp(valueDef.outPath, output, result);

  return result;
}
