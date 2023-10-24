import {
  IHubProject,
  PROJECT_STATUSES,
} from "../../../../../src/core/types/IHubProject";
import { setMetricAndDisplay } from "../../../../../src/core/schemas/internal/metrics/setMetricAndDisplay";
import {
  IMetric,
  IMetricDisplayConfig,
} from "../../../../../src/core/types/Metrics";

describe("setMetricAndDisplay", () => {
  it("sets an existing metric and display correctly", () => {
    const entity: IHubProject = {
      status: PROJECT_STATUSES.complete,
      itemControl: "",
      owner: "",
      schemaVersion: 1,
      tags: [],
      canEdit: true,
      canDelete: true,
      id: "c123",
      name: "",
      createdDate: new Date(),
      createdDateSource: "",
      updatedDate: new Date(),
      updatedDateSource: "",
      type: "Hub Project",
      typeKeywords: [],
      orgUrlKey: "",
      catalog: { schemaVersion: 1 },
      metrics: [
        {
          id: "metric1",
          source: {
            value: "123",
            type: "static-value",
          },
        },
      ],
      view: {
        metricDisplays: [
          {
            displayType: "stat-card",
            metricId: "metric1",
          },
        ],
      },
    };
    const metric: IMetric = {
      id: "metric1",
      source: {
        value: "456",
        type: "static-value",
      },
    };

    const displayConfig: IMetricDisplayConfig = {
      displayType: "stat-card",
      metricId: "metric1",
      cardTitle: "metric1",
      trailingText: "trailing text...",
    };

    setMetricAndDisplay(entity, metric, displayConfig);

    expect(entity.metrics).toEqual([
      {
        id: "metric1",
        source: {
          value: "456",
          type: "static-value",
        },
      },
    ]);
    expect(entity.view).toEqual({
      metricDisplays: [
        {
          displayType: "stat-card",
          metricId: "metric1",
          cardTitle: "metric1",
          trailingText: "trailing text...",
        },
      ],
    });
  });
  it("sets an existing metric and display correctly", () => {
    const entity: IHubProject = {
      status: PROJECT_STATUSES.complete,
      itemControl: "",
      owner: "",
      schemaVersion: 1,
      tags: [],
      canEdit: true,
      canDelete: true,
      id: "c123",
      name: "",
      createdDate: new Date(),
      createdDateSource: "",
      updatedDate: new Date(),
      updatedDateSource: "",
      type: "Hub Project",
      typeKeywords: [],
      orgUrlKey: "",
      catalog: { schemaVersion: 1 },
      metrics: [
        {
          id: "metric1",
          source: {
            value: "123",
            type: "static-value",
          },
        },
      ],
      view: {
        metricDisplays: [
          {
            displayType: "stat-card",
            metricId: "metric1",
          },
        ],
      },
    };
    const metric: IMetric = {
      id: "metric2",
      source: {
        value: "456",
        type: "static-value",
      },
    };

    const displayConfig: IMetricDisplayConfig = {
      displayType: "stat-card",
      metricId: "metric2",
      cardTitle: "metric2",
      trailingText: "trailing text...",
    };

    setMetricAndDisplay(entity, metric, displayConfig);

    expect(entity.metrics).toEqual([
      {
        id: "metric1",
        source: {
          value: "123",
          type: "static-value",
        },
      },
      {
        id: "metric2",
        source: {
          value: "456",
          type: "static-value",
        },
      },
    ]);
    expect(entity.view).toEqual({
      metricDisplays: [
        {
          displayType: "stat-card",
          metricId: "metric1",
        },
        {
          displayType: "stat-card",
          metricId: "metric2",
          cardTitle: "metric2",
          trailingText: "trailing text...",
        },
      ],
    });
  });
});
