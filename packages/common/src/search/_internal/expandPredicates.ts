import { cloneObject } from "../../util";
import { IQuery } from "../types/IHubCatalog";
import { expandPredicate } from "./expandPredicate";

/**
 * Expand the predicates in a query without applying
 * the well-known type expansions
 * @param query
 * @returns
 */
export function expandPredicates(query: IQuery): IQuery {
  const clonedQuery = cloneObject(query);
  clonedQuery.filters = clonedQuery.filters.map((filter) => {
    filter.predicates = filter.predicates.map(expandPredicate);
    return filter;
  });
  return clonedQuery;
}
