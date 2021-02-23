import { UserSession } from "@esri/arcgis-rest-auth";

export interface ISearchServiceParams {
  portalSharingUrl: string;
  isPortal: boolean;
  hubApiUrl: string;
  session?: UserSession;
}

export interface ISearchService<T, U> {
  search(params: T): U;
}
