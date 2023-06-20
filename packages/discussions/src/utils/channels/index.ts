import { IUser } from "@esri/arcgis-rest-auth";
import { GroupMembership } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser, IPlatformSharing } from "../../types";
import { isOrgAdmin, reduceByGroupMembership } from "../platform";

export { canPostToChannel } from "./can-post-to-channel";
export { canCreateChannel } from "./can-create-channel";

function intersectGroups(
  membershipTypes: GroupMembership[]
): (arg0: IUser, arg1: IChannel) => boolean {
  return (user: IUser | IDiscussionsUser, channel: IChannel): boolean => {
    const { groups: sharedGroups = [] } = channel;
    const { groups: userGroups = [] } = user;
    const eligibleUserGroups = userGroups.reduce(
      reduceByGroupMembership(membershipTypes),
      []
    );
    const method = "some";
    return sharedGroups[method](
      (group) => eligibleUserGroups.indexOf(group) > -1
    );
  };
}

function isChannelOrgMember(
  channel: IChannel,
  user: IUser | IDiscussionsUser
): boolean {
  // orgs.length = 1 until collaboration/discussion between many orgs is ideated
  return channel.orgs.length === 1 && channel.orgs.indexOf(user.orgId) > -1;
}

function isChannelOrgAdmin(
  channel: IChannel,
  user: IUser | IDiscussionsUser
): boolean {
  return isOrgAdmin(user) && channel.orgs.indexOf(user.orgId) > -1;
}

/**
 * Utility to determine whether User can view posts belonging to Channel
 *
 * @export
 * @param {IChannel} channel
 * @param {IUser} user
 * @return {*}  {boolean}
 */
export function canReadFromChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (channel.access === "private") {
    // ensure user is member of at least one group
    return intersectGroups(["member", "owner", "admin"])(user, channel);
  }

  if (channel.access === "org") {
    return (
      intersectGroups(["member", "owner", "admin"])(user, channel) ||
      isChannelOrgMember(channel, user)
    );
  }

  // public channel
  return true;
}

/**
 * Utility to determine whether User can modify channel settings and posts belonging to Channel
 *
 * @export
 * @param {IChannel} channel
 * @param {IUser} user
 * @return {*}  {boolean}
 */
export function canModifyChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (!user.username) {
    return false;
  }

  if (channel.creator === user.username) {
    return true;
  }

  if (channel.access === "private") {
    // ensure user is owner/admin of at least one group
    return intersectGroups(["owner", "admin"])(user, channel);
  }

  // org or public channel
  return (
    intersectGroups(["owner", "admin"])(user, channel) ||
    isChannelOrgAdmin(channel, user)
  );
}
