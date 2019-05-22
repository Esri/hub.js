import { getItems } from "../../src/ago/get-items";
import * as Portal from "@esri/arcgis-rest-portal";
import { ISearchParams } from "../../src/ago/params";
import * as EncodeAgoQuery from "../../src/ago/encode-ago-query";

describe("getItems test", () => {
  it("encodes params into ago query and calls portal's searchItems", async done => {
    const rawAgoResults = {
      results: [],
      total: 0,
      aggregations: { counts: {} }
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
      agg: { fields: "tags,collection,owner,source,hasApi,downloadable" },
      start: 1,
      num: 10
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
        params: { token, countFields: undefined, countSize: undefined },
        portal,
        authentication: undefined
      }
    ];
    expect(expectedArgsForSearchItems).toEqual(searchItemsSpy.calls.argsFor(0));
    done();
  });
});
