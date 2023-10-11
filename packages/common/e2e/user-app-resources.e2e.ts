import { UserSession } from "@esri/arcgis-rest-auth";
import {
  ArcGISContextManager,
  IUserHubSettings,
  IUserSiteSettings,
  UserResourceApp,
  getUserHubSettings,
  getUserSiteSettings,
  setUserHubSettings,
  setUserSiteSettings,
} from "../src";
import {
  IAddUserResource,
  getUserResource,
  listUserResources,
  removeUserResource,
  setUserResource,
} from "../src/utils/internal/userAppResources";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { getUser } from "@esri/arcgis-rest-portal";
import { clearUserSiteSettings } from "../src/utils/internal/clearUserSiteSettings";
import { clearUserHubSettings } from "../src/utils/internal/clearUserHubSettings";
/* tslint:disable:no-string-literal */
// NOTE: User App Resources is coupled with oAuth
// so we can't simply create a session via username / pwd
// because the resultant token is NOT tied to a clientId
//
// Auth into uar-harness-qa-pre-a-hub.hubqa.arcgis.com as paige_pa
// ** BE SURE TO AUTH INTO THIS SITE** don't just transition from another site!
// go into network tab and get the token
const SITE_TOKEN = "paste a token copied from a browser as per details above";
// AGO "you may also need a token from the home app"

