import type { IUser } from "../rest/types";
import { IGroupsByMembership } from "./types/IGroupsByMembership";

/**
 * Retrieves the user's groups categorized by their membership type.
 *
 * @param user - The user object containing group information.
 * @returns An object categorizing the user's groups into `owner`, `admin`, and `member`.
 *
 * The function processes the user's groups and classifies them based on the membership type:
 * - `owner`: Groups where the user is an owner.
 * - `admin`: Groups where the user is an admin.
 * - `member`: Groups where the user is a member and the group is not view-only.
 *
 * Note: The `none` membership type is not considered as it is not expected to be present in the user's groups.
 */

export function getUserGroupsByMembership(user: IUser): IGroupsByMembership {
  const response: IGroupsByMembership = {
    owner: [],
    member: [],
    admin: [],
  };
  // get the user's groups
  const userGroups = user.groups || [];
  // loop through the groups and determine if the user is an admin or normal member
  // and add into the response
  userGroups.forEach((group) => {
    if (group.userMembership?.memberType === "owner") {
      response.owner.push(group.id);
    }
    if (group.userMembership?.memberType === "admin") {
      response.admin.push(group.id);
    }
    // If user is just a member and the group is not view only
    if (group.userMembership?.memberType === "member" && !group.isViewOnly) {
      response.member.push(group.id);
    }
    // there is a `none` option in the userMembership but
    // that would never be returned in the user's groups
    // so we don't need to check for it
  });
  return response;
}
