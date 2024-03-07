import { IUser, joinGroup, leaveGroup } from "@esri/arcgis-rest-portal";
import { HubEntityType, fetchHubEntity } from "../core";
import { IWithFollowers } from "../core/traits/IWithFollowers";
import { IArcGISContext } from "../ArcGISContext";

/**
 * Get the entity's followers group id
 * @param entityId entity id
 * @param entityType entity type
 * @param context context used to support fetchHubEntity so it has access
 * to different types of request options based on the entity type
 * @returns {string} entity's followers group id
 */
export async function getEntityFollowersGroupId(
  entityId: string,
  entityType: HubEntityType,
  context: IArcGISContext
): Promise<string> {
  // entity's type is IWithFollowers as we only want to accept hub entities
  // backed by item entities which extend IWithFollowers
  let entity: IWithFollowers;
  entity = (await fetchHubEntity(
    entityType,
    entityId,
    context
  )) as IWithFollowers;
  return entity.followersGroupId;
}

/**
 * Whether the user is currently following the entity
 * @param entityOrId hub entity or entity id, type is IWithFollowers
 * as we only want to accept hub entities backed by item entities which
 * extend IWithFollowers
 * @param user
 * @param entityType
 * @param context
 * @returns {boolean}
 */
export async function isUserFollowing(
  entityOrId: IWithFollowers | string,
  user: IUser,
  entityType?: HubEntityType,
  context?: IArcGISContext
): Promise<boolean> {
  // get the entity's followers group id
  let groupId: string;
  if (typeof entityOrId === "string") {
    groupId = await getEntityFollowersGroupId(entityOrId, entityType, context);
  } else {
    groupId = entityOrId.followersGroupId;
  }
  // looks through the users group list and find the same group
  const group = user.groups.find((g) => g.id === groupId);
  return !!group;
}

/**
 * Follow an entity
 * @param entityOrId hub entity or entity id, type is IWithFollowers
 * as we only want to accept hub entities backed by item entities which
 * extend IWithFollowers
 * @param user user who attempts to follow the entity
 * @param entityType optional if entityOrId is a string
 * @param context optional if entityOrId is a string
 * @returns promise that resolves { success: true, username: user.username }
 * or rejects with an error
 */
export async function followEntity(
  entityOrId: IWithFollowers | string,
  user: IUser,
  entityType?: HubEntityType,
  context?: IArcGISContext
): Promise<{ success: boolean; username: string }> {
  const isFollowing = await isUserFollowing(
    entityOrId,
    user,
    entityType,
    context
  );
  // don't update if user is already following
  if (isFollowing) {
    return Promise.reject(`User is already following this entity.`);
  }
  let groupId: string;
  if (typeof entityOrId === "string") {
    groupId = await getEntityFollowersGroupId(entityOrId, entityType, context);
  } else {
    groupId = entityOrId.followersGroupId;
  }
  // if the entity has a followers group, attempt to join it
  if (groupId) {
    try {
      await joinGroup({
        id: groupId,
        authentication: context.hubRequestOptions.authentication,
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
 * @param entityOrId hub entity or entity id, type is IWithFollowers
 * as we only want to accept hub entities backed by item entities which
 * extend IWithFollowers
 * @param user user who attempts to unfollow the entity
 * @param entityType optional if entityOrId is a string
 * @param context optional if entityOrId is a string
 * @returns promise that resolves { success: true, username: user.username } or
 * rejects with an error
 */
export async function unfollowEntity(
  entityOrId: IWithFollowers | string,
  user: IUser,
  entityType?: HubEntityType,
  context?: IArcGISContext
): Promise<{ success: boolean; username: string }> {
  const isFollowing = await isUserFollowing(
    entityOrId,
    user,
    entityType,
    context
  );
  // don't update if user is not following
  if (!isFollowing) {
    return Promise.reject(`User is not following this entity.`);
  }
  let groupId: string;
  if (typeof entityOrId === "string") {
    groupId = await getEntityFollowersGroupId(entityOrId, entityType, context);
  } else {
    groupId = entityOrId.followersGroupId;
  }
  // if the entity has a followers group, attempt to leave it
  if (groupId) {
    try {
      await leaveGroup({
        id: groupId,
        authentication: context.hubRequestOptions.authentication,
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
