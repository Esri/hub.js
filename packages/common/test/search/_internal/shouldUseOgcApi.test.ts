import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { shouldUseOgcApi } from "../../../src/search/_internal/commonHelpers/shouldUseOgcApi";

describe("shouldUseOgcApi", () => {
  const site = "https://my-site.hub.arcgis-com";
  it("returns false when targetEntity isn't item", () => {
    const targetEntity = "group";
    const options = {
      site,
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeFalsy();
  });

  it("returns false when no siteUrl is provided", () => {
    const targetEntity = "item";
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeFalsy();
  });

  it("returns false when in an enterprise environment", () => {
    const targetEntity = "item";
    const options = {
      site,
      requestOptions: {
        isPortal: true,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeFalsy();
  });

  it("returns true when target entity is 'discussionPost'", () => {
    const targetEntity = "discussionPost";
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeTruthy();
  });

  it("returns true otherwise", () => {
    const targetEntity = "item";
    const options = {
      site,
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeTruthy();
  });
});
