import { IHubContent } from "../../core";
import { cloneObject } from "../../util";
import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import { portalSearchItems } from "./portalSearchItems";

// ##    ##  #######  ######## ########
// ###   ## ##     ##    ##    ##
// ####  ## ##     ##    ##    ##
// ## ## ## ##     ##    ##    ######
// ##  #### ##     ##    ##    ##
// ##   ### ##     ##    ##    ##
// ##    ##  #######     ##    ########
//
// Since Hub API is still in flux, there is no code coverage for this file

/**
 * @private
 * Execute item search against the Hub API
 * @param query
 * @param options
 * @returns
 */
/* istanbul ignore next */
export async function hubSearchItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  let fn;

  // If query definition leverages enrichments, use index
  if (shouldOnlyUseHubIndex(query)) {
    fn = hubSearchItemsIndex;
    // If aggregations are requested, potentially reach out to
    // both portal and our index and combine responses
  } else if (isAggregationSearch(options)) {
    fn = hubSearchItemsAggregations;
    // Nothing special needed, just go to portal
  } else {
    fn = portalSearchItems;
  }

  // Nothing special needed, just go to portal
  return fn(query, options);
}

export async function hubSearchItemsAggregations(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // If the query underlying the aggregations is only
  // supported by the index, go to the index
  if (shouldOnlyUseHubIndex(query)) {
    return hubSearchItemsIndex(query, options);
  }

  // Fetch as many aggregations from Portal as possible. Fetch any remaining
  // from the index and combine the responses
  let promises = [];

  const portalOptions = getPortalAggregationOptions(options);
  portalOptions && promises.push(portalSearchItems(query, portalOptions));

  const indexOptions = getIndexAggregationOptions(options);
  indexOptions && promises.push(hubSearchItemsIndex(query, indexOptions));

  const results = await Promise.all(promises);

  return results.reduce(
    (combinedResult, { aggregations = [], messages = [] }) => {
      combinedResult.aggregations.push(...aggregations);
      combinedResult.messages.push(...messages);
      return combinedResult;
    },
    {
      total: 0,
      results: [],
      hasNext: false,
      next: null,
      aggregations: [],
      messages: [],
    } as IHubSearchResponse<IHubSearchResult>
  );
}

export function hubSearchItemsIndex(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  return null;
}

export function isAggregationSearch(options: IHubSearchOptions) {
  return options.aggFields?.length;
}

export function getPortalAggregationOptions(
  options: IHubSearchOptions
): IHubSearchOptions {
  const portalCountFields = ["access", "categories", "tags", "type"];
  const aggFields = options.aggFields.filter((f) =>
    portalCountFields.includes(f)
  );

  return aggFields.length ? { ...options, aggFields } : null;
}

export function getIndexAggregationOptions(
  options: IHubSearchOptions
): IHubSearchOptions {
  const enrichmentAggFields = ["source", "license"];
  const aggFields = options.aggFields.filter((f) =>
    enrichmentAggFields.includes(f)
  );

  return aggFields.length ? { ...options, aggFields } : null;
}

export function shouldOnlyUseHubIndex(query: IQuery) {
  return false;
}

/**
 * Re-structure a jsonApi data entry into a flat object cast into
 * IHubContent
 * @param data
 * @returns
 */
/* istanbul ignore next */
export function jsonApiToHubContent(data: Record<string, any>): IHubContent {
  const content = cloneObject(data.attributes) as unknown as IHubContent;
  content.id = data.id;
  return content;
}

/* istanbul ignore next */
export function hubContentToSearchResult(
  content: IHubContent
): Promise<IHubSearchResult> {
  const result: IHubSearchResult = {
    access: content.access,
    id: content.id,
    type: content.type,
    name: content.name,
    owner: content.owner,
    summary: content.snippet || content.description,
    createdDate: new Date(content.createdDate),
    createdDateSource: content.createdDateSource,
    updatedDate: new Date(content.updatedDate),
    updatedDateSource: content.updatedDateSource,
    thumbnailUrl: content.thumbnailUrl,
    metadata: [],
    family: content.family,
    urls: {
      portalHome: "not-implemented",
      relative: "not-implemented",
    },
  };

  // TODO: Per-type plucking of props into the `meta` hash for use in the card components

  return Promise.resolve(result);
}
