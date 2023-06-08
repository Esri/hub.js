import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, Role, SharingAccess } from "../../types";
import { ChannelPermission } from "../channel-permission";
import { CANNOT_DISCUSS } from "../constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

const ALLOWED_ROLES_FOR_POSTING = Object.freeze([
  Role.WRITE,
  Role.READWRITE,
  Role.MANAGE,
  Role.MODERATE,
  Role.OWNER,
]);

type ILegacyChannelPermissions = Pick<
  IChannel,
  "groups" | "orgs" | "access" | "allowAnonymous"
>;

export function canPostToChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { channelAcl, access, groups, orgs, allowAnonymous } = channel;

  if (channelAcl) {
    const channelPermission = new ChannelPermission(channelAcl);
    return channelPermission.canPostToChannel(user as IDiscussionsUser);
  }

  // Once channelAcl usage is enforced, we will remove authorization by legacy permissions
  return isAuthorizedToPostByLegacyPermissions(user, {
    access,
    groups,
    orgs,
    allowAnonymous,
  });
}

function isAuthorizedToPostByLegacyPermissions(
  user: IUser | IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups, orgId: userOrgId } = user;
  const { allowAnonymous, access, groups, orgs } = channelParams;

  // order is important here
  if (allowAnonymous === true) {
    return true;
  }

  if (!username) {
    return false;
  }

  if (access === SharingAccess.PUBLIC) {
    return true;
  }

  if (access === SharingAccess.PRIVATE) {
    return isAuthorizedToPostByLegacyGroup(groups, userGroups);
  }

  if (access === SharingAccess.ORG) {
    return orgs.includes(userOrgId);
  }

  return false;
}

function isAuthorizedToPostByLegacyGroup(
  channelGroups: string[] = [],
  userGroups: IGroup[] = []
) {
  return channelGroups.some((channelGroupId: string) => {
    return userGroups.some((group: IGroup) => {
      const {
        id: userGroupId,
        userMembership: { memberType: userMemberType },
        typeKeywords,
      } = group;

      return (
        channelGroupId === userGroupId &&
        ALLOWED_GROUP_ROLES.includes(userMemberType) &&
        !typeKeywords.includes(CANNOT_DISCUSS)
      );
    });
  });
}
