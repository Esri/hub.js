import { IFilter, IPredicate, IQuery } from "../../types/IHubCatalog";
import { IDateRange, IMatchOptions } from "../../types/types";

export function getFilterQueryParam(query: IQuery) {
  return query.filters
    .map(formatFilterBlock)
    .filter(removeEmptyClauses)
    .join(" AND ");
}

export function formatFilterBlock(filter: IFilter) {
  const operation = filter.operation || "OR";
  const formatted = filter.predicates
    .map(formatPredicate)
    .filter(removeEmptyClauses)
    .join(` ${operation} `);
  return `(${formatted})`;
}

export function formatPredicate(predicate: IPredicate) {
  const formatted = Object.entries(predicate)
    // Remove predicates that use `term` (handled in `getQQueryParam`),
    // `bbox` (handled in `getBboxQueryParam) or have undefined entries
    .filter(([field, value]) => field !== "term" && field !== "bbox" && !!value)
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

function isDateRange(x: any) {
  return Number.isInteger(x.from) && Number.isInteger(x.to);
}

function formatDateRangePredicate(field: string, value: IDateRange<number>) {
  return `${field} BETWEEN ${value.from} AND ${value.to}`;
}

function formatSimpleComparison(field: string, value: string) {
  return `${field}=${maybeAddSingleQuotes(value)}`;
}

function formatMultiStringPredicate(field: string, values: string[]) {
  const wrappedValues = values.map(maybeAddSingleQuotes);
  return `${field} IN (${wrappedValues.join(", ")})`;
}

function formatComplexPredicate(field: string, value: IMatchOptions) {
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

function maybeAddSingleQuotes(value: string): string {
  const whitespaceRegex: RegExp = /\s/;
  return whitespaceRegex.test(value) ? `'${value}'` : value;
}

/**
 * Returns whether a clause is non-empty and should be included in the
 * final serialized string.
 *
 * Empty clauses appear when certain predicates are detected that are invalid
 * in the OGC API's ?filter string (i.e. `term`, `bbox`)
 *
 * @param clause stringified clause to inspect
 * @returns whether the clause should be included in the final serialization
 */
function removeEmptyClauses(clause: string) {
  return clause !== "()";
}
