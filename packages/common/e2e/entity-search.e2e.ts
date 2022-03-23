import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  expandContentFilter,
  failSafe,
  fetchModelFromItem,
  IModel,
  serializeContentFilterForPortal,
} from "../src";
import { createContentEntitySearchFn } from "../src/search/_internal/searchContentEntities";
import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("Entity Search", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  it("validate createEntitySearchFn", async () => {
    // create session
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");

    try {
      const convertToModel = async function (
        itm: IItem,
        ro: IRequestOptions
      ): Promise<IModel> {
        try {
          // create a fail-safe version of fetchModelFromItem
          const fsFetchModel = failSafe(fetchModelFromItem, {
            item: itm,
            data: {},
          });
          return fsFetchModel(itm, ro);
        } catch (ex) {
          return { item: itm, data: {} };
        }
      };

      const searchFn = createContentEntitySearchFn(convertToModel);
      // expand filter so we can serialize to either api
      const expanded = expandContentFilter({
        filterType: "content",
        type: "Web Map",
      });
      const so = serializeContentFilterForPortal(expanded);
      so.authentication = ctxMgr.context.requestOptions.authentication;

      const response = await searchFn(so);
      expect(response.results.length).toBe(10);
      // call next
      const page2 = await response.next();
      expect(page2.results.length).toBe(10);
      const page3 = await response.next();
      expect(page3.results.length).toBe(10);
      // pick one and see that it has the structure we expect
      const m: IModel = page3.results[4];
      expect(m.item).toBeDefined();
      expect(m.data).toBeDefined();
    } catch (ex) {
      throw ex;
    }
  });
});
