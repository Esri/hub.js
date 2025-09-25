import type { IArcGISContext } from "../src/types/IArcGISContext";
import { fetchHubEntity } from "../src/core/fetchHubEntity";
import { HubEntity } from "../src/core/types/HubEntity";
import { checkPermission } from "../src/permissions/checkPermission";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

const TEST_INITIATIVE_ID = "7deb8b7bdb4f4fab973513ebb55cd9a6";

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
    it("basic edit permission", async () => {
      // get a project
      const entity: HubEntity = await fetchHubEntity(
        "initiative",
        TEST_INITIATIVE_ID,
        context
      );

      const results = checkPermission("hub:site:edit", context, entity);
      expect(results.access).toBe(true);
    });
  });
  describe("site permissions for ai-assistant", () => {
    it("site with permission definition returns true", async () => {
      const siteId = "7aa3465529c74c6098bb9d5902627a9a";
      const site = await fetchHubEntity("site", siteId, context);
      // check permission
      const results = checkPermission(
        "hub:feature:ai-assistant",
        context,
        site
      );

      expect(results.access).toBe(true);
    });

    it("site without permission definitoin returns false", async () => {
      const siteId = "f0094b90e77d426f918437561a80677b";
      const site = await fetchHubEntity("site", siteId, context);
      // check permission
      const results = checkPermission(
        "hub:feature:ai-assistant",
        context,
        site
      );

      expect(results.access).toBe(false);
    });
  });
});
