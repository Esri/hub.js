/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import { ICursorSearchResults } from "./hub";

export {
  agoSearch,
  agoFormatItemCollection,
  serialize,
  computeItemsFacets
} from "./ago";

export * from "./util";

export interface ISearchService<T> {
  search(params: unknown): Promise<ICursorSearchResults<T>> | ICursorSearchResults<T>
}

export abstract class SearchService<T> implements ISearchService<T> {
  private portalBaseUrl: string;
  private userSession: UserSession;
  private apiUrl: string;

  constructor(portalBaseUrl: string, userSession: UserSession, apiUrl?: string) {
    this.portalBaseUrl = portalBaseUrl;
    this.userSession = userSession;
    this.apiUrl = apiUrl;
  }

  abstract search(params: unknown): Promise<ICursorSearchResults<T>> | ICursorSearchResults<T>
}
