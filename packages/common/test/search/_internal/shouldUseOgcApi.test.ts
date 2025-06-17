import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { shouldUseOgcApi } from "../../../src/search/_internal/commonHelpers/shouldUseOgcApi";

describe("shouldUseOgcApi", () => {
  it("returns false when targetEntity isn't item", () => {
    const targetEntity = "group";
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

  it("returns false if target entity is 'item' but api is 'portal'", () => {
    const targetEntity = "item";
    const options = {
      api: "portal",
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeFalsy();
  });

  it("returns true target entity is 'item' and api is 'hub'", () => {
    const targetEntity = "item";
    const options = {
      api: "hub",
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseOgcApi(targetEntity, options)).toBeTruthy();
  });
});
