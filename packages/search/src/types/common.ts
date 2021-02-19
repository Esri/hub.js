export interface IDateRange<T> {
  from: T;
  to: T;
}

export enum SortDirection {
  asc = "asc",
  desc = "desc"
}
