import { unshareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { getProp } from "../objects";
import { removeAssociationKeyword } from "./internal/removeAssociationKeyword";
import { updateHubEntity } from "../core/updateHubEntity";

/**
 * When an entity decides it wants to "disconnect" itself
 * from an existing association, half of the association
 * "connection" is broken.
 *
 * from the parent's perspective: the parent removes
 * the child from its association group
 *
 * From the child's perspective: the child removes
 * the parent identifier (parent|:id) from its
 * typeKeywords
 *
 * @param entity entity initiating the disconnection
 * @param type type of the entity the initiating entity wants to disconnect from
 * @param id id of the entity the initiating entity wants to disconnect from
 * @param context
 */
export const breakAssociation = async (
  entity: HubEntity,
  type: HubEntityType,
  id: string,
  context: IArcGISContext
): Promise<void> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, type);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(type);

    if (isParent) {
      const associationGroupId = getProp(entity, "associations.group");
      await unshareItemWithGroup({
        id,
        groupId: associationGroupId,
        authentication: context.session,
      });
    } else {
      entity.typeKeywords = removeAssociationKeyword(
        entity.typeKeywords,
        type,
        id
      );
      await updateHubEntity(entityType, entity, context);
    }
  }
};
