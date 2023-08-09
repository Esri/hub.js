import { IQuery, cloneObject, explainQueryResult } from "../src";
import { hubSearch } from "../src/search";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

fdescribe("Explain Query", () => {
  let factory: Artifactory;
  beforeAll(() => {
    factory = new Artifactory(config);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 200000;
  });
  it("item in two groups", async () => {
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");

    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: [
                "fd5673b8e72c43e9a6ef91d1c101d71e", // Explain Group 1
                "fc0647e945f947c1b040563879032419", // Explain Group 2
              ],
            },
          ],
        },
      ],
    };
    const result = {
      id: "8300e2979f9c4f3cbc9cee95ba4ea9bf",
    };
    const explanation = await explainQueryResult(
      result,
      query,
      ctxMgr.context.requestOptions
    );
  });
  it("item in two groups: catalog exclude one", async () => {
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");

    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: {
                all: [
                  "fd5673b8e72c43e9a6ef91d1c101d71e", // Explain Group 1
                ],
                not: [
                  "fc0647e945f947c1b040563879032419", // Explain Group 2
                ],
              },
            },
          ],
        },
      ],
    };
    const result = {
      id: "8300e2979f9c4f3cbc9cee95ba4ea9bf",
    };
    const explanation = await explainQueryResult(
      result,
      query,
      ctxMgr.context.requestOptions
    );
    // debugger;
  });
  it("two filters: item in two groups", async () => {
    const ctxMgr = await factory.getContextManager("hubBasic", "admin");

    const query: IQuery = {
      targetEntity: "item",
      // Filters are ANDed together
      filters: [
        {
          predicates: [
            {
              group: [
                "fd5673b8e72c43e9a6ef91d1c101d71e", // Explain Group 1
              ],
            },
          ],
        },
        {
          predicates: [
            {
              group: [
                "fc0647e945f947c1b040563879032419", // Explain Group 2
              ],
            },
          ],
        },
      ],
    };
    // Add a term filter to get the specific result we want
    const searchQuery = cloneObject(query);
    searchQuery.filters.push({
      predicates: [{ term: "Oak" }],
    });
    // execute query
    const results = await hubSearch(query, {
      requestOptions: ctxMgr.context.hubRequestOptions,
    });

    expect(results.results.length).toBe(1);

    const result = results.results[0];

    expect(result.id).toBe("8300e2979f9c4f3cbc9cee95ba4ea9bf");
    // now get the explanation
    const explanation = await explainQueryResult(
      result,
      query,
      ctxMgr.context.requestOptions
    );
    // debugger;
  });
});
