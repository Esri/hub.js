import { ArcGISContextManager } from "../src/ArcGISContextManager";
import {
  cloneObject,
  HubSystemStatus,
  IHubRequestOptionsPortalSelf,
  Level,
} from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "./mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import ExceptionFactory from "./mocks/ExceptionFactory";

const onlinePortalSelfResponse = {
  id: "FAKEID",
  name: "My Org",
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

const onlineUserResponse = {
  username: "jvader",
  firstName: "Jeff",
  lastName: "Vader",
  description: "Runs the Deathstar",
  email: "jvader@deathstar.com",
};

const enterprisePortalSelfResponse = {
  id: "FAKEID",
  name: "My Enterprise",
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

const enterpriseUserResponse = {
  username: "lskywalker",
  firstName: "Leia",
  lastName: "Skywalker",
  description: "Runs the Rebels",
  email: "lskywalker@rebelalliance.com",
};

/**
 * NOTE: Throughout these tests we pass in a second arg to ArcGISContextManager.create
 * which is a fake `window`. We do this so these same tests will work in node
 */

describe("ArcGISContext:", () => {
  describe("AGO:", () => {
    it("verify props when passed nothing", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create();
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);

      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      expect(mgr.context.isPortal).toBe(false);
      expect(mgr.context.hubUrl).toBe("https://hub.arcgis.com");
      expect(mgr.context.hubHomeUrl).toBe("https://hub.arcgis.com");
      expect(mgr.context.requestOptions).toEqual({
        portal: mgr.context.sharingApiUrl,
      });
      expect(mgr.context.userRequestOptions).toBeUndefined();
      expect(mgr.context.communityOrgId).toBeUndefined();
      expect(mgr.context.communityOrgHostname).toBeUndefined();
      expect(mgr.context.communityOrgUrl).toBeUndefined();
      expect(mgr.context.eventsConfig).toBeUndefined();
      expect(mgr.context.helperServices).toBeUndefined();
      expect(mgr.context.hubEnabled).toBeFalsy();
      expect(mgr.context.isAlphaOrg).toBeFalsy();
      // Hub Urls
      const base = mgr.context.hubUrl;
      expect(mgr.context.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(mgr.context.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(mgr.context.domainServiceUrl).toBe(`${base}/api/v3/domains`);
      expect(mgr.context.hubRequestOptions).toBeDefined();
      expect(mgr.context.hubRequestOptions.authentication).toBeUndefined();
      expect(mgr.context.systemStatus).toBeDefined();
      expect(mgr.context.hubLicense).toBe("hub-basic");
    });
    it("verify props when passed portalUrl", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://myserver.com/gis",
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);

      // RequestOptions
      expect(mgr.context.requestOptions.portal).toBe(mgr.context.sharingApiUrl);
      expect(mgr.context.requestOptions.authentication).not.toBeDefined();
      expect(mgr.context.properties).not.toBeDefined();
      // now call setProperties and ensure it's returned on context
      const hubSite = {
        id: "bc3",
        groups: ["3ef", "00c"],
      };
      mgr.setProperties({ hubSite });
      expect(mgr.context.properties.hubSite).toEqual(hubSite);
    });
    it("verify when passed log level and properties", async () => {
      const t = new Date().getTime();
      const site = {
        id: "bc3",
        groups: ["3ef", "00c"],
      };
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://myserver.com/gis",
        logLevel: Level.debug,
        properties: { site },
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.properties.site).toEqual(site);
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
      });

      // assertions
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );

      expect(mgr.context.sharingApiUrl).toBe(MOCK_AUTH.portal);
      expect(mgr.context.hubUrl).toBe("https://hub.arcgis.com");
      expect(mgr.context.hubHomeUrl).toBe("https://myorg-hub.hub.arcgis.com");
      expect(mgr.context.session).toBe(MOCK_AUTH);
      expect(mgr.context.isAuthenticated).toBe(true);
      // RequestOptions
      expect(mgr.context.requestOptions.portal).toBe(mgr.context.sharingApiUrl);
      expect(mgr.context.requestOptions.authentication).toBe(MOCK_AUTH);
      // UserRequestOptions
      expect(mgr.context.userRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(mgr.context.userRequestOptions.portal).toBe(
        mgr.context.sharingApiUrl
      );

      // Hub Request Options
      expect(mgr.context.hubRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(mgr.context.hubRequestOptions.isPortal).toBe(false);
      expect(mgr.context.hubRequestOptions.portalSelf).toEqual(
        onlinePortalSelfResponse as unknown as IHubRequestOptionsPortalSelf
      );
      expect(mgr.context.hubRequestOptions.hubApiUrl).toBe(
        "https://hub.arcgis.com"
      );

      expect(mgr.context.hubHomeUrl).toBe("https://myorg-hub.hub.arcgis.com");

      // Hub Urls
      const base = mgr.context.hubUrl;
      expect(mgr.context.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(mgr.context.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(mgr.context.domainServiceUrl).toBe(`${base}/api/v3/domains`);

      // Community
      expect(mgr.context.communityOrgId).toBe("FAKE_C_ORGID");
      expect(mgr.context.communityOrgHostname).toBe(
        "my-community.maps.arcgis.com"
      );
      expect(mgr.context.communityOrgUrl).toBe(
        "https://my-community.maps.arcgis.com"
      );

      expect(mgr.context.eventsConfig).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.settings.events
      );
      expect(mgr.context.hubEnabled).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.enabled
      );
      expect(mgr.context.hubLicense).toBe("hub-premium");

      expect(mgr.context.helperServices).toEqual(
        onlinePortalSelfResponse.helperServices
      );
      expect(mgr.context.currentUser).toEqual(onlinePortalSelfResponse.user);
      expect(mgr.context.portal).toEqual(
        onlinePortalSelfResponse as unknown as IPortal
      );
    });
    it("verify props when passed session, portalSelf, User and systemStatus", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        portal: onlinePortalSelfResponse,
        currentUser: onlineUserResponse,
        systemStatus: { discussions: "offline" } as HubSystemStatus,
        properties: {
          alphaOrgs: ["FAKEID", "FOTHERID"],
        },
      });
      expect(selfSpy.calls.count()).toBe(0);
      expect(userSpy.calls.count()).toBe(0);
      expect(mgr.context.currentUser).toEqual(onlineUserResponse);
      expect(mgr.context.portal).toEqual(onlinePortalSelfResponse);
      expect(mgr.context.session).toBe(MOCK_AUTH);
      expect(mgr.context.systemStatus).toEqual({
        discussions: "offline",
      } as HubSystemStatus);
      expect(mgr.context.properties.alphaOrgs).toEqual(["FAKEID", "FOTHERID"]);
      expect(mgr.context.isAlphaOrg).toBeTruthy();
    });
    it("verify props update setting session after", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });

      const mgr = await ArcGISContextManager.create();
      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      await mgr.setAuthentication(MOCK_AUTH);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
    });
    it("verify props after clearing session", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
      });
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      mgr.clearAuthentication();
      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      expect(mgr.context.portal).toBeUndefined();
      expect(mgr.context.currentUser).toBeUndefined();
      expect(mgr.context.session).toBeUndefined();
    });
    it("throws if fetch fails", async () => {
      const invalidToken = ExceptionFactory.createInvalidTokenError();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.reject(invalidToken);
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      try {
        await ArcGISContextManager.create({ authentication: MOCK_AUTH });
      } catch (ex) {
        expect(ex).toBeDefined();
      }
    });
  });

  describe("Enterprise:", () => {
    it("verify props when passed just clientid", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://myenterprise.com/gis",
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.portalUrl).toBe("https://myenterprise.com/gis");
      expect(mgr.context.sharingApiUrl).toBe(
        "https://myenterprise.com/gis/sharing/rest"
      );
      expect(mgr.context.isPortal).toBe(true);

      expect(mgr.context.hubUrl).toBeUndefined();
      expect(mgr.context.hubHomeUrl).toBeUndefined();
      expect(mgr.context.discussionsServiceUrl).toBeUndefined();
      expect(mgr.context.hubSearchServiceUrl).toBeUndefined();
      expect(mgr.context.domainServiceUrl).toBeUndefined();
      expect(mgr.context.hubLicense).toBe("enterprise-sites");
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(enterpriseUserResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_ENTERPRISE_AUTH,
      });

      // assertions
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(mgr.context.sharingApiUrl).toBe(MOCK_ENTERPRISE_AUTH.portal);
    });
    it("verify props after clearing session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(enterpriseUserResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_ENTERPRISE_AUTH,
      });

      // assertions
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
      mgr.clearAuthentication();
      expect(mgr.context.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
    });
  });
  describe("extra coverage:", () => {
    it("handles qaext hubUrl", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://qaext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
    });
    it("handles devext hubUrl", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://devext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
    });
    it("sign out on qa, resets portalUrl correctly", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://org.mapsqa.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
      mgr.clearAuthentication();
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
      expect(mgr.context.portalUrl).toBe("https://qaext.arcgis.com");
    });
    it("sign out on dev, resets portalUrl correctly", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://org.mapsdevext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
      mgr.clearAuthentication();
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
      expect(mgr.context.portalUrl).toBe("https://devext.arcgis.com");
    });
  });
});
