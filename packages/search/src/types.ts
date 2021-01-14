/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

export type base64 = string;

export type iso8601Date = string;

export interface IDateRange {
  from: iso8601Date;
  to: iso8601Date;
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export interface ICursorSearchResults<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: () => Promise<ICursorSearchResults<T>>;
}
