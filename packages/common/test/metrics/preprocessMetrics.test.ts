import {
  IDynamicItemQueryDefinition,
  IHubInitiative,
  IHubProject,
  IMetric,
  IQuery,
  preprocessMetrics,
} from "../../src";

describe("preprocessProjectMetrics:", () => {
  it("returns empty object if no metrics defined", () => {
    const obj: IHubProject = {
      id: "00c",
      name: "Fake Project",
      type: "Hub Project",
    } as unknown as IHubProject;

    const metrics = preprocessMetrics(obj);
    expect(metrics).toEqual({});
  });
  it("metrics without references pass through", () => {
    const obj: IHubProject = {
      id: "00c",
      name: "Fake Project",
      type: "Hub Project",
      metrics: {
        budget: {
          definition: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubProject;

    const metrics = preprocessMetrics(obj);
    const expected: Record<string, IMetric> = {
      budget: {
        definition: {
          type: "static-value",
          value: 1000000,
          outPath: "budget",
          source: {
            id: "00c",
            type: "Hub Project",
            label: "Fake Project",
          },
        },
      } as IMetric, // used so we can keep this lean
    };

    expect(metrics).toEqual(expected);
  });
  it("handles delegation to another metric", () => {
    const initiative: IHubProject = {
      id: "00c",
      name: "Fake Project",
      type: "Hub Project",
      metrics: {
        countyBudget: {
          $use: "metrics.budget",
        },
        budget: {
          definition: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubProject;

    const metrics = preprocessMetrics(initiative);
    const expected: Record<string, IMetric> = {
      budget: {
        definition: {
          type: "static-value",
          value: 1000000,
          outPath: "budget",
          source: {
            id: "00c",
            type: "Hub Project",
            label: "Fake Project",
          },
        },
      } as IMetric, // used so we can keep this lean
    };
    expect(metrics.budget).toEqual(expected.budget as IMetric);
    expect(metrics.countyBudget).toEqual(expected.budget as IMetric);
  });
  it("passed through item query scope that does not have $use", () => {
    const initiative: IHubProject = {
      id: "00c",
      name: "Fake Project",
      type: "Hub Project",
      metrics: {
        budget: {
          definition: {
            type: "item-query",
            scope: {
              hello: "world",
            },
            outPath: "budget",
          },
        },
      },
      catalog: {
        collections: [
          {
            key: "projects",
            scope: {
              id: "abc",
            },
          },
        ],
      },
    } as unknown as IHubProject;

    const metrics = preprocessMetrics(initiative);
    const def = metrics.budget.definition as IDynamicItemQueryDefinition;
    expect(def.scope).toEqual({
      hello: "world",
    } as unknown as IQuery);
  });
  it("dereferences item query scope", () => {
    const obj: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
      type: "Hub Initiative",
      metrics: {
        budget: {
          definition: {
            type: "item-query",
            scope: {
              $use: "catalog.collections[findBy(key,projects)].scope",
            },
            outPath: "budget",
          },
        },
      },
      catalog: {
        collections: [
          {
            key: "projects",
            scope: {
              id: "abc",
            },
          },
        ],
      },
    } as unknown as IHubInitiative;

    const metrics = preprocessMetrics(obj);
    const itemQuery = metrics.budget.definition as IDynamicItemQueryDefinition;
    expect(itemQuery.scope).toEqual({
      id: "abc",
    } as unknown as IQuery);
  });
});
