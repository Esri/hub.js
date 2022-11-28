import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IChannelAcl, SharingAccess } from "../../types";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

export function canCreateChannel(channel: IChannel, user: IUser): boolean {
  const { acl, access, groups, orgs } = channel;

  if (acl) {
    return isAuthorizedToCreateByAcl(user, acl);
  }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

function isAuthorizedToCreateByAcl(user: IUser, acl: IChannelAcl): boolean {
  return true;
}

function isAuthorizedToCreateByLegacyPermissions(
  user: IUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups, orgId: userOrgId } = user;
  const { access, groups: channelGroups, orgs } = channelParams;

  if (username === null) {
    return false;
  }

  // if (access === SharingAccess.PRIVATE) {
  //   return isUserInAllChannelGroups(userGroups, channelGroups);
  // }

  return true;

  // pubic

  // org
}

// function isUserInAllChannelGroups(
//   userGroups: IGroup[],
//   channelGroups: string[]
// ): boolean {
//   return channelGroups.every((channelGroup) => {});
// }
