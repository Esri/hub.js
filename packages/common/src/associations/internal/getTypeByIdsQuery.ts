import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { IQuery } from "../../search/types/IHubCatalog";

/**
 * @private
 * Construct an IQuery to fetch a specified set of item id(s)
 * by type(s). Note: if an array of types is provided, they
 * must be the same underlying target entity type.
 *
 * @param itemType - a single item type or an array of item types
 * @param ids - an array of ids
 * @returns {IQuery}
 */
export function getTypeByIdsQuery(
  itemType: string | string[],
  ids: string[]
): IQuery {
  const targetEntity =
    typeof itemType === "string"
      ? getEntityTypeFromType(itemType)
      : getEntityTypeFromType(itemType[0]);

  const qry: IQuery = {
    targetEntity,
    filters: [
      {
        operation: "AND",
        predicates: [
          {
            type: itemType,
            ...(ids.length && { id: ids }),
          },
        ],
      },
    ],
  };
  return qry;
}
