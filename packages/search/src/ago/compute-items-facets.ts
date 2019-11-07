import { UserSession } from "@esri/arcgis-rest-auth";
import { ISearchParams } from "./params";
import { getProp } from "@esri/hub-common";
import {
  format,
  hasApiAgg,
  collectionAgg,
  downloadableAgg,
  flattenCategories
} from "./helpers/aggs";
import { getItems } from "./get-items";

// these custom aggs are based on a field that are not supported by AGO aggregations
const customAggsNotSupportedByAgo = ["downloadable"];

// these custom aggs are based on a field that are supported by AGO aggregations
const customAggsSupportedByAgo = ["hasApi", "collection"];

const customAggsFunctions: { [key: string]: any } = {
  downloadable: downloadableAgg,
  hasApi: hasApiAgg,
  collection: collectionAgg
};

/**
 * Calculate item facets based on ago aggregations and/or compute custom aggregations not supported by AGO
 *
 * @param {any} agoAggregations aggregations from AGO
 * @param {ISearchParams} params search params
 * @param {String} token AGO token to make a search if calculating custom aggs like downloadable
 * @param {String} portal AGO portal against which search is being done
 * @param {UserSession} authentication UserSession object
 * @returns {Promise<any>}
 */
export async function computeItemsFacets(
  agoAggregations: any = { counts: Array<any>() }, // aggregations from ago search that ago supports by default
  params: ISearchParams, // query params are needed to another search for custom facets
  token?: string,
  portal?: string,
  authentication?: UserSession
): Promise<any> {
  const aggFields = getProp(params, "agg.fields");
  const aggs = aggFields ? aggFields.split(",") : [];
  // 1. For custom aggregations like downloadable, which AGO does not support,
  // we need to fetch 100 results and calc aggs on them
  let customAggs = intersection(aggs, customAggsNotSupportedByAgo);
  let facets1 = {};
  if (customAggs.length > 0) {
    const paramsCopy = { ...params, ...{ start: 1, num: 100 } };
    paramsCopy.agg = {};
    const response = await getItems(paramsCopy, token, portal, authentication);
    customAggs.forEach(customAgg => {
      const rawCounts = customAggsFunctions[customAgg](response);
      facets1 = { ...facets1, ...format(rawCounts) };
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
      const rawCounts = { ...customAggsFunctions[customAgg](agoAggregations) };
      facets3 = { ...facets3, ...format(rawCounts) };
    });
  }
  const computedFacets = { ...facets1, ...facets2, ...facets3 };
  // 4. format categories facet
  if (computedFacets.categories) {
    computedFacets.categories = flattenCategories(computedFacets.categories);
  }
  return computedFacets;
}

function intersection(arr1: any[], arr2: any[]): any[] {
  return arr1.filter(val => arr2.indexOf(val) !== -1);
}
