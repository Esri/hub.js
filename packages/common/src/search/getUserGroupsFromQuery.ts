import type { IUser } from "@esri/arcgis-rest-types";
import { getPredicateValues } from "./getPredicateValues";
import { IGroupsByMembership } from "./types/IGroupsByMembership";
import { IQuery } from "./types/IHubCatalog";
import { getUserGroupsByMembership } from "./getUserGroupsByMembership";

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
  let response: IGroupsByMembership = {
    owner: [],
    member: [],
    admin: [],
  };
  // collect up all the group predicates from the query's filters
  // NOTE: this only pulls the all and any predicates
  const groups: string[] = getPredicateValues("group", query);
  // get the user's groups by membership
  const allUserGroups = getUserGroupsByMembership(user);
  // if there are groups in the query, we subset the user's groups
  // based on the groups in the query
  if (groups.length) {
    const props: Array<keyof IGroupsByMembership> = [
      "owner",
      "admin",
      "member",
    ];
    groups.forEach((groupId) => {
      // check each group type and add the group to the response if the user is a member
      props.forEach((prop) => {
        if (allUserGroups[prop].includes(groupId)) {
          response[prop].push(groupId);
        }
      });
    });
  } else {
    response = allUserGroups;
  }

  return response;
}
