import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { IQuery } from "../../search/types/IHubCatalog";

/**
 * @private
 * Construct an IQuery to fetch a set of items by type(s)
 * withOUT a specified typeKeyword. Note: if an array of
 * types is provided, they must be the same underlying target
 * entity type.
 *
 * @param itemType - The type(s) of item to fetch
 * @param keyword - The typeKeyword to filter by
 * @returns
 */
export function getTypeWithoutKeywordQuery(
  itemType: string | string[],
  keyword: string
): IQuery {
  const targetEntity =
    typeof itemType === "string"
      ? getEntityTypeFromType(itemType)
      : getEntityTypeFromType(itemType[0]);

  return {
    targetEntity,
    filters: [
      {
        operation: "AND",
        predicates: [
          {
            type: itemType,
            typekeywords: { not: [keyword] },
          },
        ],
      },
    ],
  };
}
