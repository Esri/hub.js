import { IWithAssociations } from "../core";
import { IQuery } from "../search/types/IHubCatalog";
import { getTargetEntityFromAssociationType } from "./internal/getTargetEntityFromAssociationType";
import { getTypeFromAssociationType } from "./internal/getTypeFromAssociationType";
import { listAssociations } from "./listAssociations";
import { AssociationType } from "./types";

/**
 * Get a query that can be used in a Gallery, and will return the associated
 * entities, based on the AssociationType
 *
 * @param entity
 * @param type
 * @returns
 */
export function getAssociatedQuery(
  entity: IWithAssociations,
  type: AssociationType
): IQuery {
  const ids = listAssociations(entity, type);
  if (!ids.length) {
    return null;
  }

  // lookup some information by the association type
  const itemType = getTypeFromAssociationType(type);
  const targetEntity = getTargetEntityFromAssociationType(type);

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
