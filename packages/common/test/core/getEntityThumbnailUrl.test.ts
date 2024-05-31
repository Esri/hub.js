import { getEntityThumbnailUrl } from "../../src/core/getEntityThumbnailUrl";
import { HubEntity } from "../../src/core/types";

describe("getEntityThumbnailUrl", () => {
  it("should return the thumbnail URL from the links property", () => {
    const entity = {
      links: {
        thumbnail: "https://example.com/thumbnail.jpg",
      },
    } as HubEntity;
    const thumbnailUrl = getEntityThumbnailUrl(entity);
    expect(thumbnailUrl).toEqual("https://example.com/thumbnail.jpg");
  });

  it("should return the thumbnail URL from the thumbnailUrl property", () => {
    const entity = {
      thumbnailUrl: "https://example.com/thumbnail.jpg",
    } as HubEntity;
    const thumbnailUrl = getEntityThumbnailUrl(entity);
    expect(thumbnailUrl).toEqual("https://example.com/thumbnail.jpg");
  });

  it("should return undefined if no thumbnail URL is found", () => {
    const entity = {} as HubEntity;
    const thumbnailUrl = getEntityThumbnailUrl(entity);
    expect(thumbnailUrl).toBeUndefined();
  });
});
