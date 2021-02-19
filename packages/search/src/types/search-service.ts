import { UserSession } from "@esri/arcgis-rest-auth";

export interface ISearchServiceParams {
  portalUrl: string;
  isPortal: boolean;
  hubApiUrl: string;
  session?: UserSession;
}

export interface ISearchService<T, U> {
  search(params: T): U;
}
