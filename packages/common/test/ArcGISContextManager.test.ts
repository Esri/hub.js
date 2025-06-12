import { ALPHA_ORGS, ArcGISContextManager } from "../src/ArcGISContextManager";
import {
  ArcGISContext,
  cloneObject,
  HubServiceStatus,
  IFeatureFlags,
  IHubRequestOptionsPortalSelf,
  IPermissionAccessResponse,
  IUserHubSettings,
} from "../src";
import { base64ToUnicode, unicodeToBase64 } from "../src/utils/encoding";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as requestModule from "@esri/arcgis-rest-request";
import * as authModule from "@esri/arcgis-rest-request";
import * as appResourcesModule from "../src/utils/hubUserAppResources";
import * as userResourcesModule from "../src/utils/internal/userAppResources";
import * as orgLimitsModule from "../src/org/fetchOrgLimits";
import * as permissionsModule from "../src/permissions/checkPermission";

import { MOCK_AUTH, MOCK_ENTERPRISE_AUTH } from "./mocks/mock-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
import ExceptionFactory from "./mocks/ExceptionFactory";
import { TOMORROW } from "./test-helpers/tomorrow";

const onlineUserResponse = {
  username: "jvader",
  firstName: "Jeff",
  lastName: "Vader",
  description: "Runs the Deathstar",
  email: "jvader@deathstar.com",
  groups: [
    {
      id: "00c",
      title: "Fake Group",
      userMembership: {
        username: "jvader",
        memberType: "admin",
        applications: 0,
      },
    } as portalModule.IGroup,
  ],
  role: "org_admin",
} as portalModule.IUser;

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
        enterpriseOrg: {
          orgId: "FAKE_E_ORGID",
        },
        orgType: "enterprise",
      },
    },
  },
  user: cloneObject(onlineUserResponse),
  thumbnail: "fake-thumbnail.jpg",
};

const onlinePortalSelfWithLimitsResponse = {
  ...onlinePortalSelfResponse,
  limits: {
    MaxNumUserGroups: 100,
  },
};

const onlinePartneredOrgResponse = {
  total: 4,
  start: 1,
  num: 10,
  nextStart: -1,
  trustedOrgs: [
    {
      from: {
        orgId: "97KLIFOSt5CxbiRI",
        usersAccess: true,
        established: 1615402632000,
        hub: false,
        state: "active",
      },
      to: {
        orgId: "5dIUy6DulN1DTIcJ",
        usersAccess: true,
        established: 1615402578000,
        name: "Sign In Testing QA",
        hub: false,
        state: "active",
      },
    },
    {
      from: {
        orgId: "97KLIFOSt5CxbiRI",
        usersAccess: true,
        established: 1528926476000,
        hub: true,
        state: "active",
      },
      to: {
        orgId: "RWOqjImnJn06yrVq",
        usersAccess: true,
        established: 1528926476000,
        name: "DCDev Hub Community",
        hub: true,
        state: "active",
      },
    },
  ],
};

