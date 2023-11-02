import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { IQuery } from "../search/types";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { getIdentifiesDoesNotIncludeQuery } from "./internal/getIdentifiesDoesNotIncludeQuery";
import { getIncludesDoesNotIdentifyQuery } from "./internal/getIncludesDoesNotIdentifyQuery";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { IArcGISContext } from "..";

export const getRequestingEntityQuery = async (
  entity: HubEntity,
  associationType: HubEntityType,
  context: IArcGISContext
): Promise<IQuery> => {
  let query: IQuery;
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(associationType);

    query = isParent
      ? await getIdentifiesDoesNotIncludeQuery(
          entity,
          associationType,
          isParent,
          context
        )
      : await getIncludesDoesNotIdentifyQuery(
          entity,
          associationType,
          isParent,
          context
        );
  } else {
    throw new Error(
      `getRequestingEntityQuery: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  return query;
};
