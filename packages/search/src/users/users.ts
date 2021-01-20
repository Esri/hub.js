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

interface IEdge {
  node: IHubUser;
  cursor?: base64;
}

export interface IHubUser extends IUser {
  followedInitiatives?: any[];
  groups?: any[];
  teams?: any[];
  registeredEvents?: any[];
  lastHubSession?: number;
  visitsLast30Days?: number;
  visitsLast60Days?: number;
}

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

export class UserService {
  constructor(private portalUrl: string, private userIndex: GraphQLClient) {}

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

  createSession() {
    return this.userIndex.request(createSessionMutation, {
      portalUrl: this.portalUrl
    });
  }

  getSelf(): Promise<any> {
    return this.userIndex.request(userSelfQuery);
  }

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
