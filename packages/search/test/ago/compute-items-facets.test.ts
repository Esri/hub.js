import { computeItemsFacets } from "../../src/ago/compute-items-facets";
import * as Search from "../../src/ago/search";
import { ISearchResult, IItem } from "@esri/arcgis-rest-portal";

const item: IItem = {
  id: "1ef",
  owner: "a",
  tags: ["x"],
  created: 1,
  modified: 1,
  numViews: 1,
  size: 1,
  title: "title",
  type: "CSV"
};

const aggregations = {
  counts: [
    {
      fieldName: "type",
      fieldValues: [
        {
          value: "feature service",
          count: 12
        },
        {
          value: "map service",
          count: 10
        }
      ]
    },
    {
      fieldName: "access",
      fieldValues: [
        {
          value: "private",
          count: 3
        }
      ]
    }
  ]
};

describe("computeItemsFacets test", () => {
  it("it should call ago searchItems if custom aggs are requested", async done => {
    const agoSearchSpy = spyOn(Search, "agoSearch").and.callFake(() => {
      const response: ISearchResult<IItem> = {
        results: [item],
        query: "blah",
        start: 1,
        num: 0,
        nextStart: -1,
        total: 0
      };
      return Promise.resolve(response);
    });
    const agoAggs: any = { counts: [] };
    const params = { q: "blah", agg: { fields: "downloadable" } };
    const token = "secret";
    const portal = "https://qaext.arcgis.com/sharing/rest";
    const facets = await computeItemsFacets(agoAggs, params, token, portal);
    const expected = {
      downloadable: [
        { key: "true", docCount: 1 },
        { key: "false", docCount: 0 }
      ]
    };
    expect(facets).toEqual(expected);
    expect(agoSearchSpy.calls.count()).toEqual(1);
    done();
  });

  it("it should compute facets from custom and ago-provided aggs correctly", async done => {
    const agoSearchSpy = spyOn(Search, "agoSearch").and.callFake(() => {
      const response: ISearchResult<IItem> = {
        results: [item],
        query: "blah",
        start: 1,
        num: 0,
        nextStart: -1,
        total: 0
      };
      return Promise.resolve(response);
    });
    const params = {
      q: "blah",
      agg: { fields: "downloadable,type,access,hasApi" }
    };
    const token = "secret";
    const portal = "https://qaext.arcgis.com/sharing/rest";
    const facets = await computeItemsFacets(
      aggregations,
      params,
      token,
      portal
    );
    const expected = {
      downloadable: [
        { key: "true", docCount: 1 },
        { key: "false", docCount: 0 }
      ],
      type: [
        { key: "feature service", docCount: 12 },
        { key: "map service", docCount: 10 }
      ],
      access: [{ key: "private", docCount: 3 }],
      hasApi: [{ key: "true", docCount: 22 }, { key: "false", docCount: 0 }]
    };
    expect(facets).toEqual(expected);
    expect(agoSearchSpy.calls.count()).toEqual(1);
    done();
  });
});
