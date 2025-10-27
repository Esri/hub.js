import { IUser } from "@esri/arcgis-rest-request";
import {
  getWellKnownCatalog,
  getWellknownCollection,
  getWellknownCollections,
  IGetWellKnownCatalogOptions,
  WellKnownCollection,
  dotifyString,
  getWellKnownCatalogs,
} from "../../src/search/wellKnownCatalog";
import { mockUser } from "../test-helpers/fake-user";
import { ArcGISContext } from "../../src/ArcGISContext";
import { describe, it, expect, beforeEach } from "vitest";
import { EntityType } from "../../src/search/types/IHubCatalog";

describe("WellKnownCatalog", () => {
  let options: IGetWellKnownCatalogOptions;
  beforeEach(() => {
    options = {
      user: mockUser,
      collectionNames: [],
      context: {
        currentUser: {
          id: "userid",
          orgId: "abc123",
          username: "some-username",
          groups: [
            { id: "abc", userMembership: { memberType: "admin" } },
            { id: "def", userMembership: { memberType: "member" } },
            { id: "ghi", userMembership: { memberType: "member" } },
            { id: "jkl", userMembership: { memberType: "admin" } },
            { id: "mno", userMembership: { memberType: "member" } },
          ],
        } as unknown as IUser,
        isCommunityOrg: false,
        communityOrgId: "def456",
        trustedOrgIds: ["abc123", "def456", "ghi789", "kjl012", "mno345"],
        trustedOrgs: [
          {
            from: { orgId: "abc123" },
            to: { orgId: "def456", name: "c-org name" },
          },
        ],
      } as ArcGISContext,
    };
  });
  describe("getWellKnownCatalogs", () => {
    let chk: any;
    it("throws an error if the requested Catalogs are not for the same targetEntity", () => {
      try {
        chk = getWellKnownCatalogs(
          "mockI18nScope",
          "item",
          ["myContent", "myGroups"],
          options.context,
          options
        );
      } catch (err) {
        const error = err as { message?: string };
        expect(error).toEqual(
          new Error(
            "Requested catalogs must be of the same targetEntity type: item"
          )
        );
      }
    });
    it("returns the requested catalogs", () => {
      chk = getWellKnownCatalogs(
        "mockI18nScope",
        "item",
        ["myContent", "organization"],
        options.context
      );
      expect(chk.length).toEqual(2);
      expect(chk[0].title).toEqual(
        "{{mockI18nScope.catalog.myContent:translate}}"
      );
      expect(chk[1].title).toEqual(
        "{{mockI18nScope.catalog.organization:translate}}"
      );
    });
    it("returns the requested catalogs with custom collection names", () => {
      chk = getWellKnownCatalogs(
        "mockI18nScope",
        "item",
        ["myContent", "organization"],
        options.context,
        { collectionNames: ["dataset"] }
      );
      expect(chk.length).toEqual(2);
      expect(chk[0].collections.length).toEqual(1);
    });
  });
  describe("getWellKnownCatalog", () => {
    it("returns the expected catalog for items", () => {
      let chk = getWellKnownCatalog(
        "mockI18nScope",
        "myContent",
        "item",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.item?.filters).toEqual([
        { predicates: [{ owner: "vader" }] },
      ]);
      expect(chk.collections?.map((c) => c.key)).toEqual([
        "appAndMap",
        "dataset",
        "document",
        "feedback",
        "site",
        "project",
      ]);
      chk = getWellKnownCatalog("mockI18nScope", "favorites", "item", options);
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.item?.filters).toEqual([
        { predicates: [{ group: "7654321" }] },
      ]);
      expect(chk.collections?.map((c) => c.key)).toEqual([
        "appAndMap",
        "dataset",
        "document",
        "feedback",
        "site",
        "project",
      ]);
    });
    describe("handles partners catalog for items", () => {
      it("passes for e-org w/ trusted orgs", () => {
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "partners",
          "item",
          options
        );
        expect(chk.scopes).toBeDefined();
        expect(chk.scopes?.item?.filters[0].predicates).toEqual([
          {
            orgid: ["ghi789", "kjl012", "mno345"],
            searchUserAccess: "includeTrustedOrgs",
          },
        ]);
        expect(chk.collections?.map((c) => c.key)).toEqual([
          "appAndMap",
          "dataset",
          "document",
          "feedback",
          "site",
          "project",
        ]);
      });
      it("passes for c-org w/ trusted orgs", () => {
        options = {
          user: mockUser,
          collectionNames: [],
          context: {
            currentUser: { orgId: "def456" },
            isCommunityOrg: true,
            communityOrgId: undefined,
            trustedOrgIds: ["abc123", "def456", "ghi789", "kjl012", "mno345"],
            trustedOrgs: [
              {
                from: { orgId: "def456" },
                to: { orgId: "abc123", name: "c-org name" },
              },
            ],
          } as unknown as ArcGISContext,
        };
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "partners",
          "item",
          options
        );
        expect(chk.scopes).toBeDefined();
        expect(chk.scopes?.item?.filters[0].predicates).toEqual([
          {
            orgid: ["ghi789", "kjl012", "mno345"],
            searchUserAccess: "includeTrustedOrgs",
          },
        ]);
        expect(chk.collections?.map((c) => c.key)).toEqual([
          "appAndMap",
          "dataset",
          "document",
          "feedback",
          "site",
          "project",
        ]);
      });
      it("returns undefined when there are no trusted org ids", () => {
        options = {
          user: mockUser,
          collectionNames: [],
          context: {
            currentUser: { orgId: "abc123" },
            isCommunityOrg: false,
            trustedOrgIds: [],
          } as unknown as ArcGISContext,
        };
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "partners",
          "item",
          options
        );
        expect(chk).toBeUndefined();
      });
      it("returns undefined when there are no trusted org ids other than the community", () => {
        options = {
          user: mockUser,
          collectionNames: [],
          context: {
            currentUser: { orgId: "abc123" },
            isCommunityOrg: false,
            communityOrgId: "def456",
            trustedOrgIds: ["abc123", "def456"],
            trustedOrgs: [
              {
                from: { orgId: "abc123" },
                to: { orgId: "def456", name: "c-org name" },
              },
            ],
          } as ArcGISContext,
        };
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "partners",
          "item",
          options
        );
        expect(chk).toBeUndefined();
      });
    });
    describe("handles community catalog for items", () => {
      it("passes for e-org w/ community org", () => {
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "community",
          "item",
          options
        );
        expect(chk.scopes).toBeDefined();
        expect(chk.scopes?.item?.filters).toEqual([
          { predicates: [{ orgid: "def456" }] },
        ]);
        expect(chk.collections?.map((c) => c.key)).toEqual([
          "appAndMap",
          "dataset",
          "document",
          "feedback",
          "site",
          "project",
        ]);
      });
      it("passes for c-org w/ community org", () => {
        options = {
          user: mockUser,
          collectionNames: [],
          context: {
            currentUser: { orgId: "def456" },
            isCommunityOrg: true,
            communityOrgId: undefined,
            trustedOrgIds: ["abc123", "def456", "ghi789", "kjl012", "mno345"],
            trustedOrgs: [
              {
                from: { orgId: "def456" },
                to: { orgId: "abc123", name: "c-org name" },
              },
            ],
          } as unknown as ArcGISContext,
        };
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "community",
          "item",
          options
        );
        expect(chk.scopes).toBeDefined();
        expect(chk.scopes?.item?.filters).toEqual([
          { predicates: [{ orgid: "abc123" }] },
        ]);
        expect(chk.title).toEqual("c-org name");
        expect(chk.collections?.map((c) => c.key)).toEqual([
          "appAndMap",
          "dataset",
          "document",
          "feedback",
          "site",
          "project",
        ]);
      });
      it("returns undefined when no trusted orgs/community org", () => {
        options = {
          user: mockUser,
          collectionNames: [],
          context: {
            currentUser: { orgId: "abc123" },
            isCommunityOrg: false,
            communityOrgId: undefined,
            trustedOrgIds: [],
            trustedOrgs: [],
          } as unknown as ArcGISContext,
        };
        const chk = getWellKnownCatalog(
          "mockI18nScope",
          "community",
          "item",
          options
        );
        expect(chk).toBeUndefined();
      });
    });
    it("handles the living atlas catalog for items", () => {
      const chk = getWellKnownCatalog(
        "mockI18nScope",
        "livingAtlas",
        "item",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.item?.filters).toEqual([
        { predicates: [{ owner: "Esri_LivingAtlas" }] },
      ]);
      expect(chk.collections?.map((c) => c.key)).toEqual([
        "appAndMap",
        "dataset",
        "document",
        "feedback",
        "site",
        "project",
      ]);
    });
    it("returns the expected catalog for groups", () => {
      let chk = getWellKnownCatalog(
        "mockI18nScope",
        "editGroups",
        "group",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        { predicates: [{ capabilities: ["updateitemcontrol"] }] },
      ]);
      expect(chk.collections).toEqual([
        {
          targetEntity: "group",
          key: "editGroups",
          label: "editGroups",
          scope: {
            targetEntity: "group",
            filters: [
              {
                predicates: [{ q: "*" }],
              },
            ],
          },
        },
      ]);
      chk = getWellKnownCatalog(
        "mockI18nScope",
        "viewGroups",
        "group",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        { predicates: [{ capabilities: { not: ["updateitemcontrol"] } }] },
      ]);
      expect(chk.collections).toEqual([
        {
          targetEntity: "group",
          key: "viewGroups",
          label: "viewGroups",
          scope: {
            targetEntity: "group",
            filters: [
              {
                predicates: [{ q: "*" }],
              },
            ],
          },
        },
      ]);
      chk = getWellKnownCatalog("mockI18nScope", "allGroups", "group", options);
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        { predicates: [{ capabilities: [""] }] },
      ]);
      expect(chk.collections).toEqual([
        {
          targetEntity: "group",
          key: "allGroups",
          label: "allGroups",
          scope: {
            targetEntity: "group",
            filters: [
              {
                predicates: [{ q: "*" }],
              },
            ],
          },
        },
      ]);
      // verify "myGroups" well known catalog
      chk = getWellKnownCatalog("mockI18nScope", "myGroups", "group", options);
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        { predicates: [{ owner: "some-username" }] },
      ]);
      // verify "orgGroups" well known catalog
      chk = getWellKnownCatalog("mockI18nScope", "orgGroups", "group", options);
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        {
          predicates: [
            {
              orgid: "abc123",
              searchUserAccess: "groupMember",
              searchUserName: "some-username",
              isviewonly: false,
            },
            {
              orgid: "abc123",
              id: ["abc", "jkl"],
            },
          ],
        },
      ]);
      // verify "communityGroups" well known catalog
      chk = getWellKnownCatalog(
        "mockI18nScope",
        "communityGroups",
        "group",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        {
          predicates: [
            {
              orgid: "def456",
              searchUserAccess: "groupMember",
              searchUserName: "some-username",
              isviewonly: false,
            },
            {
              orgid: "def456",
              id: ["abc", "jkl"],
            },
          ],
        },
      ]);
      // verify "publicGroups" well known catalog
      chk = getWellKnownCatalog(
        "mockI18nScope",
        "publicGroups",
        "group",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.group?.filters).toEqual([
        { predicates: [{ access: "public" }] },
      ]);
    });
    it("returns the expected catalog for events", () => {
      // verify "myEvents" well known catalog
      let chk = getWellKnownCatalog(
        "mockI18nScope",
        "myEvents",
        "event",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.event?.filters).toEqual([
        { predicates: [{ owner: "userid" }] },
      ]);
      // verify "orgEvents" well known catalog
      chk = getWellKnownCatalog("mockI18nScope", "orgEvents", "event", options);
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.event?.filters).toEqual([
        { predicates: [{ orgid: "abc123" }] },
      ]);
      // verify "communityEvents" well known catalog
      chk = getWellKnownCatalog(
        "mockI18nScope",
        "worldEvents",
        "event",
        options
      );
      expect(chk.scopes).toBeDefined();
      expect(chk.scopes?.event?.filters).toEqual([
        { predicates: [{ access: ["public", "private", "org"] }] },
      ]);
    });
    it("throws if not passing a user for a catalog that requires it", () => {
      expect(() =>
        getWellKnownCatalog("mockI18nScope", "myContent", "item")
      ).toThrowError('User needed to get "myContent" catalog');
      expect(() =>
        getWellKnownCatalog("mockI18nScope", "myGroups", "group")
      ).toThrowError('User needed to get "myGroups" catalog');
      expect(() =>
        getWellKnownCatalog("mockI18nScope", "myEvents", "event")
      ).toThrowError('User needed to get "myEvents" catalog');
      expect(() =>
        getWellKnownCatalog("mockI18nScope", "favorites", "item")
      ).toThrowError('User needed to get "favorites" catalog');
      expect(() =>
        getWellKnownCatalog("mockI18nScope", "organization", "item")
      ).toThrowError('User needed to get "organization" catalog');
    });
    it("does not throw if not passing a user for a catalog that does not require it", () => {
      const chk = getWellKnownCatalog("mockI18nScope", "world", "item");
      expect(chk.scopes?.item?.filters).toEqual([
        { predicates: [{ type: { not: ["code attachment"] } }] },
      ]);
    });
    it("throws if passed an invalid entity type", () => {
      expect(() =>
        getWellKnownCatalog(
          "mockI18nScope",
          "myContent",
          "villain" as EntityType
        )
      ).toThrowError('Wellknown catalog not implemented for "villain"');
    });
    it("returns the catalog with specific collection requested", () => {
      options.collectionNames = ["document", "feedback"];
      const chk = getWellKnownCatalog(
        "mockI18nScope",
        "organization",
        "item",
        options
      );
      expect(chk.collections?.length).toBe(2);
    });
    it("returns no collections if passed an invalid collection name ", () => {
      options.collectionNames = ["fakeContent" as WellKnownCollection];
      const chk = getWellKnownCatalog(
        "mockI18nScope",
        "organization",
        "item",
        options
      );
      expect(chk.collections?.length).toBe(0);
    });
    it("applies provided filters to the catalog scope", () => {
      options.filters = [{ predicates: [{ type: ["Hub Project"] }] }];
      const chk = getWellKnownCatalog(
        "mockI18nScope",
        "organization",
        "item",
        options
      );
      expect(chk.scopes?.item?.filters.length).toBe(2);
    });
  });

  describe("getWellknownCollections", () => {
    it("returns the default collections", () => {
      const chk = getWellknownCollections("mockI18nScope", "item");
      expect(chk.map((a) => a.key)).toEqual([
        "appAndMap",
        "dataset",
        "document",
        "feedback",
        "site",
        "project",
      ]);
      expect(chk[1].scope.filters[0].predicates[0].type).toEqual([
        "CSV Collection",
        "CSV",
        "Feature Collection",
        "Feature Layer",
        // Changed as part of https://confluencewikidev.esri.com/x/KYJuDg
        "Feature Service",
        "File Geodatabase",
        "GeoJSON",
        "GeoJson",
        "KML Collection",
        "KML",
        "Shapefile",
        "Stream Service",
        "Table",
        "Image Service",
      ]);
    });
    it("returns the collection from custom request", () => {
      const chk = getWellknownCollections("mockI18nScope", "item", [
        "appAndMap",
        "dataset",
        "template",
      ]);
      expect(chk.map((a) => a.key)).toEqual([
        "appAndMap",
        "dataset",
        "template",
      ]);
    });
  });

  describe("getWellknownCollection", () => {
    it("returns the correct collection requested", () => {
      const chk = getWellknownCollection("mockI18nScope", "item", "appAndMap");
      expect(chk.key).toEqual("appAndMap");
    });
  });

  describe("dotifyString", () => {
    it("returns the correct dotified strings", () => {
      let chk = dotifyString("stringWithoutDot");
      expect(chk).toEqual("stringWithoutDot.");
      chk = dotifyString("stringWithDot.");
      expect(chk).toEqual("stringWithDot.");
      chk = dotifyString("");
      expect(chk).toEqual("");
    });
  });
});
