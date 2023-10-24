import { IFilter, IPredicate } from "../../types/IHubCatalog";
import { isNilOrEmptyString } from "./isNilOrEmptyString";

/**
 * Searches through a list of filters and finds a specific predicate that should be appended at the top level of a search
 * (i.e., has special requirements for combining with other predicates). Also verifies that the predicate is not combined in any invalid ways.
 *
 * Combination Requirements:
 * - Only ONE filter can have a predicate with the target field
 * - Only ONE predicate with the target field can exist
 * - The predicate can only be ANDed to other predicates
 * - The predicate's field value MUST be a string or boolean (not string[] or IMatchOptions)
 *
 * Example: Portal's bbox field cannot be conditionally searched. Any value provided will always be applied as a top-level filter.
 * - Valid: `?bbox=1,2,3,4&filter=type:CSV`
 * - Invalid: `?filter=type:CSV OR (type:PDF AND bbox=1,2,3,4)
 *
 * @param field the field of the desired predicate
 * @param filters filters to be searched / validated
 * @returns the predicate (if present and all requirements are met)
 */
export function getTopLevelPredicate(
  field: string,
  filters: IFilter[]
): IPredicate {
  let result = null;

  const matchingFilters: IFilter[] = filters.filter((f) => {
    return f.predicates.find((p) => !isNilOrEmptyString(p[field]));
  });

  if (matchingFilters.length > 1) {
    throw new Error(
      `Only 1 IFilter can have a '${field}' predicate but ${matchingFilters.length} were detected`
    );
  }

  if (matchingFilters.length) {
    const matchingFilter = matchingFilters[0];
    const matchingPredicates = matchingFilter.predicates.filter(
      (p) => !isNilOrEmptyString(p[field])
    );

    if (matchingPredicates.length > 1) {
      throw new Error(
        `Only 1 '${field}' predicate is allowed but ${matchingPredicates.length} were detected`
      );
    }

    if (
      matchingFilter.operation !== "AND" &&
      matchingFilter.predicates.length > 1
    ) {
      throw new Error(
        `'${field}' predicates cannot be OR'd to other predicates`
      );
    }

    const topLevelPredicate = matchingPredicates[0];
    const predicateValue = topLevelPredicate[field];
    const isValidPrimitive =
      typeof predicateValue === "string" || typeof predicateValue === "boolean";
    if (!isValidPrimitive) {
      throw new Error(
        `'${field}' predicate must be a string or boolean primitive. string[] and IMatchOptions are not allowed.`
      );
    }
    result = topLevelPredicate;
  }

  return result;
}
