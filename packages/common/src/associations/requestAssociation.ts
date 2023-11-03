import { shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { setAssociationKeyword } from "./internal/setAssociationKeyword";
import { getProp } from "../objects";

/**
 * When an entity sends an "outgoing" request or accepts an
 * "incoming" request, half of the association "connection"
 * is made.
 *
 * from the parent's perspective: the parent "includes"
 * the child in its association query
 *
 * From the child's perspective: the child "identifies"
 * with the parent via a typeKeyword (parent|:id)
 *
 * @param entity
 * @param type
 * @param id
 * @param owner
 * @param context
 */
export const requestAssociation = async (
  entity: HubEntity,
  type: HubEntityType,
  id: string,
  owner?: string,
  context?: IArcGISContext
): Promise<void> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, type);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(type);

    if (isParent) {
      const associationGroupId = getProp(entity, "associations.group");
      shareItemWithGroup({
        id,
        owner,
        groupId: associationGroupId,
        authentication: context.session,
      });
    } else {
      entity.typeKeywords = setAssociationKeyword(
        entity.typeKeywords,
        entityType,
        id
      );
    }
  }
};
