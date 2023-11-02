import { getEntityTypeFromType } from "../../search/_internal/getEntityTypeFromType";
import { IQuery } from "../../search/types/IHubCatalog";

/**
 * Get a query that can be used in a Gallery, and will return the associated
 * entities, based on the AssociationType
 *
 * @param entity
 * @param type
 * @returns
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
            id: [...ids],
          },
        ],
      },
    ],
  };
  return qry;
}
