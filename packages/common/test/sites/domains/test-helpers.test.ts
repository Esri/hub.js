import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "../../../src";

export const getTomorrow = function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
};

export const TOMORROW = getTomorrow();

export const MOCK_USER_SESSION = new UserSession({
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "luke",
  password: "teHf0rc3",
  portal: "https://myorg.maps.arcgis.com/sharing/rest"
});

export const MOCK_HUB_REQOPTS = ({
  authentication: MOCK_USER_SESSION,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy org",
    urlKey: "org"
  },
  isPortal: false,
  hubApiUrl: "https://hubqa.arcgis.com"
} as unknown) as IHubRequestOptions;

export const MOCK_PORTAL_USER_SESSION = new UserSession({
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "luke",
  password: "teHf0rc3",
  portal: "https://myportal.foo.com/instancename/sharing/rest"
});

export const MOCK_PORTAL_REQOPTS = ({
  authentication: MOCK_PORTAL_USER_SESSION,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy portal",
    urlKey: "portalOrg"
  },
  isPortal: true
} as unknown) as IHubRequestOptions;
