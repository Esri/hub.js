/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { UserSession } from "@esri/arcgis-rest-auth";

// Types/Enums
export type base64 = string;

export type iso8601Date = string;

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

// Interfaces
export interface IDateRange {
  from: iso8601Date;
  to: iso8601Date;
}

export interface ICursorSearchResults<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: () => Promise<ICursorSearchResults<T>>;
}

export interface ISearchService<T> {
  search(params: unknown): Promise<ICursorSearchResults<T>>;
}

// Abstract classes
export abstract class SearchService<T> implements ISearchService<T> {
  constructor(
    private portalBaseUrl: string,
    private userSession: UserSession,
    private apiUrl?: string
  ) {}

  abstract search(params: unknown): Promise<ICursorSearchResults<T>>;
}
