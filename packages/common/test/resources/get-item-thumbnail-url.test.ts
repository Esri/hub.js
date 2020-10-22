import { getItemThumbnailUrl } from "../../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("getItemThumbnailUrl", function() {
  const portalApiUrl = "https://portal-api-url/sharing/rest";
  let item: IItem;
  let itemApiUrlBase: string;

  beforeEach(function() {
    item = {
      id: "abcitemid",
      thumbnail: "thumbnail.png",
      owner: "a",
      tags: ["x"],
      created: 1,
      modified: 1,
      numViews: 1,
      size: 1,
      title: "title",
      type: "CSV"
    };
    itemApiUrlBase = `${portalApiUrl}/content/items/${item.id}`;
  });

  it("computes url without a token", function() {
    const url = getItemThumbnailUrl(item, portalApiUrl);
    expect(url).toBe(`${itemApiUrlBase}/info/thumbnail.png`);
  });

  it("computes url with a token", function() {
    const token = "token";
    const url = getItemThumbnailUrl(item, portalApiUrl, token);
    expect(url).toBe(`${itemApiUrlBase}/info/thumbnail.png?token=${token}`);
  });

  it("returns null when no item.thumbnail", function() {
    delete item.thumbnail;
    const url = getItemThumbnailUrl(item, portalApiUrl);
    expect(url).toBeNull();
  });

  it("computes url with options", function() {
    const token = "token";
    const url = getItemThumbnailUrl(item, portalApiUrl, { token });
    expect(url).toBe(`${itemApiUrlBase}/info/thumbnail.png?token=${token}`);
  });
});
