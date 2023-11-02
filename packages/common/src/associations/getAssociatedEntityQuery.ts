import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getIncludesAndIdentifiesQuery } from "./internal/getIncludesAndIdentifiesQuery";
import { IArcGISContext } from "../ArcGISContext";

export const getAssociatedEntityQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IQuery> => {
  let query: IQuery;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(
      getTypeFromEntity(entity)
    );
    const isParent = associationHierarchy.children.includes(associationType);

    query = await getIncludesAndIdentifiesQuery(
      entity,
      associationType,
      isParent,
      context
    );
  } else {
    throw new Error(
      `getAssociatedEntityQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
