import { serialize } from "../../src/ago/serialize";
import { ISearchParams } from "../../src/ago/params";

describe("serialize test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("serializes q, tags, aggs, sort, groupIds, orgId, initiativeId correctly", () => {
    const input: ISearchParams = {
      q: "crime",
      sort: "name",
      groupIds: "1ef,2ab",
      orgId: "2ef",
      initiativeId: "3ef",
      id: "1qw",
      agg: {
        fields: "tags,collection,owner,source,hasApi,downloadable",
        size: 10,
        mode: "uniqueCount",
      },
      page: {
        hub: {
          start: 1,
          size: 10,
        },
        ago: {
          start: 1,
          size: 10,
        },
      },
    };
    const actual = serialize(input);
    const expected =
      "q=crime&sort=name&agg%5Bfields%5D=tags%2Ccollection%2Cowner%2Csource%2ChasApi%2Cdownloadable&agg%5Bsize%5D=10&agg%5Bmode%5D=uniqueCount&page%5Bhub%5D%5Bstart%5D=1&page%5Bhub%5D%5Bsize%5D=10&page%5Bago%5D%5Bstart%5D=1&page%5Bago%5D%5Bsize%5D=10&catalog%5BgroupIds%5D=any(1ef,2ab)&catalog%5BorgId%5D=any(2ef)&catalog%5BinitiativeId%5D=any(3ef)&catalog%5Bid%5D=any(1qw)";
    expect(actual).toBe(expected);
  });

  it("serializes without aggs and without page correctly", () => {
    const input: ISearchParams = {
      q: "crime",
      sort: "name",
      groupIds: "1ef,2ab",
      id: "1qw",
    };
    const actual = serialize(input);
    const expected =
      "q=crime&sort=name&catalog%5BgroupIds%5D=any(1ef,2ab)&catalog%5Bid%5D=any(1qw)";
    expect(actual).toBe(expected);
    input.agg = {};
    expect(serialize(input)).toBe(expected);
  });

  it("serializes without nonFilters and filters", () => {
    const input: ISearchParams = {
      q: "",
    };
    const actual = serialize(input);
    const expected = "";
    expect(actual).toBe(expected);
  });
});
