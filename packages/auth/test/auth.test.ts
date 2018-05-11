import { checkSignInStatus } from "../src/index";
// import * as fetchMock from "fetch-mock";

const TOMORROW = new Date().setDate(new Date().getDate() + 1);

const oldauth = {
  email: "casey",
  token: "XYOl7P..",
  culture: "en",
  region: "WO",
  expires: TOMORROW,
  allSSL: false,
  accountId: "uCXeTVfooP4IIcx",
  role: "account_admin",
  urlKey: "subdomain",
  customBaseUrl: "maps.arcgis.com"
};

describe("login", () => {
  it("should return an informative message when no evidence of previous login can be found", done => {
    checkSignInStatus().catch(error => {
      expect(error).toEqual("No evidence of authentication found.");
      done();
    });
  });

  it("should return a session when localStorage is identified", done => {
    window.localStorage.setItem(
      "torii-provider-arcgis",
      JSON.stringify(oldauth)
    );

    checkSignInStatus().then(session => {
      expect(session.token).toEqual("XYOl7P..");
      done();
    });
  });

  it("should return a session when a cookie with the goods is found", done => {
    document.cookie = `esri_auth=${encodeURIComponent(
      JSON.stringify(oldauth)
    )}; other=something`;

    checkSignInStatus().then(session => {
      expect(session.token).toEqual("XYOl7P..");
      done();
    });
  });
});
