/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ArcGISContext, IHubRequestOptions } from "../../src";
import type { IArcGISContext } from "../../src";

export const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

const token = "fake-token";

export const MOCK_AUTH = {
  clientId: "clientId",
  getToken: () => Promise.resolve(token),
  serialize: () => JSON.stringify({ token }),
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

export const MOCK_AUTH_QA = {
  clientId: "clientId",
  getToken: () => Promise.resolve(token),
  serialize: () => JSON.stringify({ token }),
  redirectUri: "https://example-app.com/redirect-uri",
  token,
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "casey",
  password: "123456",
  portal: "https://myorg.mapsqa.arcgis.com/sharing/rest",
} as any;

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
  portal: "https://myorg.maps.arcgis.com",
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

export const MOCK_ENTERPRISE_AUTH = {
  clientId: "clientId",
  getToken: () => Promise.resolve(token),
  serialize: () => JSON.stringify({ token }),
  redirectUri: "https://example-app.com/redirect-uri",
  token,
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "vader",
  password: "123456",
  portal: "https://my-server.com/portal/sharing/rest",
} as any;

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

export function getMockContextWithPrivilenges(
  privileges: string[]
): IArcGISContext {
  return new ArcGISContext({
    id: 123,
    currentUser: {
      username: "mock_user",
      favGroupId: "456abc",
      orgId: "789def",
      privileges,
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
      "hub-downloads": "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  }) as IArcGISContext;
}

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
    portalHostname: "host",
    customBaseUrl: "customUrl",
  },
  serviceStatus: {
    portal: "online",
    discussions: "online",
    events: "online",
    metrics: "online",
    notifications: "online",
    "hub-search": "online",
    domains: "online",
    "hub-downloads": "online",
  },
  userHubSettings: {
    schemaVersion: 1,
  },
}) as IArcGISContext;

export const MOCK_ANON_CONTEXT = new ArcGISContext({
  id: 123,
  currentUser: undefined,
  portalUrl: "https://qaext.arcgis.com",
  hubUrl: "https://hubqa.arcgis.com",
  authentication: undefined,
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
    "hub-downloads": "online",
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
      "hub-downloads": "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  });
}

export function createMockAnonContext(): ArcGISContext {
  return new ArcGISContext({
    id: 123,
    currentUser: undefined,
    portalUrl: "https://qaext.arcgis.com",
    hubUrl: "https://hubqa.arcgis.com",
    authentication: undefined,
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
      "hub-downloads": "online",
    },
    userHubSettings: {
      schemaVersion: 1,
    },
  });
}
