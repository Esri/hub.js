/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { registerForEvent, unregisterForEvent } from "../src/register";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as groups from "@esri/arcgis-rest-portal";

export const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("register/unregister methods", () => {
  const MOCK_REQOPTS = {
    authentication: new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "casey",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    })
  };

  it("should help a user register for an event", done => {
    const joinGroupParamsSpy = spyOn(groups, "joinGroup").and.returnValue(
      new Promise(resolve => {
        resolve({ success: true, groupId: "5bc" });
      })
    );

    registerForEvent({ groupId: "5bc", ...MOCK_REQOPTS })
      .then(() => {
        expect(joinGroupParamsSpy.calls.count()).toEqual(1);
        const opts = joinGroupParamsSpy.calls.argsFor(
          0
        )[0] as groups.IUserGroupOptions;
        expect(opts.id).toBe("5bc");
        expect(opts.authentication).toBe(MOCK_REQOPTS.authentication);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should help a user unregister for an event.", done => {
    const leaveGroupParamsSpy = spyOn(groups, "leaveGroup").and.returnValue(
      new Promise(resolve => {
        resolve({ success: true, groupId: "5bc" });
      })
    );

    unregisterForEvent({ groupId: "5bc", ...MOCK_REQOPTS })
      .then(() => {
        expect(leaveGroupParamsSpy.calls.count()).toEqual(1);
        const opts = leaveGroupParamsSpy.calls.argsFor(
          0
        )[0] as groups.IUserGroupOptions;
        expect(opts.id).toBe("5bc");
        expect(opts.authentication).toBe(MOCK_REQOPTS.authentication);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
