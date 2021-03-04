import { UserSession } from "@esri/arcgis-rest-auth";

export interface ISearchServiceParams {
  portal: string;
  isPortal: boolean;
  authentication?: UserSession;
}

export interface ISearchService<T, U> {
  search(params: T): U;
}
