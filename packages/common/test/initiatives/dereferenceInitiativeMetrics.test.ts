import {
  IDynamicItemQueryDefinition,
  IHubInitiative,
  IMetric,
  IQuery,
  dereferenceInitiativeMetrics,
} from "../../src";

describe("dereferenceInitiativeMetrics:", () => {
  it("returns empty object if no metrics defined", () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
    } as unknown as IHubInitiative;

    const metrics = dereferenceInitiativeMetrics(initiative);
    expect(metrics).toEqual({});
  });
  it("metrics without references pass through", () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
      metrics: {
        budget: {
          source: {
            type: "static-value",
            value: 1000000,
            outPath: "budget",
          },
        },
      },
    } as unknown as IHubInitiative;

    const metrics = dereferenceInitiativeMetrics(initiative);
    expect(metrics).toEqual(initiative.metrics as Record<string, IMetric>);
  });
  it("handles delegation to another metric", () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
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
    } as unknown as IHubInitiative;

    const metrics = dereferenceInitiativeMetrics(initiative);
    expect(metrics.budget).toEqual(initiative.metrics?.budget as IMetric);
    expect(metrics.countyBudget).toEqual(initiative.metrics?.budget as IMetric);
  });
  it("passed through item query scope that does not have $use", () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
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
    } as unknown as IHubInitiative;

    const metrics = dereferenceInitiativeMetrics(initiative);
    const itemQuery = metrics.budget.source as IDynamicItemQueryDefinition;
    expect(itemQuery.scope).toEqual({
      hello: "world",
    } as unknown as IQuery);
  });
  it("dereferences item query scope", () => {
    const initiative: IHubInitiative = {
      id: "00c",
      name: "Fake Initiative",
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
    } as unknown as IHubInitiative;

    const metrics = dereferenceInitiativeMetrics(initiative);
    const itemQuery = metrics.budget.source as IDynamicItemQueryDefinition;
    expect(itemQuery.scope).toEqual({
      id: "abc",
    } as unknown as IQuery);
  });
});
