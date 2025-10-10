import { collectionAgg } from "../../../../src/ago/helpers/aggs/collection";

describe("collection aggs test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("calculates collection raw aggs correctly", () => {
    const agoAggs = {
      counts: [
        {
          fieldName: "type",
          fieldValues: [
            {
              value: "Feature Layer",
              count: 12,
            },
            {
              value: "PDF",
              count: 10,
            },
            {
              value: "unknown type",
              count: 10,
            },
          ],
        },
      ],
    };
    const actual = collectionAgg(agoAggs);
    const expected = { collection: { Dataset: 12, Document: 10, Other: 10 } };
    expect(actual).toEqual(expected);
  });

  it("should handle undefined agoAggregations", () => {
    const actual = collectionAgg();
    const expected = { collection: {} };
    expect(actual).toEqual(expected);
  });

  it("should handle blank agoAggregations", () => {
    const actual = collectionAgg({});
    const expected = { collection: {} };
    expect(actual).toEqual(expected);
  });
});
