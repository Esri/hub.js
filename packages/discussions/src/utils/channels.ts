import { IUser } from "@esri/arcgis-rest-auth";
import { GroupMembership } from "@esri/arcgis-rest-portal";
import { IChannelDTO, IPlatformSharing } from "../types";
import { isOrgAdmin, reduceByGroupMembership } from "./platform";

const intersectGroups = (
  membershipTypes: GroupMembership[],
  strict?: boolean
): ((arg0: IUser, arg1: IChannelDTO) => boolean) => {
  return (user: IUser, channel: IChannelDTO): boolean => {
    const { groups: sharedGroups } = channel;
    const { groups: userGroups } = user;
    const eligibleUserGroups = userGroups.reduce(
      reduceByGroupMembership(membershipTypes),
      []
    );
    const method = strict ? "every" : "some";
    return sharedGroups[method](
      group => eligibleUserGroups.indexOf(group) > -1
    );
  };
};

const isChannelOrgMember = (channel: IChannelDTO, user: IUser): boolean => {
  // orgs.length === 1 until cross-org comms is sussed out
  return channel.orgs.length === 1 && channel.orgs.indexOf(user.orgId) > -1;
};

const isChannelOrgAdmin = (channel: IChannelDTO, user: IUser): boolean => {
  return isOrgAdmin(user) && channel.orgs.indexOf(user.orgId) > -1;
};

export const canReadFromChannel = (
  channel: IChannelDTO,
  user: IUser
): boolean => {
  if (channel.access === "private") {
    // ensure user is member of at least one group
    return intersectGroups(["member", "owner", "admin"])(user, channel);
  } else if (channel.access === "org") {
    return isChannelOrgMember(channel, user);
  }
  return true;
};

export const canModifyChannel = (
  channel: IChannelDTO,
  user: IUser
): boolean => {
  if (channel.access === "private") {
    // ensure user is owner/admin of at least one group
    return intersectGroups(["owner", "admin"])(user, channel);
  } else if (channel.access === "org") {
    return isChannelOrgAdmin(channel, user);
  }
  return false;
};

export const canCreateChannel = (
  channel: IChannelDTO,
  user: IUser
): boolean => {
  if (channel.access === "private") {
    // ensure user is member of all groups included
    return intersectGroups(["owner", "admin", "member"], true)(user, channel);
  }
  // if org or public channel, must be org admin
  return isChannelOrgAdmin(channel, user);
};

export const canPostToChannel = (
  channel: IChannelDTO,
  user: IUser
): boolean => {
  if (channel.access === "private") {
    // ensure user is member of at least one
    return intersectGroups(["owner", "admin", "member"])(user, channel);
  } else if (channel.access === "org") {
    return isChannelOrgMember(channel, user);
  } else if (user.username === "anonymous") {
    return channel.allowAnonymous;
  }
  return true;
};

export const isChannelInclusive = (
  outer: IChannelDTO,
  inner: IChannelDTO | IPlatformSharing
): void => {
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
};
