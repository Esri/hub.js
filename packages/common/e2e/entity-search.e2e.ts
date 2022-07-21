import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import {
  failSafe,
  fetchModelFromItem,
  fetchOrgLimits,
  IModel,
  IQuery,
  serializeQueryForPortal,
} from "../src";
import { createEntitySearchFn } from "../src/search/_internal/searchEntities";
import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("Entity Search", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  // Just used to verify the request works and the QA API is working
  // it("fetchOrgLimits", async () => {
  //   const ctxMgr = await factory.getContextManager("hubBasic", "admin");
  //   const result = await fetchOrgLimits(
  //     "self",
  //     "Groups",
  //     "MaxNumUserGroups",
  //     ctxMgr.context.userRequestOptions
  //   );
  //   debugger;
  //   expect(result.limitValue).toBe(512);
  // });

  it("validate createEntitySearchFn", async () => {
    // create session
    const orgName = "hubBasic";
    // create context
    const ctxMgr = await factory.getContextManager(orgName, "admin");

    const convertToModel = async function (
      itm: IItem,
      ro?: IRequestOptions
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

    const fn = createEntitySearchFn(convertToModel);
    // now create a query
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [{ type: "Web Map" }],
        },
      ],
    };
    const so = serializeQueryForPortal(query);
    so.authentication = ctxMgr.context.requestOptions.authentication;
    const response = await fn(so);
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
  });
});
