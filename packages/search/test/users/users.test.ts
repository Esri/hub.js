/* Copyright (c) 2021 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { UserSession } from "@esri/arcgis-rest-auth";
import {
  UserService,
  ISearchUsersFilter,
  UserSortableField,
  SortDirection
} from "../../src";
import {
  createSessionMutation,
  userSelfQuery,
  userSearchQuery
} from "../../src/users/queries";
import { GraphQLClient } from "graphql-request";

const userMock1 = {
  username: "robadmin",
  lastHubSession: 1610938045879,
  firstName: "Robert",
  lastName: "Steilberg",
  visitsLast30Days: 20,
  visitsLast60Days: 30,
  groups: [{ id: 1, memberType: "admin", title: "foo" }],
  followedInitiatives: [{ id: 2, memberType: "owner", title: "bar" }],
  registeredEvents: [{ id: 3, memberType: "member", title: "baz" }],
  teams: [{ id: 4, memberType: "nothing", title: "snap" }]
};

const userMock2 = {
  username: "cpgruber",
  lastHubSession: 1610391035879,
  firstName: "Chase",
  lastName: "Gruber",
  visitsLast30Days: 30,
  visitsLast60Days: 50,
  groups: [{ id: 241, memberType: "admin", title: "foo" }],
  followedInitiatives: [{ id: 12, memberType: "owner", title: "ok" }],
  registeredEvents: [{ id: 33, memberType: "member", title: "baz" }],
  teams: [{ id: 43, memberType: "nothing", title: "ok" }]
};

const userMock3 = {
  username: "cory_pac",
  lastHubSession: 1632199045879,
  firstName: "Cory",
  lastName: "In the House",
  visitsLast30Days: 26,
  visitsLast60Days: 70,
  groups: [{ id: 1, memberType: "admin", title: "foo" }],
  followedInitiatives: [{ id: 2, memberType: "owner", title: "bar" }],
  registeredEvents: [{ id: 3, memberType: "owner", title: "baz" }],
  teams: [{ id: 5, memberType: "member", title: "another" }]
};

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
        ipAddress: "0.0.0.0"
      }
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(createSessionMutation);
        expect(variables).toEqual({
          portalUrl
        });
        return Promise.resolve(rawResponse);
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
      throw new Error("oops");
    });

    const service = new UserService(portalUrl, api);
    try {
      await service.createSession();
      fail();
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.message).toEqual("oops");
      expect(spy.calls.count()).toEqual(1);
    }
  });

  it("gets self", async () => {
    const rawResponse = {
      self: userMock1
    };

    const api: GraphQLClient = new GraphQLClient("foo");
    const spy = spyOn(api, "request").and.callFake(
      (query: any, variables: any) => {
        expect(query).toEqual(userSelfQuery);
        expect(variables).toBeUndefined();
        return Promise.resolve(rawResponse);
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
      throw new Error("oops");
    });

    const service = new UserService(portalUrl, api);
    try {
      await service.getSelf();
      fail();
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.message).toEqual("oops");
      expect(spy.calls.count()).toEqual(1);
    }
  });

  it("searches for users", async () => {
    const rawResponse = {
      searchUsers: {
        totalCount: 2,
        edges: [
          {
            node: userMock1
          },
          {
            node: userMock2
          },
          {
            node: userMock3
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
        return Promise.resolve(rawResponse);
      }
    );

    const { next, ...props } = await service.searchUsers(filter);
    expect(typeof next).toEqual("function");
    expect(props).toEqual({
      total: 2,
      results: [userMock1, userMock2, userMock3],
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
            node: userMock1
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
        return Promise.resolve(rawResponse);
      }
    );

    const { next, ...props } = await service.searchUsers(filter, {
      pagingOptions,
      sortingOptions
    });
    expect(typeof next).toEqual("function");
    expect(props).toEqual({
      total: 1,
      results: [userMock1],
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
            node: userMock1
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
            node: userMock2
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
          return Promise.resolve(secondRawResponse);
        }
        return Promise.resolve(firstRawResponse);
      }
    );

    const { next, ...props } = await service.searchUsers(filter);
    expect(props).toEqual({
      total: 2,
      results: [userMock1],
      hasNext: true
    });

    const { next: nextNext, ...nextProps } = await next();
    expect(await nextNext()).toBeNull();
    expect(nextProps).toEqual({
      total: 2,
      results: [userMock2],
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
      throw new Error("oops");
    });

    try {
      await service.searchUsers(filter);
      fail();
    } catch (e) {
      expect(e instanceof Error).toBeTruthy();
      expect(e.message).toEqual("oops");
      expect(spy.calls.count()).toEqual(1);
    }
  });
});
