import { cloneObject, IHubCatalog, IHubCollection } from "../src";
import { Catalog } from "../src/search/Catalog";
import { Collection } from "../src/search/Collection";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

describe("catalog and collection e2e:", () => {
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

      const result = await instance.searchItems("dashboard");

      const result2 = await instance.searchGroups("cephalopod");

      const col = instance.getCollection("sites");
      const result3 = await col.search("bug");
    });
    it("defaults to prod / anon", async () => {
      const instance = await Catalog.init("https://opendata.dc.gov");
      const response = await instance.searchItems("schools");
      expect(response.results.length).toBeGreaterThan(5);
    });
    xit("can search enterprise", async () => {
      // unf this server has a really strict cors policy so we can't actually verify this
      const ctxMgr = await factory.getContextManager("portal", "publisher");
      const instance = await Catalog.init(
        "https://rqawinbi01pt.ags.esri.com/gis/apps/sites/#/harness",
        ctxMgr.context
      );
      const response = await instance.searchItems("colorado");
    });
    fdescribe("Catalog.contains:", () => {
      it("located item by id", async () => {
        const ctxMgr = await factory.getContextManager(orgName, "admin");
        const instance = Catalog.fromJson(catalog, ctxMgr.context);
        const response = await instance.contains(
          "1950189b18a64ab78fc478d97ea502e0",
          { entityType: "item" }
        );
        expect(response.isContained).toBe(true);
      });
      it("item not in catalog returns false", async () => {
        const ctxMgr = await factory.getContextManager(orgName, "admin");
        const instance = Catalog.fromJson(catalog, ctxMgr.context);
        const response = await instance.contains(
          "98f41f09ef6a4112b15530d9a35c587d",
          { entityType: "item" }
        );
        expect(response.isContained).toBe(false);
      });
      it("located by id", async () => {
        const ctxMgr = await factory.getContextManager(orgName, "admin");
        const instance = Catalog.fromJson(catalog, ctxMgr.context);
        const response = await instance.contains(
          "1950189b18a64ab78fc478d97ea502e0",
          {}
        );
        expect(response.isContained).toBe(true);
      });
      it("locate by slug", async () => {
        const ctxMgr = await factory.getContextManager(orgName, "admin");
        const instance = Catalog.fromJson(catalog, ctxMgr.context);
        const response = await instance.contains("qa-bas-hub|my-spiffy-slug", {
          entityType: "item",
        });
        expect(response.isContained).toBe(true);
      });
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
