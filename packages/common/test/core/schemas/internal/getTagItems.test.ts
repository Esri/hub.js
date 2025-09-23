import { getTagItems } from "../../../../src/core/schemas/internal/getTagItems";
import * as SearchModule from "@esri/arcgis-rest-portal";
import { IHubProject } from "../../../../src/core/types/IHubProject";
import { IHubRequestOptions } from "../../../../src/hub-types";

describe("getTagItems:", () => {
  it("aggregates tags:", async () => {
    const searchSpy = spyOn(SearchModule, "searchItems").and.callFake(() => {
      // Leaving so we can quickly swap back to using hubSearch
      // return Promise.resolve({ aggregations: HubSearchAggs });
      return Promise.resolve(SearchItemsResponse);
    });
    const entity = {
      tags: ["a", "b", "c"],
    } as IHubProject;
    const orgId = "some-org-id";
    const ro = {} as IHubRequestOptions;
    const chk = await getTagItems(entity.tags, orgId, ro);
    expect(searchSpy).toHaveBeenCalled();
    // include tags from the item
    expect(chk.find((e) => e.value === "a")).toBeTruthy();
    // include tags from search call
    expect(chk.find((e) => e.value === "test-tag")).toBeTruthy();
  });
  it("handles entity without tags:", async () => {
    const searchSpy = spyOn(SearchModule, "searchItems").and.callFake(() => {
      // Leaving so we can quickly swap back to using hubSearch
      // return Promise.resolve({ aggregations: HubSearchAggs });
      return Promise.resolve(SearchItemsResponse);
    });
    const entity = {} as IHubProject;
    const orgId = "some-org-id";
    const ro = {} as IHubRequestOptions;
    const chk = await getTagItems(entity.tags, orgId, ro);
    expect(searchSpy).toHaveBeenCalled();
    // include tags from the item
    expect(chk.find((e) => e.value === "a")).toBeFalsy();
    // include tags from search call
    expect(chk.find((e) => e.value === "test-tag")).toBeTruthy();
  });
  it("swallows error from search", async () => {
    spyOn(SearchModule, "searchItems").and.callFake(() => {
      return Promise.reject();
    });
    const entity = {} as IHubProject;
    const orgId = "some-org-id";
    const ro = {} as IHubRequestOptions;

    const chk = await getTagItems(entity.tags, orgId, ro);
    expect(chk).toEqual([]);
  });
});

const SearchItemsResponse: SearchModule.ISearchResult<SearchModule.IItem> = {
  query: "",
  total: 438,
  start: 1,
  num: 0,
  nextStart: 1,
  results: [],
  aggregations: {
    counts: [
      {
        fieldName: "tags",
        fieldValues: [
          {
            value: "test-tag",
            count: 169,
          },
          {
            value: "hub site",
            count: 60,
          },
        ],
      },
    ],
  },
};
