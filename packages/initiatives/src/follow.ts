import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import {
  IUser,
  getUserUrl,
  joinGroup,
  leaveGroup
} from "@esri/arcgis-rest-portal";
import { IInitiativeModel, getProp, concat, unique } from "@esri/hub-common";
import { getInitiative } from "./get";

export interface IFollowInitiativeOptions extends IRequestOptions {
  initiativeId: string;
  authentication: UserSession;
}

const getUserTag = (initiativeId: string) => `hubInitiativeId|${initiativeId}`;

const initiativeIdFromUserTag = (tag: string) =>
  tag.replace(/^hubInitiativeId\|/, "");
const initiativeIdFromGroupTag = (tag: string) =>
  tag.replace(/^hubInitiativeFollowers\|/, "");

const getUpdateUrl = (session: UserSession) => `${getUserUrl(session)}/update`;

const currentlyFollowedInitiativesByUserTag = (user: IUser): string[] =>
  user.tags.map(initiativeIdFromUserTag);

const currentlyFollowedInitiativesByGroupMembership = (
  user: IUser
): string[] => {
  return user.groups
    .map(group => group.tags)
    .reduce(concat, [])
    .filter(tags => tags.indexOf("hubInitiativeFollowers|") === 0)
    .map(initiativeIdFromGroupTag);
};

export const currentlyFollowedInitiatives = (user: IUser): string[] => {
  const byUserTags = currentlyFollowedInitiativesByUserTag(user);
  const byGroupMembership = currentlyFollowedInitiativesByGroupMembership(user);
  return [...byUserTags, ...byGroupMembership].filter(unique);
};

export const isUserFollowing = (user: IUser, initiativeId: string): boolean =>
  currentlyFollowedInitiatives(user).indexOf(initiativeId) > -1;

/**
 * ```js
 * import { followInitiative } from "@esri/hub-initiatives";
 * //
 * followInitiative({
 *   initiativeId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Follow an initiative.
 */
export function followInitiative(
  requestOptions: IFollowInitiativeOptions
): Promise<{ success: boolean; username: string }> {
  // we dont call getUser() because the tags are cached and will be mutating
  return request(getUserUrl(requestOptions.authentication), {
    authentication: requestOptions.authentication
  })
    .then(user => {
      // don't update if already following
      if (isUserFollowing(user, requestOptions.initiativeId)) {
        return Promise.reject(`user is already following this initiative.`);
      }
      // if not already following, pass the user on
      return user;
    })
    .then(user => {
      return getInitiative(requestOptions.initiativeId).then(
        (initiative: IInitiativeModel) => ({
          user,
          initiative,
          hasFollowersGroup: false
        })
      );
    })
    .then(obj => {
      // if the initiative has a followersGroupId
      const groupId = getProp(
        obj,
        "initiative.item.properties.followersGroupId"
      );
      if (groupId) {
        // attempt to join it
        return joinGroup({
          id: groupId,
          authentication: requestOptions.authentication
        }).then(groupJoinResponse => {
          obj.hasFollowersGroup = groupJoinResponse.success;
          return obj;
        });
      }
      return obj;
    })
    .then(obj => {
      if (!obj.hasFollowersGroup) {
        // else add the tag to the user
        const tag = getUserTag(requestOptions.initiativeId);
        const tags = JSON.parse(JSON.stringify(obj.user.tags));
        tags.push(tag);

        return request(getUpdateUrl(requestOptions.authentication), {
          params: { tags },
          authentication: requestOptions.authentication
        });
      }
      // the initiative has a followers group and we successfully joined it
      return { success: true, username: obj.user.username };
    });
}

/**
 * ```js
 * import { unfollowInitiative } from "@esri/hub-initiatives";
 * //
 * unfollowInitiative({
 *   initiativeId,
 *   authentication
 * })
 *   .then(response)
 * ```
 * Follow an initiative.
 */
export function unfollowInitiative(
  requestOptions: IFollowInitiativeOptions
): Promise<{ success: boolean; username: string }> {
  // we dont call getUser() because the tags are cached and will be mutating
  return request(getUserUrl(requestOptions.authentication), {
    authentication: requestOptions.authentication
  })
    .then(user => {
      // don't update if not already following
      if (!isUserFollowing(user, requestOptions.initiativeId)) {
        return Promise.reject(`user is not following this initiative.`);
      }
      // if not already following, pass the user on
      return user;
    })
    .then(user => {
      const tag = getUserTag(requestOptions.initiativeId);
      const tags = JSON.parse(JSON.stringify(user.tags));
      if (tags.indexOf(tag) > -1) {
        // https://stackoverflow.com/questions/9792927/javascript-array-search-and-remove-string
        const index = tags.indexOf(tag);
        tags.splice(index, 1);

        // clear the last tag by passing ",".
        if (tags.length === 0) {
          tags.push(",");
        }

        return request(getUpdateUrl(requestOptions.authentication), {
          params: { tags },
          authentication: requestOptions.authentication
        }).then(_ => user);
      }
      return user;
    })
    .then(user => {
      return getInitiative(requestOptions.initiativeId).then(
        (initiative: IInitiativeModel) => ({ user, initiative })
      );
    })
    .then(obj => {
      // if there is an initiative followers group and the user is a member, attempt to leave it
      const groupId = getProp(
        obj,
        "initiative.item.properties.followersGroupId"
      );
      if (
        groupId &&
        currentlyFollowedInitiativesByGroupMembership(obj.user).indexOf(
          requestOptions.initiativeId
        ) > -1
      ) {
        return leaveGroup({
          id: groupId,
          authentication: requestOptions.authentication
        }).then(groupLeaveResponse => {
          return { success: true, username: obj.user.username };
        });
      }
      return { success: true, username: obj.user.username };
    });
}
