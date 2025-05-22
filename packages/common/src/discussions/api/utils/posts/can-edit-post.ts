import { IGroup, IUser } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, IPost, SharingAccess } from "../../types";
import { CANNOT_DISCUSS } from "../../../constants";

type ILegacyChannelPermissions = Pick<
  IChannel,
  "groups" | "orgs" | "access" | "allowAnonymous"
>;

/**
 * Utility to determine if User has privileges to modify a post
 * @export
 * @deprecated replace with canEditPostV2 for v2 discussions
 * @param post
 * @param user
 * @param channel
 * @returns {boolean}
 */
export function canModifyPost(
  post: IPost,
  user: IUser | IDiscussionsUser = {},
  channel: IChannel
): boolean {
  return canEditPost(post, user, channel);
}

/**
 * Utility to determine if User has privileges to modify a post
 * @export
 * @deprecated replace with canEditPostV2 for v2 discussions
 * @param post
 * @param user
 * @param channel
 * @returns {boolean}
 */
export function canEditPost(
  post: IPost,
  user: IUser | IDiscussionsUser = {},
  channel: IChannel
): boolean {
  const { access, groups, orgs, allowAnonymous } = channel;

  return (
    isPostCreator(post, user) &&
    isAuthorizedToModifyByLegacyPermissions(user, {
      access,
      groups,
      orgs,
      allowAnonymous,
    })
  );
}

function isPostCreator(post: IPost, user: IUser | IDiscussionsUser) {
  return !!user.username && post.creator === user.username;
}

function isAuthorizedToModifyByLegacyPermissions(
  user: IUser | IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
) {
  const { groups: userGroups = [], orgId: userOrgId } = user;
  const { access, groups: channelGroups = [], orgs = [] } = channelParams;

  if (access === SharingAccess.PUBLIC) {
    return true;
  }

  if (access === SharingAccess.ORG) {
    return (
      isAuthorizedToModifyPostByLegacyGroup(channelGroups, userGroups) ||
      orgs.includes(userOrgId)
    );
  }

  // private
  return isAuthorizedToModifyPostByLegacyGroup(channelGroups, userGroups);
}

/**
 * Ensure the user is a member of one of the channel groups
 * and the group is not marked as non-discussable
 */
function isAuthorizedToModifyPostByLegacyGroup(
  channelGroups: string[],
  userGroups: IGroup[]
) {
  return channelGroups.some((channelGroupId: string) => {
    return userGroups.some((group: IGroup) => {
      const { id: userGroupId, typeKeywords = [] } = group;

      return (
        channelGroupId === userGroupId && !typeKeywords.includes(CANNOT_DISCUSS)
      );
    });
  });
}
