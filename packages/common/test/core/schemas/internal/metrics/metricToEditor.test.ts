import {
  IMetric,
  IMetricDisplayConfig,
  MetricSource,
} from "../../../../../src/core/types/Metrics";
import { metricToEditor } from "../../../../../src/core/schemas/internal/metrics/metricToEditor";

describe("metricToEditor", () => {
  it("converts a service-query metric correctly", () => {
    const metric = {
      id: "test123",
      name: "TestMetric",
      description: "Test Metric is a testing metric",
      source: {
        serviceUrl: "https://hubqa.arcgis.com",
        layerId: 0,
        field: "test",
        statistic: "count",
        where: "caption = 'hello'",
        type: "service-query",
      } as MetricSource,
    };

    const displayConfig = {
      metricId: "test123",
      displayType: "stat",
      cardTitle: "Testing the display config",
      source: "dynamic",
    };

    const editor = metricToEditor(metric, displayConfig);
    expect(editor).toEqual({
      metricId: "test123",
      displayType: "stat",
      cardTitle: "Testing the display config",
      source: "dynamic",
      dynamicMetric: {
        serviceUrl: "https://hubqa.arcgis.com",
        layerId: 0,
        field: "test",
        statistic: "count",
        where: "caption = 'hello'",
        type: "service-query",
      },
    });
  });
  it("converts a static-value metric correctly", () => {
    const metric = {
      id: "test123",
      name: "TestMetric",
      description: "Test Metric is a testing metric",
      source: {
        value: "525,600",
        type: "static-value",
      } as MetricSource,
    };

    const displayConfig = {
      metricId: "test123",
      displayType: "stat",
      cardTitle: "Testing the display config",
      source: "static",
    };

    const editor = metricToEditor(metric, displayConfig);
    expect(editor).toEqual({
      metricId: "test123",
      displayType: "stat",
      cardTitle: "Testing the display config",
      value: "525,600",
      source: "static",
    });
  });

  it("handles an empty metric and empty displayConfig", () => {
    const metric = {};

    const displayConfig = {};

    const editor = metricToEditor(
      metric as IMetric,
      displayConfig as IMetricDisplayConfig
    );
    expect(editor).toEqual({});
  });
  it("handles a metric with an empty source", () => {
    const metric = {
      source: {},
    };

    const displayConfig = {};

    const editor = metricToEditor(
      metric as IMetric,
      displayConfig as IMetricDisplayConfig
    );
    expect(editor).toEqual({});
  });
});
