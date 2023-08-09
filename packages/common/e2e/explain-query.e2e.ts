import { IQuery, cloneObject, explainQueryResult } from "../src";
import { hubSearch } from "../src/search";
import Artifactory from "./helpers/Artifactory";
import config from "./helpers/config";

describe("Explain Query", () => {
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
                "9fef828e929d4f8e9fb5e5e3e174e9f6", // Explain Group 1
                "9985c3ce1f0c4c39b065fc40a4548780", // Explain Group 2
              ],
            },
          ],
        },
      ],
    };
    const result = {
      id: "92ca9c12ee604b958303a52f3e0bbb6b",
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
                  "9fef828e929d4f8e9fb5e5e3e174e9f6", // Explain Group 1
                ],
                not: [
                  "9985c3ce1f0c4c39b065fc40a4548780", // Explain Group 2
                ],
              },
            },
          ],
        },
      ],
    };
    const result = {
      id: "92ca9c12ee604b958303a52f3e0bbb6b",
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
                "9fef828e929d4f8e9fb5e5e3e174e9f6", // Explain Group 1
              ],
            },
          ],
        },
        {
          predicates: [
            {
              group: [
                "9985c3ce1f0c4c39b065fc40a4548780", // Explain Group 2
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

    expect(result.id).toBe("92ca9c12ee604b958303a52f3e0bbb6b");
    // now get the explanation
    const explanation = await explainQueryResult(
      result,
      query,
      ctxMgr.context.requestOptions
    );
    // debugger;
  });
});
