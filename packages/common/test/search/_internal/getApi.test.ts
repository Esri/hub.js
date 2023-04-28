import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { getApi } from "../../../src/search/_internal/commonHelpers/getApi";

describe("getApi", () => {
  const site = "https://my-site.hub.arcgis-com";
  const targetEntity = "item";
  it("returns reference to OGC API if possible", () => {
    const options = {
      site,
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toEqual({
      type: "arcgis-hub",
      url: `${site}/api/search/v1`,
    });
  });
  it("otherwise returns a reference to the Portal API from requestOptions", () => {
    const portal = "https://my-enterprise-server.com/sharing/rest";
    const options = {
      site,
      requestOptions: {
        isPortal: true,
        portal,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toEqual({
      type: "arcgis",
      url: portal,
    });
  });
});
