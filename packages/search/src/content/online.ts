import { UserSession } from "@esri/arcgis-rest-auth";
import { ContentSearchService } from ".";
import { ICursorSearchResults } from "..";

export class OnlineSearchService extends ContentSearchService {
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