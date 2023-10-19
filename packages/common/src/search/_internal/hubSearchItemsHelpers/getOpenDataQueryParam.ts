import { IQuery } from "../../types/IHubCatalog";
import { getTopLevelPredicate } from "../commonHelpers/getTopLevelPredicate";

/**
 * @private
 * Extracts the openData flag that the search should be filtered by.
 * Also validates that the openData predicate is not combined in some
 * invalid way with other predicates.
 *
 * @param query query to extract the opendata predicate from
 * @returns the openData value to filter by
 */
export function getOpenDataQueryParam(query: IQuery): string {
  const openDataPredicate = getTopLevelPredicate("openData", query.filters);
  return openDataPredicate?.openData;
}
