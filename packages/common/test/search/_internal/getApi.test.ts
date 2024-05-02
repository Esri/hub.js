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
  it("returns reference to OGC API", () => {
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
  it("returns reference to Discussions API", () => {
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
  it("returns reference to Events API if targetEntity is event", () => {
    const options = {
      requestOptions: {
        hubApiUrl,
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("event", options)).toEqual({
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
  it("returns reference to OGC API V2 API if targetEntity is discussionPost", () => {
    const options = {
      site,
      requestOptions: {
        hubApiUrl,
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("discussionPost", options)).toEqual({
      type: "arcgis-hub",
      url: `${hubApiUrl}/api/search/v2`,
    });
  });
});
