import { IUser, joinGroup, leaveGroup } from "@esri/arcgis-rest-portal";
import { EntityType, IHubSearchOptions } from "../search";
import { fetchSite } from "../sites";
import { HubEntity } from "../core";

/**
 * Get the entity's followers group id
 */
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

/**
 * If the user is currently following the entity
 */
export async function isUserFollowing(
  entityId: string,
  entityType: EntityType,
  hubSearchOptions: IHubSearchOptions,
  user: IUser
): Promise<boolean> {
  // get the entity's followers group id
  const groupId = await getEntityFollowersGroupId(
    entityId,
    entityType,
    hubSearchOptions
  );
  // looks through the users group list and find the same group
  const group = user.groups.find((g) => g.id === groupId);
  return !!group;
}

/**
 * Follow an entity
 */
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
  // if the entity has a followers group, attempt to join it
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
      throw new Error(`Error joining group: ${error}`);
    }
  } else {
    // handle if the entity doesn't have a followers group
  }
}

/**
 * Unfollow an entity
 */
export async function unfollowEntity(
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
  // don't update if user is not following
  if (!isFollowing) {
    return Promise.reject(`User is not following this entity.`);
  }
  // if the entity has a followers group, attempt to leave it
  const groupId = await getEntityFollowersGroupId(
    entityId,
    entityType,
    hubSearchOptions
  );
  if (groupId) {
    try {
      await leaveGroup({
        id: groupId,
        authentication: hubSearchOptions.authentication,
      });
      // the entity has a followers group and we successfully left it
      return { success: true, username: user.username };
    } catch (error) {
      throw new Error(`Error leaving group: ${error}`);
    }
  } else {
    // handle if the entity doesn't have a followers group
  }
}
