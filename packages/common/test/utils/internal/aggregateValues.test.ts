import { aggregateValues } from "../../../src/utils/internal/aggregateValues";

fdescribe("aggregateValues:", () => {
  it("can sum values", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "sum");
    expect(result).toEqual(15);
  });
  it("can count values", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "count");
    expect(result).toEqual(5);
  });
  it("can average values", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "avg");
    expect(result).toEqual(3);
  });
  it("can find the minimum value", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "min");
    expect(result).toEqual(1);
  });
  it("can find the maximum value", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "max");
    expect(result).toEqual(5);
  });
  it("can accumulate counts by value", () => {
    const values = ["a", "b", "c", "a", "b", "c", "a", "b", "c"];
    const result = aggregateValues(values, "countByValue");
    expect(result).toEqual({ a: 3, b: 3, c: 3 });
  });
  it("returns null for unknown aggregation", () => {
    const values = [1, 2, 3, 4, 5];
    const result = aggregateValues(values, "unknown" as any);
    expect(result).toBeNull();
  });
});
