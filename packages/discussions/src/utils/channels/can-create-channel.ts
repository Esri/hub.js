import { IGroup, IUser } from "@esri/arcgis-rest-types";
// import { IChannel, IChannelAcl, SharingAccess } from "../../types";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { isOrgAdmin } from "../platform";

const ALLOWED_USER_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<IChannel, "access" | "groups" | "orgs">;

export function canCreateChannel(
  channel: IChannel,
  user: IDiscussionsUser
): boolean {
  const { channelAcl, access, groups, orgs } = channel;

  // if (channelAcl) {
  //   return isAuthorizedToCreateByChannelAcl(user, channelAcl);
  // }

  return isAuthorizedToCreateByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

function isAuthorizedToCreateByChannelAcl(
  user: IDiscussionsUser,
  channelAcl: any
): boolean {
  return true;
}

function isAuthorizedToCreateByLegacyPermissions(
  user: IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups } = user;
  const { access, groups: channelGroupIds, orgs: channelOrgs } = channelParams;

  if (username === null) {
    return false;
  }

  if (access === SharingAccess.PRIVATE) {
    return isMemberOfAllChanelGroups(userGroups, channelGroupIds);
  }

  return isOrgAdminAndInChannelOrgs(user, channelOrgs);
}

function isMemberOfAllChanelGroups(
  userGroups: IGroup[],
  channelGroupIds: string[]
): boolean {
  const userGroupsById = userGroups.reduce(
    (accum: Record<string, boolean>, userGroup) => {
      const {
        id: userGroupId,
        userMembership: { memberType: userMemberType },
      } = userGroup;

      if (ALLOWED_USER_GROUP_ROLES.includes(userMemberType)) {
        accum[userGroupId] = true;
      }

      return accum;
    },
    {}
  );

  return channelGroupIds.every(
    (channelGroupId) => userGroupsById[channelGroupId]
  );
}

function isOrgAdminAndInChannelOrgs(
  user: IDiscussionsUser,
  channelOrgs: string[]
): boolean {
  return isOrgAdmin(user) && channelOrgs.includes(user.orgId);
}
