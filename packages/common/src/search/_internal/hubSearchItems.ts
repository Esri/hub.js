import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubContent } from "../..";
import { setProp } from "../../objects";
import { cloneObject } from "../../util";
import {
  IFilterGroup,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IHubApiSearchRequest,
  Filter,
  IFacet,
  IFacetOption,
  IMatchOptions,
} from "../types";
import { expandApi } from "../utils";

/**
 * Execute search against the Hub API
 * @param filter
 * @param options
 * @returns
 */
export async function hubSearchItems(
  filters: Array<IFilterGroup<"item">>,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const api = expandApi(options.api || "hub");

  // Purge filterType from the filters array
  const cleanFilters: any[] = [];
  filters.forEach((block) => {
    const b = {
      operation: block.operation,
      filters: block.filters.map((f) => {
        const c = cloneObject(f);
        delete c.filterType;
        return c;
      }),
    };
    cleanFilters.push(b);
  });

  const searchRequest: IHubApiSearchRequest = {
    q: cleanFilters,
    options: {
      num: options.num || 10,
      start: options.start || 1,
      sortField: options.sortField,
      sortOrder: options.sortOrder,
    },
  } as unknown as IHubApiSearchRequest;

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

    let token: string;
    if (options.authentication) {
      const us: UserSession = options.authentication as UserSession;
      token = us.token;
    }
    const tokenizeThubmnailUrl = (entry: any) => {
      if (token && entry.attributes.access !== "public") {
        entry.attributes.thumbnailUrl = `${entry.attributes.thumbnailUrl}?token=${token}`;
      }
      return entry;
    };
    json.data = json.data.map(tokenizeThubmnailUrl);
    // convert items to IHubSerchResult
    const conversion = (entry: Record<string, any>) => {
      return hubContentToSearchResult(jsonApiToHubContent(entry));
    };
    const results: IHubSearchResult[] = await Promise.all(
      json.data.map(conversion)
    );

    const facets = convertHubResponseToFacets(json);

    // now transform into a IHubSearchResponse
    const response = {
      total: json.meta.total,
      results,
      facets,
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

/**
 * Re-structure a jsonApi data entry into a flat object cast into
 * IHubContent
 * @param data
 * @returns
 */
export function jsonApiToHubContent(data: Record<string, any>): IHubContent {
  const content = cloneObject(data.attributes) as unknown as IHubContent;
  content.id = data.id;
  return content;
}

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
      // Dyanmic facets typically "AND" so we are refining
      const facet: IFacet = {
        label: entry.field,
        key: entry.field,
        aggField: entry.field,
        display: "multi-select",
        operation,
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
          filters: [filter],
        };
        options.push(fo);
      });
      facet.options = options;
      result.push(facet);
    });
  }
  return result;
}
