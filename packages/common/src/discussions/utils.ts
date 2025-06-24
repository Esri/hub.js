import type { IGroup, IItem } from "@esri/arcgis-rest-portal";
import { IGroupUsersResult, getGroupUsers } from "@esri/arcgis-rest-portal";
import type { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubContent, IHubItemEntity } from "../core";
import { CANNOT_DISCUSS } from "./constants";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  Role,
  SharingAccess,
} from "./api/types";
import { IFilter, IHubSearchResult, IPredicate, IQuery } from "../search";

/**
 * Utility to determine if a given IGroup, IItem, IHubContent, or IHubItemEntity
 * is discussable.
 * @param {IGroup|IItem|IHubContent|IHubItemEntity} subject
 * @return {boolean}
 */
export function isDiscussable(
  subject: Partial<IGroup | IItem | IHubContent | IHubItemEntity>
): boolean {
  let result = false;
  if (subject) {
    const typeKeywords = (subject.typeKeywords || []) as string[];
    result = !typeKeywords.includes(CANNOT_DISCUSS);
  }
  return result;
}

/**
 * Adds or removes CANNOT_DISCUSS type keyword and returns the updated list
 * @param {IGroup|IHubContent|IHubItemEntity} subject
 * @param {boolean} discussable
 * @returns {string[]} updated list of type keywords
 */
export function setDiscussableKeyword(
  typeKeywords: string[],
  discussable: boolean
): string[] {
  const updatedTypeKeywords = (typeKeywords || []).filter(
    (typeKeyword: string) => typeKeyword !== CANNOT_DISCUSS
  );
  if (!discussable) {
    updatedTypeKeywords.push(CANNOT_DISCUSS);
  }
  return updatedTypeKeywords;
}

/**
 * Determines if the given channel is considered to be a `public` channel, supporting both
 * legacy permissions and V2 ACL model.
 * @param channel An IChannel record
 * @returns true if the channel is considered `public`
 */
export function isPublicChannel(channel: IChannel): boolean {
  return channel.channelAcl
    ? channel.channelAcl.some(({ category }) =>
        [AclCategory.AUTHENTICATED_USER, AclCategory.ANONYMOUS_USER].includes(
          category
        )
      )
    : channel.access === SharingAccess.PUBLIC;
}

/**
 * Determines if the given channel is considered to be an `org` channel, supporting both
 * legacy permissions and V2 ACL model.
 * @param channel An IChannel record
 * @returns true if the channel is considered `org`
 */
export function isOrgChannel(channel: IChannel): boolean {
  return channel.channelAcl
    ? !isPublicChannel(channel) &&
        channel.channelAcl.some(
          ({ category, subCategory }) =>
            category === AclCategory.ORG &&
            subCategory === AclSubCategory.MEMBER
        )
    : channel.access === SharingAccess.ORG;
}

/**
 * Determines if the given channel is considered to be a `private` channel, supporting both
 * legacy permissions and V2 ACL model.
 * @param channel An IChannel record
 * @returns true if the channel is considered `private`
 */
export function isPrivateChannel(channel: IChannel): boolean {
  return !isPublicChannel(channel) && !isOrgChannel(channel);
}

/**
 * Determines the given channel's access, supporting both legacy permissions and V2 ACL
 * model.
 * @param channel An IChannel record
 * @returns `public`, `org` or `private`
 */
export function getChannelAccess(channel: IChannel): SharingAccess {
  let access = SharingAccess.PRIVATE;
  if (isPublicChannel(channel)) {
    access = SharingAccess.PUBLIC;
  } else if (isOrgChannel(channel)) {
    access = SharingAccess.ORG;
  }
  return access;
}

/**
 * Returns an array of org ids configured for the channel, supporting both legacy permissions
 * and V2 ACL model.
 * @param channel An IChannel record
 * @returns an array of org ids for the given channel
 */
export function getChannelOrgIds(channel: IChannel): string[] {
  return channel.channelAcl
    ? channel.channelAcl.reduce<string[]>(
        (acc, permission) =>
          permission.category === AclCategory.ORG &&
          [AclSubCategory.MEMBER, AclSubCategory.ADMIN].includes(
            permission.subCategory
          ) &&
          !acc.includes(permission.key)
            ? [...acc, permission.key]
            : acc,
        []
      )
    : channel.orgs;
}

/**
 * Returns an array of group ids configured for the channel, supporting both legacy permissions
 * and V2 ACL model.
 * @param channel An IChannel record
 * @returns an array of group ids for the given channel
 */
export function getChannelGroupIds(channel: IChannel): string[] {
  return channel.channelAcl
    ? channel.channelAcl.reduce<string[]>(
        (acc, permission) =>
          permission.category === AclCategory.GROUP &&
          [AclSubCategory.MEMBER, AclSubCategory.ADMIN].includes(
            permission.subCategory
          ) &&
          !acc.includes(permission.key)
            ? [...acc, permission.key]
            : acc,
        []
      )
    : channel.groups;
}

/**
 * A utility method used to build an IQuery to search for users that are permitted to be at-mentioned for the given channel.
 * @param input An array of strings to search for. Each string is mapped to `username` and `fullname`, filters as an OR condition
 * @param channel An IChannel record
 * @param currentUsername The currently authenticated user's username
 * @param requestOptions An IRequestOptions object
 * @returns a promise that resolves an IQuery
 */
