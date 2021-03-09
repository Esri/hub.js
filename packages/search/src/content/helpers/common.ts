const DATE_FILTER_FIELDS = ["created", "modified"];

/**
 * Determines if filter value is a non-empty string
 * @param filterValue - a filter value
 */
export function isFilterANonEmptyString(filterValue: any): boolean {
  return filterValue && typeof filterValue === "string";
}

/**
 * Determines if filter value is a non-empty array
 * @param filterValue - a filter value
 */
export function isFilterAnArrayWithData(filterValue: any): boolean {
  return Array.isArray(filterValue) && filterValue.length > 0;
}

/**
 * Determines if filter is non-falsey and corresponds to a date field
 * @param filterValue - a filter's field name
 * @param filterValue - a filter's value
 */
export function isFilterFieldADateRange(filterField: string, filterValue: any) {
  return DATE_FILTER_FIELDS.indexOf(filterField) >= 0 && filterValue;
}
