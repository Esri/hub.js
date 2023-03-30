import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";

import { serializeQueryForPortal } from "../serializeQueryForPortal";

import { enrichPageSearchResult } from "../../pages/HubPages";
import { enrichProjectSearchResult } from "../../projects";
import { enrichSiteSearchResult } from "../../sites";
import { IHubRequestOptions } from "../../types";

import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IMatchOptions,
  IPredicate,
  IQuery,
} from "../types";
import { getNextFunction } from "../utils";
import { convertPortalAggregations } from "./portalSearchUtils";
import { expandPredicate } from "./expandPredicate";
import HubError from "../../HubError";
import { enrichContentSearchResult } from "../../content";
import { cloneObject } from "../../util";

/**
 * @internal
 * Portal Search Implementation for Items
 * @param query
 * @param options
 * @returns
 */
export async function portalSearchItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const so = processSearchParams(options, query);
  return searchPortalAsHubSearchResult(so);
}

/**
 * @internal
 * Portal Search for Items using IQuery and IHubSearchOptions
 * @param query
 * @param options
 * @returns
 */
export function portalSearchItemsAsItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IItem>> {
  const so = processSearchParams(options, query);
  return searchPortalAsItem(so);
}

/**
 * Common preprocessing for search options and the query
 * @param options
 * @param query
 * @returns
 */
function processSearchParams(options: IHubSearchOptions, query: IQuery) {
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
  return so;
}

/**
 * Internal portal search, which just returns IItems witn no conversion
 * Due to typescript complexity when adding multiple returns types to a function
 * it is simpler to have two functions that do the almost the same thing.
 * @param searchOptions
 * @returns
 */
async function searchPortalAsItem(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IItem>> {
  // Execute portal search
  const resp = await searchItems(searchOptions);

  // convert portal  aggregations into hub aggregations
  const aggregations = convertPortalAggregations(resp);

  // Construct the return
  return {
    total: resp.total,
    results: resp.results,
    aggregations,
    hasNext: resp.nextStart > -1,
    next: getNextFunction<IItem>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortalAsItem
    ),
  };
}

/**
 * Internal portal search, which then converts `IItem`s to `IHubSearchResult`s
 * handling enrichments & includes along the way
 *
 * @param searchOptions
 * @returns
 */
async function searchPortalAsHubSearchResult(
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

  // convert portal  aggregations into hub aggregations
  const aggregations = convertPortalAggregations(resp);

  // Construct the return
  return {
    total: resp.total,
    results,
    aggregations,
    hasNext: resp.nextStart > -1,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortalAsHubSearchResult
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
export async function itemToSearchResult(
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

    // handle old hub sites
    case "Web Mapping Application":
      if (item.typeKeywords.includes("hubSite")) {
        fn = enrichSiteSearchResult;
      }
      break;
  }
  return fn(item, includes, requestOptions);
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

export const WellKnownItemPredicates: IWellKnownItemPredicates = {
  $application: [
    {
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
      type: "Web Mapping Experience",
      typekeywords: "EXB Experience",
    },
  ],
  $dashboard: [
    {
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
      typekeywords: ["OGC", "Geodata Service"],
    },
  ],
  $document: [
    {
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
      type: "Hub Initiative",
    },
  ],
  $experience: [
    {
      type: "Web Experience",
    },
  ],
  $feedback: [
    {
      type: "Form",
    },
  ],
  $page: [
    {
      typekeywords: "hubPage",
    },
  ],
  $site: [
    {
      type: ["Hub Site Application", "Site Application"],
    },
  ],
  $storymap: [
    {
      type: "Storymap",
    },
    {
      type: "Web Mapping Application",
      typekeywords: "Story Map",
    },
  ],
  $template: [
    {
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
    let replacedPredicates = false;
    filter.predicates = filter.predicates.reduce(
      (acc: IPredicate[], predicate) => {
        // if the predicate has a well-known type
        // we replace it with the set of predicates defined
        // for the well-known type
        if (isWellKnownTypeFilter(predicate.type)) {
          const replacements = lookupTypePredicates(
            predicate.type as keyof typeof WellKnownItemPredicates
          );
          acc = [...acc, ...replacements];
          replacedPredicates = true;
        } else {
          // this predicate does not have a well-known type
          // so we just keep it
          acc.push(predicate);
        }
        return acc;
      },
      []
    );
    if (replacedPredicates) {
      // Any filter who's predicates were replaced with
      // well-known predicates, needs to use "OR" to ensure
      // correct query logic
      filter.operation = "OR";
    }
    return filter;
  });

  return queryClone;
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
    result = key in WellKnownItemPredicates;
  }
  return result;
}

/**
 * Return the predicates for a well-known type
 * @param key
 * @returns
 */
function lookupTypePredicates(
  key: keyof typeof WellKnownItemPredicates
): IPredicate[] {
  return WellKnownItemPredicates[key];
}
