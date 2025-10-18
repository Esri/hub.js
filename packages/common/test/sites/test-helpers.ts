import { IHubRequestOptions } from "../../src/hub-types";

export function expectAllCalled(spys: any[], expectFn: any) {
  expectAll(spys, "toHaveBeenCalled", true, expectFn);
}

export function expectAll(
  args: any[],
  method: string,
  should: boolean,
  expectFn: any
) {
  const assertFunc = should
    ? (arg: any) => expectFn(arg)[method]()
    : (arg: any) => expectFn(arg).not[method]();
  args.forEach(assertFunc);
}

export const getTomorrow = function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
};

export const TOMORROW = getTomorrow();

const token = "fake-token";
export const MOCK_USER_SESSION = {
  clientId: "clientId",
  getToken: () => Promise.resolve(token),
  redirectUri: "https://example-app.com/redirect-uri",
  token,
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "luke",
  password: "teHf0rc3",
  portal: "https://myorg.maps.arcgis.com/sharing/rest",
} as any;

export const MOCK_HUB_REQOPTS = {
  authentication: MOCK_USER_SESSION,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy org",
    urlKey: "org",
  },
  isPortal: false,
  hubApiUrl: "https://hubqa.arcgis.com",
} as unknown as IHubRequestOptions;

export const MOCK_PORTAL_USER_SESSION = {
  clientId: "clientId",
  getToken: () => Promise.resolve(token),
  redirectUri: "https://example-app.com/redirect-uri",
  token,
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  refreshTokenTTL: 1440,
  username: "luke",
  password: "teHf0rc3",
  portal: "https://myportal.foo.com/instancename/sharing/rest",
} as any;

export const MOCK_PORTAL_REQOPTS = {
  authentication: MOCK_PORTAL_USER_SESSION,
  portalSelf: {
    id: "orgIdFromPortalSelf",
    name: "my spiffy portal",
    urlKey: "portalOrg",
  },
  isPortal: true,
} as unknown as IHubRequestOptions;
