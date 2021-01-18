/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import {
  UserService,
  ISearchUsersFilter,
  UserSortableField,
  SortDirection,
  GraphQLError
} from "../../src";
import {
  createSessionMutation,
  userSelfQuery,
  userSearchQuery
} from "../../src/users/queries";
import { GraphQLClient } from "graphql-request";

describe("user service", () => {
  const portalUrl = "http://arcgis.com/sharing/rest";

  it("static constructor", () => {
    const session: UserSession = new UserSession({
      token: "token"
    });
    const service = UserService.create(
      portalUrl,
      "https://foo.com/graphql",
      session
    );
    expect(service).toBeTruthy();
  });

  it("creates a session", async () => {
    const rawResponse = {
      createSession: {
        username: "robadmin",
        url: portalUrl,
        ipAddress: "10.0.1.163"
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(createSessionMutation);
        expect(variables).toEqual({
          portalUrl
        });
        return rawResponse;
      }
    );

    const service = new UserService(portalUrl, api);
    const res = await service.createSession();
    expect(res).toEqual(rawResponse);
    expect(spy.calls.count()).toEqual(1);
  });

  it("handles error when creating session", async () => {
    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(() => {
      throw {
        response: {
          errors: [
            {
              message: "oops"
            }
          ]
        }
      };
    });

    const service = new UserService(portalUrl, api);
    try {
      await service.createSession();
      fail();
    } catch (e) {
      expect(e instanceof GraphQLError).toBeTruthy();
      expect(spy.calls.count()).toEqual(1);
    }
  });

  it("gets self", async () => {
    const rawResponse = {
      self: {
        username: "robadmin",
        lastHubSession: 1610938045879,
        groups: ["3ef"]
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(userSelfQuery);
        expect(variables).toBeUndefined();
        return rawResponse;
      }
    );

    const service = new UserService(portalUrl, api);
    const res = await service.getSelf();
    expect(res).toEqual(rawResponse);
    expect(spy.calls.count()).toEqual(1);
  });

  it("handles error when getting self", async () => {
    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(() => {
      throw {
        response: {
          errors: [
            {
              message: "oops"
            }
          ]
        }
      };
    });

    const service = new UserService(portalUrl, api);
    try {
      await service.getSelf();
      fail();
    } catch (e) {
      expect(e instanceof GraphQLError).toBeTruthy();
      expect(spy.calls.count()).toEqual(1);
    }
  });

  it("searches for users", async () => {
    const rawResponse = {
      searchUsers: {
        totalCount: 2,
        edges: [
          {
            node: {
              username: "chasegruberdev",
              lastHubSession: 1607758563256,
              groups: ["3ef"]
            }
          },
          {
            node: {
              username: "cory_pac",
              lastHubSession: 1607818445225,
              groups: []
            }
          }
        ],
        pageInfo: {
          endCursor: "anVsaWFuYV9wYQ==",
          hasNextPage: false
        }
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const service = new UserService(portalUrl, api);

    const filter: ISearchUsersFilter = {
      lastHubSession: {
        from: "2020-10-12T12:00:00.000Z",
        to: "2020-12-31T18:47:59.999Z"
      }
    };
    const defaultPagingOptions = { first: 10 };
    const defaultSortingOptions = [
      {
        field: UserSortableField.USERNAME,
        sortDirection: SortDirection.ASC
      }
    ];

    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(userSearchQuery);
        expect(variables).toEqual({
          filter,
          pagingOptions: defaultPagingOptions,
          sortingOptions: defaultSortingOptions
        });
        return rawResponse;
      }
    );

    const { next, ...props } = await service.searchUsers(filter);
    expect(typeof next).toEqual("function");
    expect(props).toEqual({
      total: 2,
      results: [
        {
          username: "chasegruberdev",
          lastHubSession: 1607758563256,
          groups: ["3ef"]
        },
        {
          username: "cory_pac",
          lastHubSession: 1607818445225,
          groups: []
        }
      ],
      hasNext: false
    });
    expect(spy.calls.count()).toEqual(1);
  });

  it("searches for users with opts", async () => {
    const rawResponse = {
      searchUsers: {
        totalCount: 1,
        edges: [
          {
            node: {
              username: "chasegruberdev",
              lastHubSession: 1607758563256,
              groups: ["3ef"]
            }
          }
        ],
        pageInfo: {
          endCursor: "bnVsaWFuYV1wYQ==",
          hasNextPage: false
        }
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const service = new UserService(portalUrl, api);

    const filter: ISearchUsersFilter = {
      lastHubSession: {
        from: "2020-10-12T12:00:00.000Z",
        to: "2020-12-31T18:47:59.999Z"
      },
      team: "3ef"
    };
    const pagingOptions = { first: 1 };
    const sortingOptions = [
      {
        field: UserSortableField.LAST_HUB_SESSION,
        sortDirection: SortDirection.DESC
      }
    ];

    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(userSearchQuery);
        expect(variables).toEqual({
          filter,
          pagingOptions,
          sortingOptions
        });
        return rawResponse;
      }
    );

    const { next, ...props } = await service.searchUsers(filter, {
      pagingOptions,
      sortingOptions
    });
    expect(typeof next).toEqual("function");
    expect(props).toEqual({
      total: 1,
      results: [
        {
          username: "chasegruberdev",
          lastHubSession: 1607758563256,
          groups: ["3ef"]
        }
      ],
      hasNext: false
    });
    expect(spy.calls.count()).toEqual(1);
  });

  it("searches for multiple pages of users", async () => {
    const firstRawResponse = {
      searchUsers: {
        totalCount: 2,
        edges: [
          {
            node: {
              username: "chasegruberdev",
              lastHubSession: 1607758563256,
              groups: ["3ef"]
            }
          }
        ],
        pageInfo: {
          endCursor: "first cursor",
          hasNextPage: true
        }
      }
    };

    const secondRawResponse = {
      searchUsers: {
        totalCount: 2,
        edges: [
          {
            node: {
              username: "cory_pac",
              lastHubSession: 1607818445225,
              groups: ["4ef"]
            }
          }
        ],
        pageInfo: {
          endCursor: "second cursor",
          hasNextPage: false
        }
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const service = new UserService(portalUrl, api);

    const filter: ISearchUsersFilter = {
      lastHubSession: {
        from: "2020-10-12T12:00:00.000Z",
        to: "2020-12-31T18:47:59.999Z"
      }
    };

    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        if (variables.pagingOptions.after === "first cursor") {
          return secondRawResponse;
        }
        return firstRawResponse;
      }
    );

    const { next, ...props } = await service.searchUsers(filter);
    expect(props).toEqual({
      total: 2,
      results: [
        {
          username: "chasegruberdev",
          lastHubSession: 1607758563256,
          groups: ["3ef"]
        }
      ],
      hasNext: true
    });

    const { next: nextNext, ...nextProps } = await next();
    expect(await nextNext()).toBeNull();
    expect(nextProps).toEqual({
      total: 2,
      results: [
        {
          username: "cory_pac",
          lastHubSession: 1607818445225,
          groups: ["4ef"]
        }
      ],
      hasNext: false
    });

    expect(spy.calls.count()).toEqual(2);
  });

  it("handles error when searching for users", async () => {
    const api: GraphQLClient = new GraphQLClient("foo");
    const service = new UserService(portalUrl, api);

    const filter: ISearchUsersFilter = {
      lastHubSession: {
        from: "2020-10-12T12:00:00.000Z",
        to: "2020-12-31T18:47:59.999Z"
      }
    };

    const spy = spyOn(api, "request").and.callFake(() => {
      throw {
        response: {
          errors: [
            {
              message: "error"
            }
          ]
        }
      };
    });

    try {
      await service.searchUsers(filter);
      fail();
    } catch (e) {
      expect(e instanceof GraphQLError).toBeTruthy();
      expect(spy.calls.count()).toEqual(1);
    }
  });
});
