import { UserSession } from "@esri/arcgis-rest-auth";
import { IItem, ISearchOptions, searchItems } from "@esri/arcgis-rest-portal";
import { setProp } from "..";
import { getFamily } from "../content";
import { IHubContent } from "../core";
import { getItemThumbnailUrl } from "../resources";
import {
  convertPortalResponseToFacets,
  expandContentFilter,
  mergeContentFilter,
  serializeContentFilterForPortal,
} from "./content-utils";
import {
  Filter,
  IContentSearchResult,
  IFacet,
  IFacetOption,
  IFilterBlock,
  IHubSearchOptions,
  IHubApiSearchRequest,
  IHubSearchResponse,
  IHubSearchResult,
  IMatchOptions,
} from "./types";
import { expandApi, getNextFunction } from "./utils";

export function hubSearchItems(
  filters: IFilterBlock<"item">[],
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  // hulk-smash the filter into a Filter<"content"> so we can use existing functions
  const contentFilters = filters as unknown as Filter<"content">[];
  // API
  const api = expandApi(options.api || "arcgis");

  let searchPromise;
  // Portal Search
  if (api.type === "arcgis") {
    // Merge
    const contentFilter = mergeContentFilter(contentFilters);
    // Expand
    const expanded = expandContentFilter(contentFilter);
    // Serialize for portal
    const so = serializeContentFilterForPortal(expanded);

    // Array of properties we want to copy from IHubSearchOptions
    // to the ISearchOptions
    const props: Array<keyof IHubSearchOptions> = [
      "authentication",
      "num",
      "sortField",
      "sortOrder",
      "site",
      "start",
    ];
    // copy the props over
    props.forEach((prop) => {
      if (options.hasOwnProperty(prop)) {
        so[prop as keyof ISearchOptions] = options[prop];
      }
    });

    // If we don't have auth, ensure we have .portal
    if (!so.authentication) {
      so.portal = `${api.url}/sharing/rest`;
    }

    // Aggregations
    if (options.aggFields?.length) {
      so.countFields = options.aggFields.join(",");
      so.countSize = options.aggLimit || 10;
    }

    searchPromise = searchPortal(so);
  } else {
    // Hub API Search
    return searchHub(filters, options);
  }
  return searchPromise;
}

/**
 * Execute search against the Hub API
 * @param filter
 * @param options
 * @returns
 */
async function searchHub(
  filters: IFilterBlock<"item">[],
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const api = expandApi(options.api || "hub");

  let searchRequest: IHubApiSearchRequest = {
    q: filters,
    options: {
      num: options.num || 10,
      start: options.start || 1,
    },
  };

  // Add optional props via setProp b/c typescript really does not like
  // adding properties after defining an object
  if (options.aggFields?.length) {
    const aggs = [
      {
        mode: "terms",
        fields: options.aggFields,
        num: options.aggLimit || 10,
      },
    ];
    setProp("aggregations", aggs, searchRequest.options);
  }
  if (options.authentication) {
    const session = {
      token: options.authentication.token,
      portal: options.authentication.portal,
    };
    setProp("session", session, searchRequest.options);
  }

  const opts: RequestInit = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(searchRequest),
  };

  try {
    const raw = await fetch(api.url, opts);
    const json = await raw.json();
    // TODO: portal needs to return more urls
    const portalUrl =
      options.authentication?.portal ||
      "https://devext.arcgis.com/sharing/rest";
    let token: string;
    if (options.authentication) {
      const us: UserSession = options.authentication as UserSession;
      token = us.token;
    }
    const thumbnailify = (entry: any) => {
      const itm = entry.attributes.item;
      entry.attributes.thumbnailUrl = getItemThumbnailUrl(
        itm,
        portalUrl,
        token
      );
      return entry;
    };
    json.data = json.data.map(thumbnailify);
    // convert items to IHubSerchResult
    const results: IHubSearchResult[] = await Promise.all(
      json.data.map(jsonApiToSearchResult)
    );

    const facets = convertHubResponseToFacets(json);

    // now transform into a IHubSearchResponse
    let response = {
      total: json.meta.total,
      results: results,
      facets: facets,
      hasNext: json.meta.hasNext,
      next: () => {
        // tslint:disable-next-line
        Promise.resolve(null);
      },
    } as IHubSearchResponse<IHubSearchResult>;

    return Promise.resolve(response);
  } catch (ex) {
    // TODO: Turn into a formal error
    throw ex;
  }
}

