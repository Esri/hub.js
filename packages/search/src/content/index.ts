import { UserSession } from "@esri/arcgis-rest-auth";
import { getHubApiUrl, getProp } from "@esri/hub-common";
import { IItem, ISearchOptions, ISearchResult } from "@esri/arcgis-rest-portal";
import { searchItems } from "@esri/arcgis-rest-portal";
import {
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

export function searchContent(
  request: IContentSearchRequest = { filter: {}, options: {} }
): Promise<IContentSearchResponse> {
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
