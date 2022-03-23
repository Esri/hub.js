import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "../../src";

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
