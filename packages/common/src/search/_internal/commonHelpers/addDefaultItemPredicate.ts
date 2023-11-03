import { cloneObject } from "../../../util";
import { IQuery } from "../../types";
/**
 * @private
 * Adds default predicate for item target entity
 *
 * @param query IQuery to search items
 * @returns an IQuery with default predicates
 */
export function getItemQueryWithDefaultPredicates(query: IQuery): IQuery {
  if (query.targetEntity === "item") {
    const queryWithDefaultItemPredicates: IQuery = cloneObject(query);
    const defaultPredicates = {
      predicates: [{ type: { not: ["Code Attachment"] } }],
    };
    queryWithDefaultItemPredicates.filters.push(defaultPredicates);
    return queryWithDefaultItemPredicates;
  }
  return query;
}
