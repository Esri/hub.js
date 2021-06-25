import { IGroup, IUser } from "@esri/arcgis-rest-types";

/**
 * Checks if user has access to edit a team in Hub
 * @param {IGroup} group
 * @param {IUser} user
 * @returns {boolean}
 */
export function canEditTeam(group: IGroup, user: IUser): boolean {
  const memberType = group.userMembership.memberType;
  return memberType === "owner" || memberType === "admin";
}
