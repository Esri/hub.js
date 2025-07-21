import { IHubRequestOptions } from "../../../../../src/hub-types";
import { fetchOrgCategories } from "../../../../../src/core/schemas/internal/categories/fetchOrgCategories";
import * as fetchMock from "fetch-mock";

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
  afterEach(() => {
    fetchMock.restore();
  });
  const portal = "https://my-portal.arcgis.com";
  const orgId = "orgId";
  it("fetch schemas from org", async () => {
    fetchMock.once(`${portal}/portals/${orgId}/categorySchema`, {
      status: 200,
      body: response,
    });

    const ro = { portal } as IHubRequestOptions;
    const items = await fetchOrgCategories(orgId, ro);
    expect(fetchMock.calls().length).toBe(1);
    expect(items).toEqual([
      "/Categories/Trending",
      "/Categories/Trending/New and noteworthy",
      "/Categories/Trending/Current events",
      "/Categories/Trending/New and noteworthy (not)",
    ]);
  });

  it("swallows fetch error", async () => {
    fetchMock.once(`${portal}/portals/${orgId}/categorySchema`, {
      throws: new Error("Network error"),
    });
    const ro = { portal } as IHubRequestOptions;
    const items = await fetchOrgCategories(orgId, ro);
    expect(fetchMock.calls().length).toBe(1);
    expect(items.length).toBe(0);
  });
});
