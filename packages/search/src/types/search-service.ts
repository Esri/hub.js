import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Defines a set of common parameters that can be used to build different
 * search services
 */
export interface ISearchServiceParams {
  portal: string;
  isPortal: boolean;
  authentication?: UserSession;
}

/**
 * Defines an interface that different Search Services should extend.
 * Small interface that specifies a single public search method.
 * Input/outputs parameterized for flexibility.
 */
export interface ISearchService<T, U> {
  search(params: T): U;
}
