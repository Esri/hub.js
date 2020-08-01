import { getItemThumbnailUrl, IHubRequestOptions } from "../../src";
import * as urlsModule from "../../src/urls";
import { IItem } from "@esri/arcgis-rest-types";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getItemThumbnailUrl", function() {
  const portalApiUrl = "https://portal-api-url";
  let item: IItem;
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
  });
  it("computes url when passed request options", function() {
    const ro: IHubRequestOptions = {
      isPortal: false,
      hubApiUrl: "",
      portalSelf: {
        id: "",
        name: "",
        isPortal: false
      },
      authentication: mockUserSession
    };

    const getPortalApiSpy = spyOn(
      urlsModule,
      "getPortalApiUrl"
    ).and.returnValue(portalApiUrl);

    const url = getItemThumbnailUrl(item, ro);

    expect(getPortalApiSpy.calls.count()).toBe(1);
    expect(url).toBe(
      `https://portal-api-url/content/items/abcitemid/info/thumbnail.png`
    );
  });

  it("computes url when passed portal api url", function() {
    const url = getItemThumbnailUrl(item, portalApiUrl);
    expect(url).toBe(
      `https://portal-api-url/content/items/abcitemid/info/thumbnail.png`
    );
  });

  it("returns null when no item.thumbnail", function() {
    delete item.thumbnail;
    const url = getItemThumbnailUrl(item, portalApiUrl);
    expect(url).toBeNull();
  });
});
