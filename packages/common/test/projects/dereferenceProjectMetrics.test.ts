import {
  IDynamicItemQueryDefinition,
  IHubProject,
  IMetric,
  IQuery,
  dereferenceProjectMetrics,
} from "../../src";

describe("dereferenceProjectMetrics:", () => {
  it("returns empty object if no metrics defined", () => {
    const obj: IHubProject = {
      id: "00c",
      name: "Fake Project",
    } as unknown as IHubProject;

    const metrics = dereferenceProjectMetrics(obj);
    expect(metrics).toEqual({});
  });
  it("metrics without references pass through", () => {
    const obj: IHubProject = {
      id: "00c",
      name: "Fake Project",
      metrics: {
        budget: {
          source: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubProject;

    const metrics = dereferenceProjectMetrics(obj);
    expect(metrics).toEqual(obj.metrics as Record<string, IMetric>);
  });
  it("handles delegation to another metric", () => {
    const initiative: IHubProject = {
      id: "00c",
      name: "Fake Project",
      metrics: {
        countyBudget: {
          $use: "metrics.budget",
        },
        budget: {
          source: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubProject;

    const metrics = dereferenceProjectMetrics(initiative);
    expect(metrics.budget).toEqual(initiative.metrics?.budget as IMetric);
    expect(metrics.countyBudget).toEqual(initiative.metrics?.budget as IMetric);
  });
  it("passed through item query scope that does not have $use", () => {
    const initiative: IHubProject = {
      id: "00c",
      name: "Fake Project",
      metrics: {
        budget: {
          source: {
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

    const metrics = dereferenceProjectMetrics(initiative);
    const itemQuery = metrics.budget.source as IDynamicItemQueryDefinition;
    expect(itemQuery.scope).toEqual({
      hello: "world",
    } as unknown as IQuery);
  });
  it("dereferences item query scope", () => {
    const obj: IHubProject = {
      id: "00c",
      name: "Fake Project",
      metrics: {
        budget: {
          source: {
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
    } as unknown as IHubProject;

    const metrics = dereferenceProjectMetrics(obj);
    const itemQuery = metrics.budget.source as IDynamicItemQueryDefinition;
    expect(itemQuery.scope).toEqual({
      id: "abc",
    } as unknown as IQuery);
  });
});
