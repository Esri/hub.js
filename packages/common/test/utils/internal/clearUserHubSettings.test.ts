import { IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContext } from "../../../src";
import {
  USER_HUB_SETTINGS_KEY,
  clearUserHubSettings,
} from "../../../src/utils/internal/clearUserHubSettings";
import * as resourceModule from "../../../src/utils/internal/userAppResources";

describe("clearUserHubSettings:", () => {
  it("delegates to removeUserResource", async () => {
    const spy = spyOn(resourceModule, "removeUserResource").and.callFake(() => {
      return Promise.resolve({ success: true });
    });
    const ctx = new ArcGISContext({
      id: 1,
      portalUrl: "https://www.arcgis.com",
      currentUser: {
        username: "jsmith",
      } as unknown as IUser,
      userResourceTokens: [
        {
          app: "hubforarcgis",
          token: "FAKEHUBTOKEN",
          clientId: "FAKECLIENTID",
        },
      ],
    });
    const chk = await clearUserHubSettings(ctx);
    expect(chk).toEqual({ success: true });
    expect(spy).toHaveBeenCalled();
    // verify args
    const [username, key, url, token] = spy.calls.argsFor(0);
    expect(key).toBe(USER_HUB_SETTINGS_KEY);
    expect(username).toBe("jsmith");
    expect(url).toBe(ctx.portalUrl);
    expect(token).toBe("FAKEHUBTOKEN");
  });
});
