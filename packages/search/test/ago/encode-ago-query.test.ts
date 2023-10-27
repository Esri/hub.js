import { encodeAgoQuery } from "../../src/ago/encode-ago-query";

describe("encodeAgoQuery test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("encodes ago query for all fields defined in params", () => {
    const params: any = {
      q: "crime",
      catalog: {
        groupIds: "any(1ef)",
      },
      filter: {
        tags: "all(test)",
      },
      sort: "name",
      agg: { fields: "tags,type" },
      bbox: "1,2,3,4",
    };
    const actual = encodeAgoQuery(params);
    const expected = {
      q: '-type:"code attachment" AND crime AND ((group:"1ef")) AND (tags:"test")',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "asc",
      countFields: "tags,type",
      countSize: 200,
      bbox: "1,2,3,4",
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query when a filterable field is passed in at the top level ", () => {
    const params: any = {
      q: "crime",
      catalog: {
        groupIds: "any(1ef)",
      },
      collection: "Map",
      filter: {
        tags: "all(test)",
      },
      sort: "name",
      agg: { fields: "tags,type" },
      bbox: "1,2,3,4",
    };
    const actual = encodeAgoQuery(params);
    const expected = {
      q: '-type:"code attachment" AND crime AND ((group:"1ef")) AND (type:"Image Collection" OR type:"Image Service" OR type:"Map Service Layer" OR type:"Map Service" OR type:"Scene Service" OR type:"Scene Layer" OR type:"Vector Tile Service" OR type:"Web Map Service" OR type:"Web Map Tile Service" OR type:"Web Map" OR type:"Web Scene" OR type:"WFS" OR type:"WMS" OR type:"WMTS") AND (tags:"test")',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "asc",
      countFields: "tags,type",
      countSize: 200,
      bbox: "1,2,3,4",
    };
    expect(actual).toEqual(expected);
  });

  it("handles a joint collection and type query correctly", () => {
    const params: any = {
      q: "",
      groupIds: "6f063f2d05824bd898ca0d5089d93614",
      type: "hub page",
      collection: "Document",
      sort: "relevance",
      agg: {
        fields: "downloadable,hasApi,source,tags,type,access",
      },
      id: "4dd789d0c75a4ebb8805b1314c1cc974",
      initiativeId: "",
    };
    const actual = encodeAgoQuery(params);
    const expected = {
      q: '-type:"code attachment" AND ((group:"6f063f2d05824bd898ca0d5089d93614") OR (id:"4dd789d0c75a4ebb8805b1314c1cc974")) AND ((type:"hub page") AND (type:"CAD Drawing" OR type:"Document Link" OR type:"Hub Page" OR type:"Site Page" OR type:"Image" OR type:"iWork Keynote" OR type:"iWork Numbers" OR type:"iWork Pages" OR type:"Microsoft Powerpoint" OR type:"Microsoft Visio" OR type:"Microsoft Word" OR type:"Notebook" OR type:"PDF" OR type:"Pro Map" OR type:"Report Template"))',
      start: 1,
      num: 10,
      countFields: "tags,type,access",
      countSize: 200,
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query undefined query params", () => {
    const actual = encodeAgoQuery();
    const expected = {
      q: '-type:"code attachment"',
      start: 1,
      num: 10,
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query with correct access if restricted is set query params", () => {
    const actual = encodeAgoQuery({ restricted: true });
    const expected = {
      q: '-type:"code attachment" AND -access:public',
      start: 1,
      num: 10,
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query in desc if sorting on a field in desc", () => {
    const actual = encodeAgoQuery({ sort: "-name" });
    const expected = {
      q: '-type:"code attachment"',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "desc",
    };
    expect(actual).toEqual(expected);
  });

  it("ignores sort if the sort field is illegal", () => {
    const actual = encodeAgoQuery({ sort: "-xyz" });
    const expected = {
      q: '-type:"code attachment"',
      start: 1,
      num: 10,
    };
    expect(actual).toEqual(expected);
  });

  it("encodes ago query correctly when aggregations are supplied with array, rather than comma-separated string", () => {
    const paramsOne: any = {
      q: "crime",
      catalog: {
        groupIds: "any(1ef)",
      },
      filter: {
        tags: "all(test)",
      },
      sort: "name",
      agg: { fields: ["tags"] },
      bbox: "1,2,3,4",
    };
    const expectedOne = {
      q: '-type:"code attachment" AND crime AND ((group:"1ef")) AND (tags:"test")',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "asc",
      countFields: "tags",
      countSize: 200,
      bbox: "1,2,3,4",
    };
    const actualOne = encodeAgoQuery(paramsOne);
    expect(actualOne).toEqual(expectedOne);

    const paramsTwo: any = {
      q: "crime",
      catalog: {
        groupIds: "any(1ef)",
      },
      filter: {
        tags: "all(test)",
      },
      sort: "name",
      agg: { fields: ["tags", "type"] },
      bbox: "1,2,3,4",
    };
    const expectedTwo = {
      q: '-type:"code attachment" AND crime AND ((group:"1ef")) AND (tags:"test")',
      start: 1,
      num: 10,
      sortField: "title",
      sortOrder: "asc",
      countFields: "tags,type",
      countSize: 200,
      bbox: "1,2,3,4",
    };
    const actualTwo = encodeAgoQuery(paramsTwo);
    expect(actualTwo).toEqual(expectedTwo);
  });
});
