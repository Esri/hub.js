/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getProp } from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

import { GraphQLClient } from "graphql-request";
import { GraphQLError } from "./errors";
import {
  createSessionMutation,
  userSelfQuery,
  userSearchQuery
} from "./queries";

import { IUser } from "@esri/arcgis-rest-types";
import {
  base64,
  iso8601Date,
  IDateRange,
  SortDirection,
  ICursorSearchResults
} from "../types";

import * as https from "https"; // TODO remove

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
  lastHubSession?: iso8601Date;
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
  api: GraphQLClient;

  constructor(
    private portalUrl: string,
    userIndexApi: string,
    authentication: UserSession
  ) {
    this.api = new GraphQLClient(userIndexApi, {
      headers: {
        authorization: `Bearer ${authentication.token}`
      },
      // TODO remove
      fetch: (arg: any, more: any) =>
        fetch(arg, {
          agent: new https.Agent({
            rejectUnauthorized: false
          }),
          ...more
        } as any)
    });
  }

  static create(
    portal: string,
    userIndexApi: string,
    authentication: UserSession
  ): UserService {
    return new UserService(portal, userIndexApi, authentication);
  }

  async createSession() {
    try {
      // await here so that any errors are caught
      return await this.api.request(createSessionMutation, {
        portalUrl: this.portalUrl
      });
    } catch (e) {
      throw new GraphQLError(e.response.errors);
    }
  }

  async getSelf(): Promise<any> {
    try {
      // await here so that any errors are caught
      return await this.api.request(userSelfQuery);
    } catch (e) {
      throw new GraphQLError(e.response.errors);
    }
  }

  async searchUsers(
    filter: ISearchUsersFilter,
    options: IUserSearchOptions
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

    try {
      const response = await this.api.request(userSearchQuery, {
        filter,
        pagingOptions,
        sortingOptions
      });

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
    } catch (e) {
      throw getProp(e, "response.errors")
        ? new GraphQLError(e.response.errors)
        : e;
    }
  }
}
