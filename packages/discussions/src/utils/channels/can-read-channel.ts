import { IUser } from "@esri/arcgis-rest-auth";
import { GroupMembership } from "@esri/arcgis-rest-portal";
import { IChannel, IDiscussionsUser } from "../../types";
import { reduceByGroupMembership } from "../platform";
import { hasOrgAdminViewRights } from "../portal-privilege";

/**
 * Utility to determine if User can view channel posts and channel attributes
 *
 * @deprecated replace with canReadChannelV2 for v2 discussions
 * @export
 * @param {IChannel} channel
 * @param {IUser} user
 * @return {*}  {boolean}
 */
export function canReadChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  if (hasOrgAdminViewRights(user, channel.orgId)) {
    return true;
  }

  if (channel.access === "private") {
    // ensure user is member of at least one group
    return intersectGroups(["member", "owner", "admin"])(user, channel);
  }

  if (channel.access === "org") {
    return (
      intersectGroups(["member", "owner", "admin"])(user, channel) ||
      isLegacyChannelOrgMember(channel, user)
    );
  }

  // public channel
  return true;
}

/**
 * Utility (deprecated) to determine whether User can view posts belonging to Channel
 *
 * @export
 * @deprecated replace with canReadChannelV2 for v2 discussions
 * @param {IChannel} channel
 * @param {IUser} user
 * @return {*}  {boolean}
 */
export function canReadFromChannel(
  channel: IChannel,
  user: IUser | IDiscussionsUser = {}
): boolean {
  return canReadChannel(channel, user);
}

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

function isLegacyChannelOrgMember(
  channel: IChannel,
  user: IUser | IDiscussionsUser
): boolean {
  // orgs.length = 1 until collaboration/discussion between many orgs is ideated
  return channel.orgs.length === 1 && channel.orgs.indexOf(user.orgId) > -1;
}
