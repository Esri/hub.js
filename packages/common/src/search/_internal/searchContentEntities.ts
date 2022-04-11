import { ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-types";

import { ISearchResponse } from "../../types";
import { Filter, IHubSearchOptions } from "../types";
import { expandApi, getNextFunction } from "../../search/utils";
import {
  convertPortalResponseToFacets,
  expandContentFilter,
  serializeContentFilterForPortal,
} from "../../search/content-utils";

/**
 * Definition of `convertItemTo<T>` functions
 */
export type ItemToEntityFunction<T> = (
  i: IItem,
  ro?: IRequestOptions
) => Promise<T>;

/**
 * Generic search that returns Hub Entity types converted from items
 * by the passed in `ItemToEntityFunction`
 *
 * This abstraction is used to ensure that searching from any of the
 * entity managers / modules is consistent, and returns the entity
 * types, instead of `IItem` or `IHubContent`
 *
 * @param filter
 * @param convertFn
 * @param options
 * @returns
 */
export function searchContentEntities<T>(
  filter: Filter<"content">,
  convertFn: ItemToEntityFunction<T>,
  options: IHubSearchOptions
): Promise<ISearchResponse<T>> {
  // expand filter so we can serialize to either api
  const expanded = expandContentFilter(filter);
  const searchOptions = serializeContentFilterForPortal(expanded);

  // DEPRECATION
  /* istanbul ignore next */
  if (options.aggregations?.length) {
    // tslint:disable-next-line:no-console
    console.warn(
      `IHubSearchOptions.aggregations is deprecated. Please use .aggFields instead.`
    );
    searchOptions.countFields = options.aggregations.join(",");
    searchOptions.countSize = options.aggLimit || 10;
  }

  // Aggregations
  if (options.aggFields?.length) {
    searchOptions.countFields = options.aggFields.join(",");
    searchOptions.countSize = options.aggLimit || 10;
  }
  // properties to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "authentication",
    "num",
    "sortField",
    "sortOrder",
    "site",
    "start",
  ];

  // Include "start" here
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      searchOptions[prop as keyof ISearchOptions] = options[prop];
    }
  });
  // create the entitySearchFn
  const searchFn = createContentEntitySearchFn(convertFn);
  // execute the search
  // Add ArcGIS API
  if (options.api && !options.authentication) {
    const expandedApi = expandApi(options.api);
    searchOptions.portal = expandedApi.url;
  }
  return searchFn(searchOptions);
}

/**
 * Return a function that holds a closure containing
 * a hub entity specific conversion function. This
 * allows the `.next()` function to use the function on
 * subsequent calls
 * @param convertFn
 * @returns
 */
export function createContentEntitySearchFn<T>(
  convertFn: ItemToEntityFunction<T>
): (v: ISearchOptions) => Promise<ISearchResponse<T>> {
  // Return a function that does the search, with a closure over the
  // conversion function. Naming this function is important as it's
  // referenced in the `next` section below
  return async function searchEntities(
    searchOptions: ISearchOptions
  ): Promise<ISearchResponse<T>> {
    const response = await searchItems(searchOptions);

    const entities = await Promise.all(
      response.results.map((itm) => {
        return convertFn(itm, searchOptions);
      })
    );

    // convert aggregations into facets
    const facets = convertPortalResponseToFacets(response);

    return {
      total: response.total,
      results: entities,
      facets,
      hasNext: response.nextStart > -1,
      next: getNextFunction<T>(
        searchOptions,
        response.nextStart,
        response.total,
        searchEntities
      ),
    };
  };
}
