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
  private portalSharingUrl: string;
  private isPortal: boolean;
  private hubApiUrl: string;
  private session: UserSession;

  constructor(params: ISearchServiceParams) {
    this.portalSharingUrl = params.portalSharingUrl;
    this.isPortal = params.isPortal;
    this.hubApiUrl = getHubApiUrl(this.portalSharingUrl);
    this.session = params.session;
  }

  search(request: IContentSearchRequest): Promise<IContentSearchResponse> {
    if (this.isPortal) {
      return this.enterpriseSearch(request);
    }
    return this.onlineSearch(request);
  }

  private enterpriseSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    const requestParams: ISearchOptions = convertToPortalParams(
      request,
      this.portalSharingUrl,
      this.session
    );
    return searchItems(requestParams).then((response: ISearchResult<IItem>) =>
      convertPortalResponse(requestParams, response)
    );
  }

  private onlineSearch(
    request: IContentSearchRequest = { filter: {}, options: {} }
  ): Promise<IContentSearchResponse> {
    const requestParams: ISearchParams = convertToHubParams(request);
    const authentication = getProp(request, "options.session") || this.session;
    return hubApiRequest("/search", {
      hubApiUrl: this.hubApiUrl,
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
}
