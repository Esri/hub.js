import { IGroup, IUser, joinGroup } from "@esri/arcgis-rest-portal";
import { EntityType, IHubSearchOptions } from "../search";
import { fetchSite } from "../sites";
import { HubEntity } from "../core";

// TODO: consider moving this to /groups
export async function getEntityFollowersGroupId(
  entityId: string,
  entityType: EntityType,
  hubSearchOptions: IHubSearchOptions
): Promise<string> {
  let entity: HubEntity;
  let groupId: string;
  if (entityType === ("site" as EntityType)) {
    entity = await fetchSite(entityId, hubSearchOptions);
    groupId = entity.followersGroupId;
  }
  // handle other entity types here...
  return groupId;
}

export async function isUserFollowing(
  entityId: string,
  entityType: EntityType,
  hubSearchOptions: IHubSearchOptions,
  user: IUser
): Promise<boolean> {
  const groupId = await getEntityFollowersGroupId(
    entityId,
    entityType,
    hubSearchOptions
  );
  const group: IGroup = user.groups.find((g) => g.id === groupId);
  return !!group;
}

export async function followEntity(
  entityId: string,
  entityType: EntityType,
  hubSearchOptions: IHubSearchOptions,
  user: IUser
): Promise<{ success: boolean; username: string }> {
  const isFollowing = await isUserFollowing(
    entityId,
    entityType,
    hubSearchOptions,
    user
  );
  // don't update if user is already following
  if (isFollowing) {
    return Promise.reject(`User is already following this entity.`);
  }
  // if the entity has a followersGroupId, attempt to join it
  const groupId = await getEntityFollowersGroupId(
    entityId,
    entityType,
    hubSearchOptions
  );
  if (groupId) {
    try {
      await joinGroup({
        id: groupId,
        authentication: hubSearchOptions.authentication,
      });
      // the entity has a followers group and we successfully joined it
      return { success: true, username: user.username };
    } catch (error) {
      throw new Error(`error joining group: ${error}`);
    }
  } else {
    // handle if the entity doesn't have a followers group
  }
}
