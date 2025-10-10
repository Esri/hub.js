import { getItems } from "../../src/ago/get-items";
import * as Portal from "@esri/arcgis-rest-portal";
import { ISearchParams } from "../../src/ago/params";
import * as EncodeAgoQuery from "../../src/ago/encode-ago-query";

describe("getItems test", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {}); // suppress console output
  });
  it("gets items when there are no count fields i.e. aggs", async (done) => {
    const rawAgoResults = {
      results: [],
      total: 0,
      aggregations: { counts: {} },
    } as any;
    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return { q: "long ago query", start: 1, num: 10 };
    });
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return rawAgoResults;
    });
    const params: ISearchParams = {
      q: "land",
      sort: "name",
      groupIds: "1ef",
      start: 1,
      num: 10,
    };
    const token = "token";
    const portal = "https://test.com";

    await getItems(params, token, portal);
    // step 1: encode ago query
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const [expectedParams] = encodeAgoQuerySpy.calls.argsFor(0);
    expect(expectedParams).toEqual(params);

    // step 2: search items
    expect(searchItemsSpy.calls.count()).toEqual(1);
    const expectedArgsForSearchItems: any = {
      q: "long ago query",
      start: 1,
      num: 10,
      params: { token },
      portal,
      httpMethod: "POST",
      authentication: undefined,
    };
    expect(searchItemsSpy.calls.argsFor(0)[0]).toEqual(
      expectedArgsForSearchItems
    );
    done();
  });

  it("gets items when there are <= 3 count fields and searchItems is called once", async (done) => {
    const rawAgoResults = {
      results: [],
      total: 0,
      aggregations: { counts: {} },
    } as any;
    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return {
        q: "long ago query",
        start: 1,
        num: 10,
        countFields: "a,b,c",
        countSize: 10,
      };
    });
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return rawAgoResults;
    });
    const params: ISearchParams = {
      q: "land",
      sort: "name",
      groupIds: "1ef",
      start: 1,
      num: 10,
      agg: { fields: "a,b,c" },
    };
    const token = "token";
    const portal = "https://test.com";

    await getItems(params, token, portal);

    // step 1: encode ago query
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const [expectedParams] = encodeAgoQuerySpy.calls.argsFor(0);
    expect(expectedParams).toEqual(params);

    // step 2: search items
    expect(searchItemsSpy.calls.count()).toEqual(1);
    const expectedArgsForSearchItems: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "a,b,c", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "a,b,c",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems).toEqual(searchItemsSpy.calls.argsFor(0));
    done();
  });

  it("gets items when there are > 3 count fields and searchItems is called multiple times", async (done) => {
    const rawAgoResults1 = {
      results: [],
      total: 0,
      aggregations: {
        counts: [
          { fieldName: "a", fieldValues: [{ value: "dc", count: 12 }] },
          { fieldName: "b", fieldValues: [{ value: "crime", count: 3 }] },
          { fieldName: "c", fieldValues: [{ value: "pdf", count: 5 }] },
        ],
      },
    } as any;
    const rawAgoResults2 = {
      results: [],
      total: 0,
      aggregations: {
        counts: [
          {
            fieldName: "d",
            fieldValues: [{ value: "business/store", count: 5 }],
          },
        ],
      },
    } as any;
    const rawAgoResults3 = {
      results: [],
      total: 0,
      aggregations: {},
    } as any;
    const rawAgoResults = [rawAgoResults1, rawAgoResults2, rawAgoResults3];
    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return {
        q: "long ago query",
        start: 1,
        num: 10,
        countFields: "a,b,c,d,e,f,g",
        countSize: 10,
      };
    });
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return rawAgoResults.shift();
    });
    const params: ISearchParams = {
      q: "land",
      sort: "name",
      groupIds: "1ef",
      start: 1,
      num: 10,
      agg: { fields: "a,b,c,d,e,f,g" },
    };
    const token = "token";
    const portal = "https://test.com";

    const results = await getItems(params, token, portal);

    // step 1: encode ago query
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const [expectedParams] = encodeAgoQuerySpy.calls.argsFor(0);
    expect(expectedParams).toEqual(params);

    // step 2: verify how searchItems gets called
    expect(searchItemsSpy.calls.count()).toEqual(3);
    const expectedArgsForSearchItems1: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "a,b,c", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "a,b,c",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems1).toEqual(
      searchItemsSpy.calls.argsFor(0)
    );
    const expectedArgsForSearchItems2: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "d,e,f", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "d,e,f",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems2).toEqual(
      searchItemsSpy.calls.argsFor(1)
    );
    const expectedArgsForSearchItems3: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "g", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "g",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems3).toEqual(
      searchItemsSpy.calls.argsFor(2)
    );

    // step 3. verify actual results' aggregations
    expect(results.aggregations.counts.length).toEqual(4);
    done();
  });

  it("first raw AGO results w/o aggregations should initialize with full results", async (done) => {
    const rawAgoResults1 = {
      results: [],
      total: 0,
    } as any;
    const rawAgoResults2 = {
      results: [],
      total: 0,
      aggregations: {
        counts: [
          {
            fieldName: "c",
            fieldValues: [{ value: "pdf", count: 5 }],
          },
          {
            fieldName: "d",
            fieldValues: [{ value: "business/store", count: 5 }],
          },
        ],
      },
    } as any;
    const rawAgoResults = [rawAgoResults1, rawAgoResults2];

    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return {
        q: "long ago query",
        start: 1,
        num: 10,
        countFields: "a,b,c,d",
        countSize: 10,
      };
    });

    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return rawAgoResults.shift();
    });

    const params: ISearchParams = {
      q: "land",
      sort: "name",
      groupIds: "1ef",
      start: 1,
      num: 10,
      agg: { fields: "a,b,c,d" },
    };
    const token = "token";
    const portal = "https://test.com";

    const results = await getItems(params, token, portal);

    // step 1: encode ago query
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const [expectedParams] = encodeAgoQuerySpy.calls.argsFor(0);
    expect(expectedParams).toEqual(params);

    // step 2: verify how searchItems gets called
    expect(searchItemsSpy.calls.count()).toEqual(2);
    const expectedArgsForSearchItems1: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "a,b,c", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "a,b,c",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems1).toEqual(
      searchItemsSpy.calls.argsFor(0)
    );
    const expectedArgsForSearchItems2: any = [
      {
        q: "long ago query",
        start: 1,
        num: 10,
        params: { token, countFields: "d", countSize: 10 },
        portal,
        httpMethod: "POST",
        authentication: undefined,
        countFields: "d",
        countSize: 10,
      },
    ];
    expect(expectedArgsForSearchItems2).toEqual(
      searchItemsSpy.calls.argsFor(1)
    );

    // step 3. verify actual results' aggregations
    expect(results.aggregations.counts.length).toEqual(2);
    done();
  });
});
