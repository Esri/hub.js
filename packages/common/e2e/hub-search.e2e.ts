import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";
import { hubSearchQuery, IQuery } from "../src";
describe("hubSearch:", () => {
  let factory: Artifactory;
  const orgName = "hubBasic";
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });

  it("issues authd item search based on IQuery", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");

    const qry: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              term: "water",
            },
          ],
        },
      ],
    };
    const opts = {
      num: 4,
      aggFields: ["tags"],
      aggLimit: 15,
      requestOptions: ctxMgr.context.hubRequestOptions,
    };
    const result = await hubSearchQuery(qry, opts);
    expect(result.results.length).toBe(4);
  });

  it("issues authd group search based on IQuery", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");

    const qry: IQuery = {
      targetEntity: "group",
      filters: [
        {
          predicates: [
            {
              term: "water",
            },
          ],
        },
      ],
    };
    const opts = {
      num: 4,
      aggFields: ["tags"],
      aggLimit: 15,
      requestOptions: ctxMgr.context.hubRequestOptions,
    };
    const result = await hubSearchQuery(qry, opts);
    expect(result.results.length).toBe(4);
  });

  it("issues authd group search based on IQuery", async () => {
    const ctxMgr = await factory.getContextManager(orgName, "admin");

    const qry: IQuery = {
      targetEntity: "user",
      filters: [
        {
          predicates: [
            {
              firstname: "Jeremy",
            },
          ],
        },
      ],
    };
    const opts = {
      num: 4,
      aggFields: ["tags"],
      aggLimit: 15,
      requestOptions: ctxMgr.context.hubRequestOptions,
    };
    const result = await hubSearchQuery(qry, opts);
    expect(result.results.length).toBeGreaterThan(1);
  });
});
