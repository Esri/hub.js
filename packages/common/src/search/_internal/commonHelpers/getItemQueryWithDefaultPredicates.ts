import { cloneObject } from "../../../util";
import { IQuery } from "../../types";
/**
 * @private
 * Adds default predicates for item target entity
 *
 * @param query IQuery to search items
 * @returns an IQuery with default predicates
 */
export function getItemQueryWithDefaultPredicates(query: IQuery): IQuery {
  if (query.targetEntity === "item") {
    const queryWithDefaultItemPredicates: IQuery = cloneObject(query);
    const defaultPredicates = {
      // 'Code Attachment' is an old AGO type that has
      // been defunct for some time, so add this predicate
      // to all catalog filter to omit 'Code Attachment' items
      // from search results
      predicates: [{ type: { not: ["Code Attachment"] } }],
    };
    queryWithDefaultItemPredicates.filters.push(defaultPredicates);
    return queryWithDefaultItemPredicates;
  }
  return query;
}
