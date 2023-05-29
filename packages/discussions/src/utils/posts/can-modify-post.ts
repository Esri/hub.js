import { IGroup } from "@esri/arcgis-rest-types";
import { IChannel, IDiscussionsUser, IPost, SharingAccess } from "../../types";
import { CANNOT_DISCUSS } from "../constants";

type ILegacyChannelPermissions = Pick<
  IChannel,
  "groups" | "orgs" | "access" | "allowAnonymous"
>;

/**
 * Determine if a user can modify an existing post
 */
export function canModifyPost(
  post: IPost,
  user: IDiscussionsUser,
  channel: IChannel
) {
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

function isPostCreator(post: IPost, user: IDiscussionsUser) {
  return !!user.username && post.creator === user.username;
}

function isAuthorizedToModifyByLegacyPermissions(
  user: IDiscussionsUser,
  channelParams: ILegacyChannelPermissions
) {
  const { groups: userGroups, orgId: userOrgId } = user;
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
  channelGroups: string[] = [],
  userGroups: IGroup[] = []
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
