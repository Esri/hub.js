import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { IQuery } from "../../search/types/IHubCatalog";

/**
 * @private
 * Return an `IQuery` for a specific item type, with a specific typekeyword
 * This is used internally to build queries for "Connected" entities
 * @param itemType
 * @param keyword
 * @returns
 */
export function getTypeWithKeywordQuery(
  itemType: string,
  keyword: string
): IQuery {
  const targetEntity = getEntityTypeFromType(itemType);

  return {
    targetEntity,
    filters: [
      {
        operation: "AND",
        predicates: [
          {
            type: itemType,
            typekeywords: keyword,
          },
        ],
      },
    ],
  };
}
