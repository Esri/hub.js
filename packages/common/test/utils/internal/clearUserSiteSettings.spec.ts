import { describe, it, expect, vi, afterEach } from "vitest";
import { IUser } from "@esri/arcgis-rest-portal";
import { ArcGISContext } from "../../../src/ArcGISContext";

import * as resourceModule from "../../../src/utils/internal/userAppResources";
import {
  USER_SITE_SETTINGS_KEY,
  clearUserSiteSettings,
} from "../../../src/utils/internal/clearUserSiteSettings";

describe("clearUserSiteSettings:", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("delegates to removeUserResource", async () => {
    const spy = vi
      .spyOn(resourceModule as any, "removeUserResource")
      .mockImplementation(() => Promise.resolve({ success: true }));
    const ctx = new ArcGISContext({
      id: 1,
      portalUrl: "https://www.arcgis.com",
      currentUser: {
        username: "jsmith",
      } as unknown as IUser,
      userResourceTokens: [
        {
          app: "self",
          token: "FAKESITETOKEN",
          clientId: "FAKECLIENTID",
        },
      ],
    });
    const chk = await clearUserSiteSettings(ctx);
    expect(chk).toEqual({ success: true });
    expect(spy).toHaveBeenCalled();
    // verify args
    const [username, key, url, token] = (spy as any).mock.calls[0];
    expect(key).toBe(USER_SITE_SETTINGS_KEY);
    expect(username).toBe("jsmith");
    expect(url).toBe(ctx.portalUrl);
    expect(token).toBe("FAKESITETOKEN");
  });
});
