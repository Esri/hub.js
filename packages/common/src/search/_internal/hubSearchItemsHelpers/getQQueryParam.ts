// TODO: the 'q' query param logic is only here because the
// OGC API currently has a bug where 'q' cannot be included
// in the 'filter' string. Once that bug is resolved, rip this
// logic out and let predicates with 'term' to be processed

import { IFilter, IQuery } from "../../types/IHubCatalog";

/**
 * Extracts the value of the term predicate from a query. Also validates that limitations
 * of the term predicate are not violated, namely:
 *
 * - There can only be one term predicate
 * - The predicate cannot be OR'd with other predicates
 * - The predicate must contain a simple string value, not an array or IMatchOptions
 *
 * @param query query to extract the term predicate from
 * @returns the serialized q value
 */
export function getQQueryParam(query: IQuery): string {
  const qFilters: IFilter[] = query.filters.filter((f) => {
    return f.predicates.find((p) => !!p.term);
  });

  const qPredicate = getQPredicate(qFilters);
  return qPredicate?.term;
}

export function getQPredicate(filters: IFilter[]) {
  let result;

  if (filters.length > 1) {
    throw new Error(
      `IQuery can only have 1 IFilter with a 'term' predicate but ${filters.length} were detected`
    );
  }

  if (filters.length) {
    const filter = filters[0];
    const qPredicates = filter.predicates.filter((p) => !!p.term);

    if (qPredicates.length > 1) {
      throw new Error(
        `IQuery can only have 1 'term' predicate but ${qPredicates.length} were detected`
      );
    }

    if (filter.operation !== "AND" && filter.predicates.length > 1) {
      throw new Error(`'term' predicates cannot be OR'd to other predicates`);
    }

    const qPredicate = qPredicates[0];
    if (typeof qPredicate.term !== "string") {
      throw new Error(
        `'term' predicate must have a string value, string[] and IMatchOptions are not allowed.`
      );
    }
    result = qPredicate;
  }

  return result;
}
