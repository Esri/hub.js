import { ArcGISContext } from "../src/ArcGISContext";
import { cloneObject, IHubRequestOptionsPortalSelf } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "./mocks/mock-auth";
import { getItem, IPortal } from "@esri/arcgis-rest-portal";

const MOCK_LOCAL_STORAGE = {
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
};

const onlinePortalSelfResponse = {
  urlKey: "myorg",
  customBaseUrl: "maps.arcgis.com",
  isPortal: false,
  helperServices: {
    big: "hash of things",
  },
  portalProperties: {
    hub: {
      enabled: true,
      settings: {
        events: {
          publicViewId: "54cb8ca07c7e4980a554ce9b2a6b0c0a",
          serviceId: "bde7428c5199419d9c62f20367a71126",
        },
        communityOrg: {
          orgId: "FAKE_C_ORGID",
          portalHostname: "my-community.maps.arcgis.com",
        },
      },
    },
  },
  user: {
    username: "jvader",
    firstName: "Jeff",
    lastName: "Vader",
    description: "Runs the Deathstar",
    email: "jvader@deathstar.com",
  },
};

const enterprisePortalSelfResponse = {
  customBaseUrl: "portal",
  portalHostname: "my-server.com/portal",
  isPortal: true,
  helperServices: {
    big: "hash of things",
  },
  portalProperties: {},
  user: {
    username: "lskywalker",
    firstName: "Leia",
    lastName: "Skywalker",
    description: "Runs the Rebels",
    email: "lskywalker@rebelalliance.com",
  },
};

/**
 * NOTE: Throughout these tests we pass in a second arg to ArcGISContext.create
 * which is a fake `window`. We do this so these same tests will work in node
 */

