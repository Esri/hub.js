import { IUser } from "@esri/arcgis-rest-types";
import {
  setUserSiteSettings,
  getUserSiteSettings,
  setUserHubSettings,
  getUserHubSettings,
  IUserSiteSettings,
  ArcGISContext,
  IUserHubSettings,
} from "../../src";

import * as resourceModule from "../../src/utils/internal/userAppResources";
import { USER_SITE_SETTINGS_KEY } from "../../src/utils/internal/clearUserSiteSettings";
import { USER_HUB_SETTINGS_KEY } from "../../src/utils/internal/clearUserHubSettings";

describe("hubUserAppResources:", () => {
  describe("setUserSiteSettings:", () => {
    let spy: jasmine.Spy;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = spyOn(resourceModule, "setUserResource").and.callFake(() => {
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
      await setUserSiteSettings(settings, ctx);
      expect(spy).toHaveBeenCalled();
      // inspect the arts
      const [resource, username, url, token, replace] = spy.calls.argsFor(0);
      expect(resource.key).toBe(USER_SITE_SETTINGS_KEY);
      expect(resource.data.username).toBe("jsmith");
      expect(resource.data.updated).toBeGreaterThan(0);
      expect(resource.data.schemaVersion).toBe(1);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKESITETOKEN");
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
        await setUserSiteSettings(settings, ctx);
      } catch (ex) {
        expect((ex as any).message).toContain(
          "user-app-resource token available"
        );
      }
    });
  });
  describe("getUserSiteSettings:", () => {
    let spy: jasmine.Spy;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = spyOn(resourceModule, "getUserResource").and.callFake(() => {
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
      const settings = await getUserSiteSettings(ctx);
      expect(settings).toEqual({
        fake: "settings",
      } as unknown as IUserSiteSettings);
      expect(spy).toHaveBeenCalled();
      const [username, key, url, token] = spy.calls.argsFor(0);
      expect(key).toEqual(USER_SITE_SETTINGS_KEY);
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

      const settings = await getUserSiteSettings(ctx);
      expect(settings).toBeNull();
    });
  });
  describe("setUserHubSettings:", () => {
    let spy: jasmine.Spy;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = spyOn(resourceModule, "setUserResource").and.callFake(() => {
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
      await setUserHubSettings(settings, ctx);
      expect(spy).toHaveBeenCalled();
      // inspect the arts
      const [resource, username, url, token, replace] = spy.calls.argsFor(0);
      expect(resource.key).toBe(USER_HUB_SETTINGS_KEY);
      expect(resource.data.username).toBe("jsmith");
      expect(resource.data.updated).toBeGreaterThan(0);
      expect(resource.data.schemaVersion).toBe(1);
      expect(username).toBe("jsmith");
      expect(url).toBe(ctx.portalUrl);
      expect(token).toBe("FAKEHUBTOKEN");
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
        await setUserHubSettings(settings, ctx);
      } catch (ex) {
        expect((ex as any).message).toContain(
          "user-app-resource token available"
        );
      }
    });
  });
  describe("getUserHubSettings:", () => {
    let spy: jasmine.Spy;
    let ctx: ArcGISContext;
    beforeEach(() => {
      spy = spyOn(resourceModule, "getUserResource").and.callFake(() => {
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
      const settings = await getUserHubSettings(ctx);
      expect(settings).toEqual({
        fake: "settings",
      } as unknown as IUserHubSettings);
      expect(spy).toHaveBeenCalled();
      const [username, key, url, token] = spy.calls.argsFor(0);
      expect(key).toEqual(USER_HUB_SETTINGS_KEY);
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

      const settings = await getUserHubSettings(ctx);
      expect(settings).toBeNull();
    });
  });
});
