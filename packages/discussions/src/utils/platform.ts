import { GroupMembership, IGroup, IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "@esri/hub-common";

type Privilege =
  | "portal:user:createItem"
  | "portal:user:shareToGroup"
  | "portal:user:viewOrgItems"
  | "portal:admin:shareToOrg"
  | "portal:admin:shareToPublic"
  | "portal:admin:viewItems"
  | "portal:admin:updateItems"
  | "portal:admin:deleteItems";

/**
 * Utility that returns reducer function that filters a user's groups
 * by membership type and produces an array of group id's
 *
 *
 * @export
 * @param {GroupMembership[]} membershipTypes
 * @return {*}  {((memo: string[], group: IGroup) => string[])}
 */
export function reduceByGroupMembership(
  membershipTypes: GroupMembership[]
): (memo: string[], group: IGroup) => string[] {
  return function (memo, group) {
    if (membershipTypes.indexOf(group.userMembership.memberType) > -1) {
      memo.push(group.id);
    }
    return memo;
  };
}

/**
 * Utility that checks if a user is a portal org admin, or an org_admin by a platform role
 *
 * @export
 * @param {IUser} user
 * @return {*}  {boolean}
 */
// NOTE: this is not the same as @esri/arcgis-rest-portal isOrgAdmin,
// which first resolves `user` from `IUserRequestOptions` to make this determination
// https://github.com/Esri/arcgis-rest-js/blob/7ab072184f89dcb35367518101ee4abeb5a9d112/packages/arcgis-rest-portal/src/sharing/helpers.ts#L45
export function isOrgAdmin(user: IUser): boolean {
  return user.role === "org_admin";
}

export function isUserInOrg(
  user: IUser | IDiscussionsUser,
  orgId: string
): boolean {
  return user?.orgId === orgId;
}

export function isOrgAdminInOrg(user: IUser, orgId: string): boolean {
  return isOrgAdmin(user) && isUserInOrg(user, orgId);
}

// export function isChannelOrgAdmin(
//   channel: IChannel,
//   user: IUser | IDiscussionsUser
// ): boolean {
//   return isUserInOrg(user, channel.orgId) && isOrgAdmin(user);
// }

export function userHasPrivilege(
  user: IUser | IDiscussionsUser,
  privilege: Privilege
): boolean {
  return !!user?.privileges?.includes(privilege);
}
export function userHasPrivileges(
  user: IUser | IDiscussionsUser,
  privileges: Privilege[]
): boolean {
  return privileges.every((privilege) => userHasPrivilege(user, privilege));
}
