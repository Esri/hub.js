import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, SharingAccess } from "../../types";
import { hasOrgAdminUpdateRights } from "../portal-privilege";
import { CANNOT_DISCUSS } from "../../../constants";

const ALLOWED_GROUP_ROLES = Object.freeze(["owner", "admin", "member"]);

type ILegacyChannelPermissions = Pick<IChannel, "groups" | "orgs" | "access">;

/**
 * Utility to determine if User has privileges to create a reply in a channel
 *
 * @export
 * @deprecated replace with canCreateReplyV2 for v2 discussions
 * @param channel
 * @param user
 * @returns {boolean}
 */
export function canCreateReply(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  const { access, groups, orgs } = channel;

  if (hasOrgAdminUpdateRights(user, channel.orgId)) {
    return true;
  }

  return isAuthorizedToPostByLegacyPermissions(user, {
    access,
    groups,
    orgs,
  });
}

function isAuthorizedToPostByLegacyPermissions(
  user: IUser | IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
): boolean {
  const { username, groups: userGroups, orgId: userOrgId } = user;
  const { access, groups, orgs } = channelParams;

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
