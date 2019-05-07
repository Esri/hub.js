import { encodeAgoQuery } from "../../src/ago/encode-ago-query";
import { encode } from "punycode";

describe("encodeAgoQuery test", () => {
  it("encodes ago query for all fields defined in params", () => {
    const params: any = {
      q: "crime",
      catalog: {
        groupIds: "any(1ef)"
      },
      filter: {
        tags: "all(test)"
      },
      sort: "name",
      agg: { fields: "tags,type" },
      bbox: "1,2,3,4"
    };
    const actual = encodeAgoQuery(params);
    const expected = {
      q:
        '-access:public AND -type:"code attachment" AND crime AND ((group:"1ef")) AND (tags:"test")',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "asc",
      countFields: "tags,type",
      countSize: 200,
      bbox: "1,2,3,4"
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query undefined query params", () => {
    const actual = encodeAgoQuery();
    const expected = {
      q: '-access:public AND -type:"code attachment"',
      start: 1,
      num: 10
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query in desc if sorting on a field in desc", () => {
    const actual = encodeAgoQuery({ sort: "-name" });
    const expected = {
      q: '-access:public AND -type:"code attachment"',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "desc"
    };
    expect(actual).toEqual(expected);
  });

  it("ignores sort if the sort field is illegal", () => {
    const actual = encodeAgoQuery({ sort: "-xyz" });
    const expected = {
      q: '-access:public AND -type:"code attachment"',
      start: 1,
      num: 10
    };
    expect(actual).toEqual(expected);
  });
});
