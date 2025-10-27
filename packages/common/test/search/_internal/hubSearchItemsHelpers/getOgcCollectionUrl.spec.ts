import { describe, it, expect } from "vitest";
import { getOgcCollectionUrl } from "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl";

describe("getOgcCollectionUrl", () => {
  it("returns discussion collection when targetEntity is discussionPost", () => {
    const query: any = { targetEntity: "discussionPost" };
    const options: any = {
      requestOptions: { hubApiUrl: "https://example.hub.arcgis.com" },
    };
    const url = getOgcCollectionUrl(query, options);
    expect(url).toContain("/api/search/v2/collections/discussion-post");
  });

  it("returns all collection for items", () => {
    const query: any = { targetEntity: "item" };
    const options: any = {
      requestOptions: { hubApiUrl: "https://dev.example.com" },
    };
    const url = getOgcCollectionUrl(query, options);
    expect(url).toContain("/api/search/v1/collections/all");
  });
});
