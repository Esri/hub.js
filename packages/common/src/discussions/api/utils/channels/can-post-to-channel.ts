import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { SharingAccess } from "../../enums/sharingAccess";
import { hasOrgAdminUpdateRights } from "../portal-privilege";
import { CANNOT_DISCUSS } from "../../../constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<
  IChannel,
  "groups" | "orgs" | "access" | "allowAnonymous"
>;

// NO V2 EQUIVALENT. Use canCreatePostV2 or canCreateReplyV2
/**
 * Utility to determine if User has privileges to create a post in a channel
 * @deprecated use `canCreatePostV2` or 'canCreateReplyV2` instead
 * @export
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canPostToChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { access, groups, orgs, allowAnonymous } = channel;

  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

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
