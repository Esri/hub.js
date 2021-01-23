/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getProp } from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

import { GraphQLClient } from "graphql-request";
import {
  createSessionMutation,
  userSelfQuery,
  userSearchQuery
} from "./queries";

import { IUser } from "@esri/arcgis-rest-types";
import {
  base64,
  IDateRange,
  SortDirection,
  ICursorSearchResults
} from "../types";

export enum UserSortableField {
  USERNAME = "USERNAME",
  LAST_HUB_SESSION = "LAST_HUB_SESSION"
}

interface ISortingOption {
  field?: UserSortableField;
  sortDirection?: SortDirection;
}

/**
 * Follows Edge -> Node schema yielded by GraphQL requests
 */
interface IEdge {
  node: IHubUser;
  cursor?: base64;
}

/**
 * Interface that derives directly from the User type in Hub Profiles API
 */
export interface IHubUser extends IUser {
  followedInitiatives?: any[];
  groups?: any[];
  teams?: any[];
  registeredEvents?: any[];
  lastHubSession?: number;
  visitsLast30Days?: number;
  visitsLast60Days?: number;
}

/**
 * Interface that derives directly from the SearchUsersFilter input for requests to the
 * searchUser endpoint in Hub Profiles API
 */
export interface ISearchUsersFilter {
  lastHubSession?: IDateRange;
  group?: string;
  team?: string;
  followedInitiative?: string;
  registeredEvent?: string;
}

export interface IUserPagingOptions {
  first: number;
  after?: string;
}

export interface IUserSearchOptions {
  pagingOptions?: IUserPagingOptions;
  sortingOptions?: ISortingOption[];
}

/**
 * Single service that, upon instantiation with proper authentication, exposes three endpoints
 * for interfacing with the GraphQL API exposed by Hub Profiles API
 */
export class UserService {
  constructor(private portalUrl: string, private userIndex: GraphQLClient) {}

  /**
   * Static create function for instantiating an instance of the UserService
   *
   * @param portalUrl {string} - relevant portal URL of the desired portal environment
   * @param userIndexApi {string} - endpoint URL for Hub Profiles API/user index
   * @param authentication {UserSession} - UserSession created with a valid token for the portal environment
   *                                       as defined by portalUrl
   */
  static create(
    portalUrl: string,
    userIndexApi: string,
    authentication: UserSession
  ): UserService {
    const api: GraphQLClient = new GraphQLClient(userIndexApi, {
      headers: {
        authorization: `Bearer ${authentication.token}`
      }
    });
    return new UserService(portalUrl, api);
  }

  /**
   * Create a user session in Hub Profiles API
   */
  createSession() {
    return this.userIndex.request(createSessionMutation, {
      portalUrl: this.portalUrl
    });
  }

  /**
   * Get the current user tied to the token used to instantiate the UserService
   */
  getSelf(): Promise<any> {
    return this.userIndex.request(userSelfQuery);
  }

  /**
   * Search for users based on a given filter; sort and page results based on the properties specified
   * in the options hash
   *
   * @param filter {ISearchUsersFilter} - filter object describing which users should be returned
   * @param options {IUserSearchOptions} - options hash optionally containing IUserPagingOptions for paging
   *                                       or an array of ISortingOptions for sorting
   * @returns ICursorSearchResults<IHubUser> that contains the specified page of results along with a next function
   *          that returns the next page of results or null if there are no more results
   */
  async searchUsers(
    filter: ISearchUsersFilter,
    options: IUserSearchOptions = {}
  ): Promise<ICursorSearchResults<IHubUser>> {
    const pagingOptions: IUserPagingOptions = options.pagingOptions || {
      first: 10
    };
    const sortingOptions: ISortingOption[] = options.sortingOptions || [
      {
        field: UserSortableField.USERNAME,
        sortDirection: SortDirection.ASC
      }
    ];

    return this.userIndex
      .request(userSearchQuery, {
        filter,
        pagingOptions,
        sortingOptions
      })
      .then(response => {
        const { totalCount, edges } = getProp(response, "searchUsers");
        const hasNext = getProp(response, "searchUsers.pageInfo.hasNextPage");

        return {
          total: totalCount,
          // pull user object out so that an array of users is returned
          results: edges.map((e: IEdge) => e.node),
          hasNext,
          next: () =>
            hasNext
              ? this.searchUsers(filter, {
                  pagingOptions: {
                    first: pagingOptions.first,
                    after: response.searchUsers.pageInfo.endCursor
                  },
                  sortingOptions
                })
              : null
        };
      });
  }
}
