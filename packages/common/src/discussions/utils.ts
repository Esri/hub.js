import { IGroup, IItem } from "@esri/arcgis-rest-types";
import { IHubContent, IHubItemEntity } from "../core";
import { CANNOT_DISCUSS } from "./constants";
import {
  AclCategory,
  AclSubCategory,
  IChannel,
  SharingAccess,
} from "./api/types";
import { IFilter, IPredicate, IQuery } from "../search";

/**
 * Utility to determine if a given IGroup, IItem, IHubContent, or IHubItemEntity
 * is discussable.
 * @param {IGroup|IItem|IHubContent|IHubItemEntity} subject
 * @return {boolean}
 */
export function isDiscussable(
  subject: Partial<IGroup | IItem | IHubContent | IHubItemEntity>
) {
  return !(subject.typeKeywords ?? []).includes(CANNOT_DISCUSS);
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
    ? channel.channelAcl.some(
        ({ category }) => category === AclCategory.AUTHENTICATED_USER
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
    ? channel.channelAcl.reduce(
        (acc, permission) =>
          permission.category === AclCategory.ORG &&
          permission.subCategory === AclSubCategory.MEMBER
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
    ? channel.channelAcl.reduce(
        (acc, permission) =>
          permission.category === AclCategory.GROUP &&
          permission.subCategory === AclSubCategory.MEMBER
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
 * @param options An IHubSearchOptions object
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult>
 */
export function getChannelUsersQuery(
  inputs: string[],
  channel: IChannel,
  currentUsername?: string
): IQuery {
  const groupIds = getChannelGroupIds(channel);
  const orgIds = getChannelOrgIds(channel);
  const groupsPredicate = { group: groupIds };
  let filters: IFilter[];
  if (isPublicChannel(channel)) {
    filters = [
      {
        operation: "OR",
        predicates: [{ orgid: { from: "0", to: "{" } }],
      },
    ];
  } else if (isOrgChannel(channel)) {
    const additional = groupIds.length ? [groupsPredicate] : [];
    filters = [
      {
        operation: "OR",
        predicates: [{ orgid: orgIds }, ...additional],
      },
    ];
  } else {
    filters = [
      {
        operation: "AND",
        predicates: [groupsPredicate],
      },
    ];
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
    access: channel.access,
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
