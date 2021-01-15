import { UserSession } from "@esri/arcgis-rest-auth";
import { ICursorSearchResults, SearchService } from "../types";
import { PortalSearchService } from "./portal";

const defaultApi = "https://opendata.arcgis.com/v3/search";

// Applying explicit any here until more explicit typing is known between datasets, items, documents, etc.
export class ContentSearchService extends SearchService<any> {
  private source: SearchService<any>;

  constructor(
    portalBaseUrl: string,
    userSession: UserSession,
    apiUrl: string = defaultApi
  ) {
    super(portalBaseUrl, userSession, apiUrl);
    this.source = this._initializeSource(portalBaseUrl, userSession, apiUrl);
  }

  static create(
    portalBaseUrl: string,
    userSession: UserSession,
    apiUrl: string = defaultApi
  ) {
    return new ContentSearchService(portalBaseUrl, userSession, apiUrl);
  }

  async search(params: unknown): Promise<ICursorSearchResults<any>> {
    return this.source.search(params);
  }

  private _initializeSource(
    portalBaseUrl: string,
    userSession: UserSession,
    _apiUrl: string
  ): SearchService<any> {
    return PortalSearchService.create(portalBaseUrl, userSession);
  }
}
