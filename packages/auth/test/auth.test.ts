// import { checkSignInStatus } from "../src/index";

import * as fetchMock from "fetch-mock";

const TOMORROW = new Date().setDate(new Date().getDate() + 1);

const auth = {
  email: "casey",
  token: "&^D...",
  culture: "en",
  region: "WO",
  expires: TOMORROW,
  allSSL: false,
  accountId: "uCXeTVfooP4IIcx",
  role: "account_admin",
  urlKey: "subdomain",
  customBaseUrl: "maps.arcgis.com"
};

const staleAuth = {
  ...auth,
  expires: new Date().setDate(new Date().getDate() - 1)
};

// don't test browser behavior in Node.js
if (typeof window !== "undefined" && typeof document !== "undefined") {
  describe("browser auth login", () => {
    //   it("should return null when no evidence of previous login can be found", done => {
    //     const check = checkSignInStatus();
    //     expect(check).toEqual(null);
    //     done();
    //   });
    //   it("should return null when a stale token is found", done => {
    //     window.localStorage.setItem(
    //       "torii-provider-arcgis",
    //       JSON.stringify(staleAuth)
    //     );
    //     const check = checkSignInStatus();
    //     expect(check).toEqual(null);
    //     done();
    //   });
    //   it("should return a session when a token is found in localStorage", done => {
    //     window.localStorage.setItem(
    //       "torii-provider-arcgis",
    //       JSON.stringify(auth)
    //     );
    //     const session = checkSignInStatus();
    //     expect(session.token).toEqual("&^D...");
    //     done();
    //   });
    //   it("should return a session when a token is found in a cookie", done => {
    //     document.cookie = `esri_auth=${encodeURIComponent(
    //       JSON.stringify(auth)
    //     )}; other_cookie=something`;
    //     const session = checkSignInStatus();
    //     expect(session.token).toEqual("&^D...");
    //     done();
    //   });
  });
} else {
  describe("Node.js auth login", () => {
    // it("should return null when the method is called from Node.js", done => {
    //   const check = checkSignInStatus();
    //   expect(check).toEqual(null);
    //   done();
    // });
  });
}
