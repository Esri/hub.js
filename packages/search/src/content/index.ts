import { SearchService } from "..";
import { ICursorSearchResults } from "../hub";
import { UserSession } from '@esri/arcgis-rest-auth';


const basePortalRestApis = ['https://arcgis.com/sharing/rest', 'https://www.arcgis.com/sharing/rest'];
const defaultApi = 'https://opendata.arcgis.com/v3/search';


// Applying explicit any here until more explicit typing is known between datasets, items, documents, etc.
export class ContentSearchService extends SearchService<any> {
  private source: SearchService<any>;

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

  private _initializeSource(portalBaseUrl: string, userSession: UserSession, apiUrl: string): SearchService<any> {
    return basePortalRestApis.indexOf(portalBaseUrl) >= 0 ? 
      OnlineSearchService.create(portalBaseUrl, userSession, apiUrl) :
      EnterpriseSearchService.create(portalBaseUrl, userSession);
  }
}


class OnlineSearchService extends ContentSearchService {
  constructor(portalBaseUrl: string, userSession: UserSession, apiUrl: string) {
    super(portalBaseUrl, userSession, apiUrl);
  }

  static create(portalBaseUrl: string, userSession: UserSession, apiUrl: string) {
    return new OnlineSearchService(portalBaseUrl, userSession, apiUrl);
  }

  async search(params: unknown): Promise<ICursorSearchResults<any>> {
    const last: ICursorSearchResults<any> = {
      total: 6,
      results: [ '4', '5', '6' ],
      hasNext: false,
      next: null
    }

    return {
      total: 10,
      results: [ '1', '2', '3' ],
      hasNext: true,
      next: () => Promise.resolve(last)
    }
  }
}

class EnterpriseSearchService extends SearchService<any> {
  constructor(portalBaseUrl: string, userSession: UserSession) {
    super(portalBaseUrl, userSession);
  }

  static create(portalBaseUrl: string, userSession: UserSession) {
    return new EnterpriseSearchService(portalBaseUrl, userSession);
  }

  async search(params: unknown): Promise<ICursorSearchResults<any>> {
    const last: ICursorSearchResults<any> = {
      total: 6,
      results: [ '4', '5', '6' ],
      hasNext: false,
      next: null
    }

    return {
      total: 10,
      results: [ '1', '2', '3' ],
      hasNext: true,
      next: () => Promise.resolve(last)
    }
  }
}