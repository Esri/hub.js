import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";
import { shouldUseDiscussionsApi } from "../../../src/search/_internal/commonHelpers/shouldUseDiscussionsApi";

describe("shouldUseDiscussionsApi", () => {
  it("returns false when targetEntity isn't a channel", () => {
    const targetEntity = "item";
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseDiscussionsApi(targetEntity, options)).toBeFalsy();
  });
  it("returns false when in an enterprise environment", () => {
    const targetEntity = "channel";
    const options = {
      requestOptions: {
        isPortal: true,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseDiscussionsApi(targetEntity, options)).toBeFalsy();
  });
  it("returns true otherwise", () => {
    const targetEntity = "channel";
    const options = {
      requestOptions: {
        isPortal: false,
      },
    } as unknown as IHubSearchOptions;
    expect(shouldUseDiscussionsApi(targetEntity, options)).toBeTruthy();
  });
});
