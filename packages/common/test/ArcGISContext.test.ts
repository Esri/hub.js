import { ArcGISContext } from "../src/ArcGISContext";
import { cloneObject, IHubRequestOptionsPortalSelf } from "../src";
import * as portalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "./mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";

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
    it("verify props when passed nothing", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create();
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);

      expect(ctx.state.portalUrl).toBe("https://www.arcgis.com");
      expect(ctx.state.isPortal).toBe(false);
      expect(ctx.state.hubUrl).toBe("https://hub.arcgis.com");
      expect(ctx.state.requestOptions).toEqual({
        portal: ctx.state.sharingApiUrl,
      });
      expect(ctx.state.userRequestOptions).toBeUndefined();
      expect(ctx.state.communityOrgId).toBeUndefined();
      expect(ctx.state.communityOrgHostname).toBeUndefined();
      expect(ctx.state.communityOrgUrl).toBeUndefined();
      expect(ctx.state.eventsConfig).toBeUndefined();
      expect(ctx.state.helperServices).toBeUndefined();
      expect(ctx.state.hubEnabled).toBeFalsy();
      // Hub Urls
      const base = ctx.state.hubUrl;
      expect(ctx.state.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(ctx.state.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(ctx.state.domainServiceUrl).toBe(`${base}/api/v3/domains`);
    });
    it("verify props when passed portalUrl", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create({
        portalUrl: "https://myserver.com/gis",
        debug: true,
      });
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);

      // RequestOptions
      expect(ctx.state.requestOptions.portal).toBe(ctx.state.sharingApiUrl);
      expect(ctx.state.requestOptions.authentication).not.toBeDefined();
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create({ authentication: MOCK_AUTH });

      // assertions
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);
      expect(ctx.state.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(ctx.state.sharingApiUrl).toBe(MOCK_AUTH.portal);
      expect(ctx.state.hubUrl).toBe("https://hub.arcgis.com");
      expect(ctx.state.session).toBe(MOCK_AUTH);
      expect(ctx.state.isAuthenticated).toBe(true);
      // RequestOptions
      expect(ctx.state.requestOptions.portal).toBe(ctx.state.sharingApiUrl);
      expect(ctx.state.requestOptions.authentication).toBe(MOCK_AUTH);
      // UserRequestOptions
      expect(ctx.state.userRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(ctx.state.userRequestOptions.portal).toBe(ctx.state.sharingApiUrl);

      // Hub Request Options
      expect(ctx.state.hubRequestOptions.authentication).toBe(MOCK_AUTH);
      expect(ctx.state.hubRequestOptions.isPortal).toBe(false);
      expect(ctx.state.hubRequestOptions.portalSelf).toEqual(
        onlinePortalSelfResponse as unknown as IHubRequestOptionsPortalSelf
      );
      expect(ctx.state.hubRequestOptions.hubApiUrl).toBe(
        "https://hub.arcgis.com"
      );

      // Hub Urls
      const base = ctx.state.hubUrl;
      expect(ctx.state.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(ctx.state.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(ctx.state.domainServiceUrl).toBe(`${base}/api/v3/domains`);

      // Community
      expect(ctx.state.communityOrgId).toBe("FAKE_C_ORGID");
      expect(ctx.state.communityOrgHostname).toBe(
        "my-community.maps.arcgis.com"
      );
      expect(ctx.state.communityOrgUrl).toBe(
        "https://my-community.maps.arcgis.com"
      );

      expect(ctx.state.eventsConfig).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.settings.events
      );
      expect(ctx.state.hubEnabled).toEqual(
        onlinePortalSelfResponse.portalProperties.hub.enabled
      );

      expect(ctx.state.helperServices).toEqual(
        onlinePortalSelfResponse.helperServices
      );
      expect(ctx.state.currentUser).toEqual(onlinePortalSelfResponse.user);
      expect(ctx.state.portal).toEqual(
        onlinePortalSelfResponse as unknown as IPortal
      );
    });
    it("verify props update setting session after", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create();
      expect(ctx.state.portalUrl).toBe("https://www.arcgis.com");
      await ctx.setAuthentication(MOCK_AUTH);
      expect(ctx.state.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
    });
    it("verify props after clearing session", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create({ authentication: MOCK_AUTH });
      expect(ctx.state.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      await ctx.clearAuthentication();
      expect(ctx.state.portalUrl).toBe("https://www.arcgis.com");
      expect(ctx.state.portal).toBeUndefined();
      expect(ctx.state.currentUser).toBeUndefined();
      expect(ctx.state.session).toBeUndefined();
    });
  });

  describe("Enterprise:", () => {
    it("verify props when passed just clientid", async () => {
      const t = new Date().getTime();
      const ctx = await ArcGISContext.create({
        portalUrl: "https://myenterprise.com/gis",
      });
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);
      expect(ctx.state.portalUrl).toBe("https://myenterprise.com/gis");
      expect(ctx.state.sharingApiUrl).toBe(
        "https://myenterprise.com/gis/sharing/rest"
      );
      expect(ctx.state.isPortal).toBe(true);

      expect(ctx.state.hubUrl).toBeUndefined();
      expect(ctx.state.discussionsServiceUrl).toBeUndefined();
      expect(ctx.state.hubSearchServiceUrl).toBeUndefined();
      expect(ctx.state.domainServiceUrl).toBeUndefined();
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create({
        authentication: MOCK_ENTERPRISE_AUTH,
      });

      // assertions
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);
      expect(ctx.state.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(ctx.state.sharingApiUrl).toBe(MOCK_ENTERPRISE_AUTH.portal);
    });
    it("verify props after clearing session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });

      const ctx = await ArcGISContext.create({
        authentication: MOCK_ENTERPRISE_AUTH,
      });

      // assertions
      expect(ctx.state.id).toBeGreaterThanOrEqual(t);
      expect(ctx.state.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
      await ctx.clearAuthentication();
      expect(ctx.state.portalUrl).toBe(
        MOCK_ENTERPRISE_AUTH.portal.replace(`/sharing/rest`, "")
      );
    });
  });
  describe("extra coverage:", () => {
    it("handles qaext hubUrl", async () => {
      const ctx = await ArcGISContext.create({
        portalUrl: "https://qaext.arcgis.com",
      });
      expect(ctx.state.hubUrl).toBe("https://hubqa.arcgis.com");
    });
    it("handles devext hubUrl", async () => {
      const ctx = await ArcGISContext.create({
        portalUrl: "https://devext.arcgis.com",
      });
      expect(ctx.state.hubUrl).toBe("https://hubdev.arcgis.com");
    });
    it("sign out on qa, resets portalUrl correctly", async () => {
      const ctx = await ArcGISContext.create({
        portalUrl: "https://org.mapsqa.arcgis.com",
      });
      expect(ctx.state.hubUrl).toBe("https://hubqa.arcgis.com");
      await ctx.clearAuthentication();
      expect(ctx.state.hubUrl).toBe("https://hubqa.arcgis.com");
      expect(ctx.state.portalUrl).toBe("https://qaext.arcgis.com");
    });
    it("sign out on dev, resets portalUrl correctly", async () => {
      const ctx = await ArcGISContext.create({
        portalUrl: "https://org.mapsdevext.arcgis.com",
      });
      expect(ctx.state.hubUrl).toBe("https://hubdev.arcgis.com");
      await ctx.clearAuthentication();
      expect(ctx.state.hubUrl).toBe("https://hubdev.arcgis.com");
      expect(ctx.state.portalUrl).toBe("https://devext.arcgis.com");
    });
  });
});
