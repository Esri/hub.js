import { UserSession } from "@esri/arcgis-rest-auth";
import { getHubApiUrl, getProp, IHubRequestOptions } from "@esri/hub-common";
import { IItem, ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import { searchItems } from "@esri/arcgis-rest-portal";
import {
  IContentSearchOptions,
  IContentSearchRequest,
  IContentSearchResponse
} from "../types/content";
import { ISearchService, ISearchServiceParams } from "../types/search-service";
import { convertToPortalParams } from "./helpers/convert-request-to-portal-params";
import { convertToHubParams } from "./helpers/convert-request-to-hub-params";
import { ISearchParams } from "../ago/params";
import { hubApiRequest } from "@esri/hub-common";
import { convertPortalResponse } from "./helpers/convert-portal-response";
import { convertHubResponse } from "./helpers/convert-hub-response";

/**
 * A search service for searching content across the Portal API only or Portal API and the
 * Hub Indexer V3 API. Has a single public method for searching.
 *
 * @param portal The Portal Sharing URL of the portal for which content should be searched
 * @param isPortal Flag to determine if content searching should be limited to a Portal API
 * @param authentication Optional User Session instance that can be used for authentication
 *
 * ```js
 * import { ContentSearchService } from '@esri/hub-search'
 *
 * const service = new ContentSearchService({
 *     portal: 'https://hub.arcgis.com/sharing/rest,
 *     isPortal: false
 *     session: new UserSession({ ... })
 * });
 *
 * const searchResults = await service.search({ filters, options })
 * ```
 */
export class ContentSearchService
  implements
    ISearchService<IContentSearchRequest, Promise<IContentSearchResponse>> {
  private portal: string;
  private isPortal: boolean;
  private authentication: UserSession;

  constructor(params: ISearchServiceParams) {
    this.portal = params.portal;
    this.isPortal = params.isPortal;
    this.authentication = params.authentication;
  }

  /**
   * Entrypoint for Portal API-only or Portal API and Hub V3 API Search
   * @param request - the IContentSearchRequest instance for searching
   */
  search(request: IContentSearchRequest): Promise<IContentSearchResponse> {
    const isPortal = getProp(request, "options.isPortal") || this.isPortal;
    if (isPortal) {
      return this.enterpriseSearch(request);
    }
    return this.onlineSearch(request);
  }

  private enterpriseSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    return performEnterpriseContentSearch(
      request,
      this.portal,
      this.authentication
    );
  }

  private onlineSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    return performHubContentSearch(request, this.portal, this.authentication);
  }
}

function getHubRequestOptions(
  options: IContentSearchOptions
): IHubRequestOptions {
  if (!options) return null;

  return {
    authentication: options.authentication,
    isPortal: options.isPortal,
    hubApiUrl: getHubApiUrl(options.portal)
  };
}

/**
 * A standalone function for searching content across the Portal API only or Portal API and the
 * Hub Indexer V3 API.
 *
 * @param request - the IContentSearchRequest instance for searching
 *
 * ```js
 * import { searchContent } from '@esri/hub-search'
 *
 * const searchResults = searchContent({ filters, options })
 * ```
 */
export function searchContent(
  request: IContentSearchRequest = { filter: {}, options: {} },
  hubRequestOptions: IHubRequestOptions
): Promise<IContentSearchResponse> {
  const ro = hubRequestOptions
    ? hubRequestOptions
    : getHubRequestOptions(request.options);

  // then use RO in lookupDomain, etc

  if (getProp(request, "options.isPortal")) {
    return performEnterpriseContentSearch(request);
  }
  return performHubContentSearch(request);
}

function performEnterpriseContentSearch(
  request: IContentSearchRequest,
  defaultPortal?: string,
  defaultAuthentication?: UserSession
): Promise<IContentSearchResponse> {
  const requestParams: ISearchOptions = convertToPortalParams(
    request,
    defaultPortal,
    defaultAuthentication
  );
  return searchItems(requestParams).then((response: ISearchResult<IItem>) =>
    convertPortalResponse(requestParams, response)
  );
}

function performHubContentSearch(
  request: IContentSearchRequest,
  defaultPortal?: string,
  defaultAuthentication?: UserSession
): Promise<IContentSearchResponse> {
  const portal: string = getProp(request, "options.portal") || defaultPortal;
  const authentication: UserSession =
    getProp(request, "options.authentication") || defaultAuthentication;

  const hubApiUrl: string = getHubApiUrl(portal);
  const requestParams: ISearchParams = convertToHubParams(request);

  return hubApiRequest("/search", {
    hubApiUrl,
    authentication,
    isPortal: false,
    headers: {
      authentication: authentication
        ? JSON.stringify(authentication)
        : undefined
    },
    httpMethod: "POST",
    params: requestParams
  }).then((response: any) =>
    convertHubResponse(requestParams, response, authentication)
  );
}