describe("ArcGISContext:", () => {
  describe("AGO:", () => {
    it("verify props when passed just clientid and not authd", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
        },
        {}
      );
      expect(ctx.id).toBeGreaterThanOrEqual(t);
      expect(ctx.clientId).toBe("FAKEID");
      expect(ctx.portalUrl).toBe("https://www.arcgis.com");
      expect(ctx.isPortal).toBe(false);
      expect(ctx.hubUrl).toBe("https://hub.arcgis.com");
      expect(ctx.requestOptions).toEqual({
        portal: ctx.sharingApiUrl,
      });
      expect(ctx.userRequestOptions).toBeUndefined();
      expect(ctx.communityOrgId).toBeUndefined();
      expect(ctx.communityOrgHostname).toBeUndefined();
      expect(ctx.communityOrgUrl).toBeUndefined();
      expect(ctx.eventsConfig).toBeUndefined();
      expect(ctx.helperServices).toBeUndefined();
      expect(ctx.hubEnabled).toBeFalsy();
      // Hub Urls
      const base = ctx.hubUrl;
      expect(ctx.discussionsServiceUrl).toBe(`${base}/api/discussions/v1`);
      expect(ctx.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(ctx.domainServiceUrl).toBe(`${base}/api/v3/domains`);
    });
    it("verify props when passed clientid and portalUrl", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
          portalUrl: "https://myserver.com/gis",
          debug: true,
        },
        {}
      );
      expect(ctx.id).toBeGreaterThanOrEqual(t);
      expect(ctx.clientId).toBe("FAKEID");
      // RequestOptions
      expect(ctx.requestOptions.portal).toBe(ctx.sharingApiUrl);
      expect(ctx.requestOptions.authentication).not.toBeDefined();
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      const getSelfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create({ authentication: MOCK_AUTH }, {});

      // assertions
      expect(ctx.id).toBeGreaterThanOrEqual(t);
      expect(ctx.clientId).toBe("arcgisonline");
      expect(ctx.portalUrl).toBe(MOCK_AUTH.portal.replace(`/sharing/rest`, ""));
      expect(ctx.sharingApiUrl).toBe(MOCK_AUTH.portal);
      expect(ctx.hubUrl).toBe("https://hub.arcgis.com");
      expect(ctx.session).toBe(MOCK_AUTH);
      expect(ctx.isAuthenticated).toBe(true);
      // RequestOptions
      expect(ctx.requestOptions.portal).toBe(ctx.sharingApiUrl);
      expect(ctx.requestOptions.authentication).toBe(MOCK_AUTH);
      // UserRequestOptions
      expect(ctx.userRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(ctx.userRequestOptions.portal).toBe(ctx.sharingApiUrl);

      // Hub Request Options
      expect(ctx.hubRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(ctx.hubRequestOptions.isPortal).toBe(false);
      expect(ctx.hubRequestOptions.portalSelf).toEqual(
        onlinePortalSelfResponse as unknown as IHubRequestOptionsPortalSelf
      );
      expect(ctx.hubRequestOptions.hubApiUrl).toBe("https://hub.arcgis.com");

      // Hub Urls
      const base = ctx.hubUrl;
      expect(ctx.discussionsServiceUrl).toBe(`${base}/api/discussions/v1`);
      expect(ctx.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(ctx.domainServiceUrl).toBe(`${base}/api/v3/domains`);

      // Community
      expect(ctx.communityOrgId).toBe("FAKE_C_ORGID");
      expect(ctx.communityOrgHostname).toBe("my-community.maps.arcgis.com");
      expect(ctx.communityOrgUrl).toBe("https://my-community.maps.arcgis.com");

      expect(ctx.eventsConfig).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.settings.events
      );
      expect(ctx.hubEnabled).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.enabled
      );

      expect(ctx.helperServices).toEqual(
        onlinePortalSelfResponse.helperServices
      );
      expect(ctx.currentUser).toEqual(onlinePortalSelfResponse.user);
      expect(ctx.portal).toEqual(
        onlinePortalSelfResponse as unknown as IPortal
      );
    });

    it("hydrates from localStorage", async () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };
      const localStorageGetItemSpy = spyOn(
        MOCK_LOCAL_STORAGE,
        "getItem"
      ).and.returnValue(MOCK_AUTH.serialize());
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
          debug: true,
        },
        MOCK_WIN
      );

      expect(ctx.clientId).toBe("FAKEID");
      expect(localStorageGetItemSpy.calls.count()).toBe(1);
      expect(localStorageGetItemSpy.calls.argsFor(0)[0]).toBe(
        "__CONTEXT_FAKEID"
      );
      // Just for coverage when we don't sent debug: true
      const ctx2 = await ArcGISContext.create(
        {
          clientId: "FAKEID",
        },
        MOCK_WIN
      );
    });
    it("saves session to localStorage", async () => {
      const MOCK_WIN = {
        localStorage: MOCK_LOCAL_STORAGE,
      };
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
          authentication: MOCK_AUTH,
        },
        MOCK_WIN
      );

      const localStorageSetItemSpy = spyOn(
        MOCK_LOCAL_STORAGE,
        "setItem"
      ).and.callThrough();

      expect(ctx.clientId).toBe("FAKEID");
      ctx.saveSession(MOCK_WIN);
      expect(localStorageSetItemSpy.calls.count()).toBe(1);
      expect(localStorageSetItemSpy.calls.argsFor(0)[0]).toEqual(
        "__CONTEXT_FAKEID"
      );
      expect(localStorageSetItemSpy.calls.argsFor(0)[1]).toEqual(
        MOCK_AUTH.serialize()
      );
    });
    it("saveSession fails silently if no localStorage present", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
          authentication: MOCK_AUTH,
        },
        {}
      );
      ctx.saveSession({});
    });
    describe("clearSession:", () => {
      it("clears localStorage and props", async () => {
        const MOCK_WIN = {
          localStorage: MOCK_LOCAL_STORAGE,
        };
        spyOn(portalModule, "getSelf").and.callFake(() => {
          return Promise.resolve(cloneObject(onlinePortalSelfResponse));
        });
        const ctx = await ArcGISContext.create(
          {
            clientId: "FAKEID",
            authentication: MOCK_AUTH,
          },
          MOCK_WIN
        );

        const localStorageRemoveItemSpy = spyOn(
          MOCK_LOCAL_STORAGE,
          "removeItem"
        ).and.callThrough();
        await ctx.clearSession(MOCK_WIN);
        expect(localStorageRemoveItemSpy.calls.count()).toBe(1);
        expect(ctx.isAuthenticated).toBeFalsy();
        expect(ctx.session).toBeNull();
        expect(ctx.portal).toBeNull();
      });

      it("clears props if no localStorage", async () => {
        spyOn(portalModule, "getSelf").and.callFake(() => {
          return Promise.resolve(cloneObject(onlinePortalSelfResponse));
        });
        const ctx = await ArcGISContext.create(
          {
            clientId: "FAKEID",
            authentication: MOCK_AUTH,
          },
          {}
        );

        await ctx.clearSession({});

        expect(ctx.isAuthenticated).toBeFalsy();
        expect(ctx.session).toBeNull();
        expect(ctx.portal).toBeNull();
      });
    });
  });

  describe("Enterprise:", () => {
    it("verify props when passed just clientid", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create(
        {
          clientId: "FAKEID",
          portalUrl: "https://myenterprise.com/gis",
        },
        {}
      );
      expect(ctx.id).toBeGreaterThanOrEqual(t);
      expect(ctx.clientId).toBe("FAKEID");
      expect(ctx.portalUrl).toBe("https://myenterprise.com/gis");
      expect(ctx.sharingApiUrl).toBe(
        "https://myenterprise.com/gis/sharing/rest"
      );
      expect(ctx.isPortal).toBe(true);

      expect(ctx.hubUrl).toBeUndefined();
      expect(ctx.discussionsServiceUrl).toBeUndefined();
      expect(ctx.hubSearchServiceUrl).toBeUndefined();
      expect(ctx.domainServiceUrl).toBeUndefined();
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create(
        {
          authentication: MOCK_ENTERPRISE_AUTH,
        },
        {}
      );

      // assertions
      expect(ctx.id).toBeGreaterThanOrEqual(t);
      expect(ctx.clientId).toBe("arcgisonline");
      expect(ctx.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(ctx.sharingApiUrl).toBe(MOCK_ENTERPRISE_AUTH.portal);
    });
  });
  describe("extra coverage:", () => {
    it("handles qaext hubUrl", async () => {
      const ctx = await ArcGISContext.create(
        {
          portalUrl: "https://qaext.arcgis.com",
        },
        {}
      );
      expect(ctx.hubUrl).toBe("https://hubqa.arcgis.com");
    });
    it("handles devext hubUrl", async () => {
      const ctx = await ArcGISContext.create(
        {
          portalUrl: "https://devext.arcgis.com",
        },
        {}
      );
      expect(ctx.hubUrl).toBe("https://hubdev.arcgis.com");
    });
  });
});
