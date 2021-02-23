const DATE_FILTER_FIELDS = ["created", "modified"];

export function isFilterAString(filterValue: any) {
  return typeof filterValue === "string";
}

export function isFilterAnArray(filterValue: any) {
  return Array.isArray(filterValue);
}

export function isFilterFieldADateRange(filterField: string) {
  return DATE_FILTER_FIELDS.indexOf(filterField) >= 0;
}
