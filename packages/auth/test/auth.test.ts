import { finishOAuth2 } from "../src/index";
import { IUserSessionOptions, UserSession } from "@esri/arcgis-rest-auth";

import * as fetchMock from "fetch-mock";

describe("auth", () => {
  const username = "c@sey";
  const userResponse = {
    username,
    created: 1533848710488,
    orgId: "orgId"
  };
  const MockWindow = {
    // TODO: remove these props, they're not needed now that we stub UserSession.completeOAuth2
    // parent: {
    //   __ESRI_REST_AUTH_HANDLER_clientId(
    //     errorString: string,
    //     oauthInfoString: string
    //   ) {
    //     const oauthInfo = JSON.parse(oauthInfoString);
    //     expect(oauthInfo.token).toBe("token");
    //     expect(oauthInfo.username).toBe("c@sey");
    //     expect(new Date(oauthInfo.expires).getTime()).toBeGreaterThan(
    //       Date.now()
    //     );
    //   }
    // },
    // close() {
    //   done();
    // },
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
    // mock user response
    fetchMock.once(
      // TODO: remove %26expires_in%3D1209600
      `https://www.arcgis.com/sharing/rest/community/users/${username}?f=json&token=token%26expires_in%3D1209600`,
      userResponse
    );
    // stub completeOAuth2 - we only care that it was called w/ the options
    spyOn(UserSession, "completeOAuth2").and.stub();
  });

  describe("when the user was NOT just created", () => {
    it("should fetch user and pass options to completeOAuth2", done => {
      finishOAuth2(oauth2Options, MockWindow).then(() => {
        expect(UserSession.completeOAuth2).toHaveBeenCalledWith(oauth2Options);
        done();
      });
    });
  });

  // TODO: also mock the update request and test this:
  // describe('when the user was just created', () => {
  //   it("should update user and pass options to completeOAuth2", done => {
  //     done();
  //   });
  // });
});
