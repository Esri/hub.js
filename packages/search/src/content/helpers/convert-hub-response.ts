import { UserSession } from "@esri/arcgis-rest-auth";
import { datasetToContent, getProp } from "@esri/hub-common";
import { ISearchParams } from "../../ago/params";
import {
  IContentAggregations,
  IContentSearchResponse,
} from "../../types/content";
import {
  IAggregation,
  IAggregationResult,
} from "../../util/aggregations/merge-aggregations";

const PROP_MAP: Record<string, string> = {
  title: "name",
};

/**
 * Converts the response format returned by the Hub Indexer V3 API to a common format
 * @param request - the ISearchParams instance used to invoke the request
 * @param response - the JSON returned by the Hub Indexer V3 API
 * @param defaultAuthentication - a default UserSession instance that can be used for the next() request if none provided
 */
export function convertHubResponse(
  request: ISearchParams,
  response: any = { data: [], meta: {} },
  defaultAuthentication?: UserSession
): IContentSearchResponse {
  const results = response.data.map(datasetToContent);
  const { count, total, hasNext, query, aggregations } =
    getResponseMetadata(response);
  const next: (
    authentication?: UserSession
  ) => Promise<IContentSearchResponse> = getNextFunction(
    request,
    response,
    hasNext,
    defaultAuthentication
  );

  return {
    results,
    count,
    total,
    hasNext,
    query,
    aggregations: aggregations ? mapAggregations(aggregations) : undefined,
    next,
  };
}

function mapAggregations(
  aggregations: Record<string, any>
): IContentAggregations {
  return {
    counts: mapCountAggregations(aggregations),
  };
}

function mapCountAggregations(
  countAggs: Record<string, any>
): IAggregationResult[] {
  return Object.keys(countAggs).map((aggKey: string) => {
    const aggregations: IAggregation[] = countAggs[aggKey]
      ? countAggs[aggKey].map((agg: Record<string, any>) => ({
          label: agg.key.toLowerCase(),
          value: agg.docCount,
        }))
      : [];

    return {
      fieldName: aggKey,
      aggregations,
    };
  });
}

function getNextFunction(
  request: ISearchParams,
  response: any,
  hasNext: boolean,
  defaultAuthentication?: UserSession
): () => Promise<IContentSearchResponse> {
  return (auth?: UserSession) => {
    const authentication: UserSession = auth || defaultAuthentication;
    const headers =
      authentication &&
      authentication.serialize &&
      new Headers({ authentication: authentication.serialize() });
    if (hasNext) {
      // should this use hubRequest instead of fetch?
      return fetch(response.meta.next, {
        method: "GET",
        mode: "cors",
        headers,
      })
        .then((res) => res.json())
        .then((res) => convertHubResponse(request, res, defaultAuthentication));
    }
    const metadata: Record<string, any> = getResponseMetadata(response);
    return Promise.resolve({
      results: [],
      count: 0,
      total: metadata.total,
      hasNext: false,
      query: metadata.query,
      aggregations: metadata.aggregations
        ? mapAggregations(metadata.aggregations)
        : undefined,
      next: getNextFunction(request, response, false),
    });
  };
}

function getResponseMetadata(response: any): {
  count?: number;
  total?: number;
  hasNext?: boolean;
  query?: string;
  aggregations?: Record<string, any>;
} {
  const respQuery = getProp(response, "meta.queryParameters");
  const query = respQuery ? JSON.stringify(respQuery) : undefined;
  const respAggregations = getProp(response, "meta.stats.aggs") || {};
  const aggregations =
    Object.keys(respAggregations).length > 0 ? respAggregations : undefined;
  return {
    count: getProp(response, "meta.stats.count") || 0,
    total: getProp(response, "meta.stats.totalCount") || 0,
    hasNext: !!getProp(response, "meta.next"),
    query,
    aggregations,
  };
}
