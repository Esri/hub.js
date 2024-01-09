import { unshareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { getProp } from "../objects";
import { fetchHubEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { updateHubEntity } from "../core/updateHubEntity";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { removeAssociationKeyword } from "./internal/removeAssociationKeyword";

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
    const associationGroupId = getProp(entity, "associations.groupId");
    const { owner } = await fetchHubEntity(associationType, id, context);
    try {
      await unshareItemWithGroup({
        id,
        groupId: associationGroupId,
        authentication: context.session,
        owner,
      });
    } catch (error) {
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
