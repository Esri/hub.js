import * as REQUEST_MODULE from "@esri/arcgis-rest-request";
import { getCategoryItems } from "../../../../src/core/schemas/internal/getCategoryItems";
import { IHubRequestOptions } from "../../../../src";

describe("getCategoryItems:", () => {
  it("fetch schemas from org", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.resolve(response);
    });
    const ro = {} as IHubRequestOptions;
    const items = await getCategoryItems("orgId", ro);
    expect(spy).toHaveBeenCalled();
    expect(items.length).toBe(3);
  });

  it("swallows fetch error", async () => {
    const spy = spyOn(REQUEST_MODULE, "request").and.callFake(() => {
      return Promise.reject();
    });
    const ro = {} as IHubRequestOptions;
    const items = await getCategoryItems("orgId", ro);
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
