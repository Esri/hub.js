import { shareItemWithGroup } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { getTypeFromEntity } from "../core";
import { HubEntity, HubEntityType } from "../core/types";
import { getAssociationHierarchy } from "./internal/getAssociationHierarchy";
import { isAssociationSupported } from "./internal/isAssociationSupported";
import { setAssociationKeyword } from "./internal/setAssociationKeyword";
import { getProp } from "../objects";

export const requestAssociation = (
  entity: HubEntity,
  type: HubEntityType,
  id: string,
  owner: string,
  context: IArcGISContext
) => {
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
