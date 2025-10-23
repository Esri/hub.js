// If we need to spy on @esri/arcgis-rest-portal named exports in ESM,
// register a module mock here that merges the real module and allows spies.
vi.mock("@esri/arcgis-rest-portal", async () => ({
  ...(await vi.importActual("@esri/arcgis-rest-portal")),
}));

import { portalSearchGroupMembers } from "../../../src/search/_internal/portalSearchGroupMembers";
import * as Portal from "@esri/arcgis-rest-portal";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as hubUsersModule from "../../../src/users/HubUsers";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { cloneObject } from "../../../src/util";
import { vi } from "vitest";

describe("portalSearchGroupMembers:", () => {
  afterEach(() => vi.restoreAllMocks());

  describe("throws if not passed group:", () => {
    let qry: IQuery;
    beforeEach(() => {
      qry = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                name: "steve",
              },
            ],
          },
        ],
      };
    });
    it("no properties passed", async () => {
      const opts: IHubSearchOptions = {};
      try {
        await portalSearchGroupMembers(qry, opts);
      } catch (err) {
        expect((err as Error).message).toEqual(
          "Group Id required. Please pass as a predicate in the query."
        );
      }
    });
    it("passing query.properties", async () => {
      const opts: IHubSearchOptions = {};
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { any: ["3ef"] } });
      try {
        await portalSearchGroupMembers(qry, opts);
      } catch (err) {
        expect((err as Error).message).toEqual(
          "Group Id required. Please pass as a predicate in the query."
        );
      }
    });
  });
  describe("executes search:", () => {
    let qry: IQuery;
    beforeEach(() => {
      qry = {
        targetEntity: "groupMember",
        filters: [
          {
            predicates: [
              {
                name: "steve",
                remove: "property",
              },
              {
                memberType: "admin",
              },
            ],
          },
        ],
      };
    });
    it("simple search", async () => {
      const searchSpy = vi
        .spyOn(Portal, "searchGroupUsers")
        .mockImplementation(() =>
          Promise.resolve(cloneObject(GroupMembersResponse))
        );
      const userSpy = vi
        .spyOn(Portal, "getUser")
        .mockImplementation((options: any) => {
          const resp = cloneObject(SparseUser);
          resp.username = options.username;
          return Promise.resolve(resp);
        });
      // NOTE: enrichUserSearchResult is tested elsewhere so we don't assert on the results here
      // Provide a deterministic, shaped result so other assertions are stable.
      const enrichUserSearchResultSpy = vi
        .spyOn(hubUsersModule, "enrichUserSearchResult")
        .mockImplementation(
          async (u: any, _include: any, _requestOptions: any) => {
            return Promise.resolve({
              owner: u.username,
              orgId: u.orgId || null,
              memberType: u.memberType || "member",
              family: "people",
              rawResult: u,
              links: { self: "", thumbnail: null, siteRelative: "" },
            } as any);
          }
        );
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: "3ef" });
      const response = await portalSearchGroupMembers(cloneQry, opts);
      // validate spy calls
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(userSpy).toHaveBeenCalledTimes(2);
      expect(enrichUserSearchResultSpy).toHaveBeenCalledTimes(2);
      // validate call args
      const groupId = (searchSpy as any).mock.calls[0][0];
      expect(groupId).toBe("3ef");
      const callOpts = (searchSpy as any).mock.calls[0][1];
      expect(callOpts.memberType).toBe("admin");
      expect(callOpts.name).toBe("steve");
      expect(callOpts.remove).not.toBeDefined();
      expect(response.results.length).toBe(2);
      const user1 = response.results[0];
      expect(user1.owner).toBe("e2e_pre_hub_c_member");
      expect(user1.orgId).toBeNull();
      expect(user1.orgName).not.toBeDefined();
      expect(user1.memberType).toBe("admin");
      expect(user1.family).toBe("people");
    });
    it("accepts IMatchOptions: any", async () => {
      const searchSpy = vi
        .spyOn(Portal, "searchGroupUsers")
        .mockImplementation(() =>
          Promise.resolve(cloneObject(GroupMembersResponse))
        );
      vi.spyOn(Portal, "getUser").mockImplementation((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      vi.spyOn(hubUsersModule, "enrichUserSearchResult").mockImplementation(
        async (u: any) => {
          return Promise.resolve({
            owner: u.username,
            orgId: u.orgId || null,
            memberType: u.memberType || "member",
            family: "people",
            rawResult: u,
            links: { self: "", thumbnail: null, siteRelative: "" },
          } as any);
        }
      );
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { any: ["3ef", "fff"] } });
      await portalSearchGroupMembers(cloneQry, opts);
      const groupId = (searchSpy as any).mock.calls[0][0];
      expect(groupId).toBe("3ef");
    });
    it("accepts IMatchOptions: all", async () => {
      const searchSpy = vi
        .spyOn(Portal, "searchGroupUsers")
        .mockImplementation(() =>
          Promise.resolve(cloneObject(GroupMembersResponse))
        );
      vi.spyOn(Portal, "getUser").mockImplementation((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      vi.spyOn(hubUsersModule, "enrichUserSearchResult").mockImplementation(
        async (u: any) => {
          return Promise.resolve({
            owner: u.username,
            orgId: u.orgId || null,
            memberType: u.memberType || "member",
            family: "people",
            rawResult: u,
            links: { self: "", thumbnail: null, siteRelative: "" },
          } as any);
        }
      );
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: { all: ["3ef", "00c"] } });
      await portalSearchGroupMembers(cloneQry, opts);
      const groupId = (searchSpy as any).mock.calls[0][0];
      expect(groupId).toBe("3ef");
    });
    it("maps term to name", async () => {
      const searchSpy = vi
        .spyOn(Portal, "searchGroupUsers")
        .mockImplementation(() =>
          Promise.resolve(cloneObject(GroupMembersResponse))
        );
      vi.spyOn(Portal, "getUser").mockImplementation((options: any) => {
        const resp = cloneObject(SparseUser);
        resp.username = options.username;
        return Promise.resolve(resp);
      });
      vi.spyOn(hubUsersModule, "enrichUserSearchResult").mockImplementation(
        async (u: any) => {
          return Promise.resolve({
            owner: u.username,
            orgId: u.orgId || null,
            orgName: null,
            memberType: u.memberType || "member",
            family: "people",
            rawResult: u,
            links: { self: "", thumbnail: null, siteRelative: "" },
          } as any);
        }
      );
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: "3ef" });
      cloneQry.filters[0].predicates[0].term = "steve";
      delete cloneQry.filters[0].predicates[0].name;
      await portalSearchGroupMembers(cloneQry, opts);
      const groupId = (searchSpy as any).mock.calls[0][0];
      expect(groupId).toBe("3ef");
      const callOpts = (searchSpy as any).mock.calls[0][1];
      expect(callOpts.name).toBe("steve");
    });
    it("search without auth", async () => {
      const searchSpy = vi
        .spyOn(Portal, "searchGroupUsers")
        .mockImplementation(() =>
          Promise.resolve(cloneObject(SparseGroupMembersResponse))
        );
      const userSpy = vi
        .spyOn(Portal, "getUser")
        .mockImplementation((options: any) => {
          const resp = cloneObject(SparseUser);
          resp.username = options.username;
          return Promise.resolve(resp);
        });
      const enrichUserSearchResultSpy = vi
        .spyOn(hubUsersModule, "enrichUserSearchResult")
        .mockImplementation(async (u: any) => {
          return Promise.resolve({
            owner: u.username,
            orgId: u.orgId || null,
            memberType: u.memberType || "member",
            family: "people",
            rawResult: u,
            links: { self: "", thumbnail: null, siteRelative: "" },
          } as any);
        });
      const opts: IHubSearchOptions = {
        num: 2,
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };
      const cloneQry = cloneObject(qry);
      cloneQry.filters[0].predicates.push({ group: ["3ef"] });
      const response = await portalSearchGroupMembers(cloneQry, opts);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(userSpy).toHaveBeenCalledTimes(2);
      expect(enrichUserSearchResultSpy).toHaveBeenCalledTimes(2);
      const groupId = (searchSpy as any).mock.calls[0][0];
      expect(groupId).toBe("3ef");
      const callOpts = (searchSpy as any).mock.calls[0][1];
      expect(callOpts.memberType).toBe("admin");
      expect(callOpts.name).toBe("steve");
      expect(response.results.length).toBe(2);
      const user1 = response.results[0];
      expect(user1.owner).toBe("e2e_pre_hub_c_member");
      expect(user1.orgId).toBeNull();
      expect(user1.orgName).not.toBeDefined();
      expect(user1.memberType).toBe("admin");
      expect(user1.family).toBe("people");
    });
  });
});

