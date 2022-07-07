import { cloneObject, IHubCatalog, IHubCollection } from "../src";
import { Catalog } from "../src/search/Catalog";
import { Collection } from "../src/search/Collection";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

fdescribe("catalog and collection e2e:", () => {
  let factory: Artifactory;
  const orgName = "hubBasic";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  const catalog: IHubCatalog = {
    title: "e2e test",
    schemaVersion: 1,
    scopes: {
      item: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                group: "58493541f0f746ca8d81bd0d00ccf522",
              },
            ],
          },
        ],
      },
      group: {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                orgid: "MNF5ypRINzAAlFbv",
              },
            ],
          },
        ],
      },
    },
    collections: [
      {
        label: "Sites",
        targetEntity: "item",
        key: "sites",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: "Hub Site Application",
                },
              ],
            },
          ],
        },
      },
    ],
  };

  describe("catalog search", () => {
    it("can search items and groups", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const instance = Catalog.fromJson(catalog, ctxMgr.context);

      const result = await instance.search("dashboard", {
        targetEntity: "item",
      });

      const result2 = await instance.search("cephalopod", {
        targetEntity: "group",
      });

      const col = instance.getCollection("sites");
      const result3 = await col.search("bug");
    });
  });

  describe("collection search", () => {
    it("can search collection", async () => {
      const ctxMgr = await factory.getContextManager(orgName, "admin");
      const colDef: IHubCollection = {
        label: "Sites",
        targetEntity: "item",
        key: "sites",
        scope: {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: "Hub Site Application",
                },
              ],
            },
          ],
        },
      };
      const instance = Collection.fromJson(colDef, ctxMgr.context);
      const result3 = await instance.search({
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                owner: "paige_p",
              },
            ],
          },
        ],
      });
    });
  });
});
