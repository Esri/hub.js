import * as REQUEST_MODULE from "@esri/arcgis-rest-request";
import { fetchCategoryItems } from "../../../../src/core/schemas/internal/fetchCategoryItems";
import { IHubRequestOptions } from "../../../../src";

describe("fetchCategoryItems:", () => {
  it("fetch schemas from org", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.resolve(response);
    });
    const ro = {} as IHubRequestOptions;
    const items = await fetchCategoryItems("orgId", ro);
    expect(spy).toHaveBeenCalled();
    expect(items.length).toBe(1); // expected changed from 3 to 1 because the response is now nested rather than flattened
    expect(items[0].children?.length).toBe(3);
  });

  it("swallows fetch error", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.reject();
    });
    const ro = {} as IHubRequestOptions;
    const items = await fetchCategoryItems("orgId", ro);
    expect(spy).toHaveBeenCalled();
    expect(items.length).toBe(0);
  });
});

const response = {
  categorySchema: [
    {
      title: "Categories",
      categories: [
        {
          title: "Trending",
          categories: [
            { title: "New and noteworthy", categories: [] as any[] },
            { title: "Current events" },
            { title: "New and noteworthy (not)", categories: [] },
          ],
        },
      ],
    },
  ],
};
