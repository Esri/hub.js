import { getItemThumbnailUrl, IHubRequestOptions } from "../../src";
import * as urlsModule from "../../src/urls";
import { IItem } from "@esri/arcgis-rest-types";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("getItemThumbnailUrl", function() {
  it("computes url when item.thumbnail", function() {
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

    const item: IItem = {
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

    const portalApiUrl = "https://portal-api-url";
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

  it("returns null when no item.thumbnail", function() {
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

    const item: IItem = {
      id: "abcitemid",
      owner: "a",
      tags: ["x"],
      created: 1,
      modified: 1,
      numViews: 1,
      size: 1,
      title: "title",
      type: "CSV"
    };

    const portalApiUrl = "https://portal-api-url";
    const getPortalApiSpy = spyOn(
      urlsModule,
      "getPortalApiUrl"
    ).and.returnValue(portalApiUrl);

    const url = getItemThumbnailUrl(item, ro);

    expect(getPortalApiSpy.calls.count()).toBe(0);
    expect(url).toBeNull();
  });
});
