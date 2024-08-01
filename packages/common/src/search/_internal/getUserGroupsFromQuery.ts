import { IUser } from "@esri/arcgis-rest-types";
import { getPredicateValues } from "../getPredicateValues";
import { IGroupsByMembership } from "../types/IGroupsByMembership";
import { IQuery } from "../types/IHubCatalog";
/**
 * Given a query and a user, return an object with the set of groups
 * that are in the Query, and which the user is a member of, split by
 * membership type.
 * NOTE: This excludes viewOnly groups the user is just a member of.
 * @param query
 * @param user
 * @returns
 */

export function getUserGroupsFromQuery(
  query: IQuery,
  user: IUser
): IGroupsByMembership {
  const response: IGroupsByMembership = {
    owner: [],
    member: [],
    admin: [],
  };
  // collect up all the group predicates from the query's filters
  // NOTE: this only pulls the all and any predicates
  const groups: string[] = getPredicateValues("group", query);

  // get the user's groups
  const userGroups = user.groups || [];
  // loop through the groups and determine if the user is an admin or normal member
  // and add into the response
  groups.forEach((groupId) => {
    // get the group from the user's groups array
    const group = userGroups.find((g) => g.id === groupId);
    if (group) {
      if (group.userMembership?.memberType === "owner") {
        response.owner.push(groupId);
      }
      if (group.userMembership?.memberType === "admin") {
        response.admin.push(groupId);
      }
      // If user is just a member and the group is not view only
      if (group.userMembership?.memberType === "member" && !group.isViewOnly) {
        response.member.push(groupId);
      }
      // there is a `none` option in the userMembership but
      // that would never be returned in the user's groups
      // so we don't need to check for it
    }
  });
  return response;
}
