import { IGroup, IItem } from "@esri/arcgis-rest-types";
import { IHubContent, IHubItemEntity } from "../core";
import { CANNOT_DISCUSS } from "./constants";
import { IChannel, SharingAccess } from "./api/types";
import {
  IFilter,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
  IQuery,
  hubSearch,
} from "../search";

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
  const updatedTypeKeywords = typeKeywords.filter(
    (typeKeyword: string) => typeKeyword !== CANNOT_DISCUSS
  );
  if (!discussable) {
    updatedTypeKeywords.push(CANNOT_DISCUSS);
  }
  return updatedTypeKeywords;
}

/**
 * A utility method used to search for users that are permitted to be at-mentioned by the currently authenticated user
 * for the given channel access configuration.
 * @param data An object of query-related values
 * @param data.users An array of strings to search for. Each string is mapped to `username` and `fullname` filters as an OR condition
 * @param data.access The channel sharing access
 * @param data.orgs The channel org ids
 * @param data.groups The channel group ids
 * @param data.currentUsername The currently authenticated user's username
 * @param options An IHubSearchOptions object
 * @returns a promise that resolves an IHubSearchResponse<IHubSearchResult>
 */
export function searchChannelUsers(
  data: {
    users: string[];
    access: SharingAccess;
    orgs: string[];
    groups: string[];
    currentUsername?: string;
  },
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const { users, currentUsername, groups, access, orgs } = data;
  const groupsPredicate = { group: groups };
  const groupsOrEmptyNull = groups.length ? groupsPredicate : null;
  let filters: IFilter[];
  if (access === SharingAccess.PRIVATE) {
    filters = [
      {
        operation: "AND",
        predicates: [groupsPredicate],
      },
    ];
  } else if (access === SharingAccess.ORG) {
    filters = [
      {
        operation: "OR",
        predicates: [{ orgid: orgs }, groupsOrEmptyNull],
      },
    ];
  } else {
    filters = [
      {
        operation: "OR",
        predicates: [{ orgid: { from: "0", to: "{" } }, groupsOrEmptyNull],
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
        predicates: users.reduce(
          (acc, user) => [...acc, { username: user }, { fullname: user }],
          [] as IPredicate[]
        ),
      },
      ...filters,
    ],
  };
  return hubSearch(query, options);
}
