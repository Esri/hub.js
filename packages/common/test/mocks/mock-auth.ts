import { UserSession } from "@esri/arcgis-rest-auth";
import { ArcGISContext, IArcGISContext, IHubRequestOptions } from "../../src";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

export const MOCK_AUTH = new UserSession({
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "casey",
  password: "123456",
  portal: "https://myorg.maps.arcgis.com/sharing/rest",
});

export const MOCK_HUB_REQOPTS = {
  authentication: MOCK_AUTH,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy org",
    urlKey: "org",
    culture: "en-us",
    defaultBasemap: { fake: "basemap" },
  },
  isPortal: false,
  hubApiUrl: "https://hubqa.arcgis.com",
} as unknown as IHubRequestOptions;

export const MOCK_NOAUTH_HUB_REQOPTS = {
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy org",
    urlKey: "org",
    defaultBasemap: { fake: "basemap" },
  },
  isPortal: false,
  hubApiUrl: "https://hubqa.arcgis.com",
} as unknown as IHubRequestOptions;

export const MOCK_ENTERPRISE_AUTH = new UserSession({
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "vader",
  password: "123456",
  portal: "https://my-server.com/portal/sharing/rest",
});

export const MOCK_ENTERPRISE_REQOPTS = {
  authentication: MOCK_ENTERPRISE_AUTH,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy org",
    urlKey: "org",
    culture: "en-us",
    defaultBasemap: { fake: "basemap" },
  },
  isPortal: true,
} as unknown as IHubRequestOptions;

export const MOCK_CONTEXT = new ArcGISContext({
  id: 123,
  currentUser: {
    username: "mock_user",
    favGroupId: "456abc",
    orgId: "789def",
    privileges: [],
  },
  portalUrl: "https://qaext.arcgis.com",
  hubUrl: "https://hubqa.arcgis.com",
  authentication: MOCK_AUTH,
  portalSelf: {
    id: "123",
    name: "My org",
    isPortal: false,
    urlKey: "www",
  },
  serviceStatus: {
    portal: "online",
    discussions: "online",
    events: "online",
    metrics: "online",
    notifications: "online",
    "hub-search": "online",
    domains: "online",
  },
  userHubSettings: {
    schemaVersion: 1,
  },
}) as IArcGISContext;

export const MOCK_ANON_CONTEXT = new ArcGISContext({
  id: 123,
  currentUser: null,
  portalUrl: "https://qaext.arcgis.com",
  hubUrl: "https://hubqa.arcgis.com",
  authentication: null,
  portalSelf: {
    id: "123",
    name: "My org",
    isPortal: false,
    urlKey: "www",
  },
  serviceStatus: {
    portal: "online",
    discussions: "online",
    events: "online",
    metrics: "online",
    notifications: "online",
    "hub-search": "online",
    domains: "online",
  },
  userHubSettings: {
    schemaVersion: 1,
  },
}) as IArcGISContext;

export function createMockContext(): ArcGISContext {
  return new ArcGISContext({
    id: 123,
    currentUser: {
      username: "mock_user",
      favGroupId: "456abc",
      orgId: "789def",
    },
    portalUrl: "https://qaext.arcgis.com",
    hubUrl: "https://hubqa.arcgis.com",
    authentication: MOCK_AUTH,
    portalSelf: {
      id: "123",
      name: "My org",
      isPortal: false,
      urlKey: "www",
    },
    serviceStatus: {
      portal: "online",
      discussions: "online",
      events: "online",
      metrics: "online",
      notifications: "online",
      "hub-search": "online",
      domains: "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  });
}

export function createMockAnonContext(): ArcGISContext {
  return new ArcGISContext({
    id: 123,
    currentUser: null,
    portalUrl: "https://qaext.arcgis.com",
    hubUrl: "https://hubqa.arcgis.com",
    authentication: null,
    portalSelf: {
      id: "123",
      name: "My org",
      isPortal: false,
      urlKey: "www",
    },
    serviceStatus: {
      portal: "online",
      discussions: "online",
      events: "online",
      metrics: "online",
      notifications: "online",
      "hub-search": "online",
      domains: "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  });
}
