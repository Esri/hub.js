import { IQuery } from "../../types/IHubCatalog";
import { getTopLevelPredicate } from "../commonHelpers/getTopLevelPredicate";

/**
 * @private
 * Extracts the bbox value that the search should be filtered by.
 * Also validates that the bbox predicate is not combined in some
 * invalid way with other predicates.
 *
 * @param query query to extract the bbox predicate from
 * @returns the bbox value to filter by
 */
export function getBboxQueryParam(query: IQuery): string {
  const bboxPredicate = getTopLevelPredicate("bbox", query.filters);
  return bboxPredicate?.bbox;
}
