import { UserSession } from "@esri/arcgis-rest-auth";
import { getProp } from "@esri/hub-common";
import { ISearchParams } from "../../ago/params";
import {
  IContentAggregations,
  IContentSearchResponse
} from "../../types/content";
import {
  IAggregation,
  IAggregationResult
} from "../../util/aggregations/merge-aggregations";

const PROP_MAP: Record<string, string> = {
  title: "name"
};

export function convertHubResponse(
  request: ISearchParams,
  response: any = { data: [], meta: {} },
  defaultAuthentication?: UserSession
): IContentSearchResponse {
  const results: any[] = response.data.map((d: Record<string, any>) =>
    getAttributes(d)
  );
  const { count, total, hasNext, query, aggregations } = getResponseMetadata(
    response
  );
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
    next
  };
}

function mapAggregations(
  aggregations: Record<string, any>
): IContentAggregations {
  return {
    counts: mapCountAggregations(aggregations)
  };
}

function mapCountAggregations(
  countAggs: Record<string, any>
): IAggregationResult[] {
  return Object.keys(countAggs).map((aggKey: string) => {
    const aggregations: IAggregation[] = countAggs[aggKey]
      ? countAggs[aggKey].map((agg: Record<string, any>) => ({
          label: agg.key.toLowerCase(),
          value: agg.docCount
        }))
      : [];

    return {
      fieldName: aggKey,
      aggregations
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
    const headers = authentication
      ? new Headers({ authentication: JSON.stringify(authentication) })
      : undefined;
    if (hasNext) {
      return fetch(response.meta.next, {
        method: "GET",
        mode: "cors",
        headers
      })
        .then(res => res.json())
        .then(res => convertHubResponse(request, res, defaultAuthentication));
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
      next: getNextFunction(request, response, false)
    });
  };
}

function getResponseMetadata(
  response: any
): {
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
    aggregations
  };
}

function getAttributes(data: Record<string, any>) {
  const attributes = getProp(data, "attributes");
  /* istanbul ignore else */
  if (attributes) {
    Object.keys(PROP_MAP).map((key: string) => {
      /* istanbul ignore else */
      if (PROP_MAP[key]) {
        attributes[key] = attributes[PROP_MAP[key]];
      }
    });
  }
  return attributes;
}
