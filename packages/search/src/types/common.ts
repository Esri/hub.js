export interface IDateRange<T> {
  from?: T;
  to?: T;
}

export enum SortDirection {
  asc = "asc",
  desc = "desc"
}

export interface ISearchRequest<T, U> {
  filter?: T;
  options?: U;
}

export interface ISearchResponse<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: (params?: any) => Promise<ISearchResponse<T>>;
}
