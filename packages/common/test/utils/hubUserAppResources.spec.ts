import type { IUser } from "@esri/arcgis-rest-portal";
import * as resourceModule from "../../src/utils/internal/userAppResources";
import { USER_SITE_SETTINGS_KEY } from "../../src/utils/internal/clearUserSiteSettings";
import { USER_HUB_SETTINGS_KEY } from "../../src/utils/internal/clearUserHubSettings";
import { ArcGISContext } from "../../src/ArcGISContext";
import { IUserSiteSettings } from "../../src/utils/IUserSiteSettings";
import {
  fetchUserHubSettings,
  fetchUserSiteSettings,
  updateUserHubSettings,
  updateUserSiteSettings,
} from "../../src/utils/hubUserAppResources";
import { IUserHubSettings } from "../../src/utils/IUserHubSettings";

import { describe, it, expect, vi, beforeEach } from "vitest";

describe("hubUserAppResources:", () => {
  describe("updateUserSiteSettings:", () => {
    let spy: ReturnType<typeof vi.fn>;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = vi
        .spyOn(resourceModule, "setUserResource")
        .mockImplementation(() => {
          return Promise.resolve();
        });
    });
    it("sends resource", async () => {
      const settings: IUserSiteSettings = {
        username: "should change",
        updated: 0,
        schemaVersion: 1,
      };
      ctx = new ArcGISContext({
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
      await updateUserSiteSettings(settings, ctx);
      expect(spy).toHaveBeenCalled();
      // inspect the args
      const [resource, username, url, token, replace] = (spy as any).mock
        .calls[0];
      expect(resource.key).toBe(USER_SITE_SETTINGS_KEY);
      expect(resource.data.username).toBe("jsmith");
      expect(resource.data.updated).toBeGreaterThan(0);
      expect(resource.data.schemaVersion).toBe(1);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKESITETOKEN");
      expect(replace).toBe(false);
      await updateUserSiteSettings(settings, ctx, true);
      expect((spy as any).mock.calls[1][4]).toBe(true);
    });
    it("throws if token not found for ", async () => {
      const settings: IUserSiteSettings = {
        username: "should change",
        updated: 0,
        schemaVersion: 1,
      };
      ctx = new ArcGISContext({
        id: 1,
        portalUrl: "https://www.arcgis.com",
        currentUser: {
          username: "jsmith",
        } as unknown as IUser,
        userResourceTokens: [
          {
            app: "arcgisonline",
            token: "FAKESITETOKEN",
            clientId: "FAKECLIENTID",
          },
        ],
      });
      try {
        await updateUserSiteSettings(settings, ctx);
      } catch (err) {
        const ex = err as Error;
        expect(ex.message).toContain("user-app-resource token available");
      }
    });
  });
  describe("fetchUserSiteSettings:", () => {
    let spy: ReturnType<typeof vi.fn>;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = vi
        .spyOn(resourceModule, "getUserResource")
        .mockImplementation(() => {
          return Promise.resolve({ fake: "settings" });
        });
    });
    it("get resource", async () => {
      ctx = new ArcGISContext({
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
      const settings = await fetchUserSiteSettings(ctx);
      expect(settings).toEqual({
        fake: "settings",
      } as unknown as IUserSiteSettings);
      expect(spy).toHaveBeenCalled();
      const [username, key, url, token] = (spy as any).mock.calls[0];
      expect(key).toBe(USER_SITE_SETTINGS_KEY);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKESITETOKEN");
    });
    it("returns null if no token", async () => {
      ctx = new ArcGISContext({
        id: 1,
        portalUrl: "https://www.arcgis.com",
        currentUser: {
          username: "jsmith",
        } as unknown as IUser,
        userResourceTokens: [
          {
            app: "arcgisonline",
            token: "FAKESITETOKEN",
            clientId: "FAKECLIENTID",
          },
        ],
      });

      const settings = await fetchUserSiteSettings(ctx);
      expect(settings).toBeNull();
    });
  });
  describe("updateUserHubSettings:", () => {
    let spy: ReturnType<typeof vi.fn>;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = vi
        .spyOn(resourceModule, "setUserResource")
        .mockImplementation(() => {
          return Promise.resolve();
        });
    });
    it("sends resource", async () => {
      const settings: IUserHubSettings = {
        username: "should change",
        updated: 0,
        schemaVersion: 1,
      };
      ctx = new ArcGISContext({
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
      await updateUserHubSettings(settings, ctx);
      expect(spy).toHaveBeenCalled();
      // inspect the args
      let [resource, username, url, token, replace] = (spy as any).mock
        .calls[0];
      expect(replace).toBe(false);
      expect(resource.key).toBe(USER_HUB_SETTINGS_KEY);
      expect(resource.data.username).toBe("jsmith");
      expect(resource.data.updated).toBeGreaterThan(0);
      expect(resource.data.schemaVersion).toBe(1);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKEHUBTOKEN");
      await updateUserHubSettings(settings, ctx, true);
      [resource, username, url, token, replace] = (spy as any).mock.calls[1];
      expect(replace).toBe(true);
    });
    it("throws if token not found for ", async () => {
      const settings: IUserSiteSettings = {
        username: "should change",
        updated: 0,
        schemaVersion: 1,
      };
      ctx = new ArcGISContext({
        id: 1,
        portalUrl: "https://www.arcgis.com",
        currentUser: {
          username: "jsmith",
        } as unknown as IUser,
        userResourceTokens: [
          {
            app: "arcgisonline",
            token: "FAKEAGOTOKEN",
            clientId: "arcgisonline",
          },
        ],
      });
      try {
        await updateUserHubSettings(settings, ctx);
      } catch (err) {
        const ex = err as Error;
        expect(ex.message).toContain("user-app-resource token available");
      }
    });
  });
  describe("fetchUserHubSettings:", () => {
    let spy: ReturnType<typeof vi.fn>;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = vi
        .spyOn(resourceModule, "getUserResource")
        .mockImplementation(() => {
          return Promise.resolve({ fake: "settings" });
        });
    });
    it("get resource", async () => {
      ctx = new ArcGISContext({
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
      const settings = await fetchUserHubSettings(ctx);
      expect(settings).toEqual({
        fake: "settings",
      } as unknown as IUserHubSettings);
      expect(spy).toHaveBeenCalled();
      const [username, key, url, token] = (spy as any).mock.calls[0];
      expect(key).toBe(USER_HUB_SETTINGS_KEY);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKEHUBTOKEN");
    });
    it("returns null if no token", async () => {
      ctx = new ArcGISContext({
        id: 1,
        portalUrl: "https://www.arcgis.com",
        currentUser: {
          username: "jsmith",
        } as unknown as IUser,
        userResourceTokens: [
          {
            app: "arcgisonline",
            token: "FAKESITETOKEN",
            clientId: "FAKECLIENTID",
          },
        ],
      });

      const settings = await fetchUserHubSettings(ctx);
      expect(settings).toBeNull();
    });
  });
});
