import {
  IHubProject,
  IItemQueryMetricSource,
  IQuery,
  cloneObject,
  getEntityMetrics,
} from "../../src";

const project: IHubProject = {
  id: "3ef",
  name: "My Project",
  type: "Hub Project",

  metrics: [
    {
      id: "projectFunding",
      name: "Project Funding",
      source: {
        type: "static-value",
        value: 20000,
      },
    },
    {
      id: "surveysCompleted",
      name: "Survey Completed",
      description: "Total number of surveys completed",
      source: {
        type: "item-query",
        keyword: ["initiative|00c"],
        types: ["Hub Project"],
      },
    },
    {
      id: "fundsSpent",
      name: "Funds Spent",
      description: "Funds spent thus far",
      units: "USD",
      source: {
        type: "item-query",
        keyword: ["initiative|00c"],
        types: ["Hub Project"],
        collectionKey: "projects",
      },
    },
  ],

  catalog: {
    collections: [
      {
        key: "projects",
        scope: {
          chk: "This is the collection for projects",
        },
      },
    ],
  },
} as unknown as IHubProject;

describe("getEntityMetrics:", () => {
  it("adds sourceInfo to metric", () => {
    const chk = getEntityMetrics(cloneObject(project));
    expect(chk.length).toBe(3);
    // Verify sourceInfo is added to metric
    const projectFundingMetric = chk.find((m) => m.id === "projectFunding");
    expect(projectFundingMetric?.entityInfo).toEqual({
      id: "3ef",
      name: "My Project",
      type: "Hub Project",
    });

    // verify collection is added to metric as source
    const spendMetric = chk.find((m) => m.id === "fundsSpent");
    const src = spendMetric?.source as IItemQueryMetricSource;
    expect(src.scope).toEqual({
      chk: "This is the collection for projects",
    } as unknown as IQuery);
  });
  it("handles missing collection", () => {
    const p2 = cloneObject(project);
    p2.catalog.collections = [];
    const chk = getEntityMetrics(p2);
    expect(chk.length).toBe(3);
    const spendMetric = chk.find((m) => m.id === "fundsSpent");
    const src = spendMetric?.source as IItemQueryMetricSource;
    expect(src.scope).not.toBeDefined();
  });
  it("handles missing metrics prop", () => {
    const p2 = cloneObject(project);
    delete p2.metrics;
    const chk = getEntityMetrics(p2);
    expect(chk.length).toBe(0);
  });
});
