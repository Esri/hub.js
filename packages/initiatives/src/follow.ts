import { request, IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession, getUserUrl } from "@esri/arcgis-rest-auth";
import { IUser } from "@esri/arcgis-rest-common-types";

export interface IFollowInitiativeRequestOptions extends IRequestOptions {
  initiativeId: string;
  authentication: UserSession;
}

const getTag = (initiativeId: string) => `hubInitiativeId|${initiativeId}`;

const getUpdateUrl = (session: UserSession) => `${getUserUrl(session)}/update`;

export const currentlyFollowedInitiatives = (user: IUser): string[] =>
  user.tags.map(tag => tag.replace(/^hubInitiativeId\|/, ""));

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
  requestOptions: IFollowInitiativeRequestOptions
): Promise<{ success: boolean; username: string }> {
  // we dont call getUser() because the tags are cached and will be mutating
  return request(getUserUrl(requestOptions.authentication), {
    authentication: requestOptions.authentication
  }).then(user => {
    // don't update if already following
    if (isUserFollowing(user, requestOptions.initiativeId)) {
      return Promise.reject(`user is already following this initiative.`);
    }
    const tag = getTag(requestOptions.initiativeId);
    const tags = JSON.parse(JSON.stringify(user.tags));
    tags.push(tag);

    return request(getUpdateUrl(requestOptions.authentication), {
      params: { tags },
      authentication: requestOptions.authentication
    });
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
  requestOptions: IFollowInitiativeRequestOptions
): Promise<{ success: boolean; username: string }> {
  // we dont call getUser() because the tags are cached and will be mutating
  return request(getUserUrl(requestOptions.authentication), {
    authentication: requestOptions.authentication
  }).then(user => {
    // don't update if already following
    if (!isUserFollowing(user, requestOptions.initiativeId)) {
      return Promise.reject(`user is not following this initiative.`);
    }

    const tag = getTag(requestOptions.initiativeId);
    const tags = JSON.parse(JSON.stringify(user.tags));
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
    });
  });
}
