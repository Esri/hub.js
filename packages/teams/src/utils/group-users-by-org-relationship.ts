import { IUserOrgRelationship, IUserWithOrgType } from "../types";

/**
 * @private
 * Takes users array and sorts them into an object by the type of user they are
 *
 * @export
 * @param {IUserWithOrgType[]} users array of users
 * @return {IUserOrgRelationship} Object of users sorted by type (world, org, community)
 */
export function groupUsersByOrgRelationship(
  users: IUserWithOrgType[]
): IUserOrgRelationship {
  return users.reduce(
    (acc, user) => {
      // keyof needed to make bracket notation work without TS throwing a wobbly.
      const orgType = user.orgType as keyof IUserOrgRelationship;
      acc[orgType].push(user);
      return acc;
    },
    { world: [], org: [], community: [], partnered: [] }
  );
}
