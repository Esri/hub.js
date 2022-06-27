import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  convertPortalItemResponseToFacets,
  enrichContentSearchResult,
  HubError,
} from "../..";

import { expandPredicate, serializeQueryForPortal } from "./ifilter-utils";

import { enrichPageSearchResult } from "../../pages/HubPages";
import { enrichProjectSearchResult } from "../../projects";
import { enrichSiteSearchResult } from "../../sites";
import { IHubRequestOptions } from "../../types";
import { expandFilter, serializeFilterGroupsForPortal } from "../filter-utils";
import {
  Filter,
  IFilterGroup,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IMatchOptions,
  IPredicate,
  IQuery,
} from "../types";
import { getNextFunction } from "../utils";
import { convertPortalAggregations } from "./portalSearchUtils";

/**
 * @private
 * DEPRECATED
 * @param filterGroups
 * @param options
 * @returns
 */
export async function portalSearchItemsFilterGroups(
  filterGroups: Array<IFilterGroup<"item">>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (!options.requestOptions) {
    throw new HubError(
      "hubSearch",
      "requestOptions: IHubRequestOptions is required."
    );
  }
  // Expand well-known filterGroups
  const replaced = applyWellKnownItemFilterGroups(filterGroups);
  // Expand the individual filters in each of the groups
  const expandedGroups = replaced.map((fg) => {
    fg.filters = fg.filters.map(expandFilter);
    return fg;
  });

  // Serialize the all the groups for portal
  const so = serializeFilterGroupsForPortal(expandedGroups);
  // Array of properties we want to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "num",
    "sortField",
    "sortOrder",
    "include",
    "start",
    "requestOptions", // although requestOptions is not needed on ISearchOption we send it through so downstream fns have access to it
  ];
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });

  if (options.requestOptions.authentication) {
    so.authentication = options.requestOptions.authentication;
  } else {
    so.portal = options.requestOptions.portal;
  }

  // Aggregations
  if (options.aggFields?.length) {
    so.countFields = options.aggFields.join(",");
    so.countSize = options.aggLimit || 10;
  }
  return searchPortal(so);
}

/**
 * @private
 * Portal Search Implementation for Items
 * @param query
 * @param options
 * @returns
 */
export async function portalSearchItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (!options.requestOptions) {
    throw new HubError(
      "portalSearchItems",
      "options.requestOptions is required."
    );
  }
  // Expand well-known filterGroups
  const updatedQuery = applyWellKnownItemPredicates(query);
  // Expand the individual predicates in each filter
  updatedQuery.filters = updatedQuery.filters.map((filter) => {
    filter.predicates = filter.predicates.map(expandPredicate);
    return filter;
  });

  // Serialize the all the groups for portal
  const so = serializeQueryForPortal(updatedQuery);
  // Array of properties we want to copy from IHubSearchOptions to the ISearchOptions
  const props: Array<keyof IHubSearchOptions> = [
    "num",
    "sortField",
    "sortOrder",
    "include",
    "start",
    "requestOptions", // although requestOptions is not needed on ISearchOption we send it through so downstream fns have access to it
  ];
  // copy the props over
  props.forEach((prop) => {
    if (options.hasOwnProperty(prop)) {
      so[prop as keyof ISearchOptions] = options[prop];
    }
  });

  if (options.requestOptions.authentication) {
    so.authentication = options.requestOptions.authentication;
  } else {
    so.portal = options.requestOptions.portal;
  }

  // Aggregations
  if (options.aggFields?.length) {
    so.countFields = options.aggFields.join(",");
    so.countSize = options.aggLimit || 10;
  }
  return searchPortal(so);
}

/**
 * Internal portal search, which then converts `IItem`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns
 */
async function searchPortal(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // Execute portal search
  const resp = await searchItems(searchOptions);

  // create mappable fn that will handle the includes
  const fn = (item: IItem) => {
    return itemToSearchResult(
      item,
      searchOptions.includes,
      searchOptions.requestOptions
    );
  };

  // map over results
  const results = await Promise.all(resp.results.map(fn));

  // TODO Remove this call
  const facets = convertPortalItemResponseToFacets(resp);
  // convert portal  aggregations into hub aggregations
  const aggregations = convertPortalAggregations(resp);

  // Construct the return
  return {
    total: resp.total,
    results,
    facets,
    aggregations,
    hasNext: resp.nextStart > -1,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortal
    ),
  };
}

