import { UserSession } from "@esri/arcgis-rest-auth";
import { agoSearch } from "./search";
import { ISearchParams } from "./params";
import { getProp } from "@esri/hub-common";
import { format, hasApi, collection, downloadable } from "./helpers/aggs";

// these custom aggs are based on a field that are not supported by AGO aggregations
const customAggsNotSupportedByAgo = ["downloadable"];

// these custom aggs are based on a field that are supported by AGO aggregations
const customAggsSupportedByAgo = ["hasApi", "collection"];

const customAggsFunctions: { [key: string]: any } = {
  downloadable,
  hasApi,
  collection
};

/*
 * This Util function takes AGO results and formats them into an aggregations object
 * that looks like it came from the V3 API. Many facets can be fairly easily mocked
 * using a standardized approach (the 'else if' and 'else' branches) but a few facets
 * require more complex and customized logic. Those go in the `customFacets` hash,
 * where the name of the key is the name of the facet being computed and the custom function
 * is implemented below.
 */

export async function computeItemsFacets(
  agoAggregations: any = { counts: Array<any>() }, // aggregations from ago search that ago supports by default
  params: ISearchParams, // query params are needed to another search for custom facets
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<any> {
  const aggs = (getProp(params, "agg.fields") || "").split(",");
  // 1. For custom aggregations like downloadable, which AGO does not support,
  // we need to fetch 100 results and calc aggs on them
  let customAggs = intersection(aggs, customAggsNotSupportedByAgo);
  let facets1 = {};
  if (customAggs.length > 0) {
    const paramsCopy = Object.assign({}, params, { start: 1, num: 100 });
    paramsCopy.agg = {};
    const response = await agoSearch(paramsCopy, token, portal, authentication);
    customAggs.forEach(customAgg => {
      const rawCounts = customAggsFunctions[customAgg](response);
      facets1 = Object.assign({}, facets1, format(rawCounts));
    });
  }
  // 2. for agoAggregations already provided which are sorted, just format them into v3 style
  const facets2 = agoAggregations.counts.reduce(
    (formattedAggs: any, agg: any) => {
      formattedAggs[agg.fieldName] = agg.fieldValues.map((fieldVal: any) => {
        return {
          key: fieldVal.value,
          docCount: fieldVal.count
        };
      });
      return formattedAggs;
    },
    {}
  );
  // 3. for custom aggs that are based on some field included in ago aggs
  customAggs = intersection(aggs, customAggsSupportedByAgo);
  let facets3 = {};
  if (customAggs.length > 0) {
    customAggs.forEach(customAgg => {
      const rawCounts = Object.assign(
        {},
        customAggsFunctions[customAgg](agoAggregations)
      );
      facets3 = Object.assign({}, facets3, format(rawCounts));
    });
  }
  return Object.assign({}, facets1, facets2, facets3);
}

function intersection(arr1: any[], arr2: any[]): any[] {
  return arr1.filter(val => arr2.indexOf(val) !== -1);
}
