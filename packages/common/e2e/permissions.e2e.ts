import { IArcGISContext } from "../src/ArcGISContext";
import { checkEntityPermission, fetchHubEntity, HubEntity } from "../src/index";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

const TEST_ITEM_ID = "9d5591a4eec74718b03c32535a5947f1";

fdescribe("Check Permissions", () => {
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
      const results = await checkEntityPermission(
        "hub:site:edit",
        entity,
        context
      );
    });
  });
});