export async function getChannelUsersQuery(
  inputs: string[],
  channel: IChannel,
  currentUsername?: string,
  requestOptions?: IRequestOptions
): Promise<IQuery> {
  const getNonOwnerAclKeysByCategory = (
    category: AclCategory.GROUP | AclCategory.ORG,
    channel: IChannel
  ): { member: string[]; admin: string[] } =>
    channel.channelAcl.reduce<{ member: string[]; admin: string[] }>(
      (acc, channelAcl) =>
        channelAcl.category === category &&
        channelAcl.role !== Role.OWNER &&
        !acc[channelAcl.subCategory].includes(channelAcl.key)
          ? {
              ...acc,
              [channelAcl.subCategory]: [
                ...acc[channelAcl.subCategory],
                channelAcl.key,
              ],
            }
          : acc,
      { member: [], admin: [] }
    );
  const filters: IFilter[] = [];
  if (isPublicChannel(channel)) {
    // any authenticated user when channel access is public
    filters.push({
      operation: "AND",
      predicates: [{ orgid: { from: "0", to: "{" } }],
    });
  } else {
    // either org or private
    const filter: IFilter = {
      operation: "OR",
      predicates: [],
    };
    // process orgs
    const orgIdsBySubCategory = getNonOwnerAclKeysByCategory(
      AclCategory.ORG,
      channel
    );
    // org members
    if (orgIdsBySubCategory.member.length) {
      filter.predicates.push({
        orgid: orgIdsBySubCategory.member,
      });
    }
    // org admins
    if (orgIdsBySubCategory.admin.length) {
      filter.predicates.push({
        orgid: orgIdsBySubCategory.admin,
        role: "org_admin",
      });
    }

    // process groups
    const groupIdsBySubCategory = getNonOwnerAclKeysByCategory(
      AclCategory.GROUP,
      channel
    );
    // group members
    if (groupIdsBySubCategory.member.length) {
      filter.predicates.push({ group: groupIdsBySubCategory.member });
    }
    // group admins
    if (groupIdsBySubCategory.admin.length) {
      // the /community/users endpoint supports searching for users that are members of specific groups via `group`, but there's no way
      // to further refine results to a specific type of membership within that group (e.g. memberType:admin). to do so, we need to fetch the
      // group members via /community/groups/:id/users for each group and then build the appropriate predicates. however, given that group
      // owners & admins will be returned in the results for the member predicate above, we only need to do this for groups whose ID is not
      // also present in the member predicate above
      const adminOnlyGroupIds = groupIdsBySubCategory.admin.filter(
        (groupId) => !groupIdsBySubCategory.member.includes(groupId)
      );
      if (adminOnlyGroupIds.length) {
        const groupMemberships = await Promise.all(
          adminOnlyGroupIds.map((groupId) =>
            getGroupUsers(groupId, requestOptions)
          )
        );
        groupMemberships.forEach((groupUserResult: IGroupUsersResult, idx) => {
          filter.predicates.push({
            group: adminOnlyGroupIds[idx],
            username: [groupUserResult.owner, ...groupUserResult.admins],
          });
        });
      }
    }

    filters.push(filter);
  }

  if (currentUsername) {
    filters.push({
      operation: "AND",
      predicates: [{ username: { not: currentUsername } }],
    });
  }

  const query: IQuery = {
    targetEntity: "communityUser",
    filters: [
      {
        operation: "OR",
        predicates: inputs.reduce<IPredicate[]>(
          (acc, input) => [...acc, { username: input }, { fullname: input }],
          []
        ),
      },
      ...filters,
    ],
  };
  return query;
}

/**
 * Transforms a given channel and optional channel groups array into a IHubSearchResult
 * @param channel
 * @param groups
 * @returns
 */
export const channelToSearchResult = (
  channel: IChannel,
  groups?: IGroup[]
): IHubSearchResult => {
  return {
    ...channel,
    id: channel.id,
    name: channel.name,
    createdDate: new Date(channel.createdAt),
    createdDateSource: "channel",
    updatedDate: new Date(channel.updatedAt),
    updatedDateSource: "channel",
    type: "channel",
    access: getChannelAccess(channel),
    family: "channel",
    owner: channel.creator,
    links: {
      // TODO: add links?
      thumbnail: null,
      self: null,
      siteRelative: null,
    },
    includes: { groups },
    rawResult: channel,
  };
};

/**
 * Constructs file name for exported csvs
 * @param entityTitle
 * @returns string
 */
export function getPostCSVFileName(entityTitle: string): string {
  const et = entityTitle;
  const suffix = `_${new Date(Date.now())
    .toISOString()
    .replace(/[^a-z0-9]/gi, "-")}.csv`;
  const prefix = et
    // coerce to lower case
    .toLowerCase()
    // replace non-alpha-numeric chars with hyphens
    .replace(/[^a-z0-9]/g, "-")
    // replace consecutive hyphens with single hyphen
    .replace(/-{2,}/g, "-")
    // replace leading hyphens with empty string
    .replace(/^-/, "")
    // truncate filename so it doesn't exceed 250 chars to avoid OS filename length limitations
    .substring(0, 250 - suffix.length)
    // replace trailing hyphens
    .replace(/-$/, "");
  return [prefix, suffix].join("");
}
