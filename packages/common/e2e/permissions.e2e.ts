import { IArcGISContext } from "../src/ArcGISContext";
import { checkPermission, fetchHubEntity, HubEntity } from "../src/index";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

const TEST_ITEM_ID = "7deb8b7bdb4f4fab973513ebb55cd9a6";

describe("Check Permissions", () => {
  let factory: Artifactory;
  const orgName = "hubPremium";
  let context: IArcGISContext;
  beforeAll(async () => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
    const ctxMgr = await factory.getContextManager(orgName, "user");
    context = ctxMgr.context;
  });
  describe("hacking", () => {
    it("testing", async () => {
      // get a project
      const entity: HubEntity = await fetchHubEntity(
        "project",
        TEST_ITEM_ID,
        context
      );

      // check permissions
      // console.time("checkPermissionv2");
      // for (let i = 0; i < 100000; i++) {
      const results = checkPermission("hub:site:edit", context, entity);
      // }
      // console.timeEnd("checkPermissionv2");
    });
  });
});