/**
 * Convert an `IItem` to a `IHubSearchResult`
 * Fetches the enrichments, and attaches them as directed in the `include` list
 * @param item
 * @param includes
 * @param requestOptions
 * @returns
 */
async function itemToSearchResult(
  item: IItem,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // based on the type, we delegate to type-specific functions
  // this allows each type to apply "default" enrichments
  let fn = enrichContentSearchResult;
  switch (item.type) {
    case "Hub Site Application":
    case "Site Application":
      fn = enrichSiteSearchResult;
      break;
    case "Hub Page":
    case "Site Page":
      fn = enrichPageSearchResult;
      break;
    case "Hub Project":
      fn = enrichProjectSearchResult;
      break;
  }
  return fn(item, includes, requestOptions);
}

interface IWellKnownItemFilters {
  $application: Array<Filter<"item">>;
  $feedback: Array<Filter<"item">>;
  $dashboard: Array<Filter<"item">>;
  $dataset: Array<Filter<"item">>;
  $experience: Array<Filter<"item">>;
  $site: Array<Filter<"item">>;
  $storymap: Array<Filter<"item">>;
  $initiative: Array<Filter<"item">>;
  $document: Array<Filter<"item">>;
  $webmap: Array<Filter<"item">>;
  $template: Array<Filter<"item">>;
  $page: Array<Filter<"item">>;
}

interface IWellKnownItemPredicates {
  $application: IPredicate[];
  $feedback: IPredicate[];
  $dashboard: IPredicate[];
  $dataset: IPredicate[];
  $experience: IPredicate[];
  $site: IPredicate[];
  $storymap: IPredicate[];
  $initiative: IPredicate[];
  $document: IPredicate[];
  $webmap: IPredicate[];
  $template: IPredicate[];
  $page: IPredicate[];
}

export const WellKnownItemFilters: IWellKnownItemFilters = {
  $application: [
    {
      filterType: "item",
      type: {
        any: [
          "Web Mapping Application",
          "Application",
          "Insights",
          "Web Experience",
        ],
        not: ["Insights Theme", "Insights Model"],
      },
      typekeywords: {
        not: ["hubSite", "Story Map"],
      },
    },
    {
      filterType: "item",
      type: "Web Mapping Experience",
      typekeywords: "EXB Experience",
    },
  ],
  $dashboard: [
    {
      filterType: "item",
      type: {
        any: ["Dashboard"],
        not: ["Operation View"],
      },
      typekeywords: {
        not: ["Extension", "ArcGIS Operation View"],
      },
    },
  ],
  $dataset: [
    {
      filterType: "item",
      type: {
        any: [
          "Scene Service",
          "Feature Collection",
          "Route Layer",
          "Layer",
          "Explorer Layer",
          "Tile Package",
          "Vector Tile Package",
          "Scene Package",
          "Layer Package",
          "Feature Service",
          "Stream Service",
          "Map Service",
          "Vector Tile Service",
          "Image Service",
          "WMS",
          "WFS",
          "WMTS",
          "KML",
          "KML Collection",
          "Globe Service",
          "CSV",
          "Shapefile",
          "GeoJson",
          "Service Definition",
          "File Geodatabase",
          "CAD Drawing",
          "Relational Database Connection",
        ],
        not: ["Web Mapping Application", "Geodata Service"],
      },
    },
    {
      filterType: "item",
      typekeywords: ["OGC", "Geodata Service"],
    },
  ],
  $document: [
    {
      filterType: "item",
      type: [
        "PDF",
        "Microsoft Excel",
        "Microsoft Word",
        "Microsoft Powerpoint",
        "iWork Keynote",
        "iWork Pages",
        "iWork Numbers",
        "Visio Document",
        "Document Link",
      ],
    },
  ],
  $initiative: [
    {
      filterType: "item",
      type: "Hub Initiative",
    },
  ],
  $experience: [
    {
      filterType: "item",
      type: "Web Experience",
    },
  ],
  $feedback: [
    {
      filterType: "item",
      type: "Form",
    },
  ],
  $page: [
    {
      filterType: "item",
      typekeywords: "hubPage",
    },
  ],
  $site: [
    {
      filterType: "item",
      type: ["Hub Site Application", "Site Application"],
    },
  ],
  $storymap: [
    {
      filterType: "item",
      type: "Storymap",
    },
    {
      filterType: "item",
      type: "Web Mapping Application",
      typekeywords: "Story Map",
    },
  ],
  $template: [
    {
      filterType: "item",
      type: [
        "Web Mapping Application",
        "Hub Initiative",
        "Hub Initiative Template",
        "Solution",
      ],
      typekeywords: {
        any: ["hubInitiativeTemplate", "hubSolutionTemplate", "Template"],
        not: "Deployed",
      },
    },
  ],
  $webmap: [
    {
      filterType: "item",
      type: {
        any: ["Web Map", "Web Scene"],
        not: "Web Mapping Application",
      },
    },
  ],
};

