import { IQuery } from "../../types/IHubCatalog";
import { getTopLevelPredicate } from "../commonHelpers/getTopLevelPredicate";

/**
 * @private
 * Extracts the fields value that the search should be filtered by.
 * Also validates that the fields predicate is not combined in some
 * invalid way with other predicates.
 *
 * @param query query to extract the fields predicate from
 * @returns the fields value to filter by
 */
export function getFieldsQueryParam(query: IQuery): string {
  const fieldsPredicate = getTopLevelPredicate("fields", query.filters);
  return fieldsPredicate?.fields;
}
