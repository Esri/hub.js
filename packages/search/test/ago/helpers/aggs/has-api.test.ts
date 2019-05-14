import { hasApiAgg } from "../../../../src/ago/helpers/aggs/has-api";

describe("hasApi aggs test", () => {
  it("calculates hasApi raw aggs based on item type", () => {
    const agoAggs = {
      counts: [
        {
          fieldName: "type",
          fieldValues: [
            {
              value: "feature service",
              count: 12
            },
            {
              value: "map service",
              count: 10
            },
            {
              value: "xyz",
              count: 12
            }
          ]
        }
      ]
    };
    const actual = hasApiAgg(agoAggs);
    const expected = { hasApi: { true: 22, false: 12 } };
    expect(actual).toEqual(expected);
  });

  it("handles blank aggregations", () => {
    const agoAggs: any = {
      counts: []
    };
    const actual = hasApiAgg(agoAggs);
    const expected = { hasApi: {} };
    expect(actual).toEqual(expected);
  });

  it("handles undefined aggregations", () => {
    const actual = hasApiAgg();
    const expected = { hasApi: {} };
    expect(actual).toEqual(expected);
  });
});
