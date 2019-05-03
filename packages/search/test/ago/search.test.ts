import { agoSearch } from "../../src/ago/search";
import * as EncodeAgoQuery from "../../src/ago/encode-ago-query";
import * as Portal from "@esri/arcgis-rest-portal";
import { ISearchParams } from "../../src/ago/params";

describe("agoSearch test", () => {
  it("uses the right functions", async done => {
    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return { q: "long ago query", start: 1, num: 10 };
    });
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return "";
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
    await agoSearch(params, token, portal);
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const actualArgsForEncodeAgoQuery = encodeAgoQuerySpy.calls.argsFor(0)[0];
    expect(actualArgsForEncodeAgoQuery).toEqual(params);
    expect(searchItemsSpy.calls.count()).toEqual(1);
    done();
  });
});