/**
 * @private
 * Convert a Filter Group to expand well-known type filters
 *
 * The purpose of this function is to allow for the use of short-hand
 * names for commonly used, complex queries.
 *
 * It works by looking for filters using the .type property, the value
 * of which is a key in the WellKnownItemFilters hash. If found in the
 * hash, the filters array of the active filterGroup is replaced with the
 * filters specified in the hash.
 *
 * NOTE: Any other properties specified in a filter will be removed
 *
 * Only exported to enable extensive testing
 * @param filterGroups
 */
export function applyWellKnownItemPredicates(query: IQuery): IQuery {
  const queryClone = cloneObject(query);
  // iterate the filters
  queryClone.filters = queryClone.filters.map((filter) => {
    // replace predicates with well-known types
    filter.predicates = filter.predicates.reduce(
      (acc: IPredicate[], predicate) => {
        // if the predicate has a well-known type
        // we replace it with the set of predicates defined
        // for the well-known type
        if (isWellKnownTypeFilter(predicate.type)) {
          const replacements = lookupTypePredicates(
            predicate.type as keyof typeof WellKnownItemFilters
          );
          acc = [...acc, ...replacements];
        } else {
          // this predicate does not have a well-known type
          // so we just keep it
          acc.push(predicate);
        }
        return acc;
      },
      []
    );
    return filter;
  });

  return queryClone;
}

/**
 * DEPRECATED
 * @param filterGroups
 * @returns
 */
export function applyWellKnownItemFilterGroups(
  filterGroups: Array<IFilterGroup<"item">>
): Array<IFilterGroup<"item">> {
  const clone = cloneObject(filterGroups);
  // iterate the filterGroups
  const result = clone.map((filterGroup) => {
    filterGroup.filters = filterGroup.filters.reduce((updated, filter) => {
      // check if the filter.type is a well-known type
      if (isWellKnownTypeFilter(filter.type)) {
        // get the set of filters to replace the current filter with
        const typeFilters = lookupTypeFilters(
          filter.type as keyof typeof WellKnownItemFilters
        );
        // Note: At this point we could try to "merge" in the other
        // props on the filter, into all the filters returned from
        // the well-known hash. The problem with this is that the
        // combination may yield unexpected results; For now, if a filter
        // includes `.type is keyof WellKnownItemFilters` we simply
        // replace the entire filter with the array of filters returne
        // from the hash
        updated = [...updated, ...typeFilters];
      } else {
        // filter does not have a well-known type entry so keep it
        updated.push(filter);
      }
      return updated;
    }, []);
    return filterGroup;
  });

  return result;
}

/**
 * Is the argument a well-known type "key"
 *
 * Accepts `string`, `string[]` or `IMatchOptions`
 * but only string values can possibly be keys
 * on `WellKnownItemFilters`
 * @param key
 * @returns
 */
export function isWellKnownTypeFilter(
  key: string | string[] | IMatchOptions
): boolean {
  let result = false;
  if (typeof key === "string") {
    result = key in WellKnownItemFilters;
  }
  return result;
}

/**
 * Fetch the array of fitlers from the well-known hash
 * @param key
 * @returns
 */
function lookupTypeFilters(
  key: keyof typeof WellKnownItemFilters
): Array<Filter<"item">> {
  return WellKnownItemFilters[key];
}

function lookupTypePredicates(
  key: keyof typeof WellKnownItemFilters
): IPredicate[] {
  const rawPredicates = WellKnownItemFilters[key];
  // Remove the filterType property as it's not needed in an IPredicate
  const predicates = rawPredicates.map((entry) => {
    const c = cloneObject(entry);
    delete c.filterType;
    return c;
  });
  return predicates;
}
