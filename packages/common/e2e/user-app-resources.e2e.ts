import { UserSession } from "@esri/arcgis-rest-auth";
import { ArcGISContextManager } from "../src";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { getUser } from "@esri/arcgis-rest-portal";

// NOTE: User App Resources is coupled with oAuth
// so we can't simply create a session via username / pwd
// because the resultant token is NOT tied to a clientId
//
// Auth into uar-harness-qa-pre-a-hub.hubqa.arcgis.com as paige_pa
// ** BE SURE TO AUTH INTO THIS SITE** don't just transition from
// another site!
// go into network tab and get the token
const SITE_TOKEN =
  "5jBAbdC6em0-T0BPBeYnoyIYn-9tBYpPOWsdY8ieSxU9bcw4XCvRMGUXTr5bkvZm3RyqynXHz7aLPFPOPbC4nx-HTtgIEZB6QnABW55Z5sRNHi9mOWWsfxjVtXjyiQk-OAC7g0F-X9bAKVE_ombXhlaBxiGkSh_TOK4I0_jFhol2TG5mwHd8-JAU0UgSe7Q-kbY97VLP_RDByOvrQb5xC7KQmFPRQqRkUFUqX7MYTE.";

fdescribe("user-app-resources harness", () => {
  let factory: Artifactory;
  const orgName = "hubPremiumAlpha";
  let contextMgr: ArcGISContextManager;
  let session: UserSession;

  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    factory = new Artifactory(config);
    // create a session
    session = UserSession.fromCredential({
      userId: "paige_pa",
      server: factory.getPortalUrl(orgName),
      token: SITE_TOKEN,
      expires: 30000,
      ssl: true,
    });
    try {
      contextMgr = await ArcGISContextManager.create({
        portalUrl: factory.getPortalUrl(orgName),
        authentication: session,
      });
    } catch (ex) {
      /* tslint:disable no-console */
      console.error(ex);
      /* tslint:disable no-console */
      console.error(`Ensure SITE_TOKEN is valid in user-app-resources.e2e.ts`);
    }
  });
  it("fetch user via request options", async () => {
    const u = await getUser(contextMgr.context.userRequestOptions);
    expect(u.username).toEqual("paige_pa");
    // debugger;
  });
});
