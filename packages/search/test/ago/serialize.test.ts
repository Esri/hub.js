import { serialize } from "../../src/ago/serialize";
import { ISearchParams } from "../../src/ago/params";

describe("serialize test", () => {
  it("serializes q, tags, aggs, sort correctly", () => {
    const input: ISearchParams = {
      q: "crime",
      sort: "name",
      groupIds: "1ef,2ab",
      id: "1qw",
      agg: {
        fields: "tags,collection,owner,source,hasApi,downloadable",
        size: 10,
        mode: "uniqueCount"
      },
      page: {
        start: 1,
        size: 10
      }
    };
    const actual = serialize(input);
    const expected =
      "q=crime&sort=name&catalog%5BgroupIds%5D=any(1ef,2ab)&catalog%5Bid%5D=any(1qw)&agg%5Bfields%5D=tags%2Ccollection%2Cowner%2Csource%2ChasApi%2Cdownloadable&agg%5Bsize%5D=10&agg%5Bmode%5D=uniqueCount&page%5Bstart%5D=1&page%5Bsize%5D=10";
    expect(actual).toBe(expected);
  });

  it("serializes without aggs and without page correctly", () => {
    const input: ISearchParams = {
      q: "crime",
      sort: "name",
      groupIds: "1ef,2ab",
      id: "1qw"
    };
    const actual1 = serialize(input);
    const expected =
      "q=crime&sort=name&catalog%5BgroupIds%5D=any(1ef,2ab)&catalog%5Bid%5D=any(1qw)&&page%5Bstart%5D=1&page%5Bsize%5D=10";
    expect(actual1).toBe(expected);
    input.agg = {};
    expect(serialize(input)).toBe(expected);
  });
});
