import { hasApi } from "../../../../src/ago/helpers/aggs/has-api";

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
            }
          ]
        }
      ]
    };
    const actual = hasApi(agoAggs);
    const expected = { hasApi: { true: 22, false: 0 } };
    expect(actual).toEqual(expected);
  });
});
