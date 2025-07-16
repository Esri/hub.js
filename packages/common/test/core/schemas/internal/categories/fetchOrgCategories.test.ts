import * as REQUEST_MODULE from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../../../../src/hub-types";
import { fetchOrgCategories } from "../../../../../src/core/schemas/internal/categories/fetchOrgCategories";
const response = {
  categorySchema: [
    {
      title: "Categories",
      categories: [
        {
          title: "Trending",
          categories: [
            { title: "New and noteworthy", categories: [] as string[] },
            { title: "Current events" },
            { title: "New and noteworthy (not)", categories: [] as string[] },
          ],
        },
      ],
    },
  ],
};

describe("fetchOrgCategories:", () => {
  it("fetch schemas from org", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.resolve(response);
    });
    const ro = {} as IHubRequestOptions;
    const items = await fetchOrgCategories("orgId", ro);
    expect(spy).toHaveBeenCalled();
    expect(items).toEqual([
      "/Categories/Trending",
      "/Categories/Trending/New and noteworthy",
      "/Categories/Trending/Current events",
      "/Categories/Trending/New and noteworthy (not)",
    ]);
  });

  it("swallows fetch error", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.reject();
    });
    const ro = {} as IHubRequestOptions;
    const items = await fetchOrgCategories("orgId", ro);
    expect(spy).toHaveBeenCalled();
    expect(items.length).toBe(0);
  });
});
