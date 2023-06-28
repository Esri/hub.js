import { IUser } from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  enrichUserSearchResult,
  IHubRequestOptions,
} from "../../src";
import * as FetchEnrichments from "../../src/users/_internal/enrichments";
import { MOCK_AUTH } from "../mocks/mock-auth";

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
  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchUserEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          org: { name: "Fake Org" },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
        authentication: MOCK_AUTH,
      };
    });

    it("converts user to search result", async () => {
      const chk = await enrichUserSearchResult(
        cloneObject(TEST_USER),
        [],
        hubRo
      );
      expect(enrichmentSpy.calls.count()).toBe(
        1,
        "should fetch default enrichment"
      );

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
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [user, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(user).toEqual(TEST_USER);
      expect(enrichments).toEqual(["org"]);
      expect(ro).toBe(hubRo);
      expect(chk.orgName).toBe("Fake Org");
    });
  });
});
