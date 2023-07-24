import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { IApiDefinition, NamedApis } from "../../../src/search/types/types";
import { SEARCH_APIS } from "../../../src/search/utils";
import { getApi } from "../../../src/search/_internal/commonHelpers/getApi";

describe("getApi", () => {
  const site = "https://my-site.hub.arcgis.com";
  const hubApiUrl = "https://hub.arcgis.com";
  const targetEntity = "item";
  it("returns the expanded options.api if available", () => {
    const options = {
      api: "hubQA" as NamedApis,
      site,
      requestOptions: {
        hubApiUrl,
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toBe(SEARCH_APIS.hubQA);
  });
  it("otherwise returns reference to OGC API if possible", () => {
    const options = {
      site,
      requestOptions: {
        hubApiUrl,
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toEqual({
      type: "arcgis-hub",
      url: `${hubApiUrl}/api/search/v1`,
    });
  });
  it("otherwise returns reference to Discussions API if possible", () => {
    const options = {
      requestOptions: {
        hubApiUrl,
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("channel", options)).toEqual({
      type: "arcgis-hub",
      url: null,
    } as any as IApiDefinition);
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
