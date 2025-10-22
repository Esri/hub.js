import { IHubProject } from "../../../../../src/core/types/IHubProject";
import { setMetricAndDisplay } from "../../../../../src/core/schemas/internal/metrics/setMetricAndDisplay";
import {
  IMetric,
  IMetricDisplayConfig,
} from "../../../../../src/core/types/Metrics";
import { HubEntityStatus } from "../../../../../src/enums/hubEntityStatus";

describe("setMetricAndDisplay", () => {
  it("sets an existing metric and display correctly", () => {
    const entity: IHubProject = {
      status: HubEntityStatus.complete,
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
      catalogs: [],
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

    const e = setMetricAndDisplay(entity, metric, displayConfig);

    expect(e.metrics).toEqual([
      {
        id: "metric1",
        source: {
          value: "456",
          type: "static-value",
        },
      },
    ]);
    expect(e.view).toEqual({
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
      status: HubEntityStatus.complete,
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
      catalogs: [],
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

    const e = setMetricAndDisplay(entity, metric, displayConfig);

    expect(e.metrics).toEqual([
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
    expect(e.view).toEqual({
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
