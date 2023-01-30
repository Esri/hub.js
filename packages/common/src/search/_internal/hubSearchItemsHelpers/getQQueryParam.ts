// TODO: the 'q' query param logic is only here because the
// OGC API currently has a bug where 'q' cannot be included
// in the 'filter' string. Once that bug is resolved, rip this
// logic out and let predicates with 'term' to be processed

import { IFilter, IQuery } from "../../types/IHubCatalog";

// normally
export function getQQueryParam(query: IQuery) {
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
