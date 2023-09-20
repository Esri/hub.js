import { IQuery } from "../types/IHubCatalog";
import { expandQuery } from "./portalSearchItems";

/**
 * @private
 * Helper function that locates group predicates and "negates" them
 * so we get a query that is `not in groups ...` vs `in groups ...`
 * @param query
 * @returns
 */
export function negateGroupPredicates(query: IQuery): IQuery {
  // if nothing is passed in just return undefined
  if (!query) {
    return;
  }
  const expanded = expandQuery(query);
  // negate the group predicate on the query
  // we opted to be surgical about this vs attempting a `negateQuery(query)` function
  expanded.filters.forEach((f) => {
    f.predicates.forEach((p) => {
      if (p.group) {
        p.group.not = [...(p.group.any || []), ...(p.group.all || [])];
        p.group.any = [];
        p.group.all = [];
      }
    });
  });
  return expanded;
}
