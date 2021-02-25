const DATE_FILTER_FIELDS = ["created", "modified"];

export function isFilterANonEmptyString(filterValue: any): boolean {
  return filterValue && typeof filterValue === "string";
}

export function isFilterAnArrayWithData(filterValue: any): boolean {
  return Array.isArray(filterValue) && filterValue.length > 0;
}

export function isFilterFieldADateRange(filterField: string, filterValue: any) {
  return DATE_FILTER_FIELDS.indexOf(filterField) >= 0 && filterValue;
}
