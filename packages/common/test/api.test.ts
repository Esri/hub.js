import { getHubApiUrl } from "../src/api";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("getHubApiUrl", () => {
  let ro: IRequestOptions;
  beforeEach(() => {
    ro = {
      authentication: {
        portal: null,
        getToken() {
          return Promise.resolve("FAKE-TOKEN");
        }
      }
    };
  });

  it("returns undefined for non-AGO URLs", () => {
    ro.authentication.portal = "https://some.portal.com/arcgis/sharing/rest";
    expect(getHubApiUrl(ro)).toBe(undefined);
  });

  it("can retrieve prod base url", () => {
    ro.authentication.portal = "https://something.maps.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url", () => {
    ro.authentication.portal =
      "https://something.mapsqa.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url", () => {
    ro.authentication.portal =
      "https://something.mapsdevext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubdev.arcgis.com");
  });

  it("can retrieve prod base url", () => {
    ro.authentication.portal = "https://www.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url 2", () => {
    ro.authentication.portal = "https://qaext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url 2", () => {
    ro.authentication.portal = "https://devext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubdev.arcgis.com");
  });
});
