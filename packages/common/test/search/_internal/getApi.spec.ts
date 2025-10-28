import { describe, it, expect } from "vitest";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { getApi } from "../../../src/search/_internal/commonHelpers/getApi";

describe("getApi", () => {
  const targetEntity = "item";
  it("returns 'hub' if the OGC api will be targeted", () => {
    const options = {
      api: "hub",
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toEqual("hub");
  });
  it("returns 'hub' if the discussions api will be targeted", () => {
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("channel", options)).toEqual("hub");
  });
  it("returns 'hub' if the events api will be targeted", () => {
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("event", options)).toEqual("hub");
  });
  it("otherwise returns 'portal'", () => {
    const portal = "https://my-enterprise-server.com/sharing/rest";
    const options = {
      requestOptions: {
        isPortal: true,
        portal,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi(targetEntity, options)).toEqual("portal");
  });
  it("returns 'hub' if targetEntity is discussionPost", () => {
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(getApi("discussionPost", options)).toEqual("hub");
  });
});
