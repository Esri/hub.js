import { IGroup, IUser } from "@esri/arcgis-rest-types";

/**
 * Checks if user has access to edit a team
 * @param {IGroup} group
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditTeam(group: IGroup, user: IUser): boolean {
  let canEdit = false;
  if (user) {
    const memberType = group.userMembership.memberType;
    const userName = group.userMembership.username;
    canEdit =
      userName === user.username &&
      (memberType === "owner" || memberType === "admin");
  }
  return canEdit;
}
