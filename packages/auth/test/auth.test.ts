import { finishOAuth2 } from "../src/index";
import { IUserSessionOptions, UserSession } from "@esri/arcgis-rest-auth";

import * as fetchMock from "fetch-mock";

describe("auth", () => {
  it("should callback to create a new user session if finds a valid parent", done => {
    const MockWindow = {
      parent: {
        __ESRI_REST_AUTH_HANDLER_clientId(
          errorString: string,
          oauthInfoString: string
        ) {
          const oauthInfo = JSON.parse(oauthInfoString);
          expect(oauthInfo.token).toBe("token");
          expect(oauthInfo.username).toBe("c@sey");
          expect(new Date(oauthInfo.expires).getTime()).toBeGreaterThan(
            Date.now()
          );
        }
      },
      close() {
        done();
      },
      location: {
        href:
          "https://example-app.com/redirect-uri#access_token=token&expires_in=1209600&username=c%40sey"
      }
    };

    // do i need to mock the supplemental call responses?

    // finishOAuth2(
    //   {
    //     clientId: "clientId",
    //     redirectUri: "https://example-app.com/redirect-uri"
    //   },
    //   MockWindow
    // ).then(() => {
    //   done();
    // });
  });
});
