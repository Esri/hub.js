import { shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core/getTypeFromEntity";
import { fetchHubEntity } from "../core/fetchHubEntity";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { setAssociationKeyword } from "./internal/setAssociationKeyword";
import { getProp } from "../objects";
import { updateHubEntity } from "../core/updateHubEntity";

/**
 * When an entity sends an "outgoing" association request
 * or accepts an "incoming" association request, half of
 * the association "connection" is made.
 *
 * from the parent's perspective: the parent "includes"
 * the child in its association group
 *
 * From the child's perspective: the child "references"
 * the parent via a typeKeyword of the form ref|<parentType>|<parentId>
 *
 * Note: we export this function under 2 names - requestAssociation
 * and acceptAssociation. These actions are functionally equivalent,
 * but we want to make the intent more clear to the consumer.
 *
 * @param entity - entity requesting association
 * @param type - type of the entity the requesting entity wants to associate with
 * @param id - id of the entity the requesting entity wants to associate with
 * @param context - contextual portal and auth information
 */
export const requestAssociation = async (
  entity: HubEntity,
  associationType: HubEntityType,
  id: string,
  context: IArcGISContext
): Promise<void> => {
  const entityType = getTypeFromEntity(entity);
  const isSupported = isAssociationSupported(entityType, associationType);

  if (isSupported) {
    const associationHierarchy = getAssociationHierarchy(entityType);
    const isParent = associationHierarchy.children.includes(associationType);

    if (isParent) {
      const associationGroupId = getProp(entity, "associations.groupId");
      const { owner } = await fetchHubEntity(associationType, id, context);
      try {
        await shareItemWithGroup({
          id,
          owner,
          groupId: associationGroupId,
          authentication: context.session,
        });
      } catch (error) {
        throw new Error(
          `requestAssociation: there was an error sharing ${id} to ${associationGroupId}: ${error}`
        );
      }
    } else {
      entity.typeKeywords = setAssociationKeyword(
        entity.typeKeywords,
        associationType,
        id
      );
      await updateHubEntity(entityType, entity, context);
    }
  } else {
    throw new Error(
      `requestAssociation: Association between ${entityType} and ${associationType} is not supported.`
    );
  }
};
