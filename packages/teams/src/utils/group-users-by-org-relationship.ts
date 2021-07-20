import { IUser } from "@esri/arcgis-rest-types";
import { IUserOrgRelationship, IUserModalObject } from "../types";

export function groupUsersByOrgRelationship(
  users: IUserModalObject[]
): IUserOrgRelationship {
  return users.reduce(
    (acc, user) => {
      // Needed
      const modelType = (user.modelType ||
        "world") as keyof IUserOrgRelationship;
      acc[modelType].push(user);
      return acc;
    },
    { world: [], org: [], community: [], partnered: [] }
  );
}
