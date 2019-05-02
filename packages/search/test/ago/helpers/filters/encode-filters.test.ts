import { encodeFilters } from "../../../../src/ago/helpers/filters/encode-filters";

describe("encodeFilters test", () => {
  it("encodes filters correctly", () => {
    const filters = {
      tags: {
        fn: "all",
        terms: ["a", "b"]
      },
      groupIds: {
        fn: "any",
        terms: ["1ef", "2ef"],
        catalogDefinition: true
      },
      id: {
        fn: "any",
        terms: ["x", "y"],
        catalogDefinition: true
      },
      hasApi: {
        terms: ["true"]
      }
    };
    const actual = encodeFilters(filters);
    const expected =
      "filter%5Btags%5D=all(a,b)&catalog%5BgroupIds%5D=any(1ef,2ef)&catalog%5Bid%5D=any(x,y)&filter%5BhasApi%5D=true";
    expect(actual).toBe(expected);
  });
});
