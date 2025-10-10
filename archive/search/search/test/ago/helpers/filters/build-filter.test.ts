import { buildFilter } from "../../../../src/ago/helpers/filters/build-filter";

describe("buildFilter test", () => {
  it("builds filter based on function and terms for all function", () => {
    const queryFilters = {
      tags: {
        terms: ["a", "b"],
        fn: "all",
      },
    };
    expect(buildFilter(queryFilters, "tags")).toBe('(tags:"a" AND tags:"b")');
  });

  it("builds filter based on function and terms for any function", () => {
    const queryFilters = {
      source: {
        terms: ["a", "b"],
        fn: "any",
      },
    };
    expect(buildFilter(queryFilters, "source")).toBe(
      '(source:"a" OR source:"b")'
    );
  });

  it("builds filter based on function and terms for not function", () => {
    const queryFilters = {
      source: {
        terms: ["a", "b"],
        fn: "not",
      },
    };
    expect(buildFilter(queryFilters, "source")).toBe(
      '(NOT source:"a" NOT source:"b")'
    );
  });

  it("handles blank queryFilters", () => {
    const queryFilters = {};
    expect(buildFilter(queryFilters, "source")).toBe("()");
  });

  it("builds filter by lowercasing key of AGO params", () => {
    const queryFilters = {
      orgId: {
        fn: "any",
        terms: ["MNF5ypRINzAAlFbv"],
        catalogDefinition: true,
      },
    };
    expect(buildFilter(queryFilters, "orgId")).toBe(
      '(orgid:"MNF5ypRINzAAlFbv")'
    );
  });

  it("builds filter with join type between - different dates", () => {
    const queryFilters = {
      modified: {
        fn: "between",
        terms: ["2019-10-30", "2019-10-31"],
        catalogDefinition: false,
      },
    };
    expect(buildFilter(queryFilters, "modified")).toBe(
      "(modified: [1572393600000 TO 1572480000000])"
    );
  });

  it("builds filter with join type between - same dates", () => {
    const queryFilters = {
      modified: {
        fn: "between",
        terms: ["2019-10-30", "2019-10-30"],
        catalogDefinition: false,
      },
    };
    expect(buildFilter(queryFilters, "modified")).toBe(
      "(modified: [1572393600000 TO 1572480000000])"
    );
  });
});
