import { UserSession } from "@esri/arcgis-rest-auth";
import { getProp } from "@esri/hub-common";
import { GraphQLClient, gql } from 'graphql-request';
import * as https from "https";

const SEARCH_RESPONSE_SCHEMA = gql`{
  totalCount
  edges {
    node {
      username
      lastHubSession
      groups {
        id
        memberType
        title
      }
    }
    cursor
  }
  pageInfo {
    endCursor
    hasNextPage
  }
}`;

const SELF_RESPONSE_SCHEMA = gql`
  {
    self {
      username
      lastHubSession
    }
  }
`;

export enum UserSortableField {
  USERNAME = "USERNAME",
  LAST_HUB_SESSION = "LAST_HUB_SESSION"
}

export enum UserSortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export interface ISortingOption {
  field?: UserSortableField,
  sortDirection?: UserSortDirection
}


type iso8601Date = string;

export interface User {
  username: string
  fullName?: string
  firstName?: string
  lastName?: string
  email?: string
  description?: string
  lastLogin?: iso8601Date
  orgId?: string
  followedInitiatives?: any[]
  groups?: any[]
  teams?: any[]
  registeredEvents?: any[]
  lastHubSession?: iso8601Date
  visitsLast30Days?: number
  visitsLast60Days?: number
}

export interface DateRange {
  from: iso8601Date;
  to: iso8601Date;
}

export interface SearchUsersFilter {
  lastHubSession?: DateRange;
  group?: string,
  team?: string,
  followedInitiative?: string,
  registeredEvent?: string
}

export interface PagingOptions {
  first: number,
  after?: string
}

export interface ICursorSearchResults<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: () => Promise<ICursorSearchResults<T>>;
}

export class HubService {
  api: GraphQLClient;
  portalUrl: string;

  static create(portal: string, userIndexApi: string, authentication: UserSession): HubService {
    return new HubService(portal, userIndexApi, authentication);
  }

  constructor(private portal: string, private userIndexApi: string, private authentication: UserSession) {
    this.portalUrl = portal;
    this.api = new GraphQLClient(userIndexApi, {
      headers: {
        authorization: `Bearer ${authentication.token}`,
      },
      fetch: (arg: any, more: any) => fetch(arg, {
        agent: new https.Agent({
          rejectUnauthorized: false
        }),
        ...more
      } as any)
    })
  }

  async createSession() {
    const createMutation = gql`
      mutation ($portalUrl: String!) {
        createSession(
          createSessionInput: {
            url: $portalUrl,
          }
        ) {
          username
          url
          ipAddress
        }
      }
    `;
    try {
      return await this.api.request(createMutation, {
        portalUrl: this.portalUrl
      });
    } catch (e) {
      throw new Error(e.response.errors[0].message)
    }
  }

  async getSelf(): Promise<any> {
    try {
      return await this.api.request(SELF_RESPONSE_SCHEMA);
    } catch (e) {
      throw new Error(e.response.errors[0].message)
    }
  }

  async searchUsers(
    filter: SearchUsersFilter,
    pagingOptions: PagingOptions = { first: 10 },
    sortingOptions: ISortingOption[] = [{ field: UserSortableField.USERNAME, sortDirection: UserSortDirection.ASC }]
  ): Promise<ICursorSearchResults<User>> {
    const searchQuery = gql`
      query ($filter: SearchUsersFilter, $pagingOptions: PagingOptions, $sortingOptions: [SortingOption!]) {
        searchUsers (
          filter: $filter,
          pagingOptions: $pagingOptions,
          sortingOptions: $sortingOptions,
        ) ${SEARCH_RESPONSE_SCHEMA}
      }
    `;

    try {
      const response = await this.api.request(searchQuery, {
        filter,
        pagingOptions,
        sortingOptions
      });

      const {
        totalCount,
        edges
      } = getProp(response, 'searchUsers');
      const hasNext = getProp(response, 'searchUsers.pageInfo.hasNextPage');

      return {
        total: totalCount,
        results: edges.map((e: any) => e.node), // pull user object out; will clean up types later
        hasNext,
        next: () => hasNext ? this.searchUsers(filter, {
          first: pagingOptions.first,
          after: response.searchUsers.pageInfo.endCursor
        } as PagingOptions) : null
      }

    } catch (e) {
      throw new Error(e.response.errors[0].message)
    }
  }
}

