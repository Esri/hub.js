import { hasApi } from "../../../../src/ago/helpers/filters/has-api";

describe("hasApi filter test", () => {
  it("hasApi filter should return correct type filter", () => {
    const queryFilters = {
      hasApi: {
        terms: ["true"]
      }
    };
    const expected =
      '(type:"Feature Service" OR type:"Map Service" OR type:"Image Service")';
    expect(hasApi(queryFilters)).toBe(expected);
  });

  it("hasApi filter should return correct type filter when term is false", () => {
    const queryFilters = {
      collection: {
        terms: ["false"]
      }
    };
    const expected =
      '(-type:"Feature Service" OR -type:"Map Service" OR -type:"Image Service")';
    expect(hasApi(queryFilters)).toBe(expected);
  });
});
