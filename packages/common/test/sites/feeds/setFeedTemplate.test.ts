import * as legacyFeedsModule from "../../../src/sites/feed-configuration";
import { setFeedTemplate } from "../../../src/sites/feeds/setFeedTemplate";
import {
  IFeedsConfiguration,
  FeedFormat,
} from "../../../src/sites/feeds/types";

describe("setFeedTemplate", () => {
  let setFeedConfigurationSpy: jasmine.Spy;
  beforeEach(() => {
    setFeedConfigurationSpy = spyOn(
      legacyFeedsModule,
      "setFeedConfiguration"
    ).and.callThrough();
  });
  it("delegates to setFeedConfiguration", () => {
    const feedsConfig: IFeedsConfiguration = {};
    const format: FeedFormat = "dcat-us";
    const version = "1.1";
    const updatedTemplate = { foo: "bar" };
    const result = setFeedTemplate({
      feedsConfig,
      format,
      version,
      updatedTemplate,
    });
    expect(result).toEqual({ dcatUS1X: { foo: "bar" } });
    expect(setFeedConfigurationSpy).toHaveBeenCalledTimes(1);
  });
});
