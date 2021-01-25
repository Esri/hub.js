/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import { ICursorSearchResults } from "./hub";

export {
  agoSearch,
  agoFormatItemCollection,
  serialize,
  computeItemsFacets
} from "./ago";
export * from "./users";
export * from "./types";
export * from "./util";

export interface ISearchService<T, U> {
  search(params: T): Promise<ICursorSearchResults<U>>;
}

export abstract class SearchService<T, U> implements ISearchService<T, U> {
  constructor(
    private portalBaseUrl: string,
    private userSession: UserSession,
    private apiUrl?: string
  ) {}

  abstract search(params: T): Promise<ICursorSearchResults<U>>;
}
