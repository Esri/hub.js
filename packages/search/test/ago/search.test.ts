import { agoSearch } from "../../src/ago/search";
import * as EncodeAgoQuery from "../../src/ago/encode-ago-query";
import * as ComputeItemsFacets from "../../src/ago/compute-items-facets";
import * as FormatItemCollection from "../../src/ago/format-item-collection";
import * as Portal from "@esri/arcgis-rest-portal";
import { ISearchParams } from "../../src/ago/params";

describe("agoSearch test", () => {
  it("uses the right functions", async done => {
    const rawAgoResults = {
      results: [],
      total: 0,
      aggregations: { counts: {} }
    } as any;
    const facets = { facet1: [{ key: "a", docCount: 5 }] };
    const formatted = { data: [], meta: { stats: {} } } as any;
    const encodeAgoQuerySpy = spyOn(
      EncodeAgoQuery,
      "encodeAgoQuery"
    ).and.callFake(() => {
      return { q: "long ago query", start: 1, num: 10 };
    });
    const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
      return rawAgoResults;
    });
    const computeItemsFacetsSpy = spyOn(
      ComputeItemsFacets,
      "computeItemsFacets"
    ).and.callFake(() => {
      return facets;
    });
    const agoFormatCollectionSpy = spyOn(
      FormatItemCollection,
      "agoFormatItemCollection"
    ).and.callFake(() => {
      return formatted;
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
    const formattedResults = await agoSearch(params, token, portal);

    // step 1: encode ago query
    expect(encodeAgoQuerySpy.calls.count()).toEqual(1);
    const actualArgsForEncodeAgoQuery = encodeAgoQuerySpy.calls.argsFor(0)[0];
    expect(actualArgsForEncodeAgoQuery).toEqual(params);

    // step 2: search items
    expect(searchItemsSpy.calls.count()).toEqual(1);

    // step 3: compute items facets
    expect(computeItemsFacetsSpy.calls.count()).toBe(1);
    const [
      aggsForComputeFacets,
      paramsForComputeFacets,
      tokenForComputeFacets,
      portalForComputeFacets
    ] = computeItemsFacetsSpy.calls.argsFor(0);
    expect(aggsForComputeFacets).toEqual({ counts: {} });
    expect(paramsForComputeFacets).toEqual(params);
    expect(tokenForComputeFacets).toBe(token);
    expect(portalForComputeFacets).toBe(portal);

    // step 4: ago format item collection
    expect(agoFormatCollectionSpy.calls.count()).toBe(1);
    const [
      resultsForFormat,
      facetsForFormat,
      paramsForFormat
    ] = agoFormatCollectionSpy.calls.argsFor(0);
    expect(resultsForFormat).toEqual(rawAgoResults);
    expect(facetsForFormat).toEqual(facets);
    expect(paramsForFormat).toEqual(params);

    // step 5: final results
    expect(formattedResults).toEqual(formatted);

    done();
  });
});
