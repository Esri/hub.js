import { IFilter, IPredicate, IQuery } from "../../types/IHubCatalog";
import { IDateRange, IMatchOptions } from "../../types/types";

/**
 * Serializes an IQuery into a valid filter string that can be sent to the OGC API
 * NOTE: Due to current limitations, any predicates that reference `term` will be ignored
 *
 * @param query an IQuery to be serialized
 * @returns a serialized filter string
 */
export function getFilterQueryParam(query: IQuery): string {
  return (
    query.filters
      .map(formatFilterBlock)
      // TODO: this a bandaid fix, remove once q can be passed into the filter query string
      .filter((f) => f !== "()")
      .join(" AND ")
  );
}

export function formatFilterBlock(filter: IFilter): string {
  const operation = filter.operation || "OR";
  const formatted = filter.predicates
    .map(formatPredicate)
    // TODO: this a bandaid fix, remove once q can be passed into the filter query string
    .filter((p) => p !== "()")
    .join(` ${operation} `);
  return `(${formatted})`;
}

export function formatPredicate(predicate: IPredicate): string {
  const formatted = Object.entries(predicate)
    // Remove predicates that use `term` (handled in `getQQueryParam`) and undefined entries
    .filter(([field, value]) => field !== "term" && !!value)
    // Create sections for each field
    .reduce((acc, [field, value]) => {
      let section;
      if (typeof value === "string") {
        section = formatSimpleComparison(field, value);
      } else if (Array.isArray(value)) {
        section = formatMultiStringPredicate(field, value);
      } else if (isDateRange(value)) {
        section = formatDateRangePredicate(field, value);
      } else {
        section = formatComplexPredicate(field, value);
      }
      acc.push(section);
      return acc;
    }, [])
    // AND together all field requirements
    .join(" AND ");

  return `(${formatted})`;
}

function isDateRange(x: any): boolean {
  return Number.isInteger(x.from) && Number.isInteger(x.to);
}

function formatDateRangePredicate(
  field: string,
  value: IDateRange<number>
): string {
  return `${field} BETWEEN ${value.from} AND ${value.to}`;
}

function formatSimpleComparison(field: string, value: string): string {
  return `${field}=${maybeAddSingleQuotes(value)}`;
}

function formatMultiStringPredicate(field: string, values: string[]): string {
  const wrappedValues = values.map(maybeAddSingleQuotes);
  return `${field} IN (${wrappedValues.join(", ")})`;
}

function formatComplexPredicate(field: string, value: IMatchOptions): string {
  const anys = formatAnys(field, value.any);
  const alls = formatAlls(field, value.all);
  const nots = formatNots(field, value.not);
  return [anys, alls, nots].filter((subsection) => !!subsection).join(" AND ");
}

function formatAnys(field: string, value: string | string[]): string {
  let result: string;

  if (Array.isArray(value)) {
    const wrappedValues = value.map(maybeAddSingleQuotes);
    result = `${field} IN (${wrappedValues.join(", ")})`;
  } else if (value) {
    result = formatSimpleComparison(field, value);
  }

  return result;
}

function formatAlls(field: string, value?: string | string[]): string {
  let result: string;

  if (Array.isArray(value)) {
    result = value
      .map((v: string) => formatSimpleComparison(field, v))
      .join(" AND ");
  } else if (value) {
    result = formatSimpleComparison(field, value);
  }

  return result;
}

function formatNots(field: string, value?: string | string[]): string {
  let result: string;
  if (value) {
    const valueAsArray = Array.isArray(value) ? value : [value];
    const wrappedValues = valueAsArray.map(maybeAddSingleQuotes);
    result = `${field} NOT IN (${wrappedValues.join(", ")})`;
  }

  return result;
}

/**
 * Wraps values with whitespace in single quotes, per requirements
 * of the OGC API
 *
 * @private
 */
function maybeAddSingleQuotes(value: string): string {
  const whitespaceRegex: RegExp = /\s/;
  return whitespaceRegex.test(value) ? `'${value}'` : value;
}
