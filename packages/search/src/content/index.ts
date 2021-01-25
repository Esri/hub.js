import { UserSession } from '@esri/arcgis-rest-auth';
import { SearchService } from "..";
import { ICursorSearchResults } from "../types";
import { EnterpriseSearchService } from './enterprise';
import { OnlineSearchService } from './online';

const basePortalRestApis = ['https://arcgis.com/sharing/rest', 'https://www.arcgis.com/sharing/rest'];
const defaultApi = 'https://opendata.arcgis.com/v3/search';

// Applying explicit any here until more explicit typing is known between datasets, items, documents, etc.
export class ContentSearchService extends SearchService<any, any> {
  private source: SearchService<any, any>;

  constructor(portalBaseUrl: string, userSession: UserSession, apiUrl: string = defaultApi) {
    super(portalBaseUrl, userSession, apiUrl);
    this.source = this._initializeSource(portalBaseUrl, userSession, apiUrl);
  }

  static create(portalBaseUrl: string, userSession: UserSession, apiUrl: string = defaultApi) {
    return new ContentSearchService(portalBaseUrl, userSession, apiUrl);
  }

  async search(params: unknown): Promise<ICursorSearchResults<any>> {
    return this.source.search(params);
  }

  private _initializeSource(portalBaseUrl: string, userSession: UserSession, apiUrl: string): SearchService<any, any> {
    return basePortalRestApis.indexOf(portalBaseUrl) >= 0 ? 
      OnlineSearchService.create(portalBaseUrl, userSession, apiUrl) :
      EnterpriseSearchService.create(portalBaseUrl, userSession);
  }
}
