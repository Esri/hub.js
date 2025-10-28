import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { IUser } from "@esri/arcgis-rest-portal";
import * as restPortal from "@esri/arcgis-rest-portal";
import * as FetchEnrichments from "../../src/users/_internal/enrichments";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IHubRequestOptions } from "../../src/hub-types";
import { enrichUserSearchResult, fetchHubUser } from "../../src/users/HubUsers";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { cloneObject } from "../../src/util";

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getUser: vi.fn(),
}));

const TEST_USER: IUser & Record<string, any> = {
  username: "juliana_p",
  fullName: "Juliana Mascasa",

  firstName: "Juliana",
  lastName: "Mascasa",
  preferredView: null,
  description:
    "Artist in residence; Leader at Large; Zen Master; Geospatial Coordinatrix; Mapper of Projections;",
  email: "jschneider@esri.com",

  idpUsername: null,
  favGroupId: null,
  lastLogin: 1646156018000,
  mfaEnabled: false,

  storageUsage: 0,
  storageQuota: 0,
  orgId: "ATCRG96GAegBiycU",
  level: "2",

  disabled: false,
  tags: [],
  culture: null,

  region: null,
  units: "english",
  thumbnail: "blob.png",
  access: "org",
  created: 1558412553000,
  modified: 1654549320000,
  provider: "arcgis",
  groups: [],
} as unknown as IUser;

describe("HubUsers Module:", () => {
  describe("fetchHubUser", () => {
    it("should fetch a user", async () => {
      const spy = vi
        .spyOn(restPortal as any, "getUser")
        .mockImplementation(() => {
          return Promise.resolve(TEST_USER);
        });
      const ro = {} as IHubRequestOptions;
      const username = TEST_USER.username;
      await fetchHubUser(username, {
        requestOptions: ro,
      } as unknown as IArcGISContext);
      expect(spy).toHaveBeenCalledWith({ ...ro, username });
    });
    it("should use context.currentUser when username is self", async () => {
      const localUser = { ...TEST_USER, username: "me_self" } as IUser &
        Record<string, any>;
      const spy = vi
        .spyOn(restPortal as any, "getUser")
        .mockImplementation(() => Promise.resolve(TEST_USER));

      const ctx = { currentUser: localUser } as unknown as IArcGISContext;
      const res = await fetchHubUser("self", ctx);
      // should not have called getUser because username === 'self' uses context.currentUser
      expect(spy).toHaveBeenCalledTimes(0);
      expect(res.id).toEqual(localUser.username);
    });
  });
  describe("enrichments:", () => {
    let enrichmentSpy: any;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments as any, "fetchUserEnrichments")
        .mockImplementation(() => {
          return Promise.resolve({
            org: { name: "Fake Org" },
          });
        });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
        authentication: MOCK_AUTH,
      };
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("converts user to search result", async () => {
      const chk = await enrichUserSearchResult(
        cloneObject(TEST_USER),
        [],
        hubRo
      );
      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

      const USR = cloneObject(TEST_USER);
      expect(chk.access).toEqual(USR.access);
      expect(chk.id).toEqual(USR.username);
      expect(chk.type).toEqual("User");
      expect(chk.name).toEqual(USR.fullName);
      expect(chk.owner).toEqual(USR.username);
      expect(chk.summary).toEqual(USR.description);
      expect(chk.createdDate).toEqual(new Date(USR.created));
      expect(chk.createdDateSource).toEqual("user.created");
      expect(chk.updatedDate).toEqual(new Date(USR.modified));
      expect(chk.updatedDateSource).toEqual("user.modified");
      expect(chk.family).toEqual("people");

      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/user.html?user=${USR.username}`
      );
      expect(chk.links.siteRelative).toEqual(`/people/${USR.username}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/community/users/${USR.username}/info/${USR.thumbnail}?token=fake-token`
      );
    });

    it("handles missing thumbnail gracefully", async () => {
      const noThumb = cloneObject(TEST_USER) as any;
      delete noThumb.thumbnail;
      const ro = {
        portal: "https://some-server.com/gis/sharing/rest",
        authentication: MOCK_AUTH,
      } as IHubRequestOptions;
      const chk = await enrichUserSearchResult(noThumb, [], ro);
      expect(chk.links.thumbnail).toBeNull();
    });

    it("sets siteRelative to user home url when isPortal is true", async () => {
      const ro = {
        portal: "https://some-server.com/gis/sharing/rest",
        authentication: MOCK_AUTH,
        isPortal: true,
      };
      const chk = await enrichUserSearchResult(cloneObject(TEST_USER), [], ro);
      expect(chk.links.siteRelative).toEqual(
        `https://some-server.com/gis/home/user.html?user=${TEST_USER.username}`
      );
    });

    it("converts user to search result and fetches enrichments", async () => {
      const chk = await enrichUserSearchResult(
        cloneObject(TEST_USER),
        ["org.name as OrgName"],
        hubRo
      );
      expect(enrichmentSpy).toHaveBeenCalledTimes(1);

      const USR = cloneObject(TEST_USER);
      expect(chk.access).toEqual(USR.access);
      expect(chk.id).toEqual(USR.username);
      expect(chk.type).toEqual("User");
      expect(chk.name).toEqual(USR.fullName);
      expect(chk.owner).toEqual(USR.username);
      expect(chk.summary).toEqual(USR.description);
      expect(chk.createdDate).toEqual(new Date(USR.created));
      expect(chk.createdDateSource).toEqual("user.created");
      expect(chk.updatedDate).toEqual(new Date(USR.modified));
      expect(chk.updatedDateSource).toEqual("user.modified");
      expect(chk.family).toEqual("people");

      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/user.html?user=${USR.username}`
      );
      expect(chk.links.siteRelative).toEqual(`/people/${USR.username}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/community/users/${USR.username}/info/${USR.thumbnail}?token=fake-token`
      );
    });
    it("handles memberType", async () => {
      const USR = cloneObject(TEST_USER);
      USR.memberType = "admin";
      const chk = await enrichUserSearchResult(USR, [], hubRo);
      expect(chk.memberType).toEqual("admin");
    });
    it("handles enrichments", async () => {
      const chk = await enrichUserSearchResult(
        cloneObject(TEST_USER),
        ["org.name AS orgName"],
        hubRo
      );
      expect(enrichmentSpy).toHaveBeenCalledTimes(1);
      const call = enrichmentSpy.mock.calls[0];
      const [user, enrichments, ro] = call;
      expect(user).toEqual(TEST_USER);
      expect(enrichments).toEqual(["org"]);
      expect(ro).toBe(hubRo);
      expect(chk.orgName).toBe("Fake Org");
    });
    it("handles private user with no description", async () => {
      const USR = cloneObject(TEST_USER);
      delete USR.description;
      const chk = await enrichUserSearchResult(USR, [], hubRo);
      expect(chk.summary).toEqual(undefined);
    });
  });
});
