import { IMetricFeature, aggregateMetrics } from "../../src";

describe("aggregateMetrics:", () => {
  const metrics: IMetricFeature[] = [
    {
      attributes: {
        contractor: "KPMG",
        budget: 10,
        id: "001",
        label: "Test 001",
        type: "Hub Project",
      },
    },
    {
      attributes: {
        contractor: "PWC",
        budget: 15,
        id: "002",
        label: "Test 002",
        type: "Hub Project",
      },
    },
    {
      attributes: {
        contractor: "KPMG",
        budget: 2,
        id: "003",
        label: "Test 003",
        type: "Hub Project",
      },
    },
  ];

  it("can sum values", () => {
    const result = aggregateMetrics(metrics, "budget", "sum");
    expect(result).toEqual(27);
  });
  it("can count values", () => {
    const result = aggregateMetrics(metrics, "budget", "count");
    expect(result).toEqual(3);
  });
  it("can average values", () => {
    const result = aggregateMetrics(metrics, "budget", "avg");
    expect(result).toEqual(9);
  });
  it("can find the minimum value", () => {
    const result = aggregateMetrics(metrics, "budget", "min");
    expect(result).toEqual(2);
  });
  it("can find the maximum value", () => {
    const result = aggregateMetrics(metrics, "budget", "max");
    expect(result).toEqual(15);
  });
  it("can accumulate counts by value", () => {
    const result = aggregateMetrics(metrics, "contractor", "countByValue");
    expect(result).toEqual({ KPMG: 2, PWC: 1 });
  });
  it("returns null for unknown aggregation", () => {
    const result = aggregateMetrics(metrics, "contractor", "unknown" as any);
    expect(result).toBeNull();
  });
});
