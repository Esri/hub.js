import { describe, it, expect, beforeEach } from "vitest";
import { getHubApiUrl } from "../src/api";
import { IHubRequestOptions } from "../src/hub-types";

// Explicit type for request options
interface FakeRequestOptions {
  authentication: {
    portal: string | null;
    getToken: () => Promise<string>;
  };
}

describe("getHubApiUrl", (): void => {
  let ro: FakeRequestOptions;
  beforeEach((): void => {
    ro = {
      authentication: {
        portal: null,
        getToken: (): Promise<string> => Promise.resolve("FAKE-TOKEN"),
      },
    };
  });

  it("returns undefined for non-AGO URLs", (): void => {
    ro.authentication.portal = "https://some.portal.com/arcgis/sharing/rest";
    expect(getHubApiUrl(ro)).toBe(undefined);
  });

  it("can retrieve prod base url", (): void => {
    ro.authentication.portal = "https://something.maps.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url", (): void => {
    ro.authentication.portal =
      "https://something.mapsqa.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url", (): void => {
    ro.authentication.portal =
      "https://something.mapsdevext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubdev.arcgis.com");
  });

  it("can retrieve prod base url (www)", (): void => {
    ro.authentication.portal = "https://www.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hub.arcgis.com");
  });

  it("can retrieve qa base url 2", (): void => {
    ro.authentication.portal = "https://qaext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubqa.arcgis.com");
  });

  it("can retrieve dev base url 2", (): void => {
    ro.authentication.portal = "https://devext.arcgis.com/sharing/rest";
    expect(getHubApiUrl(ro)).toBe("https://hubdev.arcgis.com");
  });

  it("returns existing hubApiUrl on IHubRequestOptions", (): void => {
    const hubApiUrl = "fake.url.com";
    const hro: IHubRequestOptions = { hubApiUrl };
    expect(getHubApiUrl(hro)).toBe(hubApiUrl);
  });
});
