import {
  describe,
  it,
  expect,
} from "vitest";
import {
  IMetric,
  IMetricDisplayConfig,
  MetricSource,
} from "../../src/core/types/Metrics";
import { metricToEditor } from "../../src/metrics/metricToEditor";

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
      sourceLink: "https://source-link.hubqa.arcgis.com",
      sourceTitle: "source title",
    };

    const editor = metricToEditor(metric, displayConfig);
    expect(editor).toEqual({
      metricId: "test123",
      type: "dynamic",
      displayType: "stat",
      cardTitle: "Testing the display config",
      sourceLink: undefined,
      sourceTitle: undefined,
      dynamicMetric: {
        serviceUrl: "https://hubqa.arcgis.com",
        layerId: 0,
        field: "test",
        statistic: "count",
        where: "caption = 'hello'",
        type: "service-query",
        sourceLink: "https://source-link.hubqa.arcgis.com",
        sourceTitle: "source title",
        itemId: undefined,
        expressionSet: undefined,
        allowExpressionSet: undefined,
        fieldType: undefined,
      },
    });
  });
  it("converts a service-query metric correctly with missing display config properties", () => {
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
    };

    const editor = metricToEditor(metric, displayConfig);
    expect(editor).toEqual({
      metricId: "test123",
      type: "dynamic",
      displayType: "stat",
      sourceLink: undefined,
      sourceTitle: undefined,
      dynamicMetric: {
        serviceUrl: "https://hubqa.arcgis.com",
        layerId: 0,
        field: "test",
        statistic: "count",
        where: "caption = 'hello'",
        type: "service-query",
        sourceLink: undefined,
        sourceTitle: undefined,
        itemId: undefined,
        expressionSet: undefined,
        allowExpressionSet: undefined,
        fieldType: undefined,
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
      sourceLink: "https://source-link.hubqa.arcgis.com",
      sourceTitle: "source title",
    };

    const editor = metricToEditor(metric, displayConfig);
    expect(editor).toEqual({
      metricId: "test123",
      displayType: "stat",
      cardTitle: "Testing the display config",
      value: "525,600",
      type: "static",
      sourceLink: "https://source-link.hubqa.arcgis.com",
      sourceTitle: "source title",
      valueType: undefined,
    });
  });

  it("handles an empty metric", () => {
    const metric = {};

    const displayConfig: IMetricDisplayConfig = {
      displayType: "stat-card",
      metricId: "m123",
    };

    const editor = metricToEditor(metric as IMetric, displayConfig);
    expect(editor).toEqual({
      displayType: "stat-card",
      metricId: "m123",
    });
  });
  it("handles a metric with an empty source", () => {
    const metric = {
      source: {},
    };

    const displayConfig = {
      displayType: "stat-card",
      metricId: "m123",
    };

    const editor = metricToEditor(
      metric as IMetric,
      displayConfig as IMetricDisplayConfig
    );
    expect(editor).toEqual({
      displayType: "stat-card",
      metricId: "m123",
    });
  });
});