describe("user-app-resources harness: ", () => {
  let factory: Artifactory;
  const orgName = "hubPremiumAlpha";
  let contextMgr: ArcGISContextManager;
  let session: UserSession;

  beforeAll(async () => {
    jasmine["DEFAULT_TIMEOUT_INTERVAL"] = 200000;
    factory = new Artifactory(config);
    // create a session
    session = UserSession.fromCredential({
      userId: "paige_pa",
      server: factory.getPortalUrl(orgName),
      token: SITE_TOKEN,
      expires: new Date().getTime() + 3600 * 24,
      ssl: true,
    });

    try {
      contextMgr = await ArcGISContextManager.create({
        portalUrl: factory.getPortalUrl(orgName),
        authentication: session,
        resourceConfigs: [
          {
            app: "arcgisonline",
            clientId: "arcgisonline",
          },
          {
            app: "hubforarcgis",
            clientId: "hubforarcgis",
          },
        ],
      });
    } catch (ex) {
      /* tslint:disable no-console */
      console.error(ex);
      /* tslint:disable no-console */
      console.error(`Ensure SITE_TOKEN is valid in user-app-resources.e2e.ts`);
    }
  });
  it("validate by fetching user", async () => {
    const u = await getUser(contextMgr.context.userRequestOptions);
    expect(u.username).toEqual("paige_pa");
  });

  xdescribe("low-level: ", () => {
    // Should be connected to https://uar-harness-qa-pre-a-hub.hubqa.arcgis.com/
    // clientId: 5cPqtyH2yLMndSx8
    // unf we can't really "tell" that from a token :(

    xit("purge hub resources", async () => {
      // clean up janky hub resources
      const siteToken = contextMgr.context.tokenFor("self");
      const username = contextMgr.context.currentUser.username as string;
      const portalUrl = contextMgr.context.portalUrl;
      const list = await listUserResources(
        username,
        portalUrl,
        siteToken,
        true
      );

      // iterate the list, looking for specific entries to remove
      const removeList = [
        "hub-site-settings.json",
        "hub-site-settings2.json",
        "site-settings.json",
        "hub-settings.json",
      ];
      for (const entry of list.userResources) {
        console.info(`Resource ${entry.key} for clientId: ${entry.clientId}`);
        if (removeList.includes(entry.key)) {
          // DON'T DO THIS IN REAL APPS!
          // Usually an app will have an entry for the clientId of the "self" app
          const token =
            contextMgr.context.tokenFor(entry.clientId as UserResourceApp) ||
            contextMgr.context.tokenFor("self");
          await removeUserResource(username, entry.key, portalUrl, token);
        }
      }
      // re-fetch the list
      const chk = await listUserResources(username, portalUrl, siteToken, true);
      chk.userResources.forEach((entry) => {
        console.info(`Resource ${entry.key} for clientId: ${entry.clientId}`);
      });
    });

    it("store & fetch site setting", async () => {
      const key = "hub-site-settings.json";
      const data = {
        test: {
          simple: "data",
          other: "data with 👍🏻 emojii",
          updated: new Date().toDateString(),
        },
      };

      const payload: IAddUserResource = {
        access: "userappprivate",
        data,
        key,
      };

      const siteToken = contextMgr.context.tokenFor("self");
      const portalUrl = contextMgr.context.portalUrl;
      const username = contextMgr.context.currentUser.username as string;

      const list = await listUserResources(
        username,
        portalUrl,
        siteToken,
        true
      );

      await setUserResource(payload, username, portalUrl, siteToken);

      // now fetch it back again
      const chk = await getUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        siteToken
      );

      expect(chk.test).toEqual(data.test);
      // clean up
      await removeUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        siteToken
      );
    });
    it("store & fetch hub setting", async () => {
      const key = "hub-settings.json";
      const data = {
        test: {
          simple: "data",
          other: "data with 👍🏻 emojii",
          updated: new Date().toDateString(),
        },
      };

      const payload: IAddUserResource = {
        access: "userappprivate",
        data,
        key,
      };

      const hubToken = contextMgr.context.tokenFor("hubforarcgis");
      const portalUrl = contextMgr.context.portalUrl;
      const username = contextMgr.context.currentUser.username as string;
      await setUserResource(
        payload,
        username,
        contextMgr.context.portalUrl,
        hubToken
      );

      const list = await listUserResources(username, portalUrl, hubToken, true);

      // now fetch it back again
      const chk = await getUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        hubToken
      );

      expect(chk.test).toEqual(data.test);
      // clean up
      await removeUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        hubToken
      );
    });
    it("store & fetch AGO setting", async () => {
      const key = "privacy-settings.json";
      const data = {
        test: {
          simple: "data",
          other: "data with 👍🏻 emojii",
          updated: new Date().toDateString(),
        },
      };

      const payload: IAddUserResource = {
        access: "userappprivate",
        data,
        key,
      };

      const token = contextMgr.context.tokenFor("arcgisonline");
      const username = contextMgr.context.currentUser.username as string;
      await setUserResource(
        payload,
        username,
        contextMgr.context.portalUrl,
        token
      );
      // now fetch it back again
      const chk = await getUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        token
      );

      expect(chk.test).toEqual(data.test);
      // clean up
      await removeUserResource(
        username,
        key,
        contextMgr.context.portalUrl,
        token
      );
    });
  });

  describe("hub abstractions: ", () => {
    it("stores site level settings", async () => {
      const ts = new Date().getTime();
      const settings: IUserSiteSettings = {
        schemaVersion: 1,
        username: "verify-overwrite",
      };
      const token = contextMgr.context.tokenFor("self");
      const username = contextMgr.context.currentUser.username as string;
      const portalUrl = contextMgr.context.portalUrl;
      const list = await listUserResources(username, portalUrl, token, true);
      await setUserSiteSettings(settings, contextMgr.context);
      // now get it back
      const chk = await getUserSiteSettings(contextMgr.context);
      expect(chk.username).toBe("paige_pa");
      expect(chk.updated).toBeGreaterThanOrEqual(ts);
      await clearUserSiteSettings(contextMgr.context);
    });
    it("stores hub level settings", async () => {
      const ts = new Date().getTime();
      const settings: IUserHubSettings = {
        schemaVersion: 1,
        username: "verify-overwrite",
      };
      const token = contextMgr.context.tokenFor("hubforarcgis");
      const username = contextMgr.context.currentUser.username as string;
      const portalUrl = contextMgr.context.portalUrl;
      const list = await listUserResources(username, portalUrl, token, true);
      await setUserHubSettings(settings, contextMgr.context);
      // now get it back
      const chk = await getUserHubSettings(contextMgr.context);
      expect(chk.username).toBe("paige_pa");
      expect(chk.updated).toBeGreaterThanOrEqual(ts);
      // now update it
      settings.schemaVersion = 2;
      await setUserHubSettings(settings, contextMgr.context, true);
      const chk2 = await getUserHubSettings(contextMgr.context);
      expect(chk2.username).toBe("paige_pa");
      expect(chk2.updated).toBeGreaterThanOrEqual(ts);
      expect(chk2.schemaVersion).toEqual(2);
      // now kill it
      await clearUserHubSettings(contextMgr.context);
    });
  });
});
