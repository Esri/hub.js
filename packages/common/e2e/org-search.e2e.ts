import { hubSearch } from "../src/search/hubSearch";
import { IQuery } from "../src/search/types/IHubCatalog";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

describe("Hub Org search", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  fdescribe("Search for Portals", () => {
    it("can issue portal search", async () => {
      const ctxMgr = await factory.getContextManager("hubPremium", "admin");
      const ctx = ctxMgr.context;
      const qry: IQuery = {
        targetEntity: "organization",
        filters: [
          {
            predicates: [
              {
                id: ["Xj56SBi2udA78cC9", "bozo"],
              },
            ],
          },
          {
            predicates: [
              {
                id: ["uFEMdY4VMonzH8sG", "gghG0JzQBCN4LVc3"],
              },
            ],
          },
        ],
      };

      const response = await hubSearch(qry, {
        requestOptions: ctx.hubRequestOptions,
      });
      expect(response.results).toBeDefined();
      expect(response.results.length).toBe(3);
    });
  });
});