const SparseUser = {
  username: "e2e_pre_hub_c_member",
  udn: null,
  id: "726f96ef603b4551a1fb76fa99f68364",
  fullName: "ArcGIS HubE2E",
  firstName: "ArcGIS",
  lastName: "HubE2E",
  description: null,
  tags: ["org:Q05waIVQNYv92Kgz", "hubRole:participant"],
  culture: "",
  cultureFormat: "",
  region: "US",
  units: "english",
  thumbnail: null,
  access: "public",
  created: 1569441945000,
  modified: 1569442018000,
  provider: "arcgis",
} as any;

const GroupMembersResponse = {
  total: 2,
  start: 1,
  num: 25,
  nextStart: -1,
  owner: {
    username: "e2e_pre_pub_admin",
    fullName: "e2e_pre_pub_admin qa-pre-hub",
  },
  users: [
    {
      username: "e2e_pre_hub_c_member",
      fullName: "ArcGIS HubE2E",
      memberType: "admin",
      thumbnail: "bozo.jpg",
      joined: 1575308050000,
      orgId: "Q05waIVQNYv92Kgz",
    },
    {
      username: "e2e_pre_pub_admin",
      fullName: "e2e_pre_pub_admin qa-pre-hub",
      memberType: "admin",
      thumbnail: "user.jpg",
      joined: 1575308011000,
      orgId: "T5cZDlfUaBpDnk6P",
    },
  ],
};

const SparseGroupMembersResponse = {
  total: 2,
  start: 1,
  num: 25,
  nextStart: -1,
  owner: {
    username: "e2e_pre_pub_admin",
  },
  users: [
    {
      username: "e2e_pre_hub_c_member",
      fullName: "ArcGIS HubE2E",
      memberType: "admin",
      thumbnail: "user.jpg",
      joined: 1575308050000,
    },
    {
      username: "e2e_pre_pub_admin",
      joined: 1575308011000,
    },
  ],
} as any;
