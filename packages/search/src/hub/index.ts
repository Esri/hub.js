import { UserSession } from "@esri/arcgis-rest-auth";
import { getProp, ICursorSearchResults } from "@esri/hub-common";
import { IUser, IGroup } from "@esri/arcgis-rest-types";
// import gql from "graphql-tag";
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { GraphQLClient, gql } from 'graphql-request'

type iso8601Date = string;

export interface DateRange {
  from: iso8601Date;
  to: iso8601Date;
}

export interface PagingOptions {
  first: number;
  after: string;
}

export interface UserFilter {
  lastHubSession?: DateRange;
  group?: string,
  team?: string,
  followedInitiative?: string,
  registeredEvent?: string
  pagingOptions?: PagingOptions
}

export class HubService {
  api: GraphQLClient;
  // api: Client;

  static create(userSession: UserSession): HubService {
    return new HubService(userSession);
  }

  constructor(private userSession: UserSession) {
    this.api = new GraphQLClient('http://localhost:3000/graphql', {
      headers: {
        authorization: `Bearer ${userSession.token}`,
      },
    })
    // this.api = createClient({
    //   url: 'http://localhost:3000/graphql',
    //   fetchOptions: () => {
    //     return {
    //       headers: { authorization: `Bearer ${userSession.token}` },
    //     };
    //   },
    // })
  }

  async getSelf(): Promise<any> {
    const selfQuery = gql`
        {
            self {
                username
                lastHubSession
            }
        }
    `;
    const res = await this.api.request(selfQuery);
    return res;
  }

  async searchUsers(filter: UserFilter): Promise<ICursorSearchResults<any>> {

    const searchQuery = gql`
        query ($filter: SearchUsersFilter!) {
            searchUsers (
                filter: $filter
            ) {
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
            }
        }
      `;

//     const searchQuery = gql`
//         {
//             searchUsers (
//                 filter:{
//                     lastHubSession: {
//                         from: "${filter.lastHubSession.from}",
//                         to: "${filter.lastHubSession.to}"
//                     }
// #                    team: "1c99b7f29bb74e1bbecb82ea4409c797"
//                 }
//             ) {
//                 totalCount
//                 edges {
//                     node {
//                         username
//                         lastHubSession
//                         groups {
//                             id
//                             memberType
//                             title
//                         }
//                     }
//                     cursor
//                 }
//                 pageInfo {
//                     endCursor
//                     hasNextPage
//                 }
//             }
//         }
//     `;
    const res = await this.api.request(searchQuery, {
      filter
    });

    const {
      totalCount,
      hasNextPage,
      edges,
      pageInfo: {
        first,
        endCursor
      }
    } = getProp(res, 'searchUsers');

    console.log(JSON.stringify(edges))

    const nextFilter: UserFilter = {
      ...filter,
      pagingOptions: {
        first,
        after: endCursor
      }
    }

    const result: ICursorSearchResults<any> = {
      total: totalCount,
      cursor: endCursor,
      hasNext: hasNextPage,
      results: edges,
      next: () => this.searchUsers(nextFilter)
    }

    return result;
  }
}
