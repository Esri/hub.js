import { buildFilter } from "../../../../src/ago/helpers/filters/build-filter";

describe("buildFilter test", () => {
  it("builds filter based on function and terms for all function", () => {
    const queryFilters = {
      tags: {
        terms: ["a", "b"],
        fn: "all"
      }
    };
    expect(buildFilter(queryFilters, "tags")).toBe('(tags:"a" AND tags:"b")');
  });

  it("builds filter based on function and terms for any function", () => {
    const queryFilters = {
      source: {
        terms: ["a", "b"],
        fn: "any"
      }
    };
    expect(buildFilter(queryFilters, "source")).toBe(
      '(source:"a" OR source:"b")'
    );
  });

  it("builds filter based on function and terms for not function", () => {
    const queryFilters = {
      source: {
        terms: ["a", "b"],
        fn: "not"
      }
    };
    expect(buildFilter(queryFilters, "source")).toBe(
      '(NOT source:"a" NOT source:"b")'
    );
  });
});
