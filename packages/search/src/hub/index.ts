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

export enum SortableField {
  USERNAME = "USERNAME",
  LAST_HUB_SESSION = "LAST_HUB_SESSION"
}

export enum SortDirection {
  ASC = "ASC",
  DESC = "DESC"
}

export interface ISortingOption {
  field?: SortableField,
  sortDirection?: SortDirection
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

export interface ICursorSearchResults<T> extends Iterator<() => Promise<ICursorSearchResults<T>>> {
  total: number;
  results: T[];
}

export class HubService {
  api: GraphQLClient;

  static create(userSession: UserSession): HubService {
    return new HubService(userSession);
  }

  constructor(private userSession: UserSession) {
    this.api = new GraphQLClient('https://afbc9443d4ebd4830afdc4793a3c191d-857540221.us-east-2.elb.amazonaws.com/graphql', {
      headers: {
        authorization: `Bearer ${userSession.token}`,
      },
      fetch: (arg: any, more: any) => fetch(arg, {
        agent: new https.Agent({
          rejectUnauthorized: false
        }),
        ...more
      } as any)
    })
  }

  async getSelf(): Promise<User> {
    return this.api.request(SELF_RESPONSE_SCHEMA);
  }

  async searchUsers(
    filter: SearchUsersFilter,
    pagingOptions: PagingOptions = { first: 10 },
    sortingOptions: ISortingOption[] = [{ field: SortableField.USERNAME, sortDirection: SortDirection.ASC }]
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

    const response = await this.api.request(searchQuery, {
      filter,
      pagingOptions,
      sortingOptions
    });

    // console.log(JSON.stringify(response.searchUsers))

    const {
      totalCount,
      edges
    } = getProp(response, 'searchUsers');

    const result: ICursorSearchResults<User> = {
      total: totalCount,
      results: edges.map((e: any) => e.node), // pull user object out; will clean up types later
      next: () => ({
        done: true,
        value: undefined
      })
    }

    if (getProp(response, 'searchUsers.pageInfo.hasNextPage')) {
      result.next = () => ({
        done: false,
        value: () => this.searchUsers(filter, {
          first: pagingOptions.first,
          after: response.searchUsers.pageInfo.endCursor
        } as PagingOptions)
      })
    }

    return result;
  }
}

