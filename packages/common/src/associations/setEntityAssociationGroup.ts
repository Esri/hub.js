import { IArcGISContext } from "../ArcGISContext";
import { IHubGroup, getTypeFromEntity } from "../core";
import { HubEntity } from "../core/types/HubEntity";
import { updateHubEntity } from "../core/updateHubEntity";
import { setProp } from "../objects";

/**
 * Utility to create a relationship between an entity and a group, setting the group as
 * the entity's association group. This adds the entity-specific association keyword to the association group,
 * and it adds the association definition to the original entity.
 * @param entity
 * @param group
 * @param context
 * @returns
 */
export async function setEntityAssociationGroup(
  entity: HubEntity,
  group: IHubGroup,
  context: IArcGISContext
): Promise<HubEntity> {
  const type = getTypeFromEntity(entity);

  // 1. Add the association keyword to the group entity
  // if we don't already have it
  const associationKeyword = `${type}|${entity.id}`;
  if (!group.typeKeywords.includes(associationKeyword)) {
    group.typeKeywords = [...group.typeKeywords, `${type}|${entity.id}`];
  }

  await updateHubEntity("group", group, context);

  // 2. construct and persist the initiative's association definition
  const associations = {
    groupId: group.id,
    rules: {
      schemaVersion: 1,
      query: {
        targetEntity: "item",
        filters: [{ predicates: [{ group: group.id }] }],
      },
    },
  };
  setProp("associations", associations, entity);
  const updatedEntity = await updateHubEntity(type, entity, context);

  return updatedEntity;
}
