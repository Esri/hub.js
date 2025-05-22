/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IHubRequestOptions } from "@esri/hub-common";
// Fake Session for use in tests...

export const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

const token = "fake-token";
const username = "vader";
export const MOCK_USER_SESSION = {
  getToken: () => Promise.resolve(token),
  getUsername: () => Promise.resolve(username),
  portal: "https://www.arcgis.com/sharing/rest",
  username,
  password: "123456",
  token,
  tokenExpires: TOMORROW,
} as any;

export const MOCK_REQUEST_OPTIONS = {
  authentication: MOCK_USER_SESSION,
};

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
