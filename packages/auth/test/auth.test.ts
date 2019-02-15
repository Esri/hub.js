import { completeOAuth2 } from "../src/index";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as fetchMock from "fetch-mock";
describe("auth", () => {
  const username = "c@sey";

  const MockWindow = {
    location: {
      href:
        "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey"
    }
  };
  const oauth2Options = {
    clientId: "clientId",
    redirectUri: "https://example-app.com/redirect-uri"
  };

  afterEach(fetchMock.restore);
  beforeEach(() => {
    // stub completeOAuth2 - we only care that it was called w/ the options
    spyOn(UserSession, "completeOAuth2").and.stub();
  });

  it("should fetch old user metadata and pass options to completeOAuth2", done => {
    const oldUserResponse = {
      username,
      created: 1533848710488,
      orgId: "orgId"
    };

    fetchMock.once(
      `https://www.arcgis.com/sharing/rest/community/users/${username}?f=json&token=token`,
      oldUserResponse
    );
    completeOAuth2(oauth2Options, MockWindow)
      .then(() => {
        expect(UserSession.completeOAuth2).toHaveBeenCalledWith(oauth2Options);
        done();
      })
      .catch(() => fail());
  });

  it("should fetch old user metadata and pass options to completeOAuth2", done => {
    const newUserResponse = {
      username,
      created: Date.now() - 500,
      orgId: "orgId"
    };

    fetchMock.once(
      `https://www.arcgis.com/sharing/rest/community/users/${username}?f=json&token=token`,
      newUserResponse
    );

    fetchMock.once(
      `https://www.arcgis.com/sharing/rest/community/users/${username}/update`,
      {}
    );

    completeOAuth2(oauth2Options, MockWindow)
      .then(() => {
        expect(UserSession.completeOAuth2).toHaveBeenCalledWith(oauth2Options);

        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          `https://www.arcgis.com/sharing/rest/community/users/${username}/update`
        );
        expect(url).toBe(url);
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=token");
        expect(options.body).toContain(
          "tags=hubRole%3Aparticipant%2Corg%3AorgId"
        );
        expect(options.body).toContain("access=public");
        done();
      })
      .catch(() => fail());
  });
});
