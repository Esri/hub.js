import { collection } from "../../../../src/ago/helpers/aggs/collection";

describe("collection aggs test", () => {
  it("calculates collection raw aggs correctly", () => {
    const agoAggs = {
      counts: [
        {
          fieldName: "type",
          fieldValues: [
            {
              value: "Feature Layer",
              count: 12
            },
            {
              value: "PDF",
              count: 10
            }
          ]
        }
      ]
    };
    const actual = collection(agoAggs);
    const expected = { collection: { Dataset: 12, Document: 10 } };
    expect(actual).toEqual(expected);
  });
});