function itemToSearchResult(item: IItem): Promise<IHubSearchResult> {
  const result: IHubSearchResult = {
    id: item.id,
    type: item.type,
    name: item.title,
    owner: item.owner,
    summary: item.snippet || item.description,
    createdDate: new Date(item.created),
    createdDateSource: "item.created",
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified",
    thumbnailUrl: item.thumbnailUrl,
    metadata: [],
    hubType: "item",
    family: getFamily(item.type),
  };

  // TODO: here is where we will build pipelines on a per-type basis

  // TODO: Project Pipeline that get's data and adds
  // metadata for status from item.data.status

  return Promise.resolve(result);
}

export function jsonApiToSearchResult(
  data: IHubContent
): Promise<IHubSearchResult> {
  const content = data.attributes;

  const result: IHubSearchResult = {
    id: data.id,
    type: content.type,
    name: content.title,
    owner: content.owner,
    summary: content.snippet || content.description,
    createdDate: new Date(content.createdDate),
    createdDateSource: content.createdDateSource,
    updatedDate: new Date(content.updatedDate),
    updatedDateSource: content.updatedDateSource,
    thumbnailUrl: content.thumbnailUrl,
    metadata: [],
    hubType: "item",
    family: content.family,
  };

  // TODO: Per-type plucking of props into the `meta` hash for use in the card components

  return Promise.resolve(result);
}

interface IHubMetaResponse {
  total: number;
  start: number;
  num: number;
  hasNext: boolean;
  next: number;
  aggregations: Array<{
    field: string;
    values: Array<{
      value: any;
      count: number;
    }>;
  }>;
}

export function convertHubResponseToFacets(
  response: any,
  operation: "OR" | "AND" = "OR"
): IFacet[] {
  const result: IFacet[] = [];

  if (response.meta?.aggregations) {
    const meta = response.meta as unknown as IHubMetaResponse;
    meta.aggregations.forEach((entry) => {
      const facet: IFacet = {
        label: entry.field,
        key: entry.field,
        aggField: entry.field,
        display: "multi-select",
      };

      const options: IFacetOption[] = [];

      entry.values.forEach((fv: any) => {
        const filter: Filter<"item"> = {
          filterType: "item",
        };
        // construct the filter based on the operation
        const matchKey = operation === "OR" ? "any" : "all";
        const filterMatchOption = {} as IMatchOptions;
        filterMatchOption[matchKey] = [fv.value];
        filter[entry.field] = filterMatchOption;
        // construct the FacetOption
        const fo: IFacetOption = {
          label: `${fv.value} (${fv.count})`,
          key: fv.value,
          count: fv.count,
          selected: false,
          filter,
        };
        options.push(fo);
      });
      facet.options = options;
      result.push(facet);
    });
  }
  return result;
}

/**
 * Internal portal search, which then converts items to Content, and
 * if a Site was passed, also sets urls
 *
 * @param searchOptions
 * @param site
 * @returns
 */
async function searchPortal(
  searchOptions: ISearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const portalUrl =
    searchOptions.authentication?.portal || searchOptions.portal;
  let token: string;
  if (searchOptions.authentication) {
    const us: UserSession = searchOptions.authentication as UserSession;
    token = us.token;
  }

  const thumbnailify = (item: IItem) => {
    item.thumbnailUrl = getItemThumbnailUrl(item, portalUrl, token);
    return item;
  };

  const resp = await searchItems(searchOptions);

  // add thumbnail url
  resp.results = resp.results.map(thumbnailify);

  const hasNext: boolean = resp.nextStart > -1;

  // ENRICHMENT
  // convert items to IHubSerchResult
  let results = await Promise.all(resp.results.map(itemToSearchResult));

  // TODO: Add the url
  // if we have a site, add those urls
  // if (searchOptions.site) {
  //   results = results.map((entry) =>
  //     setContentSiteUrls(entry, searchOptions.site)
  //   );
  // }
  // add thumbnailUrl

  // convert aggregations into facets
  const facets = convertPortalResponseToFacets(resp);
  return {
    total: resp.total,
    results,
    facets,
    hasNext,
    next: getNextFunction<IHubSearchResult>(
      searchOptions,
      resp.nextStart,
      resp.total,
      searchPortal
    ),
  };
}
