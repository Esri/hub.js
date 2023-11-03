import { shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { fetchHubEntity, getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { setAssociationKeyword } from "./internal/setAssociationKeyword";
import { getProp } from "../objects";
import { updateHubEntity } from "../core/updateHubEntity";

/**
 * When an entity sends an "outgoing" request or accepts an
 * "incoming" request, half of the association "connection"
 * is made.
 *
 * from the parent's perspective: the parent "includes"
 * the child in its association group
 *
 * From the child's perspective: the child "identifies"
 * with the parent via a typeKeyword (parent|:id)
 *
 * @param entity entity requesting association
 * @param type type of the entity the requesting entity wants to associate with
 * @param id id of the entity the requesting entity wants to associate with
 * @param context
 */
export const requestAssociation = async (
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
      const { owner } = await fetchHubEntity(type, id, context);
      await shareItemWithGroup({
        id,
        owner,
        groupId: associationGroupId,
        authentication: context.session,
      });
    } else {
      entity.typeKeywords = setAssociationKeyword(
        entity.typeKeywords,
        type,
        id
      );
      await updateHubEntity(entityType, entity, context);
    }
  }
};
