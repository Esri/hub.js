import { unshareItemWithGroup } from "@esri/arcgis-rest-portal";
import type { IArcGISContext } from "../types/IArcGISContext";
import { getProp } from "../objects/get-prop";
import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { updateHubEntity } from "../core/updateHubEntity";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { removeAssociationKeyword } from "./internal/removeAssociationKeyword";
import { HubEntity } from "../core/types/HubEntity";
import { HubEntityType } from "../core/types/HubEntityType";
import { fetchHubEntity } from "../core/fetchHubEntity";

/**
 * When an entity decides it wants to "disconnect" itself
 * from an existing association, half of the association
 * "connection" is broken.
 *
 * from the parent's perspective: the parent removes
 * the child from its association group
 *
 * From the child's perspective: the child removes
 * the parent reference (ref|<parentType>|<parentID>)
 * from its typeKeywords
 *
 * @param entity - entity initiating the disconnection
 * @param type - type of the entity the initiating entity wants to disconnect from
 * @param id - id of the entity the initiating entity wants to disconnect from
 * @param context - contextual portal and auth information
 */
export const breakAssociation = async (
  entity: HubEntity,
  associationType: HubEntityType,
  id: string,
  context: IArcGISContext
): Promise<void> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (!isSupported) {
    throw new Error(
      `breakAssociation: Association between ${entityType} and ${associationType} is not supported.`
    );
  }

  const associationHierarchy = getAssociationHierarchy(entityType);
  const isParent = associationHierarchy.children.includes(associationType);

  if (isParent) {
    const associationGroupId = getProp(
      entity,
      "associations.groupId"
    ) as string;
    const { owner } = await fetchHubEntity(associationType, id, context);
    try {
      await unshareItemWithGroup({
        id,
        groupId: associationGroupId,
        authentication: context.session,
        owner,
      });
    } catch (err) {
      const error = err as string;
      throw new Error(
        `breakAssociation: there was an error unsharing ${id} from ${associationGroupId}: ${error}`
      );
    }
  } else {
    entity.typeKeywords = removeAssociationKeyword(
      entity.typeKeywords,
      associationType,
      id
    );
    await updateHubEntity(entityType, entity, context);
  }
};
