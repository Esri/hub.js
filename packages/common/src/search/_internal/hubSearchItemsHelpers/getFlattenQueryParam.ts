import { IQuery } from "../../types/IHubCatalog";
import { getTopLevelPredicate } from "../commonHelpers/getTopLevelPredicate";

/**
 * @private
 * Extracts the flatten value that the search should be filtered by.
 * Also validates that the flatten predicate is not combined in some
 * invalid way with other predicates.
 *
 * @param query query to extract the flatten predicate from
 * @returns the flatten value to filter by
 */
export function getFlattenQueryParam(query: IQuery): boolean {
  const flattenPredicate = getTopLevelPredicate("flatten", query.filters);
  return flattenPredicate?.flatten;
}
