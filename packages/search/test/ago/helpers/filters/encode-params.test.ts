import {
  encodeParams,
  getPaths
} from "../../../../src/ago/helpers/filters/encode-params";

describe("encodeParams test", () => {
  it("encodes deeply nested object correctly", () => {
    const input: any = {
      q: "crime",
      sort: "name",
      agg: {
        fields: "tags,collection,owner,source,hasApi,downloadable",
        size: 10,
        mode: "uniqueCount"
      },
      page: {
        hub: {
          start: 1,
          size: 10
        },
        ago: {
          start: 1,
          size: 10
        }
      }
    };
    const actual = encodeParams(input);
    const expected =
      "q=crime&sort=name&agg%5Bfields%5D=tags%2Ccollection%2Cowner%2Csource%2ChasApi%2Cdownloadable&agg%5Bsize%5D=10&agg%5Bmode%5D=uniqueCount&page%5Bhub%5D%5Bstart%5D=1&page%5Bhub%5D%5Bsize%5D=10&page%5Bago%5D%5Bstart%5D=1&page%5Bago%5D%5Bsize%5D=10";
    expect(actual).toBe(expected);
  });

  it("encodes blank object correcty", () => {
    const actual = encodeParams();
    const expected = "";
    expect(actual).toBe(expected);
  });
});

describe("getPaths test", () => {
  it("handles blank or undefined obj correctly", () => {
    expect(getPaths()).toEqual([]);
  });

  it("gets paths for deeply nested object correctly", () => {
    const input = {
      a: { b: { c: 1, d: 2 }, e: [5, 6] }
    };
    const actual = getPaths(input);
    const expected = [
      ["a"],
      ["a", "b"],
      ["a", "e"],
      ["a", "b", "c"],
      ["a", "b", "d"],
      ["a", "e", "0"],
      ["a", "e", "1"]
    ];
    expect(actual).toEqual(actual);
  });
});