const portalLimitsResponse = {
  type: "Groups",
  name: "MaxNumUserGroups",
  limitValue: 100,
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

const enterprisePartneredOrgResponse = {
  error: {
    code: 400,
    messageCode: "GWM_0002",
    message: "Invalid URL",
  },
};

const past = new Date(new Date().getTime() - 1000000).toISOString();
const expiredSession = {
  clientId: "clientId",
  refreshToken: "refreshToken",
  refreshTokenExpires: past,
  username: "casey",
  password: "123456",
  token: "fake-token",
  tokenExpires: past,
  portal: "https://myorg.maps.arcgis.com/sharing/rest",
  tokenDuration: 20160,
  redirectUri: "https://example-app.com/redirect-uri",
  refreshTokenTTL: 1440,
};
const future = new Date(new Date().getTime() + 1000000).toISOString();
const validSession = {
  clientId: "clientId",
  refreshToken: "refreshToken",
  refreshTokenExpires: future,
  username: "casey",
  password: "123456",
  token: "fake-token",
  tokenExpires: future,
  portal: "https://myorg.maps.arcgis.com/sharing/rest",
  tokenDuration: 20160,
  redirectUri: "https://example-app.com/redirect-uri",
  refreshTokenTTL: 1440,
};

const serializedContext = {
  portalUrl: "https://myorg.maps.arcgis.com",
  systemStatus: {
    content: "online",
    discussions: "online",
    events: "online",
    initiatives: "online",
    items: "online",
    metrics: "online",
    notifications: "online",
    pages: "online",
    projects: "online",
    search: "online",
    sites: "online",
  },
  session: JSON.stringify(expiredSession),
  portal: {
    id: "FAKEID",
    name: "My Org",
    urlKey: "myorg",
    customBaseUrl: "maps.arcgis.com",
    isPortal: false,
    helperServices: {
      big: "hash of things",
    },
    limits: {
      MaxNumUserGroups: 100,
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
  },
  currentUser: cloneObject(onlineUserResponse),
  properties: {
    foo: "bar",
  },
  trustedOrgIds: ["FAKEID", "FOTHERID"],
  trustedOrgs: onlinePartneredOrgResponse.trustedOrgs,
};

const validSerializedContext = cloneObject(serializedContext);
validSerializedContext.session = JSON.stringify(validSession);

const expiredSerializedContext = cloneObject(serializedContext);
expiredSerializedContext.session = JSON.stringify(expiredSession);

const featureFlags: IFeatureFlags = {
  "hub:project:create": true,
  "hub:site:create": false,
};

describe("ArcGISContextManager:", () => {
  describe("AGO:", () => {
    it("verify props when passed nothing", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create();
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);

      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      expect(mgr.context.isPortal).toBe(false);
      expect(mgr.context.hubUrl).toBe("https://hub.arcgis.com");
      expect(mgr.context.ogcApiUrl).toBe(
        "https://opendata.arcgis.com/api/search/v1"
      );
      expect(mgr.context.hubHomeUrl).toBe("https://hub.arcgis.com");
      expect(mgr.context.requestOptions).toEqual({
        portal: mgr.context.sharingApiUrl,
      });
      expect(mgr.context.userRequestOptions).toBeUndefined();
      expect(mgr.context.communityOrgId).toBeUndefined();
      expect(mgr.context.enterpriseOrgId).toBeUndefined();
      expect(mgr.context.communityOrgHostname).toBeUndefined();
      expect(mgr.context.communityOrgUrl).toBeUndefined();
      expect(mgr.context.eventsConfig).toBeUndefined();
      expect(mgr.context.helperServices).toBeUndefined();
      expect(mgr.context.hubEnabled).toBeFalsy();
      expect(mgr.context.isAlphaOrg).toBeFalsy();
      expect(mgr.context.isBetaOrg).toBeFalsy();
      expect(mgr.context.isCommunityOrg).toBeFalsy();
      expect(mgr.context.environment).toBe("production");
      // Hub Urls
      const base = mgr.context.hubUrl;
      expect(mgr.context.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(mgr.context.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(mgr.context.domainServiceUrl).toBe(`${base}/api/v3/domains`);
      expect(mgr.context.hubRequestOptions).toBeDefined();
      expect(mgr.context.hubRequestOptions.authentication).toBeUndefined();
      expect(mgr.context.serviceStatus).toBeDefined();
      expect(mgr.context.hubLicense).toBe("hub-basic");
      expect(mgr.context.featureFlags).toEqual({});
      expect(mgr.context.trustedOrgIds).toEqual([]);
      expect(mgr.context.trustedOrgs).toEqual([]);
      expect(mgr.context.userResourceTokens).toEqual([]);
      expect(mgr.context.userHubSettings).toEqual({ schemaVersion: 1 });
      expect(mgr.context.isAlphaOrg).toEqual(false);
      expect(mgr.context.isBetaOrg).toEqual(false);
      expect(mgr.context.orgThumbnailUrl).toBeNull();
      expect(mgr.context.survey123Url).toEqual("https://survey123.arcgis.com");
      expect(mgr.context.isOrgAdmin).toBeFalsy();
      expect(mgr.context.resourceGroupIDs).toBeDefined();
    });
    it("verify alpha and beta orgs", async () => {
      const mgr = await ArcGISContextManager.create({
        portal: {
          id: ALPHA_ORGS[0],
        } as unknown as IPortal,
        properties: {
          alphaOrgs: ALPHA_ORGS,
          betaOrgs: ALPHA_ORGS,
        },
      });
      expect(mgr.context.isAlphaOrg).toEqual(true, "Alpha org should be true");
      expect(mgr.context.isBetaOrg).toEqual(true, "Beta org should be true");
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
      expect(mgr.context.properties.alphaOrgs).toBeDefined();
      expect(mgr.context.userResourceTokens).toEqual([]);
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
        properties: { site },
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.environment).toBe("enterprise");
      expect(mgr.context.properties.site).toEqual(site);
      expect(mgr.context.userResourceTokens).toEqual([]);
      expect(mgr.context.ogcApiUrl).toBeUndefined();
    });
    it("verify when passed featureFlags", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://myserver.com/gis",
        featureFlags,
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.environment).toBe("enterprise");
      expect(mgr.context.featureFlags).not.toBe(featureFlags);
      expect(mgr.context.featureFlags).toEqual(featureFlags);
    });

    it("verify when passed resourceConfigs", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://myserver.com/gis",
        featureFlags,
        resourceConfigs: [
          {
            app: "self",
            clientId: "FAKECLIENTID",
          },
        ],
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.environment).toBe("enterprise");
      expect(mgr.context.featureFlags).not.toBe(featureFlags);
      expect(mgr.context.featureFlags).toEqual(featureFlags);
      expect(mgr.context.userResourceTokens).toEqual([]);
    });
    it("verify when passed partnered orgs and partnered org ids", async () => {
      const t = new Date().getTime();
      const mgr = await ArcGISContextManager.create({
        trustedOrgIds: ["FAKEID", "FOTHERID"],
        trustedOrgs: onlinePartneredOrgResponse.trustedOrgs,
      });
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      expect(mgr.context.trustedOrgIds).toEqual(["FAKEID", "FOTHERID"]);
      expect(mgr.context.trustedOrgs).toEqual(
        onlinePartneredOrgResponse.trustedOrgs
      );
    });
    it("verify props when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      spyOn(orgLimitsModule, "fetchOrgLimits").and.callFake(() => {
        return Promise.resolve(portalLimitsResponse);
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
      expect(mgr.context.hubHomeUrl).toBe("https://myorg.hub.arcgis.com");
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
        onlinePortalSelfWithLimitsResponse as unknown as IHubRequestOptionsPortalSelf
      );
      expect(mgr.context.hubRequestOptions.hubApiUrl).toBe(
        "https://hub.arcgis.com"
      );

      expect(mgr.context.hubHomeUrl).toBe("https://myorg.hub.arcgis.com");

      // Hub Urls
      const base = mgr.context.hubUrl;
      expect(mgr.context.discussionsServiceUrl).toBe(
        `${base}/api/discussions/v1`
      );
      expect(mgr.context.hubSearchServiceUrl).toBe(`${base}/api/v3/datasets`);
      expect(mgr.context.domainServiceUrl).toBe(`${base}/api/v3/domains`);

      // Community
      expect(mgr.context.communityOrgId).toBe("FAKE_C_ORGID");
      expect(mgr.context.enterpriseOrgId).toBe("FAKE_E_ORGID");
      expect(mgr.context.communityOrgHostname).toBe(
        "my-community.maps.arcgis.com"
      );
      expect(mgr.context.communityOrgUrl).toBe(
        "https://my-community.maps.arcgis.com"
      );

      expect(mgr.context.eventsConfig).toEqual(
        onlinePortalSelfWithLimitsResponse.portalProperties.hub.settings.events
      );
      expect(mgr.context.hubEnabled).toEqual(
        onlinePortalSelfWithLimitsResponse.portalProperties.hub.enabled
      );
      expect(mgr.context.hubLicense).toBe("hub-premium");

      expect(mgr.context.helperServices).toEqual(
        onlinePortalSelfWithLimitsResponse.helperServices
      );
      expect(mgr.context.currentUser).toEqual(
        onlinePortalSelfWithLimitsResponse.user
      );
      expect(mgr.context.portal).toEqual(onlinePortalSelfWithLimitsResponse);
      // Partnered Orgs
      expect(mgr.context.trustedOrgIds).toEqual([
        "5dIUy6DulN1DTIcJ",
        "RWOqjImnJn06yrVq",
      ]);
      expect(mgr.context.trustedOrgs).toEqual(
        onlinePartneredOrgResponse.trustedOrgs
      );
      expect(mgr.context.isCommunityOrg).toBeFalsy();
      expect(mgr.context.isOrgAdmin).toBeTruthy();
    });
    it("verify tokens when passed session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      spyOn(permissionsModule, "checkPermission").and.callFake(() => {
        return { access: true } as IPermissionAccessResponse;
      });

      const exchangeTokenSpy = spyOn(authModule, "exchangeToken").and.callFake(
        (_: string, clientId: string) => {
          return Promise.resolve(`FAKE-${clientId}-TOKEN`);
        }
      );

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        resourceConfigs: [
          {
            app: "hubforarcgis",
            clientId: "hubforarcgis",
          },
        ],
      });

      // assertions
      expect(mgr.context.id).toBeGreaterThanOrEqual(t);
      // verify exchange token call
      expect(exchangeTokenSpy).toHaveBeenCalled();
      const args = exchangeTokenSpy.calls.argsFor(0);
      expect(args[0]).toBe(MOCK_AUTH.token);
      expect(args[1]).toBe("hubforarcgis");

      // Resource Configs and Tokens
      expect(mgr.context.userResourceTokens).toEqual([
        {
          app: "self",
          clientId: MOCK_AUTH.clientId,
          token: MOCK_AUTH.token,
        },
        {
          app: "hubforarcgis",
          clientId: "hubforarcgis",
          token: "FAKE-hubforarcgis-TOKEN",
        },
      ]);
    });
    it("verify flags when passed session", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const fetchSettingsSpy = spyOn(
        userResourcesModule,
        "getUserResource"
      ).and.callFake(() => {
        return Promise.resolve({
          schemaVersion: 1.1,
          features: {
            workspace: true,
          },
        });
      });
      const exchangeTokenSpy = spyOn(authModule, "exchangeToken").and.callFake(
        (_: string, clientId: string) => {
          return Promise.resolve(`FAKE-${clientId}-TOKEN`);
        }
      );

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        resourceConfigs: [
          {
            app: "hubforarcgis",
            clientId: "hubforarcgis",
          },
        ],
      });

      // assertions

      // verify exchange token call
      expect(exchangeTokenSpy).toHaveBeenCalled();

      // verify userHubSettings
      expect(fetchSettingsSpy).toHaveBeenCalled();
      expect(mgr.context.userHubSettings).toEqual({
        schemaVersion: 1.1,
        features: {
          workspace: true,
        },
      });

      expect(mgr.context.featureFlags["hub:feature:workspace"]).toBeTruthy();
    });

    it("verify flags not set if feature false when passed session", async () => {
      // const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const fetchSettingsSpy = spyOn(
        userResourcesModule,
        "getUserResource"
      ).and.callFake(() => {
        return Promise.resolve({
          schemaVersion: 1,
          features: {
            workspace: false,
          },
        });
      });
      const exchangeTokenSpy = spyOn(authModule, "exchangeToken").and.callFake(
        (_: string, clientId: string) => {
          return Promise.resolve(`FAKE-${clientId}-TOKEN`);
        }
      );

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        resourceConfigs: [
          {
            app: "hubforarcgis",
            clientId: "hubforarcgis",
          },
        ],
      });

      // assertions

      // verify exchange token call
      expect(exchangeTokenSpy).toHaveBeenCalled();

      // verify userHubSettings
      expect(fetchSettingsSpy).toHaveBeenCalled();
      expect(mgr.context.userHubSettings).toEqual({
        schemaVersion: 1.1,
        features: {
          workspace: false,
        },
      });

      expect(mgr.context.featureFlags["hub:feature:workspace"]).toBeFalsy();
    });
    it("verify props when passed session, portalSelf, User, and serviceStatus", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        portal: onlinePortalSelfWithLimitsResponse,
        currentUser: onlineUserResponse,
        serviceStatus: { domains: "online" } as HubServiceStatus,
        properties: {
          alphaOrgs: ["FAKEID", "FOTHERID"],
          betaOrgs: ["FAKEID"],
        },
      });
      expect(selfSpy.calls.count()).toBe(0);
      expect(userSpy.calls.count()).toBe(0);
      expect(mgr.context.currentUser).toEqual(onlineUserResponse);
      expect(mgr.context.portal).toEqual(onlinePortalSelfWithLimitsResponse);
      expect(mgr.context.session).toBe(MOCK_AUTH);
      expect(mgr.context.serviceStatus).toEqual({
        domains: "online",
      } as HubServiceStatus);
      expect(mgr.context.properties.alphaOrgs).toEqual(["FAKEID", "FOTHERID"]);
      expect(mgr.context.isAlphaOrg).toBeTruthy();
      expect(mgr.context.isBetaOrg).toBeTruthy();
      expect(mgr.context.orgThumbnailUrl).toBe(
        `${MOCK_AUTH.portal}/portals/FAKEID/resources/fake-thumbnail.jpg?token=${MOCK_AUTH.token}`
      );
      expect(mgr.context.survey123Url).toEqual("https://survey123.arcgis.com");
    });
    it("verify props update setting session after", async () => {
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
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
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
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
    it("verify does not fetch additional info if passed in", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      const trustedSpy = spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const exchangeSpy = spyOn(authModule, "exchangeToken").and.callFake(
        (_: string, cid: string) => {
          return Promise.resolve(`FAKE-TOKEN-FOR-${cid}`);
        }
      );
      const orgLimitSpy = spyOn(orgLimitsModule, "fetchOrgLimits").and.callFake(
        () => {
          return Promise.resolve(portalLimitsResponse);
        }
      );

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        serviceStatus: {} as unknown as HubServiceStatus,
        portal: { fake: "portal", limits: {} } as unknown as IPortal,
        currentUser: { username: "fakeuser" } as unknown as portalModule.IUser,
        trustedOrgs: cloneObject(onlinePartneredOrgResponse.trustedOrgs),
        resourceTokens: [{ app: "self", clientId: "bar", token: "FAKETOKEN" }],
        resourceConfigs: [{ app: "arcgisonline", clientId: "arcgisonline" }],
      });

      expect(selfSpy).not.toHaveBeenCalled();
      expect(userSpy).not.toHaveBeenCalled();
      expect(trustedSpy).not.toHaveBeenCalled();
      expect(exchangeSpy).not.toHaveBeenCalled();
      expect(orgLimitSpy).not.toHaveBeenCalled();

      expect(mgr.context.tokenFor("self")).toEqual("FAKETOKEN");
      expect(mgr.context.tokenFor("arcgisonline")).toBeUndefined();
    });
    it("verify fetches additional info if not passed in", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      const trustedSpy = spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const exchangeSpy = spyOn(authModule, "exchangeToken").and.callFake(
        (_: string, cid: string) => {
          return Promise.resolve(`FAKE-TOKEN-FOR-${cid}`);
        }
      );
      await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        // we only exchange tokens if resource configs are passed in
        resourceConfigs: [{ app: "arcgisonline", clientId: "arcgisonline" }],
      });

      expect(selfSpy).toHaveBeenCalled();
      expect(userSpy).toHaveBeenCalled();
      expect(trustedSpy).toHaveBeenCalled();
      // we only exchange tokens if resource configs are passed in
      expect(exchangeSpy).toHaveBeenCalled();
    });
    it("handles throw from exchangeToken", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      const trustedSpy = spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const exchangeSpy = spyOn(authModule, "exchangeToken").and.callFake(
        () => {
          return Promise.reject("FAIL");
        }
      );
      // flex case where auth does not have clientId
      const token = "fake-token";
      const MOCK_AUTH_NO_CLIENTID = {
        getToken: () => Promise.resolve(token),
        redirectUri: "https://example-app.com/redirect-uri",
        token,
        tokenExpires: TOMORROW,
        refreshToken: "refreshToken",
        refreshTokenExpires: TOMORROW,
        refreshTokenTTL: 1440,
        username: "casey",
        password: "123456",
        portal: "https://myorg.maps.arcgis.com/sharing/rest",
      } as any;

      await ArcGISContextManager.create({
        authentication: MOCK_AUTH_NO_CLIENTID,
        // we only exchange tokens if resource configs are passed in
        resourceConfigs: [{ app: "arcgisonline", clientId: "arcgisonline" }],
      });

      expect(selfSpy).toHaveBeenCalled();
      expect(userSpy).toHaveBeenCalled();
      expect(trustedSpy).toHaveBeenCalled();
      // we only exchange tokens if resource configs are passed in
      expect(exchangeSpy).toHaveBeenCalled();
    });
    it("throws if fetch fails", async () => {
      const invalidToken = ExceptionFactory.createInvalidTokenError();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.reject(invalidToken);
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });

      try {
        await ArcGISContextManager.create({ authentication: MOCK_AUTH });
      } catch (ex) {
        const error = ex as { message?: string };
        expect(error).toBeDefined();
      }
    });
    it("serializes anon manager to string", async () => {
      const mgr = await ArcGISContextManager.create();
      const serialized = mgr.serialize();
      const decoded = JSON.parse(base64ToUnicode(serialized));
      expect(decoded.session).not.toBeDefined();
      expect(decoded.portal).not.toBeDefined();
      expect(decoded.currentUser).not.toBeDefined();
      expect(decoded.properties.alphaOrgs).toBeDefined();
      expect(decoded.portalUrl).toEqual("https://www.arcgis.com");
    });
    it("serializes all props to encoded string", async () => {
      // const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      spyOn(orgLimitsModule, "fetchOrgLimits").and.callFake(() => {
        return Promise.resolve(portalLimitsResponse);
      });

      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        properties: { foo: "bar" },
      });
      const serialized = mgr.serialize();
      // verify that the serialized session is encoded by decoding it
      // and converting back into json
      const decoded = JSON.parse(base64ToUnicode(serialized));
      expect(decoded.session).toEqual(MOCK_AUTH.serialize());
      expect(decoded.portal).toEqual(onlinePortalSelfWithLimitsResponse);
      expect(decoded.currentUser).toEqual(onlineUserResponse);
      expect(decoded.properties.foo).toEqual("bar");
      expect(decoded.properties.alphaOrgs).toBeDefined();
    });
    it("can deserialize minimal context", async () => {
      const serialized = unicodeToBase64(
        JSON.stringify({ portalUrl: "https://www.arcgis.com" })
      );
      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      expect(mgr.context.isAuthenticated).toBeFalsy();
    });
    it("can deserialize featureFlags ", async () => {
      const serialized = unicodeToBase64(
        JSON.stringify({
          portalUrl: "https://www.arcgis.com",
          featureFlags: { "hub:project:create": false },
        })
      );
      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(mgr.context.portalUrl).toBe("https://www.arcgis.com");
      expect(mgr.context.isAuthenticated).toBeFalsy();
      expect(mgr.context.featureFlags).toEqual({ "hub:project:create": false });
    });
    it("can deserialize full, valid context", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      spyOn(orgLimitsModule, "fetchOrgLimits").and.callFake(() => {
        return Promise.resolve(portalLimitsResponse);
      });
      const serialized = unicodeToBase64(
        JSON.stringify(validSerializedContext)
      );

      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(selfSpy.calls.count()).toBe(0);
      expect(userSpy.calls.count()).toBe(0);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(mgr.context.isAuthenticated).toBeTruthy();
      expect(mgr.context.currentUser).toEqual(
        validSerializedContext.currentUser
      );
      expect(mgr.context.portal).toEqual(validSerializedContext.portal);
      expect(mgr.context.currentUser).toEqual(
        validSerializedContext.currentUser
      );
      expect(mgr.context.session.token).toEqual(validSession.token);
      // trusted orgs/ids
      expect(mgr.context.trustedOrgIds).toEqual(
        validSerializedContext.trustedOrgIds
      );
      expect(mgr.context.trustedOrgs).toEqual(
        validSerializedContext.trustedOrgs
      );
    });
    it("can deserialize sparse, valid context", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      spyOn(orgLimitsModule, "fetchOrgLimits").and.callFake(() => {
        return Promise.resolve(portalLimitsResponse);
      });
      const sparseValidContext = cloneObject(validSerializedContext) as any;
      delete sparseValidContext.currentUser;
      delete sparseValidContext.portal;
      delete sparseValidContext.properties;
      delete sparseValidContext.trustedOrgIds;
      delete sparseValidContext.trustedOrgs;

      const serialized = unicodeToBase64(JSON.stringify(sparseValidContext));
      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(selfSpy.calls.count()).toBe(1);
      expect(userSpy.calls.count()).toBe(1);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(mgr.context.isAuthenticated).toBeTruthy();
      expect(mgr.context.currentUser).toEqual(onlineUserResponse);
      expect(mgr.context.portal).toEqual(onlinePortalSelfWithLimitsResponse);
      expect(mgr.context.session.token).toEqual(validSession.token);
    });
    it("can deserialize full, expired context", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(onlineUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const serialized = unicodeToBase64(
        JSON.stringify(expiredSerializedContext)
      );
      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(selfSpy.calls.count()).toBe(0);
      expect(userSpy.calls.count()).toBe(0);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(mgr.context.isAuthenticated).toBeFalsy();
      expect(mgr.context.currentUser).not.toBeDefined();
      expect(mgr.context.portal).not.toBeDefined();
      expect(mgr.context.session).not.toBeDefined();
    });
    it("updateUserHubSettings throws is used is not authd", async () => {
      const mgr = await ArcGISContextManager.create();
      try {
        await mgr.updateUserHubSettings({} as IUserHubSettings);
      } catch (ex) {
        expect(ex).toBeDefined();
      }
    });
    it("updating userHubSettings updates flags", async () => {
      // spy on updateUserHubSettings
      const uarSpy = spyOn(
        appResourcesModule,
        "updateUserHubSettings"
      ).and.callFake(() => {
        return Promise.resolve(null);
      });
      const mgr = await ArcGISContextManager.create({
        authentication: MOCK_AUTH,
        serviceStatus: {} as unknown as HubServiceStatus,
        portal: { fake: "portal" } as unknown as IPortal,
        currentUser: { username: "fakeuser" } as unknown as portalModule.IUser,
        trustedOrgs: cloneObject(onlinePartneredOrgResponse.trustedOrgs),
        resourceTokens: [{ app: "self", clientId: "bar", token: "FAKETOKEN" }],
        resourceConfigs: [{ app: "arcgisonline", clientId: "arcgisonline" }],
      });
      // Ensude default
      expect(mgr.context.featureFlags["hub:feature:workspace"]).toBeFalsy();
      // update the HubUserSettings
      await mgr.updateUserHubSettings({
        schemaVersion: 1.1,
        features: {
          workspace: true,
        },
      });
      expect(uarSpy).toHaveBeenCalled();
      // verify the flag was updated
      expect(mgr.context.featureFlags["hub:feature:workspace"]).toBeTruthy();
      // set to false
      await mgr.updateUserHubSettings({
        schemaVersion: 1.1,
        features: {
          workspace: false,
        },
      });
      expect(mgr.context.featureFlags["hub:feature:workspace"]).toBeFalsy();
    });
    it("can refresh user", async () => {
      const selfSpy = spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePortalSelfWithLimitsResponse));
      });
      const updatedUserResponse = cloneObject(onlineUserResponse);
      updatedUserResponse.groups.push({
        id: "ff0",
        title: "Fake Group 2",
        userMembership: {
          username: "jvader",
          memberType: "admin",
          applications: 0,
        },
      } as portalModule.IGroup);
      const userSpy = spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(updatedUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.resolve(cloneObject(onlinePartneredOrgResponse));
      });
      const serialized = unicodeToBase64(
        JSON.stringify(validSerializedContext)
      );

      const mgr = await ArcGISContextManager.deserialize(serialized);
      expect(selfSpy.calls.count()).toBe(0);
      expect(userSpy.calls.count()).toBe(0);
      expect(mgr.context.portalUrl).toBe(
        MOCK_AUTH.portal.replace(`/sharing/rest`, "")
      );
      expect(mgr.context.isAuthenticated).toBeTruthy();
      expect(mgr.context.currentUser).toEqual(
        validSerializedContext.currentUser
      );
      expect(mgr.context.currentUser.groups?.length).toEqual(1);
      // call refresh user
      await mgr.context.refreshUser();
      expect(userSpy.calls.count()).toBe(1);
      expect(mgr.context.currentUser.groups?.length).toEqual(2);
      expect(mgr.context.currentUser).toEqual(updatedUserResponse);
    });
  });

  describe("Enterprise:", () => {
    it("verify props when passed just portalUrl", async () => {
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
      expect(mgr.context.ogcApiUrl).toBeUndefined();
      expect(mgr.context.hubHomeUrl).toBe(
        "https://myenterprise.com/gis/apps/sites/#/home"
      );
      expect(mgr.context.discussionsServiceUrl).toBeUndefined();
      expect(mgr.context.hubSearchServiceUrl).toBeUndefined();
      expect(mgr.context.domainServiceUrl).toBeUndefined();
      expect(mgr.context.survey123Url).toEqual("https://survey123.arcgis.com");
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
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.reject(cloneObject(enterprisePartneredOrgResponse));
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
      expect(mgr.context.survey123Url).toEqual("https://survey123.arcgis.com");
      // Partnered orgs
      expect(mgr.context.trustedOrgIds).toEqual([]);
      expect(mgr.context.trustedOrgs).toEqual([]);
    });
    it("verify props after clearing session", async () => {
      const t = new Date().getTime();
      spyOn(portalModule, "getSelf").and.callFake(() => {
        return Promise.resolve(cloneObject(enterprisePortalSelfResponse));
      });
      spyOn(portalModule, "getUser").and.callFake(() => {
        return Promise.resolve(cloneObject(enterpriseUserResponse));
      });
      spyOn(requestModule, "request").and.callFake(() => {
        return Promise.reject(cloneObject(enterprisePartneredOrgResponse));
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
      expect(mgr.context.survey123Url).toEqual("https://survey123.arcgis.com");
    });
  });
  describe("extra coverage:", () => {
    it("handles devext urls", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://qaext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
      expect(mgr.context.survey123Url).toEqual(
        "https://survey123qa.arcgis.com"
      );
    });
    it("handles devext urls", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://devext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
      expect(mgr.context.survey123Url).toEqual(
        "https://survey123dev.arcgis.com"
      );
    });
    it("sign out on qa, resets portalUrl correctly", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://org.mapsqa.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
      mgr.clearAuthentication();
      expect(mgr.context.hubUrl).toBe("https://hubqa.arcgis.com");
      expect(mgr.context.portalUrl).toBe("https://qaext.arcgis.com");
      expect(mgr.context.survey123Url).toEqual(
        "https://survey123qa.arcgis.com"
      );
    });
    it("sign out on dev, resets portalUrl correctly", async () => {
      const mgr = await ArcGISContextManager.create({
        portalUrl: "https://org.mapsdevext.arcgis.com",
      });
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
      mgr.clearAuthentication();
      expect(mgr.context.hubUrl).toBe("https://hubdev.arcgis.com");
      expect(mgr.context.portalUrl).toBe("https://devext.arcgis.com");
      expect(mgr.context.survey123Url).toEqual(
        "https://survey123dev.arcgis.com"
      );
    });
    it("handles ArcGISContext properties undefined", () => {
      const ctx = new ArcGISContext({
        id: 12,
        portalUrl: "https://some.server.com",
      });
      expect(ctx.isAlphaOrg).toBeFalsy();
      expect(ctx.isBetaOrg).toBeFalsy();
    });
  });
});
