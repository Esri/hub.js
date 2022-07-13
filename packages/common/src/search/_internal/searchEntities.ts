import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";

import { IHubSearchOptions, IHubSearchResponse, IQuery } from "../types";
import { expandApi, getNextFunction } from "../utils";

import { serializeQueryForPortal } from "../serializeQueryForPortal";
import { convertPortalAggregations } from "./portalSearchUtils";

/**
 * @private
 */
export type ConversionFunction<T> = (
  i: IItem,
  ro?: IRequestOptions
) => Promise<T>;

/**
 * @private
 * Execute a search and convert to a specific entity
 * @param query
 * @param convertFn
 * @param options
 * @returns
 */
export function searchEntities<T>(
  query: IQuery,
  convertFn: ConversionFunction<T>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<T>> {
  // serialize query to searchOptions
  const searchOptions = serializeQueryForPortal(query);

  // Aggregations
  if (options.aggFields?.length) {
    searchOptions.countFields = options.aggFields.join(",");
    searchOptions.countSize = options.aggLimit || 10;
  }
  // properties to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "num",
    "sortField",
    "sortOrder",
    "start",
    "requestOptions",
  ];

  // Include "start" here
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      searchOptions[prop as keyof ISearchOptions] = options[prop];
    }
  });
  // create the entitySearchFn
  const searchFn = createEntitySearchFn(convertFn);

  // Add ArcGIS API
  if (options.api && !options.authentication) {
    const expandedApi = expandApi(options.api);
    searchOptions.portal = expandedApi.url;
  }
  return searchFn(searchOptions);
}

/**
 * @private
 * @param convertFn
 * @returns
 */
export function createEntitySearchFn<T>(
  convertFn: ConversionFunction<T>
): (v: ISearchOptions) => Promise<IHubSearchResponse<T>> {
  // Return a function that does the search, with a closure over the
  // conversion function. Naming this function is important as it's
  // referenced in the `next` section below
  return async function executeSearch(
    searchOptions: ISearchOptions
  ): Promise<IHubSearchResponse<T>> {
    // execute the search against portal api
    const response = await searchItems(searchOptions);
    // run the conversion function
    const entities = await Promise.all(
      response.results.map((itm) => {
        return convertFn(itm, searchOptions);
      })
    );

    // convert portal  aggregations into hub aggregations
    const aggregations = convertPortalAggregations(response);

    return {
      total: response.total,
      results: entities,
      aggregations,
      hasNext: response.nextStart > -1,
      next: getNextFunction<T>(
        searchOptions,
        response.nextStart,
        response.total,
        executeSearch
      ),
    };
  };
}
