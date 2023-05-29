import { IUser } from "@esri/arcgis-rest-auth";
import { GroupMembership } from "@esri/arcgis-rest-portal";
import { IChannel, IPlatformSharing } from "../../types";
import { isOrgAdmin, reduceByGroupMembership } from "../platform";

export { canPostToChannel } from "./can-post-to-channel";
export { canCreateChannel } from "./can-create-channel";

function intersectGroups(
  membershipTypes: GroupMembership[]
): (arg0: IUser, arg1: IChannel) => boolean {
  return (user: IUser, channel: IChannel): boolean => {
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

function isChannelOrgMember(channel: IChannel, user: IUser): boolean {
  // orgs.length = 1 until collaboration/discussion between many orgs is ideated
  return channel.orgs.length === 1 && channel.orgs.indexOf(user.orgId) > -1;
}

function isChannelOrgAdmin(channel: IChannel, user: IUser): boolean {
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
export function canReadFromChannel(channel: IChannel, user: IUser): boolean {
  if (channel.access === "private") {
    // ensure user is member of at least one group
    return intersectGroups(["member", "owner", "admin"])(user, channel);
  } else if (channel.access === "org") {
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
export function canModifyChannel(channel: IChannel, user: IUser): boolean {
  if (channel.creator === user.username) {
    return true;
  }

  if (channel.access === "private") {
    // ensure user is owner/admin of at least one group
    return intersectGroups(["owner", "admin"])(user, channel);
  }
  // if org or public channel, must be org admin
  return isChannelOrgAdmin(channel, user);
}

/**
 * Utility to determine whether a Channel definition (inner) is encapsulated by another Channel's definition (outer)
 *
 * @export
 * @param {IChannel} outer -- access and groups that should contain inner access and groups
 * @param {(IChannel | IPlatformSharing)} inner -- access and groups that should be contained by outer access and groups
 * @return {*}  {boolean}
 */
export function isChannelInclusive(
  outer: IChannel,
  inner: IChannel | IPlatformSharing
): boolean {
  let valid: boolean;
  let err: string;
  if (outer.access === "private" && outer.groups.length === 1) {
    valid = inner.access === "private" && inner.groups[0] === outer.groups[0];
    if (!valid) {
      err = "replies to private post must be shared to same team";
    }
  } else if (outer.access === "private") {
    valid =
      inner.access === "private" &&
      inner.groups.every((group: string) => outer.groups.indexOf(group) > -1);
    if (!valid) {
      err = "replies to shared post must be shared to subset of same teams";
    }
  } else if (outer.access === "org" && inner.access === "org") {
    valid = inner.orgs.every((org: string) => outer.orgs.indexOf(org) > -1);
    if (!valid) {
      err = "replies to org post must be shared to subset of same orgs";
    }
  } else if (outer.access === "org") {
    valid = inner.access !== "public";
    if (!valid) {
      err = "replies to org post cannot be shared to public";
    }
  }
  if (err) {
    throw new Error(err);
  }
  return valid;
}
