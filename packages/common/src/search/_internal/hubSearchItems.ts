import { IItem } from "@esri/arcgis-rest-types";
import { IHubContent } from "../../core";
import { getProp } from "../../objects/get-prop";
import { RemoteServerError } from "../../request";
import { IHubRequestOptions } from "../../types";
import { IQueryParams } from "../../urls";
import { cloneObject } from "../../util";
import {
  IApiDefinition,
  IFilter,
  IHubAggregation,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
  IQuery,
} from "../types";
import { itemToSearchResult } from "./portalSearchItems";

// ##    ##  #######  ######## ########
// ###   ## ##     ##    ##    ##
// ####  ## ##     ##    ##    ##
// ## ## ## ##     ##    ##    ######
// ##  #### ##     ##    ##    ##
// ##   ### ##     ##    ##    ##
// ##    ##  #######     ##    ########
//
// Since Hub API is still in flux, there is no code coverage for this file
/* istanbul ignore file */

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
  return options.aggFields?.length
    ? searchOgcAggregations(query, options)
    : searchOgcItems(query, options);
}

export interface IOgcItem {
  id: string;
  type: "Feature";
  geometry: any; // for simplification
  time: any; // for simplification
  links: any[]; // for simplification
  properties: Record<string, any>;
}

interface IOgcLink {
  rel: "self" | "next" | "prev" | "collection";
  type: string;
  title: string;
  href: string;
}

export interface IOgcItemsResponse {
  type: "FeatureCollection";
  features: IOgcItem[];
  timestamp: string;
  numberMatched: number;
  numberReturned: number;
  links: IOgcLink[];
}

interface IOgcItemFieldAggregation {
  field: string;
  aggregations: Array<{ label: string; value: any }>;
}

export interface IOgcAggregationsResponse {
  aggregations: {
    aggregations: IOgcItemFieldAggregation[];
  };
  timestamp: string;
  links: IOgcLink[];
}

////////////////////////////////////
// Root Search Functions
////////////////////////////////////
export async function searchOgcItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const apiDefinition = options.api as IApiDefinition;
  const url = `${apiDefinition.url}/items`;
  const queryParams = getOgcItemQueryParams(query, options);

  const rawResponse: IOgcItemsResponse = await ogcApiRequest(
    url,
    queryParams,
    options
  );

  return formatOgcItemsResponse(rawResponse, query, options);
}

export async function searchOgcAggregations(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const apiDefinition = options.api as IApiDefinition;
  const url = `${apiDefinition.url}/aggregations`;
  const queryParams = getOgcAggregationQueryParams(query, options);

  const rawResponse = await ogcApiRequest(url, queryParams, options);

  return formatOgcAggregationsResponse(rawResponse);
}

export async function ogcApiRequest(
  url: string,
  queryParams: IQueryParams,
  options: IHubSearchOptions
) {
  // use fetch override if any
  const _fetch = options.requestOptions?.fetch || fetch;
  const withQueryString = url + getQueryString(queryParams);
  const response = await _fetch(withQueryString, { method: "GET" });

  if (!response.ok) {
    throw new RemoteServerError(
      response.statusText,
      withQueryString,
      response.status
    );
  }

  return response.json();
}

////////////////////////////////////
// Request Transformation Helpers
////////////////////////////////////

export function getOgcAggregationQueryParams(
  _query: IQuery,
  options: IHubSearchOptions
) {
  // TODO: use options.aggLimit once the OGC API supports it
  const aggregations = `terms(fields=(${options.aggFields.join()}))`;
  // TODO: Use `query` to filter aggregations once the OGC API supports it
  const token = getProp(options, "requestOptions.authentication.token");

  return { aggregations, token };
}

export function getQueryString(queryParams: IQueryParams) {
  const result = Object.entries(queryParams)
    .filter(([_key, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return result && `?${result}`;
}

export function getOgcItemQueryParams(
  query: IQuery,
  options: IHubSearchOptions
) {
  const filter = getFilterQueryParam(query);
  const token = getProp(options, "requestOptions.authentication.token");
  const limit = options.num;
  // API requires the param name be all lowercase
  const startindex = options.start;

  return { filter, token, limit, startindex };
}

export function getFilterQueryParam(query: IQuery) {
  return query.filters.map(formatFilterBlock).join(" AND ");
}

export function formatFilterBlock(filter: IFilter) {
  const operation = filter.operation || "OR";
  const formatted = filter.predicates
    .map(formatPredicate)
    .join(` ${operation} `);
  return `(${formatted})`;
}

export function formatPredicate(predicate: IPredicate) {
  const formatted = Object.entries(predicate)
    // Remove undefined entries
    .filter(([_field, value]) => !!value)
    // Create sections for each field
    .reduce((acc, [field, value]) => {
      let section;
      if (typeof value === "string") {
        // TODO: do we add single quotes for string fields?
        section = `${field}=${value}`;
      } else if (Array.isArray(value)) {
        section = `${field} IN (${value.join(", ")})`;
      } else {
        const anys = value.any && `${field} IN (${value.any.join(", ")})`;
        const alls =
          value.all &&
          value.all.map((v: string) => `${field}=${v}`).join(" AND ");
        const nots = value.not && `${field} NOT IN (${value.not.join(", ")})`;
        section = [anys, alls, nots]
          .filter((subsection) => !!subsection)
          .join(" AND ");
      }
      acc.push(section);
      return acc;
    }, [])
    // AND together all field requirements
    .join(" AND ");

  return `(${formatted})`;
}

//////////////////////////////////////
// Response Transformation Helpers
//////////////////////////////////////

export function formatOgcAggregationsResponse(
  response: IOgcAggregationsResponse
): IHubSearchResponse<IHubSearchResult> {
  const aggregations: IHubAggregation[] =
    response.aggregations.aggregations.map((ogcAgg) => ({
      // What should it really be?
      mode: "terms",
      field: ogcAgg.field,
      values: ogcAgg.aggregations.map((a) => ({
        // Not confusing at all, right? Just some differences in terminology
        value: a.label,
        count: a.value,
      })),
    }));

  return {
    total: 0,
    results: [],
    hasNext: false,
    next: () => null,
    aggregations,
  };
}

export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const formattedResults = await Promise.all(
    response.features.map((f) => ogcItemToSearchResult(f))
  );
  const next = getNextOgcCallback(response, originalQuery, originalOptions);
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}

export function getNextOgcCallback(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): (params?: any) => Promise<IHubSearchResponse<IHubSearchResult>> {
  const nextLink = response.links.find((l) => l.rel === "next");

  let callback = (): Promise<IHubSearchResponse<IHubSearchResult>> => null;
  if (nextLink) {
    callback = () => {
      const nextUrl = new URL(nextLink.href);
      const start = +nextUrl.searchParams.get("startindex");
      const nextOptions: IHubSearchOptions = { ...originalOptions, start };
      return searchOgcItems(originalQuery, nextOptions);
    };
  }

  return callback;
}

export function ogcItemToSearchResult(
  ogcItem: IOgcItem,
  includes?: string[],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // OGC Api stuffs the item wholesale in  `.properties`
  // NOTE: the properties hash may also have some extraneous members such
  // as `license` and `source` if the OgcItem came from the index.
  const pseudoItem = ogcItem.properties as IItem;
  return itemToSearchResult(pseudoItem, includes, requestOptions);
}

// NOTE: don't use functions below this comment

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
