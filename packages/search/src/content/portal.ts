import { UserSession } from "@esri/arcgis-rest-auth";
import { SearchService } from "..";
import { ICursorSearchResults } from "../types";

export class PortalSearchService extends SearchService<any> {
  constructor(portalBaseUrl: string, userSession: UserSession) {
    super(portalBaseUrl, userSession);
  }

  static create(portalBaseUrl: string, userSession: UserSession) {
    return new PortalSearchService(portalBaseUrl, userSession);
  }

  async search(params: unknown): Promise<ICursorSearchResults<any>> {
    const last: ICursorSearchResults<any> = {
      total: 6,
      results: ["4", "5", "6"],
      hasNext: false,
      next: null
    };

    return {
      total: 10,
      results: ["1", "2", "3"],
      hasNext: true,
      next: () => Promise.resolve(last)
    };
  }
}
