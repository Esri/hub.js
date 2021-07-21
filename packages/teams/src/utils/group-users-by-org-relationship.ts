import { IUser } from "@esri/arcgis-rest-types";
import { IUserOrgRelationship, IUserModalObject } from "../types";

/**
 * @private
 * Takes users array and sorts them into an object by the type of user they are
 *
 * @export
 * @param {IUserModalObject[]} users array of users
 * @return {IUserOrgRelationship} Object of users sorted by type (world, org, community)
 */
export function groupUsersByOrgRelationship(
  users: IUserModalObject[]
): IUserOrgRelationship {
  return users.reduce(
    (acc, user) => {
      // keyof needed to make bracket notation work without TS throwing a wobbly.
      const modelType = (user.modelType || "world") as keyof IUserOrgRelationship;
      acc[modelType].push(user);
      return acc;
    },
    { world: [], org: [], community: [], partnered: [] }
  );
}
